#!/usr/bin/env python3
"""Goal-harness status: coverage vs targets.tsv, budget usage, next queue.

Usage:
  python3 status.py            # coverage + today's usage + prioritized queue
  python3 status.py --prompt ART_ID   # print the full assembled gen prompt

The queue = REGEN.txt first, then missing targets (weapons+armour first).
DESC source: targets.tsv desc column; '-' means art exists (or look up
verdigris-manifest.tsv for legacy rows).
"""
import os
import re
import sys
import json
import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, '..', 'assets')
STAGING = os.path.join(HERE, '..', 'assets_staging')
REVIEW_JS = os.path.join(HERE, 'asset-review.js')

# The style prompt lives in PROMPT.txt (hand-tuned by Alexei - agents
# never edit it). status.py only assembles canvas + PROMPT + DESC.
CANVAS = {
    'P': 'Generate an image, no commentary. Vertical portrait canvas '
         '(2:3 aspect ratio). ',
    'L': 'Generate an image, no commentary. Wide landscape canvas '
         '(3:2 aspect ratio). ',
    'S': 'Generate an image, no commentary. Square canvas (1:1 aspect ratio). ',
}
def _load_style():
    p = os.path.join(HERE, 'PROMPT.txt')
    lines = [ln for ln in open(p).read().split('\n')
             if not ln.lstrip().startswith('#')]
    return re.sub(r'\s+', ' ', ' '.join(lines)).strip()


STYLE = _load_style()
# grey-heavy materials get a blue-grey bg so they don't blend
BLUEGREY = ('skymetal', 'rivetmail', 'flint', 'iron')
MIDGREY_SENT = ("If transparency is impossible, fall back to one flat "
                "uniform mid-grey fill.")
BLUEGREY_SENT = ("If transparency is impossible, fall back to one flat "
                 "uniform blue-grey fill (so the grey metal does not blend "
                 "into it).")


def load_targets():
    rows = []
    with open(os.path.join(HERE, 'targets.tsv')) as f:
        head = f.readline()
        for ln in f:
            p = ln.rstrip('\n').split('\t')
            if len(p) >= 6:
                rows.append(dict(zip(
                    ['art_id', 'cls', 'tier', 'name', 'canvas', 'desc'], p)))
    return rows


def load_review():
    if not os.path.exists(REVIEW_JS):
        return {}
    text = open(REVIEW_JS, encoding='utf-8').read()
    m = re.search(r'VerdigrisAssetReview\s*=\s*(\[[\s\S]*\])\s*;?\s*$',
                  text)
    if not m:
        return {}
    rows = json.loads(m.group(1))
    return {r['name']: r for r in rows if r.get('name')}


def manifest_desc(art_id):
    mf = os.path.join(HERE, 'verdigris-manifest.tsv')
    if os.path.exists(mf):
        for ln in open(mf):
            p = ln.rstrip('\n').split('\t')
            if p and p[0] == art_id and len(p) >= 3:
                return p[2]
    return None


def get_desc(row):
    return row['desc'] if row['desc'] != '-' else manifest_desc(row['art_id'])


def get_review_desc(row, review):
    item = review.get(row['art_id']) if review else None
    if item and item.get('status') == 'rework' and item.get('reworked_desc'):
        return item['reworked_desc']
    return get_desc(row)


def build_prompt(row, review=None):
    desc = get_review_desc(row, review)
    if not desc:
        return None
    body = STYLE.replace('{DESC}', desc)
    if any(m in row['art_id'] for m in BLUEGREY):
        body = body.replace(MIDGREY_SENT, BLUEGREY_SENT)
    return CANVAS[row['canvas']] + body


