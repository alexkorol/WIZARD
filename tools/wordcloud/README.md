# Interactive Word Cloud

A dynamic, force-directed word cloud visualization that shows relationships between terms and concepts. Words are positioned based on their relationships, with connected terms being drawn closer together.

## Features

- **Force-Directed Layout**: Words position themselves dynamically based on relationships
- **Interactive Visualization**: Hover and click interactions reveal term connections
- **Dynamic Relationships**: Lines show connections between related terms
- **Smooth Animations**: Terms smoothly transition when relationships change
- **Responsive Design**: Adapts to different screen sizes

## Current State

The tool is in active development with core functionality implemented:
- Basic force-directed layout
- Word positioning and scaling
- Relationship visualization
- Hover effects and highlighting

## TODOs and Future Improvements

1. Search and Filtering
   - [ ] Add search functionality to highlight specific terms
   - [ ] Implement filtering by categories or groups
   - [ ] Add ability to show/hide specific term groups

2. Data Management
   - [ ] Add UI for adding/removing terms
   - [ ] Implement relationship strength configuration
   - [ ] Add import/export functionality for word sets

3. Visual Enhancements
   - [ ] Add customizable color schemes
   - [ ] Implement different relationship line styles
   - [ ] Add zoom and pan controls

4. Interaction Improvements
   - [ ] Add double-click to focus/expand term
   - [ ] Implement touch controls for mobile
   - [ ] Add gesture support for manipulation

5. Performance Optimization
   - [ ] Improve force calculation efficiency
   - [ ] Implement term culling for large datasets
   - [ ] Add level-of-detail for different zoom levels

## Usage

The word cloud can be accessed through:
1. The main WIZARD dashboard
2. Directly via `tools/wordcloud/dist/index.html`

### Interaction Guide
- Hover over terms to highlight connections
- Click and drag terms to reposition them
- Watch as the force-directed layout automatically adjusts

## Technical Details

Built using:
- D3.js for force-directed layout
- SVG for rendering
- JavaScript for interactions and animations

## Integration

To integrate this component into another project:
1. Copy the necessary files from the `dist` directory
2. Include the required dependencies
3. Initialize the word cloud with your data
4. Customize styling as needed

## Dependencies

- D3.js
- Modern web browser with SVG support

## Contributing

Contributions are welcome! Please check the main project README for contribution guidelines.