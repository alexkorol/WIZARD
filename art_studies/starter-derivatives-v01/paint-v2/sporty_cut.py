"""Shorten the female hem along the existing simulated cloth surface.

The panel topology comes from revise_models.py: two 33-column x 37-row
panels, then shoulder bridges. Interpolate along each existing column so
the new cut follows every baked phase; do not push cloth into the legs.
"""
import bpy
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / 'blender'


def shorten(points):
    original = [v.co.copy() for v in points]
    for side in range(2):
        for row in range(12):
            target = row + 3 * (1 - row / 12) ** 2
            lower = math.floor(target)
            fraction = target - lower
            for column in range(33):
                index = side * 37 * 33 + row * 33 + column
                a = side * 37 * 33 + lower * 33 + column
                points[index].co = original[a].lerp(original[a + 33], fraction)


for gait in ('walk', 'sprint'):
    src = ROOT / 'blender' / f'female-{gait}-linen.blend'
    dst = ROOT / 'blender' / f'female-{gait}-linen-sport.blend'
    if dst.exists():
        raise RuntimeError(f'Milestone exists: {dst}')
    bpy.ops.wm.open_mainfile(filepath=str(src))
    cloth = bpy.data.objects[f'female_{gait}_baked_cloth_samples']
    assert len(cloth.data.vertices) == 2576
    for key in cloth.data.shape_keys.key_blocks:
        shorten(key.data)
    shorten(bpy.data.objects['player-female_linen_single_shell'].data.vertices)
    cloth['starter_cut'] = 'Shorter athletic hem, interpolated on all original baked cloth phases'
    bpy.ops.wm.save_as_mainfile(filepath=str(dst), compress=True)
    renderer = SOURCE / 'render_baked_frames.py'
    exec(compile(renderer.read_text(), str(renderer), 'exec'), {
        '__file__': str(renderer), 'SEX': 'female', 'GAIT': gait,
        'OUTPUT_DIR': str(ROOT / 'linen-references'), 'SAVE_PATH': str(dst),
        'FRAMING_PATH': str(ROOT / 'blender' / f'female-{gait}-framing.json'),
    })
