from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
prompts=json.loads((R/'imagegen-prompts.json').read_text());prompts['status']='completed: one built-in call per figure';(R/'imagegen-prompts.json').write_text(json.dumps(prompts,indent=2))
record={'tool':'built-in image_gen.imagegen','calls':2,'date':'2026-09-13','supplied_smooth_blender_render':False,'outputs':{}}
ids={'female':'exec-aae8fbb1-7b45-4faf-abf9-29ebb45e2153.png','male':'exec-c9d69004-3c79-46d6-9e91-cbf316a44fe4.png'}
for sex in ['female','male']:
    record['outputs'][sex]={'original_tool_filename':ids[sex],'saved_original':f'generated/{sex}-original.png','original_sha256':sha(R/'generated'/f'{sex}-original.png'),'structural_input':f'guides/{sex}-input-8x.png','structural_input_sha256':sha(R/'guides'/f'{sex}-input-8x.png'),'style_reference':'../player-unarmed-v01/references-local/amazon-style-crop.png','style_reference_sha256':sha(R.parent/'player-unarmed-v01/references-local/amazon-style-crop.png'),'prompt_record':'imagegen-prompts.json','normalized_output':f'normalized/{sex}-32x64.png','normalized_sha256':sha(R/'normalized'/f'{sex}-32x64.png')}
record['outputs']['female']['owner_reference_sha256']=sha(R/'references-local/owner-silhouette-reference.png')
(R/'imagegen-execution.json').write_text(json.dumps(record,indent=2))
print('Recorded exact input and output hashes for both completed imagegen calls.')
