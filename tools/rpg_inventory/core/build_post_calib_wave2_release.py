#!/usr/bin/env python3
"""Release user-approved post-calibration Wave 2 items to the live taxonomy.

The triage sheet remains the source of truth. Rows marked ``promote`` are
released unless a concrete QA hold is listed in ``QA_HOLDS``. The script:

* writes a SHA-keyed approved manifest and durable decision export;
* composes optimized true-alpha finals into ``assets/pc2_NNN.png``; and
* writes the browser taxonomy/runtime-form extension consumed by index.html.

Source and cleaned images remain local working files under assets_staging.
Run from anywhere in the repository:

    python tools/rpg_inventory/core/build_post_calib_wave2_release.py
"""

from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path
import re
from typing import Any

from PIL import Image

import compose_assets


CORE = Path(__file__).resolve().parent
PROJECT = CORE.parent
TRIAGE = CORE / "expansion_drafts" / "post-calib-triage-wave2.tsv"
CLEANED = PROJECT / "assets_staging" / "post-calib-wave2-cleaned"
ASSETS = PROJECT / "assets"
READY = CORE / "expansion_ready"
MANIFEST = READY / "post-calib-wave2-approved.tsv"
DECISIONS = READY / "post-calib-wave2-decisions.json"
TAXONOMY_JS = CORE / "post-calib-wave2-taxonomy.js"
BATCH = "post-calib-wave2"

# These two rows were visually confirmed to have cropped neck cords after the
# numeric gate found >2% alpha contact on the frame edge. They remain in the
# user's flagged review pool instead of silently entering the runtime.
QA_HOLDS = {
    "ChatGPT Image Aug 13, 2026, 11_16_48 PM.png":
        "QA hold: full neck cord is cropped by the top frame edge.",
    "ChatGPT Image Aug 13, 2026, 11_51_41 PM.png":
        "QA hold: full neck cord is cropped by the top frame edge.",
}

ACTIVE_MATERIALS = [
    "flint", "bone", "hide", "quilted", "copper", "bronze",
    "obsidian", "jade", "amber", "bronzescale", "skymetal",
]

SLOT_CONFIG: dict[str, dict[str, Any]] = {
    "impact":         {"slot": "weapon",   "form": "batch_impact", "canvas": "P", "w": 1, "h": 3},
    "sword":          {"slot": "weapon",   "form": "batch_sword",  "canvas": "P", "w": 1, "h": 3},
    "dagger":         {"slot": "weapon",   "form": "batch_dagger", "canvas": "P", "w": 1, "h": 2},
    "spear":          {"slot": "weapon",   "form": "batch_spear",  "canvas": "P", "w": 2, "h": 4},
    "axe":            {"slot": "weapon",   "form": "batch_axe",    "canvas": "P", "w": 1, "h": 3},
    "sling":          {"slot": "weapon",   "form": "batch_sling",  "canvas": "P", "w": 1, "h": 2},
    "shield":         {"slot": "shield",   "form": "batch_shield", "canvas": "P", "w": 2, "h": 3},
    "body_armor":     {"slot": "body",     "form": "batch_body",   "canvas": "P", "w": 2, "h": 3},
    "outer_layer":    {"slot": "cloak",    "form": "batch_outer",  "canvas": "P", "w": 2, "h": 3},
    "helmet":         {"slot": "head",     "form": "batch_helmet", "canvas": "S", "w": 2, "h": 2},
    "gloves_hands":   {"slot": "hands",    "form": "batch_gloves", "canvas": "S", "w": 2, "h": 2},
    "boots_footwear": {"slot": "boots",    "form": "batch_boots",  "canvas": "S", "w": 2, "h": 2},
    "belt":           {"slot": "belt",     "form": "batch_belt",   "canvas": "L", "w": 2, "h": 1},
    "amulet":         {"slot": "amulet",   "form": "batch_amulet", "canvas": "S", "w": 1, "h": 1},
    "quiver":         {"slot": "quickrig", "form": "batch_quiver", "canvas": "P", "w": 2, "h": 3},
    "container_pack": {"slot": "quickrig", "form": "batch_pack",   "canvas": "S", "w": 2, "h": 2},
}

