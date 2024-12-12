const normalize = (v, length = 1) => {
    const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return {
        x: (v.x / l) * length,
        y: (v.y / l) * length,
        z: (v.z / l) * length
    };
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

    let edges = [
        [0,1], [0,4], [0,5], [0,8], [0,10],
        [1,6], [1,7], [1,8], [1,10],
        [2,3], [2,4], [2,5], [2,9], [2,11],
        [3,6], [3,7], [3,9], [3,11],
        [4,8], [4,9], [5,10], [5,11],
        [6,8], [6,9], [7,10], [7,11]
    ];

    return { vertices, edges };
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

const MinimalSphere = () => {
    const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
    const [momentum, setMomentum] = React.useState({ x: 0, y: 0.1 }); // Reduced initial speed
    
    const animationFrameRef = React.useRef();
    const lastTimeRef = React.useRef(Date.now());
    const lastMousePosRef = React.useRef({ x: 0, y: 0 });
    
    const radius = 250;
    const { vertices, edges } = React.useMemo(() => generateGeosphere(radius, 2), []);
    const [hoveredWord, setHoveredWord] = React.useState(null);
    const [fps, setFps] = React.useState(60);
    
    // Add test words
    const testWords = React.useMemo(() => {
        const words = ['React', 'Vue', 'Angular', 'Node.js', 'TypeScript', 
                      'JavaScript', 'Python', 'Docker', 'AWS', 'MongoDB'];
        const result = new Array(vertices.length).fill(null);
        
        // Place words on vertices with good distribution
        const sortedVertices = [...vertices]
            .map((vertex, index) => ({ 
                vertex, 
                index,
                // Score based on position (prefer points away from poles and more visible)
                score: Math.abs(vertex.y) * 0.5 + vertex.z
            }))
            .sort((a, b) => b.score - a.score)
            // Add minimum distance check
            .filter((v, i, arr) => {
                if (i === 0) return true;
                return arr.slice(0, i).every(prev => {
                    const dist = Math.sqrt(
                        Math.pow(v.vertex.x - prev.vertex.x, 2) +
                        Math.pow(v.vertex.y - prev.vertex.y, 2) +
                        Math.pow(v.vertex.z - prev.vertex.z, 2)
                    );
                    return dist > radius * 0.6; // Increased minimum distance
                });
            });
        
        // Assign words to the filtered vertices
        words.forEach((word, i) => {
            if (i < sortedVertices.length) {
                result[sortedVertices[i].index] = word;
            }
        });
        
        return result;
    }, [vertices]);

    // Define word relationships
    const wordRelationships = React.useMemo(() => {
        const relationships = {
            'React': ['JavaScript', 'TypeScript'],
            'Vue': ['JavaScript', 'TypeScript'],
            'Angular': ['TypeScript', 'JavaScript'],
            'Node.js': ['JavaScript', 'MongoDB'],
            'TypeScript': ['JavaScript'],
            'JavaScript': ['React', 'Vue', 'Angular', 'Node.js'],
            'Python': ['MongoDB'],
            'Docker': ['AWS'],
            'AWS': ['Docker'],
            'MongoDB': ['Node.js', 'Python']
        };

        // Make relationships bidirectional
        Object.entries(relationships).forEach(([word, related]) => {
            related.forEach(relatedWord => {
                if (!relationships[relatedWord]) {
                    relationships[relatedWord] = [];
                }
                if (!relationships[relatedWord].includes(word)) {
                    relationships[relatedWord].push(word);
                }
            });
        });

        return relationships;
    }, []);

    // Function to find vertex index for a word
    const findWordVertex = React.useCallback((word) => {
        return testWords.findIndex(w => w === word);
    }, [testWords]);

    React.useEffect(() => {
        const animate = () => {
            const currentTime = Date.now();
            const deltaTime = (currentTime - lastTimeRef.current) / 1000;
            lastTimeRef.current = currentTime;

            if (!isDragging) {
                // Slower damping for longer spin
                const damping = 0.995;
                // Minimum momentum threshold to prevent tiny perpetual motion
                const threshold = 0.001;
                
                setMomentum(prev => {
                    const newX = Math.abs(prev.x) < threshold ? 0 : prev.x * damping;
                    const newY = Math.abs(prev.y) < threshold ? 0 : prev.y * damping;
                    return { x: newX, y: newY };
                });

                setRotation(prev => ({
                    x: prev.x + momentum.x * deltaTime * 15, // Increased rotation speed
                    y: prev.y + momentum.y * deltaTime * 15
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
    }, [isDragging, momentum]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        setMomentum({ x: 0, y: 0 });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const deltaX = (e.clientX - dragStart.x);
            const deltaY = (e.clientY - dragStart.y);
            const currentTime = Date.now();
            const dt = Math.max((currentTime - lastTimeRef.current) / 1000, 0.016);
            
            // Calculate velocity with improved scaling
            const velocityX = (e.clientX - lastMousePosRef.current.x) / dt;
            const velocityY = (e.clientY - lastMousePosRef.current.y) / dt;
            
            // Increased momentum multiplier and added maximum velocity cap
            const maxVelocity = 2;
            setMomentum({
                x: Math.max(-maxVelocity, Math.min(maxVelocity, velocityY * 0.002)),
                y: Math.max(-maxVelocity, Math.min(maxVelocity, velocityX * 0.002))
            });
            
            setRotation(prev => ({
                x: prev.x + deltaY * 0.01,
                y: prev.y + deltaX * 0.01
            }));
            
            setDragStart({ x: e.clientX, y: e.clientY });
            lastMousePosRef.current = { x: e.clientX, y: e.clientY };
            lastTimeRef.current = currentTime;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Memoize project function to prevent unnecessary recalculations
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

    // Memoize edge projections
    const projectedEdges = React.useMemo(() => {
        return edges.map(([i, j]) => {
            const projected = [project(vertices[i]), project(vertices[j])];
            const depth = (projected[0].z + projected[1].z) / (2 * radius);
            return {
                points: projected,
                depth,
                visible: projected[0].z + projected[1].z > -2 * radius
            };
        });
    }, [edges, vertices, project, radius]);

    // Calculate FPS
    React.useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();

        const updateFps = () => {
            const now = performance.now();
            frameCount++;

            if (now - lastTime > 1000) {
                setFps(Math.round((frameCount * 1000) / (now - lastTime)));
                frameCount = 0;
                lastTime = now;
            }

            requestAnimationFrame(updateFps);
        };

        const handle = requestAnimationFrame(updateFps);
        return () => cancelAnimationFrame(handle);
    }, []);

    return (
        <>
            {/* Memoize edge projections */}
            const projectedEdges = React.useMemo(() => {
                return edges.map(([i, j]) => {
                    const projected = [project(vertices[i]), project(vertices[j])];
                    const depth = (projected[0].z + projected[1].z) / (2 * radius);
                    return {
                        points: projected,
                        depth,
                        visible: projected[0].z + projected[1].z > -2 * radius
                    };
                });
            }, [edges, vertices, project, radius]);

    // Calculate FPS
    React.useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();

        const updateFps = () => {
            const now = performance.now();
            frameCount++;

            if (now - lastTime > 1000) {
                setFps(Math.round((frameCount * 1000) / (now - lastTime)));
                frameCount = 0;
                lastTime = now;
            }

            requestAnimationFrame(updateFps);
        };

        const handle = requestAnimationFrame(updateFps);
        return () => cancelAnimationFrame(handle);
    }, []);

            // Calculate FPS
            const [fps, setFps] = React.useState(60);
            React.useEffect(() => {
                let frameCount = 0;
                let lastTime = performance.now();

                const updateFps = () => {
                    const now = performance.now();
                    frameCount++;

                    if (now - lastTime > 1000) {
                        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
                        frameCount = 0;
                        lastTime = now;
                    }

                    requestAnimationFrame(updateFps);
                };

                const handle = requestAnimationFrame(updateFps);
                return () => cancelAnimationFrame(handle);
            }, []);

            <div className="debug-info">
                <div>FPS: {fps}</div>
                <div>Words: {testWords.filter(Boolean).length}</div>
                <div>Vertices: {vertices.length}</div>
                {hoveredWord && (
                    <>
                        <div>Selected: {hoveredWord}</div>
                        <div>Related: {wordRelationships[hoveredWord]?.join(', ')}</div>
                    </>
                )}
            </div>

            <svg 
                width="1000" 
                height="1000" 
                style={{
                    maxWidth: '100%',
                    maxHeight: '100vh',
                    background: '#1a1a1a'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >

            {/* Sphere visualization */}
            <g>
                {/* Draw edges first */}
                {projectedEdges.map((edge, index) => {
                    if (edge.visible) {
                        return (
                            <line
                                key={`edge-${index}`}
                                x1={edge.points[0].x}
                                y1={edge.points[0].y}
                                x2={edge.points[1].x}
                                y2={edge.points[1].y}
                                stroke="white"
                                strokeWidth="1"
                                opacity={0.1 + edge.depth * 0.4}
                            />
                        );
                    }
                    return null;
                })}

                {/* Draw relationship connections when word is hovered */}
                {hoveredWord && wordRelationships[hoveredWord]?.map(relatedWord => {
                    const sourceIndex = findWordVertex(hoveredWord);
                    const targetIndex = findWordVertex(relatedWord);
                    
                    if (sourceIndex !== -1 && targetIndex !== -1) {
                        const sourcePos = project(vertices[sourceIndex]);
                        const targetPos = project(vertices[targetIndex]);
                        
                        if (sourcePos.z > -radius && targetPos.z > -radius) {
                            const depth = Math.min(
                                (sourcePos.z + radius) / (2 * radius),
                                (targetPos.z + radius) / (2 * radius)
                            );
                            
                            return (
                                <g key={`connection-${hoveredWord}-${relatedWord}`}>
                                        <line
                                            className="connection-line"
                                            x1={sourcePos.x}
                                            y1={sourcePos.y}
                                            x2={targetPos.x}
                                            y2={targetPos.y}
                                            stroke="#4CAF50"
                                            strokeWidth="2"
                                            opacity={depth * 0.8}
                                        />
                                        <circle
                                            className="connection-dot"
                                            cx={targetPos.x}
                                            cy={targetPos.y}
                                            r="4"
                                            fill="#4CAF50"
                                            opacity={depth}
                                        />
                                </g>
                            );
                        }
                    }
                    return null;
                })}

                {/* Draw vertices and labels */}
                {vertices.map((vertex, index) => {
                    const projected = project(vertex);
                    if (projected.z > -radius) {
                        const depth = (projected.z + radius) / (2 * radius);
                        const word = testWords[index];
                        const isHovered = hoveredWord === word;
                        const isRelated = hoveredWord && 
                            wordRelationships[hoveredWord]?.includes(word);
                        
                        return (
                            <g 
                                key={`vertex-${index}`}
                                onMouseEnter={() => word && setHoveredWord(word)}
                                onMouseLeave={() => setHoveredWord(null)}
                                style={{ cursor: word ? 'pointer' : 'default' }}
                            >
                                <circle
                                    cx={projected.x}
                                    cy={projected.y}
                                    r="2"
                                    fill="white"
                                    opacity={0.2 + depth * 0.8}
                                />
                                {word && (
                                    <g>
                                        <circle
                                            className="word-background"
                                            cx={projected.x}
                                            cy={projected.y}
                                            r={isHovered || isRelated ? 30 : 25}
                                            fill="#1a1a1a"
                                            opacity={0.9}
                                        />
                                        <text
                                            className="word-text"
                                            x={projected.x}
                                            y={projected.y}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill={isHovered ? "#4CAF50" : 
                                                  isRelated ? "#81C784" : "white"}
                                            fontSize={isHovered || isRelated ? "16" : "14"}
                                            opacity={depth}
                                            style={{
                                                textShadow: (isHovered || isRelated) ? 
                                                    "0 0 10px rgba(76, 175, 80, 0.5)" : 
                                                    "none"
                                            }}
                                        >
                                            {word}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    }
                    return null;
                })}
            </g>
        </svg>
    );
};

ReactDOM.render(<MinimalSphere />, document.getElementById('root'));