"""Shared helpers for authoring detail onto the Verdigris splash disc world.

Atlas classification, empirical orientation solving, terrain lookups,
deterministic feature builders, and the EEVEE QA rig used by
detail_disc_world.py.  Conventions mirror tools/blender_taper_world.py.
"""

from __future__ import annotations

import json
import math
import random
from pathlib import Path

import bmesh
import bpy
import numpy as np
from mathutils import Matrix, Vector, noise

DISC_R = 7.4
WATER_Z = 0.14
GRID_N = 150
CELL = (2.0 * DISC_R) / GRID_N

CLASS_ROCK = 0
CLASS_OCEAN = 1
CLASS_DESERT = 2
CLASS_VOLCANIC = 3
CLASS_SNOW = 4
CLASS_GRASS = 5
CLASS_NAMES = {
    CLASS_ROCK: "rock",
    CLASS_OCEAN: "ocean",
    CLASS_DESERT: "desert",
    CLASS_VOLCANIC: "volcanic",
    CLASS_SNOW: "snow",
    CLASS_GRASS: "grass",
}


def log(message):
    print(message, flush=True)


def clamp(value, low, high):
    return low if value < low else high if value > high else value


def smoothstep(edge0, edge1, value):
    amount = min(1.0, max(0.0, (value - edge0) / max(0.000001, edge1 - edge0)))
    return amount * amount * (3.0 - 2.0 * amount)


def vnoise(x, y, z=0.0, scale=1.0, ox=0.0, oy=0.0, oz=0.0):
    return noise.noise(Vector((x * scale + ox, y * scale + oy, z * scale + oz)))


def tri_count(obj):
    return sum(len(poly.vertices) - 2 for poly in obj.data.polygons)


# ---------------------------------------------------------------------------
# Scene import


def import_world(source_glb):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(source_glb))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not meshes:
        raise RuntimeError("No mesh objects found in source GLB")
    meshes.sort(key=lambda obj: -len(obj.data.vertices))
    bpy.ops.object.select_all(action="DESELECT")
    for obj in meshes:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    obj.name = "CelestialWorldDetailed"
    log("IMPORTED_MESHES %d joined into %r (%d tris)" % (len(meshes), obj.name, tri_count(obj)))
    return obj


# ---------------------------------------------------------------------------
# Atlas loading and classification


def load_atlas(atlas_png):
    image = bpy.data.images.load(str(atlas_png), check_existing=True)
    image.colorspace_settings.name = "Non-Color"
    width, height = image.size
    buf = np.empty(width * height * 4, dtype=np.float32)
    image.pixels.foreach_get(buf)
    rgb = buf.reshape(height, width, 4)[..., :3].astype(np.float64)
    log("ATLAS %dx%d loaded (%s)" % (width, height, atlas_png.name))
    return rgb, width, height


def classify_atlas(rgb):
    red = rgb[..., 0]
    green = rgb[..., 1]
    blue = rgb[..., 2]
    mx = rgb.max(axis=-1)
    mn = rgb.min(axis=-1)
    lum = 0.299 * red + 0.587 * green + 0.114 * blue

    h, w = lum.shape
    yy, xx = np.mgrid[0:h, 0:w]
    radial = np.hypot(
        (xx - (w - 1) * 0.5) / ((w - 1) * 0.5),
        (yy - (h - 1) * 0.5) / ((h - 1) * 0.5),
    )
    disc = radial < 0.97

    snow = (mn > 0.74) & ((mx - mn) < 0.16)
    ocean = (((blue - np.maximum(red, green)) > 0.030) | ((np.minimum(green, blue) - red) > 0.045)) & (mx > 0.08)
    volcanic_dark = (lum < 0.235) & ((mx - mn) < 0.19)
    volcanic_vein = (red > green + 0.015) & (red >= blue) & (lum < 0.33) & ((mx - mn) < 0.30)
    volcanic = (volcanic_dark | volcanic_vein) & ~snow & ~ocean
    desert = (red > green) & (green >= blue * 0.9) & (red > 0.40) & ((red - blue) > 0.13) & ~snow & ~ocean & ~volcanic
    grass = (green >= red) & (green > blue * 1.02) & ((green - mn) > 0.030) & (lum > 0.10) & (lum < 0.82) & ~snow & ~ocean

    labels = np.zeros(lum.shape, dtype=np.int8)
    labels[snow] = CLASS_SNOW
    labels[ocean] = CLASS_OCEAN
    labels[desert] = CLASS_DESERT
    labels[volcanic] = CLASS_VOLCANIC
    labels[grass] = CLASS_GRASS
    labels[~disc] = -1
    return labels


