"""Keep disconnected sprites whole even when their bounding boxes overlap."""
import numpy as np
from PIL import Image
from scipy.ndimage import label,find_objects,distance_transform_edt

def split_components(sheet,rows,cols=4):
    a=np.array(sheet.convert('RGBA'));a[:,:,3]=np.where(a[:,:,3]>=128,255,0);a[a[:,:,3]==0,:3]=0
    labels,count=label(a[:,:,3]>0,np.ones((3,3)))
    sizes=np.bincount(labels.ravel());sizes[0]=0
    expected=rows*cols
    if count<expected:raise ValueError(f'Only {count} connected figures for {expected} cells; touching sprites require review')
    main=list(np.argsort(sizes)[-expected:]);boxes=find_objects(labels)
    if min(sizes[i] for i in main)<max(sizes[i] for i in main)*.12:raise ValueError('Too few substantial figures; refuse to treat speckles as frames')
    center=lambda i:((boxes[i-1][0].start+boxes[i-1][0].stop)/2,(boxes[i-1][1].start+boxes[i-1][1].stop)/2)
    ordered=sorted(main,key=lambda i:center(i)[0]);ordered=[sorted(ordered[r*cols:(r+1)*cols],key=lambda i:center(i)[1]) for r in range(rows)]
    main_mask=np.isin(labels,main)
    nearest=distance_transform_edt(~main_mask,return_distances=False,return_indices=True)
    nearest_labels=labels[tuple(nearest)]
    owners=np.zeros(count+1,np.int32)
    for i in range(1,count+1):
        if i in main:owners[i]=i
        else:
            votes=np.bincount(nearest_labels[labels==i]);owners[i]=votes.argmax()
    assigned=owners[labels];out=[];total=0
    for row in ordered:
        cells=[]
        for col,i in enumerate(row):
            cell=a.copy();cell[assigned!=i]=0
            im=Image.fromarray(cell);total+=np.count_nonzero(cell[:,:,3])
            cells.append((im,im.getbbox(),-round(col*sheet.width/cols)))
        out.append(cells)
    assert total==np.count_nonzero(a[:,:,3]), 'Foreground was dropped or assigned twice'
    return out
