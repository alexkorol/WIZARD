# Pixel Art Creator

A web-based pixel art creation tool that offers an intuitive interface for drawing, editing, and exporting pixel art. Perfect for creating game assets, icons, or retro-style illustrations.

## Features

- **Interactive Canvas**: Click and drag to draw pixels
- **Color Selection**: Built-in color picker for precise color choices
- **Multiple Canvas Sizes**: Support for 16x16, 32x32, and 64x64 grids
- **Grid Toggle**: Show/hide grid lines for better visibility
- **Export Options**: Save your artwork as PNG files
- **Responsive Design**: Works across different screen sizes

## Current State

The tool is stable and fully functional with core features implemented:
- Basic drawing functionality
- Color picker integration
- Canvas size options
- Grid visibility toggle
- PNG export capability

## TODOs and Future Improvements

1. Layer System
   - [ ] Add support for multiple layers
   - [ ] Implement layer opacity control
   - [ ] Add layer blending modes
   - [ ] Include layer reordering

2. Drawing Tools
   - [ ] Add line tool for straight lines
   - [ ] Implement rectangle and circle tools
   - [ ] Add flood fill tool
   - [ ] Include selection tool for moving pixels

3. History Management
   - [ ] Implement undo/redo functionality
   - [ ] Add action history panel
   - [ ] Include snapshot system
   - [ ] Add auto-save feature

4. Animation Support
   - [ ] Add animation frames
   - [ ] Implement onion skinning
   - [ ] Add frame preview
   - [ ] Include animation export (GIF)

5. Advanced Features
   - [ ] Add symmetry tools
   - [ ] Implement custom brushes
   - [ ] Add palette management
   - [ ] Include sprite sheet export

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
