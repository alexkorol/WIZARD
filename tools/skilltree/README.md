# Interactive Skill Tree

A node-based interactive skill tree visualization inspired by ARPG skill trees and the esoteric Tree of Life. Features an intuitive point-based progression system with path dependencies and connection visualization.

## Features

- **Interactive Nodes**: Click to activate/deactivate skills
- **Point Management**: Skill point allocation and refund system
- **Path Dependencies**: Skills must be connected to active nodes
- **Visual Feedback**: Clear connection visualization
- **Base Node System**: Auto-locked starting node (Malkuth)
- **Validation**: Prevents invalid skill configurations

## Current State

The tool is stable and functional with core features implemented:
- Basic node interaction system
- Skill point management
- Path dependency validation
- Connection visualization
- Tree integrity maintenance

## TODOs and Future Improvements

1. Skill System
   - [ ] Add different skill types/categories
   - [ ] Implement skill levels/ranks
   - [ ] Add skill prerequisites
   - [ ] Include skill descriptions/tooltips

2. Visual Enhancements
   - [ ] Add node icons/images
   - [ ] Implement connection animations
   - [ ] Add hover effects
   - [ ] Include path highlighting

3. Progression System
   - [ ] Add multiple skill point types
   - [ ] Implement skill tree branches
   - [ ] Add progression milestones
   - [ ] Include achievement system

4. Data Management
   - [ ] Add save/load functionality
   - [ ] Implement build sharing
   - [ ] Add build templates
   - [ ] Include export/import system

5. Customization
   - [ ] Add custom node layouts
   - [ ] Implement theme system
   - [ ] Add custom connection styles
   - [ ] Include node grouping

## Usage

The Skill Tree can be accessed through:
1. The main WIZARD dashboard
2. Directly via `tools/skilltree/index.html`

### Interaction Guide
1. Start from the base node (Malkuth)
2. Click nodes to activate them (costs 1 skill point)
3. Only connect to already active nodes
4. Click active nodes to deactivate (refunds 1 point)
5. Maintain tree connectivity when deactivating

## Technical Details

Built using:
- HTML5 Canvas for rendering
- JavaScript for tree logic
- Custom path-finding algorithms
- Event-based interaction system

## Integration

To integrate this component into another project:
1. Copy the necessary HTML, CSS, and JavaScript files
2. Include the required dependencies
3. Initialize the skill tree with desired configuration
4. Customize node layouts and styling as needed

## Dependencies

- Modern web browser with Canvas support
- JavaScript enabled

## Contributing

Contributions are welcome! Please check the main project README for contribution guidelines.

---

For bug reports or feature requests, please use the GitHub issues system.
