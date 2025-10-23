import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function WordCloud({ words, shuffleToken = 0, onHoverChange, clearSignal = 0 }) {
  const containerRef = useRef(null);
  const nodesRef = useRef([]);
  const [positions, setPositions] = useState({});
  const [hoveredWord, setHoveredWord] = useState(null);
  const animationRef = useRef();
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const cancelAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  }, []);

  const initializeLayout = useCallback(() => {
    if (!containerRef.current) return;

    cancelAnimation();
    setHoveredWord(null);

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const width = rect.width || container.clientWidth || window.innerWidth;
    const height = rect.height || container.clientHeight || window.innerHeight;
    dimensionsRef.current = { width, height };

    const cols = Math.max(4, Math.round(width / 220));
    const rows = Math.ceil(words.length / cols);
    const cellWidth = width / cols;
    const cellHeight = height / Math.max(1, rows);

    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    nodesRef.current = shuffledWords.map((word, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const baseX = (col + 0.5) * cellWidth;
      const baseY = (row + 0.5) * cellHeight;

      const xOffset = (Math.random() - 0.5) * cellWidth;
      const yOffset = (Math.random() - 0.5) * cellHeight;

      const weightFactor = word.weight / 10;
      const extraOffset = 60 * weightFactor;
      const extraX = (Math.random() - 0.5) * extraOffset;
      const extraY = (Math.random() - 0.5) * extraOffset;

      const startX = baseX + xOffset + extraX;
      const startY = baseY + yOffset + extraY;

      return {
        ...word,
        x: startX,
        y: startY,
        vx: 0,
        vy: 0,
        baseX: startX,
        baseY: startY,
      };
    });

    setPositions(
      nodesRef.current.reduce((acc, node) => ({
        ...acc,
        [node.id]: { x: node.x, y: node.y },
      }), {})
    );

    let lastTime = performance.now();

    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const { width: w, height: h } = dimensionsRef.current;

      nodesRef.current.forEach((node, i) => {
        const wobbleTime = time * 0.00018;
        const wobbleX = Math.sin(wobbleTime + i * 0.45) * 0.2;
        const wobbleY = Math.cos(wobbleTime + i * 0.35) * 0.2;

        const dx = node.baseX - node.x;
        const dy = node.baseY - node.y;
        node.vx += dx * 0.006;
        node.vy += dy * 0.006;

        nodesRef.current.forEach((other, j) => {
          if (i === j) return;
          const rx = other.x - node.x;
          const ry = other.y - node.y;
          const distance = Math.sqrt(rx * rx + ry * ry) || 1;
          const minDistance = (node.fontSize + other.fontSize) * 2.4;

          if (distance < minDistance) {
            const force = (minDistance - distance) * 0.06;
            node.vx -= (rx / distance) * force;
            node.vy -= (ry / distance) * force;
          }
        });

        node.vx *= 0.9;
        node.vy *= 0.9;

        node.x += node.vx * delta * 60 + wobbleX;
        node.y += node.vy * delta * 60 + wobbleY;

        const padding = Math.max(64, node.fontSize * 2);
        if (node.x < padding) node.x = padding;
        if (node.x > w - padding) node.x = w - padding;
        if (node.y < padding) node.y = padding;
        if (node.y > h - padding) node.y = h - padding;
      });

      setPositions(
        nodesRef.current.reduce((acc, node) => ({
          ...acc,
          [node.id]: { x: node.x, y: node.y },
        }), {})
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame((time) => {
      lastTime = time;
      animate(time);
    });
  }, [cancelAnimation, words]);

  useEffect(() => {
    initializeLayout();
    return () => cancelAnimation();
  }, [initializeLayout, cancelAnimation, shuffleToken]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => initializeLayout());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [initializeLayout]);

  useEffect(() => {
    if (!onHoverChange) return;
    const activeWord = words.find(w => w.id === hoveredWord) || null;
    onHoverChange(activeWord);
  }, [hoveredWord, onHoverChange, words]);

  useEffect(() => {
    setHoveredWord(null);
  }, [clearSignal]);

  const getConnections = (wordId) => {
    const word = words.find(w => w.id === wordId);
    if (!word) return [];

    const connections = new Set([
      ...word.related,
      ...words.filter(w => w.related.includes(wordId)).map(w => w.id)
    ]);
    return Array.from(connections);
  };

  const getNeighbors = (wordId) => {
    if (!positions[wordId]) return [];
    const pos = positions[wordId];
    const neighborRadius = 150;

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

  const activeWord = useMemo(() => words.find(w => w.id === hoveredWord) || null, [hoveredWord, words]);
  const connectionNames = useMemo(() => (
    hoveredWord ? getConnections(hoveredWord)
      .map(id => words.find(w => w.id === id)?.text)
      .filter(Boolean)
      : []
  ), [hoveredWord, words]);

  const neighborNames = useMemo(() => (
    hoveredWord ? getNeighbors(hoveredWord)
      .map(id => words.find(w => w.id === id)?.text)
      .filter(Boolean)
      : []
  ), [hoveredWord, positions, words]);

  return (
    <div ref={containerRef} className="word-cloud-container relative w-full h-[620px]" role="presentation">

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

      <AnimatePresence>
        {activeWord && (
          <motion.div
            key={activeWord.id}
            className="word-focus-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            aria-live="polite"
          >
            <h3>{activeWord.text}</h3>
            <p className="word-focus-card__meta">Weight: {activeWord.weight}</p>
            {connectionNames.length > 0 && (
              <p><strong>Connected:</strong> {connectionNames.join(', ')}</p>
            )}
            {neighborNames.length > 0 && (
              <p className="word-focus-card__neighbors">Nearby: {neighborNames.join(', ')}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
