# WordSphere

WordSphere is an interactive 3D visualization component that displays words or terms in a spherical arrangement. The words are positioned on the surface of a sphere and can be rotated and interacted with using mouse controls.

## Features

- 3D spherical arrangement of words
- Smooth rotation animation
- Interactive mouse controls for rotation
- Hover effects with highlighting of connected terms
- Depth-based sizing and opacity
- Responsive design that works on different screen sizes

## Usage

Simply open `index.html` in a web browser to view the WordSphere. The sphere will automatically rotate, and you can:

- Click and drag to rotate the sphere manually
- Hover over words to highlight them and their connections
- Release the mouse to resume automatic rotation

## Technical Details

The WordSphere is built using:

- React for the UI components
- SVG for rendering
- JavaScript for 3D mathematics and animations

The sphere is generated using an icosahedron base that is subdivided to create a more spherical shape. Words are then mapped onto the vertices of this geometry.

## Customization

To customize the words displayed in the sphere, modify the `terms` array in the `wordsphere.js` file:

```javascript
const terms = [
    'React', 'Vue', 'Angular',
    // Add or modify terms here...
];
```

## Integration

To integrate the WordSphere into another project:

1. Copy the `wordsphere.js` file
2. Include the necessary React dependencies
3. Import and use the WordSphere component
4. Style as needed using CSS

## Dependencies

- React 17+
- ReactDOM 17+
- Babel (for JSX transformation)