MANIFEST_FIELDS = [
    "art_id", "source_filename", "source_sha256", "display_name",
    "slot_guess", "runtime_slot", "runtime_form_id", "material_id",
    "tier", "stat_axis", "faction", "confidence", "canvas", "grid_w",
    "grid_h", "description", "triage_reason", "qa_status",
]


def read_triage() -> list[dict[str, str]]:
    with TRIAGE.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle, delimiter="\t"))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def cleaned_path(filename: str) -> Path:
    return CLEANED / f"{Path(filename).stem}_clean.png"


def display_name(description: str) -> str:
    value = description.strip().rstrip(".")
    value = re.sub(r"^(?:a |an |one |pair of |full-length )", "", value, flags=re.I)
    words = []
    for word in value.split():
        if word.lower() in {"a", "an", "and", "of", "with"} and words:
            words.append(word.lower())
        else:
            words.append(word[:1].upper() + word[1:])
    return " ".join(words)


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.casefold()).strip("-")


def material_for(tier_text: str, description: str) -> str:
    tier = int(tier_text.removeprefix("T"))
    text = description.casefold()
    if tier == 1:
        if re.search(r"\b(bone|antler|tooth|teeth|fang|shell)\b", text):
            return "bone"
        if re.search(r"\b(flint|stone|obsidian)\b", text):
            return "flint"
        return "hide"
    if tier == 2:
        if re.search(r"\b(woven|linen|wool|leather|hide|fur|cloth|fiber|fibre)\b", text):
            return "quilted"
        return "copper"
    if tier == 3:
        return "obsidian" if re.search(r"\b(obsidian|blackened)\b", text) else "bronze"
    if tier == 4:
        if "amber" in text:
            return "amber"
        if re.search(r"\b(bronze|lamellar|scale|metal)\b", text):
            return "bronzescale"
        return "jade"
    return "skymetal"


