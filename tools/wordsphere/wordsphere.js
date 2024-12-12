const normalize = (v, length = 1) => {
  const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return {
    x: (v.x / l) * length,
    y: (v.y / l) * length,
    z: (v.z / l) * length
  };
};

const getMidpoint = (v1, v2, radius) => {
  const mid = {
    x: (v1.x + v2.x) / 2,
    y: (v1.y + v2.y) / 2,
    z: (v1.z + v2.z) / 2
  };
  return normalize(mid, radius);
};

const generateGeosphere = (radius, subdivisions) => {
  const phi = (1 + Math.sqrt(5)) / 2;
  
  let vertices = [
    normalize({ x: 0, y: 1, z: phi }, radius),
    normalize({ x: 0, y: -1, z: phi }, radius),
    normalize({ x: 0, y: 1, z: -phi }, radius),
    normalize({ x: 0, y: -1, z: -phi }, radius),
    normalize({ x: 1, y: phi, z: 0 }, radius),
    normalize({ x: -1, y: phi, z: 0 }, radius),
    normalize({ x: 1, y: -phi, z: 0 }, radius),
    normalize({ x: -1, y: -phi, z: 0 }, radius),
    normalize({ x: phi, y: 0, z: 1 }, radius),
    normalize({ x: phi, y: 0, z: -1 }, radius),
    normalize({ x: -phi, y: 0, z: 1 }, radius),
    normalize({ x: -phi, y: 0, z: -1 }, radius)
  ];

  let faces = [
    [0, 8, 4], [0, 5, 10], [2, 4, 9], [2, 11, 5],
    [1, 6, 8], [1, 10, 7], [3, 9, 6], [3, 7, 11],
    [0, 10, 1], [1, 8, 0], [2, 9, 3], [3, 11, 2],
    [4, 8, 9], [5, 11, 10], [6, 9, 8], [7, 10, 11],
    [0, 4, 5], [1, 7, 6], [2, 5, 4], [3, 6, 7]
  ];

  for (let i = 0; i < subdivisions; i++) {
    const newFaces = [];
    faces.forEach(face => {
      const v1 = vertices[face[0]];
      const v2 = vertices[face[1]];
      const v3 = vertices[face[2]];

      const m1 = getMidpoint(v1, v2, radius);
      const m2 = getMidpoint(v2, v3, radius);
      const m3 = getMidpoint(v3, v1, radius);

      const m1Index = vertices.length;
      vertices.push(m1);
      const m2Index = vertices.length;
      vertices.push(m2);
      const m3Index = vertices.length;
      vertices.push(m3);

      newFaces.push([face[0], m1Index, m3Index]);
      newFaces.push([face[1], m2Index, m1Index]);
      newFaces.push([face[2], m3Index, m2Index]);
      newFaces.push([m1Index, m2Index, m3Index]);
    });
    faces = newFaces;
  }

  const edgeSet = new Set();
  faces.forEach(face => {
    for (let i = 0; i < 3; i++) {
      const v1 = Math.min(face[i], face[(i + 1) % 3]);
      const v2 = Math.max(face[i], face[(i + 1) % 3]);
      edgeSet.add(`${v1}-${v2}`);
    }
  });

  const edges = Array.from(edgeSet).map(edge => {
    const [v1, v2] = edge.split('-').map(Number);
    return [v1, v2];
  });

  return { vertices, edges, faces };
};

const rotatePoint = (point, angleX, angleY) => {
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const y1 = {
    x: point.x * cosY + point.z * sinY,
    y: point.y,
    z: -point.x * sinY + point.z * cosY
  };
  
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  return {
    x: y1.x,
    y: y1.y * cosX - y1.z * sinX,
    z: y1.y * sinX + y1.z * cosX
  };
};

