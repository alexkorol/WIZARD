import React from 'react'
import ReactDOM from 'react-dom/client'
import { WordCloud } from './WordCloud'
import './styles.css'

const words = [
  { text: 'Digital Transformation', weight: 10, related: [2, 3, 4] },
  { text: 'Enterprise Integration', weight: 10, related: [1, 3, 5] },
  { text: 'Cloud Solutions', weight: 10, related: [1, 2, 6] },
  { text: 'API Management', weight: 9, related: [1, 5, 6] },
  { text: 'Data Analytics', weight: 9, related: [2, 6, 7] },
  { text: 'Azure Services', weight: 9, related: [3, 4, 8] },
  { text: 'Microservices', weight: 8, related: [3, 4, 5] },
  { text: 'AI/ML Platform', weight: 8, related: [5, 8, 9] },
  { text: '.NET Core', weight: 8, related: [6, 7, 10] },
  { text: 'DevOps', weight: 7, related: [7, 8, 11] }
].map((word, index) => ({
  ...word,
  id: index + 1,
  color: `rgba(64, 156, 255, ${0.5 + word.weight * 0.05})`,
  glow: `rgba(0, 128, 255, ${0.3 + word.weight * 0.07})`,
  fontSize: word.weight * 2.5
}));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen p-4 bg-[var(--background)]">
      <WordCloud words={words} />
    </div>
  </React.StrictMode>,
)