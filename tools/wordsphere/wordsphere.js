class SvgWordSphere {
    constructor(container, words) {
        // Basic initialization
        this.container = container;
        this.words = words;
        this.radius = Math.min(window.innerWidth, window.innerHeight) / 4;
        this.rotation = { x: -0.5, y: 0 };
        this.momentum = { x: 0, y: 0.2 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        this.lastTime = Date.now();
        this.activeVertex = null;
        this.svg = null;
        this.animationFrame = null;
        this.lightSource = { x: window.innerWidth/2, y: window.innerHeight/2, z: 500 };
        this.lightPulsePhase = 0;

        // Create bound event handlers
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleResize = this.handleResize.bind(this);

        // Initialize handlers
        this.resizeHandler = () => {
            this.svg?.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
            this.radius = Math.min(window.innerWidth, window.innerHeight) / 4;
        };

        // Add event listeners
        window.addEventListener('resize', this.resizeHandler);

        // Create and store style element
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
            @keyframes dash {
                to {
                    stroke-dashoffset: -24;
                }
            }
            @keyframes pulse {
                0% { opacity: 0.4; transform: scale(1); }
                50% { opacity: 0.2; transform: scale(1.05); }
                100% { opacity: 0.4; transform: scale(1); }
            }
            @keyframes dotPulse {
                0% { opacity: 0.8; r: 3; filter: brightness(1); }
                50% { opacity: 0.4; r: 4; filter: brightness(1.5); }
                100% { opacity: 0.8; r: 3; filter: brightness(1); }
            }
            @keyframes rimLight {
                0% { opacity: 1; transform: rotate(0deg); }
                50% { opacity: 0.7; transform: rotate(180deg); }
                100% { opacity: 1; transform: rotate(360deg); }
            }

            /* Performance optimizations */
            .word-group {
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
                filter: translateZ(0);
                -webkit-filter: translateZ(0);
                contain: layout style paint;
                isolation: isolate;
            }

            /* Optimize paint layers */
            .word-text,
            .word-bg,
            .rim-light,
            .rim-light-reverse,
            .active-glow {
                contain: paint style;
                isolation: isolate;
            }

            /* Optimize animations */
            @media (prefers-reduced-motion: no-preference) {
                .rim-light,
                .rim-light-reverse {
                    contain: layout style paint;
                    isolation: isolate;
                }

                .connection-line,
                .connection-dot,
                .pulse-effect {
                    contain: style paint;
                    isolation: isolate;
                }
            }

            /* Respect reduced motion preference */
            @media (prefers-reduced-motion: reduce) {
                .rim-light,
                .rim-light-reverse,
                .connection-line,
                .connection-dot,
                .pulse-effect {
                    animation: none !important;
                    transition: none !important;
                }

                .word-group:hover .word-text,
                .word-group:hover .word-bg {
                    transform: none !important;
                    transition: filter 0.3s ease-out !important;
                }
            }

            /* Base styles */
            .word-group {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                transform-style: preserve-3d;
                -webkit-transform-style: preserve-3d;
                will-change: transform, opacity;
                composite: transform-layer;
                -webkit-composite: transform-layer;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                perspective: 1000px;
                -webkit-perspective: 1000px;
            }
            .word-text {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform, filter;
                composite: transform-layer;
                -webkit-composite: transform-layer;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }
            .word-bg {
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform, filter;
                composite: transform-layer;
                -webkit-composite: transform-layer;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }

            /* Animation elements */
            .connection-line {
                animation: dash 3s linear infinite;
                -webkit-animation: dash 3s linear infinite;
                composite: add;
                -webkit-composite: add;
            }
            .pulse-effect {
                animation: pulse 2s ease-in-out infinite;
                -webkit-animation: pulse 2s ease-in-out infinite;
                composite: transform-layer;
                -webkit-composite: transform-layer;
            }
            .connection-dot {
                animation: dotPulse 2s ease-in-out infinite;
                -webkit-animation: dotPulse 2s ease-in-out infinite;
                composite: transform-layer;
                -webkit-composite: transform-layer;
            }
            .connection-dot:nth-child(odd) {
                animation-delay: -1s;
                -webkit-animation-delay: -1s;
            }
            .rim-light, .rim-light-reverse {
                animation: rimLight 8s linear infinite;
                -webkit-animation: rimLight 8s linear infinite;
                transform-origin: center center;
                -webkit-transform-origin: center center;
                transition: stroke-width 0.2s ease-out, stroke-opacity 0.3s ease-out;
                will-change: stroke-width, stroke-opacity, transform;
                composite: transform-layer;
                -webkit-composite: transform-layer;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }
            .rim-light-reverse {
                animation-direction: reverse;
                -webkit-animation-direction: reverse;
            }

            /* Add webkit keyframes */
            @-webkit-keyframes dash {
                to {
                    stroke-dashoffset: -24;
                }
            }
            @-webkit-keyframes pulse {
                0% { opacity: 0.4; -webkit-transform: scale(1); }
                50% { opacity: 0.2; -webkit-transform: scale(1.05); }
                100% { opacity: 0.4; -webkit-transform: scale(1); }
            }
            @-webkit-keyframes dotPulse {
                0% { opacity: 0.8; r: 3; -webkit-filter: brightness(1); }
                50% { opacity: 0.4; r: 4; -webkit-filter: brightness(1.5); }
                100% { opacity: 0.8; r: 3; -webkit-filter: brightness(1); }
            }
            @-webkit-keyframes rimLight {
                0% { opacity: 1; -webkit-transform: rotate(0deg); }
                50% { opacity: 0.7; -webkit-transform: rotate(180deg); }
                100% { opacity: 1; -webkit-transform: rotate(360deg); }
            }

            /* Enhanced hover effects */
            .word-group {
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
                filter: translateZ(0);
                -webkit-filter: translateZ(0);
            }
            .word-group:hover {
                z-index: 100;
            }
            .word-group:hover .word-text {
                transform: scale(1.1) translateZ(0);
                -webkit-transform: scale(1.1) translateZ(0);
                filter: brightness(1.3) drop-shadow(0 0 5px rgba(0, 255, 255, 0.5)) translateZ(0);
                -webkit-filter: brightness(1.3) drop-shadow(0 0 5px rgba(0, 255, 255, 0.5)) translateZ(0);
                transition-delay: 0s;
            }
            .word-group:hover .word-bg {
                transform: scale(1.05) translateZ(0);
                -webkit-transform: scale(1.05) translateZ(0);
                filter: url(#softGlow) brightness(1.2) translateZ(0);
                -webkit-filter: url(#softGlow) brightness(1.2) translateZ(0);
                transition-delay: 0.05s;
            }
            .word-group:hover .rim-light {
                stroke-width: 2;
                stroke-opacity: 0.8;
                animation: rimLight 6s linear infinite;
                -webkit-animation: rimLight 6s linear infinite;
                transition-delay: 0.1s;
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
                filter: drop-shadow(0 0 3px rgba(0, 255, 255, 0.3)) translateZ(0);
                -webkit-filter: drop-shadow(0 0 3px rgba(0, 255, 255, 0.3)) translateZ(0);
            }
            .word-group:hover .rim-light-reverse {
                stroke-width: 1;
                stroke-opacity: 0.6;
                animation: rimLight 6s linear infinite reverse;
                -webkit-animation: rimLight 6s linear infinite reverse;
                transition-delay: 0.15s;
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
                filter: drop-shadow(0 0 2px rgba(0, 255, 255, 0.2)) translateZ(0);
                -webkit-filter: drop-shadow(0 0 2px rgba(0, 255, 255, 0.2)) translateZ(0);
            }
            .word-group:hover .active-glow {
                transform: scale(1.1);
                -webkit-transform: scale(1.1);
                filter: brightness(1.2);
                -webkit-filter: brightness(1.2);
                transition-delay: 0s;
            }

            /* Smooth transition out of hover */
            .word-group:not(:hover) .word-text,
            .word-group:not(:hover) .word-bg,
            .word-group:not(:hover) .rim-light,
            .word-group:not(:hover) .rim-light-reverse,
            .word-group:not(:hover) .active-glow {
                transition-delay: 0s;
            }

            /* Active state */
            .word-group.active {
                z-index: 1000;
            }
            .word-group.active .word-text {
                transition-delay: 0s;
            }
            .word-group.active .word-bg {
                transition-delay: 0.05s;
            }
            .word-group.active .rim-light {
                transition-delay: 0.1s;
            }
            .word-group.active .rim-light-reverse {
                transition-delay: 0.15s;
            }

            /* Active glow effect */
            .active-glow {
                transition: opacity 0.3s ease-out, transform 0.3s ease-out;
                -webkit-transition: opacity 0.3s ease-out, -webkit-transform 0.3s ease-out;
                will-change: transform, opacity;
                composite: transform-layer;
                -webkit-composite: transform-layer;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }

            /* Active state enhancements */
            .word-group.active .active-glow {
                filter: url(#softGlow) brightness(1.2);
                -webkit-filter: url(#softGlow) brightness(1.2);
            }
            .word-group.active .word-text {
                filter: brightness(1.3);
                -webkit-filter: brightness(1.3);
            }
        `;
        document.head.appendChild(this.styleElement);

        this.termRelationships = {
            'React': ['JavaScript', 'TypeScript', 'Redux'],
            'Vue': ['JavaScript', 'TypeScript'],
            'Angular': ['TypeScript', 'JavaScript'],
            'Node.js': ['JavaScript', 'MongoDB'],
            'TypeScript': ['JavaScript', 'React', 'Vue', 'Angular'],
            'JavaScript': ['React', 'Vue', 'Node.js', 'TypeScript'],
            'MongoDB': ['Node.js'],
            'GraphQL': ['REST'],
            'Redux': ['React', 'JavaScript']
        };

        // Add container optimization
        this.container.style.transform = 'translateZ(0)';
        this.container.style.backfaceVisibility = 'hidden';
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        // Create SVG element with optimizations
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("width", "100%");
        this.svg.setAttribute("height", "100%");
        
        // Add SVG rendering optimizations
        this.svg.style.transform = 'translateZ(0)';
        this.svg.style.backfaceVisibility = 'hidden';
        this.svg.setAttribute('shape-rendering', 'geometricPrecision');
        this.svg.setAttribute('text-rendering', 'geometricPrecision');
        this.svg.setAttribute('vector-effect', 'non-scaling-stroke');
        this.svg.setAttribute('color-rendering', 'optimizeQuality');
        this.svg.setAttribute('image-rendering', 'optimizeQuality');
        
        // Add viewport attributes for better scaling
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        this.svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
        
        // Add paint optimization attributes
        this.svg.style.contain = 'paint style layout';
        this.svg.style.isolation = 'isolate';
        this.svg.style.willChange = 'transform';
        
        // Add SVG definitions
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.innerHTML = `
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%" 
                    color-interpolation-filters="sRGB" 
                    filterUnits="userSpaceOnUse">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 18 -7
                " result="glow" />
                <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            
            <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%" 
                    color-interpolation-filters="sRGB">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 12 -5
                " result="glow" />
                <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <radialGradient id="sphereGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
                <stop offset="0%" stop-color="#0a0a2a" stop-opacity="1"/>
                <stop offset="100%" stop-color="#0a0a1a" stop-opacity="1"/>
            </radialGradient>
        `;
        this.svg.appendChild(defs);

        // Add required SVG definitions for gradients
        const defs2 = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs2.innerHTML = `
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
                <feComposite operator="over" in="SourceGraphic"/>
            </filter>

            <filter id="activeTextGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
                <feComposite operator="over" in="SourceGraphic"/>
            </filter>

            <linearGradient id="rimGradientNormal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#00ffff;stop-opacity:0.3"/>
                <stop offset="100%" style="stop-color:#0088ff;stop-opacity:0.1"/>
            </linearGradient>

            <linearGradient id="rimGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#00ffff;stop-opacity:0.6"/>
                <stop offset="100%" style="stop-color:#0088ff;stop-opacity:0.3"/>
            </linearGradient>

            <linearGradient id="edgeGradientFront">
                <stop offset="0%" style="stop-color:#00ffff;stop-opacity:0.5"/>
                <stop offset="100%" style="stop-color:#0088ff;stop-opacity:0.2"/>
            </linearGradient>

            <linearGradient id="edgeGradientBack">
                <stop offset="0%" style="stop-color:#0088ff;stop-opacity:0.3"/>
                <stop offset="100%" style="stop-color:#004488;stop-opacity:0.1"/>
            </linearGradient>
        `;
        this.svg.appendChild(defs2);

        // Add background
        const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        background.setAttribute("width", "100%");
        background.setAttribute("height", "100%");
        background.setAttribute("fill", "url(#sphereGradient)");
        this.svg.appendChild(background);

        // Initialize sphere
        const { vertices, edges } = this.generateGeosphere(this.radius, 2);
        this.vertices = vertices;
        this.edges = edges;

        // Add fade-in effect
        this.svg.style.opacity = 0;
        setTimeout(() => {
            this.svg.style.opacity = 1;
            this.svg.style.transition = "opacity 1s ease";
        }, 100);

        this.container.appendChild(this.svg);
        this.render();
    }

    generateGeosphere(radius, subdivisions) {
        const phi = (1 + Math.sqrt(5)) / 2;
        let vertices = [
            this.normalize({ x: 0, y: 1, z: phi }, radius),
            this.normalize({ x: 0, y: -1, z: phi }, radius),
            this.normalize({ x: 0, y: 1, z: -phi }, radius),
            this.normalize({ x: 0, y: -1, z: -phi }, radius),
            this.normalize({ x: 1, y: phi, z: 0 }, radius),
            this.normalize({ x: -1, y: phi, z: 0 }, radius),
            this.normalize({ x: 1, y: -phi, z: 0 }, radius),
            this.normalize({ x: -1, y: -phi, z: 0 }, radius),
            this.normalize({ x: phi, y: 0, z: 1 }, radius),
            this.normalize({ x: phi, y: 0, z: -1 }, radius),
            this.normalize({ x: -phi, y: 0, z: 1 }, radius),
            this.normalize({ x: -phi, y: 0, z: -1 }, radius)
        ];

        let edges = [
            [0,1], [0,4], [0,5], [0,8], [0,10],
            [1,6], [1,7], [1,8], [1,10],
            [2,3], [2,4], [2,5], [2,9], [2,11],
            [3,6], [3,7], [3,9], [3,11],
            [4,8], [4,9], [5,10], [5,11],
            [6,8], [6,9], [7,10], [7,11]
        ];

        return { vertices, edges };
    }

    normalize(v, length = 1) {
        const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return {
            x: (v.x / l) * length,
            y: (v.y / l) * length,
            z: (v.z / l) * length
        };
    }

    rotatePoint(point) {
        // First rotate around Y axis
        const cosY = Math.cos(this.rotation.y);
        const sinY = Math.sin(this.rotation.y);
        const y1 = {
            x: point.x * cosY + point.z * sinY,
            y: point.y,
            z: -point.x * sinY + point.z * cosY
        };
        
        // Then rotate around X axis
        const cosX = Math.cos(this.rotation.x);
        const sinX = Math.sin(this.rotation.x);
        return {
            x: y1.x,
            y: y1.y * cosX - y1.z * sinX,
            z: y1.y * sinX + y1.z * cosX
        };
    }

    project(point) {
        const rotated = this.rotatePoint(point);
        const focalLength = Math.max(window.innerWidth, window.innerHeight) * 1.5;
        const scale = focalLength / (focalLength - rotated.z * 0.8);
        return {
            x: rotated.x * scale + window.innerWidth / 2,
            y: rotated.y * scale + window.innerHeight / 2,
            z: rotated.z
        };
    }

    render() {
        // Clear SVG but preserve defs
        while (this.svg.lastChild && this.svg.lastChild.tagName !== 'defs') {
            this.svg.removeChild(this.svg.lastChild);
        }

        // Draw background
        const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        background.setAttribute("width", "100%");
        background.setAttribute("height", "100%");
        background.setAttribute("fill", "url(#sphereGradient)");
        this.svg.appendChild(background);

        // Create main group with 3D transforms
        const mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        mainGroup.setAttribute("class", "main-container");
        this.svg.appendChild(mainGroup);

        // Draw edges first
        this.edges.forEach(([i, j]) => {
            const p1 = this.project(this.vertices[i]);
            const p2 = this.project(this.vertices[j]);
            
            if (p1.z + p2.z > -2 * this.radius) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                const avgZ = (p1.z + p2.z) / 2;
                const opacity = Math.max(0.1, (avgZ + this.radius) / (2 * this.radius) * 0.3);
                
                line.setAttribute("x1", p1.x);
                line.setAttribute("y1", p1.y);
                line.setAttribute("x2", p2.x);
                line.setAttribute("y2", p2.y);
                line.setAttribute("stroke", "url(#edgeGradientFront)");
                line.setAttribute("stroke-width", "1");
                line.setAttribute("opacity", opacity);
                mainGroup.appendChild(line);
            }
        });

        // Sort and render words
        const sortedWords = this.vertices
            .map((vertex, index) => ({
                vertex,
                index,
                projected: this.project(vertex)
            }))
            .filter(item => item.index < this.words.length)
            .sort((a, b) => b.projected.z - a.projected.z);

        // Create container for words
        const wordsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        wordsGroup.setAttribute("class", "words-layer");

        // Render words with proper z-indexing
        sortedWords.forEach(({ vertex, index, projected }) => {
            if (projected.z > -this.radius) {
                const word = this.words[index];
                const depth = (projected.z + this.radius) / (2 * this.radius);
                const fontSize = Math.max(12, word.weight * 1.5 + 10);
                const isActive = index === this.activeVertex;

                const wordGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                wordGroup.setAttribute("class", `word-group${isActive ? ' active' : ''}`);
                wordGroup.setAttribute("transform", `translate(${projected.x},${projected.y})`);

                // Background
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("r", fontSize * 0.9);
                circle.setAttribute("fill", `rgba(${isActive ? '0, 40, 40' : '10, 20, 40'}, ${depth * 0.9})`);
                wordGroup.appendChild(circle);

                // Text
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("dominant-baseline", "middle");
                text.setAttribute("fill", isActive ? "#00ffff" : `rgba(0, 255, 255, ${depth})`);
                text.setAttribute("font-size", fontSize);
                text.textContent = word.text;

                // Add hover handlers
                const handleMouseEnter = () => this.activeVertex = index;
                const handleMouseLeave = () => this.activeVertex = null;
                
                text.addEventListener("mouseenter", handleMouseEnter);
                text.addEventListener("mouseleave", handleMouseLeave);

                wordGroup.appendChild(text);
                wordsGroup.appendChild(wordGroup);

                // Draw connections if active
                if (isActive && this.termRelationships[word.text]) {
                    this.termRelationships[word.text].forEach(relatedWord => {
                        const relatedIndex = this.words.findIndex(w => w.text === relatedWord);
                        if (relatedIndex !== -1) {
                            const relatedPos = this.project(this.vertices[relatedIndex]);
                            const connection = document.createElementNS("http://www.w3.org/2000/svg", "line");
                            connection.setAttribute("x1", projected.x);
                            connection.setAttribute("y1", projected.y);
                            connection.setAttribute("x2", relatedPos.x);
                            connection.setAttribute("y2", relatedPos.y);
                            connection.setAttribute("stroke", "url(#edgeGradientFront)");
                            connection.setAttribute("stroke-width", "2");
                            connection.setAttribute("stroke-dasharray", "4,4");
                            connection.setAttribute("class", "connection-line");
                            wordsGroup.appendChild(connection);
                        }
                    });
                }
            }
        });

        this.svg.appendChild(wordsGroup);
    }

    bindEvents() {
        if (this.svg) {
            this.svg.addEventListener("mousedown", this.handleMouseDown);
            document.addEventListener("mousemove", this.handleMouseMove);
            document.addEventListener("mouseup", this.handleMouseUp);
            
            // Add touch events support
            this.svg.addEventListener("touchstart", (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.handleMouseDown({
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            });
            
            document.addEventListener("touchmove", (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.handleMouseMove({
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            });
            
            document.addEventListener("touchend", (e) => {
                e.preventDefault();
                this.handleMouseUp();
            });
        }
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
        this.lastMousePos = { x: e.clientX, y: e.clientY };
        this.momentum = { x: 0, y: 0 };
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            const deltaX = e.clientX - this.lastMousePos.x;
            const deltaY = e.clientY - this.lastMousePos.y;
            
            // Smoother rotation control
            this.rotation.x += deltaY * 0.003;
            this.rotation.y += deltaX * 0.003;
            
            // Update momentum
            this.momentum = {
                x: deltaY * 0.001,
                y: deltaX * 0.001
            };
            
            this.lastMousePos = { x: e.clientX, y: e.clientY };
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleResize() {
        if (this.svg) {
            this.svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
            this.radius = Math.min(window.innerWidth, window.innerHeight) / 4;
            this.render();
        }
    }

    animate() {
        if (!this.animationFrame) return;

        const currentTime = Date.now();
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.016); // Cap at 60fps
        this.lastTime = currentTime;

        if (!this.isDragging) {
            // Apply continuous rotation with damping
            const damping = 0.98;
            this.momentum.x *= damping;
            this.momentum.y *= damping;

            // Add minimum rotation to keep sphere moving
            this.momentum.y = Math.max(0.005, Math.abs(this.momentum.y)) * Math.sign(this.momentum.y || 1);
            
            // Apply rotation
            this.rotation.x += this.momentum.x;
            this.rotation.y += this.momentum.y;
        }

        // Update light source
        this.lightPulsePhase += deltaTime * 0.5;
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
        this.lightSource = {
            x: window.innerWidth/2 + Math.cos(this.lightPulsePhase) * radius,
            y: window.innerHeight/2 + Math.sin(this.lightPulsePhase * 0.7) * radius,
            z: 500 + Math.sin(this.lightPulsePhase * 0.5) * 200
        };

        requestAnimationFrame(() => this.animate());
        this.render();
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        // Remove all event listeners
        if (this.svg) {
            this.svg.removeEventListener("mousedown", this.handleMouseDown);
            document.removeEventListener("mousemove", this.handleMouseMove);
            document.removeEventListener("mouseup", this.handleMouseUp);
        }
        window.removeEventListener('resize', this.resizeHandler);

        // Remove style element if it exists
        if (this.styleElement) {
            this.styleElement.remove();
        }

        // Clear references
        this.vertices = null;
        this.edges = null;
        this.words = null;

        // Remove SVG
        if (this.svg && this.svg.parentNode) {
            this.svg.remove();
        }

        // Clear container reference
        this.container = null;
    }
}

// Export for global use
window.SvgWordSphere = SvgWordSphere;