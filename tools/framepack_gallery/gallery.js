import { FRAME_STATES, validateFramepack } from './validator.mjs';

const FIXTURES = [
  { id: 'valid', label: 'Valid placeholder', manifest: 'fixtures/valid/framepack.json' },
  { id: 'slice-overflow', label: 'Invalid · slice overflow', manifest: 'fixtures/slice-overflow/framepack.json' },
  { id: 'bad-checksum', label: 'Invalid · bad checksum', manifest: 'fixtures/bad-checksum/framepack.json' },
  { id: 'missing-alpha', label: 'Invalid · missing alpha declaration', manifest: 'fixtures/missing-alpha/framepack.json' }
];

const TARGET_SIZES = [
  { width: 240, height: 120, label: 'Compact · 240 × 120' },
  { width: 360, height: 180, label: 'Card · 360 × 180' },
  { width: 640, height: 240, label: 'Panel · 640 × 240' }
];

const fixtureSelect = document.querySelector('#fixture-select');
const guideToggle = document.querySelector('#guide-toggle');
const validationHost = document.querySelector('#validation');
const galleryHost = document.querySelector('#gallery');
const manifestPath = document.querySelector('#manifest-path');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function selectedFixture() {
  return FIXTURES.find((fixture) => fixture.id === fixtureSelect.value) || FIXTURES[0];
}

async function loadManifest(fixture) {
  const manifestUrl = new URL(fixture.manifest, import.meta.url);
  const response = await fetch(manifestUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`manifest request failed: HTTP ${response.status}`);
  const manifest = await response.json();
  const report = await validateFramepack(manifest, {
    manifestUrl,
    async loadAsset(assetUrl) {
      const assetResponse = await fetch(assetUrl, { cache: 'no-store' });
      if (!assetResponse.ok) throw new Error(`HTTP ${assetResponse.status}`);
      return new Uint8Array(await assetResponse.arrayBuffer());
    }
  });
  return { manifest, manifestUrl, report };
}

function validationMarkup(fixture, report) {
  if (report.ok) {
    return `
      <div class="validation-summary validation-summary--pass">
        <span class="validation-mark" aria-hidden="true">✓</span>
        <div><strong>PASS · manifest and ${report.assets.length} state assets validated</strong>
        <p>Dimensions, slice bounds, content insets, alpha declarations, decoded alpha, and SHA-256 checksums agree.</p></div>
      </div>`;
  }
  return `
    <div class="validation-summary validation-summary--fail">
      <span class="validation-mark" aria-hidden="true">!</span>
      <div><strong>REJECTED · ${escapeHtml(fixture.label)}</strong>
      <p>${report.errors.length} deterministic validation ${report.errors.length === 1 ? 'failure' : 'failures'}.</p></div>
    </div>
    <ol class="error-list">${report.errors.map((error) => `<li><code>${escapeHtml(error.reason)}</code></li>`).join('')}</ol>`;
}

function guideMarkup(slice, contentInsets) {
  const [top, right, bottom, left] = slice;
  const [contentTop, contentRight, contentBottom, contentLeft] = contentInsets;
  return `
    <span class="slice-guide slice-guide--top" style="top:${top}px"></span>
    <span class="slice-guide slice-guide--right" style="right:${right}px"></span>
    <span class="slice-guide slice-guide--bottom" style="bottom:${bottom}px"></span>
    <span class="slice-guide slice-guide--left" style="left:${left}px"></span>
    <span class="content-guide" style="inset:${contentTop}px ${contentRight}px ${contentBottom}px ${contentLeft}px"></span>`;
}

