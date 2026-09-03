/* FrameKit game demo — core: stage, screens, tooltip, HUD, settings.
   All visuals are cropped generated art; JS only places and animates it. */
(() => {
"use strict";

const $ = (s, el) => (el || document).querySelector(s);
const px = n => n + "px";
const stage = $("#stage");

const FK = window.FK = Object.assign(window.FK || {}, {
  $, px, stage,
  gold: 1248, shards: 1200,
  settings: { music: true, motes: true, keybinds: true, quality: 2 },
});

/* ---------------------------------------------------------- stage scale */
let scale = 1;
function fit() {
  scale = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
  stage.style.setProperty("--ui-inverse-scale", (1 / scale).toFixed(4));
}
addEventListener("resize", fit); fit();
FK.stagePoint = (ev) => {
  const r = stage.getBoundingClientRect();
  return { x: (ev.clientX - r.left) / scale, y: (ev.clientY - r.top) / scale };
};

/* ------------------------------------------ scene + workspace router */
const scenes = { menu: $("#menuScreen"), world: $("#worldScreen") };
const paneLayer = $("#paneLayer");
const skillScreen = $("#skillScreen");
const skillBtn = $("#skillBtn");
const workspaceBackground = Array.from(stage.children).filter(el => el !== skillScreen && el.id !== "modalBackdrop");
FK.scene = "menu";
FK.panel = null;

FK.setScene = (name) => {
  FK.scene = name;
  scenes.menu.classList.toggle("active", name === "menu");
  scenes.world.classList.toggle("active", name !== "menu");
  $("#topbar").classList.toggle("hidden", name === "menu");
  $("#hud").classList.toggle("hidden", name === "menu");
  paneLayer.classList.toggle("scene-hidden", name === "menu");
  paneLayer.setAttribute("aria-hidden", String(name === "menu" || FK.panel === "skills"));
  if (name === "menu" && FK.panel === "skills") FK.setPanel("skills");
  document.dispatchEvent(new CustomEvent("fk-scene", { detail: name }));
};
FK.setPanel = (name) => {
  const left = new Set(["stats", "stash", "trade", "codex", "crafting", "reliquary"]);
  const right = new Set(["inventory", "cosmetics"]);
  if (name === "character") {
    const openedLeft = FK.openPane?.("left", "stats") || false;
    const openedRight = FK.openPane?.("right", "inventory") || false;
    return openedLeft || openedRight;
  }
  const aliases = { shop: "reliquary" };
  name = aliases[name] || name;
  if (left.has(name)) return FK.togglePane?.("left", name) || false;
  if (right.has(name)) return FK.togglePane?.("right", name) || false;
  if (name !== "skills") return false;

  FK.panel = FK.panel === "skills" ? null : "skills";
  const open = FK.panel === "skills";
  skillScreen.classList.toggle("active", open);
  skillScreen.setAttribute("aria-hidden", String(!open));
  paneLayer.classList.toggle("workspace-hidden", open);
  paneLayer.setAttribute("aria-hidden", String(open || FK.scene === "menu"));
  skillBtn.classList.toggle("active", open);
  skillBtn.setAttribute("aria-expanded", String(open));
  workspaceBackground.forEach(el => { el.inert = open; });
  if (open) {
    requestAnimationFrame(() => (skillScreen.querySelector(".tnode.on") || skillScreen.querySelector(".tnode"))?.focus({ preventScroll: true }));
  } else {
    skillBtn.focus({ preventScroll: true });
  }
  FK.hideTip();
  document.dispatchEvent(new CustomEvent("fk-workspace", { detail: { name: FK.panel, open } }));
  return true;
};
skillBtn.addEventListener("click", () => FK.setPanel("skills"));

FK.setGold = (v) => {
  FK.gold = v;
  $("#goldAmount").textContent = v.toLocaleString("en-US");
};
FK.setShards = (v) => {
  FK.shards = v;
  $("#shardAmount").textContent = v.toLocaleString("en-US");
};

/* ------------------------------------------------------------- tooltip */
const tip = $("#tooltip");
FK.showTip = (item, label, pt) => {
  const hint = item && item.hint ? item.hint : "";
  tip.innerHTML = item ? `
    <div class="tname rar-${item.rarity || "common"}">${item.name}</div>
    <div class="ttype">${item.type || ""}</div>
    ${(item.stats || []).map(s => `<div class="tstat">${s}</div>`).join("")}
    ${item.price != null ? `<div class="tprice">${item.price} gold</div>` : ""}
    ${item.flavor ? `<div class="tflavor">${item.flavor}</div>` : ""}
    ${hint ? `<div class="thint">${hint}</div>` : ""}`
    : `<div class="tname">${label}</div>`;
  tip.style.display = "block";
  const w = 292, h = tip.offsetHeight || 120;
  tip.style.left = px(Math.min(pt.x + 26, 1920 - w - 10));
  tip.style.top = px(Math.max(10, Math.min(pt.y - h / 2, 1080 - h - 10)));
};
FK.hideTip = () => { tip.style.display = "none"; };

/* -------------------------------------------------------------- notices */
const toast = $("#toast");
let toastTimer = 0;
FK.notify = (message, tone = "") => {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = tone;
  requestAnimationFrame(() => toast.classList.add("show"));
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
};

/* --------------------------------------------------------- float text */
FK.floatText = (text, color, host) => {
  const f = document.createElement("span");
  f.className = "floater";
  f.textContent = text;
  f.style.color = color;
  (typeof host === "string" ? $(host) : host || $("#orbMana")).appendChild(f);
  setTimeout(() => f.remove(), 1100);
};

/* --------------------------------------------------------------- orbs */
/* orb geometry inside the chrome clusters (source px, cluster 800x811):
   left center (513,326) r252 · right center (282,328) r252.
   Art liquid surface sits ~38% down the sphere. */
const ORB = { surface: 36, range: 64 };
FK.vitals = {
  hp: { cur: 812, max: 900 },
  mp: { cur: 364, max: 540 },
};
function orbEls(id) {
  const c = $(id);
  return { fill: c.querySelector(".orbFill"), num: c.querySelector(".orbNum") };
}
const orbHp = orbEls("#orbHealth"), orbMp = orbEls("#orbMana");
FK.drawVitals = () => {
  const draw = (o, v) => {
    const f = Math.max(0, Math.min(1, v.cur / v.max));
    o.fill.style.clipPath = `inset(${(ORB.surface + (1 - f) * ORB.range).toFixed(1)}% 0 0 0)`;
    o.num.textContent = Math.round(v.cur);
  };
  draw(orbHp, FK.vitals.hp);
  draw(orbMp, FK.vitals.mp);
  $("#orbHealth").classList.toggle("low", FK.vitals.hp.cur / FK.vitals.hp.max < 0.3);
};
FK.drawVitals();
setInterval(() => {
  const v = FK.vitals;
  v.hp.cur = Math.min(v.hp.max, v.hp.cur + 0.7);
  v.mp.cur = Math.min(v.mp.max, v.mp.cur + 1.5);
  FK.drawVitals();
}, 250);
FK.damagePlayer = (n) => {
  FK.vitals.hp.cur = Math.max(0, FK.vitals.hp.cur - n);
  FK.floatText(`−${n}`, "#e88a76", "#orbHealth");
  FK.drawVitals();
};
FK.spendMana = (n) => {
  if (FK.vitals.mp.cur < n) return false;
  FK.vitals.mp.cur -= n;
  FK.floatText(`−${n}`, "#c9b3ef", "#orbMana");
  FK.drawVitals();
  return true;
};

["#orbHealth", "#orbMana"].forEach((id, i) => {
  $(id).addEventListener("pointerenter", ev => {
    const v = i ? FK.vitals.mp : FK.vitals.hp;
    FK.showTip(null, `${i ? "Mana" : "Life"} · ${Math.round(v.cur)} / ${v.max}`, FK.stagePoint(ev));
  });
  $(id).addEventListener("pointerleave", FK.hideTip);
});

/* ------------------------------------------------------------ abilities */
const ABILITIES = [
  ["med_sun", "Radiance", 42, 9, "A wave of noon. Burns what hides."],
  ["med_star", "Guiding Star", 18, 4, "Mark a foe. The web remembers."],
  ["tri_bolt", "Storm Call", 55, 12, "The archive's copper roof earns its keep."],
  ["tri_fire", "Ember Line", 35, 7, "Draw a line. Dare them."],
  ["med_shield", "Aegis", 25, 14, "A shield of borrowed marble."],
  ["med_hourglass", "Still Hour", 70, 30, "Stop everything. Keep walking."],
  ["chev_double", "March", 15, 6, "Faster. The lamps are going out."],
  ["med_snake", "Coil", 30, 10, "Patience with teeth."],
  ["laurel_sun", "Triumph", 50, 20, "For a moment, you have already won."],
  ["med_key", "Open", 10, 3, "Most doors. Some arguments."],
];
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
FK.abils = [];
FK.cast = (a) => {
  const now = performance.now();
  if (now < a.until) return false;
  if (!FK.spendMana(a.cost)) {
    a.el.classList.add("oom");
    setTimeout(() => a.el.classList.remove("oom"), 350);
    return false;
  }
  a.until = now + a.cd * 1000;
  const tick = () => {
    const left = a.until - performance.now();
    if (left <= 0) { a.cdEl.style.background = "none"; return; }
    const deg = 360 * (left / (a.cd * 1000));
    a.cdEl.style.background = `conic-gradient(rgba(8,6,4,.78) ${deg}deg, transparent ${deg}deg)`;
    requestAnimationFrame(tick);
  };
  tick();
  return true;
};

fetch("assets/layout.json").then(r => r.json()).then(L => {
  FK.layout = L;
  const rackEl = $("#rackSlots");
  L.rackWells.forEach((wl, i) => {
    if (i >= ABILITIES.length) return;
    const [icon, name, cost, cd, desc] = ABILITIES[i];
    const el = document.createElement("div");
    el.className = "abil";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `${name}, ${cost} mana, ${cd} second cooldown`);
    el.setAttribute("aria-keyshortcuts", KEYS[i]);
    /* rack_slim = rack_large cropped 50px from the top */
    const sourceTop = wl.y - 50;
    /* Compensate for #rackSlots' 0.9038 source-art scale: 49 logical px
       resolves to a minimum 44 CSS px hit target at every stage size. */
    const hitSize = "calc(49px * var(--ui-inverse-scale, 1))";
    el.style.setProperty("--well-w", px(wl.w));
    el.style.setProperty("--well-h", px(wl.h));
    Object.assign(el.style, {
      left: `calc(${wl.x}px - (max(${wl.w}px, ${hitSize}) - ${wl.w}px) / 2)`,
      top: `calc(${sourceTop}px - (max(${wl.h}px, ${hitSize}) - ${wl.h}px) / 2)`,
      width: `max(${wl.w}px, ${hitSize})`,
      height: `max(${wl.h}px, ${hitSize})`,
    });
    el.innerHTML = `<img src="assets/${icon}.png"><div class="cd"></div><span class="key">${KEYS[i]}</span>`;
    const a = { el, name, cost, cd, cdEl: el.querySelector(".cd"), until: 0 };
    el.addEventListener("click", () => FK.cast(a));
    el.addEventListener("keydown", ev => {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); FK.cast(a); }
    });
    el.addEventListener("pointerenter", ev => FK.showTip(
      { name, rarity: "legendary", type: `Ability · ${cost} mana · ${cd}s cooldown`, stats: [], flavor: desc },
      name, FK.stagePoint(ev)));
    el.addEventListener("pointerleave", FK.hideTip);
    FK.abils.push(a);
    rackEl.appendChild(el);
  });
  updateKeybinds();
  document.dispatchEvent(new CustomEvent("fk-layout"));
});

