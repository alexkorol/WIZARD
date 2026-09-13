"""Link historical image results by tool call/cell id and create local thumbnails.

Only uses returned generation paths, never filename similarity or timestamps.
Requires Pillow for thumbnail creation. Original files are never modified.
"""
import argparse
import collections
import hashlib
import json
import pathlib
import re
import subprocess
import csv
from PIL import Image, ImageOps

PREFIX = r'^.{0,250}"type"\s*:\s*"(?:custom_tool_call_output|function_call_output|function_call)"[^\r\n]{0,650}'
RESULT = r'generated_images[\\/]+[a-fA-F0-9-]{36}[\\/]+[^"\\/ \r\n]+\.(?:png|jpg|jpeg|webp)'
CELL = r'Script running with cell ID [a-zA-Z0-9_-]+'


def manifest_links(records, paths):
    ids={r['id'] for r in records}
    file_prompts=collections.defaultdict(set)
    for row in records:
        for source in row['sources']:
            if source['kind']=='saved_prompt_file':
                file_prompts[str(pathlib.Path(source['source'])).casefold()].add(row['id'])
    result=[]
    def visit(obj,source,pointer='$'):
        if isinstance(obj,list):
            for i,item in enumerate(obj):visit(item,source,f'{pointer}[{i}]')
            return
        if not isinstance(obj,dict):return
        prompt_ids=set()
        for key in ('prompt','revised_prompt','generation_prompt'):
            if isinstance(obj.get(key),str):
                digest=hashlib.sha256(obj[key].encode()).hexdigest()
                if digest in ids:prompt_ids.add(digest)
        prov=obj.get('provenance') or {}
        if not isinstance(prov,dict):prov={}
        ident=str(obj.get('prompt_id') or prov.get('prompt_id') or '').removeprefix('sha256:')
        if ident in ids:prompt_ids.add(ident)
        if isinstance(obj.get('prompt_path'),str):
            prompt_ids.update(file_prompts.get(str(pathlib.Path(obj['prompt_path'])).casefold(),set()))
        if prompt_ids:
            output_paths=[]
            for key in ('output_path','output_hint','generated_path','generated_image_path'):
                value=obj.get(key)
                if isinstance(value,str):
                    absolute=re.findall(r'[A-Za-z]:[\\/][^\r\n"<>]*?\.(?:png|jpe?g|webp)',value,re.I)
                    output_paths.extend(absolute or ([value] if re.search(r'\.(png|jpe?g|webp)$',value,re.I) else []))
            image_file=obj.get('file') or {}
            if isinstance(image_file,dict) and image_file.get('absolute_path_at_recovery'):
                output_paths.append(image_file['absolute_path_at_recovery'])
            if prov.get('retained_source_path'):output_paths.append(prov['retained_source_path'])
            for value in set(output_paths):
                value=re.sub(r'\\+','/',value)
                path=pathlib.Path(value)
                if not path.is_absolute():
                    candidates={str((parent/path).resolve()) for parent in list(source.parents)[:6] if (parent/path).is_file()}
                    if len(candidates)!=1:continue
                    path=pathlib.Path(next(iter(candidates)))
                entry={'prompt_ids':sorted(prompt_ids),'original_path':str(path),'association':'manifest_mapping','manifest_path':str(source),'manifest_pointer':pointer,'manifest_status':obj.get('status'),'reference_inputs':{k:v for k,v in obj.items() if k in ('references','external_references','referenced_image_paths','reference_paths','num_last_images_to_include')},'archived_provenance':prov}
                if isinstance(image_file,dict) and image_file.get('sha256'):entry['expected_sha256']=image_file['sha256']
                result.append(entry)
        for key,value in obj.items():
            if isinstance(value,(dict,list)):visit(value,source,pointer+'.'+key)
    for name in paths:
        path=pathlib.Path(name)
        try:
            if path.suffix.lower() in ('.csv','.tsv'):
                with path.open(encoding='utf-8-sig',newline='') as f:
                    visit(list(csv.DictReader(f,delimiter='\t' if path.suffix=='.tsv' else ',')),path)
            elif path.suffix=='.jsonl':
                with path.open(encoding='utf-8-sig') as f:
                    for i,line in enumerate(f,1):
                        try:visit(json.loads(line),path,f'line:{i}')
                        except ValueError:pass
            elif path.suffix=='.json':visit(json.loads(path.read_text(encoding='utf-8-sig')),path)
        except (OSError,ValueError):continue
    return result


