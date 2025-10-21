# Pixel Art Creator

A web-based pixel art creation tool that offers an intuitive interface for drawing, editing, and exporting pixel art. Perfect for creating game assets, icons, or retro-style illustrations.

## Features

- **Interactive Canvas**: Pointer-driven workflow with pen, eraser, and eyedropper tools
- **Symmetry Helpers**: Horizontal and vertical mirroring for rapid sprite blocking
- **Multiple Canvas Sizes**: Support for 16x16, 32x32, and 64x64 grids with instant resizing
- **Grid & Palette Management**: Toggleable grid overlay and auto-generated reusable palette swatches
- **History Tools**: Unlimited undo/redo stacks (50-step safety cap) to encourage experimentation
- **Export Options**: Save artwork as PNG or structured JSON data for importing into engines
- **Responsive Design**: Works across different screen sizes

## Current State

The tool is stable and fully functional with the upgraded workflow:
- Painting, erasing, and color sampling tools
- Symmetry toggles for horizontal/vertical mirroring
- Canvas size options with non-destructive reinitialisation
- Grid visibility toggle
- Undo/redo support and persistent palette swatches
- PNG and JSON export capability

## Research Snapshot & Roadmap

To ensure the editor matures into a production-ready asset tool we compared our experience against modern pixel art suites such as **Aseprite**, **Pixelorama**, and **LibreSprite**. These tools consistently highlight a few pillars we should adopt:

1. **Robust Layer & Timeline Controls** (Aseprite, Pixelorama)
   - Multi-layer stack with visibility toggles and opacity per layer
   - Frame timeline with onion skinning to preview animation arcs
   - Export of animated GIF/PNG sequences directly from the timeline

2. **Advanced Drawing Utilities** (Aseprite, LibreSprite)
   - Vector-assisted line/shape tools and configurable brush tips
   - Flood fill with tolerance/contiguous options for cleaning flats
   - Selection/move/transform tools (flip, rotate, nudge) for quick iteration

3. **Palette & Color Science Enhancements** (Pixelorama)
   - Dockable palette panel with palette import/export (e.g., `.gpl`, `.aseprite`)
   - Real-time HSV/temperature sliders and ramp generators for shading
   - Contrast/tiling preview helpers for readability checks

4. **Game-Ready Integrations**
   - Sprite sheet packing presets for common engines (Unity, Godot, Phaser)
   - JSON metadata export containing animations, hitboxes, and slice data
   - Optional grid snapping presets (8x8, 16x16) aligned with retro consoles

5. **Quality-of-Life Polish**
   - Configurable keyboard shortcuts mirroring Aseprite defaults where possible
   - Quick look-up tables for dither patterns and highlight/shadow ramp templates
   - Workspace theming (dark/light) and panel docking for multi-monitor setups

These targets form the foundation of our next iteration roadmap:

1. **Layer & Timeline MVP**
   - Implement dual-layer painting and frame timeline with onion skin toggle
   - Provide GIF export and JSON metadata bundling frame durations

2. **Selection & Transform Tools**
   - Rectangular and lasso selections with move/duplicate/flip operations
   - Smart flood fill with contiguous toggle and tolerance slider

3. **Palette Workbench**
   - Persistent palette panel with palette import/export
   - Gradient ramp generator using perceptual color spaces (OKLab/OKLCH)

4. **Engine Export Templates**
   - Sprite sheet exporter with Unity/Godot compatible metadata
   - Tilemap exporter supporting CSV and Tiled `.tmx` formats

5. **Workspace Customisation**
   - Keyboard shortcut editor and UI theme presets (noir, light, solarized)
   - Reference layer support to overlay concept art while painting

## Usage

The Pixel Art Creator can be accessed through:
1. The main WIZARD dashboard
2. Directly via `tools/pixelart/index.html`

### Drawing Guide
1. Select a color using the color picker
2. Choose your canvas size (16x16, 32x32, or 64x64)
3. Click and drag on the canvas to draw
4. Use the grid toggle for better precision
5. Save your work as PNG when finished

## Technical Details

Built using:
- HTML5 Canvas for rendering
- JavaScript for drawing logic
- Native color picker integration
- File API for saving artwork

## Integration

To integrate this component into another project:
1. Copy the necessary HTML, CSS, and JavaScript files
2. Include the required dependencies
3. Initialize the canvas with desired settings
4. Customize styling as needed

## Dependencies

- Modern web browser with Canvas support
- JavaScript enabled
- File API support for saving

## Contributing

Contributions are welcome! Please check the main project README for contribution guidelines.

---

For bug reports or feature requests, please use the GitHub issues system.