addEventListener("keydown", ev => {
  const target = ev.target;
  const typing = target instanceof Element && (
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
    || target.isContentEditable
    || target.closest("[contenteditable]:not([contenteditable='false'])")
  );
  if (ev.key === "Escape") {
    if (backdrop.classList.contains("open")) {
      ev.preventDefault();
      FK.closeSettings();
    } else if (FK.panel === "skills") {
      ev.preventDefault();
      FK.setPanel("skills");
    }
    return;
  }
  if (typing || ev.ctrlKey || ev.metaKey || ev.altKey || ev.defaultPrevented) return;
  if (FK.scene === "menu" || backdrop.classList.contains("open")) return;

  const i = KEYS.indexOf(ev.key);
  if (i >= 0 && FK.abils[i] && FK.panel !== "skills") FK.cast(FK.abils[i]);
  const k = ev.key.toLowerCase();
  if (k === "v") FK.setPanel("skills");
});

/* --------------------------------------------------------------- buffs */
const BUFFS = [
  ["buff_sq_gold", "chev_double", "March Order", "12m"],
  ["buff_sq_teal", "tri_bolt", "Storm Ward", ""],
  ["buff_sq_red", "tri_fire", "Ember Ward", "42s"],
];
const buffsEl = $("#buffs");
BUFFS.forEach(([frame, glyph, name, t]) => {
  const b = document.createElement("div");
  b.className = "buff";
  b.innerHTML = `<img class="frame" src="assets/${frame}.png"><img class="glyph" src="assets/${glyph}.png">${t ? `<span class="t">${t}</span>` : ""}`;
  b.addEventListener("pointerenter", ev =>
    FK.showTip({ name, rarity: "uncommon", type: "Active effect", stats: [] }, name, FK.stagePoint(ev)));
  b.addEventListener("pointerleave", FK.hideTip);
  buffsEl.appendChild(b);
});

