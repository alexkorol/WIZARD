"""Structural export checks. Passing does not approve artistic quality."""
import json,unittest,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
R=Path(__file__).parent

class BlenderReferenceChecks(unittest.TestCase):
    def test_complete_native_frames_and_fixed_anchors(self):
        data=json.loads((R/'manifest-blender.json').read_text())
        self.assertFalse(data['game_ready'])
        self.assertEqual(len(data['clips']),16)
        shared={}
        for name,clip in data['clips'].items():
            self.assertTrue(clip['cloth_simulation'],name)
            self.assertEqual(len(clip['frames']),8)
            self.assertEqual(len({tuple(f['anchor']) for f in clip['frames']}),1)
            direction=name.split('-')[-1]
            anchor=clip['frames'][0]['anchor']
            if direction in shared:self.assertEqual(shared[direction],anchor)
            shared[direction]=anchor;hashes=[]
            for f in clip['frames']:
                with Image.open(R/f['src']) as im:
                    self.assertEqual(im.size,(48,96));self.assertEqual(im.mode,'RGBA')
                    a=np.asarray(im);self.assertEqual(set(np.unique(a[:,:,3])),{0,255})
                    self.assertFalse(a[a[:,:,3]==0,:3].any())
                    self.assertFalse(a[0,:,3].any() or a[-1,:,3].any() or a[:,0,3].any() or a[:,-1,3].any(),f['src'])
                    source=np.asarray(Image.open(R/'blender/motion'/Path(f['src']).name).convert('RGBA'))
                    self.assertTrue(np.array_equal(a[a[:,:,3]>0,:3],source[a[:,:,3]>0,:3]))
                    hashes.append(hashlib.sha256(a.tobytes()).hexdigest())
            self.assertEqual(len(set(hashes)),8,name)

    def test_shared_pixel_focal_length(self):
        c=json.loads((R/'blender/parity/camera.json').read_text())
        expected=c['pixel_focal_length']
        self.assertAlmostEqual(c['camera']['lens_mm']/c['camera']['sensor_height_mm']*384,expected,places=4)
        self.assertAlmostEqual(c['metre_x'][0]-c['player_origin'][0],c['player_plane_px_per_m'])
        for p in (R/'blender').glob('*-framing.json'):
            for f in json.loads(p.read_text()).values():self.assertAlmostEqual(f['pixel_focal_length'],expected,places=4)

    def test_guide_is_exact_integer_enlargement(self):
        for sex in ['male','female']:
            for gait in ['walk','sprint']:
                base=np.asarray(Image.open(R/f'blender/{sex}-{gait}-right-native.png'))
                enlarged=np.asarray(Image.open(R/f'blender/{sex}-{gait}-right-guide-8x.png'))
                self.assertTrue(np.array_equal(enlarged,np.repeat(np.repeat(base,8,0),8,1)))

if __name__=='__main__':unittest.main()