def main():
    all_rows = load_targets()
    review = load_review()
    discarded = {n for n, r in review.items() if r.get('status') == 'discard'}
    rows = [r for r in all_rows if r['art_id'] not in discarded]
    if len(sys.argv) == 3 and sys.argv[1] == '--prompt':
        if sys.argv[2] in discarded:
            note = review.get(sys.argv[2], {}).get('notes')
            why = f': {note}' if note else ''
            print(f'{sys.argv[2]} is marked discard in asset-review.js{why}')
            return
        row = next((r for r in all_rows if r['art_id'] == sys.argv[2]), None)
        if not row:
            print(f'unknown art_id {sys.argv[2]}'); return
        p = build_prompt(row, review)
        print(p if p else f'no DESC available for {sys.argv[2]} - write one '
              'in targets.tsv (v2 style, ASCII)')
        return

    done = [r for r in rows if os.path.exists(
        os.path.join(ASSETS, r['art_id'] + '.png'))]
    missing = [r for r in rows if r not in done]
    blocked = set()
    bl = os.path.join(HERE, 'BLOCKED.txt')
    if os.path.exists(bl):
        blocked = {x.split('#')[0].strip() for x in open(bl)
                   if x.split('#')[0].strip()}
    missing = [r for r in missing if r['art_id'] not in blocked]
    strikes = {}
    stf = os.path.join(HERE, 'STRIKES.tsv')
    if os.path.exists(stf):
        for ln in open(stf):
            p = ln.rstrip('\n').split('\t')
            if len(p) >= 4 and p[0] != 'name':
                strikes[p[0]] = (int(p[1]), p[2], p[3])
    twostrike = {n for n, (c, _, _) in strikes.items() if c >= 2}
    missing = [r for r in missing if r['art_id'] not in twostrike]
    regen = []
    rg = os.path.join(HERE, 'REGEN.txt')
    if os.path.exists(rg):
        regen = [x.strip() for x in open(rg)
                 if x.strip() and x.strip() not in blocked
                 and x.strip() not in twostrike
                 and x.strip() not in discarded]
    review_rework = [n for n, r in review.items()
                     if r.get('status') == 'rework'
                     and n not in blocked
                     and n not in twostrike
                     and n not in discarded]
    for n in review_rework:
        if n not in regen:
            regen.append(n)

    today = datetime.date.today().isoformat()
    gens_today = 0
    gl = os.path.join(HERE, 'GEN-LOG.md')
    if os.path.exists(gl):
        gens_today = sum(1 for ln in open(gl)
                         if ln.startswith(today) and
                         ('DONE' in ln or 'REDONE' in ln))

    print(f'COVERAGE: {len(done)}/{len(rows)} active targets have finals '
          f'({len(missing)} missing, {len(regen)} queued for regen, '
          f'{len(discarded)} discarded, {len(blocked)} blocked)')
    print(f"BUDGET: {gens_today} gens logged today "
          f"(cap 60/day; waves of 3 parallel chats, ~10/hr sustained)")
    print()
    onestrike = {n: v for n, v in strikes.items() if v[0] == 1}
    if onestrike:
        print('HARVEST FIRST (strike-1 items; check chat for a completed '
              'image BEFORE any re-send; re-send allowed ONCE if empty):')
        for n, (c, path, note) in onestrike.items():
            print(f'  H  {n:<22} {path or "(no chat path)"}  {note}')
        print()
    if regen:
        print('QUEUE - regen/review first (broken items):')
        for n in regen:
            print(f'  R  {n}')
    if missing:
        # reliability-first: image-2 nails armour/solid objects; thin
        # diagonals (polearms) and fiddly smalls go LAST so runs open with
        # wins, not known failure modes.
        prio = {'body': 0, 'shield': 0, 'belt': 0, 'boots': 1, 'bracers': 1,
                'mace': 2, 'great2h': 2, 'sword': 2, 'amulet': 3, 'ring': 3,
                'ritefocus': 4, 'polearm': 9}
        missing.sort(key=lambda r: (prio.get(r['cls'], 5), r['tier']))
        print('QUEUE - missing targets (reliability-first order):')
        for r in missing:
            has_desc = 'desc ready' if get_desc(r) else 'NEEDS DESC'
            print(f"  {r['canvas']}  {r['art_id']:<22} T{r['tier']} "
                  f"{r['name']:<24} [{has_desc}]")
    print()
    print('Per item: python3 status.py --prompt ART_ID -> paste via the JS '
          'recipe in RUNBOOK.md, then qa_gate.py, compose_assets.py '
          '(art_matte.py only for flat fallback backgrounds), log to '
          'GEN-LOG.md')


if __name__ == '__main__':
    main()
