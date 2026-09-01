const body = document.body;
const viewport = document.getElementById('canvas-viewport');
const toastRegion = document.getElementById('toast-region');
const zoomOutput = document.getElementById('zoom-output');
const selectedName = document.getElementById('selected-name');
let zoom = 100;

body.classList.add('show-ornament');
viewport.dataset.viewport = 'desktop';

function toast(message, emphasis = '') {
  const element = document.createElement('div');
  element.className = 'workbench-toast';
  element.innerHTML = emphasis ? `<b>${emphasis}</b> ${message}` : message;
  toastRegion.append(element);
  window.setTimeout(() => element.remove(), 2200);
}

function updateZoom(next) {
  zoom = Math.max(70, Math.min(125, next));
  zoomOutput.value = `${zoom}%`;
  document.documentElement.style.setProperty('--preview-scale', String(zoom / 100));
}

document.querySelectorAll('[data-zoom]').forEach((button) => {
  button.addEventListener('click', () => updateZoom(zoom + (button.dataset.zoom === 'in' ? 5 : -5)));
});

document.getElementById('viewport-select').addEventListener('change', (event) => {
  viewport.dataset.viewport = event.currentTarget.value;
  toast(`${event.currentTarget.selectedOptions[0].text} preview selected.`);
});

document.getElementById('guides-button').addEventListener('click', (event) => {
  const active = !body.classList.contains('show-guides');
  body.classList.toggle('show-guides', active);
  event.currentTarget.setAttribute('aria-pressed', String(active));
});

document.getElementById('reset-button').addEventListener('click', () => {
  body.dataset.accent = 'verdigris';
  body.dataset.density = 'compact';
  body.className = 'show-ornament';
  document.getElementById('accent-select').value = 'verdigris';
  document.getElementById('density-select').value = 'compact';
  document.getElementById('scale-input').value = '100';
  document.getElementById('scale-output').value = '100%';
  document.getElementById('ornament-toggle').checked = true;
  document.getElementById('guides-button').setAttribute('aria-pressed', 'false');
  updateZoom(100);
  toast('Preview settings restored.', 'Reset.');
});

document.getElementById('accent-select').addEventListener('change', (event) => { body.dataset.accent = event.currentTarget.value; });
document.getElementById('density-select').addEventListener('change', (event) => { body.dataset.density = event.currentTarget.value; });
document.getElementById('scale-input').addEventListener('input', (event) => {
  const value = event.currentTarget.value;
  document.getElementById('scale-output').value = `${value}%`;
  updateZoom(Number(value));
});
document.getElementById('ornament-toggle').addEventListener('change', (event) => body.classList.toggle('show-ornament', event.currentTarget.checked));

document.getElementById('collapse-library').addEventListener('click', () => body.classList.toggle('library-collapsed'));

document.querySelectorAll('.group-heading').forEach((heading) => {
  heading.addEventListener('click', () => {
    const list = heading.nextElementSibling;
    const expanded = heading.getAttribute('aria-expanded') === 'true';
    heading.setAttribute('aria-expanded', String(!expanded));
    list.hidden = expanded;
  });
});

const componentButtons = [...document.querySelectorAll('[data-component]')];
document.getElementById('component-search').addEventListener('input', (event) => {
  const query = event.currentTarget.value.trim().toLowerCase();
  componentButtons.forEach((button) => { button.hidden = Boolean(query) && !button.textContent.toLowerCase().includes(query); });
});
componentButtons.forEach((button) => {
  button.addEventListener('click', () => {
    componentButtons.forEach((candidate) => candidate.classList.toggle('is-selected', candidate === button));
    document.getElementById('selected-component').textContent = button.dataset.component;
  });
});

document.querySelectorAll('#inventory-grid [data-item], .equip-slot[data-item]').forEach((slot) => {
  slot.addEventListener('click', () => {
    document.querySelectorAll('#inventory-grid .raster-slot').forEach((candidate) => candidate.classList.remove('is-selected'));
    if (slot.classList.contains('raster-slot')) slot.classList.add('is-selected');
    selectedName.textContent = slot.dataset.item;
  });
});

document.getElementById('sort-button').addEventListener('click', () => toast('Pack order updated.', 'Sorted.'));
document.getElementById('equip-button').addEventListener('click', () => toast(`${selectedName.textContent} moved to equipment.`, 'Equipped.'));

document.querySelectorAll('[data-state]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-state]').forEach((candidate) => candidate.classList.toggle('is-active', candidate === button));
    body.classList.remove('state-combat', 'state-damaged', 'state-locked');
    if (button.dataset.state !== 'default') body.classList.add(`state-${button.dataset.state}`);
  });
});

const atlasDialog = document.getElementById('atlas-dialog');
const atlasDetail = document.getElementById('atlas-detail');
const atlasGrid = atlasDialog.querySelector('.atlas-grid');
document.querySelectorAll('[data-open-atlas], [data-view="assets"]').forEach((button) => button.addEventListener('click', () => atlasDialog.showModal()));
document.getElementById('close-atlas').addEventListener('click', () => atlasDialog.close());
atlasDialog.addEventListener('click', (event) => { if (event.target === atlasDialog) atlasDialog.close(); });
document.querySelectorAll('[data-concept]').forEach((button) => {
  button.addEventListener('click', () => {
    const image = document.getElementById('atlas-detail-image');
    image.src = button.dataset.concept;
    image.alt = button.querySelector('img').alt;
    atlasGrid.hidden = true;
    atlasDetail.hidden = false;
  });
});
document.getElementById('close-detail').addEventListener('click', () => { atlasGrid.hidden = false; atlasDetail.hidden = true; });
document.querySelector('[data-open-orbs]').addEventListener('click', () => window.open('../wizard_orbs/', '_blank', 'noopener'));

document.querySelectorAll('.topnav [data-view]').forEach((button) => {
  if (button.dataset.view === 'assets') return;
  button.addEventListener('click', () => {
    document.querySelectorAll('.topnav [data-view]').forEach((candidate) => candidate.classList.toggle('is-active', candidate === button));
    if (button.dataset.view === 'components') document.getElementById('component-search').focus();
  });
});
