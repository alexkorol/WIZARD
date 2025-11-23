# WordSphere

WordSphere is a lightweight DOM/CSS3D word globe. Words sit on a Fibonacci sphere and spin with momentum; you can drag to rotate or edit the word list live.

## Features

- 3D spherical arrangement of words
- Momentum-based rotation with natural damping
- Interactive mouse controls for rotation
- Hover effects with highlighting of connected terms
- Depth-based sizing and opacity
- Text background for improved readability
- Responsive design that works on different screen sizes

## Usage

Open `index.html`. Use the right-hand controls to:
- Edit the words (one per line) and click **Apply Words**.
- Adjust spin speed and radius.
- Toggle auto-spin and pause-on-hover.
- Randomize a sample set or reset the view.

## Technical Notes

- Pure DOM/CSS transforms (no React) with a Fibonacci sphere distribution.
- Momentum-based spin with damping; drag to steer, optional hover pause.
- Perspective scaling based on container size; responsive to resize.

## Customization & Integration

- Core logic lives in `main.js` as the `WordSphere` class. Instantiate with:
  ```js
  const sphere = new WordSphere(containerEl, { words: [{ text: 'Hello', weight: 1 }] });
  ```
- Methods: `setWords(words)`, `setAutoSpin(bool)`, `setHoverPause(bool)`, `setSpeed(multiplier)`, `setRadiusScale(scale)`.
- Styles are inlined in `index.html`; you can extract them into a shared stylesheet if embedding elsewhere.

## TODOs
- [ ] Touch gesture refinement (pinch to scale, swipe inertia tuning)
- [ ] Optional word grouping/color mapping
- [ ] Basic accessibility pass (focus/keyboard rotation controls)