# ---------------------------------------------------------------------------
# Empirical image/world orientation solving


def make_uv_to_world(swap, sx, sv, ru, rv):
    def uv_to_world(u, v):
        a = (2.0 * u - 1.0) * ru * sx
        b = (2.0 * v - 1.0) * rv * sv
        return (b, a) if swap else (a, b)

    return uv_to_world


def solve_orientation(labels, width, height, height_at, seed):
    """Score candidate atlas->world mappings against real terrain heights."""
    rng = random.Random(seed ^ 0x0D15A5)
    wanted = {CLASS_OCEAN: 2400, CLASS_VOLCANIC: 2200, CLASS_DESERT: 1600, CLASS_GRASS: 1200, CLASS_SNOW: 900}
    pools = {}
    for code, take_max in wanted.items():
        ys, xs = np.nonzero(labels == code)
        total = int(len(xs))
        if not total:
            pools[code] = []
            continue
        idx = rng.sample(range(total), min(take_max, total))
        pools[code] = [
            (float(xs[i]) / (width - 1), 1.0 - float(ys[i]) / (height - 1))
            for i in idx
        ]

    hypotheses = []
    for swap in (False, True):
        for sx in (1, -1):
            for sv in (1, -1):
                for ru, rv in ((DISC_R, DISC_R), (7.18, 7.40)):
                    hypotheses.append((swap, sx, sv, ru, rv))

    rows = []
    for order, hyp in enumerate(hypotheses):
        swap, sx, sv, ru, rv = hyp
        to_world = make_uv_to_world(swap, sx, sv, ru, rv)
        stats = {}
        for code, uvs in pools.items():
            pts = []
            for u, v in uvs:
                x, y = to_world(u, v)
                if math.hypot(x, y) > 7.36:
                    continue
                z = height_at(x, y)
                if z is not None:
                    pts.append((x, y, z))
            stats[code] = pts

        ocean_pts = stats[CLASS_OCEAN]
        ocean_sub = sum(1 for _, _, z in ocean_pts if z < WATER_Z + 0.05) / max(1, len(ocean_pts))
        vol_pts = stats[CLASS_VOLCANIC]
        land_pts = stats[CLASS_DESERT] + stats[CLASS_GRASS] + stats[CLASS_SNOW]
        vol_mean = sum(z for _, _, z in vol_pts) / max(1, len(vol_pts))
        land_mean = sum(z for _, _, z in land_pts) / max(1, len(land_pts))
        vol_elev = vol_mean - land_mean
        desert_pts = stats[CLASS_DESERT]
        desert_land = sum(1 for _, _, z in desert_pts if z > WATER_Z) / max(1, len(desert_pts))
        cv_x = sum(p[0] for p in vol_pts) / max(1, len(vol_pts))
        cv_y = sum(p[1] for p in vol_pts) / max(1, len(vol_pts))
        cv_d = math.hypot(cv_x, cv_y)
        has_west = sum(1 for p in desert_pts if p[0] < cv_x - 0.6) >= 60
        has_east = sum(1 for p in desert_pts if p[0] > cv_x + 0.6) >= 60

        score = (
            100.0 * ocean_sub
            + 40.0 * desert_land
            + 300.0 * clamp(vol_elev, 0.0, 0.25)
            + (3.0 if cv_d < 3.6 else 0.0)
            + (2.0 if has_west else 0.0)
            + (2.0 if has_east else 0.0)
        )
        rows.append({
            "order": order,
            "hyp": hyp,
            "name": "swap%d_sx%+d_sv%+d_r(%0.2f,%0.2f)" % hyp,
            "ocean_below_water": round(ocean_sub, 4),
            "volcanic_elevation": round(vol_elev, 4),
            "desert_above_water": round(desert_land, 4),
            "massif_centroid": [round(cv_x, 3), round(cv_y, 3)],
            "massif_dist": round(cv_d, 3),
            "desert_west": has_west,
            "desert_east": has_east,
            "score": round(score, 3),
        })

    rows.sort(key=lambda row: (-row["score"], row["order"]))
    log("ORIENTATION_CANDIDATES (best first):")
    for row in rows:
        log(
            "  %-30s ocean<water=%.3f volElev=%+.3f desertLand=%.3f massif@(%.2f,%.2f) d=%.2f west=%d east=%d score=%.2f"
            % (
                row["name"], row["ocean_below_water"], row["volcanic_elevation"],
                row["desert_above_water"], row["massif_centroid"][0], row["massif_centroid"][1],
                row["massif_dist"], row["desert_west"], row["desert_east"], row["score"],
            )
        )
    best = rows[0]
    log("ORIENTATION_CHOSEN %s" % best["name"])
    log("ORIENTATION_MEANING massif_centroid=%s ocean_below_water=%.3f volcanic_elevation=%+.3f" % (best["massif_centroid"], best["ocean_below_water"], best["volcanic_elevation"]))
    return best


