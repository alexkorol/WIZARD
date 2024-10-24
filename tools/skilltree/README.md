# Interactive Skill Tree

A node-based interactive skill tree visualization based on action RPG skill trees the esoteric tree of life. Part of the WIZARD project.

## Features
- Interactive node selection/deselection
- Connection visualization
- Skill point management
- Auto-locked starting node (Malkuth)
- Path dependency system

## Getting Started
```bash
git clone https://github.com/yourusername/wizard.git
cd wizard/tools/skilltree
```
Open `index.html` in your browser to view the skill tree.

## Usage
- Click nodes to activate/deactivate them
- Each node costs 1 skill point
- Nodes must be connected to active nodes
- Malkuth (bottom node) is always active
- Deactivating a node refunds 1 skill point
- Cannot deactivate nodes that would disconnect the tree

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

## License
MIT License