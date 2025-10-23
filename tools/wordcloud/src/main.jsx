import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { WordCloud } from './WordCloud'
import './styles.css'

const baseWords = [
  { text: 'Digital Transformation', weight: 10, related: [2, 3, 4, 5] },
  { text: 'Enterprise Integration', weight: 10, related: [1, 3, 6, 7] },
  { text: 'Cloud Solutions', weight: 10, related: [1, 2, 8, 9] },
  { text: 'System Integration', weight: 10, related: [1, 2, 5, 6] },
  { text: 'Enterprise Architecture', weight: 10, related: [1, 4, 7, 8] },
  { text: 'API Management', weight: 9, related: [2, 4, 14, 16] },
  { text: 'Data Analytics', weight: 9, related: [5, 15, 17] },
  { text: 'Azure Services', weight: 9, related: [3, 5, 11] },
  { text: 'Business Intelligence', weight: 9, related: [3, 7, 15] },
  { text: 'Cloud Migration', weight: 9, related: [3, 8, 13] },
  { text: 'Microservices', weight: 8, related: [6, 12, 13] },
  { text: 'AI/ML Platform', weight: 8, related: [7, 11, 14] },
  { text: '.NET Core', weight: 8, related: [11, 14, 16] },
  { text: 'Kubernetes', weight: 8, related: [11, 13, 19] },
  { text: 'Data Lake', weight: 8, related: [7, 9, 17] },
  { text: 'CI/CD Pipeline', weight: 8, related: [13, 19, 20] },
  { text: 'Event-Driven Architecture', weight: 8, related: [11, 15, 18] },
  { text: 'Infrastructure as Code', weight: 8, related: [14, 16, 19] },
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
  color: `rgba(${120 + word.weight * 10}, ${180 + word.weight * 5}, 255, 0.9)`,
  glow: `rgba(${100 + word.weight * 10}, ${150 + word.weight * 5}, 255, 0.7)`,
  fontSize: word.weight * 2.2
}));

function App() {
  const [shuffleToken, setShuffleToken] = useState(0)
  const [clearSignal, setClearSignal] = useState(0)
  const [activeWord, setActiveWord] = useState(null)

  const metrics = useMemo(() => {
    const totalWords = baseWords.length
    const totalConnections = baseWords.reduce((sum, word) => sum + word.related.length, 0)
    const averageWeight = (baseWords.reduce((sum, word) => sum + word.weight, 0) / totalWords).toFixed(1)
    return { totalWords, totalConnections, averageWeight }
  }, [])

  const activeConnections = useMemo(() => {
    if (!activeWord) return []
    const uniqueConnections = new Set([
      ...activeWord.related,
      ...baseWords.filter(w => w.related.includes(activeWord.id)).map(w => w.id)
    ])
    return Array.from(uniqueConnections)
      .map(id => baseWords.find(w => w.id === id)?.text)
      .filter(Boolean)
  }, [activeWord])

  return (
    <div className="wordcloud-shell">
      <header className="wordcloud-header">
        <a className="wordcloud-back" href="../../index.html">← Back to Dashboard</a>
        <div className="wordcloud-header__body">
          <h1>Interactive Enterprise Word Cloud</h1>
          <p>
            Hover to explore related capabilities, trace adjacent concepts, and quickly surface
            the services that drive modern platform initiatives.
          </p>
        </div>
        <div className="wordcloud-header__actions">
          <button
            type="button"
            className="wc-button"
            onClick={() => setShuffleToken(token => token + 1)}
          >
            Shuffle Layout
          </button>
          <button
            type="button"
            className="wc-button"
            onClick={() => setClearSignal(signal => signal + 1)}
          >
            Clear Highlight
          </button>
        </div>
      </header>

      <main className="wordcloud-main">
        <section className="wordcloud-visual" aria-label="Word cloud visualisation">
          <WordCloud
            words={baseWords}
            shuffleToken={shuffleToken}
            clearSignal={clearSignal}
            onHoverChange={setActiveWord}
          />
        </section>
        <aside className="wordcloud-sidebar" aria-label="Contextual insights">
          <div className="info-panel">
            <h2>Currently Highlighted</h2>
            {activeWord ? (
              <div className="info-panel__content">
                <h3>{activeWord.text}</h3>
                <p>Weight: <strong>{activeWord.weight}</strong></p>
                {activeConnections.length > 0 ? (
                  <p className="info-panel__list"><strong>Connected to:</strong> {activeConnections.join(', ')}</p>
                ) : (
                  <p className="info-panel__empty">No direct relationships detected.</p>
                )}
              </div>
            ) : (
              <p className="info-panel__empty">Hover over any term in the cloud to see its relationships.</p>
            )}
          </div>

          <div className="info-panel">
            <h2>Snapshot Metrics</h2>
            <div className="metric-grid">
              <div className="metric">
                <span className="metric__label">Total Terms</span>
                <span className="metric__value">{metrics.totalWords}</span>
              </div>
              <div className="metric">
                <span className="metric__label">Connections</span>
                <span className="metric__value">{metrics.totalConnections}</span>
              </div>
              <div className="metric">
                <span className="metric__label">Avg. Weight</span>
                <span className="metric__value">{metrics.averageWeight}</span>
              </div>
            </div>
          </div>

          <div className="info-panel info-panel--hint">
            <h2>Tips</h2>
            <ul>
              <li>Use <strong>Shuffle Layout</strong> to regenerate the organic placement.</li>
              <li>Try hovering across clusters to follow connection paths.</li>
              <li>Use <strong>Clear Highlight</strong> to refocus the canvas.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
