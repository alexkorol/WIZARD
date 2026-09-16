#!/usr/bin/env python3
"""Build index.html from src/template.html + src/orb.frag + src/assets/*.

The demo ships as a single self-contained HTML file: the fragment shader and
all five image plates are inlined (shader as text, images as base64), so the
output needs no server-side anything and works on GitHub Pages as-is.

Usage:  python3 build.py
"""
import base64
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
ASSETS = SRC / "assets"

def b64(name: str) -> str:
    return base64.b64encode((ASSETS / name).read_bytes()).decode()

template = (SRC / "template.html").read_text()
frag = (SRC / "orb.frag").read_text()

out = (template
       .replace("__FRAG__", frag)
       .replace("__ART__",   b64("art.jpg"))
       .replace("__MASK__",  b64("mask.png"))
       .replace("__NORM__",  b64("normal_aligned.jpg"))
       .replace("__EMPTY__", b64("empty_aligned.jpg"))
       .replace("__PACK__",  b64("pack_aligned.jpg"))
       .replace("__STONE__", b64("stone_aligned.jpg")))

(ROOT / "index.html").write_text(out)
print(f"index.html written ({len(out)//1024} KB)")