# ---------------------------------------------------------------------------
# World-space biome rasterization


def rasterize_biomes(labels, width, height, mapping):
    swap, sx, sv, ru, rv = mapping
    centers = (np.arange(GRID_N, dtype=np.float64) + 0.5) * CELL - DISC_R
    xs, ys = np.meshgrid(centers, centers, indexing="ij")
    a = ys if swap else xs
    b = xs if swap else ys
    u = (sx * a + ru) / (2.0 * ru)
    v = (sv * b + rv) / (2.0 * rv)
    inside = (u >= 0.0) & (u <= 1.0) & (v >= 0.0) & (v <= 1.0)
    px = np.clip((u * (width - 1)).round().astype(np.int32), 0, width - 1)
    py = np.clip(((1.0 - v) * (height - 1)).round().astype(np.int32), 0, height - 1)
    grid = labels[py, px].astype(np.int8).copy()
    grid[~inside] = -1
    return grid


def cell_center(ix, iy):
    return (ix + 0.5) * CELL - DISC_R, (iy + 0.5) * CELL - DISC_R


def dilate(mask, iterations=1):
    result = mask.copy()
    for _ in range(iterations):
        result = (
            result
            | np.roll(result, 1, 0) | np.roll(result, -1, 0)
            | np.roll(result, 1, 1) | np.roll(result, -1, 1)
        )
    return result


def connected_components(mask, want=2):
    lab = np.zeros(mask.shape, dtype=np.int32)
    current = 0
    results = []
    for si, sj in list(zip(*np.nonzero(mask))):
        if lab[si, sj]:
            continue
        current += 1
        stack = [(int(si), int(sj))]
        lab[si, sj] = current
        size = 0
        while stack:
            a, b = stack.pop()
            size += 1
            for da, db in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                na, nb = a + da, b + db
                if 0 <= na < mask.shape[0] and 0 <= nb < mask.shape[1] and mask[na, nb] and not lab[na, nb]:
                    lab[na, nb] = current
                    stack.append((na, nb))
        results.append((lab == current, size))
    results.sort(key=lambda item: -item[1])
    return results[:want]


# ---------------------------------------------------------------------------
# Terrain height lookup


