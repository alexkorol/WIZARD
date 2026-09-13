"""Collect local image prompts without executing historical code or publishing data.

Outputs exact-text deduplicated JSONL, Markdown, and an SQLite FTS index.
Saved prompt files are evidence of authored text, not proof of generation.
"""
import argparse
import collections
import hashlib
import json
import pathlib
import re
import sqlite3
import subprocess
import zipfile
from datetime import datetime, timezone

IMAGE = re.compile(r'image.?gen|pixel.art|sprite|texture|illustration|photoreal|render|inventory|portrait|icon|transparent background|canvas|aspect ratio', re.I)
CALL = re.compile(r'image_gen(?:__|\.)imagegen|imagegen\.text2im|image_gen_redirect|imagegen__imagegen')
LITERAL = re.compile(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|`(?:\\.|[^`\\])*`', re.S)
SKIP = {'node_modules', '.git', '.venv', 'venv', 'site-packages', '__pycache__', 'vendor'}


def import_attachments(attachments, source, add, meta, resolve=None, unresolved=None):
    """Keep attachment text separate from the accompanying message, with evidence."""
    for index, attachment in enumerate(attachments):
        if not isinstance(attachment, dict):
            continue
        name = attachment.get('name', attachment.get('filename', ''))
        mime = attachment.get('mime_type', attachment.get('mimeType', ''))
        if not (str(name).lower().endswith(('.txt', '.md')) or str(mime).startswith('text/')):
            continue
        evidence = {**meta, 'prompt_component': 'attachment', 'attachment_index': index,
                    'attachment_name': name, 'attachment_id': attachment.get('id')}
        text = attachment.get('text')
        details = {'extraction_method': attachment.get('extraction_method', 'inline_attachment_text'),
                   'byte_exact': attachment.get('byte_exact', False)}
        if not isinstance(text, str) and resolve:
            text, details = resolve(attachment)
        if isinstance(text, str) and text.strip():
            add(text, source, 'chatgpt_user_prompt', **evidence, **details)
        elif unresolved is not None:
            unresolved.append({'source': str(source), **evidence, **details,
                               'reason': 'Attachment text unavailable; filename is not a prompt'})


def attachment_resolver(names, read):
    """Resolve only unambiguous text members inside the supplied export."""
    def resolve(attachment):
        filename = str(attachment.get('name', attachment.get('filename', '')))
        ident = attachment.get('id')
        candidates = [n for n in names if pathlib.PurePosixPath(n).name in
                      ({filename, str(ident)+'-'+filename, str(ident)+'_'+filename} if ident else {filename})]
        if len(candidates) != 1:
            return None, {'candidate_count': len(candidates)}
        member = candidates[0]
        try:
            raw = read(member)
            return raw.decode('utf-8-sig'), {'attachment_member': member,
                'attachment_sha256': hashlib.sha256(raw).hexdigest(),
                'extraction_method': 'utf8_attachment_file', 'byte_exact': not raw.startswith(b'\xef\xbb\xbf')}
        except (OSError, UnicodeError, ValueError) as e:
            return None, {'attachment_member': member, 'error': str(e)}
    return resolve


def import_chatgpt(data, source, add, resolve_attachment=None, unresolved=None):
    """Follow exported parent links so alternate branches keep their own prompts."""
    count = 0
    for chat in data:
        mapping = chat.get('mapping', {})
        url = 'https://chatgpt.com/c/' + str(chat.get('id', chat.get('conversation_id', '')))
        selected = set()
        for node_id, node in mapping.items():
            msg = node.get('message') or {}
            role = (msg.get('author') or {}).get('role')
            recipient = str(msg.get('recipient', ''))
            author = str((msg.get('author') or {}).get('name', ''))
            content = msg.get('content') or {}
            image_content = any(isinstance(part,dict) and ('image' in str(part.get('content_type','')) or 'asset_pointer' in part) for part in content.get('parts',[]))
            generation = bool(re.search(r'imagegen|image_gen|dalle|text2im', recipient+' '+author,re.I))
            if role not in ('assistant','tool') or not (image_content or generation):
                continue
            if generation:
                text = strings(content.get('parts', []))
                try:
                    obj = json.loads(text)
                    text = obj.get('prompt',text) if isinstance(obj,dict) else text
                except ValueError:
                    pass
                if text.strip():
                    add(text,source,'chatgpt_generation_prompt',url=url,title=chat.get('title'),message_id=msg.get('id'),timestamp=msg.get('create_time'))
            parent = node.get('parent')
            visited = set()
            while parent and parent in mapping and parent not in visited:
                visited.add(parent)
                ancestor = mapping[parent]
                user = ancestor.get('message') or {}
                if (user.get('author') or {}).get('role') == 'user':
                    selected.add(parent)
                    break
                parent = ancestor.get('parent')
        for node_id in selected:
            msg=mapping[node_id]['message']
            content=msg.get('content') or {}
            text=strings(content.get('parts',[]))
            meta = dict(url=url,title=chat.get('title'),message_id=msg.get('id',node_id),timestamp=msg.get('create_time'),requires_reference_images=any(isinstance(x,dict) and 'image' in str(x.get('content_type','')) for x in content.get('parts',[])))
            add(text,source,'chatgpt_user_prompt',**meta)
            attachments = (msg.get('metadata') or {}).get('attachments', [])
            import_attachments(attachments, source, add, {**meta, 'accompanying_message': text}, resolve_attachment, unresolved)
        count += bool(selected)
    return count


def strings(value):
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return '\n'.join(strings(x) for x in value)
    if isinstance(value, dict):
        return value.get('text', '')
    return ''


def decode_literal(token):
    if token.startswith('"'):
        try:
            return json.loads(token)
        except ValueError:
            pass
    # Preserve unknown JS escapes/interpolation verbatim; never eval history.
    return token[1:-1].replace('\\n', '\n').replace('\\r', '\r').replace('\\t', '\t').replace('\\"', '"').replace("\\'", "'")


def plausible_prompt(text):
    """Exclude file paths and shell/code literals from the candidate shelf."""
    if len(text) < 80 or not IMAGE.search(text):
        return False
    if re.match(r'^(?:[A-Z]:[\\/]|https?://|python\b|node\b|\$[\w]+\s*=|import |const |Get-|if\s*\()',text,re.I):
        return False
    return len(text.split()) >= 12


def collect(args):
    out = pathlib.Path(args.output).resolve()
    out.mkdir(parents=True, exist_ok=True)
    records = {}
    counts = collections.Counter()
    errors = []
    unresolved_attachments = []
    if args.merge and (out/'prompts.jsonl').exists():
        for line in (out/'prompts.jsonl').read_text(encoding='utf-8').splitlines():
            row=json.loads(line)
            row['sources']=[s for s in row['sources'] if not s.get('capture')]
            row['sources']=[s for s in row['sources'] if s['kind']!='codex_invocation_candidate' or plausible_prompt(row['prompt'])]
            if row['sources']:
                records[row['id']]=row
        previous=json.loads((out/'coverage.json').read_text(encoding='utf-8'))
        counts.update(previous.get('counts',{}))
        errors.extend(previous.get('errors',[]))

    def add(prompt, source, kind, **meta):
        if not isinstance(prompt, str) or not prompt.strip():
            return
        # Exact text hash: changes in wording, case and whitespace remain distinct.
        ident = hashlib.sha256(prompt.encode()).hexdigest()
        r = records.setdefault(ident, {'id': ident, 'prompt': prompt, 'sources': []})
        s = {'source': str(source), 'kind': kind, **meta}
        if s not in r['sources']:
            r['sources'].append(s)
            counts[kind] += 1

    def sessions(root):
        files = sorted(pathlib.Path(root).rglob('*.jsonl'))
        counts['session_files_discovered'] += len(files)
        for index, path in enumerate(files):
            if args.exclude_session and args.exclude_session in path.name:
                continue
            latest_user = None
            session_id = path.stem[-36:]
            try:
                with path.open('rb') as f:
                    for lineno, line in enumerate(f, 1):
                        # Check type before decoding potentially huge base64 tool results.
                        head = line[:500]
                        if b'"type":"response_item"' not in head and b'"type": "response_item"' not in head:
                            continue
                        if not any(x in head for x in (b'function_call', b'custom_tool_call', b'"role": "user"', b'"role":"user"')):
                            continue
                        d = json.loads(line)
                        p = d.get('payload', {})
                        if p.get('role') == 'user':
                            msg = strings(p.get('content', []))
                            if not msg.startswith(('# AGENTS.md', '<environment_context>', '<permissions')):
                                latest_user = (msg, lineno, d.get('timestamp'))
                            continue
                        name = p.get('name', '')
                        code = p.get('input', p.get('arguments', ''))
                        if not isinstance(code, str):
                            continue
                        found = []
                        if re.search(r'image.?gen|text2im', name, re.I):
                            try:
                                data = json.loads(code)
                                if isinstance(data, dict) and isinstance(data.get('prompt'), str):
                                    found.append((data['prompt'], 'codex_generation_prompt', {'parameters': {k:v for k,v in data.items() if k != 'prompt'}}))
                            except ValueError:
                                pass
                        elif name in ('exec', 'functions.exec') and CALL.search(code):
                            for m in LITERAL.finditer(code):
                                v = decode_literal(m.group())
                                if plausible_prompt(v):
                                    preceding = code[max(0, m.start()-35):m.start()]
                                    literal_key = bool(re.search(r'(?:prompt|"prompt"|\'prompt\')\s*:\s*$', preceding))
                                    kind = 'codex_generation_prompt' if literal_key and '${' not in v else 'codex_invocation_candidate'
                                    found.append((v, kind, {'requires_review': kind.endswith('candidate')}))
                            if not found:
                                counts['unresolved_image_calls'] += 1
                                unresolved.write(json.dumps({'source':str(path),'line':lineno,'code':code}, ensure_ascii=False)+'\n')
                        for prompt, kind, meta in found:
                            add(prompt, path, kind, line=lineno, timestamp=d.get('timestamp'), session_id=session_id, call_id=p.get('call_id'), **meta)
                        if found and latest_user:
                            msg, userline, stamp = latest_user
                            if msg.strip() and '<INSTRUCTIONS>' not in msg:
                                add(msg, path, 'codex_user_context', line=userline, timestamp=stamp, session_id=session_id)
                counts['session_files_scanned'] += 1
            except (OSError, ValueError) as e:
                errors.append({'source': str(path), 'error': str(e)})
            if index % 100 == 0:
                print(f'Sessions {index}/{len(files)}; unique texts {len(records)}', flush=True)

    def json_prompts(data, source, pointer='$'):
        if isinstance(data, dict):
            if isinstance(data.get('text'),str) and 'revised_prompt' in str(data.get('kind','')):
                add(data['text'],source,'archived_revised_prompt',pointer=pointer+'.text',archived_prompt_id=data.get('prompt_id'),original_user_wording=False)
            for key, val in data.items():
                if key.lower() in ('prompt','positive_prompt','negative_prompt','revised_prompt','image_prompt','generation_prompt') and isinstance(val,str) and len(val)>25:
                    if IMAGE.search(val) or IMAGE.search(str(source)):
                        add(val, source, 'saved_prompt_field', pointer=pointer+'.'+key, prompt_role=key, usage_verified=False)
                elif isinstance(val, (dict,list)):
                    json_prompts(val, source, pointer+'.'+key)
        elif isinstance(data, list):
            for i, val in enumerate(data):
                json_prompts(val, source, f'{pointer}[{i}]')

    with (out/'unresolved-calls.jsonl').open('a' if args.merge else 'w',encoding='utf-8') as unresolved:
        for root in args.sessions:
            sessions(root)
    for root in args.files:
        command=['rg','--files','--hidden','--no-ignore']
        for directory in SKIP:
            command.extend(['-g',f'!**/{directory}/**'])
        command.extend(['-g','*.txt','-g','*.md','-g','*.json','-g','*.jsonl',str(root)])
        result = subprocess.run(command,capture_output=True,text=True,encoding='utf-8',errors='replace')
        if result.returncode not in (0,1):
            errors.append({'source':root,'error':result.stderr})
        for name in result.stdout.splitlines():
            p = pathlib.Path(name)
            if SKIP.intersection(p.parts) or out == p or out in p.parents:
                continue
            if p.suffix.lower() not in ('.txt','.md','.json','.jsonl'):
                continue
            if p.name in ('AGENTS.md','SKILL.md','package-lock.json'):
                continue
            try:
                if p.stat().st_size > 20_000_000:
                    continue
                is_prompt = 'prompt' in str(p).lower()
                if not is_prompt and p.suffix not in ('.json','.jsonl'):
                    continue
                text = p.read_text(encoding='utf-8-sig',errors='replace')
                counts['local_text_files_scanned'] += 1
                if p.suffix == '.json':
                    if re.search(r'"(?:prompt|prompt_id|positive_prompt|negative_prompt|revised_prompt|image_prompt|generation_prompt)"\s*:',text):
                        json_prompts(json.loads(text), p)
                elif p.suffix == '.jsonl':
                    for i, line in enumerate(text.splitlines(),1):
                        try: json_prompts(json.loads(line),p,f'line:{i}')
                        except ValueError: pass
                elif is_prompt and IMAGE.search(text):
                    # Explicit pack separators preserve independently reusable blocks.
                    blocks = re.split(r'(?m)^----- (.+?) -----\s*$', text)
                    if len(blocks)>1:
                        for i in range(1,len(blocks)-1,2):
                            body = blocks[i+1].split('========================================================================')[0].strip()
                            if IMAGE.search(body):
                                add(body,p,'saved_prompt_file',title=blocks[i],usage_verified=False)
                    else:
                        add(text,p,'saved_prompt_file',usage_verified=False)
            except (OSError,ValueError) as e:
                errors.append({'source':str(p),'error':str(e)})
    for name in args.chatgpt_export:
        p=pathlib.Path(name)
        if zipfile.is_zipfile(p):
            with zipfile.ZipFile(p) as z:
                member=next(n for n in z.namelist() if n.rsplit('/',1)[-1]=='conversations.json')
                data=json.loads(z.read(member))
                counts['chatgpt_export_image_conversations'] += import_chatgpt(data,p,add,attachment_resolver(z.namelist(),z.read),unresolved_attachments)
        else:
            data=json.loads(p.read_text(encoding='utf-8-sig'))
            members={str(x.relative_to(p.parent).as_posix()):x for x in p.parent.rglob('*') if x.is_file() and x.suffix.lower() in ('.txt','.md') and x.resolve().is_relative_to(p.parent.resolve())}
            counts['chatgpt_export_image_conversations'] += import_chatgpt(data,p,add,attachment_resolver(members,lambda n:members[n].read_bytes()),unresolved_attachments)
    # Browser captures contain only visible DOM-backed message text.
    web = out/'web-captures'
    for p in sorted(web.glob('*.json')) if web.exists() else []:
        data=json.loads(p.read_text(encoding='utf-8'))
        for i, m in enumerate(data.get('messages', [])):
            if m.get('role') == 'user':
                kind='chatgpt_user_prompt' if len(m['text'])>80 and IMAGE.search(m['text']) else 'chatgpt_user_context'
                add(m['text'],data['url'],kind,title=data.get('title'),message_index=i, message_id=m.get('id'),capture=str(p), image_evidence=data.get('images',[]))
                import_attachments(m.get('attachments',[]),data['url'],add,
                    dict(url=data['url'],title=data.get('title'),message_index=i,message_id=m.get('id'),capture=str(p),
                         accompanying_message=m['text'],reference_images=m.get('reference_images',[]),captured_at=data.get('captured_at'),
                         image_evidence=m.get('images',data.get('images',[]))),unresolved=unresolved_attachments)
        counts['chatgpt_conversations_captured'] += 1
    rows=list(records.values())
    task_titles={}
    for name in args.session_index:
        with pathlib.Path(name).open(encoding='utf-8') as f:
            for line in f:
                entry=json.loads(line)
                task_titles[entry['id']]=entry.get('thread_name')
    for row in rows:
        unique={}
        for source in row['sources']:
            if source.get('session_id') in task_titles:
                source['task_title']=task_titles[source['session_id']]
            key=tuple(source.get(k) for k in ('source','kind','line','pointer','call_id','message_id','message_index','attachment_index'))
            unique.setdefault(key,{}).update(source)
        row['sources']=list(unique.values())
    # Recount evidence, avoiding inflated counts when a source is imported again.
    evidence_counts=collections.Counter(s['kind'] for r in rows for s in r['sources'])
    for key in list(counts):
        if key.startswith(('codex_','saved_','chatgpt_user_','chatgpt_generation_','archived_revised_')):
            del counts[key]
    counts.update(evidence_counts)
    counts['chatgpt_attachment_prompts']=sum(s.get('prompt_component')=='attachment' for r in rows for s in r['sources'])
    # Merge gaps from exports not supplied on this run; rechecked sources replace their old gaps.
    gaps_path=out/'unresolved-attachments.jsonl'
    if args.merge and gaps_path.exists():
        rechecked={str(pathlib.Path(n)) for n in args.chatgpt_export}
        unresolved_attachments += [r for r in map(json.loads,gaps_path.read_text(encoding='utf-8').splitlines()) if r['source'] not in rechecked and not r.get('capture')]
    unresolved_attachments=list({json.dumps(r,sort_keys=True):r for r in unresolved_attachments}.values())
    gaps_path.write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in unresolved_attachments),encoding='utf-8')
    counts['unresolved_text_attachments']=len(unresolved_attachments)
    counts['chatgpt_conversations_captured']=len([p for p in web.glob('*.json') if 'messages' in json.loads(p.read_text(encoding='utf-8'))]) if web.exists() else 0
    with (out/'prompts.jsonl').open('w',encoding='utf-8') as f:
        for row in rows: f.write(json.dumps(row,ensure_ascii=False)+'\n')
    db=sqlite3.connect(out/'prompts.sqlite')
    db.execute('DROP TABLE IF EXISTS prompts')
    db.execute('CREATE VIRTUAL TABLE prompts USING fts5(id UNINDEXED, prompt, sources)')
    db.executemany('INSERT INTO prompts VALUES (?,?,?)',[(r['id'],r['prompt'],json.dumps(r['sources'],ensure_ascii=False)) for r in rows])
    db.commit();db.close()
    report={'generated_at':datetime.now(timezone.utc).isoformat(),'unique_texts':len(rows),'counts':dict(counts),'errors':errors,'scope':vars(args),'prior_scope':previous.get('scope') if args.merge and 'previous' in locals() else None,'limitations':['Local scan includes available session archives and specified file roots; deleted or remote-only histories are not recoverable here.','Invocation candidates may be fragments, templates, or dynamic prompt inputs; they are not verified final tool arguments.','Saved prompt files and fields prove authored wording, not that generation ran.','User context includes the preceding request; it may require earlier conversation or attached images.','ChatGPT coverage is limited to captured conversations or supplied exports. No claim of account-wide completeness.','Exact text duplicates are merged; near duplicates and revisions remain separate.']}
    report['schema_version']=1
    if args.merge and 'previous' in locals():
        report['scan_history']=previous.get('scan_history',[previous.get('scope',{})])+[vars(args)]
        if previous.get('collection_note'):report['collection_note']=previous['collection_note']
    (out/'coverage.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    with (out/'LIBRARY.md').open('w',encoding='utf-8') as f:
        f.write('# Image prompt library\n\nLocal collection; original text preserved. See coverage.json for scope and gaps.\n\n')
        f.write(f'{len(rows):,} unique texts. Search this file with Ctrl+F, or query prompts.sqlite using FTS5.\n\n')
        for r in rows:
            title=next((s.get('title') for s in r['sources'] if s.get('title')),None) or re.sub(r'\s+',' ',r['prompt'])[:95]
            f.write(f"## {title}\n\nID: {r['id'][:16]}\n\n")
            for s in r['sources']:
                f.write(f"- {s['kind']}: {s['source']}"+(f":{s['line']}" if s.get('line') else '')+'\n')
            f.write('\n'+r['prompt']+'\n\n---\n\n')
    write_shelves(out,rows,report)
    print(json.dumps({'unique_texts':len(rows),'counts':dict(counts),'errors':len(errors),'output':str(out)},indent=2))


def write_shelves(out,rows,report):
    shelves={
        'generation-prompts':('Generation prompts',{'codex_generation_prompt','chatgpt_generation_prompt'}),
        'revised-prompts':('Archived revised prompts',{'archived_revised_prompt'}),
        'chatgpt-requests':('ChatGPT requests',{'chatgpt_user_prompt'}),
        'saved-prompts':('Saved prompt files',{'saved_prompt_file','saved_prompt_field'}),
        'context-and-candidates':('Context and candidates',{'codex_user_context','chatgpt_user_context','codex_invocation_candidate'}),
    }
    folder=out/'prompts';folder.mkdir(exist_ok=True)
    catalog=out/'catalog';catalog.mkdir(exist_ok=True)
    for r in rows:
        (folder/(r['id']+'.txt')).write_bytes(r['prompt'].encode('utf-8'))
    index=['# Image prompt library','','Original wording collected from Codex, saved files, and available ChatGPT conversations.','',f"**{len(rows):,} distinct texts**, with exact duplicates grouped and source records retained.",'','## Browse','']
    for slug,(label,kinds) in shelves.items():
        chosen=[r for r in rows if kinds.intersection(s['kind'] for s in r['sources'])]
        content=[f'# {label}','','Search this file with Ctrl+F. Each entry links to its exact reusable text.','']
        for r in chosen:
            title=next((s.get('title') for s in r['sources'] if s.get('title')),None) or re.sub(r'\s+',' ',r['prompt'])[:100]
            title=title.replace('[','(').replace(']',')')
            content += [f"## {title}",'',f"[Open prompt text](../prompts/{r['id']}.txt)",'']
            for s in r['sources']:
                target=s.get('url',s['source'])
                content.append(f"- {s['kind']}: {target}"+(f":{s['line']}" if s.get('line') else ''))
            fence='`'*(max([len(x) for x in re.findall(r'`+',r['prompt'])] or [2])+1)
            content += ['',fence+'text',r['prompt'],fence,'']
        (catalog/(slug+'.md')).write_text('\n'.join(content),encoding='utf-8')
        index += [f'- [{label}](catalog/{slug}.md) — {len(chosen):,} distinct texts.']
    index += ['','Shelves overlap when the same wording has more than one kind of evidence. Saved files do not by themselves prove that generation ran. Candidates need review; user context may depend on earlier turns or attached images.','','## Reuse and search','','- Copy any file in `prompts/` directly into a local image workflow.','- `prompts.jsonl` contains original text plus provenance for batch workflows.','- `prompts.sqlite` provides full-text search. Example: `SELECT id, prompt FROM prompts WHERE prompts MATCH \'bronze AND shield\' LIMIT 20;`','- `coverage.json` records scope, errors, and unresolved calls.','','## Coverage','','The local scan covers the available Codex active and archived sessions and the file roots recorded in coverage.json. ChatGPT coverage is limited to the conversations captured in web-captures and any supplied account exports. The exact imported conversation count is recorded in coverage.json. Additional exports may be needed for older conversations and other revisions.','','Original reference images are not bundled; use source links and recorded reference paths to recover them. A text-only rerun may not reproduce an edit that depended on those images.','','## Add a ChatGPT export','','Run the collector with `--merge --output "<this folder>" --chatgpt-export "<conversations.json or export.zip>"`. It follows conversation branches and selects requests associated with image-generation messages.','','The collection is stored locally; it has not been uploaded or published.']
    (out/'START_HERE.md').write_text('\n'.join(index)+'\n',encoding='utf-8')


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',required=True)
    parser.add_argument('--sessions',action='append',default=[])
    parser.add_argument('--files',action='append',default=[])
    parser.add_argument('--exclude-session',default='')
    parser.add_argument('--merge',action='store_true',help='Merge new sources into an existing local collection')
    parser.add_argument('--chatgpt-export',action='append',default=[],help='conversations.json or a ChatGPT export ZIP')
    parser.add_argument('--session-index',action='append',default=[],help='Optional Codex session_index.jsonl to add task titles')
    collect(parser.parse_args())
