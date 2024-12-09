# WordCloud Component

An interactive word cloud component that displays words with different sizes and colors, showing relationships between words when hovering. The component uses a force-directed layout algorithm to position words dynamically.

## Features

- Force-directed layout for optimal word positioning
- Interactive hover effects showing word relationships
- Customizable word sizes, colors, and glow effects
- Smooth animations for interactions
- Responsive design

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
# Start development server
npm run dev
```

### Building

```bash
# Build for production
npm run build
```

The built files will be in the `dist` directory.

## Usage

The WordCloud component takes an array of words with properties defining their appearance and relationships:

```tsx
interface WordCloudWord {
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

// Example usage:
const words: WordCloudWord[] = [
  { 
    id: 1,
    text: 'Digital Transformation',
    weight: 10,
    color: 'text-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    related: [2, 3],
    fontSize: 30,
    width: 180,
    height: 30
  },
  // ... more words
];

<WordCloud 
  words={words}
  className="custom-class"
  style={{ height: '600px' }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| words | WordCloudWord[] | Yes | Array of words to display |
| className | string | No | Additional CSS classes |
| style | React.CSSProperties | No | Additional inline styles |

## Dependencies

- React
- Framer Motion
- Tailwind CSS

## Notes

- The component requires a container with a defined height
- Words are positioned using a force-directed layout algorithm that prevents overlapping
- Hover effects show relationships between words with animated lines
- The layout is recalculated on mount and when the container size changes

## Part of the WIZARD Toolkit

This component is part of the WIZARD (Web-Integrated Zero-lag Adaptive Resource Dashboard) toolkit, a collection of versatile, LLM-aided tools designed for web development and game design.
