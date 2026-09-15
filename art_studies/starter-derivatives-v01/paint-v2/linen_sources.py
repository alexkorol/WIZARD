"""Create untrimmed linen milestones from the reviewed motion; keep original sources intact."""
import bpy
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / 'blender'
OUT = ROOT / 'blender'
OUT.mkdir(exist_ok=True)
provenance = []
for sex in ('female', 'male'):
    for gait in ('walk', 'sprint'):
        original = SOURCE / f'{sex}-{gait}-cloth-trial.blend'
        destination = OUT / f'{sex}-{gait}-linen.blend'
        if destination.exists():
            raise RuntimeError(f'Milestone exists: {destination}; do not overwrite an inspected result')
        bpy.ops.wm.open_mainfile(filepath=str(original))
        rig = bpy.data.objects[f'MH_{sex}_Rig']
        assert rig.get('anatomical_pose_basis_v2')
        for suffix, color in [('linen_single_shell_material', (.40, .33, .23, 1)),
                              ('russet_binding', (.16, .12, .075, 1))]:
            material = bpy.data.materials[f'player-{sex}_{suffix}']
            material.diffuse_color = color
            material.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = color
            material.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = .94
        for obj in bpy.data.objects:
            if obj.name.startswith(f'player-{sex}_neck_binding_'):
                obj.hide_render = True
                obj.hide_set(True)
        bpy.context.scene['starter_wardrobe'] = 'Undyed oatmeal flax; no neckline trim; natural cord; open sandals'
        bpy.ops.wm.save_as_mainfile(filepath=str(destination), compress=True)
        renderer = SOURCE / 'render_baked_frames.py'
        exec(compile(renderer.read_text(), str(renderer), 'exec'), {
            '__file__': str(renderer), 'SEX': sex, 'GAIT': gait,
            'OUTPUT_DIR': str(ROOT / 'linen-references'), 'SAVE_PATH': str(destination),
            'FRAMING_PATH': str(OUT / f'{sex}-{gait}-framing.json'),
        })
        provenance.append({'source': str(original.relative_to(ROOT.parent)),
                           'source_sha256': hashlib.sha256(original.read_bytes()).hexdigest(),
                           'output': str(destination.relative_to(ROOT)),
                           'output_sha256': hashlib.sha256(destination.read_bytes()).hexdigest(),
                           'changes': ['linen material', 'natural cord material', 'hide decorative neck binding'],
                           'pose_mesh_camera_unchanged': True})
        (OUT / 'provenance.json').write_text(json.dumps(provenance, indent=2))
