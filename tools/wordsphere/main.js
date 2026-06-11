class WordSphere {
  constructor(container, options = {}) {
    this.container = container;
    this.words = options.words || [];
    this.radiusScale = options.radiusScale || 1;
    this.autoSpin = options.autoSpin ?? true;
    this.hoverPause = options.hoverPause ?? true;
    this.momentum = { x: 0, y: 0.45 };
    this.rotation = { x: 0, y: 0 };
    this.isPointerDown = false;
    this.wordElements = [];
    this.perspectiveScale = options.perspectiveScale || 1.2;

    this.updateMetrics();
    this.initWords();
    this.bindEvents();
    this.animate();
  }

  updateMetrics() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width || 1;
    this.height = rect.height || 1;
    this.center = { x: this.width / 2, y: this.height / 2 };
    this.radius = Math.min(this.width, this.height) / 2.2 * this.radiusScale;
  }

  fibonacciPosition(i, n) {
    if (n <= 1) return { x: 0, y: 0, z: 0 };
    const phi = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / (n - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    return { x, y, z };
  }

  initWords() {
    this.container.innerHTML = "";
    this.wordElements = [];
    this.words.forEach((word, i) => {
      const el = document.createElement("div");
      el.className = "word";
      el.textContent = word.text;
      el.style.fontSize = `${Math.max(12, 10 + (word.weight || 1) * 1.6)}px`;
      const pos = this.fibonacciPosition(i, this.words.length);
      el.dataset.x = pos.x * this.radius;
      el.dataset.y = pos.y * this.radius;
      el.dataset.z = pos.z * this.radius;
      this.container.appendChild(el);
      this.wordElements.push(el);
    });
  }

  setWords(words) {
    this.words = words;
    this.initWords();
  }

  setAutoSpin(value) {
    this.autoSpin = value;
  }

  setHoverPause(value) {
    this.hoverPause = value;
    if (!value) this.isHovering = false;
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  setRadiusScale(scale) {
    this.radiusScale = scale;
    this.updateMetrics();
    this.wordElements.forEach((el, i) => {
      const pos = this.fibonacciPosition(i, this.words.length);
      el.dataset.x = pos.x * this.radius;
      el.dataset.y = pos.y * this.radius;
      el.dataset.z = pos.z * this.radius;
    });
  }

  bindEvents() {
    this.handleResize = () => {
      this.updateMetrics();
      this.wordElements.forEach((el, i) => {
        const pos = this.fibonacciPosition(i, this.words.length);
        el.dataset.x = pos.x * this.radius;
        el.dataset.y = pos.y * this.radius;
        el.dataset.z = pos.z * this.radius;
      });
    };
    window.addEventListener("resize", this.handleResize);

    this.container.addEventListener("pointerdown", (e) => {
      this.isPointerDown = true;
      this.pointer = { x: e.clientX, y: e.clientY };
      this.momentum = { x: 0, y: 0 };
    });
    window.addEventListener("pointermove", (e) => {
      if (!this.isPointerDown) return;
      const dx = e.clientX - this.pointer.x;
      const dy = e.clientY - this.pointer.y;
      this.rotation.y += dx * 0.006;
      this.rotation.x += dy * 0.006;
      this.momentum = { x: dy * 0.001, y: dx * 0.001 };
      this.pointer = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener("pointerup", () => { this.isPointerDown = false; });
    this.container.addEventListener("pointerenter", () => { if (this.hoverPause) this.isHovering = true; });
    this.container.addEventListener("pointerleave", () => { this.isHovering = false; });
  }

  rotateAndProject(el) {
    const x = parseFloat(el.dataset.x);
    const y = parseFloat(el.dataset.y);
    const z = parseFloat(el.dataset.z);

    const cosY = Math.cos(this.rotation.y);
    const sinY = Math.sin(this.rotation.y);
    const rotX = x * cosY - z * sinY;
    const rotZ = z * cosY + x * sinY;

    const cosX = Math.cos(this.rotation.x);
    const sinX = Math.sin(this.rotation.x);
    const rotY = y * cosX - rotZ * sinX;
    const finalZ = rotZ * cosX + y * sinX;

    const perspective = Math.max(this.width, this.height) * this.perspectiveScale;
    const scale = perspective / (perspective + finalZ);
    const tx = rotX * scale + this.center.x;
    const ty = rotY * scale + this.center.y;

    el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    el.style.opacity = Math.max(0.1, (finalZ + this.radius) / (this.radius * 2));
    el.style.zIndex = Math.round(finalZ + 999);
  }

  animate() {
    if (this.autoSpin && !this.isPointerDown && !this.isHovering) {
      this.momentum.x *= 0.96;
      this.momentum.y *= 0.96;
      this.rotation.x += (this.momentum.x || 0) * (this.speedMultiplier || 1);
      this.rotation.y += (this.momentum.y || 0.45) * 0.01 * (this.speedMultiplier || 1);
    }
    this.wordElements.forEach((el) => this.rotateAndProject(el));
    this.frame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener("resize", this.handleResize);
    this.container.innerHTML = "";
  }
}

const sampleWords = [
  "Arcane","Vector","Sphere","Wizard","Geometry","Shader","API","Design","Render","Canvas",
  "Vertex","Edge","Path","Node","Pixel","Gravity","Light","Audio","Cloud","Graph","Atlas",
  "Neon","Fusion","Nova","Pulse","Orbit","Signal","Matrix","Rune","Magnet","Glyph","Plasma",
  "Pattern","Color","Echo","Bend","Fold","Ripple","Quantum","Logic","Flow","Spark","Weave"
];

const container = document.getElementById("sphere-container");
const wordsInput = document.getElementById("words");
const speedInput = document.getElementById("speed");
const radiusInput = document.getElementById("radius");
const autoSpinInput = document.getElementById("autospin");
const hoverPauseInput = document.getElementById("hoverpause");
const speedValue = document.getElementById("speedValue");
const radiusValue = document.getElementById("radiusValue");

const buildWords = (text) => {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return sampleWords.map((t) => ({ text: t, weight: 1 }));
  const maxLen = Math.max(...lines.map((l) => l.length || 1));
  return lines.map((t) => ({ text: t, weight: (t.length / maxLen) * 5 + 1 }));
};

wordsInput.value = sampleWords.join("\n");
let sphere = new WordSphere(container, { words: buildWords(wordsInput.value) });
speedValue.textContent = parseFloat(speedInput.value).toFixed(2);
radiusValue.textContent = parseFloat(radiusInput.value).toFixed(2);

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  autoSpinInput.checked = false;
  sphere.setAutoSpin(false);
}

document.getElementById("apply").addEventListener("click", () => {
  sphere.setWords(buildWords(wordsInput.value));
});

document.getElementById("random").addEventListener("click", () => {
  const shuffled = [...sampleWords].sort(() => Math.random() - 0.5);
  wordsInput.value = shuffled.slice(0, 28).join("\n");
  sphere.setWords(buildWords(wordsInput.value));
});

document.getElementById("reset").addEventListener("click", () => {
  sphere.rotation = { x: 0, y: 0 };
  sphere.momentum = { x: 0, y: 0.45 };
  sphere.setRadiusScale(1);
  radiusInput.value = 1;
  radiusValue.textContent = "1.00";
});

speedInput.addEventListener("input", (e) => {
  const v = parseFloat(e.target.value);
  speedValue.textContent = v.toFixed(2);
  sphere.setSpeed(v);
});

radiusInput.addEventListener("input", (e) => {
  const v = parseFloat(e.target.value);
  radiusValue.textContent = v.toFixed(2);
  sphere.setRadiusScale(v);
});

autoSpinInput.addEventListener("change", (e) => sphere.setAutoSpin(e.target.checked));
hoverPauseInput.addEventListener("change", (e) => sphere.setHoverPause(e.target.checked));