class TerrainLookup(object):
    """Max top-surface height per grid cell, conservatively rasterized.

    Up-facing polygons are sampled at every covered cell centre (barycentric
    test) rather than scattered by vertex, because the runtime mesh has large
    sparse triangles whose vertices skip many cells.
    """

    def __init__(self, obj):
        mesh = obj.data
        mw = obj.matrix_world
        rot = np.array(mw.to_3x3(), dtype=np.float64)
        trans = np.array(mw.translation, dtype=np.float64)
        nv = len(mesh.vertices)
        nfaces = len(mesh.polygons)
        co = np.empty(nv * 3, dtype=np.float32)
        mesh.vertices.foreach_get("co", co)
        world = co.astype(np.float64).reshape(nv, 3) @ rot.T + trans
        fnorm = np.empty(nfaces * 3, dtype=np.float32)
        mesh.polygons.foreach_get("normal", fnorm)
        wnorm = fnorm.astype(np.float64).reshape(nfaces, 3) @ rot.T

        self.grid = np.full((GRID_N, GRID_N), -1e9, dtype=np.float64)
        self.valid = np.zeros((GRID_N, GRID_N), dtype=bool)
        polys = mesh.polygons
        tol = -0.03
        for fi in np.nonzero(wnorm[:, 2] > 0.05)[0]:
            corners = [world[vi] for vi in polys[int(fi)].vertices]
            fans = [(corners[0], corners[k], corners[k + 1]) for k in range(1, len(corners) - 1)]
            for tri in fans:
                (ax, ay, az), (bx, by, bz), (cx, cy, cz) = tri
                area2 = (bx - ax) * (cy - ay) - (cx - ax) * (by - ay)
                if abs(area2) < 1e-11:
                    continue
                gx0 = int(math.floor((min(ax, bx, cx) + DISC_R) / CELL))
                gx1 = int(math.ceil((max(ax, bx, cx) + DISC_R) / CELL))
                gy0 = int(math.floor((min(ay, by, cy) + DISC_R) / CELL))
                gy1 = int(math.ceil((max(ay, by, cy) + DISC_R) / CELL))
                gx0 = clamp(gx0, 0, GRID_N - 1)
                gx1 = clamp(gx1, 0, GRID_N - 1)
                gy0 = clamp(gy0, 0, GRID_N - 1)
                gy1 = clamp(gy1, 0, GRID_N - 1)
                if (gx1 - gx0) * (gy1 - gy0) > 2500:
                    continue
                inv = 1.0 / area2
                for gx in range(gx0, gx1 + 1):
                    px = (gx + 0.5) * CELL - DISC_R
                    for gy in range(gy0, gy1 + 1):
                        py = (gy + 0.5) * CELL - DISC_R
                        l0 = ((bx - px) * (cy - py) - (cx - px) * (by - py)) * inv
                        if l0 < tol:
                            continue
                        l1 = ((cx - px) * (ay - py) - (ax - px) * (cy - py)) * inv
                        if l1 < tol:
                            continue
                        l2 = 1.0 - l0 - l1
                        if l2 < tol:
                            continue
                        z = l0 * az + l1 * bz + l2 * cz
                        if z > self.grid[gx, gy]:
                            self.grid[gx, gy] = z
                            self.valid[gx, gy] = True
        count = int(self.valid.sum())
        top = float(self.grid[self.valid].max()) if count else float("nan")
        log("HEIGHTGRID valid_cells %d/%d top %.3f" % (count, GRID_N * GRID_N, top))

    def height(self, x, y):
        gx = int(round((x + DISC_R) / CELL))
        gy = int(round((y + DISC_R) / CELL))
        for radius in range(0, 5):
            found = None
            for ix in range(gx - radius, gx + radius + 1):
                for iy in range(gy - radius, gy + radius + 1):
                    if max(abs(ix - gx), abs(iy - gy)) != radius:
                        continue
                    if 0 <= ix < GRID_N and 0 <= iy < GRID_N and self.valid[ix, iy]:
                        value = float(self.grid[ix, iy])
                        if found is None or value > found:
                            found = value
            if found is not None:
                return found
        return None


# ---------------------------------------------------------------------------
# Site selection


