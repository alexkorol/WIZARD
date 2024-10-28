# Geometric Skill Tree

A hexagonal grid-based interactive skill tree visualization inspired by Path of Exile's passive skill system. This app is part of the WIZARD project.

## Features
- Hexagonal grid layout with intersecting circles
- Interactive node selection/deselection
- Connection visualization
- Dual point system (Node and Arc points)
- Visual feedback for available/active/inactive states
- Tooltip system for node information
- Drag animation effects

## Getting Started
```bash
git clone https://github.com/yourusername/wizard.git
cd wizard/tools/geometric_skilltree
```
Open `index.html` in your browser to view the skill tree.

## Usage
- Click nodes to activate/deactivate them
- Each node costs 1 node point
- Each connection costs 1 arc point
- Nodes must be connected via active arcs
- Cannot deactivate nodes that would disconnect the tree
- Hover over nodes to see connections

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

## License
MIT License
