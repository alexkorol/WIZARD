"""Taper the optimized Verdigris Meshy world in Blender and render QA views.

The source GLB is already cleaned and decimated.  This pass preserves its
authored underside relief while compressing the outer hanging mass and keeping
the deepest central forms, producing a shallower disc that resolves into a
single spinning-top peak instead of a hemisphere.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector


def arguments() -> tuple[Path, Path, Path]:
    values = sys.argv[sys.argv.index("--") + 1 :]
    if len(values) != 3:
        raise SystemExit("usage: blender --background --python blender_taper_world.py -- input.glb output.glb preview_dir")
    return tuple(Path(value).resolve() for value in values)


def look_at(camera: bpy.types.Object, target: Vector) -> None:
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()


def world_bounds(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    points = [obj.matrix_world @ Vector(corner) for obj in objects for corner in obj.bound_box]
    return (
        Vector((min(point.x for point in points), min(point.y for point in points), min(point.z for point in points))),
        Vector((max(point.x for point in points), max(point.y for point in points), max(point.z for point in points))),
    )


def taper_mesh(obj: bpy.types.Object, rim_z: float, bottom_z: float, radius: float) -> int:
    inverse = obj.matrix_world.inverted()
    changed = 0
    for vertex in obj.data.vertices:
        world = obj.matrix_world @ vertex.co
        if world.z >= rim_z:
            continue
        depth = rim_z - world.z
        depth_ratio = min(1.0, max(0.0, depth / max(0.001, rim_z - bottom_z)))
        radial = math.hypot(world.x, world.y)
        radial_ratio = min(1.0, radial / radius)

        # Keep all of Meshy's relief, but pull deep forms inward as they descend.
        taper = 1.0 - 0.47 * (depth_ratio ** 1.12)
        world.x *= taper
        world.y *= taper

        # Compress the outer underside strongly while retaining the central peak.
        central_weight = (1.0 - radial_ratio) ** 1.45
        vertical_scale = 0.56 + central_weight * 0.48
        central_peak = max(0.0, 1.0 - radial_ratio / 0.24) ** 2 * depth_ratio * 0.13
        world.z = rim_z - depth * (vertical_scale + central_peak)
        vertex.co = inverse @ world
        changed += 1

    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.00008)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(obj.data)
    bm.free()
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    obj.data.update()
    return changed


def preview_material() -> bpy.types.Material:
    material = bpy.data.materials.new("Verdigris underside QA")
    material.use_nodes = True
    principled = material.node_tree.nodes.get("Principled BSDF")
    principled.inputs["Base Color"].default_value = (0.075, 0.115, 0.135, 1.0)
    principled.inputs["Roughness"].default_value = 0.68
    principled.inputs["Metallic"].default_value = 0.04
    return material


def add_area_light(name: str, location: tuple[float, float, float], energy: float, color: tuple[float, float, float], size: float) -> None:
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = color
    data.size = size
    light = bpy.data.objects.new(name, data)
    light.location = location
    bpy.context.scene.collection.objects.link(light)
    look_at(light, Vector((0, 0, -1.1)))


def render_previews(meshes: list[bpy.types.Object], preview_dir: Path, bounds: tuple[Vector, Vector]) -> None:
    preview_dir.mkdir(parents=True, exist_ok=True)
    material = preview_material()
    for obj in meshes:
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
        "side": (0.0, -23.5, 1.0),
        "quarter": (15.5, -17.5, 2.0),
        "bottom": (0.02, 0.02, -24.0),
    }
    for name, location in views.items():
        camera.location = location
        look_at(camera, Vector((center.x, center.y, -1.0)))
        scene.render.filepath = str(preview_dir / f"tapered_{name}.png")
        bpy.ops.render.render(write_still=True)


def main() -> None:
    source, output, preview_dir = arguments()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(source))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not meshes:
        raise RuntimeError("No mesh objects found in source GLB")

    before = world_bounds(meshes)
    changed = sum(taper_mesh(obj, rim_z=0.10, bottom_z=before[0].z, radius=7.4) for obj in meshes)
    after = world_bounds(meshes)

    bpy.ops.object.select_all(action="DESELECT")
    for obj in meshes:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(output),
        export_format="GLB",
        export_selected=True,
        export_apply=True,
        export_yup=True,
    )
    render_previews(meshes, preview_dir, after)
    print(
        "VERDIGRIS_TAPER",
        {
            "objects": len(meshes),
            "changed_vertices": changed,
            "before": [tuple(round(value, 4) for value in vector) for vector in before],
            "after": [tuple(round(value, 4) for value in vector) for vector in after],
            "output": str(output),
        },
    )


if __name__ == "__main__":
    main()
