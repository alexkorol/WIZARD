#!/usr/bin/env python3
"""Download a curated, public-domain ancient equipment reference library.

The source is The Metropolitan Museum of Art Open Access API.  The catalog is
deliberately object-led: each image has explicit generation roles and a warning
when its decoration should not be propagated into ordinary item art.
"""

from __future__ import annotations

import argparse
import json
import re
import time
import urllib.request
from pathlib import Path


OBJECTS = [
    (703054, "helmet_greaves_corinthian", ["headgear", "legs_footwear"], False),
    (255927, "helmet_cretan_bronze", ["headgear", "bronze_surface"], False),
    (248010, "helmet_picene_bronze", ["headgear", "bronze_surface"], False),
    (247112, "greaves_etruscan_pair", ["legs_footwear", "bronze_surface"], False),
    (326389, "armor_scales_achaemenid", ["body_armor", "scale_layout"], False),
    (255929, "mitra_cretan_bronze", ["body_armor", "plate_layout"], True),
    (324433, "persian_guard_relief", ["body_armor", "headgear", "textile", "carry"], True),
    (27513, "sword_middle_bronze_age", ["long_sword", "blade_proportion"], False),
    (324457, "sword_dagger_hattian", ["short_blade", "long_sword"], False),
    (251786, "dagger_mycenaean_copper", ["short_blade", "blade_proportion"], False),
    (252405, "dagger_minoan_bronze", ["short_blade", "blade_proportion"], False),
    (327326, "axe_luristan_spiked", ["axe_adze", "socket_logic"], True),
    (327327, "axe_luristan_crescent", ["axe_adze", "socket_logic"], True),
    (244473, "mace_cypriot_bronze", ["impact", "mace_proportion"], False),
    (324454, "mace_hattian_bronze", ["impact", "ritual", "mace_proportion"], False),
    (568261, "adze_egyptian_complete", ["axe_adze", "tool", "haft_binding"], False),
    (325125, "adze_head_levantine", ["axe_adze", "tool", "socket_logic"], False),
    (244233, "sickle_cypriot_bronze", ["tool", "curved_blade"], False),
    (244565, "shield_boss_plain", ["shield", "boss_construction"], False),
    (248656, "shield_boss_herringbone", ["shield", "geometric_border"], True),
    (247071, "shield_boss_griffin_sphinx", ["shield", "prestige_ornament"], True),
    (324042, "horse_bit_achaemenid", ["signal", "carry", "tack", "metal_joinery"], False),
    (255363, "horse_bit_villanovan", ["signal", "carry", "tack", "openwork"], True),
    (326604, "bell_iran_iron_age", ["signal", "ritual", "bell_proportion"], False),
    (253623, "mirror_greek_bronze", ["ritual", "mirror", "plain_bronze"], False),
    (323683, "spindle_whorl_iran", ["ritual", "tool", "stone_surface"], False),
    (253310, "spindle_whorl_aegean", ["ritual", "tool", "ceramic_surface"], False),
    (572181, "basket_egyptian_coiled", ["carry", "basketry", "material"], False),
    (544843, "basket_egyptian_palm", ["carry", "basketry", "material"], False),
    (545762, "basket_egyptian_dyed", ["carry", "basketry", "material"], False),
    (443650, "textile_egyptian_linen", ["outer_layer", "hands_arms", "textile", "material"], False),
    (443341, "textile_egyptian_wool_linen", ["outer_layer", "hands_arms", "textile", "material"], True),
    (324036, "palmette_achaemenid_brick", ["motif", "bounded_botanical"], True),
    (559189, "lotus_petal_mold_egyptian", ["motif", "bounded_botanical"], True),
]


def fetch_json(url: str, attempts: int = 5) -> dict:
    request = urllib.request.Request(url, headers={"User-Agent": "Verdigris-reference-research/1.0"})
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.load(response)
        except Exception:
            if attempt + 1 == attempts:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def safe_suffix(url: str) -> str:
    match = re.search(r"\.(jpe?g|png)(?:\?|$)", url, re.IGNORECASE)
    return ".jpg" if not match or match.group(1).lower() in {"jpg", "jpeg"} else ".png"


def download(url: str, destination: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "Verdigris-reference-research/1.0"})
    with urllib.request.urlopen(request, timeout=60) as response:
        destination.write_bytes(response.read())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--refresh", action="store_true")
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    catalog = []
    failures = []
    for index, (object_id, slug, roles, ornament_warning) in enumerate(OBJECTS, 1):
        try:
            data = fetch_json(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{object_id}")
            image_url = data.get("primaryImage") or data.get("primaryImageSmall")
            if not image_url:
                raise ValueError("no public image")
            filename = f"met_{object_id}_{slug}{safe_suffix(image_url)}"
            destination = args.output / filename
            if args.refresh or not destination.is_file():
                download(image_url, destination)
            catalog.append({
                "id": object_id,
                "title": data.get("title"),
                "date": data.get("objectDate"),
                "culture": data.get("culture"),
                "period": data.get("period"),
                "medium": data.get("medium"),
                "roles": roles,
                "ornament_warning": ornament_warning,
                "public_domain": bool(data.get("isPublicDomain")),
                "url": data.get("objectURL"),
                "image_url": image_url,
                "file": str(destination),
            })
        except Exception as exc:
            failures.append({"id": object_id, "slug": slug, "error": str(exc)})
        time.sleep(0.35 if index % 5 else 1.0)

    (args.output / "historical_reference_catalog.json").write_text(
        json.dumps(catalog, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (args.output / "historical_reference_failures.json").write_text(
        json.dumps(failures, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(json.dumps({"cataloged": len(catalog), "failures": len(failures), "output": str(args.output)}, indent=2))


if __name__ == "__main__":
    main()
