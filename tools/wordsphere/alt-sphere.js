class WordSphere {
    constructor(container, words) {
        this.container = container;
        this.words = words;
        this.container.style.position = 'relative';

        this.updateMetrics = () => {
            const rect = this.container.getBoundingClientRect();
            this.radius = Math.min(rect.width, rect.height) / 2.2;
            this.centerX = rect.width / 2;
            this.centerY = rect.height / 2;
            this.containerRect = rect;
        };

        this.updateMetrics();
        this.rotationX = 0;
        this.rotationY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;
        this.wordElements = [];
        this.momentum = { x: 0, y: 0.1 };
        this.lastTime = Date.now();

        // Add resize handler
        this.handleResize = () => {
            this.updateMetrics();
            this.updatePositions();
        };
        window.addEventListener('resize', this.handleResize);
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    updatePositions() {
        // Recalculate positions for all words
        const phi = Math.PI * (3 - Math.sqrt(5));
        
        this.wordElements.forEach((el, i) => {
            const y = 1 - (i / (this.words.length - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;
            
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            
            el.dataset.x = x * this.radius;
            el.dataset.y = y * this.radius;
            el.dataset.z = z * this.radius;
        });
    }
    
    init() {
        // Calculate positions using fibonacci sphere distribution
        const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
        
        this.words.forEach((word, i) => {
            const y = 1 - (i / (this.words.length - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;
            
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            
            const el = document.createElement('div');
            el.className = 'word';
            el.textContent = word.text;
            el.style.fontSize = `${Math.max(12, word.weight * 1.5 + 10)}px`;
            
            // Store the 3D position
            el.dataset.x = x * this.radius;
            el.dataset.y = y * this.radius;
            el.dataset.z = z * this.radius;
            
            this.container.appendChild(el);
            this.wordElements.push(el);
        });
    }
    
    destroy() {
        this.wordElements.forEach(el => el.remove());
        this.wordElements = [];
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        // Remove event listeners
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('resize', this.handleResize);
    }
    
    bindEvents() {
        this.handleMouseDown = (e) => {
            this.isMouseDown = true;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.momentum = { x: 0, y: 0 };
        };
        
        this.handleMouseMove = (e) => {
            if (this.isMouseDown) {
                const deltaX = e.clientX - this.mouseX;
                const deltaY = e.clientY - this.mouseY;
                
                this.rotationY += deltaX * 0.005;
                this.rotationX += deltaY * 0.005;
                
                const currentTime = Date.now();
                const dt = (currentTime - this.lastTime) / 1000;
                
                this.momentum = {
                    x: deltaY * 0.001,
                    y: deltaX * 0.001
                };
                
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.lastTime = currentTime;
            }
        };
        
        this.handleMouseUp = () => {
            this.isMouseDown = false;
        };

        document.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }
    
    animate() {
        if (!this.isMouseDown) {
            const currentTime = Date.now();
            const dt = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;

            // Apply momentum with damping
            const damping = 0.95;
            this.momentum.x *= damping;
            this.momentum.y *= damping;

            this.rotationX += this.momentum.x;
            this.rotationY += this.momentum.y;
        }
        
        const perspective = Math.max(
            this.containerRect?.width || window.innerWidth,
            this.containerRect?.height || window.innerHeight
        ) * 1.2;

        this.wordElements.forEach(el => {
            const x = parseFloat(el.dataset.x);
            const y = parseFloat(el.dataset.y);
            const z = parseFloat(el.dataset.z);
            
            // Rotate around Y axis
            const cosY = Math.cos(this.rotationY);
            const sinY = Math.sin(this.rotationY);
            const rotatedX = x * cosY - z * sinY;
            const rotatedZ = z * cosY + x * sinY;
            
            // Rotate around X axis
            const cosX = Math.cos(this.rotationX);
            const sinX = Math.sin(this.rotationX);
            const rotatedY = y * cosX - rotatedZ * sinX;
            const finalZ = rotatedZ * cosX + y * sinX;
            
            // Apply perspective
            const scale = perspective / (perspective + finalZ);
            const translateX = rotatedX * scale;
            const translateY = rotatedY * scale;
            
            // Update element style with centered position
            el.style.transform = `translate(${translateX + this.centerX}px, ${translateY + this.centerY}px) scale(${scale})`;
            el.style.opacity = Math.max(0.1, (finalZ + this.radius) / (this.radius * 2));
            el.style.zIndex = Math.round(finalZ);
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}