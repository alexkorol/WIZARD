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

    // Initialize nodes in a circle
    nodesRef.current = words.map((word, i) => {
      const angle = (i / words.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.3;
      return {
        ...word,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0
      };
    });

    let lastTime = 0;
    const animate = (time) => {
      const delta = lastTime ? (time - lastTime) / 1000 : 0;
      lastTime = time;

      nodesRef.current.forEach((node, i) => {
        // Add continuous gentle motion
        const t = time * 0.001;
        const wobble = Math.sin(t + i) * 0.5;
        node.x += wobble;
        node.y += Math.cos(t + i) * 0.5;

        // Strong repulsion forces
        nodesRef.current.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (node.fontSize + other.fontSize) * 1.5;

          if (distance < minDistance) {
            const force = (minDistance - distance) * 0.15;
            const angle = Math.atan2(dy, dx);
            node.vx -= Math.cos(angle) * force;
            node.vy -= Math.sin(angle) * force;
          }
        });

        // Center gravity
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
        const centerForce = distanceToCenter * 0.0001;
        node.vx += dx * centerForce;
        node.vy += dy * centerForce;

        // Boundary forces
        const margin = node.fontSize * 2;
        if (node.x < margin) node.vx += 1;
        if (node.x > width - margin) node.vx -= 1;
        if (node.y < margin) node.vy += 1;
        if (node.y > height - margin) node.vy -= 1;

        // Apply velocity with damping
        node.vx *= 0.95;
        node.vy *= 0.95;
        node.x += node.vx * delta * 60;
        node.y += node.vy * delta * 60;
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

  return (
    <div ref={containerRef} className="word-cloud-container">
      <svg className="absolute inset-0">
        <AnimatePresence>
          {hoveredWord && words.find(w => w.id === hoveredWord)?.related.map(relatedId => {
            if (!positions[hoveredWord] || !positions[relatedId]) return null;
            return (
              <motion.line
                key={`${hoveredWord}-${relatedId}`}
                className="connection"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 0.3,
                  transition: { duration: 0.4 }
                }}
                exit={{ pathLength: 0, opacity: 0 }}
                x1={positions[hoveredWord].x}
                y1={positions[hoveredWord].y}
                x2={positions[relatedId].x}
                y2={positions[relatedId].y}
                stroke={words.find(w => w.id === hoveredWord)?.glow}
                strokeWidth="1"
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {Object.keys(positions).length > 0 && words.map((word) => {
        const isRelated = hoveredWord ? 
          hoveredWord === word.id || word.related.includes(hoveredWord) : 
          true;

        return (
          <motion.div
            key={word.id}
            className="word"
            style={{
              left: positions[word.id]?.x || 0,
              top: positions[word.id]?.y || 0,
              fontSize: word.fontSize,
              color: word.color,
              zIndex: hoveredWord === word.id ? 10 : 1,
            }}
            animate={{ 
              opacity: hoveredWord ? (isRelated ? 1 : 0.2) : 1,
              scale: hoveredWord === word.id ? 1.1 : 1,
              textShadow: hoveredWord === word.id ? `0 0 20px ${word.glow}` : 'none',
            }}
            onMouseEnter={() => setHoveredWord(word.id)}
            onMouseLeave={() => setHoveredWord(null)}
          >
            {word.text}
          </motion.div>
        );
      })}
    </div>
  );
}