(function (global) {
  'use strict';

  const FRAME_SELECTOR = '.wizard-frame';
  const STATE_ATTRIBUTE = 'data-wizard-frame-state';
  const STATES = Object.freeze(['default', 'hover', 'focus', 'active', 'disabled']);
  const PUBLIC_PROPERTIES = Object.freeze({
    image: '--wizard-frame-image',
    sliceTop: '--wizard-frame-slice-top',
    sliceRight: '--wizard-frame-slice-right',
    sliceBottom: '--wizard-frame-slice-bottom',
    sliceLeft: '--wizard-frame-slice-left',
    contentTop: '--wizard-frame-content-top',
    contentRight: '--wizard-frame-content-right',
    contentBottom: '--wizard-frame-content-bottom',
    contentLeft: '--wizard-frame-content-left',
    edgeRepeat: '--wizard-frame-edge-repeat',
    fill: '--wizard-frame-fill'
  });
  const signals = new WeakMap();
  let activeFrame = null;

  function isFrame(value) {
    return Boolean(value && value.matches && value.matches(FRAME_SELECTOR));
  }

  function frameFor(value) {
    if (!value) return null;
    if (isFrame(value)) return value;
    return value.closest ? value.closest(FRAME_SELECTOR) : null;
  }

  function isDisabled(frame) {
    return Boolean(frame.disabled || frame.getAttribute('aria-disabled') === 'true');
  }

  function stateSignals(frame) {
    if (!signals.has(frame)) {
      const initial = frame.getAttribute(STATE_ATTRIBUTE);
      signals.set(frame, {
        hover: initial === 'hover',
        focus: initial === 'focus',
        active: initial === 'active'
      });
    }
    return signals.get(frame);
  }

  function setState(frame, state) {
    if (!isFrame(frame)) throw new TypeError('VerdigrisFrames.setState requires a .wizard-frame element');
    if (!STATES.includes(state)) throw new TypeError(`invalid wizard frame state: ${state}`);
    frame.setAttribute(STATE_ATTRIBUTE, state);
    return state;
  }

  function synchronize(frame) {
    if (!isFrame(frame)) return null;
    const current = stateSignals(frame);
    const state = isDisabled(frame)
      ? 'disabled'
      : current.active
        ? 'active'
        : current.focus
          ? 'focus'
          : current.hover
            ? 'hover'
            : 'default';
    return setState(frame, state);
  }

  function setRasterDecoration(frame, values) {
    if (!isFrame(frame)) throw new TypeError('VerdigrisFrames.setRasterDecoration requires a .wizard-frame element');
    const source = values || {};
    for (const [key, property] of Object.entries(PUBLIC_PROPERTIES)) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      frame.style.setProperty(property, String(source[key]));
    }
    return frame;
  }

  function clearRasterDecoration(frame) {
    if (!isFrame(frame)) throw new TypeError('VerdigrisFrames.clearRasterDecoration requires a .wizard-frame element');
    for (const property of Object.values(PUBLIC_PROPERTIES)) frame.style.removeProperty(property);
    return frame;
  }

  function initialize(root) {
    const scope = root || global.document;
    if (!scope || !scope.querySelectorAll) return [];
    const frames = [];
    if (isFrame(scope)) frames.push(scope);
    frames.push(...scope.querySelectorAll(FRAME_SELECTOR));
    for (const frame of frames) synchronize(frame);
    return frames;
  }

  function updateSignal(event, key, value) {
    const frame = frameFor(event.target);
    if (!frame) return;
    if ((key === 'hover' || key === 'focus') && value === false && event.relatedTarget && frame.contains(event.relatedTarget)) return;
    stateSignals(frame)[key] = value;
    synchronize(frame);
  }

  function install() {
    const document = global.document;
    if (!document || document.__verdigrisFramesInstalled) return;
    document.__verdigrisFramesInstalled = true;
    document.addEventListener('pointerover', (event) => updateSignal(event, 'hover', true));
    document.addEventListener('pointerout', (event) => updateSignal(event, 'hover', false));
    document.addEventListener('pointerdown', (event) => {
      activeFrame = frameFor(event.target);
      if (activeFrame) updateSignal(event, 'active', true);
    });
    function releaseActiveFrame() {
      if (!activeFrame) return;
      stateSignals(activeFrame).active = false;
      synchronize(activeFrame);
      activeFrame = null;
    }
    document.addEventListener('pointerup', releaseActiveFrame);
    document.addEventListener('pointercancel', releaseActiveFrame);
    document.addEventListener('focusin', (event) => updateSignal(event, 'focus', true));
    document.addEventListener('focusout', (event) => updateSignal(event, 'focus', false));
    const observer = typeof global.MutationObserver === 'function'
      ? new global.MutationObserver((records) => {
          for (const record of records) {
            if (record.type === 'attributes') synchronize(record.target);
            for (const node of record.addedNodes || []) initialize(node);
          }
        })
      : null;
    if (observer) observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['disabled', 'aria-disabled'],
      childList: true,
      subtree: true
    });
    initialize(document);
  }

  const VerdigrisFrames = Object.freeze({
    STATES,
    PUBLIC_PROPERTIES,
    initialize,
    setState,
    synchronize,
    setRasterDecoration,
    clearRasterDecoration
  });

  global.VerdigrisFrames = VerdigrisFrames;
  if (typeof module !== 'undefined' && module.exports) module.exports = VerdigrisFrames;
  if (global.document) {
    if (global.document.readyState === 'loading') global.document.addEventListener('DOMContentLoaded', install, { once: true });
    else install();
  }
})(typeof window !== 'undefined' ? window : globalThis);
