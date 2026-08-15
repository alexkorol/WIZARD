#!/usr/bin/env python3
"""Build the post-calib wave-2 review sheet.

Reads the wave-2 triage TSV (agent-classified verdict/slot/tier/stat/faction
per file), renders compact JPEG thumbnails into
`review_assets/post-calib-wave2/`, and writes a static review page at
`../post-calib-wave2-review.html` with localStorage decisions and a JSON
export, following the intake-review.html pattern.

Usage:
    python core/build_wave2_review.py \
        --triage core/expansion_drafts/post-calib-triage-wave2.tsv \
        --source "C:/Users/Alex/Downloads/items_post_calib_batch"

Thumbnails are only rebuilt when missing, so re-running after TSV edits is
cheap. Rejected rows get thumbnails too: the whole point of the sheet is that
Alex can overturn any verdict.
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
THUMB_DIR = ROOT / "review_assets" / "post-calib-wave2"
PAGE = ROOT / "post-calib-wave2-review.html"
THUMB_EDGE = 448


def build_thumbs(rows: list[dict], source: Path) -> None:
    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    for row in rows:
        src = source / row["filename"]
        dst = THUMB_DIR / (Path(row["filename"]).stem + ".jpg")
        row["thumb"] = f"review_assets/post-calib-wave2/{dst.name}"
        if dst.exists() or not src.exists():
            continue
        with Image.open(src) as im:
            im = im.convert("RGB")
            im.thumbnail((THUMB_EDGE, THUMB_EDGE), Image.LANCZOS)
            im.save(dst, "JPEG", quality=82, optimize=True)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--triage", default=str(ROOT / "core/expansion_drafts/post-calib-triage-wave2.tsv"))
    ap.add_argument("--source", default="C:/Users/Alex/Downloads/items_post_calib_batch")
    args = ap.parse_args()

    with open(args.triage, encoding="utf-8") as fh:
        rows = list(csv.DictReader(fh, delimiter="\t"))
    rows.sort(key=lambda r: ({"promote": 0, "review": 1, "reject": 2}.get(r["verdict"], 3), r["slot_guess"], r["filename"]))
    build_thumbs(rows, Path(args.source))

    data = json.dumps(rows, ensure_ascii=True)
    counts = {}
    for r in rows:
        counts[r["verdict"]] = counts.get(r["verdict"], 0) + 1

    html = PAGE_TEMPLATE.replace("__DATA__", data).replace(
        "__SUBTITLE__",
        f"{len(rows)} images &middot; {counts.get('promote', 0)} promote / "
        f"{counts.get('review', 0)} review / {counts.get('reject', 0)} reject "
        f"&middot; agent-proposed labels, decisions are yours",
    )
    PAGE.write_text(html, encoding="utf-8")
    print(f"wrote {PAGE} ({len(rows)} rows), thumbs in {THUMB_DIR}")


PAGE_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Post-Calib Wave 2 Review</title>
<style>
  :root {
    --bg: #121417; --panel: #1c2026; --panel2: #252a32; --edge: #343b46;
    --ink: #ece8df; --dim: #a2a8b3; --ok: #8ac286; --warn: #e3b15d;
    --bad: #dd7474; --accent: #83c7d5; --gold: #c9a227;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink);
    font: 14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  header { position: sticky; top: 0; z-index: 10; display: flex; gap: 12px; flex-wrap: wrap;
    align-items: center; padding: 10px 16px; background: var(--panel);
    border-bottom: 1px solid var(--edge); }
  h1 { margin: 0; font-size: 16px; font-weight: 650; }
  .stat { color: var(--dim); font-size: 12px; }
  .spacer { flex: 1; }
  button, select { color: var(--ink); background: var(--panel2); border: 1px solid var(--edge);
    border-radius: 7px; padding: 6px 10px; font: inherit; cursor: pointer; }
  button:hover { border-color: var(--accent); }
  main { padding: 16px; display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px; }
  .card { background: var(--panel); border: 1px solid var(--edge); border-radius: 8px; overflow: hidden;
    display: flex; flex-direction: column; }
  .card.v-promote { border-color: rgba(138,194,134,.55); }
  .card.v-review { border-color: rgba(227,177,93,.45); }
  .card.v-reject { opacity: .82; }
  .thumb { height: 240px; display: flex; align-items: center; justify-content: center; background: #30343a; cursor: zoom-in; }
  .thumb img { max-width: 100%; max-height: 100%; }
  .body { padding: 10px; display: grid; gap: 7px; }
  .line { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; min-width: 0; }
  .name { font-weight: 650; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
  .pill { border-radius: 999px; padding: 1px 8px; font-size: 11px; color: #11161a; background: var(--accent); }
  .pill.promote { background: var(--ok); } .pill.review { background: var(--warn); } .pill.reject { background: var(--bad); }
  .tag { font-size: 11px; color: var(--dim); border: 1px solid var(--edge); border-radius: 5px; padding: 0 6px; }
  .tag.gold { color: var(--gold); border-color: rgba(201,162,39,.4); }
  .desc { font-size: 12px; color: var(--dim); }
  .why { font-size: 11px; color: var(--dim); font-style: italic; }
  .decide { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
  .decide button { padding: 5px 0; font-size: 12px; }
  .decide button.on-approve { background: var(--ok); color: #101510; border-color: var(--ok); }
  .decide button.on-hold { background: var(--warn); color: #15110a; border-color: var(--warn); }
  .decide button.on-discard { background: var(--bad); color: #1a1010; border-color: var(--bad); }
  textarea { width: 100%; color: var(--ink); background: var(--panel2); border: 1px solid var(--edge);
    border-radius: 6px; padding: 5px 7px; font: 12px/1.35 inherit; min-height: 34px; resize: vertical; }
  #zoom { position: fixed; inset: 0; display: none; align-items: center; justify-content: center;
    background: rgba(0,0,0,.85); z-index: 30; cursor: zoom-out; }
  #zoom img { max-width: 94vw; max-height: 94vh; }
  #exportPane { position: fixed; inset: 0; display: none; align-items: center; justify-content: center;
    background: rgba(0,0,0,.62); z-index: 20; }
  #exportPane .inner { width: min(900px, 92vw); max-height: 88vh; overflow: auto;
    background: var(--panel); border: 1px solid var(--edge); border-radius: 10px; padding: 14px; }
  #exportText { min-height: 360px; font-family: ui-monospace, Menlo, Consolas, monospace; }
</style>
</head>
<body>
<header>
  <h1>Post-Calib Wave 2 Review</h1>
  <div class="stat">__SUBTITLE__</div>
  <div class="spacer"></div>
  <select id="fVerdict"><option value="">all verdicts</option><option>promote</option><option>review</option><option>reject</option></select>
  <select id="fSlot"><option value="">all slots</option></select>
  <select id="fFaction"><option value="">all factions</option></select>
  <button id="exportBtn">Export Decisions</button>
  <button id="resetBtn">Reset</button>
</header>
<main id="grid"></main>
<div id="zoom"><img alt=""></div>
<div id="exportPane"><div class="inner">
  <div class="line"><b>Decision export</b><div class="spacer"></div><button id="copyBtn">Copy</button><button id="closeBtn">Close</button></div>
  <p class="stat">Paste this back to the agent. Undecided rows are omitted.</p>
  <textarea id="exportText" readonly></textarea>
</div></div>
<script>
const ITEMS = __DATA__;
const KEY = "verdigris_wave2_review_v1";
let state = JSON.parse(localStorage.getItem(KEY) || "{}");
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function st(f) { return state[f] || (state[f] = { decision: "", notes: "" }); }

const slots = [...new Set(ITEMS.map(i => i.slot_guess))].sort();
const factions = [...new Set(ITEMS.map(i => i.faction_guess))].sort();
slots.forEach(s => fSlot.add(new Option(s)));
factions.forEach(f => fFaction.add(new Option(f)));

function render() {
  const fv = fVerdict.value, fs = fSlot.value, ff = fFaction.value;
  grid.innerHTML = "";
  ITEMS.filter(i => (!fv || i.verdict === fv) && (!fs || i.slot_guess === fs) && (!ff || i.faction_guess === ff))
    .forEach(item => {
      const s = st(item.filename);
      const card = document.createElement("section");
      card.className = "card v-" + item.verdict;
      card.innerHTML = `
        <div class="thumb"><img loading="lazy" src="${item.thumb}" alt=""></div>
        <div class="body">
          <div class="line"><span class="pill ${item.verdict}">${item.verdict}</span>
            <span class="tag">${item.slot_guess}</span>
            <span class="tag gold">${item.tier_guess} &middot; ${item.stat_axis}</span>
            <span class="tag">${item.faction_guess} (${item.confidence})</span></div>
          <div class="name" title="${item.filename}">${item.filename}</div>
          <div class="desc">${item.desc}</div>
          <div class="why">${item.reason}</div>
          <div class="decide">
            ${["approve","hold","discard"].map(d =>
              `<button data-d="${d}" class="${s.decision === d ? "on-" + d : ""}">${d}</button>`).join("")}
          </div>
          <textarea placeholder="notes / corrections (slot, tier, axis, faction)">${s.notes}</textarea>
        </div>`;
      card.querySelector(".thumb").onclick = () => {
        const z = document.getElementById("zoom");
        z.querySelector("img").src = item.thumb; z.style.display = "flex";
      };
      card.querySelectorAll("button[data-d]").forEach(b => {
        b.onclick = () => { s.decision = s.decision === b.dataset.d ? "" : b.dataset.d; save(); render(); };
      });
      card.querySelector("textarea").oninput = e => { s.notes = e.target.value; save(); };
      grid.appendChild(card);
    });
}
zoom.onclick = () => zoom.style.display = "none";
[fVerdict, fSlot, fFaction].forEach(el => el.onchange = render);
exportBtn.onclick = () => {
  const out = {};
  ITEMS.forEach(i => { const s = state[i.filename];
    if (s && (s.decision || s.notes)) out[i.filename] = { ...s, agent_verdict: i.verdict, sha256: i.sha256 }; });
  exportText.value = JSON.stringify(out, null, 2);
  exportPane.style.display = "flex";
};
copyBtn.onclick = () => navigator.clipboard.writeText(exportText.value);
closeBtn.onclick = () => exportPane.style.display = "none";
resetBtn.onclick = () => { if (confirm("Clear all local decisions?")) { state = {}; save(); render(); } };
render();
</script>
</body>
</html>
"""


if __name__ == "__main__":
    main()
