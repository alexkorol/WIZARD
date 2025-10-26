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

## Developer Documentation

### Geometry Rationale

The runtime geometry is generated directly from Seed-of-Life circle packing. The renderer builds concentric rings of circle centers from polar/axial conversions and then resolves every circle-circle intersection to yield snapped node coordinates with tier metadata.【F:tools/geometric_skilltree/index.html†L1060-L1163】 Adjacency is reconstructed by checking which node pairs are separated by exactly one circle radius and then caching symmetric connection lists for later graph work.【F:tools/geometric_skilltree/index.html†L1166-L1201】 These utilities are wrapped by `geometryEngine`, which also exposes reachability and degree validation helpers to ensure the lattice stays balanced when new content is introduced.【F:tools/geometric_skilltree/index.html†L1203-L1293】

### Data Schema

Generated nodes carry stable ids (`n0`, `n1`, …), snapped `x/y` coordinates, tier descriptors (ring index, thematic name/description), and a mutable `connections` array populated during arc synthesis.【F:tools/geometric_skilltree/index.html†L1106-L1156】 Each arc records its `from` and `to` endpoints alongside cached endpoints for SVG rendering, and all ids feed directly into the adjacency graph.【F:tools/geometric_skilltree/index.html†L1166-L1201】 Runtime theming and balance parameters live in `assets/skilltree-content.json`, which defines ring archetypes, stat scaling, naming templates, overrides, and keystone prerequisites used to personalize generated nodes without hand-editing geometry output.【F:tools/geometric_skilltree/assets/skilltree-content.json†L1-L200】

### APIs

`geometryEngine` exposes deterministic builders (`buildGeometry`, `buildAdjacency`, `validateGraph`, `verifyPrerequisite`, `serialize`) for tooling and tests to regenerate the lattice and confirm reachability after edits.【F:tools/geometric_skilltree/index.html†L1203-L1300】 Progression state is managed by `SkillTreeProgression`, which normalizes tier gates, derives parent relationships from arcs, checks point budgets and prerequisites, and implements unlock/respec flows that surface human-readable rejection reasons for UI overlays.【F:tools/geometric_skilltree/assets/progression.mjs†L1-L240】

## Designer Guide

1. **Extend ring themes** – Adjust or add ring entries in `assets/skilltree-content.json` to tune archetypes, stat growth, radial bonuses, and naming templates before regenerating geometry. The runtime loader merges these records into `ringProfiles` and `tierThemes`, making the values immediately visible in search summaries.【F:tools/geometric_skilltree/index.html†L729-L809】【F:tools/geometric_skilltree/assets/skilltree-content.json†L21-L166】
2. **Author node flavor** – Use `fallbackFocus`, `focus`, and `nodeTypeLabels` fields to define stat focuses and localized naming. These values drive `formatDisplayName` and tooltip descriptors without requiring manual DOM edits.【F:tools/geometric_skilltree/index.html†L812-L860】【F:tools/geometric_skilltree/assets/skilltree-content.json†L2-L78】
3. **Balance keystones** – Declare keystone bonuses, penalties, and prerequisite gates (`minTierTotals`, `nodes`) under the `keystones` section. The progression engine reads these rules to block unlocks until prerequisites are met, ensuring balance passes only touch JSON.【F:tools/geometric_skilltree/assets/skilltree-content.json†L168-L214】【F:tools/geometric_skilltree/assets/progression.mjs†L166-L190】
4. **Override marquee nodes** – Apply `nodeOverrides` to inject bespoke titles, effect copy, or custom costs (e.g., the root nexus) while leaving generated coordinates intact. Overrides are applied during node hydration in the UI layer.【F:tools/geometric_skilltree/assets/skilltree-content.json†L168-L177】【F:tools/geometric_skilltree/index.html†L849-L864】

## QA Checklist

- **Geometry accuracy** – Run the geometry validation utilities (`geometryEngine.validateGraph`) and confirm there are no orphan nodes, extreme degree deltas, or reachability regressions before shipping a new lattice.【F:tools/geometric_skilltree/index.html†L1203-L1293】
- **Progression integrity** – Execute `npm test` or `node tests/progression.test.mjs` to ensure unlock gating, keystone prerequisites, and respec flows behave as expected after content tweaks.【F:tools/geometric_skilltree/tests/progression.test.mjs†L1-L116】
- **UI polish** – Verify in-browser that zoom/drag gestures clamp correctly, hover panels resolve names/descriptions from `ringProfiles`, and key controls (level up/respec/search filters) remain wired to state selectors in `index.html` after any layout updates.【F:tools/geometric_skilltree/index.html†L652-L803】

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


