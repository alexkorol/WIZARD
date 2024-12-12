# Geometric Skill Tree

A hexagonal grid-based interactive skill tree visualization inspired by Path of Exile's passive skill system. Features a mathematically precise implementation based on circle geometry and hexagonal coordinates.

## Features

- **Hexagonal Grid Layout**: Mathematically precise hexagonal grid system
- **Interactive Nodes**: Click to activate/deactivate skills
- **Dual Point System**: Separate node and arc point management
- **Connection Visualization**: Clear visual representation of paths
- **Mathematical Foundation**: Based on circle geometry and the Seed of Life
- **Advanced Pathfinding**: Implements multiple pathfinding algorithms
- **State Management**: Comprehensive prerequisite and branch systems
- **Responsive Design**: Supports zooming and panning

## Current State

The tool is stable and functional with core features implemented:
- Complete hexagonal grid system
- Node activation/deactivation
- Point allocation system
- Connection management
- Path validation
- Interactive controls
- Visual feedback system

## TODOs and Future Improvements

1. User Interface
   - [ ] Add skill tooltips
   - [ ] Implement skill search
   - [ ] Add minimap navigation
   - [ ] Include zoom controls UI

2. Skill System
   - [ ] Add skill categories
   - [ ] Implement skill levels
   - [ ] Add skill prerequisites
   - [ ] Include skill descriptions

3. Visual Enhancements
   - [ ] Add node icons
   - [ ] Implement connection animations
   - [ ] Add allocation effects
   - [ ] Include theme customization

4. Data Management
   - [ ] Add build saving
   - [ ] Implement build sharing
   - [ ] Add build templates
   - [ ] Include export/import

5. Advanced Features
   - [ ] Add path optimization
   - [ ] Implement build suggestions
   - [ ] Add statistical analysis
   - [ ] Include build validation

---

## Mathematical Foundations

### 1. Circle Geometry and the Seed of Life

#### 1.1 Basic Circle Properties

The fundamental building block of the Seed of Life is the circle. For a circle with center \((x_0, y_0)\) and radius \(r\):

- **Circle Equation**: \((x - x_0)^2 + (y - y_0)^2 = r^2\)
- **Circumference**: \(C = 2\pi r\)
- **Area**: \(A = \pi r^2\)

#### 1.2 Seed of Life Construction

The Seed of Life consists of seven circles of equal radius arranged in a specific pattern:

1. **Central Circle**: Begin with a central circle \(C_0\) with radius \(r\).
2. **Peripheral Circles**: Six peripheral circles \(C_1\) through \(C_6\) are placed around \(C_0\).
3. **Positioning**: Each peripheral circle's center lies on the circumference of \(C_0\).
4. **Spacing**: Centers of peripheral circles are spaced at \(60°\) intervals (\(\frac{\pi}{3}\) radians).

For a Seed of Life centered at the origin \((0,0)\) with radius \(r\), the centers of peripheral circles are at:
\[
C_n: \left(r\cos\left(\frac{2\pi n}{6}\right),\ r\sin\left(\frac{2\pi n}{6}\right)\right) \quad \text{where } n = 1,2,\ldots,6
\]

