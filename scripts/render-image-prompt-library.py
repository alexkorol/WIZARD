"""Build a portable local browser catalog from collected prompts and result evidence."""
import argparse
import json
import pathlib
import shutil
import sqlite3


def render(output):
    out=pathlib.Path(output)
    rows=[json.loads(x) for x in (out/'prompts.jsonl').read_text(encoding='utf-8').splitlines()]
    result_path=out/'results.jsonl'
    results=[json.loads(x) for x in result_path.read_text(encoding='utf-8').splitlines()] if result_path.exists() else []
    by_prompt={r['id']:{} for r in rows}
    for result in results:
        if not result.get('thumbnail') or result.get('hash_mismatch'):continue
        for ident in result['prompt_ids']:
            if ident in by_prompt:
                key=result['sha256']
                old=by_prompt[ident].get(key)
                if old is None or (old['association']!='exact_call' and result['association']=='exact_call'):
                    by_prompt[ident][key]=result
    for row in rows:row['results']=list(by_prompt[row['id']].values())
    result_coverage=json.loads((out/'result-coverage.json').read_text(encoding='utf-8')) if (out/'result-coverage.json').exists() else {'prompts_with_thumbnails':0}
    result_coverage['prompts_with_thumbnails']=sum(bool(r['results']) for r in rows)
    db=sqlite3.connect(out/'prompts.sqlite')
    db.execute('DROP TABLE IF EXISTS result_links')
    db.execute('CREATE TABLE result_links (prompt_id TEXT, image_sha256 TEXT, original_path TEXT, thumbnail TEXT, association TEXT, evidence_json TEXT)')
    db.executemany('INSERT INTO result_links VALUES (?,?,?,?,?,?)',[(r['id'],x['sha256'],x['original_path'],x['thumbnail'],x['association'],json.dumps(x,ensure_ascii=False)) for r in rows for x in r['results']])
    db.commit();db.close()
    data={'prompts':rows,'resultCoverage':result_coverage}
    dist=out/'dist';dist.mkdir(exist_ok=True)
    shutil.copyfile(pathlib.Path(__file__).parent/'image-prompt-library/index.html',dist/'index.html')
    (dist/'data.js').write_text('window.PROMPT_LIBRARY='+json.dumps(data,ensure_ascii=False).replace('<','\\u003c')+';\n',encoding='utf-8')
    hosting=out/'.openai';hosting.mkdir(exist_ok=True)
    (hosting/'hosting.json').write_text(json.dumps({'static':{'directory':'dist'}},indent=2),encoding='utf-8')
    guide=out/'START_HERE.md'
    if guide.exists():
        text=guide.read_text(encoding='utf-8')
        if '[Open thumbnail catalog]' not in text:
            guide.write_text(text.replace('# Image prompt library','# Image prompt library\n\n[Open thumbnail catalog](dist/index.html)',1),encoding='utf-8')
    print(json.dumps({'catalog':str(dist/'index.html'),'prompts':len(rows),'prompts_with_results':sum(bool(r['results']) for r in rows),'data_bytes':(dist/'data.js').stat().st_size},indent=2))


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',required=True)
    render(parser.parse_args().output)
