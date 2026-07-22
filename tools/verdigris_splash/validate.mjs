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
const runtimeModelPath = path.join(root, "assets", "world", "celestial_world_runtime.glb");
const runtimeModel = await stat(runtimeModelPath);
const topTexturePath = path.join(root, "assets", "world", "celestial_world_top_texture_4k_detail.webp");
const topTexture = await stat(topTexturePath);
const topTextureMasterPath = path.join(root, "assets", "world", "celestial_world_top_texture_4k_detail.png");
const topTextureMaster = await stat(topTextureMasterPath);
const undersideDepthmapPath = path.join(root, "assets", "world", "celestial_world_underside_depthmap_16bit.png");
const undersideDepthmap = await stat(undersideDepthmapPath);
await stat(path.join(root, "assets", "world", "celestial_world_underside_topographic_reference.png"));
const undersideTexture = await stat(path.join(root, "assets", "world", "celestial_world_underside_texture.png"));
const buildReport = JSON.parse(await readFile(path.join(root, "assets", "world", "celestial_world_build_report.json"), "utf8"));

assert(html.includes('id="world"'), "index.html must contain the WebGL canvas");
assert(html.includes('id="fallback"'), "index.html must contain the static fallback");
assert(html.includes('data-view="epic"') && html.includes('data-view="crownlands"'), "scene view selector is incomplete");
assert(html.includes('value="auto"') && html.includes('value="balanced"') && html.includes('value="low"'), "quality controls are incomplete");
assert(html.includes('type="importmap"') && html.includes('"three"'), "Three.js import map is missing");
assert(app.includes("createTerrainGeometry") && app.includes("heightAt"), "continuous terrain pipeline is missing");
assert(app.includes("createEpicOceanGeometry") && app.includes("createContinentGeometry"), "epic world geometry pipeline is missing");
assert(app.includes("createEpicCapitals") && app.includes("createEpicTrees"), "epic world landmarks are missing");
assert(app.includes("createEpicShallowsGeometry") && app.includes("createEpicRoutes"), "world coast or route detail is missing");
assert(app.includes("createEpicCityLights") && app.includes("createEpicBeaconMesh"), "world activation details are missing");
assert(app.includes("createRegionalWeather") && app.includes("createRegionalLightning") && app.includes("sunGlint"), "regional weather or shimmering ocean is missing");
assert(app.includes("createSpectacleHalos") && app.includes("createStormCrown") && app.includes("createWaterfallHalos"), "cinematic weather, storm, or waterfall radiance is missing");
assert(app.includes("GLTFLoader") && app.includes("celestial_world_runtime.glb"), "optimized Meshy world loader is missing");
assert(app.includes("celestial_world_top_texture_4k_detail.webp") && app.includes("uWorldTopMap"), "4K top-surface texture projection is missing");
assert(app.includes("celestial_world_underside_texture.png") && app.includes("epicUndersideTexture"), "sculpted underside texture is missing");
assert(app.includes("createEpicStalactites") && app.includes("createEpicIceWallGeometry"), "spinning-top underside or broken ice rim is missing");
assert(app.includes("const proceduralEpicGeography = [\n    epicShallows") && !app.includes("const proceduralEpicGeography = [\n    epicOcean"), "animated ocean must remain visible over the shaded atlas");
assert(app.includes("createAuroraCurtains") && app.includes("nebula"), "aurora or nebula atmosphere is missing");
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
assert(runtimeModel.size < 4_000_000, `runtime world model is unexpectedly large (${runtimeModel.size} bytes)`);
assert(topTexture.size < 5_000_000, `4K runtime top-surface texture is unexpectedly large (${topTexture.size} bytes)`);
assert(topTextureMaster.size < 25_000_000, `4K master top-surface texture is unexpectedly large (${topTextureMaster.size} bytes)`);
assert(undersideTexture.size < 3_000_000, `underside texture is unexpectedly large (${undersideTexture.size} bytes)`);
const gameBounds = buildReport.game_bounds;
const gameWidth = gameBounds[1][0] - gameBounds[0][0];
const gameDepth = gameBounds[1][2] - gameBounds[0][2];
assert(Math.abs(gameWidth / gameDepth - 1) < 0.06, `runtime world is squashed (${gameWidth.toFixed(2)} x ${gameDepth.toFixed(2)})`);

console.log(JSON.stringify({
  ok: true,
  files,
  total: { rawBytes, gzipBytes },
  runtimeModel: { rawBytes: runtimeModel.size },
  topTexture: { rawBytes: topTexture.size },
  topTextureMaster: { rawBytes: topTextureMaster.size },
  undersideTexture: { rawBytes: undersideTexture.size },
  undersideDepthmap: { rawBytes: undersideDepthmap.size },
  externalRuntime: [
    "Three.js 0.180.0 via jsDelivr (MIT)",
    "Cinzel and Inter via Google Fonts (SIL OFL 1.1)",
  ],
}, null, 2));
