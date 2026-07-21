"""Build Verdigris menu-world assets from a dense Meshy binary STL.

The source is Z-up. The largest connected body is the floating world; the
second-largest body is the unwanted moon. The top-view raster takes the maximum
Z at each XY location, so underside stalactites never enter the height field.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
import trimesh


WORLD_RX = 7.4
WORLD_RZ = 7.4
WORLD_WATER_LEVEL = 0.14
WORLD_BOTTOM = -4.8


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Meshy STL to process")
    parser.add_argument("--output", type=Path, required=True, help="Output asset directory")
    parser.add_argument("--heightmap-size", type=int, default=2048)
    parser.add_argument("--target-faces", type=int, default=120_000)
    return parser.parse_args()


def largest_world(source: Path) -> tuple[trimesh.Trimesh, list[dict[str, object]], int]:
    mesh = trimesh.load_mesh(source, process=True)
    if not isinstance(mesh, trimesh.Trimesh):
        mesh = trimesh.util.concatenate(tuple(mesh.geometry.values()))
    source_faces = len(mesh.faces)
    components = sorted(mesh.split(only_watertight=False), key=lambda item: len(item.faces), reverse=True)
    if not components:
        raise RuntimeError("STL contains no mesh components")
    component_report = [
        {
            "rank": index + 1,
            "faces": int(len(part.faces)),
            "vertices": int(len(part.vertices)),
            "bounds": np.asarray(part.bounds).round(6).tolist(),
        }
        for index, part in enumerate(components[:8])
    ]
    world = components[0].copy()
    world.update_faces(world.nondegenerate_faces())
    world.update_faces(world.unique_faces())
    world.remove_unreferenced_vertices()
    return world, component_report, source_faces


def raster_top_surface(mesh: trimesh.Trimesh, size: int) -> tuple[np.ndarray, np.ndarray, dict[str, float]]:
    vertices = np.asarray(mesh.vertices)
    xy_min = vertices[:, :2].min(axis=0)
    xy_max = vertices[:, :2].max(axis=0)
    center = (xy_min + xy_max) * 0.5
    span = float(np.max(xy_max - xy_min) * 1.035)
    square_min = center - span * 0.5

    px = (vertices[:, 0] - square_min[0]) / span * (size - 1)
    py = size - 1 - (vertices[:, 1] - square_min[1]) / span * (size - 1)

    # Painter-style top z-buffer. Upward-facing faces are the only surfaces a
    # top camera can see; sorting low-to-high lets the actual terrain overwrite
    # any upward-facing folds on the underside. Rasterizing faces (not merely
    # vertices) avoids Voronoi-like speckling around peaks and sharp ridges.
    face_normals = np.asarray(mesh.face_normals)
    face_ids = np.flatnonzero(face_normals[:, 2] > 0.002)
    face_heights = vertices[np.asarray(mesh.faces)[face_ids], 2].mean(axis=1)
    face_ids = face_ids[np.argsort(face_heights)]
    height_image = Image.new("I", (size, size), 0)
    mask_image = Image.new("L", (size, size), 0)
    height_draw = ImageDraw.Draw(height_image)
    mask_draw = ImageDraw.Draw(mask_image)
    faces = np.asarray(mesh.faces)
    for face_id in face_ids:
        face = faces[face_id]
        polygon = [(float(px[index]), float(py[index])) for index in face]
        encoded_height = max(1, int(round(float(vertices[face, 2].mean()) * 1000)))
        height_draw.polygon(polygon, fill=encoded_height)
        mask_draw.polygon(polygon, fill=255)
    top = np.asarray(height_image, dtype=np.float32) / 1000.0
    known = np.asarray(mask_image, dtype=np.uint8) > 0

    # Seal only sub-pixel raster gaps, then recover a continuous ocean disc.
    footprint = ndimage.binary_closing(known, iterations=2)
    footprint = ndimage.binary_fill_holes(footprint)
    footprint = ndimage.binary_opening(footprint, iterations=1)

    nearest = ndimage.distance_transform_edt(~known, return_distances=False, return_indices=True)
    filled = top[tuple(nearest)]
    filled[~footprint] = np.nan

    valid = filled[footprint]
    lo, hi = np.quantile(valid, [0.01, 0.998])
    histogram, edges = np.histogram(valid[(valid > np.quantile(valid, 0.35))], bins=1024)
    sea_index = int(np.argmax(histogram))
    sea_level = float((edges[sea_index] + edges[sea_index + 1]) * 0.5)
    metadata = {
        "xy_center_x": float(center[0]),
        "xy_center_y": float(center[1]),
        "xy_square_span": span,
        "height_floor": float(lo),
        "height_ceiling": float(hi),
        "sea_level_estimate": sea_level,
    }
    return filled, footprint, metadata


def raster_bottom_surface(
    mesh: trimesh.Trimesh,
    size: int,
    raster_metadata: dict[str, float],
) -> tuple[np.ndarray, np.ndarray, dict[str, float]]:
    """Rasterize the lowest visible Z surface while keeping top-map alignment."""
    vertices = np.asarray(mesh.vertices)
    span = raster_metadata["xy_square_span"]
    center = np.array([
        raster_metadata["xy_center_x"],
        raster_metadata["xy_center_y"],
    ])
    square_min = center - span * 0.5
    px = (vertices[:, 0] - square_min[0]) / span * (size - 1)
    py = size - 1 - (vertices[:, 1] - square_min[1]) / span * (size - 1)

    face_normals = np.asarray(mesh.face_normals)
    face_ids = np.flatnonzero(face_normals[:, 2] < -0.002)
    face_heights = vertices[np.asarray(mesh.faces)[face_ids], 2].mean(axis=1)
    # From below, high faces are painted first and the lowest visible faces win.
    face_ids = face_ids[np.argsort(face_heights)[::-1]]
    height_image = Image.new("I", (size, size), 0)
    mask_image = Image.new("L", (size, size), 0)
    height_draw = ImageDraw.Draw(height_image)
    mask_draw = ImageDraw.Draw(mask_image)
    faces = np.asarray(mesh.faces)
    for face_id in face_ids:
        face = faces[face_id]
        polygon = [(float(px[index]), float(py[index])) for index in face]
        encoded_height = max(1, int(round(float(vertices[face, 2].mean()) * 1000)))
        height_draw.polygon(polygon, fill=encoded_height)
        mask_draw.polygon(polygon, fill=255)

    bottom = np.asarray(height_image, dtype=np.float32) / 1000.0
    known = np.asarray(mask_image, dtype=np.uint8) > 0
    footprint = ndimage.binary_closing(known, iterations=2)
    footprint = ndimage.binary_fill_holes(footprint)
    footprint = ndimage.binary_opening(footprint, iterations=1)
    nearest = ndimage.distance_transform_edt(~known, return_distances=False, return_indices=True)
    filled = bottom[tuple(nearest)]
    filled[~footprint] = np.nan
    depth = raster_metadata["sea_level_estimate"] - filled
    valid_depth = depth[footprint]
    depth_floor, depth_ceiling = np.quantile(valid_depth, [0.01, 0.998])
    return depth, footprint, {
        "depth_floor": float(depth_floor),
        "depth_ceiling": float(depth_ceiling),
        "reference_plane": float(raster_metadata["sea_level_estimate"]),
    }


def save_heightmaps(height: np.ndarray, footprint: np.ndarray, metadata: dict[str, float], output: Path) -> None:
    floor = metadata["height_floor"]
    ceiling = metadata["height_ceiling"]
    normalized = np.clip((np.nan_to_num(height, nan=floor) - floor) / max(1e-6, ceiling - floor), 0, 1)
    height_u16 = np.rint(normalized * 65535).astype(np.uint16)
    height_u16[~footprint] = 0
    Image.fromarray(height_u16, mode="I;16").save(output / "celestial_world_heightmap_16bit.png")
    Image.fromarray((footprint * 255).astype(np.uint8), mode="L").save(output / "celestial_world_footprint.png")

    sea = metadata["sea_level_estimate"]
    stops = np.array([-90, -28, -7, -1, 2, 16, 38, 72, 118], dtype=np.float32)
    colors = np.array([
        [4, 19, 54], [5, 54, 105], [12, 126, 164], [55, 205, 204],
        [205, 194, 130], [54, 126, 66], [74, 100, 58], [112, 101, 87], [226, 235, 238],
    ], dtype=np.float32)
    relative = np.nan_to_num(height - sea, nan=stops[0])
    rgb = np.empty((*height.shape, 3), dtype=np.float32)
    for channel in range(3):
        rgb[..., channel] = np.interp(relative, stops, colors[:, channel])

    gy, gx = np.gradient(np.nan_to_num(height, nan=sea))
    nx, ny, nz = -gx * 0.055, gy * 0.055, np.ones_like(gx)
    length = np.sqrt(nx * nx + ny * ny + nz * nz)
    light = (nx * -0.45 + ny * -0.38 + nz * 0.81) / np.maximum(length, 1e-6)
    shade = np.clip(0.58 + light * 0.52, 0.42, 1.18)
    rgb *= shade[..., None]
    rgba = np.empty((*height.shape, 4), dtype=np.uint8)
    rgba[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    rgba[..., 3] = footprint.astype(np.uint8) * 255
    Image.fromarray(rgba, mode="RGBA").save(output / "celestial_world_topographic_reference.png")

    preview = np.rint(normalized * 255).astype(np.uint8)
    preview[~footprint] = 0
    Image.fromarray(preview, mode="L").save(output / "celestial_world_heightmap_preview.png")


def save_underside_maps(
    depth: np.ndarray,
    footprint: np.ndarray,
    metadata: dict[str, float],
    output: Path,
) -> None:
    floor = metadata["depth_floor"]
    ceiling = metadata["depth_ceiling"]
    normalized = np.clip((np.nan_to_num(depth, nan=floor) - floor) / max(1e-6, ceiling - floor), 0, 1)
    depth_u16 = np.rint(normalized * 65535).astype(np.uint16)
    depth_u16[~footprint] = 0
    Image.fromarray(depth_u16, mode="I;16").save(output / "celestial_world_underside_depthmap_16bit.png")
    preview = np.rint(normalized * 255).astype(np.uint8)
    preview[~footprint] = 0
    Image.fromarray(preview, mode="L").save(output / "celestial_world_underside_depthmap_preview.png")

    stops = np.array([0.0, 0.14, 0.32, 0.54, 0.74, 0.9, 1.0], dtype=np.float32)
    colors = np.array([
        [112, 108, 91],
        [72, 76, 72],
        [43, 48, 55],
        [24, 30, 47],
        [14, 42, 75],
        [22, 92, 134],
        [116, 220, 232],
    ], dtype=np.float32)
    rgb = np.empty((*depth.shape, 3), dtype=np.float32)
    for channel in range(3):
        rgb[..., channel] = np.interp(normalized, stops, colors[:, channel])
    gy, gx = np.gradient(np.nan_to_num(depth, nan=floor))
    nx, ny, nz = -gx * 0.045, gy * 0.045, np.ones_like(gx)
    length = np.sqrt(nx * nx + ny * ny + nz * nz)
    light = (nx * -0.48 + ny * 0.34 + nz * 0.81) / np.maximum(length, 1e-6)
    shade = np.clip(0.55 + light * 0.55, 0.38, 1.2)
    rgb *= shade[..., None]
    rgba = np.empty((*depth.shape, 4), dtype=np.uint8)
    rgba[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    rgba[..., 3] = footprint.astype(np.uint8) * 255
    Image.fromarray(rgba, mode="RGBA").save(output / "celestial_world_underside_topographic_reference.png")


def terrain_vertex_colors(mesh: trimesh.Trimesh) -> np.ndarray:
    vertices = np.asarray(mesh.vertices)
    normals = np.asarray(mesh.vertex_normals)
    x, y, z = vertices[:, 0], vertices[:, 1], vertices[:, 2]
    up = normals[:, 1]
    colors = np.zeros((len(vertices), 4), dtype=np.uint8)
    colors[:, 3] = 255

    # Stone underside and edge cliffs.
    depth = np.clip((WORLD_WATER_LEVEL - y) / 4.9, 0, 1)
    rock = np.column_stack((36 + depth * 8, 45 + depth * 14, 55 + depth * 26))
    colors[:, :3] = np.clip(rock, 0, 255).astype(np.uint8)

    top = (up > 0.06) & (y > WORLD_WATER_LEVEL - 0.12)
    ocean = top & (y < WORLD_WATER_LEVEL + 0.045)
    shallows = np.clip(1 - np.abs(y - WORLD_WATER_LEVEL) / 0.16, 0, 1)
    colors[ocean, 0] = (8 + shallows[ocean] * 13).astype(np.uint8)
    colors[ocean, 1] = (55 + shallows[ocean] * 85).astype(np.uint8)
    colors[ocean, 2] = (98 + shallows[ocean] * 74).astype(np.uint8)

    land = top & ~ocean
    elevation = np.clip((y - WORLD_WATER_LEVEL) / 1.32, 0, 1)
    angle = np.arctan2(z / WORLD_RZ, x / WORLD_RX)
    arid = np.clip((x / WORLD_RX + 0.1) * 0.9, 0, 1) * np.clip(1 - z / WORLD_RZ * 0.35, 0, 1)
    cold = np.clip((z / WORLD_RZ + 0.25) * 0.7, 0, 1)
    volcanic = np.clip((-x / WORLD_RX - 0.2) * 1.15, 0, 1) * np.clip((-z / WORLD_RZ + 0.05) * 1.1, 0, 1)
    lush = np.array([42.0, 118.0, 61.0])
    dry = np.array([159.0, 111.0, 49.0])
    tundra = np.array([91.0, 118.0, 104.0])
    basalt = np.array([84.0, 54.0, 47.0])
    land_rgb = np.tile(lush, (len(vertices), 1))
    land_rgb = land_rgb * (1 - arid[:, None] * 0.72) + dry * arid[:, None] * 0.72
    land_rgb = land_rgb * (1 - cold[:, None] * 0.42) + tundra * cold[:, None] * 0.42
    land_rgb = land_rgb * (1 - volcanic[:, None] * 0.6) + basalt * volcanic[:, None] * 0.6
    stone = np.array([126.0, 132.0, 126.0])
    snow = np.array([218.0, 230.0, 229.0])
    cliff = np.clip((0.48 - up) / 0.55, 0, 1) * elevation
    high = np.clip((elevation - 0.54) / 0.46, 0, 1)
    land_rgb = land_rgb * (1 - cliff[:, None] * 0.62) + stone * cliff[:, None] * 0.62
    land_rgb = land_rgb * (1 - high[:, None] * 0.78) + snow * high[:, None] * 0.78
    colors[land, :3] = np.clip(land_rgb[land], 0, 255).astype(np.uint8)
    return colors


def optimize_mesh(
    world: trimesh.Trimesh,
    output: Path,
    target_faces: int,
    raster_metadata: dict[str, float],
) -> dict[str, object]:
    before_faces = len(world.faces)
    optimized = world.simplify_quadric_decimation(face_count=target_faces, aggression=7)
    optimized.update_faces(optimized.nondegenerate_faces())
    optimized.update_faces(optimized.unique_faces())
    optimized.remove_unreferenced_vertices()
    optimized.fix_normals(multibody=False)
    optimized.export(output / "celestial_world_optimized_no_moon.stl")

    game_mesh = optimized.copy()
    original = np.asarray(game_mesh.vertices).copy()
    center_x = raster_metadata["xy_center_x"]
    center_y = raster_metadata["xy_center_y"]
    bounds = np.asarray(world.bounds)
    source_diameter = max(bounds[1, 0] - bounds[0, 0], bounds[1, 1] - bounds[0, 1])
    horizontal_scale = (WORLD_RX * 2) / source_diameter
    sx = horizontal_scale
    sz = horizontal_scale
    sea = raster_metadata["sea_level_estimate"]
    vertical_scale = abs(WORLD_BOTTOM - WORLD_WATER_LEVEL) / max(1e-6, sea - bounds[0, 2])
    transformed = np.column_stack((
        (original[:, 0] - center_x) * sx,
        (original[:, 2] - sea) * vertical_scale + WORLD_WATER_LEVEL,
        -(original[:, 1] - center_y) * sz,
    ))
    game_mesh.vertices = transformed
    game_mesh.fix_normals(multibody=False)
    game_mesh.visual.vertex_colors = terrain_vertex_colors(game_mesh)
    game_mesh.export(output / "celestial_world_runtime.glb")
    return {
        "optimized_faces": int(len(optimized.faces)),
        "optimized_vertices": int(len(optimized.vertices)),
        "face_reduction_percent": round((1 - len(optimized.faces) / before_faces) * 100, 3),
        "game_bounds": np.asarray(game_mesh.bounds).round(6).tolist(),
        "game_transform": {
            "source_up": "+Z",
            "runtime_up": "+Y",
            "scale_x": float(sx),
            "scale_y": float(vertical_scale),
            "scale_z": float(sz),
            "runtime_water_level": WORLD_WATER_LEVEL,
        },
    }


def write_prompt(output: Path) -> None:
    prompt = """Generate one 4096x4096 square, orthographic top-down fantasy world texture. Use the attached celestial_world_heightmap_16bit.png as a strict geographic and elevation guide: black is lowest, white is highest. Preserve the exact coastline, island silhouettes, bays, channels, ridgelines, valleys, mountain footprints, and relative elevations. Use celestial_world_footprint.png as the hard world boundary. Do not redraw or invent a different landmass.

