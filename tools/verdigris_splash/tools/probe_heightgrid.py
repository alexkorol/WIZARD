"""Diagnostic probe for TerrainLookup correctness against the runtime GLB."""

from __future__ import annotations

import sys
from pathlib import Path

import bpy
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))

from disc_detail_lib import DISC_R, GRID_N, TerrainLookup, import_world  # noqa: E402

MODULE_DIR = Path(__file__).resolve().parents[1]
SOURCE_GLB = MODULE_DIR / "assets" / "world" / "celestial_world_runtime_tapered.glb"

CELL = 2.0 * DISC_R / GRID_N


def main():
    obj = import_world(SOURCE_GLB)
    mesh = obj.data
    mw = obj.matrix_world
    print("PROBE matrix_world:", [round(v, 4) for row in mw for v in row], flush=True)

    rot = np.asarray(mw.to_3x3(), dtype=np.float64)
    fnorm_direct = np.array([tuple(p.normal) for p in mesh.polygons], dtype=np.float64)
    print("PROBE direct nz>0.05:", int((fnorm_direct[:, 2] > 0.05).sum()), "/", len(fnorm_direct), flush=True)
    wnorm = fnorm_direct @ rot.T
    print("PROBE world nz>0.05:", int((wnorm[:, 2] > 0.05).sum()), flush=True)

    co = np.empty(len(mesh.vertices) * 3, dtype=np.float32)
    mesh.vertices.foreach_get("co", co)
    world = co.astype(np.float64).reshape(-1, 3) @ rot.T + np.asarray(mw.translation)

    upward_mask = wnorm[:, 2] > 0.05
    polys = mesh.polygons
    up_cell_z = {}
    for fi in np.nonzero(upward_mask)[0]:
        for vi in polys[int(fi)].vertices:
            wx, wy, wz = world[vi]
            key = (int((wx + DISC_R) / CELL), int((wy + DISC_R) / CELL))
            if 0 <= key[0] < GRID_N and 0 <= key[1] < GRID_N:
                z0 = up_cell_z.get(key)
                if z0 is None or wz > z0:
                    up_cell_z[key] = float(wz)
    print("PROBE manual grid valid:", len(up_cell_z), "/", GRID_N * GRID_N, flush=True)

    inside_disc = sum(
        1
        for (gx, gy) in up_cell_z
        if math_hypot2(gx, gy) <= 7.45 ** 2
    )
    print("PROBE manual grid valid inside disc r7.45:", inside_disc, flush=True)

    terrain = TerrainLookup(obj)
    for point in ((0.216, -2.206), (0.0, 0.0), (-2.4173, -2.7133), (-4.588, 4.1933), (6.1667, -1.4307)):
        gx = int(round((point[0] + DISC_R) / CELL))
        gy = int(round((point[1] + DISC_R) / CELL))
        manual = None
        best = 1e9
        for radius in range(0, 6):
            found = None
            for a in range(gx - radius, gx + radius + 1):
                for b in range(gy - radius, gy + radius + 1):
                    if max(abs(a - gx), abs(b - gy)) != radius:
                        continue
                    value = up_cell_z.get((a, b))
                    if value is not None:
                        found = value
                        break
                if found is not None:
                    break
            if found is not None:
                manual = found
                break
        print("PROBE h(%.3f,%.3f) lookup=%.4f manual=%s cellvalid=%s" % (
            point[0], point[1],
            terrain.height(point[0], point[1]) if terrain.height(point[0], point[1]) is not None else float("nan"),
            round(manual, 4) if manual is not None else None,
            bool(terrain.valid[gx, gy]),
        ), flush=True)

    near = []
    for (gx, gy), z in up_cell_z.items():
        cx = (gx + 0.5) * CELL - DISC_R
        cy = (gy + 0.5) * CELL - DISC_R
        d2 = (cx - 0.216) ** 2 + (cy + 2.206) ** 2
        if d2 <= 1.2 ** 2:
            near.append(z)
    near.sort()
    print("PROBE up-surface samples within 1.2 of massif centroid: n=%d" % len(near), flush=True)
    if near:
        k = len(near)
        print("PROBE   min=%.3f p25=%.3f med=%.3f p75=%.3f max=%.3f" % (
            near[0], near[k // 4], near[k // 2], near[(3 * k) // 4], near[-1],
        ), flush=True)


def math_hypot2(gx, gy):
    cx = (gx + 0.5) * CELL - DISC_R
    cy = (gy + 0.5) * CELL - DISC_R
    return cx * cx + cy * cy


main()
