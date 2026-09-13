"""Regression tests for provenance and safe history parsing."""
import importlib.util
import json
import pathlib
import sqlite3
import tempfile
import unittest
from contextlib import closing
from argparse import Namespace

spec=importlib.util.spec_from_file_location('collector',pathlib.Path(__file__).parents[1]/'scripts/collect-image-prompts.py')
collector=importlib.util.module_from_spec(spec)
spec.loader.exec_module(collector)


class PromptCollectorTest(unittest.TestCase):
    def test_export_follows_branch_parent_and_ignores_unrelated_chat(self):
        def node(role, parts, parent=None, **extra):
            return {'parent':parent,'message':{'author':{'role':role},'content':{'parts':parts},**extra}}
        data=[{'id':'chat','title':'Two image branches','mapping':{
            'u1':node('user',['Draw a bronze shield']),
            'u2':node('user',['Draw a copper bowl']),
            'u3':node('user',['Unrelated private conversation']),
            'a1':node('assistant',[{'content_type':'image_asset_pointer','asset_pointer':'image1'}],'u1'),
            'a2':node('assistant',['{"prompt":"A copper bowl on black"}'],'u2',recipient='imagegen.text2im'),
            'a3':node('assistant',['Plain text reply'],'u3'),
        }}]
        found=[]
        count=collector.import_chatgpt(data,'export.json',lambda p,s,k,**m:found.append((p,k,m)))
        self.assertEqual(count,1)
        self.assertEqual({x[0] for x in found},{'Draw a bronze shield','Draw a copper bowl','A copper bowl on black'})
        self.assertTrue(all(x[2]['url']=='https://chatgpt.com/c/chat' for x in found))

    def test_exact_dedup_preserves_sources_and_reference_parameters(self):
        with tempfile.TemporaryDirectory() as temp:
            root=pathlib.Path(temp)
            sessions=root/'sessions';sessions.mkdir()
            prompt='A bronze shield, isolated pixel art.\r\nOn a transparent background.'
            rows=[]
            for i in range(2):
                rows.append({'type':'response_item','payload':{'type':'function_call','name':'image_gen.imagegen','call_id':str(i),'arguments':json.dumps({'prompt':prompt,'referenced_image_paths':['reference.png']})}})
            (sessions/'rollout.jsonl').write_text('\n'.join(json.dumps(x) for x in rows),encoding='utf-8')
            args=Namespace(output=str(root/'out'),sessions=[str(sessions)],files=[],exclude_session='',merge=False,chatgpt_export=[],session_index=[])
            collector.collect(args)
            records=[json.loads(x) for x in (root/'out/prompts.jsonl').read_text().splitlines()]
            self.assertEqual(len(records),1)
            self.assertEqual(len(records[0]['sources']),2)
            self.assertEqual((root/'out/prompts'/(records[0]['id']+'.txt')).read_bytes(),prompt.encode('utf-8'))
            self.assertEqual(records[0]['sources'][0]['parameters']['referenced_image_paths'],['reference.png'])
            with closing(sqlite3.connect(root/'out/prompts.sqlite')) as db:
                self.assertEqual(db.execute("SELECT count(*) FROM prompts WHERE prompts MATCH 'bronze'").fetchone()[0],1)
            args.merge=True;args.sessions=[]
            collector.collect(args)
            self.assertEqual(len((root/'out/prompts.jsonl').read_text().splitlines()),1)

    def test_template_interpolation_is_not_executed(self):
        token='`Make a sprite of ${dangerousFunction()} with sharp edges`'
        self.assertIn('${dangerousFunction()}',collector.decode_literal(token))


if __name__=='__main__':
    unittest.main()
