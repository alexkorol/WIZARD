"""Regression tests for provenance and safe history parsing."""
import importlib.util
import json
import pathlib
import sqlite3
import tempfile
import unittest
import zipfile
from contextlib import closing
from argparse import Namespace

spec=importlib.util.spec_from_file_location('collector',pathlib.Path(__file__).parents[1]/'scripts/collect-image-prompts.py')
collector=importlib.util.module_from_spec(spec)
spec.loader.exec_module(collector)


class PromptCollectorTest(unittest.TestCase):
    def test_export_attachment_keeps_bytes_and_reports_missing_files(self):
        with tempfile.TemporaryDirectory() as temp:
            root=pathlib.Path(temp)
            prompt='Equipment prompt\r\nBronze shield, transparent background.\r\n'
            data=[{'id':'equipment','title':'Equipment','mapping':{
                'user':{'message':{'id':'user','author':{'role':'user'},'content':{'parts':['Use the attachment']},'metadata':{'attachments':[
                    {'id':'file-a','name':'Pasted text.txt'},
                    {'id':'file-b','name':'missing.txt'}]}}},
                'image':{'parent':'user','message':{'author':{'role':'assistant'},'content':{'parts':[{'content_type':'image_asset_pointer','asset_pointer':'output'}]}}}
            }}]
            archive=root/'export.zip'
            with zipfile.ZipFile(archive,'w') as z:
                z.writestr('conversations.json',json.dumps(data))
                z.writestr('files/file-a-Pasted text.txt',prompt.encode('utf-8'))
            args=Namespace(output=str(root/'out'),sessions=[],files=[],exclude_session='',merge=False,chatgpt_export=[str(archive)],session_index=[])
            collector.collect(args)
            rows=[json.loads(x) for x in (root/'out/prompts.jsonl').read_text().splitlines()]
            row=next(r for r in rows if r['prompt']==prompt)
            source=row['sources'][0]
            self.assertEqual(source['attachment_id'],'file-a')
            self.assertEqual(source['message_id'],'user')
            self.assertEqual(source['url'],'https://chatgpt.com/c/equipment')
            self.assertTrue(source['byte_exact'])
            self.assertEqual((root/'out/prompts'/(row['id']+'.txt')).read_bytes(),prompt.encode('utf-8'))
            gaps=[json.loads(x) for x in (root/'out/unresolved-attachments.jsonl').read_text().splitlines()]
            self.assertEqual([r['attachment_name'] for r in gaps],['missing.txt'])

    def test_attachment_resolver_rejects_ambiguous_names(self):
        resolve=collector.attachment_resolver(['a/Pasted text.txt','b/Pasted text.txt'],lambda n:self.fail('Ambiguous file read'))
        self.assertIsNone(resolve({'name':'Pasted text.txt'})[0])

    def test_browser_attachments_survive_reimport_and_keep_message_context(self):
        with tempfile.TemporaryDirectory() as temp:
            out=pathlib.Path(temp);web=out/'web-captures';web.mkdir()
            data={'url':'https://chatgpt.com/c/equipment','title':'Equipment','messages':[{
                'role':'user','id':'u','text':'Generate the equipment icons',
                'attachments':[{'name':'Pasted text.txt','text':'Full bronze shield prompt','extraction_method':'attachment_preview_innerText','byte_exact':False},
                               {'name':'Pasted text 2.txt','text':'Full bronze shield prompt','byte_exact':False}]}]}
            (web/'chat.json').write_text(json.dumps(data),encoding='utf-8')
            args=Namespace(output=str(out),sessions=[],files=[],exclude_session='',merge=False,chatgpt_export=[],session_index=[])
            collector.collect(args);args.merge=True;collector.collect(args)
            rows=[json.loads(x) for x in (out/'prompts.jsonl').read_text().splitlines()]
            row=next(r for r in rows if r['prompt']=='Full bronze shield prompt')
            self.assertEqual(len(row['sources']),2)
            self.assertEqual(row['sources'][0]['accompanying_message'],'Generate the equipment icons')
            self.assertFalse(row['sources'][0]['byte_exact'])

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
