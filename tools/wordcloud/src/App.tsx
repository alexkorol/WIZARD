import { WordCloud } from './components/WordCloud';
import type { WordCloudWord } from './components/WordCloud';

const words: WordCloudWord[] = [
  // Core Enterprise Solutions (Weight 10)
  { 
    id: 1,
    text: 'Digital Transformation',
    weight: 10,
    color: 'text-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    related: [2, 3, 4, 5],
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
    related: [1, 3, 6, 7],
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
    related: [1, 2, 8, 9],
    fontSize: 30,
    width: 150,
    height: 30
  },
  { 
    id: 4,
    text: 'System Integration',
    weight: 10,
    color: 'text-emerald-500',
    glowColor: 'rgba(52, 211, 153, 0.5)',
    related: [1, 2, 5, 6],
    fontSize: 30,
    width: 160,
    height: 30
  },
  { 
    id: 5,
    text: 'Enterprise Architecture',
    weight: 10,
    color: 'text-rose-500',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    related: [1, 4, 7, 8],
    fontSize: 30,
    width: 180,
    height: 30
  },

  // Infrastructure & Services (Weight 9)
  { 
    id: 6,
    text: 'API Management',
    weight: 9,
    color: 'text-indigo-500',
    glowColor: 'rgba(99, 102, 241, 0.5)',
    related: [2, 4, 14, 16],
    fontSize: 27,
    width: 135,
    height: 27
  },
  { 
    id: 7,
    text: 'Data Analytics',
    weight: 9,
    color: 'text-amber-500',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    related: [5, 15, 17],
    fontSize: 27,
    width: 135,
    height: 27
  },
  { 
    id: 8,
    text: 'Azure Services',
    weight: 9,
    color: 'text-sky-500',
    glowColor: 'rgba(14, 165, 233, 0.5)',
    related: [3, 5, 11],
    fontSize: 27,
    width: 135,
    height: 27
  },
  { 
    id: 9,
    text: 'Business Intelligence',
    weight: 9,
    color: 'text-teal-500',
    glowColor: 'rgba(20, 184, 166, 0.5)',
    related: [3, 7, 15],
    fontSize: 27,
    width: 160,
    height: 27
  },
  { 
    id: 10,
    text: 'Cloud Migration',
    weight: 9,
    color: 'text-fuchsia-500',
    glowColor: 'rgba(217, 70, 239, 0.5)',
    related: [3, 8, 13],
    fontSize: 27,
    width: 135,
    height: 27
  },

  // Platform & Development (Weight 8)
  { 
    id: 11,
    text: 'Microservices',
    weight: 8,
    color: 'text-violet-500',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    related: [6, 12, 13],
    fontSize: 24,
    width: 120,
    height: 24
  },
  { 
    id: 12,
    text: 'AI/ML Platform',
    weight: 8,
    color: 'text-lime-500',
    glowColor: 'rgba(132, 204, 22, 0.5)',
    related: [7, 11, 14],
    fontSize: 24,
    width: 120,
    height: 24
  },
  { 
    id: 13,
    text: '.NET Core',
    weight: 8,
    color: 'text-orange-500',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    related: [11, 14, 16],
    fontSize: 24,
    width: 100,
    height: 24
  },
  { 
    id: 14,
    text: 'Kubernetes',
    weight: 8,
    color: 'text-cyan-600',
    glowColor: 'rgba(8, 145, 178, 0.5)',
    related: [11, 13, 19],
    fontSize: 24,
    width: 110,
    height: 24
  },
  { 
    id: 15,
    text: 'Data Lake',
    weight: 8,
    color: 'text-blue-600',
    glowColor: 'rgba(37, 99, 235, 0.5)',
    related: [7, 9, 17],
    fontSize: 24,
    width: 100,
    height: 24
  },
  { 
    id: 16,
    text: 'CI/CD Pipeline',
    weight: 8,
    color: 'text-emerald-600',
    glowColor: 'rgba(5, 150, 105, 0.5)',
    related: [13, 19, 20],
    fontSize: 24,
    width: 120,
    height: 24
  },
  { 
    id: 17,
    text: 'Event-Driven Architecture',
    weight: 8,
    color: 'text-purple-600',
    glowColor: 'rgba(147, 51, 234, 0.5)',
    related: [11, 15, 18],
    fontSize: 24,
    width: 190,
    height: 24
  },
  { 
    id: 18,
    text: 'Infrastructure as Code',
    weight: 8,
    color: 'text-rose-600',
    glowColor: 'rgba(225, 29, 72, 0.5)',
    related: [14, 16, 19],
    fontSize: 24,
    width: 170,
    height: 24
  },

  // Operations & Management (Weight 7)
  { 
    id: 19,
    text: 'DevOps',
    weight: 7,
    color: 'text-indigo-400',
    glowColor: 'rgba(129, 140, 248, 0.5)',
    related: [16, 18, 20],
    fontSize: 21,
    width: 70,
    height: 21
  },
  { 
    id: 20,
    text: 'Hybrid Cloud',
    weight: 7,
    color: 'text-sky-400',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    related: [3, 10, 21],
    fontSize: 21,
    width: 105,
    height: 21
  },
  { 
    id: 21,
    text: 'Process Automation',
    weight: 7,
    color: 'text-teal-400',
    glowColor: 'rgba(45, 212, 191, 0.5)',
    related: [16, 20, 22],
    fontSize: 21,
    width: 140,
    height: 21
  },
  { 
    id: 22,
    text: 'REST APIs',
    weight: 7,
    color: 'text-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.5)',
    related: [6, 23, 24],
    fontSize: 21,
    width: 90,
    height: 21
  },
  { 
    id: 23,
    text: 'GraphQL',
    weight: 7,
    color: 'text-violet-400',
    glowColor: 'rgba(167, 139, 250, 0.5)',
    related: [6, 22, 24],
    fontSize: 21,
    width: 80,
    height: 21
  },
  { 
    id: 24,
    text: 'Identity Management',
    weight: 7,
    color: 'text-rose-400',
    glowColor: 'rgba(251, 113, 133, 0.5)',
    related: [25, 26, 27],
    fontSize: 21,
    width: 150,
    height: 21
  },
  { 
    id: 25,
    text: 'Network Security',
    weight: 7,
    color: 'text-orange-400',
    glowColor: 'rgba(251, 146, 60, 0.5)',
    related: [24, 26, 28],
    fontSize: 21,
    width: 130,
    height: 21
  },
  { 
    id: 26,
    text: 'Disaster Recovery',
    weight: 7,
    color: 'text-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    related: [24, 25, 28],
    fontSize: 21,
    width: 140,
    height: 21
  },
  { 
    id: 27,
    text: 'System Resilience',
    weight: 7,
    color: 'text-lime-400',
    glowColor: 'rgba(163, 230, 53, 0.5)',
    related: [24, 26, 28],
    fontSize: 21,
    width: 140,
    height: 21
  },
  { 
    id: 28,
    text: 'Performance Optimization',
    weight: 7,
    color: 'text-cyan-400',
    glowColor: 'rgba(34, 211, 238, 0.5)',
    related: [25, 26, 27],
    fontSize: 21,
    width: 180,
    height: 21
  }
];

function App() {
  return (
    <div className="min-h-screen p-4 bg-[var(--background)]">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-[var(--primary)]">Interactive Word Cloud</h1>
        <p className="text-[var(--text-secondary)] text-lg">
          Explore relationships between different concepts by hovering over the words.
          The size of each word represents its importance in the context.
        </p>
      </header>
      
      <main className="max-w-6xl mx-auto">
        <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-lg">
          <WordCloud words={words} />
        </div>
      </main>

      <footer className="mt-8 text-center text-[var(--text-secondary)]">
        <p>Part of the WIZARD toolkit</p>
        <a 
          href="../../" 
          className="inline-block mt-2 text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
        >
          Back to Dashboard
        </a>
      </footer>
    </div>
  );
}

export default App;