class Sites(object):
    def __init__(self, terrain, biome, rng):
        self.terrain = terrain
        self.biome = biome
        self.rng = rng
        self.occupied = []

    def clear(self, x, y, radius):
        return all(math.hypot(x - ox, y - oy) >= radius + orad for ox, oy, orad, _ in self.occupied)

    def claim(self, x, y, radius, tag):
        self.occupied.append((float(x), float(y), float(radius), tag))

    def biome_fraction(self, x, y, radius, codes):
        ix = int((x + DISC_R) / CELL)
        iy = int((y + DISC_R) / CELL)
        span = max(1, int(radius / CELL) + 1)
        hits = 0
        seen = 0
        for a in range(ix - span, ix + span + 1):
            for b in range(iy - span, iy + span + 1):
                if not (0 <= a < GRID_N and 0 <= b < GRID_N):
                    continue
                cx, cy = cell_center(a, b)
                if math.hypot(cx - x, cy - y) > radius:
                    continue
                label = int(self.biome[a, b])
                if label < 0:
                    continue
                seen += 1
                if label in codes:
                    hits += 1
        return hits / max(1, seen)

    def height_range(self, x, y, radius):
        samples = []
        for step in range(8):
            ang = step * math.pi / 4.0
            z = self.terrain.height(x + math.cos(ang) * radius, y + math.sin(ang) * radius)
            if z is not None:
                samples.append(z)
        center = self.terrain.height(x, y)
        if center is not None:
            samples.append(center)
        if not samples:
            return (0.0, 0.0)
        return (min(samples), max(samples))

    def ring_free_of_water(self, x, y, radius):
        for step in range(16):
            ang = step * math.pi / 8.0
            sx = x + math.cos(ang) * radius
            sy = y + math.sin(ang) * radius
            ix = int((sx + DISC_R) / CELL)
            iy = int((sy + DISC_R) / CELL)
            if 0 <= ix < GRID_N and 0 <= iy < GRID_N and int(self.biome[ix, iy]) == CLASS_OCEAN:
                return False
            z = self.terrain.height(sx, sy)
            if z is not None and z <= WATER_Z + 0.02:
                return False
        return True

    def shuffled_cells(self, mask):
        cells = [(int(a), int(b)) for a, b in np.argwhere(mask)]
        self.rng.shuffle(cells)
        return cells


# ---------------------------------------------------------------------------
# Vertex displacement passes


def displace_upward(obj, callback, min_nz, min_z=-1e9, bbox=None):
    mesh = obj.data
    mw = obj.matrix_world
    inverse = mw.inverted()
    rot = mw.to_3x3()
    changed = 0
    for vertex in mesh.vertices:
        world = mw @ vertex.co
        if world.z < min_z:
            continue
        if bbox is not None:
            bx0, by0, bx1, by1 = bbox
            if not (bx0 <= world.x <= bx1 and by0 <= world.y <= by1):
                continue
        if (rot @ vertex.normal).normalized().z < min_nz:
            continue
        delta = callback(world.x, world.y, world.z)
        if delta:
            vertex.co = inverse @ Vector((world.x, world.y, world.z + delta))
            changed += 1
    mesh.update()
    if hasattr(mesh, "calc_normals"):
        mesh.calc_normals()
    return changed


def carve_caldera(obj, cx, cy):
    outer = 0.9
    bowl_r = 0.55
    depth = 0.32
    rim_h = 0.12

    def callback(x, y, z):
        dx, dy = x - cx, y - cy
        d = math.hypot(dx, dy)
        if d > outer:
            return 0.0
        delta = 0.0
        if d < bowl_r:
            t = d / bowl_r
            delta -= depth * (0.5 + 0.5 * math.cos(math.pi * t)) ** 1.15
        if d >= bowl_r * 0.86:
            t = clamp((d - bowl_r) / (outer - bowl_r), 0.0, 1.0)
            ang = math.atan2(dy, dx)
            jag = 1.0 + 0.42 * vnoise(math.cos(ang) * 2.1, math.sin(ang) * 2.1, 0.0, 1.0, 0.0, 0.0, 41.7)
            profile = math.sin(math.pi * t) ** 1.6
            delta += rim_h * profile * max(0.25, jag)
        return delta

    changed = displace_upward(obj, callback, min_nz=0.25)
    return {"center": [round(cx, 4), round(cy, 4)], "vertices_moved": changed,
            "outer_radius": outer, "bowl_radius": bowl_r, "depth": depth, "rim_height": rim_h}