/* ------------------------------------------------------------------ xp */
$("#xpFill").style.width = px(Math.round((760 - 150) * 0.62));
$("#xpbar").addEventListener("pointerenter", ev =>
  FK.showTip(null, "Level 47 · 4,180 / 6,700 XP", FK.stagePoint(ev)));
$("#xpbar").addEventListener("pointerleave", FK.hideTip);

/* ------------------------------------------------------------ settings */
const QUALITIES = ["Low", "Medium", "High"];
const backdrop = $("#modalBackdrop");
const modal = $("#modal");
let settingsReturnFocus = null;
let modalInerted = [];
FK.openSettings = () => {
  if (backdrop.classList.contains("open")) return;
  settingsReturnFocus = document.activeElement;
  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  modalInerted = Array.from(stage.children).filter(el => el !== backdrop && !el.inert);
  modalInerted.forEach(el => { el.inert = true; });
  requestAnimationFrame(() => $("#closeBtn").focus({ preventScroll: true }));
};
FK.closeSettings = () => {
  if (!backdrop.classList.contains("open")) return;
  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
  modalInerted.forEach(el => { el.inert = false; });
  modalInerted = [];
  if (settingsReturnFocus && document.contains(settingsReturnFocus)) {
    settingsReturnFocus.focus({ preventScroll: true });
  }
  settingsReturnFocus = null;
};
$("#settingsBtn").addEventListener("click", FK.openSettings);
$("#closeBtn").addEventListener("click", FK.closeSettings);
$("#applyBtn").addEventListener("click", FK.closeSettings);
backdrop.addEventListener("click", ev => { if (ev.target === backdrop) FK.closeSettings(); });
modal.addEventListener("keydown", ev => {
  if (ev.key !== "Tab") return;
  const focusable = Array.from(modal.querySelectorAll(
    "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
  )).filter(el => el.offsetParent !== null);
  if (!focusable.length) { ev.preventDefault(); modal.focus(); return; }
  const first = focusable[0], last = focusable.at(-1);
  if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
  else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
});
document.querySelectorAll(".toggle").forEach(t => {
  t.addEventListener("click", () => {
    const k = t.dataset.set;
    FK.settings[k] = !FK.settings[k];
    t.querySelector("img").src = `assets/toggle_${FK.settings[k] ? "on" : "off"}.png`;
    t.setAttribute("aria-checked", String(FK.settings[k]));
    if (k === "motes") motesCanvas.style.display = FK.settings.motes ? "block" : "none";
    if (k === "keybinds") updateKeybinds();
  });
});
$("#quality").addEventListener("click", () => {
  FK.settings.quality = (FK.settings.quality + 1) % 3;
  const label = QUALITIES[FK.settings.quality];
  $("#quality span").textContent = label;
  $("#quality").setAttribute("aria-label", `Quality: ${label}`);
});
function updateKeybinds() {
  document.querySelectorAll(".abil .key").forEach(k =>
    k.style.display = FK.settings.keybinds ? "block" : "none");
}

