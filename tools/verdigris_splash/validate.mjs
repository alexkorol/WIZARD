import { readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const requiredFiles = ["index.html", "styles.css", "app.js", "README.md"];
const contents = new Map();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const file of requiredFiles) {
  const fullPath = path.join(root, file);
  await stat(fullPath);
  contents.set(file, await readFile(fullPath));
}

const html = contents.get("index.html").toString("utf8");
const css = contents.get("styles.css").toString("utf8");
const app = contents.get("app.js").toString("utf8");

assert(html.includes('id="world"'), "index.html must contain the WebGL canvas");
assert(html.includes('id="fallback"'), "index.html must contain the static fallback");
assert(html.includes('data-view="epic"') && html.includes('data-view="crownlands"'), "scene view selector is incomplete");
assert(html.includes('value="auto"') && html.includes('value="balanced"') && html.includes('value="low"'), "quality controls are incomplete");
assert(app.includes("createTerrainGeometry") && app.includes("heightAt"), "continuous terrain pipeline is missing");
assert(app.includes("createEpicOceanGeometry") && app.includes("createContinentGeometry"), "epic world geometry pipeline is missing");
assert(app.includes("createEpicCapitals") && app.includes("createEpicTrees"), "epic world landmarks are missing");
assert(app.includes("setVariant") && app.includes("activeVariant"), "scene view switching is missing");
assert(app.includes("cameraControl") && app.includes('addEventListener("pointerdown"'), "drag camera controls are missing");
assert(app.includes('addEventListener("wheel"') && app.includes('addEventListener("keydown"'), "zoom or keyboard camera controls are missing");
assert(app.includes("visibilitychange") && app.includes("pagehide"), "lifecycle throttling/disposal hooks are missing");
assert(app.includes("prefers-reduced-motion"), "reduced-motion support is missing");
assert(!/SOUND\s+(?:ON|OFF)/i.test(html + app), "do not expose an inert sound toggle");
assert(!/data:[^;]+;base64,[A-Za-z0-9+/=]{4096,}/.test(html + css + app), "large embedded base64 payload detected");
assert(!/(?:src|href)="http:\/\//i.test(html), "insecure external asset URL detected");

const localRefs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
  .map((match) => match[1])
  .filter((reference) => !reference.startsWith("https://") && !reference.startsWith("data:") && !reference.startsWith("../../"))
  .map((reference) => reference.split("?")[0]);

for (const reference of new Set(localRefs)) {
  await stat(path.join(root, reference));
}

let rawBytes = 0;
let gzipBytes = 0;
const files = {};
for (const [file, buffer] of contents) {
  const gzipped = gzipSync(buffer, { level: 9 });
  rawBytes += buffer.byteLength;
  gzipBytes += gzipped.byteLength;
  files[file] = { rawBytes: buffer.byteLength, gzipBytes: gzipped.byteLength };
}

assert(rawBytes < 1_000_000, `local first-view source is unexpectedly large (${rawBytes} bytes)`);

console.log(JSON.stringify({
  ok: true,
  files,
  total: { rawBytes, gzipBytes },
  externalRuntime: [
    "Three.js 0.180.0 via jsDelivr (MIT)",
    "Cinzel and Inter via Google Fonts (SIL OFL 1.1)",
  ],
}, null, 2));
