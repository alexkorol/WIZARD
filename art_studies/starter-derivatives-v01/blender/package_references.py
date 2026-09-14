"""Package Blender's actual 64x96 canvases at the unchanged 48x96 character pixel density, never resize a generated image."""
from pathlib import Path
from PIL import Image
import json,hashlib
R=Path(__file__).parent
out=R/'frames';out.mkdir(exist_ok=True)
clips={};audit=[]
for sex in ['male','female']:
    for gait in ['walk','sprint']:
        for direction in ['front','right','back','left']:
            key=f'{sex}-{gait}-{direction}';frames=[];hashes=[]
            framing=json.loads((R/f'{sex}-{gait}-framing.json').read_text())
            for i in range(1,9):
                src=R/'motion'/f'{key}-{i}.png'
                im=Image.open(src).convert('RGBA');assert im.size==(64,96)
                # Explicit alpha pixelization only. RGB at each covered native
                # render pixel is retained byte-for-byte.
                alpha=im.getchannel('A').point(lambda a:255 if a>=128 else 0)
                rgba=Image.new('RGBA',im.size);rgba.paste(im,(0,0),alpha);rgba.putalpha(alpha)
                dest=out/src.name;rgba.save(dest)
                digest=hashlib.sha256(rgba.tobytes()).hexdigest();hashes.append(digest)
                bbox=rgba.getbbox()
                assert bbox[0]>0 and bbox[1]>0 and bbox[2]<64 and bbox[3]<96,f'Clipped render: {src.name} {bbox}'
                frames.append({'src':'blender/frames/'+dest.name,'width':64,'height':96,'anchor':framing[direction]['anchor']})
                audit.append({'file':dest.name,'bbox':rgba.getbbox(),'sha256':digest})
            assert len(set(hashes))==8,f'Repeated Blender poses: {key}'
            simulation=R/f'{sex}-{gait}-simulation.json'
            sim=json.loads(simulation.read_text()) if simulation.exists() else {}
            seam=sim.get('cloth_loop_seam',{}).get('maximum_logical_pixels')
            clips[key]={'frames':frames,'mocap':json.loads((R/'mocap'/f'{sex}-retarget.json').read_text())[gait],'cloth_simulation':simulation.exists(),'cloth_loop_max_delta_px':seam,'note':
                ('Blender structure / eight phases from one cloth simulation. Fixed camera scale; unclipped native frames. '+(f'LOOP REVIEW: up to {seam:.1f} px cloth displacement between successive cycles. ' if seam is not None else 'Loop continuity is unverified. ')+'Hair is bone-bound, not simulated. Not finished game art.') if simulation.exists() else
                'UNFINISHED Blender binding trial. Cloth simulation has not been sampled for this clip; do not promote it to imagegen or game use.'}
manifest={'name':'Blender camera and motion references','game_ready':False,'clips':clips}
(R.parent/'manifest-blender.json').write_text(json.dumps(manifest,indent=2))
(R/'frame-audit.json').write_text(json.dumps(audit,indent=2))
# Structural imagegen inputs are whole native sheets enlarged by exact integers.
for sex in ['male','female']:
    for gait in ['walk','sprint']:
        sheet=Image.new('RGBA',(256,192))
        for i in range(8):
            im=Image.open(out/f'{sex}-{gait}-right-{i+1}.png')
            sheet.paste(im,((i%4)*64,(i//4)*96))
        sheet.save(R/f'{sex}-{gait}-right-native.png')
        sheet.resize((2048,1536),Image.Resampling.NEAREST).save(R/f'{sex}-{gait}-right-guide-8x.png')
print('Packaged',len(audit),'native Blender frames; generated art approval remains false')
