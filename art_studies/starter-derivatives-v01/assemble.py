"""Register recovered pixels without rescaling; preserve every foreground pixel."""
from pathlib import Path
import json, hashlib
import numpy as np
from PIL import Image, ImageDraw

R = Path(__file__).resolve().parent
clips, audit = {}, []
directions = ['front', 'right', 'back', 'left']
notes = {
    'unarmed': 'Unarmed derivative: compare identity beside the original club reference. Native returned alpha; recovered pixels only.',
    'weapons': 'Front-only equipment study. Darts, unhafted flint biface, or supported bowl. Other directions are absent; no unrelated frame is substituted.',
    'diagonals': 'Direction trial: NW reads almost straight back; NE is too close to a side view. Do not treat this as an accepted eight-direction set.',
    'male-walk': 'REVIEW FAILURE: repeated stride phases. East frame 4 faces west; east frame 3 turns away. Kept visible for diagnosis, not approved for game use.',
    'female-walk': 'REVIEW FAILURE: legs largely repeat the same stride instead of alternating. Inspect braid and body-scale drift beside the original.',
    'male-sprint': 'Sprint trial: side views distinguish contact and flight, but front/back phases repeat and shoulder orientation drifts. Not a finished cycle.',
    'female-sprint': 'Sprint trial: repeated leg phases and braid drift (front frames lose the braid). Not a finished cycle.',
    'focused-walk': 'Focused east walk retry: facing stays east, but opposing limb phases still repeat and the female develops two braids. This is a failed cycle, retained for comparison.'
}