def runtime_forms_js() -> str:
    materials = json.dumps(ACTIVE_MATERIALS)
    # These forms are taxonomy-only carriers. Individual identity, display
    # name, tier and art live on each approved taxonomy row.
    forms = {
        "batch_dagger": {"name": "Batch Dagger", "kind": "weapon", "kindLabel": "One-hand blade", "w": 1, "h": 2, "icon": "khopesh", "weapon": {"dmg": [5, 10], "aps": 1.5}, "tags": ["blade", "swift"], "weights": {"blade": 1.2, "swift": 1.3}},
        "batch_sword":  {"name": "Batch Sword", "kind": "weapon", "kindLabel": "One-hand sword", "w": 1, "h": 3, "icon": "khopesh", "weapon": {"dmg": [11, 20], "aps": 1.2}, "tags": ["blade"], "weights": {"blade": 1.3}},
        "batch_spear":  {"name": "Batch Spear", "kind": "weapon", "kindLabel": "Reach weapon", "w": 2, "h": 4, "icon": "spear", "weapon": {"dmg": [10, 22], "aps": 1.0}, "tags": ["reach"], "weights": {"reach": 1.5}},
        "batch_axe":    {"name": "Batch Axe", "kind": "weapon", "kindLabel": "One-hand axe", "w": 1, "h": 3, "icon": "axe", "weapon": {"dmg": [9, 17], "aps": 1.0}, "tags": ["blade", "blunt"], "weights": {"blade": 1.2}},
        "batch_impact": {"name": "Batch Impact", "kind": "weapon", "kindLabel": "Impact weapon", "w": 1, "h": 3, "icon": "club", "weapon": {"dmg": [9, 17], "aps": 1.0}, "tags": ["blunt"], "weights": {"blunt": 1.4}},
        "batch_sling":  {"name": "Batch Sling", "kind": "weapon", "kindLabel": "Sling", "w": 1, "h": 2, "icon": "sling", "weapon": {"dmg": [5, 12], "aps": 1.4}, "tags": ["reach", "swift"], "weights": {"swift": 1.3}},
        "batch_shield": {"name": "Batch Shield", "kind": "shield", "kindLabel": "Shield", "w": 2, "h": 3, "icon": "shield", "armor": 45, "tags": ["ward"], "weights": {"ward": 1.5}},
        "batch_body":   {"name": "Batch Body", "kind": "body", "kindLabel": "Body armour", "w": 2, "h": 3, "icon": "wrap", "armor": 60, "tags": ["ward", "life"], "weights": {"ward": 1.2}},
        "batch_outer":  {"name": "Batch Outer", "kind": "cloak", "kindLabel": "Outer layer", "w": 2, "h": 3, "icon": "wrap", "armor": 18, "tags": ["ward", "swift"], "weights": {"swift": 1.1}},
        "batch_helmet": {"name": "Batch Helmet", "kind": "helmet", "kindLabel": "Headpiece", "w": 2, "h": 2, "icon": "crest", "armor": 25, "tags": ["ward", "life"], "weights": {"ward": 1.2}},
        "batch_gloves": {"name": "Batch Gloves", "kind": "gloves", "kindLabel": "Handwear", "w": 2, "h": 2, "icon": "grips", "armor": 16, "tags": ["ward", "swift"], "weights": {"swift": 1.2}},
        "batch_boots":  {"name": "Batch Boots", "kind": "boots", "kindLabel": "Footwear", "w": 2, "h": 2, "icon": "sandals", "armor": 14, "tags": ["swift"], "weights": {"swift": 1.6}},
        "batch_belt":   {"name": "Batch Belt", "kind": "belt", "kindLabel": "Waistband", "w": 2, "h": 1, "icon": "girdle", "armor": 0, "tags": ["life"], "weights": {"life": 1.3}},
        "batch_amulet": {"name": "Batch Amulet", "kind": "amulet", "kindLabel": "Amulet", "w": 1, "h": 1, "icon": "gorget", "armor": 0, "tags": ["spirit", "ward"], "weights": {"spirit": 1.4}},
        "batch_quiver": {"name": "Batch Quiver", "kind": "quickrig", "kindLabel": "Quiver", "w": 2, "h": 3, "icon": "girdle", "armor": 0, "tags": ["swift", "fortune"], "weights": {"swift": 1.4}},
        "batch_pack":   {"name": "Batch Pack", "kind": "quickrig", "kindLabel": "Carry rig", "w": 2, "h": 2, "icon": "girdle", "armor": 0, "tags": ["swift", "fortune"], "weights": {"fortune": 1.2}},
    }
    for form in forms.values():
        form["materials"] = ACTIVE_MATERIALS
        form["noDrop"] = True
        form["implicit"] = None
    return json.dumps(forms, ensure_ascii=True, separators=(",", ":"))


def write_taxonomy_js(items: list[dict[str, Any]]) -> None:
    item_json = json.dumps(items, ensure_ascii=True, indent=2)
    content = f"""(() => {{
  'use strict';
  const BATCH = {json.dumps(BATCH)};
  const pack = window.VerdigrisPack;
  if (!pack || !pack.forms) throw new Error('VerdigrisPack must load before Wave 2 taxonomy.');
  const FORMS = {runtime_forms_js()};
  Object.assign(pack.forms, FORMS);

  const ITEMS = {item_json};
  const current = Array.isArray(window.VerdigrisCharacterItemTaxonomy)
    ? window.VerdigrisCharacterItemTaxonomy : [];
  const replacementIds = new Set(ITEMS.map(item => item.id));
  window.VerdigrisCharacterItemTaxonomy = current
    .filter(item => !replacementIds.has(item.id))
    .concat(ITEMS);

  const meta = window.VerdigrisCharacterItemTaxonomyMeta || {{}};
  window.VerdigrisCharacterItemTaxonomyMeta = {{
    ...meta,
    approvedWave2Batch: BATCH,
    approvedWave2Count: ITEMS.length,
    approvedWave2GeneratedAt: '2026-08-15',
  }};
}})();
"""
    TAXONOMY_JS.write_text(content, encoding="utf-8", newline="\n")