def carve_canyon(obj, path, width, depth):
    half = width * 0.5
    xs = [p[0] for p in path]
    ys = [p[1] for p in path]
    pad = half + 0.05
    bbox = (min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad)
    n = len(path)

    def callback(x, y, z):
        if z <= WATER_Z - 0.02:
            return 0.0
        best = 1e9
        best_t = 0.0
        for index, (px, py) in enumerate(path):
            d = math.hypot(x - px, y - py)
            if d < best:
                best = d
                best_t = index / float(n - 1)
                if d < half * 0.35:
                    break
        if best >= half:
            return 0.0
        across = (0.5 + 0.5 * math.cos(math.pi * best / half)) ** 1.2
        along = math.sin(math.pi * best_t) ** 0.7
        return -depth * across * along

    changed = displace_upward(obj, callback, min_nz=0.3, bbox=bbox)
    return {"path_endpoints": [[round(xs[0], 3), round(ys[0], 3)], [round(xs[-1], 3), round(ys[-1], 3)]],
            "vertices_moved": changed, "width": width, "depth": depth}


# ---------------------------------------------------------------------------
# Feature mesh builders (flat-shaded, world space, identity transforms)


def commit_object(bm, name):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def jitter_radially(verts, amount, seed, vertical=0.0):
    for vert in verts:
        ang = math.atan2(vert.co.y, vert.co.x)
        factor = 1.0 + amount * vnoise(math.cos(ang) * 1.8, math.sin(ang) * 1.8, 0.0, 1.0, seed, seed * 0.7, 5.1)
        vert.co.x *= factor
        vert.co.y *= factor
        if vertical:
            vert.co.z += vertical * vnoise(math.cos(ang) * 2.6, math.sin(ang) * 2.6, 0.0, 1.0, seed * 1.3, 9.4, seed)


def build_mesa(name, x, y, ground, rng):
    bm = bmesh.new()
    total = rng.uniform(0.25, 0.45)
    weights = [rng.uniform(0.9, 1.1), rng.uniform(0.9, 1.1), 1.0]
    norm = sum(weights)
    base_r = rng.uniform(0.42, 0.66)
    seed = rng.uniform(0.0, 100.0)
    z = ground - 0.03
    r = base_r
    for tier in range(3):
        h = total * weights[tier] / norm
        top_r = r * rng.uniform(0.80, 0.88)
        start = len(bm.verts)
        bmesh.ops.create_cone(
            bm, cap_ends=True, cap_tris=True, segments=22,
            diameter1=r * 2.0, diameter2=top_r * 2.0, depth=h,
            matrix=Matrix.Translation(Vector((x, y, z + h * 0.5))),
            calc_uvs=False,
        )
        jitter_radially(list(bm.verts)[start:], 0.07, seed + tier * 3.7, vertical=0.012)
        z += h
        r = top_r
    return commit_object(bm, name), z


