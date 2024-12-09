import React from 'react';
import { WordCloud, WordCloudWord } from './WordCloud';

const demoWords: WordCloudWord[] = [
  { 
    id: 1,
    text: 'Digital Transformation',
    weight: 10,
    color: 'text-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    related: [2, 3, 7, 15],
    fontSize: 30,
    width: 180,
    height: 30
  },
  { 
    id: 2,
    text: 'Enterprise Integration',
    weight: 10,
    color: 'text-purple-500',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    related: [1, 4, 6],
    fontSize: 30,
    width: 180,
    height: 30
  },
  { 
    id: 3,
    text: 'Cloud Solutions',
    weight: 10,
    color: 'text-cyan-500',
    glowColor: 'rgba(34, 211, 238, 0.5)',
    related: [1, 9],
    fontSize: 30,
    width: 150,
    height: 30
  },
  { 
    id: 4,
    text: 'API Management',
    weight: 9,
    color: 'text-emerald-500',
    glowColor: 'rgba(52, 211, 153, 0.5)',
    related: [2, 6],
    fontSize: 27,
    width: 135,
    height: 27
  },
  { 
    id: 5,
    text: 'Data Analytics',
    weight: 9,
    color: 'text-indigo-500',
    glowColor: 'rgba(99, 102, 241, 0.5)',
    related: [7, 8],
    fontSize: 27,
    width: 135,
    height: 27
  },
  { 
    id: 6,
    text: 'Microservices',
    weight: 8,
    color: 'text-fuchsia-500',
    glowColor: 'rgba(217, 70, 239, 0.5)',
    related: [2, 4],
    fontSize: 24,
    width: 120,
    height: 24
  },
  { 
    id: 7,
    text: 'AI/ML Platform',
    weight: 8,
    color: 'text-sky-500',
    glowColor: 'rgba(14, 165, 233, 0.5)',
    related: [5, 8],
    fontSize: 24,
    width: 120,
    height: 24
  },
  { 
    id: 8,
    text: 'DevOps',
    weight: 7,
    color: 'text-teal-500',
    glowColor: 'rgba(20, 184, 166, 0.5)',
    related: [9],
    fontSize: 21,
    width: 70,
    height: 21
  },
  { 
    id: 9,
    text: 'Hybrid Cloud',
    weight: 7,
    color: 'text-violet-500',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    related: [3],
    fontSize: 21,
    width: 105,
    height: 21
  }
];

export const WordCloudDemo = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Interactive Word Cloud</h2>
      <p className="mb-4">
        Hover over words to see their relationships. Words are positioned using a force-directed layout algorithm.
      </p>
      <div className="border border-gray-200 rounded-lg">
        <WordCloud words={demoWords} />
      </div>
    </div>
  );
};

export default WordCloudDemo;