def main() -> None:
    rows = read_triage()
    READY.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    manifest_rows: list[dict[str, str]] = []
    taxonomy_items: list[dict[str, Any]] = []
    decisions: dict[str, dict[str, str]] = {}
    name_counts: dict[str, int] = {}

    for row_number, row in enumerate(rows, 1):
        filename = row["filename"]
        if row["verdict"] == "review":
            decisions[filename] = {"decision": "pending_review", "agent_verdict": "review", "sha256": row["sha256"]}
            continue
        if row["verdict"] == "reject":
            decisions[filename] = {"decision": "discard", "agent_verdict": "reject", "sha256": row["sha256"]}
            continue
        if filename in QA_HOLDS:
            decisions[filename] = {"decision": "hold", "agent_verdict": "promote", "sha256": row["sha256"], "notes": QA_HOLDS[filename]}
            continue
        if row["slot_guess"] not in SLOT_CONFIG:
            raise ValueError(f"unsupported slot {row['slot_guess']!r} for {filename}")

        source = cleaned_path(filename)
        if not source.is_file():
            raise FileNotFoundError(source)
        source_hash = sha256(source)
        if not source_hash:
            raise ValueError(f"empty SHA for {source}")
        with Image.open(source) as image:
            if not compose_assets.has_true_alpha(image):
                raise ValueError(f"cleaned source lacks true alpha: {source}")

        art_id = f"pc2_{row_number:03d}"
        name = display_name(row["desc"])
        key = name.casefold()
        name_counts[key] = name_counts.get(key, 0) + 1
        if name_counts[key] > 1:
            name = f"{name} {name_counts[key]}"
        config = SLOT_CONFIG[row["slot_guess"]]
        material = material_for(row["tier_guess"], row["desc"])
        tier = row["tier_guess"].removeprefix("T")

        with Image.open(source) as image:
            compose_assets.save_true_alpha(art_id, image, set(), False)

        manifest_rows.append({
            "art_id": art_id,
            "source_filename": filename,
            "source_sha256": row["sha256"],
            "display_name": name,
            "slot_guess": row["slot_guess"],
            "runtime_slot": config["slot"],
            "runtime_form_id": config["form"],
            "material_id": material,
            "tier": tier,
            "stat_axis": row["stat_axis"],
            "faction": row["faction_guess"],
            "confidence": row["confidence"],
            "canvas": config["canvas"],
            "grid_w": str(config["w"]),
            "grid_h": str(config["h"]),
            "description": row["desc"],
            "triage_reason": row["reason"],
            "qa_status": "accepted",
        })
        taxonomy_items.append({
            "id": art_id,
            "batch": BATCH,
            "number": row_number,
            "label": name,
            "slot": config["slot"],
            "subtype": slug(name),
            "displayName": name,
            "visualLane": f"wave2-{slug(row['faction_guess'])}-{slug(row['stat_axis'])}-t{tier}",
            "status": "approved",
            "reviewImage": f"assets/{art_id}.png",
            "cleanedImage": f"assets/{art_id}.png",
            "sourceImage": "local-source-not-published",
            "notes": row["desc"],
            "runtimeFormId": config["form"],
            "materialId": material,
            "tier": int(tier),
            "statAxis": row["stat_axis"],
            "faction": row["faction_guess"],
            "sourceSha256": row["sha256"],
            "sourceFilename": filename,
        })
        decisions[filename] = {"decision": "approve", "agent_verdict": "promote", "sha256": row["sha256"], "art_id": art_id}

    with MANIFEST.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=MANIFEST_FIELDS, delimiter="\t", lineterminator="\n")
        writer.writeheader()
        writer.writerows(manifest_rows)
    DECISIONS.write_text(json.dumps(decisions, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    write_taxonomy_js(taxonomy_items)

    if len(manifest_rows) != 126:
        raise ValueError(f"expected 126 released rows after QA holds, got {len(manifest_rows)}")
    print(f"released {len(manifest_rows)} approved items")
    print(f"held for QA review: {len(QA_HOLDS)}")
    print(f"wrote {MANIFEST.relative_to(PROJECT)}")
    print(f"wrote {DECISIONS.relative_to(PROJECT)}")
    print(f"wrote {TAXONOMY_JS.relative_to(PROJECT)}")


if __name__ == "__main__":
    main()
