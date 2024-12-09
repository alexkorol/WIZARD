import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WordCloudWord {
  id: number;
  text: string;
  weight: number;
  color: string;
  glowColor: string;
  related: number[];
  fontSize: number;
  width: number;
  height: number;
}

export interface WordCloudProps {
  words: WordCloudWord[];
  className?: string;
  style?: React.CSSProperties;
}

interface Positions {
  [key: number]: { x: number; y: number };
}

interface Node extends WordCloudWord {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const useForceLayout = (containerRef: React.RefObject<HTMLDivElement>, words: WordCloudWord[]) => {
  const [positions, setPositions] = useState<Positions>({});
  const nodes = useRef<Node[]>([]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Initialize positions in a circle
    const radius = Math.min(width, height) * 0.35;
    nodes.current = words.map((word, i) => {
      const angle = (i / words.length) * 2 * Math.PI;
      return {
        ...word,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0
      };
    });
    
    let frameId: number;
    let iteration = 0;
    const maxIterations = 200;
    
    const simulate = () => {
      iteration++;
      let moved = false;
      
      nodes.current.forEach((node, i) => {
        // Center gravity
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
        const centerForce = distanceToCenter * 0.00002;
        node.vx += dx * centerForce;
        node.vy += dy * centerForce;
        
        // Node repulsion
        nodes.current.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (node.width + other.width) / 2 + 30;
          
          if (distance < minDistance) {
            const force = (minDistance - distance) * 0.01;
            const angle = Math.atan2(dy, dx);
            node.vx -= Math.cos(angle) * force;
            node.vy -= Math.sin(angle) * force;
          }
          
          // Attraction for related words
          if (node.related.includes(other.id)) {
            const attractionForce = distance * 0.0001;
            node.vx += dx * attractionForce;
            node.vy += dy * attractionForce;
          }
        });
        
        // Boundary forces
        const margin = Math.max(node.width, node.height) / 2 + 20;
        if (node.x < margin) node.vx += 0.2;
        if (node.x > width - margin) node.vx -= 0.2;
        if (node.y < margin) node.vy += 0.2;
        if (node.y > height - margin) node.vy -= 0.2;
        
        // Apply velocity with damping
        node.vx *= 0.9;
        node.vy *= 0.9;
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        if (Math.abs(node.vx) > 0.01 || Math.abs(node.vy) > 0.01) {
          moved = true;
        }
      });
      
      // Update positions state
      setPositions(
        nodes.current.reduce((acc, node) => ({
          ...acc,
          [node.id]: { x: node.x, y: node.y }
        }), {})
      );
      
      if (moved && iteration < maxIterations) {
        frameId = requestAnimationFrame(simulate);
      }
    };
    
    frameId = requestAnimationFrame(simulate);
    
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [words]);
  
  return positions;
};

export const WordCloud: React.FC<WordCloudProps> = ({ words, className = '', style = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const positions = useForceLayout(containerRef, words);

  // Group words by their relationships
  const getRelatedWords = (wordId: number) => {
    const word = words.find(w => w.id === wordId);
    if (!word) return [];
    return [wordId, ...word.related];
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[600px] overflow-hidden ${className}`}
      style={style}
    >
      {/* Constellation lines */}
      <svg className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {hoveredWord && getRelatedWords(hoveredWord).map(relatedId => {
            const sourceWord = words.find(w => w.id === hoveredWord);
            if (!positions[hoveredWord] || !positions[relatedId] || hoveredWord === relatedId) return null;
            
            return (
              <motion.line
                key={`${hoveredWord}-${relatedId}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 0.4,
                  transition: { duration: 0.6, ease: "easeInOut" }
                }}
                exit={{ 
                  pathLength: 0, 
                  opacity: 0,
                  transition: { duration: 0.4, ease: "easeInOut" }
                }}
                x1={positions[hoveredWord].x}
                y1={positions[hoveredWord].y}
                x2={positions[relatedId].x}
                y2={positions[relatedId].y}
                stroke={sourceWord?.glowColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Words */}
      {Object.keys(positions).length > 0 && words.map((word) => {
        const isRelated = hoveredWord ? 
          hoveredWord === word.id || word.related.includes(hoveredWord) : 
          true;

        return (
          <motion.div
            key={word.id}
            className={`
              absolute cursor-pointer select-none transition-all duration-500
              ${word.color}
            `}
            style={{
              fontSize: `${word.fontSize}px`,
              fontWeight: word.weight >= 8 ? 'bold' : 'normal',
              left: positions[word.id]?.x || 0,
              top: positions[word.id]?.y || 0,
              transform: 'translate(-50%, -50%)',
              zIndex: hoveredWord === word.id ? 10 : 1,
            }}
            animate={{ 
              opacity: hoveredWord ? (isRelated ? 1 : 0.2) : 0.9,
              scale: hoveredWord === word.id ? 1.1 : 1,
              textShadow: hoveredWord === word.id ? `0 0 15px ${word.glowColor}` : 'none',
            }}
            whileHover={{ 
              scale: 1.1,
              transition: { 
                type: "spring", 
                stiffness: 200,
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
    </div>
  );
};

export default WordCloud;