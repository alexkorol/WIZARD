import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function WordCloud({ words }) {
  const containerRef = useRef(null);
  const nodesRef = useRef([]);
  const [positions, setPositions] = useState({});
  const [hoveredWord, setHoveredWord] = useState(null);
  const animationRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create a grid-based initial layout
    const cols = 5;
    const rows = 6;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    // Shuffle words to randomize placement
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    nodesRef.current = shuffledWords.map((word, i) => {
      // Calculate base grid position
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      // Add significant random offset within the cell
      const baseX = (col + 0.5) * cellWidth;
      const baseY = (row + 0.5) * cellHeight;
      
      // Add random offset up to half a cell size
      const xOffset = (Math.random() - 0.5) * cellWidth * 1.5;
      const yOffset = (Math.random() - 0.5) * cellHeight * 1.5;

      // Weight-based additional offset (larger words spread more)
      const weightFactor = word.weight / 10;
      const extraOffset = 50 * weightFactor;
      const extraX = (Math.random() - 0.5) * extraOffset;
      const extraY = (Math.random() - 0.5) * extraOffset;

      return {
        ...word,
        x: baseX + xOffset + extraX,
        y: baseY + yOffset + extraY,
        vx: 0,
        vy: 0,
        baseX: baseX + xOffset + extraX,
        baseY: baseY + yOffset + extraY
      };
    });

    let lastTime = 0;
    const animate = (time) => {
      const delta = lastTime ? (time - lastTime) / 1000 : 0;
      lastTime = time;

      nodesRef.current.forEach((node, i) => {
        // Very gentle continuous motion
        const t = time * 0.0002; // Even slower
        const wobbleX = Math.sin(t + i * 0.5) * 0.15;
        const wobbleY = Math.cos(t + i * 0.5) * 0.15;

        // Attraction to base position
        const dx = node.baseX - node.x;
        const dy = node.baseY - node.y;
        node.vx += dx * 0.005;
        node.vy += dy * 0.005;

        // Strong repulsion forces
        nodesRef.current.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (node.fontSize + other.fontSize) * 2.5; // Increased minimum distance

          if (distance < minDistance) {
            const force = (minDistance - distance) * 0.05; // Stronger repulsion
            const angle = Math.atan2(dy, dx);
            node.vx -= Math.cos(angle) * force;
            node.vy -= Math.sin(angle) * force;
          }
        });

        // Apply velocity with stronger damping
        node.vx *= 0.9;
        node.vy *= 0.9;
        
        // Add wobble to final position
        node.x += node.vx * delta * 60 + wobbleX;
        node.y += node.vy * delta * 60 + wobbleY;

        // Boundary constraints with padding
        const padding = Math.max(80, node.fontSize * 2);
        if (node.x < padding) node.x = padding;
        if (node.x > width - padding) node.x = width - padding;
        if (node.y < padding) node.y = padding;
        if (node.y > height - padding) node.y = height - padding;
      });

      // Update positions
      setPositions(
        nodesRef.current.reduce((acc, node) => ({
          ...acc,
          [node.id]: { x: node.x, y: node.y }
        }), {})
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [words]);

  // Get all related connections for a word
  const getConnections = (wordId) => {
    const word = words.find(w => w.id === wordId);
    if (!word) return [];
    
    // Include both direct and reverse relationships
    const connections = new Set([
      ...word.related,
      ...words.filter(w => w.related.includes(wordId)).map(w => w.id)
    ]);
    return Array.from(connections);
  };

  // Get neighboring words (physically close)
  const getNeighbors = (wordId) => {
    if (!positions[wordId]) return [];
    const pos = positions[wordId];
    const neighborRadius = 150; // Adjust this value to change what counts as a neighbor
    
    return words
      .filter(w => w.id !== wordId)
      .filter(w => {
        const otherPos = positions[w.id];
        if (!otherPos) return false;
        const dx = otherPos.x - pos.x;
        const dy = otherPos.y - pos.y;
        return Math.sqrt(dx * dx + dy * dy) < neighborRadius;
      })
      .map(w => w.id);
  };

  return (
    <div ref={containerRef} className="word-cloud-container relative w-full h-[600px]">

      {Object.keys(positions).length > 0 && words.map((word) => {
        const isHovered = hoveredWord === word.id;
        const isRelated = hoveredWord ? getConnections(hoveredWord).includes(word.id) : false;
        const isNeighbor = hoveredWord ? getNeighbors(hoveredWord).includes(word.id) : false;
        
        const scale = isHovered ? 1.3 : 
                     isRelated ? 1.15 :
                     isNeighbor ? 1.1 : 1;

        const opacity = !hoveredWord ? 1 :
                       isHovered ? 1 :
                       isRelated ? 0.9 :
                       isNeighbor ? 0.7 : 0.2;

        return (
          <motion.div
            key={word.id}
            className="word absolute cursor-pointer select-none"
            style={{
              left: positions[word.id]?.x || 0,
              top: positions[word.id]?.y || 0,
              fontSize: word.fontSize,
              color: word.color,
              zIndex: isHovered ? 10 : (isRelated ? 5 : 1),
            }}
            animate={{ 
              opacity,
              scale,
              textShadow: isHovered ? `0 0 30px ${word.glow}` : 
                         isRelated ? `0 0 20px ${word.glow}` :
                         isNeighbor ? `0 0 10px ${word.glow}` : 'none',
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
            onMouseEnter={() => setHoveredWord(word.id)}
            onMouseLeave={() => setHoveredWord(null)}
          >
            {word.text}
          </motion.div>
        );
      })}

      {/* Connections Layer */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <AnimatePresence>
          {hoveredWord && getConnections(hoveredWord).map(relatedId => {
            if (!positions[hoveredWord] || !positions[relatedId]) return null;
            const sourceWord = words.find(w => w.id === hoveredWord);
            const targetWord = words.find(w => w.id === relatedId);
            
            const lineKey = `${Math.min(hoveredWord, relatedId)}-${Math.max(hoveredWord, relatedId)}`;
            
            return (
              <g key={lineKey}>
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 0.2,
                    transition: { duration: 0.8, ease: "easeOut" }
                  }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  x1={positions[hoveredWord].x}
                  y1={positions[hoveredWord].y}
                  x2={positions[relatedId].x}
                  y2={positions[relatedId].y}
                  stroke={sourceWord?.glow}
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 0.8,
                    transition: { duration: 0.6, ease: "easeOut" }
                  }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  x1={positions[hoveredWord].x}
                  y1={positions[hoveredWord].y}
                  x2={positions[relatedId].x}
                  y2={positions[relatedId].y}
                  stroke={sourceWord?.glow}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="8 4"
                />
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    transition: { duration: 0.3 }
                  }}
                  exit={{ scale: 0 }}
                  cx={positions[hoveredWord].x}
                  cy={positions[hoveredWord].y}
                  r="3"
                  fill={sourceWord?.glow}
                />
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    transition: { duration: 0.3, delay: 0.2 }
                  }}
                  exit={{ scale: 0 }}
                  cx={positions[relatedId].x}
                  cy={positions[relatedId].y}
                  r="3"
                  fill={targetWord?.glow}
                />
              </g>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
}