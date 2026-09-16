#!/usr/bin/env python3
"""Score four-position crops with CLIP for consistent human/axis/tier triage.

The model is advisory: position remains the faction prior, strong non-human
scores are candidates for ignore, and weak margins are routed to manual review.
The TSV preserves every raw score so later user feedback can be compared with
the original proposal.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path

import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor


NAME_RE = re.compile(r"^(\d+)__p([1-4])__")
LADDER_RE = re.compile(r"^(faction_[^-]+) - (STR|DEX|INT) - tier ([123])$", re.IGNORECASE)
FACTIONS = ("faction_north", "faction_stonewood", "faction_dustwind", "faction_riverspill")

PROMPTS = {
    "eligibility": {
        "human": [
            "a studio concept art image of one full-body adult human fantasy adventurer",
            "a single human warrior, archer, priest, or mage standing upright",
            "a person wearing fantasy armor and carrying equipment",
        ],
        "beast": [
            "a studio concept art image of a fantasy beast or animal with no human",
            "a birdlike, insectoid, quadruped, or reptilian fantasy monster",
            "a strange fantasy animal or monster standing alone",
        ],
        "spirit_construct": [
            "a supernatural humanoid ghost, wraith, tree spirit, animated vines, or empty armor, not a living human",
            "an artificial construct or monster shaped like a person but visibly nonhuman",
            "a strange faceless skeletal or elemental humanoid creature with no living human",
        ],
    },
    "axis": {
        "STR": [
            "a strength fighter whose gear emphasizes heavy armor, brute force, and protection",
            "a powerful tank warrior with a massive shield, hammer, axe, or oversized weapon",
            "a heavily armored fantasy bruiser built to absorb hits and strike with weight",
        ],
        "DEX": [
            "a dexterity adventurer whose gear emphasizes mobility, precision, reach, and utility",
            "an agile lightly or moderately armored archer, hunter, scout, spear fighter, or duelist",
            "a nimble fantasy skirmisher carrying bows, throwing weapons, nets, ropes, or practical gear",
        ],
        "INT": [
            "an intelligence mystic whose equipment emphasizes magic, ritual, study, or spiritual focus",
            "a fantasy mage, priest, shaman, alchemist, or ritualist with a staff, focus, lantern, or relic",
            "a robed occult spellcaster carrying ceremonial tools and magical implements",
        ],
    },
    "tier": {
        "1": [
            "a tier one novice adventurer with humble practical sparse equipment",
            "plain low-power fantasy gear made from common materials with little ornament",
        ],
        "2": [
            "a tier two experienced adventurer with developed detailed equipment",
            "uncommon mid-power fantasy gear with layered armor and several specialized tools",
        ],
        "3": [
            "a tier three legendary adventurer with rare ornate highly developed equipment",
            "powerful artifact-laden magical fantasy gear with exceptional ornament and complexity",
        ],
    },
    "faction": {
        "faction_north": [
            "a cold northern frontier fantasy adventurer in fur, wool, dark iron, and rugged mountain gear",
            "a North faction warrior prepared for snow and harsh cold",
        ],
        "faction_stonewood": [
            "a forest and stone woodland fantasy adventurer in bark, leather, moss, and earthy gear",
            "a Stonewood faction hunter shaped by deep woods and ancient trees",
        ],
        "faction_dustwind": [
            "a desert fantasy adventurer in layered cloth, sandstone colors, blue accents, and wind gear",
            "a Dustwind faction nomad prepared for sand and arid heat",
        ],
        "faction_riverspill": [
            "a river delta fantasy adventurer in pale cloth with reeds, nets, water, and floodplain gear",
            "a Riverspill faction traveler shaped by rivers, marshes, and fishing settlements",
        ],
    },
}


def confidence(margin: float, high: float, medium: float) -> str:
    if margin >= high:
        return "high"
    if margin >= medium:
        return "medium"
    return "low"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--crops", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--model", default="openai/clip-vit-base-patch32")
    parser.add_argument("--ladders", type=Path, help="Human-reviewed ladder images used as visual reference centroids")
    parser.add_argument("--state", type=Path, help="Sorter state; only user-reviewed records become reference centroids")
    parser.add_argument("--target-status", help="With --state, score only crops whose sorter record has this status")
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--limit", type=int)
    args = parser.parse_args()

    paths = sorted(path for path in args.crops.glob("*.png") if NAME_RE.match(path.name))
    sorter_state = None
    if args.state:
        sorter_state = json.loads(args.state.read_text(encoding="utf-8"))
        if args.target_status:
            target_names = {
                record["original_name"]
                for record in sorter_state.get("review_items", {}).values()
                if record.get("status") == args.target_status
            }
            paths = [path for path in paths if path.name in target_names]
    if args.limit:
        paths = paths[: args.limit]
    if not paths:
        raise SystemExit("No crops found")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = CLIPModel.from_pretrained(args.model).to(device).eval()
    processor = CLIPProcessor.from_pretrained(args.model)

    text_features: dict[str, tuple[list[str], torch.Tensor]] = {}
    for family, labels in PROMPTS.items():
        names = list(labels)
        flattened = [prompt for name in names for prompt in labels[name]]
        counts = [len(labels[name]) for name in names]
        tokens = processor(text=flattened, return_tensors="pt", padding=True).to(device)
        with torch.inference_mode():
            embeddings = model.get_text_features(**tokens)
            embeddings = embeddings / embeddings.norm(dim=-1, keepdim=True)
        grouped = []
        offset = 0
        for count in counts:
            vector = embeddings[offset : offset + count].mean(dim=0)
            grouped.append(vector / vector.norm())
            offset += count
        text_features[family] = (names, torch.stack(grouped))

    reference_centroids: dict[str, tuple[list[str], torch.Tensor]] = {}
    if args.state:
        examples = []
        for record in sorter_state.get("review_items", {}).values():
            path = Path(record.get("current_path", ""))
            if (
                record.get("status") == "reviewed"
                and record.get("axis") in {"STR", "DEX", "INT"}
                and str(record.get("tier")) in {"1", "2", "3"}
                and record.get("faction") in FACTIONS
                and path.is_file()
            ):
                examples.append((path, record["faction"], record["axis"], str(record["tier"])))
    elif args.ladders:
        examples: list[tuple[Path, str, str, str]] = []
        for folder in args.ladders.iterdir():
            match = LADDER_RE.match(folder.name) if folder.is_dir() else None
            if not match:
                continue
            for path in folder.iterdir():
                if path.is_file() and path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}:
                    examples.append((path, match.group(1).lower(), match.group(2).upper(), match.group(3)))
    else:
        examples = []

    if examples:
        feature_batches = []
        for start in range(0, len(examples), args.batch_size):
            images = []
            for path, *_ in examples[start : start + args.batch_size]:
                with Image.open(path) as image:
                    images.append(image.convert("RGB"))
            pixels = processor(images=images, return_tensors="pt")["pixel_values"].to(device)
            with torch.inference_mode():
                features = model.get_image_features(pixel_values=pixels)
                feature_batches.append((features / features.norm(dim=-1, keepdim=True)).cpu())
        reference_features = torch.cat(feature_batches).to(device)
        for family, label_index in (("faction", 1), ("axis", 2), ("tier", 3)):
            names = list(PROMPTS[family])
            centroids = []
            for name in names:
                selected = [i for i, example in enumerate(examples) if example[label_index] == name]
                vector = reference_features[selected].mean(dim=0)
                centroids.append(vector / vector.norm())
            reference_centroids[family] = (names, torch.stack(centroids))
        print(f"loaded {len(examples)} user-reviewed ladder references", flush=True)

    rows = []
    for start in range(0, len(paths), args.batch_size):
        batch_paths = paths[start : start + args.batch_size]
        images = []
        for path in batch_paths:
            with Image.open(path) as image:
                images.append(image.convert("RGB"))
        pixels = processor(images=images, return_tensors="pt")["pixel_values"].to(device)
        with torch.inference_mode():
            image_features = model.get_image_features(pixel_values=pixels)
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)

        family_scores = {}
        for family, (names, text) in text_features.items():
            similarities = image_features @ text.T
            family_scores[family] = (names, similarities.cpu())
        reference_scores = {}
        for family, (names, centroids) in reference_centroids.items():
            reference_scores[family] = (names, (image_features @ centroids.T).cpu())

        for batch_index, path in enumerate(batch_paths):
            match = NAME_RE.match(path.name)
            assert match
            board_index, position = map(int, match.groups())
            scored = {}
            for family, (names, matrix) in family_scores.items():
                values = matrix[batch_index].tolist()
                scored[family] = dict(zip(names, values))
            referenced = {}
            for family, (names, matrix) in reference_scores.items():
                values = matrix[batch_index].tolist()
                referenced[family] = dict(zip(names, values))

            eligibility_rank = sorted(scored["eligibility"], key=scored["eligibility"].get, reverse=True)
            axis_rank = sorted(scored["axis"], key=scored["axis"].get, reverse=True)
            tier_rank = sorted(scored["tier"], key=scored["tier"].get, reverse=True)
            faction_rank = sorted(scored["faction"], key=scored["faction"].get, reverse=True)
            eligibility_margin = scored["eligibility"][eligibility_rank[0]] - scored["eligibility"][eligibility_rank[1]]
            axis_margin = scored["axis"][axis_rank[0]] - scored["axis"][axis_rank[1]]
            tier_margin = scored["tier"][tier_rank[0]] - scored["tier"][tier_rank[1]]
            faction_margin = scored["faction"][faction_rank[0]] - scored["faction"][faction_rank[1]]
            faction_prior = FACTIONS[position - 1]
            reference_axis_rank = sorted(referenced.get("axis", {}), key=referenced.get("axis", {}).get, reverse=True)
            reference_tier_rank = sorted(referenced.get("tier", {}), key=referenced.get("tier", {}).get, reverse=True)
            reference_faction_rank = sorted(referenced.get("faction", {}), key=referenced.get("faction", {}).get, reverse=True)

            def reference_result(family: str, ranking: list[str]) -> tuple[str, str]:
                if not ranking:
                    return "", ""
                margin = referenced[family][ranking[0]] - referenced[family][ranking[1]]
                return ranking[0], f"{margin:.6f}"

            reference_axis, reference_axis_margin = reference_result("axis", reference_axis_rank)
            reference_tier, reference_tier_margin = reference_result("tier", reference_tier_rank)
            reference_faction, reference_faction_margin = reference_result("faction", reference_faction_rank)

            rows.append(
                {
                    "index": len(rows) + 1,
                    "board_index": board_index,
                    "position": position,
                    "crop_name": path.name,
                    "faction_prior": faction_prior,
                    "faction_visual": faction_rank[0],
                    "faction_visual_margin": f"{faction_margin:.6f}",
                    "eligibility": eligibility_rank[0],
                    "eligibility_margin": f"{eligibility_margin:.6f}",
                    "axis": axis_rank[0],
                    "axis_margin": f"{axis_margin:.6f}",
                    "axis_confidence": confidence(axis_margin, 0.018, 0.008),
                    "axis_reference": reference_axis,
                    "axis_reference_margin": reference_axis_margin,
                    "tier": tier_rank[0],
                    "tier_margin": f"{tier_margin:.6f}",
                    "tier_confidence": confidence(tier_margin, 0.014, 0.006),
                    "tier_reference": reference_tier,
                    "tier_reference_margin": reference_tier_margin,
                    "faction_reference": reference_faction,
                    "faction_reference_margin": reference_faction_margin,
                    "scores": json.dumps(scored, separators=(",", ":")),
                    "reference_scores": json.dumps(referenced, separators=(",", ":")),
                }
            )
        print(f"scored {min(start + args.batch_size, len(paths))}/{len(paths)}", flush=True)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]), delimiter="\t")
        writer.writeheader()
        writer.writerows(rows)
    print(json.dumps({"rows": len(rows), "device": str(device), "output": str(args.output)}, indent=2))


if __name__ == "__main__":
    main()
