# WIZARD: Web-Integrated Zero-lag Adaptive Resource Dashboard

Welcome to WIZARD, a collection of versatile, LLM-aided tools and pages designed for web use. This project showcases various small tools and web pages generated using advanced language models, aimed at enhancing productivity and functionality.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tools Overview](#tools-overview)
- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [Development Status](#development-status)
- [Contributing](#contributing)
- [License](#license)

## Introduction

WIZARD is a dynamic and adaptable resource dashboard that brings together a variety of tools and web pages. Created using cutting-edge language models, these tools are designed to provide seamless and efficient solutions for various web-related tasks.

## Features

- **Versatile Tools**: A collection of multi-functional tools for diverse web applications
- **LLM-Aided**: Tools generated with the aid of advanced language models for high efficiency and accuracy
- **Customizable**: Easily modify and extend the tools to suit your specific needs
- **User-Friendly**: Intuitive interfaces and straightforward documentation for easy use

## Tools Overview

### Interactive Word Cloud
- **Status**: Active Development
- **Features**: Force-directed layout, dynamic relationships, hover effects
- **TODOs**: 
  - [ ] Add search functionality
  - [ ] Implement word grouping
  - [ ] Add export options

### WordSphere
- **Status**: Active Development
- **Features**: 3D visualization, momentum-based rotation, term highlighting
- **TODOs**: 
  - [ ] Add zoom functionality
  - [ ] Implement touch controls
  - [ ] Add word customization UI

### Pixel Art Creator
- **Status**: Stable
- **Features**: Grid-based interface, color picker, PNG export
- **TODOs**:
  - [ ] Add layer support
  - [ ] Implement undo/redo
  - [ ] Add animation frames

### Skill Tree Designer
- **Status**: Stable
- **Features**: Tree-based skills, point management, dependencies
- **TODOs**:
  - [ ] Add save/load functionality
  - [ ] Implement skill prerequisites
  - [ ] Add custom icons

### Geometric Skill Tree
- **Status**: Stable
- **Features**: Hexagonal grid, dual point system, connection visualization
- **TODOs**:
  - [ ] Add path highlighting
  - [ ] Implement skill levels
  - [ ] Add export/import

### RPG Inventory System
- **Status**: Stable
- **Features**: Drag-and-drop, equipment slots, local storage
- **TODOs**:
  - [ ] Add item stacking
  - [ ] Implement weight system
  - [ ] Add item tooltips

### SLerp: Color Interpolation
- **Status**: Stable
- **Features**: Color transitions, real-time preview, export options
- **TODOs**:
  - [ ] Add more color spaces
  - [ ] Implement palette saving
  - [ ] Add batch processing

## Getting Started

To get started with WIZARD, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/alexkorol/wizard.git
    cd wizard
    ```

2. **Explore the tools**: Browse the `tools/` directory to see the available tools and pages.

3. **Open the landing page**: Open `index.html` in your browser to access the main dashboard.

## Directory Structure

```
wizard/
+-- index.html          # Landing page with links to all tools
+-- README.md           # Project documentation
+-- tools/              # Directory containing all tools
|   +-- wordcloud/      # Interactive word cloud
|   +-- wordsphere/     # 3D word visualization
|   +-- pixelart/       # Pixel art creator
|   +-- skilltree/      # Skill tree designer
|   +-- geometric_skilltree/  # Hexagonal skill system
|   +-- rpg_inventory/  # Inventory management
|   +-- slerp/         # Color interpolation tool
+-- assets/            # Common assets (images, CSS, JS)
```

## Development Status

The project is actively maintained and new features are being added regularly. Each tool has its own README with specific TODOs and development status.

Current focus areas:
- Improving mobile responsiveness
- Adding more interactive features
- Enhancing tool integration
- Implementing user feedback

## Contributing

We welcome contributions to WIZARD! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using WIZARD! We hope these tools enhance your web development experience.