// Define term relationships
const termRelationships = {
    'React': ['JavaScript', 'TypeScript', 'Redux', 'Material-UI'],
    'Vue': ['JavaScript', 'TypeScript', 'Vuex'],
    'Angular': ['TypeScript', 'RxJS', 'Material-UI'],
    'Node.js': ['JavaScript', 'Express', 'MongoDB'],
    'TypeScript': ['JavaScript', 'React', 'Vue', 'Angular'],
    'JavaScript': ['React', 'Vue', 'Node.js', 'TypeScript'],
    'MongoDB': ['Node.js', 'Express', 'GraphQL'],
    'GraphQL': ['REST', 'MongoDB', 'Express'],
    'Redux': ['React', 'JavaScript'],
    'Vuex': ['Vue', 'JavaScript'],
    'Express': ['Node.js', 'JavaScript', 'MongoDB'],
    'Material-UI': ['React', 'Angular'],
    'RxJS': ['Angular', 'TypeScript']
};

const WordSphere = () => {
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [activeVertex, setActiveVertex] = React.useState(null);
  const animationFrameRef = React.useRef();
  const lastUpdateTimeRef = React.useRef(Date.now());

  const radius = 250;
  const { vertices, edges } = React.useMemo(() => generateGeosphere(radius, 2), [radius]);

  const terms = [
    'React', 'Vue', 'Angular', 'Node.js', 'TypeScript',
    'JavaScript', 'HTML5', 'CSS3', 'Python', 'Java',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST',
    'Git', 'CI/CD', 'DevOps', 'Agile', 'Scrum',
    'WebGL', 'Three.js', 'D3.js', 'SVG', 'Canvas',
    'Redux', 'Vuex', 'RxJS', 'WebSockets', 'PWA',
    'Webpack', 'Babel', 'ESLint', 'Jest', 'Express'
  ];
    'React': ['JavaScript', 'TypeScript', 'Redux', 'Material-UI'],
    'Vue': ['JavaScript', 'TypeScript', 'Vuex'],
    'Angular': ['TypeScript', 'RxJS', 'Material-UI'],
    'Node.js': ['JavaScript', 'Express', 'MongoDB'],
    'TypeScript': ['JavaScript', 'React', 'Vue', 'Angular'],
    'JavaScript': ['React', 'Vue', 'Node.js', 'TypeScript'],
    'MongoDB': ['Node.js', 'Express', 'GraphQL'],
    'GraphQL': ['REST', 'MongoDB', 'Express'],
    'Redux': ['React', 'JavaScript'],
    'Vuex': ['Vue', 'JavaScript'],
    'Express': ['Node.js', 'JavaScript', 'MongoDB'],
    'Material-UI': ['React', 'Angular'],
    'RxJS': ['Angular', 'TypeScript']
  };

  const vertexTerms = React.useMemo(() => {
    const termCount = terms.length;
    const vertexCount = vertices.length;
    const result = new Array(vertexCount).fill(null);
    
    // Only assign terms to vertices that are sufficiently far apart
    const minDistance = radius * 0.5; // Increased from 0.4 for better spacing
    const assignedVertices = new Set();
    
    // Start with vertices closer to the equator for better distribution
    const verticesWithScores = vertices.map((vertex, index) => ({
      index,
      // Score based on distance from equator (y=0 plane) and visibility (z position)
      score: Math.abs(vertex.y) * 0.5 + vertex.z * 0.5
    })).sort((a, b) => a.score - b.score);

    for (let i = 0; i < Math.min(termCount, vertexCount); i++) {
      // Find a suitable vertex for this term
      let bestVertex = -1;
      let maxMinDistance = 0;
      
      for (const {index: j} of verticesWithScores) {
        if (assignedVertices.has(j)) continue;
        
        // Calculate minimum distance to any already assigned vertex
        let minDistToOthers = Infinity;
        for (const assignedVertex of assignedVertices) {
          const dist = Math.sqrt(
            Math.pow(vertices[j].x - vertices[assignedVertex].x, 2) +
            Math.pow(vertices[j].y - vertices[assignedVertex].y, 2) +
            Math.pow(vertices[j].z - vertices[assignedVertex].z, 2)
          );
          minDistToOthers = Math.min(minDistToOthers, dist);
        }
        
        if (minDistToOthers > maxMinDistance) {
          maxMinDistance = minDistToOthers;
          bestVertex = j;
        }
      }
      
      if (bestVertex !== -1 && maxMinDistance >= minDistance) {
        result[bestVertex] = terms[i];
        assignedVertices.add(bestVertex);
      }
    }
    
    return result;
  }, [vertices.length, terms, radius]);

  const [momentum, setMomentum] = React.useState({ x: 0, y: 0.2 });
  const lastMousePosRef = React.useRef({ x: 0, y: 0 });
  const lastTimeRef = React.useRef(Date.now());

  React.useEffect(() => {
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (!isDragging) {
        // Apply momentum with gentler damping
        const damping = 0.995; // Increased from 0.99 for longer spin
        setMomentum(prev => ({
          x: prev.x * damping,
          y: prev.y * damping
        }));

        // Increased rotation speed multiplier
        setRotation(prev => ({
          x: prev.x + momentum.x * deltaTime * 8,
          y: prev.y + momentum.y * deltaTime * 8
        }));
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging]);

  const handleMouseDown = React.useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setMomentum({ x: 0, y: 0 });
  }, []);

  const handleMouseMove = React.useCallback((e) => {
    if (isDragging) {
      const deltaX = (e.clientX - dragStart.x);
      const deltaY = (e.clientY - dragStart.y);
      const currentTime = Date.now();
      const dt = Math.max((currentTime - lastTimeRef.current) / 1000, 0.016);
      
      // Calculate velocity with better scaling
      const velocityX = deltaX / dt;
      const velocityY = deltaY / dt;
      
      setMomentum({
        x: velocityY * 0.005, // Increased from 0.003
        y: velocityX * 0.005  // Increased from 0.003
      });
      
      setRotation(prev => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      lastTimeRef.current = currentTime;
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const project = React.useCallback((point) => {
    const rotated = rotatePoint(point, rotation.x, rotation.y);
    const focalLength = 500;
    const scale = focalLength / (focalLength - rotated.z);
    return {
      x: rotated.x * scale + 500,
      y: rotated.y * scale + 500,
      z: rotated.z
    };
  }, [rotation]);

  const getBackgroundOpacity = (projected) => {
    const normalizedZ = (projected.z + radius) / (2 * radius);
    return Math.pow(normalizedZ, 3) * 0.7;
  };

  const getVertexOpacity = (projected) => {
    const normalizedZ = (projected.z + radius) / (2 * radius);
    return Math.pow(normalizedZ, 2.5);
  };

  const getVertexColor = (index, projected) => {
    const opacity = getVertexOpacity(projected);
    const term = vertexTerms[index];
    
    if (index === activeVertex) {
      return `rgba(255, 255, 255, ${opacity})`;
    }
    
    if (activeVertex !== null && term) {
      const activeTerm = vertexTerms[activeVertex];
      if ((termRelationships[activeTerm] && termRelationships[activeTerm].includes(term)) || 
          (termRelationships[term] && termRelationships[term].includes(activeTerm))) {
        return `rgba(0, 191, 255, ${opacity})`;
      }
    }
    
    return `rgba(100, 210, 255, ${opacity * 0.7})`;
  };

  const getEdgeColor = (v1Index, v2Index, projected) => {
    const avgZ = (projected[0].z + projected[1].z) / 2;
    const opacity = ((avgZ + radius) / (2 * radius)) * 0.15;

    if (activeVertex === v1Index || activeVertex === v2Index) {
      return `rgba(255, 107, 107, ${opacity})`;
    }
    
    if (activeVertex !== null) {
      const dist1 = Math.sqrt(
        Math.pow(vertices[v1Index].x - vertices[activeVertex].x, 2) +
        Math.pow(vertices[v1Index].y - vertices[activeVertex].y, 2) +
        Math.pow(vertices[v1Index].z - vertices[activeVertex].z, 2)
      );
      const dist2 = Math.sqrt(
        Math.pow(vertices[v2Index].x - vertices[activeVertex].x, 2) +
        Math.pow(vertices[v2Index].y - vertices[activeVertex].y, 2) +
        Math.pow(vertices[v2Index].z - vertices[activeVertex].z, 2)
      );
      const minDist = Math.min(dist1, dist2);
      if (minDist < radius * 0.8) {
        return `rgba(255, 107, 107, ${opacity * (1 - minDist / (radius * 0.8))})`;
      }
    }
    
    return `rgba(70, 130, 180, ${opacity})`;
  };

  const getTermSize = (index, projected) => {
    const baseSize = 14;
    const sizeVariation = 8;
    const depthFactor = (projected.z + radius) / (2 * radius);
    const isActive = index === activeVertex;
    
    return baseSize + (isActive ? sizeVariation : sizeVariation * Math.pow(depthFactor, 1.5));
  };

  return (
    <div className="container">
      <svg 
        width="1000" 
        height="1000" 
        style={{
          maxWidth: '100%',
          maxHeight: '100vh'
        }}
        viewBox="0 0 1000 1000"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <radialGradient id="textBackground" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#1a1a1a', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#1a1a1a', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        <rect 
          x="0" 
          y="0" 
          width="1000" 
          height="1000" 
          fill="#1a1a1a" 
        />
        <g>
          {edges.map(([i, j], index) => {
            const projected = [project(vertices[i]), project(vertices[j])];
            if (projected[0].z + projected[1].z > -2 * radius) {
              return (
                <line
                  key={`edge-${index}`}
                  x1={projected[0].x}
                  y1={projected[0].y}
                  x2={projected[1].x}
                  y2={projected[1].y}
                  stroke={getEdgeColor(i, j, projected)}
                  strokeWidth="1"
                  opacity="0.3"
                />
              );
            }
            return null;
          })}
          
          {/* Relationship connections */}
          {activeVertex !== null && vertices.map((vertex, index) => {
            const term = vertexTerms[index];
            const activeTerm = vertexTerms[activeVertex];
            if (term && activeTerm && 
                ((termRelationships[activeTerm] && termRelationships[activeTerm].includes(term)) || 
                 (termRelationships[term] && termRelationships[term].includes(activeTerm)))) {
              const startPos = project(vertices[activeVertex]);
              const endPos = project(vertex);
              if (startPos.z > -radius && endPos.z > -radius) {
                const opacity = Math.min(
                  getVertexOpacity(startPos),
                  getVertexOpacity(endPos)
                );
                return (
                  <g key={`connection-${index}`}>
                    <line
                      x1={startPos.x}
                      y1={startPos.y}
                      x2={endPos.x}
                      y2={endPos.y}
                      stroke="rgba(0, 191, 255, 0.8)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity={opacity * 0.8}
                    />
                    <circle
                      cx={endPos.x}
                      cy={endPos.y}
                      r="4"
                      fill="rgba(0, 191, 255, 0.8)"
                      opacity={opacity}
                    />
                  </g>
                );
              }
            }
            return null;
          })}

          {vertices.map((vertex, index) => {
            const projected = project(vertex);
            if (projected.z > -radius && vertexTerms[index]) {
              const fontSize = getTermSize(index, projected);
              return (
                <g
                  key={`vertex-${index}`}
                  onMouseEnter={() => setActiveVertex(index)}
                  onMouseLeave={() => setActiveVertex(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={projected.x}
                    cy={projected.y}
                    r={fontSize * 1.2}
                    fill="url(#textBackground)"
                    style={{
                      opacity: getBackgroundOpacity(projected)
                    }}
                  />
                  <text
                    x={projected.x}
                    y={projected.y}
                    fill={getVertexColor(index, projected)}
                    fontSize={fontSize}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      transition: 'all 0.3s ease',
                      textShadow: index === activeVertex ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                      fontWeight: projected.z > 0 ? 'bold' : 'normal',
                      pointerEvents: 'none'
                    }}
                  >
                    {vertexTerms[index]}
                  </text>
                </g>
              );
            }
            return null;
          })}
        </g>
      </svg>
    </div>
  );
};

// Export the component
window.WordSphere = WordSphere;

ReactDOM.render(<WordSphere />, document.getElementById('root'));