function previewMarkup(component, stateName, assetRecord) {
  const [top, right, bottom, left] = component.slice;
  return TARGET_SIZES.map((target) => `
    <article class="target-card">
      <div class="target-meta"><strong>${escapeHtml(target.label)}</strong><span>source ${assetRecord.asset.width} × ${assetRecord.asset.height}</span></div>
      <div class="target-stage">
        <div class="frame-preview"
             data-component="${escapeHtml(component.id)}"
             data-state="${escapeHtml(stateName)}"
             data-source-file="${escapeHtml(assetRecord.asset.file)}"
             style="width:${target.width}px;aspect-ratio:${target.width}/${target.height};border-width:${top}px ${right}px ${bottom}px ${left}px;border-image-source:url('${escapeHtml(assetRecord.assetUrl)}');border-image-slice:${top} ${right} ${bottom} ${left};border-image-repeat:${escapeHtml(component.edgeMode)}">
          ${guideMarkup(component.slice, component.contentInsets)}
          <div class="frame-content"><span>Safe content region</span><small>${escapeHtml(stateName)}</small></div>
        </div>
      </div>
    </article>`).join('');
}

function galleryMarkup(manifest, report) {
  if (!report.ok) {
    return `<section class="empty-state"><span aria-hidden="true">◇</span><h2>Preview withheld</h2><p>Invalid assets are never rendered as if they passed. Correct the exact reasons above and reload this fixture.</p></section>`;
  }
  return manifest.components.map((component) => {
    const stateSections = FRAME_STATES.filter((stateName) => component.states[stateName]).map((stateName) => {
      const record = report.assets.find((asset) => asset.componentId === component.id && asset.stateName === stateName);
      return `
        <section class="state-row" data-state-row="${escapeHtml(stateName)}">
          <header class="state-header"><h3>${escapeHtml(stateName)}</h3><code>${escapeHtml(component.states[stateName].file)}</code></header>
          <div class="target-grid">${previewMarkup(component, stateName, record)}</div>
        </section>`;
    }).join('');
    return `
      <section class="component-section" data-component-section="${escapeHtml(component.id)}">
        <header class="component-header">
          <div><span>Component</span><h2>${escapeHtml(component.id)}</h2></div>
          <dl><div><dt>slice</dt><dd>${component.slice.join(' / ')}</dd></div><div><dt>content</dt><dd>${component.contentInsets.join(' / ')}</dd></div><div><dt>edge</dt><dd>${escapeHtml(component.edgeMode)}</dd></div></dl>
        </header>
        ${stateSections}
      </section>`;
  }).join('');
}

async function render() {
  const fixture = selectedFixture();
  document.body.dataset.fixture = fixture.id;
  document.body.classList.toggle('guides-off', !guideToggle.checked);
  manifestPath.textContent = fixture.manifest;
  validationHost.innerHTML = '<div class="loading">Validating manifest and bytes…</div>';
  galleryHost.innerHTML = '';
  try {
    const { manifest, report } = await loadManifest(fixture);
    validationHost.innerHTML = validationMarkup(fixture, report);
    galleryHost.innerHTML = galleryMarkup(manifest, report);
    validationHost.dataset.result = report.ok ? 'pass' : 'fail';
    validationHost.dataset.errorCodes = report.errors.map((error) => error.code).join(',');
    document.title = `${report.ok ? 'PASS' : 'REJECTED'} · Framepack Gallery`;
  } catch (error) {
    validationHost.dataset.result = 'fail';
    validationHost.innerHTML = validationMarkup(fixture, { ok: false, errors: [{ reason: `[gallery-load] gallery: ${error.message}` }] });
    galleryHost.innerHTML = galleryMarkup({}, { ok: false });
  }
}

for (const fixture of FIXTURES) {
  const option = document.createElement('option');
  option.value = fixture.id;
  option.textContent = fixture.label;
  fixtureSelect.append(option);
}

const requestedFixture = new URLSearchParams(location.search).get('fixture');
if (FIXTURES.some((fixture) => fixture.id === requestedFixture)) fixtureSelect.value = requestedFixture;

fixtureSelect.addEventListener('change', () => {
  const url = new URL(location.href);
  url.searchParams.set('fixture', fixtureSelect.value);
  history.replaceState(null, '', url);
  render();
});

guideToggle.addEventListener('change', () => {
  document.body.classList.toggle('guides-off', !guideToggle.checked);
});

render();
