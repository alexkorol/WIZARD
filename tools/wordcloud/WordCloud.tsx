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

const useForceLayout = (containerRef: React.RefObject<HTMLDivElement>, words: WordCloudWord[]) => {
  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({});
  const nodesRef = useRef(words.map(word => ({
    ...word,
    x: Math.random() * 1000,
    y: Math.random() * 600,
    vx: 0,
    vy: 0
  })));
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    
    let frameCount = 0;
    const maxFrames = 100;
    
    const simulate = () => {
      frameCount++;
      const nodes = nodesRef.current;
      let moved = false;
      
      nodes.forEach((node, i) => {
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
        const centerForce = distanceToCenter * 0.00002;
        node.vx += dx * centerForce;
        node.vy += dy * centerForce;
        
        nodes.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (node.width + other.width) / 2 + 40;
          
          if (distance < minDistance) {
            const force = (minDistance - distance) * 0.01;
            const angle = Math.atan2(dy, dx);
            node.vx -= Math.cos(angle) * force;
            node.vy -= Math.sin(angle) * force;
          }
        });
        
        const margin = node.width / 2 + 20;
        if (node.x < margin) node.vx += 0.2;
        if (node.x > width - margin) node.vx -= 0.2;
        if (node.y < margin) node.vy += 0.2;
        if (node.y > height - margin) node.vy -= 0.2;
        
        node.vx *= 0.9;
        node.vy *= 0.9;
        
        node.x += node.vx;
        node.y += node.vy;
        
        if (Math.abs(node.vx) > 0.01 || Math.abs(node.vy) > 0.01) {
          moved = true;
        }
      });
      
      setPositions(prev => {
        const next = nodes.reduce((acc, node) => ({
          ...acc,
          [node.id]: { x: node.x, y: node.y }
        }), {});
        
        return Object.keys(next).reduce((acc, key) => ({
          ...acc,
          [key]: prev[key] ? {
            x: prev[key].x * 0.1 + next[key].x * 0.9,
            y: prev[key].y * 0.1 + next[key].y * 0.9
          } : next[key]
        }), {});
      });
      
      if (moved && frameCount < maxFrames) {
        requestAnimationFrame(simulate);
      }
    };
    
    simulate();
    
    return () => {
      // Cleanup
    };
  }, []);
  
  return positions;
};

export const WordCloud: React.FC<WordCloudProps> = ({ words, className = '', style = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const positions = useForceLayout(containerRef, words);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[600px] bg-gray-900 overflow-hidden ${className}`}
      style={style}
    >
      <svg className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {hoveredWord && words.find(w => w.id === hoveredWord)?.related.map(relatedId => {
            if (!positions[relatedId] || !positions[hoveredWord]) return null;
            const sourceWord = words.find(w => w.id === hoveredWord);
            return (
              <motion.line
                key={`${hoveredWord}-${relatedId}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 0.6,
                  transition: { duration: 0.4, ease: "easeInOut" }
                }}
                exit={{ 
                  pathLength: 0, 
                  opacity: 0,
                  transition: { duration: 0.3, ease: "easeInOut" }
                }}
                x1={positions[hoveredWord].x}
                y1={positions[hoveredWord].y}
                x2={positions[relatedId].x}
                y2={positions[relatedId].y}
                stroke={sourceWord?.glowColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {Object.keys(positions).length > 0 && words.map((word) => (
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
          }}
          animate={{ 
            opacity: hoveredWord === word.id ? 1 : 
                     hoveredWord && word.related.includes(hoveredWord) ? 0.9 : 
                     hoveredWord ? 0.3 : 0.9,
            scale: hoveredWord === word.id ? 1.1 : 1,
            textShadow: hoveredWord === word.id ? `0 0 15px ${word.glowColor}` : 'none',
            transition: { 
              duration: 0.4, 
              ease: "easeInOut"
            }
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
      ))}
    </div>
  );
};

export default WordCloud;