def add_ridge_cone(bm, x, y, ground, rng):
    height = rng.uniform(0.5, 0.9)
    radius = rng.uniform(0.25, 0.5)
    segments = rng.choice((6, 7, 8))
    seed = rng.uniform(0.0, 100.0)
    base_z = ground - 0.04
    start = len(bm.verts)
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=True, segments=segments,
        diameter1=radius * 2.0, diameter2=radius * 0.04 * 2.0, depth=height,
        matrix=Matrix.Translation(Vector((x, y, base_z + height * 0.5)))
        @ Matrix.Rotation(rng.uniform(-0.10, 0.10), 4, "X")
        @ Matrix.Rotation(rng.uniform(-0.10, 0.10), 4, "Y"),
        calc_uvs=False,
    )
    top_cut = base_z + height * 0.55
    for vert in list(bm.verts)[start:]:
        local = vert.co
        if local.z <= base_z + 0.005:
            continue
        share = clamp((local.z - base_z) / height, 0.0, 1.0)
        wobble = Vector((
            vnoise(local.x, local.y, local.z, 3.4, seed, 0.0, 0.0),
            vnoise(local.x, local.y, local.z, 3.4, 0.0, seed, 13.2),
            vnoise(local.x, local.y, local.z, 2.7, 27.5, 4.4, seed),
        ))
        vert.co += wobble * (0.055 + 0.10 * share)
        if local.z > top_cut:
            vert.co.x += vnoise(local.x, local.y, 1.0, 1.6, seed, 61.3, 0.0) * 0.09
            vert.co.y += vnoise(local.x, local.y, 1.0, 1.6, 71.9, seed, 0.0) * 0.09


def build_ziggurat(name, x, y, ground, rng):
    bm = bmesh.new()
    tiers = rng.choice((3, 4))
    footprint = rng.uniform(0.52, 0.78)
    z = ground - 0.02
    spin = rng.uniform(-0.14, 0.14)
    for tier in range(tiers):
        h = rng.uniform(0.07, 0.105)
        scale = footprint * (0.68 ** tier)
        spin += rng.uniform(-0.09, 0.09)
        bmesh.ops.create_cube(
            bm, size=1.0,
            matrix=Matrix.Translation(Vector((x, y, z + h * 0.5)))
            @ Matrix.Rotation(spin, 4, "Z")
            @ Matrix.Diagonal(Vector((scale, scale * rng.uniform(0.9, 1.0), h, 1.0))),
            calc_uvs=False,
        )
        z += h
    return commit_object(bm, name), z


def build_watchtower(name, x, y, ground, rng):
    bm = bmesh.new()
    radius = rng.uniform(0.15, 0.21)
    height = rng.uniform(0.30, 0.44)
    seed = rng.uniform(0.0, 100.0)
    base_z = ground - 0.03
    start = len(bm.verts)
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=True, segments=14,
        diameter1=radius * 2.0, diameter2=radius * 0.9 * 2.0, depth=height,
        matrix=Matrix.Translation(Vector((x, y, base_z + height * 0.5))),
        calc_uvs=False,
    )
    top_z = base_z + height
    for vert in list(bm.verts)[start:]:
        if vert.co.z > top_z - height * 0.22:
            ang = math.atan2(vert.co.y - y, vert.co.x - x)
            vert.co.z += height * 0.20 * vnoise(math.cos(ang) * 2.3, math.sin(ang) * 2.3, 0.0, 1.0, seed, 3.9, seed * 0.5)
            vert.co.x += 0.015 * vnoise(math.cos(ang) * 3.1, 0.0, 0.0, 1.0, seed * 2.1, 8.8, 0.0)
            vert.co.y += 0.015 * vnoise(0.0, math.sin(ang) * 3.1, 0.0, 1.0, 0.0, seed * 1.7, 6.6)
    return commit_object(bm, name), base_z + height


