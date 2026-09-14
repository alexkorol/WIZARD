"""Separate pixel/file integrity, animation registration and game acceptance."""
from pathlib import Path
import json, hashlib, sys
import numpy as np
from PIL import Image
from scipy.ndimage import label
from register_frames import torso_x
R=Path(__file__).resolve().parent

def audit(manifest):
    errors=[];reviews=[];clips=[];total=0
    for key,clip in manifest['clips'].items():
        dimensions=set();anchors=set();roots=[];heights=[]
        for i,f in enumerate(clip['frames']):
            total+=1;im=Image.open(R/f['src']).convert('RGBA');a=np.array(im);dimensions.add(im.size);anchors.add(tuple(f['anchor']))
            if im.size!=(f['width'],f['height']):errors.append(f'{key}/{i}: PNG differs from manifest')
            if set(np.unique(a[:,:,3]))!={0,255}:errors.append(f'{key}/{i}: nonbinary alpha')
            if a[a[:,:,3]==0,:3].any():errors.append(f'{key}/{i}: hidden RGB')
            box=im.getbbox();heights.append(box[3]-box[1]);root,method=torso_x(im);roots.append(root-f['anchor'][0])
            _,count=label(a[:,:,3]>0,np.ones((3,3)))
            if count>1:reviews.append(f'{key}/{i+1}: {count} disconnected foreground components; inspect for stray fragments')
            if f['width']!=48 or f['height']!=96:reviews.append(f'{key}/{i+1}: {f["width"]}x{f["height"]}, exceeds the 48x96 game contract')
        if len(clip['frames'])>1:
            if len(dimensions)>1:errors.append(f'{key}: changing frame canvas dimensions')
            if len(anchors)>1:errors.append(f'{key}: changing ground anchors')
            if max(roots)-min(roots)>1:errors.append(f'{key}: measured torso drifts by {max(roots)-min(roots)} px')
        if 'REVIEW FAILURE' in clip['note'] or 'failed cycle' in clip['note'] or 'Not a finished' in clip['note'] or 'Not a finished'.lower() in clip['note'].lower():reviews.append(f'{key}: authored source fails motion review')
        clips.append({'clip':key,'frame_count':len(clip['frames']),'dimensions':[list(d) for d in sorted(dimensions)],'torso_drift_px':max(roots)-min(roots),'occupied_height_range':[min(heights),max(heights)]})
    # Across actions, a shared canvas cannot hide a different character scale.
    for sex in ['male','female']:
        for direction in ['front','right','back','left']:
            subset=[c for c in clips if c['clip'] in [f'{sex}-{a}-{direction}' for a in ['unarmed','walk','sprint']]]
            if len(subset)<3:reviews.append(f'{sex}/{direction}: missing idle/walk/sprint coverage')
            elif max(c['occupied_height_range'][1] for c in subset)>min(c['occupied_height_range'][0] for c in subset)*1.2:reviews.append(f'{sex}/{direction}: cross-action body scale changes by over 20%')
    return {'frame_count':total,'file_and_registration_passed':not errors,'game_ready':not errors and not reviews,'integrity_errors':errors,'production_review_failures':reviews,'clips':clips}

if __name__=='__main__':
    m=json.loads((R/'manifest-tuned.json').read_text());result=audit(m)
    (R/'tuning'/'pack-audit.json').write_text(json.dumps(result,indent=2))
    print(json.dumps({k:v for k,v in result.items() if k not in ['clips','production_review_failures']}));print(len(result['production_review_failures']),'production review failures recorded')
    if '--require-game-ready' in sys.argv and not result['game_ready']:sys.exit(1)
    if result['integrity_errors']:sys.exit(1)
