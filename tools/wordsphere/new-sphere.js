class NewWordSphere {
    constructor(container, words) {
        this.container = container;
        this.words = words;
        this.radius = 300;
        this.rotationX = 0;
        this.rotationY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;
        this.wordElements = [];
        this.connections = [];
        this.hoveredWord = null;
        this.rotationSpeed = 0.002;
        this.mouseSensitivity = 0.005;
        this.blurAmount = 2;
        this.lineFadeStart = 40;
        this.hoverScale = 1.1;
        this.sizeDepthEffect = 0.5;
        this.baseSize = 1000;
        this.animationFrame = null;

        // Add controls container
        this.addControls();
        
        this.init();
        this.animate();
        this.bindEvents();
        this.bindControls();
    }

    addControls() {
        const controls = document.createElement('div');
        controls.id = 'controls';
        controls.innerHTML = `
            <button id="minimize-button">Minimize</button>
            <div class="slider-container">
                <label>Rotation Speed</label>
                <input type="range" id="rotationSpeed" min="0" max="0.01" step="0.001" value="0.002">
            </div>
            <div class="slider-container">
                <label>Sphere Radius</label>
                <input type="range" id="sphereRadius" min="200" max="500" step="10" value="300">
            </div>
            <div class="slider-container">
                <label>Mouse Sensitivity</label>
                <input type="range" id="mouseSensitivity" min="0.001" max="0.01" step="0.001" value="0.005">
            </div>
            <div class="slider-container">
                <label>Text Background Blur</label>
                <input type="range" id="blurAmount" min="0" max="10" step="0.5" value="2">
            </div>
            <div class="slider-container">
                <label>Line Fade Start</label>
                <input type="range" id="lineFade" min="20" max="80" step="5" value="40">
            </div>
            <div class="slider-container">
                <label>Hover Scale Effect</label>
                <input type="range" id="hoverScale" min="1" max="1.5" step="0.05" value="1.1">
            </div>
            <div class="slider-container">
                <label>Size Difference (Front/Back)</label>
                <input type="range" id="sizeDepthEffect" min="0.2" max="2" step="0.1" value="0.5">
            </div>
            <div class="slider-container">
                <label>Base Size</label>
                <input type="range" id="baseSize" min="500" max="2000" step="100" value="1000">
            </div>
        `;
        this.container.appendChild(controls);
    }

    bindControls() {
        document.getElementById('rotationSpeed').addEventListener('input', (e) => {
            this.rotationSpeed = parseFloat(e.target.value);
        });
        
        document.getElementById('sphereRadius').addEventListener('input', (e) => {
            this.radius = parseFloat(e.target.value);
            this.updateWordPositions();
        });
        
        document.getElementById('mouseSensitivity').addEventListener('input', (e) => {
            this.mouseSensitivity = parseFloat(e.target.value);
        });
        
        document.getElementById('blurAmount').addEventListener('input', (e) => {
            this.blurAmount = parseFloat(e.target.value);
            this.updateBlurEffect();
        });
        
        document.getElementById('lineFade').addEventListener('input', (e) => {
            this.lineFadeStart = parseFloat(e.target.value);
            document.documentElement.style.setProperty('--fade-start', `${this.lineFadeStart}%`);
        });
        
        document.getElementById('hoverScale').addEventListener('input', (e) => {
            this.hoverScale = parseFloat(e.target.value);
        });
        
        document.getElementById('sizeDepthEffect').addEventListener('input', (e) => {
            this.sizeDepthEffect = parseFloat(e.target.value);
        });
        
        document.getElementById('baseSize').addEventListener('input', (e) => {
            this.baseSize = parseFloat(e.target.value);
        });
        
        const minimizeButton = document.getElementById('minimize-button');
        const controls = document.getElementById('controls');
        
        minimizeButton.addEventListener('click', () => {
            controls.classList.toggle('minimized');
            minimizeButton.textContent = controls.classList.contains('minimized') ? 'Maximize' : 'Minimize';
        });
    }

    updateWordPositions() {
        this.words.forEach((word, i) => {
            const phi = Math.acos(-1 + (2 * i) / this.words.length);
            const theta = Math.sqrt(this.words.length * Math.PI) * phi;
            
            const x = this.radius * Math.cos(theta) * Math.sin(phi);
            const y = this.radius * Math.sin(theta) * Math.sin(phi);
            const z = this.radius * Math.cos(phi);
            
            const el = this.wordElements[i];
            el.dataset.x = x;
            el.dataset.y = y;
            el.dataset.z = z;
        });
    }

    init() {
        document.documentElement.style.setProperty('--fade-start', '40%');
        document.documentElement.style.setProperty('--hover-scale', this.hoverScale);
        
        this.words.forEach((word, i) => {
            const phi = Math.acos(-1 + (2 * i) / this.words.length);
            const theta = Math.sqrt(this.words.length * Math.PI) * phi;
            
            const x = this.radius * Math.cos(theta) * Math.sin(phi);
            const y = this.radius * Math.sin(theta) * Math.sin(phi);
            const z = this.radius * Math.cos(phi);
            
            const el = document.createElement('div');
            el.className = 'word';
            el.textContent = word.text;
            el.style.fontSize = `${word.weight * 2 + 10}px`;
            
            el.dataset.x = x;
            el.dataset.y = y;
            el.dataset.z = z;
            el.dataset.index = i;
            
            this.container.appendChild(el);
            this.wordElements.push(el);
            
            el.addEventListener('mouseenter', () => this.handleWordHover(i));
            el.addEventListener('mouseleave', () => this.handleWordUnhover());
        });
    }

    // ... continue with the rest of the methods ...
}

// Export for global use
window.NewWordSphere = NewWordSphere;