Turn the height structure into a richly varied, coherent pre-iron fantasy world with territories readable from a distant game-menu camera. Keep oceans deep cobalt, shelf waters luminous turquoise, reefs and sandbars pale aqua, and shorelines thin and natural. Distribute visibly distinct but naturally blended territories: dense emerald rainforest and mangrove wetlands; warm temperate forest and bright grassland; copper-red desert mesas and dry ochre steppe; dark volcanic badlands with charcoal rock and muted rust lava scars; cool conifer highlands and peat-free northern moor; pale alpine stone, glaciers, and snow only on the highest peaks; fertile river valleys, braided deltas, inland lakes, and scattered tropical island chains. Let mountains create believable rain shadows and let rivers follow valleys downhill into the sea. Use forests, grass, bare rock, sand, snow, marsh, reef, and volcanic ground as texture—not borders. No modern national borders.

Art direction: premium painterly-realistic ARPG world map texture, ancient and mysterious, unusually clear large-scale biome separation, dense fine natural detail, sharp terrain readability, restrained saturated color, cool celestial lighting with warm sunlit land accents. Pure top-down orthographic view with no horizon and no perspective. The image must tile onto the supplied 3D world from above. No floating-island underside, no stalactites, no waterfalls, no moon, no planets, no stars, no sky, no aurora, no clouds obscuring land, no title, no UI, no labels, no compass, no grid, no political boundary lines, no text, no frame, no cast shadow outside the world footprint."""
    (output / "celestial_world_texture_prompt.txt").write_text(prompt + "\n", encoding="utf-8")


def main() -> None:
    args = parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    world, component_report, source_faces = largest_world(args.source)
    height, footprint, raster_metadata = raster_top_surface(world, args.heightmap_size)
    save_heightmaps(height, footprint, raster_metadata, args.output)
    underside_depth, underside_footprint, underside_metadata = raster_bottom_surface(
        world, args.heightmap_size, raster_metadata
    )
    save_underside_maps(underside_depth, underside_footprint, underside_metadata, args.output)
    optimization = optimize_mesh(world, args.output, args.target_faces, raster_metadata)
    write_prompt(args.output)
    report = {
        "source": str(args.source),
        "source_faces": int(source_faces),
        "kept_world_faces_before_cleanup": int(component_report[0]["faces"]),
        "removed_faces": int(source_faces - component_report[0]["faces"]),
        "moon_component": component_report[1] if len(component_report) > 1 else None,
        "largest_components": component_report,
        "heightmap": {"size": args.heightmap_size, **raster_metadata},
        "underside_depthmap": {"size": args.heightmap_size, **underside_metadata},
        **optimization,
    }
    (args.output / "celestial_world_build_report.json").write_text(
        json.dumps(report, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
