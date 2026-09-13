import hashlib
import importlib.util
import json
import pathlib
import tempfile
import unittest
from PIL import Image

spec=importlib.util.spec_from_file_location('linker',pathlib.Path(__file__).parents[1]/'scripts/link-image-prompt-results.py')
linker=importlib.util.module_from_spec(spec);spec.loader.exec_module(linker)


class ImageProvenanceTest(unittest.TestCase):
    def test_wait_cell_links_only_the_owning_generation(self):
        with tempfile.TemporaryDirectory() as temp:
            root=pathlib.Path(temp);out=root/'out';out.mkdir()
            generated=root/'generated_images';folder=generated/'11111111-1111-1111-1111-111111111111';folder.mkdir(parents=True)
            result=folder/'exec-test.png';Image.new('RGB',(8,12),'green').save(result)
            log=root/'history.jsonl'
            rows=[
                {'type':'custom_tool_call_output','call_id':'generation','output':'Script running with cell ID 123'},
                {'type':'function_call','name':'wait','arguments':json.dumps({'cell_id':'123'}),'call_id':'waiting'},
                {'type':'function_call_output','call_id':'unrelated','output':'Some other output'},
                {'type':'function_call_output','call_id':'waiting','output':f'Saved as {result} by default.'},
            ]
            log.write_text('\n'.join(json.dumps({'type':'response_item','payload':x}) for x in rows),encoding='utf-8')
            (out/'prompts.jsonl').write_text(json.dumps({'id':'prompt','prompt':'A green sprite','sources':[{'source':str(log),'kind':'codex_generation_prompt','call_id':'generation'}]})+'\n',encoding='utf-8')
            linker.link(out,generated)
            links=[json.loads(x) for x in (out/'results.jsonl').read_text().splitlines()]
            self.assertEqual(len(links),1)
            self.assertEqual(links[0]['returned_by_call_id'],'waiting')
            self.assertEqual(links[0]['prompt_ids'],['prompt'])
            self.assertEqual(links[0]['sha256'],hashlib.sha256(result.read_bytes()).hexdigest())
            self.assertTrue((out/links[0]['thumbnail']).is_file())
            manifest=root/'manifest.json'
            manifest.write_text(json.dumps({'provenance':{'prompt_id':'sha256:prompt'},'file':{'absolute_path_at_recovery':str(result),'sha256':'0'*64}}))
            linker.link(out,generated,True,[str(manifest)])
            merged=[json.loads(x) for x in (out/'results.jsonl').read_text().splitlines()]
            rejected=[x for x in merged if x.get('expected_sha256')]
            self.assertTrue(rejected[0]['hash_mismatch'])
            self.assertNotIn('thumbnail',rejected[0])

    def test_manifest_mapping_does_not_use_reference_as_output(self):
        with tempfile.TemporaryDirectory() as temp:
            root=pathlib.Path(temp)
            prompt='Draw a bronze bowl';ident=hashlib.sha256(prompt.encode()).hexdigest()
            p=root/'manifest.json'
            p.write_text(json.dumps({'prompt':prompt,'output_path':str(root/'result.png'),'references':[str(root/'input.png')]}))
            links=linker.manifest_links([{'id':ident,'sources':[]}],[str(p)])
            self.assertEqual(len(links),1)
            self.assertTrue(links[0]['original_path'].endswith('result.png'))
            self.assertIn('references',links[0]['reference_inputs'])


if __name__=='__main__':unittest.main()