for path in sorted((R / 'reconstructed').glob('*-auto.png')):
    name = path.stem.removesuffix('-auto')
    if name not in notes: continue
    sheet = Image.open(path).convert('RGBA')
    rows = 4 if name in ['male-walk', 'female-walk', 'male-sprint', 'female-sprint'] else 2
    # Follow transparent row gutters. An equal half-cut in the focused retry
    # bisects the male's low sandal and leaks its tip into the female row.
    projection = (np.array(sheet)[:, :, 3] >= 128).sum(axis=1)
    cuts = [0]
    for boundary in range(1, rows):
        ideal = boundary * sheet.height / rows
        radius = max(2, round(sheet.height / rows * .17))
        choices = range(max(cuts[-1]+1, round(ideal)-radius), min(sheet.height, round(ideal)+radius))
        cuts.append(min(choices, key=lambda y:(projection[y], abs(y-ideal))))
    cuts.append(sheet.height)
    # The generator places each figure in one regular sheet cell. Recover the
    # boundaries from the sheet dimensions; do not resize the recovered art.
    for row in range(rows):
        cells = []
        xproj = (np.array(sheet)[cuts[row]:cuts[row+1], :, 3] >= 128).sum(axis=0)
        xcuts = [0]
        for boundary in range(1, 4):
            ideal = boundary * sheet.width / 4
            radius = max(2, round(sheet.width / 4 * .17))
            choices = range(max(xcuts[-1]+1,round(ideal)-radius), min(sheet.width,round(ideal)+radius))
            xcuts.append(min(choices,key=lambda x:(xproj[x],abs(x-ideal))))
        xcuts.append(sheet.width)
        for col in range(4):
            cell = sheet.crop((xcuts[col], cuts[row], xcuts[col+1], cuts[row+1]))
            a = np.array(cell)
            a[:, :, 3] = np.where(a[:, :, 3] >= 128, 255, 0)
            a[a[:, :, 3] == 0, :3] = 0
            cell = Image.fromarray(a)
            bbox = cell.getbbox()
            if bbox is None: raise ValueError(f'{name} row {row} col {col}: empty frame')
            cells.append((cell, bbox, xcuts[col]-round(col*sheet.width/4)))
        # For a motion row, use ONE floor across all four poses. Per-frame
        # bottom alignment would erase the generated flight/vertical movement.
        motion = rows == 4 or name == 'focused-walk'
        floor = max(b[3] for _, b, _ in cells)
        for col, (cell, bbox, xoffset) in enumerate(cells):
            sex = name.split('-')[0] if rows == 4 else ['male', 'female'][row]
            action = name.split('-')[1] if rows == 4 else name
            direction = directions[row] if rows == 4 else directions[col]
            index = col if motion else 0
            if name == 'weapons': action, direction = ['equipment-empty', 'darts', 'flint', 'bowl'][col], 'front'
            if name == 'diagonals': direction = ['se', 'ne', 'nw', 'sw'][col]
            if name == 'focused-walk': action, direction = 'focused-walk', 'right'
            key = f'{sex}-{action}-{direction}'
            # Preserve horizontal cell registration in motion rows. Center
            # the shared occupied envelope once, rather than following limbs.
            left = min(b[0]+o for _, b, o in cells) if motion else bbox[0]+xoffset
            right = max(b[2]+o for _, b, o in cells) if motion else bbox[2]+xoffset
            width = max(48, right-left+4)
            baseline = floor if motion else bbox[3]
            top = min(b[1] for _, b, _ in cells) if motion else bbox[1]
            height = max(96, baseline-top+4)
            dx = (width-(right-left))//2-left+xoffset
            dy = height-2-baseline
            out = Image.new('RGBA', (width, height))
            piece = cell.crop(bbox)
            out.alpha_composite(piece, (bbox[0]+dx, bbox[1]+dy))
            before = np.array(cell); after = np.array(out)
            assert np.count_nonzero(before[:, :, 3]) == np.count_nonzero(after[:, :, 3]), 'Foreground clipped'
            assert sorted(map(tuple, before[before[:, :, 3]>0])) == sorted(map(tuple, after[after[:, :, 3]>0])), 'Foreground colors changed'
            dst = R / 'frames' / f'{key}-{index}.png'
            out.save(dst)
            frame = {'src': dst.relative_to(R).as_posix(), 'width': width, 'height': height, 'anchor': [width//2, height-2], 'source_sheet': name, 'source_cell': [row, col]}
            clip = clips.setdefault(key, {'frames': [], 'note': notes[name], 'status': 'trial'})
            clip['frames'].append(frame)
            if (width != 48 or height != 96) and 'Recovered frame requires' not in clip['note']:
                clip['note'] += f' Recovered frame requires {width}×{height}; failed the 48×96 scale target. No forced resizing.'
            audit.append({'id': dst.stem, 'size': out.size, 'occupied': piece.size, 'translation': [dx, dy], 'foreground_preserved': True, 'sha256': hashlib.sha256(dst.read_bytes()).hexdigest()})

(R / 'manifest.json').write_text(json.dumps({'logical_target': [48, 96], 'production_ready': False, 'clips': clips}, indent=2))
(R / 'review' / 'frame-audit.json').write_text(json.dumps(audit, indent=2))
# A native-size plus exact 3x review, with flat dark and light backgrounds.
frames = [(a, Image.open(R/'frames'/f"{a['id']}.png")) for a in audit]
row_heights = [max(im.height for _,im in frames[i:i+8])+32 for i in range(0,len(frames),8)]
col_width = max(107, max(im.width for _,im in frames)+8)
board = Image.new('RGB', (col_width*8, sum(row_heights)), '#283137')
draw = ImageDraw.Draw(board)
for i, (a, im) in enumerate(frames):
    x, y = (i%8)*col_width, sum(row_heights[:i//8])
    rh = row_heights[i//8]
    if (i//8)%2: draw.rectangle((x,y,x+col_width-1,y+rh-1), fill='#d0c9b6')
    board.paste(im, (x+(col_width-im.width)//2,y+5), im)
    short = a['id'].replace('female','F').replace('male','M').replace('focused-walk','retry').replace('diagonals','diag')
    draw.text((x+2,y+rh-25), short[:17], fill='#b28753')
    draw.text((x+2,y+rh-13), short[17:], fill='#b28753')
board.save(R/'review'/'all-frames-native.png')
print(f'{len(audit)} frames; {len(clips)} explicit clips. No resizing, mirroring or generated intermediate poses.')
