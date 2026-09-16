"""Author biome-matched geometric detail onto the Verdigris splash disc world.

Imports assets/world/celestial_world_runtime_tapered.glb, empirically solves
the runtime planar-projection atlas orientation against the real terrain,
classifies biomes from the shadeless atlas, then carves and builds
deterministic biome-matched features (volcano caldera, desert badlands,
snowfield ridges, plains ruins, ocean sea stacks) into/onto the existing mesh.
Exports celestial_world_runtime_detailed.glb plus EEVEE QA renders.

Run:
  blender --background --python tools/detail_disc_world.py
"""

from __future__ import annotations

import json
import math
import random
import sys
from collections import deque
from pathlib import Path

import bmesh
import bpy
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))

from mathutils import Vector  # noqa: E402

from disc_detail_lib import (  # noqa: E402
    CLASS_DESERT,
    CLASS_GRASS,
    CLASS_NAMES,
    CLASS_OCEAN,
    CLASS_ROCK,
    CLASS_SNOW,
    CLASS_VOLCANIC,
    CELL,
    DISC_R,
    GRID_N,
    Sites,
    TerrainLookup,
    WATER_Z,
    add_ridge_cone,
    build_mesa,
    build_sea_stack,
    build_watchtower,
    build_ziggurat,
    carve_caldera,
    carve_canyon,
    cell_center,
    classify_atlas,
    clamp,
    commit_object,
    connected_components,
    dilate,
    import_world,
    load_atlas,
    log,
    rasterize_biomes,
    render_qa,
    solve_orientation,
    tri_count,
    world_bounds,
)

MODULE_DIR = Path(__file__).resolve().parents[1]
WORLD_DIR = MODULE_DIR / "assets" / "world"
SOURCE_GLB = WORLD_DIR / "celestial_world_runtime_tapered.glb"
ATLAS_PNG = WORLD_DIR / "celestial_world_top_texture.png"
OUTPUT_GLB = WORLD_DIR / "celestial_world_runtime_detailed.glb"
QA_DIR = WORLD_DIR / "qa_detailed"

SEED = 20260822
MAX_ADDED_TRIS = 60000
MAX_TOTAL_TRIS = 230000


def pick_site(sites, cells, predicate, self_points, self_sep):
    for a, b in cells:
        x, y = cell_center(a, b)
        if not predicate(x, y):
            continue
        if not sites.clear(x, y, self_sep * 0.5):
            continue
        if any(math.hypot(x - px, y - py) < self_sep for px, py in self_points):
            continue
        return x, y
    return None