![Construction Diagram](https://github.com/alexkorol/WIZARD/blob/gh-pages/tools/geometric_skilltree/assets/construction_diagram.PNG)


### 2. Hexagonal Geometry

#### 2.1 Regular Hexagon Properties

The Seed of Life naturally forms a regular hexagon:

- **Interior Angles**: \(120°\) each.
- **Sides**: All sides are of equal length.
- **Vertices**: All vertices are equidistant from the center.
- **Side Length Relation**: \(s = r\), where \(s\) is the side length and \(r\) is the radius.
- **Area**: \(A = \frac{3\sqrt{3}}{2}r^2\)

#### 2.2 Hexagonal Tiling

Hexagons tessellate perfectly with:

- **Vertex Sharing**: Each vertex is shared by 3 hexagons.
- **Edge Sharing**: Each edge is shared by 2 hexagons.
- **No Gaps or Overlaps**: Seamless tiling.
- **Vertex Coordinates**: For a regular hexagon at the origin:
\[
(r\cos(\frac{2\pi k}{6}),\ r\sin(\frac{2\pi k}{6})) \quad \text{where } k = 0,1,\ldots,5
\]

### 3. Triangular Subdivision

#### 3.1 Equilateral Triangle Properties

The Seed of Life pattern contains multiple equilateral triangles:

- **Angles**: All angles are \(60°\).
- **Sides**: All sides are of equal length.
- **Height Relation**: \(h = s\frac{\sqrt{3}}{2}\), where \(s\) is the side length.
- **Area**: \(A = \frac{s^2\sqrt{3}}{4}\)

#### 3.2 Triangular Grid System

For implementation, a triangular grid is used where:

- **Subdivision**: Each hexagon divides into 6 equilateral triangles.
- **Grid Coordinates**: Expressed as \((a + b\cos(60°),\ b\sin(60°))\) where \(a\) and \(b\) are integer grid coordinates.

### 4. The Flower of Life Extension

The Flower of Life extends the Seed of Life pattern:

1. **Start with Seed of Life**.
2. **Additional Circles**: Create additional circles centered at each intersection point.
3. **Pattern Continuation**: Continue outward maintaining \(60°\) symmetry.
4. **Resulting Pattern**: Overlapping circles forming multiple hexagonal arrangements and equilateral triangles at various scales, maintaining perfect \(60°\) rotational symmetry.

**Mathematical Relationship Between Iterations**:

- **New Layers**: Each new layer adds 6 more circles than the previous layer.
- **Number of Circles in Layer \(n\)**: \(6n\)
- **Total Circles After \(n\) Layers**: \(1 + \sum_{k=1}^n 6k\)

---

## Node Organization and Coordinate Systems

### 1. Coordinate Systems

#### 1.1 Axial Coordinates

![Coordinate System Diagram](https://raw.githubusercontent.com/alexkorol/WIZARD/7d4377edf6ec0ca25ff8c4821c15cea0d7632f81/tools/geometric_skilltree/assets/coordinate-system-diagram.svg)


For a hexagonal grid, an axial coordinate system \((q, r)\) is used where:

- **\(q\)**: Position along the first axis (horizontal).
- **\(r\)**: Position along the second axis (\(60°\) from horizontal).
- **Implicit Third Axis**: \(s = -q - r\) (creates constraint for hexagonal grid).

**Benefits**:

- **Integer Coordinates**: All intersection points have integer coordinates.
- **Neighbor Calculations**: Simplifies calculations for neighboring nodes.
- **Hexagonal Symmetry**: Naturally represents hexagonal symmetry.

#### 1.2 Converting Between Coordinate Systems

**From Axial to Pixel Coordinates**:

```javascript
function axialToPixel(q, r, size) {
    const x = size * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r);
    const y = size * (3/2 * r);
    return {x, y};
}
```

**From Pixel to Axial Coordinates**:

```javascript
function pixelToAxial(x, y, size) {
    const q = (Math.sqrt(3)/3 * x - 1/3 * y) / size;
    const r = (2/3 * y) / size;
    return roundAxial(q, r);
}

// Round to nearest valid hex coordinates
function roundAxial(q, r) {
    let s = -q - r;
    
    let qi = Math.round(q);
    let ri = Math.round(r);
    let si = Math.round(s);
    
    const qDiff = Math.abs(qi - q);
    const rDiff = Math.abs(ri - r);
    const sDiff = Math.abs(si - s);
    
    if (qDiff > rDiff && qDiff > sDiff) {
        qi = -ri - si;
    } else if (rDiff > sDiff) {
        ri = -qi - si;
    } else {
        si = -qi - ri;
    }
    
    return {q: qi, r: ri};
}
```

### 2. Node Organization

![Interaction Diagram](https://github.com/alexkorol/WIZARD/blob/gh-pages/tools/geometric_skilltree/assets/interaction_diagram.PNG?raw=true)


#### 2.1 Layer-based Indexing

Nodes are organized in layers radiating from the center:

- **Layer 0**: Center point \((0,0)\).
- **Layer 1**: 6 points at distance 1.
- **Layer \(n\)**: \(6n\) points at distance \(n\).

```javascript
class Node {
    constructor(q, r, layer) {
        this.q = q;
        this.r = r;
        this.layer = layer;
        this.index = null;  // Set during initialization
        this.connections = new Set();
        this.allocated = false;
    }
    
    getKey() {
        return `${this.q},${this.r}`;
    }
}

function generateNodes(layers) {
    const nodes = new Map();
    let index = 0;
    
    // Add center
    const center = new Node(0, 0, 0);
    center.index = index++;
    nodes.set(center.getKey(), center);
    
    // Generate each layer
    for(let layer = 1; layer <= layers; layer++) {
        for(let side = 0; side < 6; side++) {
            for(let pos = 0; pos < layer; pos++) {
                const [q, r] = getLayerPosition(layer, side, pos);
                const node = new Node(q, r, layer);
                node.index = index++;
                nodes.set(node.getKey(), node);
            }
        }
    }
    
    return nodes;
}
```

#### 2.2 Connection Management

Tracks valid connections between nodes:

```javascript
class SkillTree {
    constructor(layers) {
        this.nodes = generateNodes(layers);
        this.connections = this.generateConnections();
        this.allocatedNodes = new Set();
    }
    
    generateConnections() {
        const connections = new Set();
        
        for(const node of this.nodes.values()) {
            const neighbors = this.getNeighbors(node);
            for(const neighbor of neighbors) {
                const connection = this.createConnection(node, neighbor);
                connections.add(connection);
            }
        }
        
        return connections;
    }
    
    createConnection(node1, node2) {
        const [a, b] = [node1, node2].sort((a, b) => a.index - b.index);
        return `${a.index}-${b.index}`;
    }
    
    getNeighbors(node) {
        // Relative coordinates of potential neighbors
        const directions = [
            {q: 1, r: 0}, {q: 0, r: 1}, {q: -1, r: 1},
            {q: -1, r: 0}, {q: 0, r: -1}, {q: 1, r: -1}
        ];
        
        return directions
            .map(dir => {
                const key = `${node.q + dir.q},${node.r + dir.r}`;
                return this.nodes.get(key);
            })
            .filter(n => n !== undefined);
    }
}
```

---

## Implementation Considerations

### 1. Coordinate Systems

For canvas implementation, convert from mathematical to screen coordinates:

- **Mathematical Coordinates**: Origin at center, y-axis points up.
- **Screen Coordinates**: Origin at top-left, y-axis points down.
- **Transformation**:
  - \(x_{\text{screen}} = x_{\text{math}} + \text{width}/2\)
  - \(y_{\text{screen}} = -y_{\text{math}} + \text{height}/2\)

### 2. Useful Functions

Key geometric calculations:

```javascript
// Distance between points
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

// Convert polar to cartesian coordinates
function polarToCartesian(r, theta) {
    return {
        x: r * Math.cos(theta),
        y: r * Math.sin(theta)
    };
}

// Get regular polygon vertices
function regularPolygonPoints(cx, cy, r, n, rotationAngle = 0) {
    const points = [];
    for(let i = 0; i < n; i++) {
        const angle = rotationAngle + (i * 2 * Math.PI / n);
        points.push({
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle)
        });
    }
    return points;
}
```

---

## Advanced Skill Tree Implementation

### 1. Pathfinding Algorithms

#### 1.1 Breadth-First Search (BFS)

Optimal for finding shortest paths in unweighted graphs:

```javascript
class SkillTree {
    findShortestPath(startNode, endNode) {
        const queue = [{node: startNode, path: [startNode]}];
        const visited = new Set([startNode.getKey()]);
        
        while (queue.length > 0) {
            const {node, path} = queue.shift();
            
            if (node === endNode) {
                return path;
            }
            
            const neighbors = this.getAllocatedNeighbors(node);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.getKey())) {
                    visited.add(neighbor.getKey());
                    queue.push({
                        node: neighbor,
                        path: [...path, neighbor]
                    });
                }
            }
        }
        
        return null; // No path exists
    }
    
    getAllocatedNeighbors(node) {
        return this.getNeighbors(node).filter(n => n.allocated);
    }
}
```

#### 1.2 Dijkstra's Algorithm

For weighted paths (useful when different connections have different costs):

```javascript
class SkillTree {
    findCheapestPath(startNode, endNode) {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();
        
        // Initialize
        for (const node of this.nodes.values()) {
            distances.set(node.getKey(), Infinity);
            unvisited.add(node.getKey());
        }
        distances.set(startNode.getKey(), 0);
        
        while (unvisited.size > 0) {
            // Find minimum distance node
            let current = null;
            let minDistance = Infinity;
            for (const key of unvisited) {
                const distance = distances.get(key);
                if (distance < minDistance) {
                    minDistance = distance;
                    current = this.nodes.get(key);
                }
            }
            
            if (current === null) break;
            if (current === endNode) break;
            
            unvisited.delete(current.getKey());
            
            // Update neighbors
            const neighbors = this.getAllocatedNeighbors(current);
            for (const neighbor of neighbors) {
                if (!unvisited.has(neighbor.getKey())) continue;
                
                const cost = this.getConnectionCost(current, neighbor);
                const distance = distances.get(current.getKey()) + cost;
                
                if (distance < distances.get(neighbor.getKey())) {
                    distances.set(neighbor.getKey(), distance);
                    previous.set(neighbor.getKey(), current);
                }
            }
        }
        
        // Reconstruct path
        const path = [];
        let current = endNode;
        while (current !== undefined) {
            path.unshift(current);
            current = previous.get(current.getKey());
        }
        
        return path;
    }
    
    getConnectionCost(node1, node2) {
        // Example: cost based on skill levels
        return Math.abs(node1.level - node2.level) + 1;
    }
}
```

### 2. Prerequisite System

#### 2.1 Prerequisite Graph

```javascript
class Skill {
    constructor(id, name, level = 1) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.prerequisites = new Map(); // skill ID -> required level
        this.allocated = false;
        this.maxLevel = 5;
    }
}

class PrerequisiteSystem {
    constructor() {
        this.skills = new Map();
        this.dependencyGraph = new Map();
    }
    
    addPrerequisite(skillId, prereqId, requiredLevel = 1) {
        const skill = this.skills.get(skillId);
        const prereq = this.skills.get(prereqId);
        
        if (!skill || !prereq) throw new Error('Invalid skill IDs');
        
        skill.prerequisites.set(prereqId, requiredLevel);
        
        // Track reverse dependencies
        if (!this.dependencyGraph.has(prereqId)) {
            this.dependencyGraph.set(prereqId, new Set());
        }
        this.dependencyGraph.get(prereqId).add(skillId);
    }
    
    canAllocatePoints(skillId, points = 1) {
        const skill = this.skills.get(skillId);
        if (!skill) return false;
        
        // Check max level
        if (skill.level + points > skill.maxLevel) return false;
        
        // Check prerequisites
        for (const [prereqId, requiredLevel] of skill.prerequisites) {
            const prereq = this.skills.get(prereqId);
            if (!prereq || prereq.level < requiredLevel) {
                return false;
            }
        }
        
        return true;
    }
    
    validateDependencies(skillId) {
        const dependencies = this.dependencyGraph.get(skillId) || new Set();
        
        for (const depId of dependencies) {
            const skill = this.skills.get(depId);
            if (!this.arePrerequisitesMet(depId)) {
                skill.allocated = false;
                this.validateDependencies(depId);
            }
        }
    }
}
```

#### 2.2 Branch Management

```javascript
class SkillBranch {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.skills = new Set();
        this.maxPoints = 20;
        this.allocatedPoints = 0;
    }
    
    addSkill(skillId) {
        this.skills.add(skillId);
    }
    
    canAllocatePoints(points = 1) {
        return this.allocatedPoints + points <= this.maxPoints;
    }
}

class BranchSystem {
    constructor() {
        this.branches = new Map();
        this.skillToBranch = new Map();
    }
    
    addSkillToBranch(skillId, branchId) {
        const branch = this.branches.get(branchId);
        if (!branch) throw new Error('Invalid branch ID');
        
        branch.addSkill(skillId);
        this.skillToBranch.set(skillId, branchId);
    }
    
    getBranchForSkill(skillId) {
        const branchId = this.skillToBranch.get(skillId);
        return this.branches.get(branchId);
    }
}
```

### 3. Advanced Rendering System

![Render States Diagram](https://raw.githubusercontent.com/alexkorol/WIZARD/7d4377edf6ec0ca25ff8c4821c15cea0d7632f81/tools/geometric_skilltree/assets/render-states-diagram.svg)


#### 3.1 Canvas Rendering Class

```javascript
class SkillTreeRenderer {
    constructor(canvas, skillTree) {
        this.ctx = canvas.getContext('2d');
        this.skillTree = skillTree;
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1
        };
        this.nodeRadius = 20;
        this.animations = new Map();
    }
    
    transformContext() {
        this.ctx.save();
        this.ctx.translate(
            this.ctx.canvas.width / 2 + this.camera.x,
            this.ctx.canvas.height / 2 + this.camera.y
        );
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.transformContext();
        
        // Draw connections first
        this.renderConnections();
        
        // Draw nodes
        for (const node of this.skillTree.nodes.values()) {
            this.renderNode(node);
        }
        
        // Draw active animations
        this.renderAnimations();
        
        this.ctx.restore();
        
        requestAnimationFrame(() => this.render());
    }
    
    renderNode(node) {
        const pos = this.skillTree.axialToPixel(node.q, node.r, this.nodeRadius * 2);
        
        // Node background
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, this.nodeRadius, 0, Math.PI * 2);
        
        const style = this.getNodeStyle(node);
        this.ctx.fillStyle = style.fill;
        this.ctx.strokeStyle = style.stroke;
        this.ctx.lineWidth = style.strokeWidth;
        
        this.ctx.fill();
        this.ctx.stroke();
        
        // Node content
        this.renderNodeContent(node, pos);
    }
    
    renderNodeContent(node, pos) {
        // Level indicator
        if (node.level > 1) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.level.toString(), pos.x, pos.y);
        }
        
        // Skill icon or symbol
        // Add custom rendering here
    }
    
    renderConnections() {
        for (const connection of this.skillTree.connections) {
            const [nodeId1, nodeId2] = connection.split('-');
            const node1 = this.skillTree.nodes.get(nodeId1);
            const node2 = this.skillTree.nodes.get(nodeId2);
            
            const pos1 = this.skillTree.axialToPixel(node1.q, node1.r, this.nodeRadius * 2);
            const pos2 = this.skillTree.axialToPixel(node2.q, node2.r, this.nodeRadius * 2);
            
            const style = this.getConnectionStyle(node1, node2);
            
            this.ctx.beginPath();
            this.ctx.moveTo(pos1.x, pos1.y);
            this.ctx.lineTo(pos2.x, pos2.y);
            
            this.ctx.strokeStyle = style.stroke;
            this.ctx.lineWidth = style.strokeWidth;
            if (style.dash) {
                this.ctx.setLineDash(style.dash);
            }
            
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }
    
    addAllocationAnimation(node) {
        const animation = {
            progress: 0,
            startTime: performance.now(),
            duration: 500 // ms
        };
        
        this.animations.set(node.getKey(), animation);
    }
    
    renderAnimations() {
        const currentTime = performance.now();
        
        for (const [nodeKey, animation] of this.animations) {
            animation.progress = (currentTime - animation.startTime) / animation.duration;
            
            if (animation.progress >= 1) {
                this.animations.delete(nodeKey);
                continue;
            }
            
            const node = this.skillTree.nodes.get(nodeKey);
            const pos = this.skillTree.axialToPixel(node.q, node.r, this.nodeRadius * 2);
            
            // Allocation effect
            const radius = this.nodeRadius * (1 + animation.progress);
            const alpha = 1 - animation.progress;
            
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(76, 175, 80, ${alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }
    
    getNodeStyle(node) {
        if (node.allocated) {
            return {
                fill: '#4CAF50',
                stroke: '#2E7D32',
                strokeWidth: 2
            };
        }
        
        if (this.skillTree.canAllocate(node)) {
            return {
                fill: '#90CAF9',
                stroke: '#1976D2',
                strokeWidth: 2,
                opacity: 0.8
            };
        }
        
        return {
            fill: '#9E9E9E',
            stroke: '#616161',
            strokeWidth: 1,
            opacity: 0.4
        };
    }
    
    getConnectionStyle(node1, node2) {
        const state = getArcState(node1, node2);
        
        switch(state) {
            case 'complete':
                return { stroke: '#4CAF50', strokeWidth: 2 };
            case 'partial':
                return { stroke: '#FFC107', strokeWidth: 2, dash: [5, 5] };
            case 'unallocated':
                return { stroke: '#9E9E9E', strokeWidth: 1 };
        }
    }
}
```

#### 3.2 Interactive Controls

```javascript
class SkillTreeControls {
    constructor(canvas, renderer) {
        this.canvas = canvas;
        this.renderer = renderer;
        this.isDragging = false;
        this.lastMousePos = null;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        this.canvas.addEventListener('click', this.handleClick.bind(this));
    }
    
    handleMouseDown(event) {
        this.isDragging = true;
        this.lastMousePos = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    handleMouseMove(event) {
        if (!this.isDragging) return;
        
        const dx = event.clientX - this.lastMousePos.x;
        const dy = event.clientY - this.lastMousePos.y;
        
        this.renderer.camera.x += dx;
        this.renderer.camera.y += dy;
        
        this.lastMousePos = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    handleMouseUp() {
        this.isDragging = false;
    }
    
    handleWheel(event) {
        event.preventDefault();
        
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        this.renderer.camera.zoom *= zoomFactor;
        
        // Clamp zoom
        this.renderer.camera.zoom = Math.max(0.5, Math.min(2, this.renderer.camera.zoom));
    }
    
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const node = this.findNodeAtPosition(x, y);
        if (node && this.renderer.skillTree.canAllocate(node)) {
            this.renderer.skillTree.allocateNode(node);
            this.renderer.addAllocationAnimation(node);
        }
    }
    
    findNodeAtPosition(x, y) {
        // Transform screen coordinates to world coordinates
        const worldX = (x - this.canvas.width / 2 - this.renderer.camera.x) / this.renderer.camera.zoom;
        const worldY = (y - this.canvas.height / 2 - this.renderer.camera.y) / this.renderer.camera.zoom;
        
        // Convert to axial coordinates
        const axial = this.renderer.skillTree.pixelToAxial(worldX, worldY, this.renderer.nodeRadius * 2);
        
        // Find closest node
        return this.renderer.skillTree.nodes.get(`${axial.q},${axial.r}`);
    }
}
```

---

## Usage

- **Activate/Deactivate Nodes**: Click on nodes to toggle their state.
- **Point Allocation**:
    - **Node Points**: Each node costs 1 node point.
    - **Arc Points**: Each connection costs 1 arc point.
- **Connection Rules**:
    - Nodes must be connected via active arcs.
    - Cannot deactivate nodes that would disconnect the tree.
- **Hover Information**: Hover over nodes to see their connections and details.
- **Navigation**:
    - **Drag**: Click and drag to move around the skill tree.
    - **Zoom**: Use the mouse wheel to zoom in and out.

---

## Getting Started

### Prerequisites

Ensure you have [Git](https://git-scm.com/) installed on your machine.

### Installation

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/yourusername/wizard.git
    cd wizard/tools/geometric_skilltree
    ```

2. **Open the Application**:

    Open `index.html` in your preferred web browser to view and interact with the skill tree.

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. **Fork the Repository**.
2. **Create a Feature Branch**:

    ```bash
    git checkout -b feature/YourFeatureName
    ```

3. **Commit Your Changes**:

    ```bash
    git commit -m "Add your detailed message here"
    ```

4. **Push to the Branch**:

    ```bash
    git push origin feature/YourFeatureName
    ```

5. **Open a Pull Request**.

Please ensure your code follows the project's coding standards and includes relevant tests and documentation.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

---
