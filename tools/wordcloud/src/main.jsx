import React from 'react'
import ReactDOM from 'react-dom/client'
import { WordCloud } from './WordCloud'
import './styles.css'

const words = [
  // Core Enterprise Solutions (Weight 10)
  { text: 'Digital Transformation', weight: 10, related: [2, 3, 4, 5] },
  { text: 'Enterprise Integration', weight: 10, related: [1, 3, 6, 7] },
  { text: 'Cloud Solutions', weight: 10, related: [1, 2, 8, 9] },
  { text: 'System Integration', weight: 10, related: [1, 2, 5, 6] },
  { text: 'Enterprise Architecture', weight: 10, related: [1, 4, 7, 8] },

  // Infrastructure & Services (Weight 9)
  { text: 'API Management', weight: 9, related: [2, 4, 14, 16] },
  { text: 'Data Analytics', weight: 9, related: [5, 15, 17] },
  { text: 'Azure Services', weight: 9, related: [3, 5, 11] },
  { text: 'Business Intelligence', weight: 9, related: [3, 7, 15] },
  { text: 'Cloud Migration', weight: 9, related: [3, 8, 13] },

  // Platform & Development (Weight 8)
  { text: 'Microservices', weight: 8, related: [6, 12, 13] },
  { text: 'AI/ML Platform', weight: 8, related: [7, 11, 14] },
  { text: '.NET Core', weight: 8, related: [11, 14, 16] },
  { text: 'Kubernetes', weight: 8, related: [11, 13, 19] },
  { text: 'Data Lake', weight: 8, related: [7, 9, 17] },
  { text: 'CI/CD Pipeline', weight: 8, related: [13, 19, 20] },
  { text: 'Event-Driven Architecture', weight: 8, related: [11, 15, 18] },
  { text: 'Infrastructure as Code', weight: 8, related: [14, 16, 19] },

  // Operations & Management (Weight 7)
  { text: 'DevOps', weight: 7, related: [16, 18, 20] },
  { text: 'Hybrid Cloud', weight: 7, related: [3, 10, 21] },
  { text: 'Process Automation', weight: 7, related: [16, 20, 22] },
  { text: 'REST APIs', weight: 7, related: [6, 23, 24] },
  { text: 'GraphQL', weight: 7, related: [6, 22, 24] },
  { text: 'Identity Management', weight: 7, related: [25, 26, 27] },
  { text: 'Network Security', weight: 7, related: [24, 26, 28] },
  { text: 'Disaster Recovery', weight: 7, related: [24, 25, 28] },
  { text: 'System Resilience', weight: 7, related: [24, 26, 28] },
  { text: 'Performance Optimization', weight: 7, related: [25, 26, 27] }
].map((word, index) => ({
  ...word,
  id: index + 1,
  // Cyberpunk blue gradient colors - brighter and more visible
  color: `rgba(${120 + word.weight * 10}, ${180 + word.weight * 5}, 255, 0.9)`,
  glow: `rgba(${100 + word.weight * 10}, ${150 + word.weight * 5}, 255, 0.7)`,
  fontSize: word.weight * 2.2
}));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen p-4 bg-[var(--background)]">
      <WordCloud words={words} />
    </div>
  </React.StrictMode>,
)
