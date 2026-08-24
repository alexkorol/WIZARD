"""QA harness for landed FRAMEKIT wave-1 (read-only)."""
from __future__ import annotations

import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
BASE = "http://127.0.0.1:8162"
OUT = Path(__file__).resolve().parent
EVID = OUT / "evidence"
EVID.mkdir(parents=True, exist_ok=True)

PAGES = [
    "/tools/gui_framekit/demo/showcase.html",
    "/tools/gui_framekit/assets/demo.html",
    "/tools/gui_framekit/index.html",
    "/tools/gui_framekit/components/controls/button/demo.html",
    "/tools/gui_framekit/components/controls/input/demo.html",
    "/tools/gui_framekit/components/controls/slider/demo.html",
    "/tools/gui_framekit/components/controls/toggle/demo.html",
    "/tools/gui_framekit/components/controls/tabs/demo.html",
    "/tools/gui_framekit/components/hud/bar/demo.html",
    "/tools/gui_framekit/components/hud/globe/demo.html",
    "/tools/gui_framekit/components/hud/orb/demo.html",
    "/tools/gui_framekit/components/hud/meter/demo.html",
    "/tools/gui_framekit/components/hud/buff-icon/demo.html",
    "/tools/gui_framekit/components/inventory/grid/demo.html",
    "/tools/gui_framekit/components/inventory/slot/demo.html",
    "/tools/gui_framekit/components/inventory/item-tooltip/demo.html",
    "/tools/gui_framekit/components/inventory/drag-ghost/demo.html",
    "/tools/gui_framekit/components/overlays/modal/demo.html",
    "/tools/gui_framekit/components/overlays/menu/demo.html",
    "/tools/gui_framekit/components/overlays/toast/demo.html",
    "/tools/gui_framekit/components/overlays/context-menu/demo.html",
    "/tools/gui_framekit/components/frames/window/demo.html",
    "/tools/gui_framekit/components/frames/panel/demo.html",
    "/tools/gui_framekit/components/frames/dialog/demo.html",
]


def http_status(url: str) -> tuple[int, str]:
    try:
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, ""
    except urllib.error.HTTPError as e:
        return e.code, str(e.reason)
    except Exception as e:  # noqa: BLE001
        return 0, str(e)


def extract_refs(html: str, page_url: str) -> list[str]:
    refs = re.findall(
        r"""(?:href|src)\s*=\s*["']([^"']+)["']""", html, flags=re.I
    )
    out = []
    for ref in refs:
        if ref.startswith("#") or ref.startswith("data:") or ref.startswith("mailto:"):
            continue
        if ref.startswith("http://") or ref.startswith("https://"):
            out.append(ref)
            continue
        base = page_url.rsplit("/", 1)[0] + "/"
        out.append(urllib.request.urljoin(base, ref))
    return out


def main() -> int:
    transcript: list[str] = []
    js_path = ROOT / "tools/gui_framekit/components/controls/tabs/tabs.js"
    chk = subprocess.run(
        ["node", "--check", str(js_path)], capture_output=True, text=True
    )
    transcript.append(
        f"$ node --check {js_path.relative_to(ROOT)}\n"
        f"exit={chk.returncode}\nstdout={chk.stdout!r}\nstderr={chk.stderr!r}"
    )

    http_rows = []
    for path in PAGES:
        code, reason = http_status(BASE + path)
        http_rows.append((code, path, reason))
        transcript.append(f"HEAD {path} -> {code} {reason}".rstrip())

    # Follow stylesheet/script refs from 200 HTML pages
    extra = []
    for code, path, _ in http_rows:
        if code != 200 or not path.endswith(".html"):
            continue
        with urllib.request.urlopen(BASE + path, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="replace")
        for ref in extract_refs(html, BASE + path):
            if ref.startswith(BASE):
                extra.append(ref[len(BASE) :] or "/")
    seen = {p for _, p, _ in http_rows}
    for path in sorted(set(extra)):
        if path in seen:
            continue
        code, reason = http_status(BASE + path)
        transcript.append(f"HEAD (linked) {path} -> {code} {reason}".rstrip())
        http_rows.append((code, path, reason))

    console_by_page: dict[str, list[str]] = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        for path in PAGES:
            logs: list[str] = []
            page = context.new_page()

            def on_console(msg, _logs=logs) -> None:
                _logs.append(f"console.{msg.type}: {msg.text}")

            def on_page_error(err, _logs=logs) -> None:
                _logs.append(f"pageerror: {err}")

            def on_request_failed(req, _logs=logs) -> None:
                _logs.append(f"requestfailed: {req.method} {req.url} {req.failure}")

            page.on("console", on_console)
            page.on("pageerror", on_page_error)
            page.on("requestfailed", on_request_failed)
            url = BASE + path
            resp = page.goto(url, wait_until="domcontentloaded", timeout=20000)
            page.wait_for_timeout(400)
            slug = path.strip("/").replace("/", "__")
            png = EVID / f"{slug}.png"
            page.screenshot(path=str(png), full_page=True)
            status = None if resp is None else resp.status
            console_by_page[path] = logs
            transcript.append(
                f"LOAD {path} http={status} screenshot={png.name} console_lines={len(logs)}"
            )
            for line in logs:
                transcript.append(f"  {line}")
            page.close()
        browser.close()

    (OUT / "transcript.txt").write_text("\n".join(transcript) + "\n", encoding="utf-8")
    (OUT / "console.json").write_text(
        json.dumps(console_by_page, indent=2), encoding="utf-8"
    )
    print("\n".join(transcript))
    return 0


if __name__ == "__main__":
    sys.exit(main())