def build_sea_stack(name, x, y, floor, rng, top_offset=None):
    if top_offset is None:
        top_offset = rng.uniform(0.5, 1.1)
    bm = bmesh.new()
    radius = rng.uniform(0.16, 0.30)
    top_z = WATER_Z + top_offset
    base_z = floor - 0.06
    depth = top_z - base_z
    seed = rng.uniform(0.0, 100.0)
    tilt_axis = Vector((rng.uniform(-1.0, 1.0), rng.uniform(-1.0, 1.0), 0.0))
    if tilt_axis.length < 1e-4:
        tilt_axis = Vector((1.0, 0.0, 0.0))
    tilt_axis.normalize()
    start = len(bm.verts)
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=True, segments=rng.choice((10, 12)),
        diameter1=radius * 2.0, diameter2=radius * rng.uniform(0.55, 0.70) * 2.0, depth=depth,
        matrix=Matrix.Translation(Vector((x, y, base_z + depth * 0.5)))
        @ Matrix.Rotation(rng.uniform(-0.07, 0.07), 4, tilt_axis),
        calc_uvs=False,
    )
    for vert in list(bm.verts)[start:]:
        share = clamp((vert.co.z - base_z) / depth, 0.0, 1.0)
        if share < 0.02:
            continue
        ang = math.atan2(vert.co.y - y, vert.co.x - x)
        factor = 1.0 + 0.16 * share * vnoise(math.cos(ang) * 2.2, math.sin(ang) * 2.2, vert.co.z * 1.4, 1.0, seed, seed * 0.6, 12.9)
        vert.co.x = x + (vert.co.x - x) * factor
        vert.co.y = y + (vert.co.y - y) * factor
    return commit_object(bm, name), top_z


# ---------------------------------------------------------------------------
# EEVEE QA rig (mirrors blender_taper_world.py render_previews)


def preview_material():
    material = bpy.data.materials.new("Verdigris underside QA")
    material.use_nodes = True
    principled = material.node_tree.nodes.get("Principled BSDF")
    principled.inputs["Base Color"].default_value = (0.075, 0.115, 0.135, 1.0)
    principled.inputs["Roughness"].default_value = 0.68
    principled.inputs["Metallic"].default_value = 0.04
    return material


def add_area_light(name, location, energy, color, size):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = color
    data.size = size
    light = bpy.data.objects.new(name, data)
    light.location = location
    bpy.context.scene.collection.objects.link(light)
    light.rotation_euler = (Vector((0, 0, -1.1)) - Vector(location)).to_track_quat("-Z", "Y").to_euler()


def look_at(camera, target):
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()


def render_qa(obj, qa_dir, bounds):
    qa_dir.mkdir(parents=True, exist_ok=True)
    material = preview_material()
    obj.data.materials.clear()
    obj.data.materials.append(material)

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.eevee.use_gtao = True
    scene.eevee.gtao_distance = 3
    scene.eevee.gtao_factor = 1.45
    scene.render.resolution_x = 900
    scene.render.resolution_y = 700
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    if scene.world is None:
        scene.world = bpy.data.worlds.new("Verdigris QA World")
    scene.world.color = (0.003, 0.008, 0.014)

    add_area_light("Underside key", (7, -10, -8), 1250, (0.28, 0.72, 1.0), 7)
    add_area_light("Underside rim", (-9, 5, 2), 950, (0.35, 1.0, 0.82), 6)
    add_area_light("Top fill", (1, 2, 11), 850, (1.0, 0.54, 0.26), 5)

    camera_data = bpy.data.cameras.new("QA Camera")
    camera = bpy.data.objects.new("QA Camera", camera_data)
    scene.collection.objects.link(camera)
    scene.camera = camera
    camera.data.lens = 56

    center = (bounds[0] + bounds[1]) * 0.5
    views = {
        "side": ((0.0, -23.5, 1.0), 0.0),
        "quarter": ((15.5, -17.5, 2.0), 0.0),
        "top": ((0.4, 0.8, 23.0), 0.2),
        "bottom": ((0.02, 0.02, -24.0), -1.0),
    }
    for view_name, (location, focus_z) in views.items():
        camera.location = location
        look_at(camera, Vector((center.x, center.y, focus_z)))
        scene.render.filepath = str(qa_dir / ("detailed_%s.png" % view_name))
        bpy.ops.render.render(write_still=True)
        log("QA_RENDER %s" % scene.render.filepath)


def world_bounds(objects):
    points = [obj.matrix_world @ vertex.co for obj in objects for vertex in obj.data.vertices]
    return (
        Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points))),
        Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points))),
    )


def dumps(value):
    return json.dumps(value, sort_keys=True)