/* -------------------------------------------------------------- motes */
const motesCanvas = $("#motes");
const ctx = motesCanvas.getContext("2d");
let motes = [];
function seedMotes() {
  motesCanvas.width = innerWidth; motesCanvas.height = innerHeight;
  motes = Array.from({ length: 64 }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: 0.6 + Math.random() * 1.7, vy: 0.08 + Math.random() * 0.3,
    vx: (Math.random() - 0.5) * 0.12, a: 0.05 + Math.random() * 0.25,
    p: Math.random() * Math.PI * 2,
  }));
}
addEventListener("resize", seedMotes); seedMotes();
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduceMotion) motesCanvas.style.display = "none";
(function tickMotes(t) {
  if (!reduceMotion) {
    ctx.clearRect(0, 0, motesCanvas.width, motesCanvas.height);
    for (const m of motes) {
      m.y -= m.vy; m.x += m.vx + Math.sin(t / 3000 + m.p) * 0.05;
      if (m.y < -4) { m.y = innerHeight + 4; m.x = Math.random() * innerWidth; }
      ctx.fillStyle = `rgba(232,200,130,${m.a * (0.7 + 0.3 * Math.sin(t / 700 + m.p * 3))})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
    }
  }
  requestAnimationFrame(tickMotes);
})(0);

const q = new URLSearchParams(location.search);
FK.setScene(["town", "combat"].includes(q.get("scene")) ? q.get("scene") : "menu");
if (q.get("panel")) addEventListener("load", () => FK.setPanel(q.get("panel")), { once: true });
FK.setGold(FK.gold);
FK.setShards(FK.shards);
})();
