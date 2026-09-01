/*
 * fk-tabs progressive enhancement — FRAMEKIT-WAVE-1 / FK-103
 * export init(root): wires aria-selected + [hidden] on click, and adds
 * ArrowLeft/ArrowRight roving focus on the tablist. Without this module the
 * component still renders and works via whatever wiring the host provides.
 */

/**
 * @param {HTMLElement} root — element with class .fk-tabs
 */
export function init(root) {
  const tabs = Array.from(root.querySelectorAll('.fk-tab'));
  if (tabs.length === 0) return;

  function select(tab) {
    for (const t of tabs) {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      const panel = document.getElementById(t.getAttribute('aria-controls') || '');
      if (panel) panel.hidden = !selected;
    }
    tab.focus();
  }

  root.querySelector('.fk-tabs-list').addEventListener('click', (e) => {
    const tab = e.target.closest('.fk-tab');
    if (tab) select(tab);
  });

  root.querySelector('.fk-tabs-list').addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    let next = null;
    if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (next) {
      e.preventDefault();
      select(next);
    }
  });
}