#### 1.3 Circle Radius and Spacing Rules

- **Uniform Radius**: Every circle in both the Seed and Flower of Life maintains the same radius \(r\). This guarantees identical intersection geometry regardless of ring depth.
- **Center Spacing**: Adjacent circle centers are separated by exactly \(r\). The hexagonal (triangular) lattice that emerges can be described with axial coordinates \((q, r)\) whose hex distance \(d = \max(|q|, |r|, |s|)\) (with \(s = -q - r\)) identifies the concentric layer.
- **Layer Distances**: The Euclidean distance from the origin to a circle center with axial coordinates \((q, r)\) is \(r\sqrt{q^2 + qr + r^2}\). This value defines the radius of the concentric ring occupied by the circle.
- **Circle Counts**: Layer \(0\) holds the central circle. Each subsequent layer \(n\geq1\) contains \(6n\) circles, matching the Flower of Life expansion formula \(1 + \sum_{k=1}^n 6k\).

#### 1.4 Polar Coordinate Generation

The implementation expresses each circle center as a polar offset and then converts it to Cartesian coordinates for rendering. The helper function

```javascript
function polarToCartesian(cx, cy, distance, angle) {
  return {
    x: cx + distance * Math.cos(angle),
    y: cy + distance * Math.sin(angle)
  };
}
```

is used to build both the Seed of Life petals and additional Flower of Life rings. Axial hex coordinates \((q, r)\) are translated into polar values with

```javascript
const basisX = q + r / 2;
const basisY = (Math.sqrt(3) / 2) * r;
const distance = radius * Math.sqrt(basisX * basisX + basisY * basisY);
const angle = Math.atan2(basisY, basisX);
```

allowing `buildCirclePositions` to generate every concentric ring procedurally before the intersections are evaluated.


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

### 5. Concentric Node Tiers and Gameplay Themes

Every concentric ring of the Flower of Life is mapped to a gameplay tier so that node placement communicates intended power level:

| Ring Index | Geometry Layer | Gameplay Theme | Description |
|------------|----------------|----------------|-------------|
| 0 | Seed center | **Seed Core** | Core sustain, travel, and always-on passives. |
| 1 | Seed petals | **Seed Petals** | Foundational offensive/defensive boosts reachable with minimal investment. |
| 2 | First Flower ring | **Inner Flower** | Hybrid branches that blend stats and unlock cross-discipline synergies. |
| 3 | Second Flower ring | **Outer Flower** | High-impact specialisations rewarding deeper pathing. |
| 4+ | Subsequent rings | **Celestial Ring** | Capstones and legendary effects reserved for the outermost geometry. |

The JavaScript generator tags each node with its ring index and theme so that tooltips and future balancing logic can differentiate Seed skills from late-game Flower rewards.

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

## POE-Style Skill Allocation Architecture

This design extends the existing Flower of Life lattice with Path of Exile-inspired mechanics. It defines the canonical node data schema, geometric adjacency resolution, and the progression rules that govern allocation, respec, and quality-of-life behavior.

### Node Data Model

Each node is stored as a record with strongly typed metadata so the renderer, progression logic, and future authoring tools can operate on the same structure.

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable unique identifier (e.g., `seed:0:0`, `flower:2:3`). |
| `tier` | `'seed' \| 'flower' \| 'keystone' \| 'link'` | Progression band tied to concentric ring depth and power level. |
| `type` | `'stat' \| 'notable' \| 'keystone' \| 'utility'` | Gameplay impact category; keystones override other types. |
| `coords` | `{ axial: { q: number, r: number, s: number }, cartesian: { x: number, y: number } }` | Dual coordinate systems. Axial values drive adjacency; Cartesian values drive rendering. `s` is derived as `-q-r` for integrity checks. |
| `latticeIndex` | `{ ring: number, spoke: number }` | Concentric ring number and angular spoke slot, enabling deterministic placement of themed clusters. |
| `geometry` | `{ radius: number, orientation: number }` | Node radius for hit detection and optional rotation for iconography. |
| `cost` | `{ point: number, respec: number }` | Allocation point cost and respec penalty (default `1`). |
| `effects` | `Array<Effect>` | Declarative modifiers, e.g., `{ stat: 'intelligence', value: 10, scaling: 'additive' }`. Supports stacking rules and unlock conditions. |
| `connections` | `string[]` | References to adjacent node ids, generated from lattice adjacency logic. |
| `requirements` | `{ allocated?: string[], unallocated?: string[] }` | Optional hard prerequisites (e.g., must take a notable before a keystone). |
| `visual` | `{ icon: string, color: string, highlightGroup?: string }` | Asset hooks and UX grouping for search/highlight layers. |
| `tags` | `string[]` | Thematic labels (e.g., `['energy-shield', 'alchemy']`) for filtering. |
| `state` | `{ allocated: boolean, unlockProgress: number }` | Runtime state snapshot. Persisted separately when saving builds. |

