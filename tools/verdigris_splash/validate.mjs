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
const runtimeModelPath = path.join(root, "assets", "world", "celestial_world_runtime_tapered.glb");
const runtimeModel = await stat(runtimeModelPath);
const blenderScript = await readFile(path.join(root, "tools", "blender_taper_world.py"), "utf8");
const topTexturePath = path.join(root, "assets", "world", "celestial_world_top_texture_4k_detail.webp");
const topTexture = await stat(topTexturePath);
const topTextureMasterPath = path.join(root, "assets", "world", "celestial_world_top_texture_4k_detail.png");
const topTextureMaster = await stat(topTextureMasterPath);
const undersideDepthmapPath = path.join(root, "assets", "world", "celestial_world_underside_depthmap_16bit.png");
const undersideDepthmap = await stat(undersideDepthmapPath);
await stat(path.join(root, "assets", "world", "celestial_world_underside_topographic_reference.png"));
const undersideTexture = await stat(path.join(root, "assets", "world", "celestial_world_underside_texture.png"));
const illuminationMap = await stat(path.join(root, "assets", "world", "celestial_world_illumination_map_4k.png"));
const illuminationManifest = JSON.parse(await readFile(path.join(root, "assets", "world", "illumination_tiles", "manifest.json"), "utf8"));
await stat(path.join(root, "assets", "world", "celestial_world_illumination_concept_image2.png"));
await stat(path.join(root, "assets", "world", "celestial_world_illumination_prompt.txt"));
await stat(path.join(root, "tools", "build_illumination_map.py"));
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
assert(app.includes("createVolumetricWeather") && app.includes("Ray-marched regional atmosphere") && app.includes("uCameraLocal"), "ray-marched volumetric weather is missing");
assert(app.includes("createRegionalLightning") && app.includes("sunGlint"), "regional lightning or shimmering ocean is missing");
assert(app.includes("createSpectacleHalos") && app.includes("createStormCrown") && app.includes("createWaterfallHalos"), "cinematic weather, storm, or waterfall radiance is missing");
assert(app.includes("GLTFLoader") && app.includes("celestial_world_runtime_tapered.glb?v=2"), "current Blender-refined Meshy world loader is missing");
assert(app.includes("celestial_world_top_texture_4k_detail.webp") && app.includes("uWorldTopMap"), "4K top-surface texture projection is missing");
assert(app.includes("celestial_world_underside_texture.png") && app.includes("epicUndersideTexture"), "sculpted underside texture is missing");
assert(app.includes("createEpicStalactites") && app.includes("createEpicIceWallGeometry"), "procedural fallback underside is missing");
assert(!app.includes("createWorldCore") && !app.includes("worldCore"), "the rejected glowing underside orb/core has returned");
assert(app.includes("const proceduralEpicGeography = [\n    epicUnderside") && !app.includes("const proceduralEpicGeography = [\n    epicOcean"), "generated underside overlays must be hidden while the stable reflective sea remains");
assert(app.includes("seaMask < 0.055") && app.includes("skyReflection") && app.includes("sunGlint") && app.includes("sparkle"), "stable reflective water skin is missing");
assert(app.includes("fineTopographyGradient") && app.includes("wideTopographyGradient") && app.includes("flowDirection") && app.includes("topographicFoam") && app.includes("foamZone"), "multi-scale heightmap-directed ocean motion is missing");
assert(app.includes("deepOcean") && app.includes("shallowOcean") && app.includes("depthColor") && !app.includes("atlasColor * vec3(0.68, 0.8, 0.92)"), "heightmap-controlled deep and shallow water color is missing");
assert(app.includes("meshDeepOcean") && app.includes("meshShallowOcean") && app.includes("meshDepthColor") && app.includes("projectedTopColor"), "solid imported sea is bypassing heightmap depth colors");
assert(!app.includes("worldTopColor * vec3(0.96, 0.99, 1.02)"), "inverted atlas sea color is being reintroduced beneath the reflective ocean");
assert(app.includes("celestial_world_illumination_map_4k.png?v=1") && app.includes("uWorldIlluminationMap") && app.includes("totalEmissiveRadiance"), "stitched world illumination map is not active");
assert(app.includes("lavaSignal") && app.includes("reefSignal") && app.includes("groveSignal"), "biome-specific illumination controls are missing");
assert(!app.includes("dot(vWorld.xz, vec2(5.7, 1.8))") && app.includes("dot(reflectionUv, flowDirection)"), "fixed-direction ocean reflection streaks have returned");
assert(blenderScript.includes("soften_summits") && blenderScript.includes("softened_summit_vertices"), "Blender summit softening pass is missing");
assert(app.includes("* 0.1 * topFacing") && app.includes("* 0.12 * topFacing * landRelief"), "runtime terrain is over-extruding the refined summits");
assert(app.includes("sunRoadBase") && app.includes("sunRoadSpark") && app.includes("uSunWorld") && app.includes("grazingReflection"), "grazing-angle ocean sun road is missing");
assert(app.includes("uWorldUndersideMap") && !app.includes("vUndersidePosition.y < -0.04) discard"), "the authored Meshy underside is not being rendered");
assert(app.includes("Depth-stacked volumetric auroras") && app.includes("auroraLayers") && app.includes("nebula"), "depth-stacked aurora or nebula atmosphere is missing");
assert(app.includes("setVariant") && app.includes("activeVariant"), "scene view switching is missing");
assert(app.includes("cameraControl") && app.includes('addEventListener("pointerdown"'), "drag camera controls are missing");
assert(app.includes('addEventListener("wheel"') && app.includes('addEventListener("keydown"'), "zoom or keyboard camera controls are missing");
assert(app.includes("visibilitychange") && app.includes("pagehide"), "lifecycle throttling/disposal hooks are missing");
assert(app.includes("prefers-reduced-motion"), "reduced-motion support is missing");
assert(html.includes('class="tilt-shift"') && css.includes("backdrop-filter: blur(5.5px)") && css.includes("height: 34%"), "visible graded tilt-shift focus treatment is missing");
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
assert(illuminationMap.size < 3_000_000, `4K illumination map is unexpectedly large (${illuminationMap.size} bytes)`);
assert(illuminationManifest.tiles?.length === 16 && illuminationManifest.overlap === 96, "illumination-map tile stitch manifest is invalid");
const gameBounds = buildReport.game_bounds;
const gameWidth = gameBounds[1][0] - gameBounds[0][0];
const gameDepth = gameBounds[1][2] - gameBounds[0][2];
assert(Math.abs(gameWidth / gameDepth - 1) < 0.06, `runtime world is squashed (${gameWidth.toFixed(2)} x ${gameDepth.toFixed(2)})`);
assert(buildReport.blender_refinement?.refined_summit_y < 0.9, "refined Blender summit height is still excessive");
assert(buildReport.blender_refinement?.softened_summit_vertices > 100, "Blender summit refinement did not affect enough vertices");

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