def main():
    rng = random.Random(SEED)
    report = {"placements": [], "carves": {}, "caveats": []}
    feature_objects = []
    added_tris = 0

    world_obj = import_world(SOURCE_GLB)
    tris_before = tri_count(world_obj)
    smooth_before = sum(1 for p in world_obj.data.polygons if p.use_smooth)

    rgb, width, height = load_atlas(ATLAS_PNG)
    labels = classify_atlas(rgb)
    counts = {}
    for code in sorted(np.unique(labels).tolist()):
        key = CLASS_NAMES.get(int(code), "void" if code < 0 else "?%d" % code)
        counts[key] = int((labels == code).sum())
    log("ATLAS_CLASS_PIXEL_COUNTS %s" % json.dumps(counts, sort_keys=True))

    terrain = TerrainLookup(world_obj)

    chosen = solve_orientation(labels, width, height, terrain.height, SEED)
    mapping = (
        chosen["hyp"][0], chosen["hyp"][1], chosen["hyp"][2],
        chosen["hyp"][3], chosen["hyp"][4],
    )
    biome = rasterize_biomes(labels, width, height, mapping)
    world_counts = {CLASS_NAMES[code]: int((biome == code).sum()) for code in (CLASS_OCEAN, CLASS_DESERT, CLASS_VOLCANIC, CLASS_SNOW, CLASS_GRASS, CLASS_ROCK)}
    log("WORLD_BIOME_CELL_COUNTS %s (grid %dx%d)" % (json.dumps(world_counts, sort_keys=True), GRID_N, GRID_N))

    sites = Sites(terrain, biome, rng)

    def register(kind, x, y, base_y, top_y, detail, obj=None):
        nonlocal added_tris
        entry = {"type": kind, "x": round(x, 4), "z": round(y, 4),
                 "base_y": round(base_y, 4), "top_y": round(top_y, 4)}
        entry.update(detail)
        if obj is not None:
            tris = tri_count(obj)
            added_tris += tris
            feature_objects.append(obj)
            entry["tris"] = tris
        report["placements"].append(entry)
        log("PLACED %s" % json.dumps(entry))

    # --- volcano caldera --------------------------------------------------
    # Highest terrain cell classified volcanic wins; the massif summit is the
    # only plausible caldera host on this disc.
    caldera_center = None
    best_cell = None
    for a, b in sites.shuffled_cells(biome == CLASS_VOLCANIC):
        if not terrain.valid[a, b]:
            continue
        px, py = cell_center(a, b)
        if math.hypot(px, py) > 3.4:
            continue
        if best_cell is None or terrain.grid[a, b] > terrain.grid[best_cell[0], best_cell[1]]:
            best_cell = (a, b)
    if best_cell is not None:
        caldera_center = cell_center(best_cell[0], best_cell[1])
    vol_components = connected_components(dilate(biome == CLASS_VOLCANIC, 2), want=12)
    log("VOLCANIC_COMPONENT_SIZES %s" % [size for _, size in vol_components])
    mc = chosen["massif_centroid"]
    if caldera_center is None:
        caldera_center = (float(mc[0]), float(mc[1]))
        report["caveats"].append("no valid volcanic cell found; caldera centred on orientation-solve massif centroid %s" % (mc,))
    log("CALDERA_SITE (%.3f, %.3f) massif_centroid=(%.3f, %.3f)" % (caldera_center[0], caldera_center[1], mc[0], mc[1]))
    ground_c = terrain.height(*caldera_center)
    report["carves"]["caldera"] = carve_caldera(world_obj, caldera_center[0], caldera_center[1])
    sites.claim(caldera_center[0], caldera_center[1], 1.3, "caldera")
    register("volcano_caldera", caldera_center[0], caldera_center[1],
             ground_c or 0.0, (ground_c or 0.0), {"note": "carved into existing vertices"})

    # --- desert badlands: mesas -------------------------------------------
    desert_comps = [comp for comp in connected_components(dilate(biome == CLASS_DESERT, 2), want=12) if comp[1] >= 40]
    log("DESERT_COMPONENT_SIZES %s" % [size for _, size in desert_comps])
    primary = desert_comps[0][0] if desert_comps else None
    secondary = desert_comps[1][0] if len(desert_comps) > 1 else primary
    if primary is None:
        report["caveats"].append("no desert region found; mesas skipped")

    mesa_sites = []

    def mesa_predicate(frac_need, slope_max):
        def check(x, y):
            z = terrain.height(x, y)
            if z is None or z <= WATER_Z + 0.03:
                return False
            if sites.biome_fraction(x, y, 0.55, {CLASS_DESERT}) < frac_need:
                return False
            lo, hi = sites.height_range(x, y, 0.45)
            return (hi - lo) <= slope_max
        return check

    ladder = [(0.68, 0.22), (0.50, 0.34), (0.34, 0.46)]
    plans = [("MesaWest", primary), ("MesaMid", primary), ("MesaEast", secondary)]
    for name, mask in plans:
        if mask is None:
            report["caveats"].append("%s skipped (no desert component)" % name)
            continue
        placed = False
        for frac_need, slope_max in ladder:
            spot = pick_site(sites, sites.shuffled_cells(mask), mesa_predicate(frac_need, slope_max), mesa_sites, 1.15)
            if spot is None:
                continue
            x, y = spot
            ground = terrain.height(x, y)
            obj, top = build_mesa(name, x, y, ground, rng)
            register("desert_mesa_terrace_stack", x, y, ground - 0.03, top,
                     {"terraces": 3, "radius_range_wu": [0.35, 0.7]}, obj)
            sites.claim(x, y, 0.95, name)
            mesa_sites.append((x, y))
            placed = True
            break
        if not placed:
            report["caveats"].append("%s could not be placed" % name)

    # canyon through the primary desert patch, avoiding mesas
    if primary is not None:
        ii, jj = np.nonzero(primary)
        pxs = (ii + 0.5) * (2.0 * DISC_R / GRID_N) - DISC_R
        pys = (jj + 0.5) * (2.0 * DISC_R / GRID_N) - DISC_R
        mean = np.array([float(pxs.mean()), float(pys.mean())])
        cov = np.cov(np.vstack([pxs - mean[0], pys - mean[1]]))
        evals, evecs = np.linalg.eigh(cov)
        axis = evecs[:, -1]
        length = clamp(2.0 * math.sqrt(max(float(evals[-1]), 0.01)) * 1.6, 1.2, 2.6)
        perp = np.array([-axis[1], axis[0]])
        best_path = None
        best_score = -1.0
        for attempt in range(48):
            offset = perp * rng.uniform(-0.5, 0.5) * length
            p0 = mean - axis * (length * 0.5) + offset * rng.uniform(-0.4, 0.4)
            p2 = mean + axis * (length * 0.5) + offset * rng.uniform(-0.4, 0.4)
            p1 = mean + offset
            path = []
            for step in range(73):
                t = step / 72.0
                qx = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0]
                qy = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1]
                path.append((float(qx), float(qy)))
            good = 0
            total = 0
            near_mesa_hits = 0
            for qx, qy in path[::6]:
                total += 1
                ix = int((qx + DISC_R) / (2.0 * DISC_R / GRID_N))
                iy = int((qy + DISC_R) / (2.0 * DISC_R / GRID_N))
                label = int(biome[ix, iy]) if (0 <= ix < GRID_N and 0 <= iy < GRID_N) else -1
                if label in (CLASS_DESERT, CLASS_ROCK):
                    good += 1
                if any(math.hypot(qx - mx, qy - my) < 0.55 for mx, my in mesa_sites):
                    near_mesa_hits += 1
            score = good / max(1, total)
            if near_mesa_hits == 0 and score > best_score:
                best_score = score
                best_path = path
            if near_mesa_hits == 0 and score >= 0.999:
                break
        if best_path is not None and best_score >= 0.85:
            report["carves"]["canyon"] = carve_canyon(world_obj, best_path, width=0.22, depth=0.18)
            mid = best_path[len(best_path) // 2]
            mid_z = terrain.height(mid[0], mid[1])
            register("desert_canyon_trench", mid[0], mid[1],
                     (mid_z or 0.0), (mid_z or 0.0),
                     {"note": "carved ~0.18 wu deep into existing vertices", "valid_fraction": round(best_score, 3)})
        else:
            report["caveats"].append("no clean desert-crossing canyon path found; trench skipped")

    # --- jagged ridge clusters on snowy highlands --------------------------
    def ridge_score(x, y):
        z = terrain.height(x, y)
        if z is None or z <= WATER_Z + 0.08:
            return None
        snowy = sites.biome_fraction(x, y, 0.85, {CLASS_SNOW})
        return 1.6 * snowy + clamp((z - 0.15) / 0.6, 0.0, 1.0)

    land_mask = (biome >= CLASS_ROCK) & (biome != CLASS_OCEAN)
    ridge_ranked = []
    for a, b in sites.shuffled_cells(land_mask):
        x, y = cell_center(a, b)
        score = ridge_score(x, y)
        if score is None:
            continue
        ridge_ranked.append((score, x, y))
    ridge_ranked.sort(key=lambda item: -item[0])

    cluster_centers = []
    ridge_cones_per_cluster = 5
    for cluster_index in range(2):
        done = False
        for score_value, cx, cy in ridge_ranked:
            if any(math.hypot(cx - ox, cy - oy) < 3.2 for ox, oy in cluster_centers):
                continue
            if not sites.clear(cx, cy, 0.6):
                continue
            cones_placed = []
            bm = None
            for cone_index in range(ridge_cones_per_cluster):
                for try_index in range(24):
                    ang = rng.uniform(0.0, math.pi * 2.0)
                    dist = rng.uniform(0.32, 0.78)
                    sxp = cx + math.cos(ang) * dist
                    syp = cy + math.sin(ang) * dist
                    if any(math.hypot(sxp - ox, syp - oy) < 0.52 for ox, oy in cones_placed):
                        continue
                    gz = terrain.height(sxp, syp)
                    if gz is None or gz <= WATER_Z + 0.04:
                        continue
                    if not sites.clear(sxp, syp, 0.25):
                        continue
                    if bm is None:
                        bm = bmesh.new()
                    add_ridge_cone(bm, sxp, syp, gz, rng)
                    cones_placed.append((sxp, syp))
                    break
            if len(cones_placed) >= 4:
                name = "RidgeCluster%d" % (cluster_index + 1)
                obj = commit_object(bm, name)
                heights = [terrain.height(px, py) for px, py in cones_placed]
                base_min = min(h for h in heights if h is not None)
                top_max = base_min + 0.9
                register("jagged_ridge_cluster", cx, cy, base_min, top_max,
                         {"cones": len(cones_placed), "cone_height_range_wu": [0.5, 0.9],
                          "site_score": round(score_value, 3)}, obj)
                sites.claim(cx, cy, 1.2, name)
                cluster_centers.append((cx, cy))
                done = True
                break
            elif bm is not None:
                bm.free()
        if not done:
            report["caveats"].append("ridge cluster %d could not be placed" % (cluster_index + 1))

    # --- ruins on green plains ---------------------------------------------
    plains_mask = ((biome == CLASS_GRASS) | (biome == CLASS_ROCK)).astype(bool)

    # Grid distance (in cells) to the nearest ocean or void cell: true
    # inland-depth measure for the "away from coastline water" rule.
    blocked = (biome == CLASS_OCEAN) | (biome < 0)
    INF_CLEAR = 10 ** 6
    clearance = np.full((GRID_N, GRID_N), INF_CLEAR, dtype=np.int32)
    bfs_queue = deque()
    for a, b in zip(*np.nonzero(blocked)):
        clearance[a, b] = 0
        bfs_queue.append((int(a), int(b)))
    while bfs_queue:
        a, b = bfs_queue.popleft()
        nd = int(clearance[a, b]) + 1
        for na, nb in ((a + 1, b), (a - 1, b), (a, b + 1), (a, b - 1)):
            if 0 <= na < GRID_N and 0 <= nb < GRID_N and clearance[na, nb] > nd:
                clearance[na, nb] = nd
                bfs_queue.append((na, nb))
    valid_land_clearances = clearance[(~blocked) & (biome >= 0)]
    max_clear_wu = (int(valid_land_clearances.max()) * CELL) if valid_land_clearances.size else 0.0
    log("MAX_LAND_CLEARANCE_FROM_WATER %.3f wu" % max_clear_wu)

    def ruin_predicate(grass_need, slope_max, clear_cells):
        def check(x, y):
            z = terrain.height(x, y)
            if z is None or z <= WATER_Z + 0.02:
                return False
            ix = int((x + DISC_R) / CELL)
            iy = int((y + DISC_R) / CELL)
            if not (0 <= ix < GRID_N and 0 <= iy < GRID_N) or clearance[ix, iy] >= INF_CLEAR:
                return False
            if int(clearance[ix, iy]) < clear_cells:
                return False
            if sites.biome_fraction(x, y, 0.7, {CLASS_GRASS}) < grass_need:
                return False
            lo, hi = sites.height_range(x, y, 0.5)
            return (hi - lo) <= slope_max
        return check

    ruin_sites = []
    for name, kind, builder, sep in (
        ("ZigguratNorth", "stepped_ziggurat", build_ziggurat, 1.35),
        ("ZigguratSouth", "stepped_ziggurat", build_ziggurat, 1.35),
        ("WatchtowerWest", "broken_watchtower_stub", build_watchtower, 1.1),
        ("WatchtowerEast", "broken_watchtower_stub", build_watchtower, 1.1),
    ):
        placed = False
        for grass_need, slope_max, clear_cells in (
            (0.75, 0.10, 12), (0.60, 0.16, 12), (0.45, 0.24, 10), (0.25, 0.40, 7), (0.10, 0.55, 4),
        ):
            spot = pick_site(sites, sites.shuffled_cells(plains_mask),
                             ruin_predicate(grass_need, slope_max, clear_cells), ruin_sites, sep)
            if spot is None:
                continue
            x, y = spot
            ground = terrain.height(x, y)
            obj, top = builder(name, x, y, ground, rng)
            detail = {"grass_fraction_min": grass_need}
            clear_wu = clear_cells * CELL
            if clear_wu < 1.19:
                detail["note"] = "coastline clearance relaxed to ~%.2f wu (world max %.2f)" % (clear_wu, max_clear_wu)
                report["caveats"].append("%s placed with ~%.2f wu coastline clearance instead of 1.2 (world max %.2f wu)"
                                         % (name, clear_wu, max_clear_wu))
            else:
                detail["note"] = "green plains, >=1.2 wu from coastline water"
            register(kind, x, y, ground, top, detail, obj)
            sites.claim(x, y, sep * 0.6, name)
            ruin_sites.append((x, y))
            placed = True
            break
        if not placed:
            report["caveats"].append("%s could not be placed on green plains" % name)

    # --- sea stacks near the rim -------------------------------------------
    ocean_mask = biome == CLASS_OCEAN

    def stack_predicate(floor_max, radial_min):
        def check(x, y):
            if math.hypot(x, y) < radial_min:
                return False
            floor = terrain.height(x, y)
            return floor is not None and WATER_Z - 1.5 < floor < floor_max
        return check

    stack_sites = []
    stacks_done = 0
    for target_index in range(5):
        placed = False
        for floor_max, radial_min, sep in ((WATER_Z - 0.006, 5.5, 1.05), (WATER_Z - 0.003, 5.0, 1.0), (WATER_Z + 0.01, 4.6, 0.95)):
            cells = sites.shuffled_cells(ocean_mask)
            spot = pick_site(sites, cells, stack_predicate(floor_max, radial_min), stack_sites, sep)
            if spot is None:
                continue
            x, y = spot
            floor = terrain.height(x, y)
            obj, top = build_sea_stack("SeaStack%d" % (target_index + 1), x, y, floor, rng)
            register("sea_stack", x, y, floor - 0.06, top, {"note": "rises out of ocean near rim"}, obj)
            sites.claim(x, y, sep * 0.55, "SeaStack%d" % (target_index + 1))
            stack_sites.append((x, y))
            stacks_done += 1
            placed = True
            break
        if not placed:
            report["caveats"].append("sea stack %d could not be placed" % (target_index + 1))
    if stacks_done < 4:
        report["caveats"].append("only %d sea stacks placed (target 4-5)" % stacks_done)

    # --- join everything into the single world mesh -------------------------
    bpy.ops.object.select_all(action="DESELECT")
    world_obj.select_set(True)
    for obj in feature_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = world_obj
    if feature_objects:
        bpy.ops.object.join()

    mesh = world_obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    if hasattr(mesh, "calc_normals"):
        mesh.calc_normals()

    tris_after = tri_count(world_obj)
    smooth_after = sum(1 for p in mesh.polygons if p.use_smooth)
    bounds = world_bounds([world_obj])

    if added_tris > MAX_ADDED_TRIS:
        raise SystemExit("added triangle budget exceeded: %d > %d" % (added_tris, MAX_ADDED_TRIS))
    if tris_after > MAX_TOTAL_TRIS:
        raise SystemExit("total triangle budget exceeded: %d > %d" % (tris_after, MAX_TOTAL_TRIS))

    OUTPUT_GLB.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    world_obj.select_set(True)
    bpy.context.view_layer.objects.active = world_obj
    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT_GLB),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
    )

    render_qa(world_obj, QA_DIR, bounds)

    summary = {
        "source": str(SOURCE_GLB.name),
        "output": str(OUTPUT_GLB),
        "orientation_chosen": chosen["name"],
        "atlas_class_pixel_counts": counts,
        "world_biome_cell_counts": world_counts,
        "tris_before": tris_before,
        "tris_added": added_tris,
        "tris_after": tris_after,
        "smooth_faces_before": smooth_before,
        "smooth_faces_after": smooth_after,
        "bounds_blender_zup": {
            "min": [round(v, 4) for v in bounds[0]],
            "max": [round(v, 4) for v in bounds[1]],
        },
        "carves": report["carves"],
        "placements": report["placements"],
        "caveats": report["caveats"],
    }
    log("VERDIGRIS_DETAIL %s" % json.dumps(summary, sort_keys=True))


main()