`Effect` definitions support mixed scalar and conditional bonuses:

```ts
type Effect =
  | { kind: 'stat', stat: string, value: number, scaling?: 'additive' | 'multiplicative' }
  | { kind: 'modifier', id: string, params?: Record<string, number> }
  | { kind: 'ability', abilityId: string, unlocked: boolean };
```

### Geometric Adjacency Resolution

Nodes live on a perfect Flower of Life lattice. Adjacency is generated mechanically to guarantee geometric fidelity.

1. **Axial Neighborhoods**: Treat each node’s axial coordinates `(q, r, s)` as a hex grid. Immediate neighbors satisfy a hex distance of `1`. This produces six local connections per interior node.
2. **Ring Bridging**: Flower ring nodes (outer layers) gain additional radial links to maintain POE-style spoke paths. For a node at `(q, r)`, connect to any node with the same `spoke` value and `ring ± 1`.
3. **Interlaced Patterns**: Keystones appear at triangular lattice intersections where the sum of absolute axial coordinates equals `3n`. They can connect across two steps (`hexDistance === 2`) but must pass through an intermediate node unless flagged with `tier === 'keystone'` and `type === 'keystone'`.
4. **Manual Overrides**: Special structures (wheels, notables) may inject curated connections using a `connectionsOverride` property. The generator merges overrides with lattice-derived neighbors and ensures bidirectional integrity.

Adjacency can be generated by iterating the axial coordinate set or by running a Delaunay triangulation over the Cartesian coordinates and filtering edges down to lattice-valid neighbors.

### Progression and Allocation Rules

- **Starting Seeds**: Players begin at one or more `tier: 'seed'` nodes. These have zero cost and establish the allocation frontier.
- **Unlock Pathing**: A node can be allocated when:
  1. It is not already allocated.
  2. The player has sufficient unspent points for its `cost.point`.
  3. At least one connected neighbor is allocated (or the node is a seed).
  4. All `requirements.allocated` dependencies are satisfied and no `requirements.unallocated` blockers are active.
- **Point Investment**: Standard nodes cost `1` point. Notables may cost `2`, and keystones `3+`. Costs are represented directly in the node schema to support future balance passes.
- **Respec Flow**: Refunding a node refunds its point cost minus `cost.respec`. A node cannot be refunded if doing so would disconnect any still-allocated node from the nearest seed. This is enforced by a connectivity check on the remaining subgraph.
- **Cluster Themes**: Nodes sharing a `highlightGroup` or `tags` value form thematic clusters. UI search/highlight features operate over these groups.
- **Progression Bands**: Tier determines maximum simultaneous keystone allocations and unlock pacing. Example: players must allocate three `flower` tier nodes in a ring before the matching keystone becomes eligible.
- **Quality of Life**: Metadata enables filters (`tags`), radial path previews (traverse `connections` outwards), and auto-highlighting of reachable nodes (BFS from allocated nodes constrained by available points).
- **Point Gains**: The system expects an external progression loop to award points. The tree tracks `state.allocated` counts and exposes derived stats so the host game can update character sheets.

### Data Authoring and Validation Pipeline

1. **Authoring**: Designers craft node definitions in JSON/YAML, grouped by ring or cluster.
2. **Validation**: A schema validator checks coordinate integrity (`s === -q - r`), ensures reciprocal connections, and confirms keystones obey placement rules.
3. **Build Compilation**: A build step stitches the definitions into a single manifest sorted by `tier` and `latticeIndex`, ready for consumption by the renderer.
4. **Runtime Loading**: The client loads the manifest, initializes node states, and runs adjacency checks to build fast lookup maps (`id -> node`, `ring -> node[]`, `highlightGroup -> node[]`).

This architecture provides the foundational layer for a Flower of Life skill tree that feels familiar to PoE players while remaining geometrically rigorous.

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
