"""Regression fixtures for information transfer, independent of the art subject."""
import unittest
import numpy as np
from tune_transfer import transfer, expand
from component_split import split_components
from PIL import Image

class TransferTests(unittest.TestCase):
    def test_exact_upscale_preserves_thousands_of_colors_and_alpha(self):
        rng=np.random.default_rng(91)
        native=rng.integers(0,256,(96,48,4),dtype=np.uint8)
        native[:,:,3]=np.where(np.indices((96,48)).sum(axis=0)%5,255,0)
        native[native[:,:,3]==0,:3]=0
        large=np.repeat(np.repeat(native,8,axis=0),8,axis=1)
        recovered=transfer(large,list(range(0,385,8)),list(range(0,769,8)))
        np.testing.assert_array_equal(recovered,native)

    def test_boundary_votes_and_alpha_tie_survive(self):
        source=np.zeros((6,6,4),np.uint8)
        source[:3,:,:]=[36,43,50,255]
        recovered=transfer(source,[0,6],[0,6])
        np.testing.assert_array_equal(recovered[0,0],[36,43,50,255])

    def test_irregular_grid_round_trip(self):
        native=np.array([[[21,31,41,255],[0,0,0,0]],[[110,140,190,255],[49,73,129,255]]],np.uint8)
        xs,ys=[0,5,12],[0,7,13]
        source=expand(native,xs,ys,(13,12,4))
        np.testing.assert_array_equal(transfer(source,xs,ys),native)

    def test_hidden_rgb_cannot_vote(self):
        source=np.full((4,4,4),[255,0,255,0],np.uint8)
        source[:3,:,:]=[102,88,66,255]
        np.testing.assert_array_equal(transfer(source,[0,4],[0,4])[0,0],[102,88,66,255])

    def test_overlapping_bounding_boxes_do_not_sever_limbs(self):
        sheet=np.zeros((24,40,4),np.uint8)
        # Two figures with interleaving arms. No vertical gutter separates
        # their bounding boxes, yet their opaque components never touch.
        sheet[2:20,3:8]=[180,90,40,255]
        sheet[4:7,3:25]=[180,90,40,255]
        sheet[9:22,30:35]=[80,120,190,255]
        sheet[14:17,18:35]=[80,120,190,255]
        cells=split_components(Image.fromarray(sheet),1,2)[0]
        self.assertEqual(len(cells),2)
        first=np.array(cells[0][0]);second=np.array(cells[1][0])
        self.assertEqual(np.count_nonzero(first[:,:,3]),np.count_nonzero(sheet[:,:,0]==180))
        self.assertEqual(np.count_nonzero(second[:,:,3]),np.count_nonzero(sheet[:,:,0]==80))
        np.testing.assert_array_equal(first.astype(int)+second.astype(int),sheet)

if __name__=='__main__':unittest.main()
