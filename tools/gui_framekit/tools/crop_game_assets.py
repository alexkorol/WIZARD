"""FrameKit game UI asset pipeline.

Crops individual UI assets out of the generated concept sheets in
assets/concepts/ and writes them to game/assets/, plus a layout.json with
auto-detected slot rectangles (character spread) and skill-node positions
(skill web). Re-run after replacing any concept sheet.

Usage:  python tools/crop_game_assets.py [--contact]
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCEPTS = os.path.join(ROOT, "assets", "concepts")
OUT = os.path.join(ROOT, "game", "assets")
os.makedirs(OUT, exist_ok=True)

SHEETS = {
    "controls": "controls-and-panels.png",
    "hudbars": "hud-resources.png",
    "glyphs": "glyph-language.png",
    "states": "inventory-states.png",
    "buffs": "status-frames.png",
    "panels8": "panel-variants.png",
    "ornate9": "frame-ornate.png",
    "party": "party-frames.png",
}

# ---------------------------------------------------------------- detection

def detect_boxes(arr, thresh=58, dilate=4, minsize=18):
    mask = ndimage.binary_dilation(arr > thresh, iterations=dilate)
    lbl, _ = ndimage.label(mask)
    boxes = []
    for sl in ndimage.find_objects(lbl):
        if sl is None:
            continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        if x1 - x0 < minsize or y1 - y0 < minsize:
            continue
        boxes.append((x0, y0, x1 - x0, y1 - y0))
    return boxes


def box_at(boxes, px, py):
    hits = [b for b in boxes if b[0] <= px < b[0] + b[2] and b[1] <= py < b[1] + b[3]]
    if not hits:
        return None
    return min(hits, key=lambda b: b[2] * b[3])


# name -> (sheet, (px, py)) point picks, or (sheet, [x, y, w, h]) explicit
MANIFEST = {
    # -- controls sheet
    "btn_primary":      ("controls", (78, 63)),
    "btn_hover":        ("controls", (216, 63)),
    "btn_pressed":      ("controls", (487, 63)),
    "tab_idle":         ("controls", (78, 275)),
    "tab_hover":        ("controls", (227, 276)),
    "tab_selected":     ("controls", (545, 275)),
    "toggle_off":       ("controls", (50, 385)),
    "toggle_on":        ("controls", (400, 384)),
    "dropdown":         ("controls", (93, 591)),
    "modal_winged":     ("controls", (1213, 507)),
    "tooltip_frame":    ("controls", (934, 741)),
    "panel_sq_small":   ("controls", (1143, 318)),
    # -- hud bars sheet
    "bar_pair":         ("hudbars", (250, 42)),
    "bar_winged_red":   ("hudbars", (1345, 60)),
    "bar_winged_purple": ("hudbars", (1345, 145)),
    "gauge_empty":      ("hudbars", (1470, 345)),
    # -- glyph sheet: medallions & icons
    "winged_large":     ("glyphs", (170, 65)),
    "laurel_sun":       ("glyphs", (770, 60)),
    "greek_strip":      ("glyphs", (1350, 45)),
    "med_sun":          ("glyphs", (430, 195)),
    "med_star":         ("glyphs", (600, 195)),
    "med_sunteal":      ("glyphs", (740, 195)),
    "med_stargold":     ("glyphs", (880, 195)),
    "med_flower":       ("glyphs", (1030, 195)),
    "med_cherub":       ("glyphs", (85, 340)),
    "med_cherub2":      ("glyphs", (250, 340)),
    "med_eagle":        ("glyphs", (420, 340)),
    "med_eaglehead":    ("glyphs", (600, 340)),
    "med_bull":         ("glyphs", (745, 340)),
    "med_lion":         ("glyphs", (890, 340), "left"),
    "med_snake":        ("glyphs", (890, 340), "right"),
    "med_torch":        ("glyphs", (85, 505)),
    "med_scales":       ("glyphs", (230, 505)),
    "med_key":          ("glyphs", (375, 505)),
    "med_crown":        ("glyphs", (525, 505)),
    "med_shield":       ("glyphs", (690, 505)),
    "med_skull":        ("glyphs", (845, 505)),
    "med_hourglass":    ("glyphs", (990, 505)),
    "med_chain":        ("glyphs", (1130, 505)),
    "gem_common":       ("glyphs", (90, 660)),
    "gem_uncommon":     ("glyphs", (215, 660)),
    "gem_rare":         ("glyphs", (360, 660)),
    "gem_epic":         ("glyphs", (505, 660)),
    "gem_legendary":    ("glyphs", (650, 660)),
    "gem_mythic":       ("glyphs", (775, 660)),
    "lock_round":       ("glyphs", (890, 660)),
    "keyhole":          ("glyphs", (1030, 660)),
    "knocker":          ("glyphs", (1165, 660)),
    "pennant_excl":     ("glyphs", (1300, 660)),
    "pennant_star":     ("glyphs", (1395, 662)),
    "pennant_quest":    ("glyphs", (1520, 660)),
    "pennant_diamond":  ("glyphs", (1610, 660)),
    "sq_star":          ("glyphs", (85, 845)),
    "sq_heart":         ("glyphs", (230, 845)),
    "sq_trash":         ("glyphs", (345, 845)),
    "chev_single":      ("glyphs", (450, 845)),
    "chev_double":      ("glyphs", (565, 845)),
    "tri_warn":         ("glyphs", (1130, 845)),
    "tri_skull":        ("glyphs", (1275, 845)),
    "tri_fire":         ("glyphs", (1420, 845)),
    "tri_bolt":         ("glyphs", (1560, 845)),
    # -- inventory state sheet
    "socket_ring":      ("states", (65, 800)),
    "socket_gold":      ("states", (290, 800)),
    # -- status frames sheet
    "rack_large":       ("buffs", (1300, 780)),
    "rack_thin":        ("buffs", (1255, 880)),
    "buff_sq_gold":     ("buffs", (100, 90)),
    "buff_sq_red":      ("buffs", (100, 225)),
    "buff_sq_teal":     ("buffs", (100, 350)),
    "ring_plain":       ("buffs", (75, 510)),
    "ring_teal":        ("buffs", (400, 510)),
    "plate_winged":     ("buffs", (760, 205)),
    # -- panel variants sheet
    "banner_arch":      ("panels8", (1195, 85)),
    "modal_large":      ("ornate9", (1050, 250)),
    "panel_plain":      ("controls", (981, 155)),
    "input_field":      ("controls", (91, 493)),
    "card_gold":        ("controls", (1086, 741)),
    "card_green":       ("controls", (1237, 741)),
    "card_red":         ("controls", (1397, 741)),
    "card_plain":       ("controls", (934, 741)),
    # -- party sheet
    "ally_housing":     ("party", (160, 690)),
    "ally_housing2":    ("party", (430, 690)),
    "portrait_full":    ("party", (90, 520)),
    "downed_frame":     ("party", (660, 420)),
    "dead_frame":       ("party", (660, 610)),
    # The role icons sit close enough to their heading/neighbor that the
    # connected-component crop merges the first three markers. Keep the
    # sword marker on an explicit box so the generated asset stays atomic.
    "role_sword":       ("party", [616, 39, 55, 58]),
    "role_shield":      ("party", (700, 67)),
    "leader_wings":     ("party", (668, 145)),
    "banner_plaque":    ("panels8", (215, 995)),
    "banner_winged":    ("panels8", (1160, 985)),
}

PAD = 2

# decal crops that float over scene backgrounds: strip the sheet's charcoal
# ground by flood-keying background-colored pixels connected to the border
ALPHA_KEY = {
    "plate_winged", "winged_large", "banner_arch", "banner_plaque",
    "banner_winged", "leader_wings", "role_sword", "role_shield",
}


def key_background(img, tol=26):
    rgba = img.convert("RGBA")
    arr = np.array(rgba).astype(np.int16)
    corners = np.concatenate([arr[:2, :, :3].reshape(-1, 3), arr[-2:, :, :3].reshape(-1, 3)])
    bg = corners.mean(axis=0)
    near = (np.abs(arr[:, :, :3] - bg).sum(axis=2) < tol * 3)
    lbl, _ = ndimage.label(near)
    border_ids = set(np.unique(np.concatenate([
        lbl[0, :], lbl[-1, :], lbl[:, 0], lbl[:, -1]])))
    border_ids.discard(0)
    kill = np.isin(lbl, list(border_ids))
    out = np.array(rgba)
    out[:, :, 3] = np.where(kill, 0, out[:, :, 3])
    return Image.fromarray(out)

ORBS_SRC = os.path.join(os.path.dirname(ROOT), "wizard_orbs", "src", "assets")
# orb geometry from wizard_orbs (art pixels, y-up -> y-down at H=941)
ORB_L = (541, 941 - 484.5, 252)
ORB_R = (1128, 941 - 483, 252)


def build_orbs():
    """HUD orb pieces from the wizard_orbs plates: per side, a circular empty
    dome, a circular liquid/glass fill, and a statue 'chrome' layer with the
    liquid interior punched out (via the orb mask) so a dynamic fill can sit
    underneath it."""
    art = Image.open(os.path.join(ORBS_SRC, "art.png")).convert("RGBA")
    mask = Image.open(os.path.join(ORBS_SRC, "mask.png")).convert("L").resize(
        (1672, 941), Image.BILINEAR)

    art_np = np.array(art)
    mask_np = np.array(mask)
    chrome_np = art_np.copy()
    chrome_np[:, :, 3] = np.where(mask_np > 100, 0, art_np[:, :, 3])
    chrome = Image.fromarray(chrome_np)

    H = art.height
    yy, xx = np.mgrid[0:H, 0:art.width]

    def circle_crop(img, cx, cy, r, name):
        box = (int(cx - r), int(cy - r), int(cx + r), int(cy + r))
        c = img.crop(box).convert("RGBA")
        n = np.array(c)
        h, w = n.shape[:2]
        cyy, cxx = np.mgrid[0:h, 0:w]
        d = np.hypot(cxx - w / 2, cyy - h / 2)
        alpha = np.clip((r - d) * 96, 0, 255).astype(np.uint8)
        n[:, :, 3] = np.minimum(n[:, :, 3], alpha)
        Image.fromarray(n).save(os.path.join(OUT, name))

    clusters = {
        "l": {"orb": ORB_L, "box": (28, 130, 828, 941)},
        "r": {"orb": ORB_R, "box": (846, 130, 1646, 941)},
    }
    for side, spec in clusters.items():
        cx, cy, r = spec["orb"]
        circle_crop(art, cx, cy, r, f"orb_full_{side}.png")
        chrome.crop(spec["box"]).save(os.path.join(OUT, f"orb_chrome_{side}.png"))
        x0, y0 = spec["box"][0], spec["box"][1]
        print(f"orb {side}: center in cluster = ({cx - x0:.0f}, {cy - y0:.0f}) r={r}")


def main():
    sheets = {}
    boxes = {}
    for key, fname in SHEETS.items():
        img = Image.open(os.path.join(CONCEPTS, fname)).convert("RGB")
        sheets[key] = img
        boxes[key] = detect_boxes(np.array(img.convert("L")))

    crops = {}
    misses = []
    for name, entry in MANIFEST.items():
        sheet, spec = entry[0], entry[1]
        half = entry[2] if len(entry) > 2 else None
        img = sheets[sheet]
        if isinstance(spec, list):
            x, y, w, h = spec
        else:
            b = box_at(boxes[sheet], *spec)
            if b is None:
                misses.append(name)
                continue
            x, y, w, h = b
        if half == "left":
            w = w // 2
        elif half == "right":
            x, w = x + w // 2, w - w // 2
        x0 = max(0, x - PAD); y0 = max(0, y - PAD)
        x1 = min(img.width, x + w + PAD); y1 = min(img.height, y + h + PAD)
        crop = img.crop((x0, y0, x1, y1))
        if name in ALPHA_KEY:
            crop = key_background(crop)
        crop.save(os.path.join(OUT, f"{name}.png"))
        crops[name] = crop
    if misses:
        print("MISSED:", misses)

    # big backgrounds as jpg
    for src, dst in [("character-spread.png", "character_spread.jpg"),
                     ("skill-web.png", "skill_web.jpg")]:
        Image.open(os.path.join(CONCEPTS, src)).convert("RGB").save(
            os.path.join(OUT, dst), quality=90)

    # dark well texture strip for bar-depletion overlays, from the spread's
    # big lore well (guaranteed pure fabric texture)
    spread_img = Image.open(os.path.join(CONCEPTS, "character-spread.png")).convert("RGB")
    spread_img.crop((200, 690, 560, 760)).save(os.path.join(OUT, "well_strip.png"))

    def inner_wells(im, thresh=40, minsize=18, minfill=0.75):
        g = np.array(im.convert("L"))
        lb, _ = ndimage.label(g < thresh)
        out = []
        for j, s in enumerate(ndimage.find_objects(lb)):
            if s is None:
                continue
            yy0, yy1, xx0, xx1 = s[0].start, s[0].stop, s[1].start, s[1].stop
            ww, hh = xx1 - xx0, yy1 - yy0
            if ww < minsize or hh < minsize:
                continue
            if (lb[s] == j + 1).sum() / (ww * hh) < minfill:
                continue
            out.append({"x": int(xx0), "y": int(yy0), "w": int(ww), "h": int(hh)})
        out.sort(key=lambda b: (round(b["y"] / 30), b["x"]))
        return out

    # slim variant of the ability rack: drop the winged crest, keep slot band,
    # and patch the crest stub with a clean stretch of the top rail
    rack_slim = crops["rack_large"].crop((0, 50, crops["rack_large"].width,
                                          crops["rack_large"].height))
    rail = rack_slim.crop((100, 0, 200, 18))
    for x in range(280, 410, 100):
        rack_slim.paste(rail, (x, 0))
    rack_slim.save(os.path.join(OUT, "rack_slim.png"))

    # split the composed spread into standalone panels (vendor/stash windows)
    spread_rgb = Image.open(os.path.join(CONCEPTS, "character-spread.png")).convert("RGB")
    spread_rgb.crop((9, 6, 786, 977)).save(os.path.join(OUT, "panel_left.jpg"), quality=90)
    spread_rgb.crop((805, 6, 1582, 977)).save(os.path.join(OUT, "panel_right.jpg"), quality=90)

    build_orbs()

    rack_wells = inner_wells(crops["rack_large"])
    modal_wells = inner_wells(crops["modal_winged"], minsize=30)
    modal_large_wells = inner_wells(crops["modal_large"], minsize=60)

    # ------------------------------------------------------------- layout
    spread = np.array(Image.open(os.path.join(CONCEPTS, "character-spread.png")).convert("L"))
    dark = spread < 40
    lbl, _ = ndimage.label(dark)
    wells = []
    for i, sl in enumerate(ndimage.find_objects(lbl)):
        if sl is None:
            continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        w, h = x1 - x0, y1 - y0
        if w < 24 or h < 24:
            continue
        area = (lbl[sl] == i + 1).sum()
        if area / (w * h) < 0.75:
            continue
        wells.append({"x": int(x0), "y": int(y0), "w": int(w), "h": int(h)})

    # skill nodes (two-pass: bright discs + ringed dark discs)
    web = np.array(Image.open(os.path.join(CONCEPTS, "skill-web.png")).convert("L")).astype(np.int32)
    H, W = web.shape
    cands = []
    lbl, _ = ndimage.label(ndimage.binary_erosion(web > 80, iterations=3))
    for sl in ndimage.find_objects(lbl):
        if sl is None:
            continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        w, h = x1 - x0, y1 - y0
        if not (12 <= w <= 60 and 12 <= h <= 60) or abs(w - h) > max(w, h) * 0.5:
            continue
        cands.append([x0 + w / 2, y0 + h / 2, max(w, h) / 2])
    yy, xx = np.mgrid[0:H, 0:W]
    lbl, _ = ndimage.label(ndimage.binary_erosion(web < 50, iterations=2))
    for sl in ndimage.find_objects(lbl):
        if sl is None:
            continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        w, h = x1 - x0, y1 - y0
        if not (10 <= w <= 45 and 10 <= h <= 45) or abs(w - h) > max(w, h) * 0.5:
            continue
        ccx, ccy, r = x0 + w / 2, y0 + h / 2, max(w, h) / 2
        ys = slice(max(0, int(ccy - r - 12)), min(H, int(ccy + r + 12)))
        xs = slice(max(0, int(ccx - r - 12)), min(W, int(ccx + r + 12)))
        sub = web[ys, xs]
        dy = yy[ys, xs] - ccy; dx = xx[ys, xs] - ccx
        d2 = dx * dx + dy * dy
        annm = (d2 > (r + 2) ** 2) & (d2 < (r + 11) ** 2)
        if annm.sum() >= 20 and sub[annm].mean() > 78:
            cands.append([ccx, ccy, r + 8])
    cands = [c for c in cands if (c[0] - W / 2) ** 2 + (c[1] - 600) ** 2 > 115 ** 2]
    cands.append([W / 2, 600, 92])          # keystone medallion
    cands.append([W / 2, 88, 42])           # crown node top
    cands.append([W / 2, 1097, 42])         # root node bottom
    nodes = []
    for cx, cy, r in sorted(cands, key=lambda a: -a[2]):
        if any((m["cx"] - cx) ** 2 + (m["cy"] - cy) ** 2 < (m["r"] + 14) ** 2 for m in nodes):
            continue
        nodes.append({"cx": round(cx), "cy": round(cy), "r": round(max(r, 16))})

    layout = {
        "spreadWells": wells,
        "skillNodes": nodes,
        "rackWells": rack_wells,
        "rackSize": list(crops["rack_large"].size),
        "modalWells": modal_wells,
        "modalSize": list(crops["modal_winged"].size),
        "modalLargeWells": modal_large_wells,
        "modalLargeSize": list(crops["modal_large"].size),
        "crops": {n: list(c.size) for n, c in crops.items()},
    }
    with open(os.path.join(OUT, "layout.json"), "w") as f:
        json.dump(layout, f)
    print(f"{len(crops)} crops, {len(wells)} wells, {len(nodes)} skill nodes -> {OUT}")

    if "--contact" in sys.argv:
        names = sorted(crops)
        cols = 8
        cell = 210
        rows = (len(names) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * cell, rows * (cell + 18)), (18, 17, 15))
        dr = ImageDraw.Draw(sheet)
        for i, nm in enumerate(names):
            c = crops[nm].copy()
            c.thumbnail((cell - 10, cell - 10))
            gx, gy = (i % cols) * cell, (i // cols) * (cell + 18)
            sheet.paste(c, (gx + (cell - c.width) // 2, gy + (cell - c.height) // 2))
            dr.text((gx + 6, gy + cell + 2), nm, fill=(120, 220, 140))
        cs = os.path.join(OUT, "_contact_sheet.png")
        sheet.save(cs)
        print("contact sheet:", cs)


if __name__ == "__main__":
    main()