def link(output, generated_root, manifests_only=False, manifests=()):
    out=pathlib.Path(output)
    records=[json.loads(x) for x in (out/'prompts.jsonl').read_text(encoding='utf-8').splitlines()]
    calls=collections.defaultdict(lambda:collections.defaultdict(set))
    for row in records:
        for source in row['sources']:
            if source.get('call_id') and source['kind'] in ('codex_generation_prompt','codex_invocation_candidate'):
                calls[source['source']][source['call_id']].add(row['id'])
    paths=[] if manifests_only else list(calls)
    linked=[json.loads(x) for x in (out/'results.jsonl').read_text(encoding='utf-8').splitlines()] if manifests_only and (out/'results.jsonl').exists() else []
    errors=[]
    for start in range(0,len(paths),30):
        command=['rg','--no-heading','--with-filename','--line-number','--only-matching','--color','never','-e',PREFIX,'-e',RESULT,'-e',CELL,*paths[start:start+30]]
        process=subprocess.run(command,capture_output=True,text=True,encoding='utf-8',errors='replace')
        if process.returncode not in (0,1):errors.append(process.stderr)
        lines=collections.defaultdict(lambda:collections.defaultdict(list))
        for match in process.stdout.splitlines():
            m=re.match(r'^(.*\.jsonl):(\d+):(.*)$',match)
            if m:lines[m[1]][int(m[2])].append(m[3])
        for path, entries in lines.items():
            # Normalize the path returned by rg on Windows.
            root_calls=calls.get(path) or calls.get(str(pathlib.Path(path)))
            if not root_calls:continue
            owners={call:call for call in root_calls}
            cells={}
            for number, chunks in sorted(entries.items()):
                text='\n'.join(chunks)
                call=re.search(r'"call_id"\s*:\s*"([^"\\]+)"',text)
                if not call:continue
                call_id=call.group(1)
                is_wait=bool(re.search(r'"name"\s*:\s*"(?:functions\.)?wait"',text))
                if is_wait:
                    cell=re.search(r'\\"cell_id\\"\s*:\s*\\"([^"\\]+)\\"',text)
                    if cell and cell.group(1) in cells:owners[call_id]=cells[cell.group(1)]
                if call_id not in owners or not re.search(r'"(?:custom_tool_call_output|function_call_output)"',text):continue
                owner=owners[call_id]
                running=re.search(CELL,text)
                if running:cells[running.group().split()[-1]]=owner
                files=set(re.findall(RESULT,text))
                for file in files:
                    relative=re.sub(r'[\\/]+','/',file).split('/',1)[1]
                    source=pathlib.Path(generated_root)/relative
                    linked.append({'prompt_ids':sorted(root_calls[owner]),'call_id':owner,'returned_by_call_id':call_id,'source_log':path,'output_line':number,'original_path':str(source),'association':'exact_call' if len(root_calls[owner])==1 else 'batch_call'})
        print(f'Result records: {len(linked)}; scanned {min(start+30,len(paths))}/{len(paths)} logs',flush=True)
    if manifests_only:
        manifests=set(manifests)|{s['source'] for r in records for s in r['sources'] if s['kind']=='saved_prompt_field'}
        linked.extend(manifest_links(records,manifests))
        linked=list({json.dumps(r,sort_keys=True):r for r in linked}.values())
        print(f'Manifest and call associations: {len(linked)}',flush=True)
    thumbs=out/'thumbnails';thumbs.mkdir(exist_ok=True)
    images={};missing=set()
    for index,result in enumerate(linked):
        source=pathlib.Path(result['original_path'])
        if not source.is_file():
            result['exists']=False;missing.add(str(source));continue
        result['exists']=True
        if str(source) not in images:
            try:
                with source.open('rb') as f:digest=hashlib.file_digest(f,'sha256').hexdigest()
                if result.get('expected_sha256') and digest!=result['expected_sha256']:
                    result['hash_mismatch']=True
                    errors.append({'source':str(source),'error':'Image hash differs from archived manifest; association not displayed'})
                    continue
                with Image.open(source) as original:
                    dimensions=list(original.size)
                    image=ImageOps.exif_transpose(original).convert('RGBA')
                    image.thumbnail((320,320),Image.Resampling.LANCZOS)
                    thumbnail=thumbs/(digest+'.webp')
                    if not thumbnail.exists():image.save(thumbnail,'WEBP',lossless=True)
                images[str(source)]={'sha256':digest,'width':dimensions[0],'height':dimensions[1],'thumbnail':'thumbnails/'+digest+'.webp'}
            except (OSError,ValueError) as e:
                errors.append({'source':str(source),'error':str(e)});continue
        if result.get('expected_sha256') and images[str(source)]['sha256']!=result['expected_sha256']:
            result['hash_mismatch']=True
            result.pop('thumbnail',None)
            errors.append({'source':str(source),'error':'Image hash differs from archived manifest; association not displayed'})
            continue
        result.update(images[str(source)])
        if result.get('expected_sha256'):result['hash_verified']=result['sha256']==result['expected_sha256']
        if index%200==0:print(f'Thumbnails {index}/{len(linked)}',flush=True)
    (out/'results.jsonl').write_text(''.join(json.dumps(x,ensure_ascii=False)+'\n' for x in linked),encoding='utf-8')
    report={'associations':len(linked),'unique_original_files':len(images),'unique_thumbnails':len({v['sha256'] for v in images.values()}),'prompts_with_thumbnails':len({p for r in linked if r.get('thumbnail') and not r.get('hash_mismatch') for p in r['prompt_ids']}),'missing_original_files':len(missing),'errors':errors,'method':'Returned generated_images paths linked through tool call IDs and functions.wait cell IDs; explicit saved manifest mappings also retained with their provenance. Batch calls explicitly labelled. No inferred filename or timestamp pairing.'}
    (out/'result-coverage.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2))


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',required=True)
    parser.add_argument('--generated-root',required=True)
    parser.add_argument('--manifests-only',action='store_true',help='Extend existing call links from saved prompt manifests without rescanning logs')
    parser.add_argument('--manifest',action='append',default=[])
    args=parser.parse_args()
    link(args.output,args.generated_root,args.manifests_only,args.manifest)
