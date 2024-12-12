# WordSphere

WordSphere is an interactive 3D visualization component that displays words or terms in a spherical arrangement. The words are positioned on the surface of a sphere and can be rotated and interacted with using mouse controls.

## Features

- 3D spherical arrangement of words
- Momentum-based rotation with natural damping
- Interactive mouse controls for rotation
- Hover effects with highlighting of connected terms
- Depth-based sizing and opacity
- Text background for improved readability
- Responsive design that works on different screen sizes

## Usage

Simply open `index.html` in a web browser to view the WordSphere. The sphere will automatically rotate, and you can:

- Click and drag to rotate the sphere manually
- Release while dragging to continue rotation with momentum
- Hover over words to highlight them and their connections
- Let go to allow the sphere to continue rotating with momentum

## Technical Details

The WordSphere is built using:

- React for the UI components
- SVG for rendering
- JavaScript for 3D mathematics and animations

The sphere is generated using an icosahedron base that is subdivided to create a more spherical shape. Words are then mapped onto the vertices of this geometry using a distance-based algorithm to prevent overlapping.

## Current State

The component is functional and includes:
- Basic 3D sphere visualization
- Word placement with overlap prevention
- Momentum-based rotation
- Text backgrounds for readability
- Interactive highlighting

## TODOs and Future Improvements

1. Interaction Improvements
   - [ ] Add zoom in/out functionality
   - [ ] Implement touch controls for mobile devices
   - [ ] Add double-click to center on a word

2. Visual Enhancements
   - [ ] Add configuration options for colors and styles
   - [ ] Implement different background patterns/styles
   - [ ] Add transition animations for hover effects

3. Content Management
   - [ ] Add ability to customize words through UI
   - [ ] Implement word categories/grouping
   - [ ] Add support for different text sizes based on importance

4. Performance
   - [ ] Optimize vertex calculations for larger datasets
   - [ ] Implement level-of-detail for distant words
   - [ ] Add frame rate optimization for slower devices

5. Accessibility
   - [ ] Add keyboard navigation
   - [ ] Implement ARIA labels
   - [ ] Add high contrast mode

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
