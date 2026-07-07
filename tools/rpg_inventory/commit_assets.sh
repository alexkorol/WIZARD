#!/usr/bin/env bash
# Commit + push the Verdigris asset set. Run this on your Mac (not the sandbox):
#   cd ~/Code/WIZARD && bash tools/rpg_inventory/commit_assets.sh
#
# Why this script exists: the Cowork sandbox mounts this folder without
# delete/rename permission, so git couldn't finish there. It made a stray local
# "test" commit (unpushed) and left stale .git lock files. This cleans both up
# and commits the real set to gh-pages.
set -e
cd "$(git rev-parse --show-toplevel)"

echo "==> clearing stale sandbox lock files"
rm -f .git/HEAD.lock .git/ORIG_HEAD.lock .git/index.lock

echo "==> dropping stray 'test' commit, resyncing to origin/gh-pages (files kept)"
git fetch origin gh-pages
git reset --mixed origin/gh-pages

echo "==> staging assets + scripts (mask backups excluded via .gitignore)"
git add tools/rpg_inventory/assets \
        tools/rpg_inventory/assets_staging/*.png \
        tools/rpg_inventory/assets_staging/.gitignore \
        tools/rpg_inventory/core \
        tools/rpg_inventory/review.html

echo "==> commit"
git commit -m "assets(rpg_inventory): complete verdigris set + local art-derived mattes

- regenerate all 59 item mattes directly from the art (core/art_matte.py),
  replacing the generative Gemini mattes that left holes and stray black blobs.
  Deterministic luma threshold + border flood-fill silhouettes with robust hole
  handling: keeps genuine see-through holes (ring centres, sling gaps) open and
  fills dark concave surfaces (e.g. the blood_omen bowl interior) solid.
- add blood_omen art (final missing item) and recompose all finals.
- add review.html asset-QA dashboard (flag items, tag failure modes, rework
  prompts, export).
- ASSET-BRIEF / manifest / helper-script updates.

Generated via Cowork batch."

echo "==> push"
git push origin gh-pages
echo "==> done. gh-pages updated."
