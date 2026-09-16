#!/usr/bin/env python3
"""CLIP-assisted coverage audit for an unlabeled isolated-item image batch."""

from __future__ import annotations

import argparse
import csv
import json
from collections import Counter
from pathlib import Path

import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor


EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
PROMPTS = {
    "item_class": {
        "belt_waist": ["an isolated fantasy inventory item icon of a leather belt or waist girdle"],
        "body_armor": ["an isolated fantasy inventory item icon of a complete torso body armor cuirass or coat"],
        "cloak_mantle": ["an isolated fantasy inventory item icon of a cloak cape mantle or shoulder wrap"],
        "helmet_head": ["an isolated fantasy inventory item icon of a helmet cap or head armor"],
        "shield_offhand": ["an isolated fantasy inventory item icon of a shield buckler or defensive offhand"],
        "sword_dagger": ["an isolated fantasy inventory item icon of a sword saber khopesh dagger or long knife"],
        "axe_adze": ["an isolated fantasy inventory item icon of an axe hand axe battle axe or adze"],
        "mace_club_hammer": ["an isolated fantasy inventory item icon of a mace club war hammer or striking weapon"],
        "bow_quiver": ["an isolated fantasy inventory item icon of a bow quiver or gorytos archery set"],
        "sling_throwing": ["an isolated fantasy inventory item icon of a sling throwing stick dart or javelin bundle"],
        "spear_polearm": ["an isolated fantasy inventory item icon of a spear pike glaive halberd or long polearm"],
        "hands_arms": ["an isolated fantasy inventory item icon of gloves mitts bracers cuffs or arm guards"],
        "footwear_legs": ["an isolated fantasy inventory item icon of boots shoes sandals greaves or leg guards"],
        "jewelry": ["an isolated fantasy inventory item icon of an amulet necklace ring or jewelry"],
        "focus_relic": ["an isolated fantasy inventory item icon of a ritual focus scepter censer bell standard or relic"],
        "pack_container": ["an isolated fantasy inventory item icon of a backpack quiver case pouch coffer or container"],
    },
    "construction": {
        "leather_hide": ["an isolated game item made mainly from brown leather rawhide or fur"],
        "woven_cloth": ["an isolated game item made mainly from woven cloth linen wool felt or quilted textile"],
        "mail_chain": ["an isolated game armor item made mainly from linked bronze rings chain mail or metal mesh"],
        "scale_lamellar": ["an isolated game armor item made mainly from overlapping scales lamellar lames or small plates"],
        "plate_splint": ["an isolated game armor item made mainly from shaped bronze plate discs splints or sheet metal"],
        "wood_reed": ["an isolated game item made mainly from wood wicker reed cane or basketry"],
        "stone_bone_shell": ["an isolated game item made mainly from stone bone horn shell tooth or carapace"],
        "mixed_other": ["an isolated fantasy game item with mixed materials or no dominant armor construction"],
    },
    "weapon_family": {
        "short_blade": ["an isolated short sword dagger knife sickle or khopesh weapon"],
        "long_sword": ["an isolated long sword saber straight blade or cutting sword weapon"],
        "axe_adze": ["an isolated axe adze celt or chopping weapon"],
        "mace_club_hammer": ["an isolated mace club hammer cudgel or impact weapon"],
        "bow_archery": ["an isolated bow quiver gorytos or archery weapon set"],
        "sling_throwing": ["an isolated sling throwing stick dart javelin or thrown weapon set"],
        "spear_polearm": ["an isolated spear pike glaive halberd or long shafted polearm"],
        "ritual_focus": ["an isolated ritual staff scepter wand bell censer or magical focus rather than a weapon"],
        "not_weapon": ["an isolated piece of armor clothing jewelry or equipment that is not a weapon"],
    },
}


def text_centroids(model, processor, device):
    result = {}
    for family, labels in PROMPTS.items():
        names = list(labels)
        flattened = [text for name in names for text in labels[name]]
        counts = [len(labels[name]) for name in names]
        inputs = processor(text=flattened, return_tensors="pt", padding=True).to(device)
        with torch.inference_mode():
            features = model.get_text_features(**inputs)
            features = features / features.norm(dim=-1, keepdim=True)
        centroids = []
        offset = 0
        for count in counts:
            vector = features[offset : offset + count].mean(dim=0)
            centroids.append(vector / vector.norm())
            offset += count
        result[family] = (names, torch.stack(centroids))
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--model", default="openai/clip-vit-base-patch32")
    parser.add_argument("--batch-size", type=int, default=32)
    args = parser.parse_args()

    paths = sorted(
        (path for path in args.source.rglob("*") if path.is_file() and path.suffix.lower() in EXTENSIONS),
        key=lambda path: path.name.casefold(),
    )
    if not paths:
        raise SystemExit("No images found")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = CLIPModel.from_pretrained(args.model).to(device).eval()
    processor = CLIPProcessor.from_pretrained(args.model)
    texts = text_centroids(model, processor, device)
    rows = []
    for start in range(0, len(paths), args.batch_size):
        batch = paths[start : start + args.batch_size]
        images = []
        for path in batch:
            with Image.open(path) as image:
                images.append(image.convert("RGB"))
        pixels = processor(images=images, return_tensors="pt")["pixel_values"].to(device)
        with torch.inference_mode():
            features = model.get_image_features(pixel_values=pixels)
            features = features / features.norm(dim=-1, keepdim=True)
        for index, path in enumerate(batch):
            row = {"path": str(path), "name": path.name}
            diagnostics = {}
            for family, (names, centroids) in texts.items():
                values = (features[index] @ centroids.T).cpu().tolist()
                scores = dict(zip(names, values))
                ranking = sorted(names, key=scores.get, reverse=True)
                row[family] = ranking[0]
                row[f"{family}_margin"] = f"{scores[ranking[0]] - scores[ranking[1]]:.6f}"
                diagnostics[family] = scores
            row["scores"] = json.dumps(diagnostics, separators=(",", ":"))
            rows.append(row)
        print(f"scored {min(start + args.batch_size, len(paths))}/{len(paths)}", flush=True)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]), delimiter="\t")
        writer.writeheader()
        writer.writerows(rows)
    summary = {
        family: dict(Counter(row[family] for row in rows))
        for family in PROMPTS
    }
    print(json.dumps({"images": len(rows), "device": str(device), "summary": summary, "output": str(args.output)}, indent=2))


if __name__ == "__main__":
    main()
