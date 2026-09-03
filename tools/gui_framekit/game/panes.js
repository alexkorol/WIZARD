/* FrameKit game demo — independent left/right utility pane controller. */
(() => {
"use strict";

const FK = window.FK = window.FK || {};
const SIDES = ["left", "right"];
const SHORTCUTS = {
  c: ["left", "stats"],
  k: ["left", "stash"],
  t: ["left", "trade"],
  l: ["left", "codex"],
  f: ["left", "crafting"],
  b: ["left", "reliquary"],
  i: ["right", "inventory"],
  o: ["right", "cosmetics"],
};

const paneState = FK.paneState = { left: null, right: null };
const recentSides = [];
const returnFocus = { left: null, right: null };

const validSide = side => SIDES.includes(side) ? side : null;
const paneShell = side => document.getElementById(`${side}Pane`);
const paneViews = shell => shell ? Array.from(shell.querySelectorAll(".pane-view[data-pane]")) : [];
const launchers = () => Array.from(document.querySelectorAll(".pane-launch[data-side][data-pane]"));
const launcherFor = (side, name) => launchers().find(button =>
  button.dataset.side === side && button.dataset.pane === name);

function paneTitle(shell, view, side, name) {
  const launcher = launcherFor(side, name);
  const heading = view && view.querySelector("[data-pane-heading], .pane-heading, h1, h2, h3");
  return (view && view.dataset.title)
    || (launcher && launcher.dataset.title)
    || (launcher && launcher.getAttribute("aria-label"))
    || (launcher && launcher.textContent.trim())
    || (heading && heading.textContent.trim())
    || name;
}

function titleElement(shell, side) {
  if (!shell) return null;
  return shell.querySelector(`[data-pane-title], .pane-title, #${side}PaneTitle`);
}

function touchRecent(side) {
  const oldIndex = recentSides.indexOf(side);
  if (oldIndex >= 0) recentSides.splice(oldIndex, 1);
  recentSides.push(side);
}

function forgetRecent(side) {
  const index = recentSides.indexOf(side);
  if (index >= 0) recentSides.splice(index, 1);
}

function setFocus(element) {
  if (!element || typeof element.focus !== "function") return;
  try {
    element.focus({ preventScroll: true });
  } catch (_) {
    element.focus();
  }
}

function focusPaneHeading(side, name) {
  const shell = paneShell(side);
  const view = paneViews(shell).find(candidate => candidate.dataset.pane === name);
  if (!view) return;
  const heading = view.querySelector("[data-pane-heading], .pane-heading, h1, h2, h3")
    || titleElement(shell, side);
  if (!heading) return;
  if (!heading.matches("a[href], button, input, select, textarea, [tabindex]")) {
    heading.setAttribute("tabindex", "-1");
  }
  setFocus(heading);
}

function syncSide(side) {
  const shell = paneShell(side);
  const activeName = paneState[side];
  const views = paneViews(shell);
  const activeView = views.find(view => view.dataset.pane === activeName) || null;
  const isOpen = Boolean(shell && activeView);
  const name = isOpen ? activeName : null;

  if (activeName && !activeView) paneState[side] = null;
  if (shell) {
    shell.classList.toggle("active", isOpen);
    shell.classList.toggle("closed", !isOpen);
    shell.setAttribute("aria-hidden", String(!isOpen));
    shell.inert = !isOpen;
    if (name) shell.dataset.pane = name;
    else delete shell.dataset.pane;

    views.forEach(view => {
      const active = isOpen && view === activeView;
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", String(!active));
    });

    const title = name ? paneTitle(shell, activeView, side, name) : "";
    const titleEl = titleElement(shell, side);
    if (titleEl && title) titleEl.textContent = title;
    const visibleTitle = title || (titleEl && titleEl.textContent.trim()) || "";
    shell.querySelectorAll(".pane-close[data-side]").forEach(button => {
      if (button.dataset.side !== side) return;
      button.setAttribute("aria-label", visibleTitle ? `Close ${visibleTitle}` : "Close pane");
      button.title = visibleTitle ? `Close ${visibleTitle}` : "Close pane";
    });
  }

  launchers().forEach(button => {
    if (button.dataset.side !== side) return;
    const active = isOpen && button.dataset.pane === name;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-expanded", String(active));
  });

  const layer = document.getElementById("paneLayer");
  if (layer) {
    const anyOpen = SIDES.some(candidate => Boolean(paneState[candidate]));
    layer.classList.toggle("active", anyOpen);
    layer.classList.toggle(`${side}-open`, Boolean(paneState[side]));
  }

  return name;
}

function emitPane(side, pane, previousPane) {
  document.dispatchEvent(new CustomEvent("fk-pane", {
    detail: {
      side,
      pane,
      name: pane,
      previousPane,
      open: Boolean(pane),
      state: { left: paneState.left, right: paneState.right },
    },
  }));
}

FK.openPane = (side, name) => {
  side = validSide(side);
  if (!side || typeof name !== "string" || !name) return false;
  const shell = paneShell(side);
  if (!paneViews(shell).some(view => view.dataset.pane === name)) return false;

  const active = document.activeElement;
  if (active && active !== document.body && !active.closest?.(`#${side}Pane`)) {
    returnFocus[side] = active;
  }

  const previousPane = paneState[side];
  paneState[side] = name;
  touchRecent(side);
  syncSide(side);
  if (previousPane !== name) emitPane(side, name, previousPane);
  return true;
};

FK.closePane = side => {
  side = validSide(side);
  if (!side || !paneState[side]) return false;

  const previousPane = paneState[side];
  paneState[side] = null;
  forgetRecent(side);
  syncSide(side);
  emitPane(side, null, previousPane);
  const target = returnFocus[side]?.isConnected === false ? null : returnFocus[side];
  returnFocus[side] = null;
  setFocus(target || launcherFor(side, previousPane));
  return true;
};

FK.togglePane = (side, name) => {
  side = validSide(side);
  if (!side) return false;
  return paneState[side] === name ? FK.closePane(side) : FK.openPane(side, name);
};

function isTyping(target) {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
    || target.isContentEditable
    || Boolean(target.closest("[contenteditable]:not([contenteditable='false'])"));
}

function initialize() {
  SIDES.forEach(side => {
    const shell = paneShell(side);
    const activeView = paneViews(shell).find(view => view.classList.contains("active"));
    if (activeView) {
      paneState[side] = activeView.dataset.pane;
      touchRecent(side);
    }
    syncSide(side);
  });
}

document.addEventListener("click", event => {
  const launch = event.target.closest && event.target.closest(".pane-launch[data-side][data-pane]");
  if (launch) {
    FK.togglePane(launch.dataset.side, launch.dataset.pane);
    if (event.detail === 0 && paneState[launch.dataset.side] === launch.dataset.pane) {
      focusPaneHeading(launch.dataset.side, launch.dataset.pane);
    }
    return;
  }

  const close = event.target.closest && event.target.closest(".pane-close[data-side]");
  if (close) FK.closePane(close.dataset.side);
});

addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (document.getElementById("modalBackdrop")?.classList.contains("open") || FK.panel === "skills") {
      return;
    }
    const focusedSide = document.activeElement?.closest?.(".pane-shell[data-side]")?.dataset.side;
    const side = (validSide(focusedSide) && paneState[focusedSide] ? focusedSide : null)
      || recentSides.slice().reverse().find(candidate => paneState[candidate])
      || SIDES.slice().reverse().find(candidate => paneState[candidate]);
    if (side && (event.repeat || FK.closePane(side))) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    return;
  }

  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return;
  if (FK.scene === "menu" || FK.panel === "skills" || document.getElementById("modalBackdrop")?.classList.contains("open")) return;
  const shortcut = SHORTCUTS[event.key.toLowerCase()];
  if (!shortcut) return; // V deliberately falls through to the existing skills route.
  if (event.repeat && paneState[shortcut[0]] === shortcut[1]) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  if (FK.togglePane(shortcut[0], shortcut[1])) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (paneState[shortcut[0]] === shortcut[1]) focusPaneHeading(shortcut[0], shortcut[1]);
  }
}, true);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
})();
