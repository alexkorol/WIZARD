/* FrameKit game UI demo — everything visual is cropped generated art;
   this file only places, animates, and wires it. */
(() => {
"use strict";

const $ = (s, el) => (el || document).querySelector(s);
const stage = $("#stage");

/* ---------------------------------------------------------- stage scale */
let scale = 1;
function fit() {
  scale = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
}
addEventListener("resize", fit); fit();

const stagePoint = (ev) => {
  const r = stage.getBoundingClientRect();
  return { x: (ev.clientX - r.left) / scale, y: (ev.clientY - r.top) / scale };
};

/* ------------------------------------------------------------- tabs */
const screens = { character: $("#charScreen"), skills: $("#skillScreen") };
function show(name) {
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.toggle("active", t.dataset.screen === name));
  Object.entries(screens).forEach(([k, el]) =>
    el.classList.toggle("active", k === name));
}
document.querySelectorAll(".tab").forEach(t =>
  t.addEventListener("click", () => show(t.dataset.screen)));
show(location.hash === "#skills" ? "skills" : "character");

/* ------------------------------------------------------------- items */
const RAR = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };
const I = (icon, name, rarity, type, opts = {}) =>
  Object.assign({ icon, name, rarity, type, round: !/gem_|pennant|sq_|tri_|chev/.test(icon) }, opts);

const ITEMS = {
  torch:    I("med_torch", "Bronze Torch", "rare", "Main Hand · Focus",
              { equip: "weapon", stats: ["+38 Spell Power", "+12 Vigor"], flavor: "It has burned since the archive drowned." }),
  crown:    I("med_crown", "Gilded Crown", "epic", "Head · Regalia",
              { equip: "helm", stats: ["+21 Will", "+9% Mana"], flavor: "Worn by nine wardens. Buried with none." }),
  aegis:    I("med_shield", "Marble Aegis", "rare", "Body · Vestment",
              { equip: "chest", stats: ["+44 Armor", "+15 Ward"], flavor: "" }),
  standard: I("med_eagle", "Eagle Standard", "legendary", "Off Hand · Relic",
              { equip: "offhand", stats: ["+2 to all Auras", "+18 Grace"], flavor: "The legion it led is dust; it is not." }),
  chain:    I("med_chain", "Iron Chain", "uncommon", "Waist",
              { equip: "belt", stats: ["+16 Armor", "+1 Charm Slot"], flavor: "" }),
  greaves:  I("med_snake", "Serpent Greaves", "epic", "Feet",
              { equip: "boots", stats: ["+11% Stride", "Immune to Slow"], flavor: "" }),
  scales:   I("med_scales", "Bronze Scales", "rare", "Neck · Talisman",
              { equip: "amulet", stats: ["+14 Will", "Balance: even trades"], flavor: "They tip for no one." }),
  gemR:     I("gem_rare", "Sapphire Shard", "rare", "Socket Gem", { equip: "gem", stats: ["+8% Mana"], qty: 3 }),
  gemE:     I("gem_epic", "Amethyst Shard", "epic", "Socket Gem", { equip: "gem", stats: ["+6% Spell Echo"] }),
  gemL:     I("gem_legendary", "Amber Shard", "legendary", "Socket Gem", { equip: "gem", stats: ["+1 Radiant Skill"] }),
  gemU:     I("gem_uncommon", "Jade Shard", "uncommon", "Socket Gem", { equip: "gem", stats: ["+5% Ward"], qty: 7 }),
  gemC:     I("gem_common", "Chalk Shard", "common", "Socket Gem", { equip: "gem", stats: ["+2 Armor"], qty: 14 }),
  gemM:     I("gem_mythic", "Sun Shard", "mythic", "Socket Gem", { equip: "gem", stats: ["+1 to Everything, briefly"] }),
  lion:     I("med_lion", "Lion Seal", "epic", "Signet", { stats: ["Opens the west gate"], flavor: "The knocker answers to this face alone." }),
  bull:     I("med_bull", "Bull Seal", "rare", "Signet", { stats: ["Opens the granary"], flavor: "" }),
  key:      I("med_key", "Vault Key", "legendary", "Key", { stats: ["Opens one locked thing"], flavor: "The teeth rearrange when you look away." }),
  keyhole:  I("keyhole", "Warded Lock", "uncommon", "Curio", { stats: ["It is watching you"], flavor: "" }),
  lock:     I("lock_round", "Sealed Lock", "common", "Curio", { qty: 2, stats: ["No key fits"], flavor: "" }),
  hourglass:I("med_hourglass", "Silent Hourglass", "epic", "Curio", { stats: ["The sand falls upward"], flavor: "Turn it only once." }),
  laurel:   I("laurel_sun", "Laurel Medal", "rare", "Honor", { stats: ["+6 Renown"], flavor: "" }),
  compass:  I("med_star", "Star Compass", "rare", "Instrument", { stats: ["Points to what you lost"], flavor: "" }),
  rosette:  I("med_flower", "Stone Rosette", "common", "Curio", { qty: 4, stats: [], flavor: "" }),
  cherub:   I("med_cherub", "Cherub Relief", "uncommon", "Relic Fragment", { stats: [], flavor: "Half of a pair." }),
  cherub2:  I("med_cherub2", "Cherub Relief", "uncommon", "Relic Fragment", { stats: [], flavor: "The other half." }),
  eaglehead:I("med_eaglehead", "Eagle Fragment", "common", "Relic Fragment", { qty: 2, stats: [], flavor: "" }),
  skull:    I("med_skull", "Memento", "rare", "Trophy", { stats: ["+4% damage to the ungrateful dead"], flavor: "" }),
  knocker:  I("knocker", "Door Knocker", "uncommon", "Curio", { stats: ["Knocks by itself at dusk"], flavor: "" }),
  sun:      I("med_sunteal", "Sun Medallion", "epic", "Talisman", { stats: ["+10 Radiance"], flavor: "" }),
  qbanner:  I("pennant_quest", "Charter: The Lower Vaults", "uncommon", "Quest", { stats: ["Bring a light. Bring two."], flavor: "" }),
  sbanner:  I("pennant_star", "Charter: The Long Stair", "rare", "Quest", { stats: ["Count the steps down"], flavor: "" }),
  wfire:    I("tri_fire", "Ember Ward", "uncommon", "Consumable · Ward", { qty: 5, stats: ["+40% Fire Ward for 60s"], flavor: "" }),
  wbolt:    I("tri_bolt", "Storm Ward", "uncommon", "Consumable · Ward", { qty: 3, stats: ["+40% Storm Ward for 60s"], flavor: "" }),
  wskull:   I("tri_skull", "Grave Ward", "rare", "Consumable · Ward", { qty: 2, stats: ["+40% Grave Ward for 60s"], flavor: "" }),
  haste:    I("chev_double", "March Order", "rare", "Consumable", { qty: 4, stats: ["+20% Stride for 30s"], flavor: "" }),
  charm1:   I("sq_heart", "Heart Charm", "uncommon", "Charm", { charm: true, stats: ["+20 Vitality"], flavor: "" }),
  charm2:   I("sq_star", "Star Charm", "rare", "Charm", { charm: true, stats: ["+2% Crit"], flavor: "" }),
  relic1:   I("socket_gold", "Radiant Ring", "legendary", "Relic · Triad", { relic: true, stats: ["Completes the triad"], flavor: "" }),
};

/* ------------------------------------------------- character spread */
const overlay = $("#spreadOverlay");

const div = (cls, style, parent) => {
  const d = document.createElement("div");
  d.className = cls;
  Object.assign(d.style, style);
  (parent || overlay).appendChild(d);
  return d;
};
const px = n => n + "px";

const slots = []; // {el, item, accepts}
function makeSlot(x, y, w, h, opts = {}) {
  const el = div("slot", { left: px(x), top: px(y), width: px(w), height: px(h) });
  const s = Object.assign({ el, item: null }, opts);
  el._slot = s;
  slots.push(s);
  return s;
}
function renderSlot(s) {
  s.el.innerHTML = "";
  s.el.classList.toggle("filled", !!s.item);
  if (!s.item) return;
  const img = document.createElement("img");
  img.src = `assets/${s.item.icon}.png`;
  img.className = "item" + (s.item.round ? " round" : "") +
    (RAR[s.item.rarity] > 0 ? ` r-${s.item.rarity}` : "");
  s.el.appendChild(img);
  if (s.item.qty > 1) {
    const q = document.createElement("span");
    q.className = "qty"; q.textContent = s.item.qty;
    s.el.appendChild(q);
  }
}
function fill(s, item) { s.item = item; renderSlot(s); }

/* equipment (right panel top) */
const EQUIP = [
  ["weapon", 873, 135, 111, 248, "Main Hand", ITEMS.torch],
  ["helm", 1006, 111, 108, 122, "Head", ITEMS.crown],
  ["chest", 1135, 111, 110, 186, "Body", ITEMS.aegis],
  ["offhand", 1401, 125, 110, 256, "Off Hand", ITEMS.standard],
  ["gem", 1264, 97, 57, 63, "Socket", ITEMS.gemR],
  ["gem", 1263, 173, 58, 61, "Socket", ITEMS.gemE],
  ["gem", 1333, 173, 56, 64, "Socket", null],
  ["belt", 1006, 254, 108, 127, "Waist", ITEMS.chain],
  ["boots", 1264, 254, 116, 128, "Feet", ITEMS.greaves],
  ["amulet", 1135, 316, 110, 65, "Neck", ITEMS.scales],
];
EQUIP.forEach(([kind, x, y, w, h, label, item]) => {
  const s = makeSlot(x, y, w, h, { accepts: kind, label });
  if (item) fill(s, item);
});

/* left panel: triad relic sockets */
[[318, 155], [261, 276], [375, 276]].forEach(([cx, cy], i) => {
  const s = makeSlot(cx - 27, cy - 27, 54, 54, { accepts: "relic", label: "Triad Socket" });
  s.el.style.borderRadius = "50%";
  if (i === 0) fill(s, ITEMS.relic1);
});
/* charm row */
[[232, 338, 35, 39], [276, 338, 36, 39], [321, 335, 37, 42], [365, 338, 36, 39]]
  .forEach(([x, y, w, h], i) => {
    const s = makeSlot(x, y, w, h, { accepts: "charm", label: "Charm" });
    if (i === 0) fill(s, ITEMS.charm1);
    if (i === 1) fill(s, ITEMS.charm2);
  });
/* belt / quick row */
const QUICK = [[77, 153, 229, 305, 381, 457, 533, 608].map(x => [x, 497, 60, 65]), [[681, 497, 49, 66]]].flat();
const quickItems = [ITEMS.wfire, ITEMS.wbolt, ITEMS.haste, ITEMS.wskull, null, null, null, null, null];
QUICK.forEach(([x, y, w, h], i) => {
  const s = makeSlot(x, y, w, h, { label: "Belt" });
  if (quickItems[i]) fill(s, quickItems[i]);
});

/* inventory grid (right panel) */
const COLS = [855, 907, 960, 1012, 1065, 1118, 1170, 1223, 1276, 1328, 1381, 1434, 1486];
const ROWS = [402, 458, 512, 567, 621, 676, 732, 786];
const bagItems = [
  ITEMS.lion, ITEMS.key, ITEMS.hourglass, ITEMS.sun, ITEMS.gemL, ITEMS.gemM, null, ITEMS.compass,
  ITEMS.laurel, null, ITEMS.qbanner, ITEMS.sbanner, null,
  ITEMS.bull, ITEMS.skull, ITEMS.gemU, ITEMS.gemC, null, ITEMS.knocker, ITEMS.cherub, ITEMS.cherub2,
  null, ITEMS.eaglehead, null, null, ITEMS.rosette,
  ITEMS.keyhole, ITEMS.lock, null, ITEMS.wfire,
];
let bi = 0;
ROWS.forEach((y, r) => COLS.forEach((x, c) => {
  const s = makeSlot(x, y, 49, 50, { label: "Pack" });
  const it = r < 3 ? bagItems[bi++] : null;
  if (it) fill(s, it);
}));
/* reagent row (bottom of right panel) */
[1062, 1132, 1202, 1272].forEach((x, i) => {
  const s = makeSlot(x, 858, 50, 50, { label: "Reagent" });
  if (i === 0) fill(s, ITEMS.gemC);
  if (i === 1) fill(s, ITEMS.rosette);
});

/* portrait arch */
const arch = div("spread-text", { left: px(80), top: px(119), width: px(128), height: px(279) });
arch.innerHTML = `<img src="assets/med_cherub2.png" style="position:absolute;left:9px;top:52px;width:110px;height:110px;border-radius:50%;filter:drop-shadow(0 0 16px rgba(240,209,138,.25))">`;

/* info well text */
const info = div("spread-text", { left: px(392), top: px(132), width: px(322), height: px(246) });
info.innerHTML = `
  <div id="charName">Aurelius</div>
  <div id="charTitle">Mage · Ninth Circle · Level 47</div>
  <div class="divider"></div>
  <div class="statline"><span>Might</span><b>34</b></div>
  <div class="statline"><span>Will</span><b>61</b></div>
  <div class="statline"><span>Grace</span><b>42</b></div>
  <div class="statline"><span>Vigor</span><b>38</b></div>`;

/* stat plaques */
const plq = (x, y, w, h, k, v) => {
  const p = div("plaque-label", { left: px(x), top: px(y), width: px(w), height: px(h), padding: "0 12px", fontSize: "15px" });
  p.innerHTML = `<span style="letter-spacing:.2em">${k}</span><span style="color:var(--gold-bright)">${v}</span>`;
};
plq(165, 441, 116, 36, "ARMOR", "188");
plq(283, 441, 113, 36, "POWER", "241");

/* lore / inspect well */
const lore = div("spread-text", { left: px(96), top: px(608), width: px(600), height: px(280) });
function inspect(item) {
  if (!item) {
    lore.innerHTML = `
      <div id="loreTitleRow">
        <img id="loreIcon" src="assets/med_sun.png">
        <div><div id="loreName">Warden of the Verdant Seal</div>
        <div id="loreType">Standing · The Sunken Archive</div></div>
      </div>
      <div class="divider"></div>
      <div id="loreBody">The lower vaults have been quiet for nine days. The lamps
      along the long stair are lit and the ledger is current. <em>Select any item
      to inspect it.</em></div>`;
    return;
  }
  lore.innerHTML = `
    <div id="loreTitleRow">
      <img id="loreIcon" src="assets/${item.icon}.png" style="${item.round ? "" : "border-radius:8px"}">
      <div><div id="loreName" class="rar-${item.rarity}">${item.name}</div>
      <div id="loreType">${item.type} · ${item.rarity}</div></div>
    </div>
    <div class="divider"></div>
    <div id="loreStats">${(item.stats || []).map(s => `<div>${s}</div>`).join("")}</div>
    <div id="loreBody">${item.flavor ? `<em>${item.flavor}</em>` : ""}</div>`;
}
inspect(null);

/* ------------------------------------------------------------ tooltip */
const tip = $("#tooltip");
function showTip(item, label, pt) {
  const hint = item ? (item.equip || item.charm || item.relic ? "drag to move · click to inspect" : "click to inspect") : "";
  tip.innerHTML = item ? `
    <div class="tname rar-${item.rarity}">${item.name}</div>
    <div class="ttype">${item.type}</div>
    ${(item.stats || []).map(s => `<div class="tstat">${s}</div>`).join("")}
    ${item.flavor ? `<div class="tflavor">${item.flavor}</div>` : ""}
    <div class="thint">${hint}</div>`
    : `<div class="tname">${label}</div>`;
  tip.style.display = "block";
  positionTip(pt);
}
function positionTip(pt) {
  const w = 292, h = tip.offsetHeight || 120;
  tip.style.left = px(Math.min(pt.x + 26, 1920 - w - 10));
  tip.style.top = px(Math.max(10, Math.min(pt.y - h / 2, 1080 - h - 10)));
}
function hideTip() { tip.style.display = "none"; }

/* --------------------------------------------------- drag + inspect */
let drag = null;
const ghost = document.createElement("div");
ghost.id = "ghost";
ghost.style.display = "none";
stage.appendChild(ghost);

function slotFromEvent(ev) {
  const els = document.elementsFromPoint(ev.clientX, ev.clientY);
  for (const el of els) if (el._slot) return el._slot;
  return null;
}
function canDrop(s, item) {
  if (!s.accepts) return !item.charm && !item.relic || true;
  if (s.accepts === "gem") return item.equip === "gem";
  if (s.accepts === "charm") return !!item.charm;
  if (s.accepts === "relic") return !!item.relic;
  return item.equip === s.accepts;
}

overlay.addEventListener("pointerdown", ev => {
  const s = slotFromEvent(ev);
  if (!s || !s.item) return;
  drag = { from: s, item: s.item };
  ghost.innerHTML = `<img src="assets/${s.item.icon}.png">`;
  ghost.style.display = "block";
  const pt = stagePoint(ev);
  ghost.style.left = px(pt.x - 29); ghost.style.top = px(pt.y - 29);
  // light up the typed slots that can take this item
  slots.forEach(t => {
    if (t !== s && t.accepts && canDrop(t, s.item)) t.el.classList.add("can-take");
  });
  hideTip();
  ev.preventDefault();
});

addEventListener("pointermove", ev => {
  if (drag) {
    const pt = stagePoint(ev);
    ghost.style.left = px(pt.x - 29); ghost.style.top = px(pt.y - 29);
    slots.forEach(s => s.el.classList.remove("drop-ok", "drop-bad"));
    const over = slotFromEvent(ev);
    if (over && over !== drag.from)
      over.el.classList.add(canDrop(over, drag.item) ? "drop-ok" : "drop-bad");
    return;
  }
  const s = slotFromEvent(ev);
  if (s && (s.item || s.accepts)) {
    showTip(s.item, s.label, stagePoint(ev));
  } else if (!ev.target.closest || !ev.target.closest(".abil,.node,.buff,#xpbar")) {
    hideTip();
  }
});

addEventListener("pointerup", ev => {
  if (!drag) return;
  ghost.style.display = "none";
  slots.forEach(s => s.el.classList.remove("drop-ok", "drop-bad", "can-take"));
  const to = slotFromEvent(ev);
  const { from, item } = drag;
  drag = null;
  if (!to || to === from) { maybeInspect(ev, from, item); return; }
  if (!canDrop(to, item) || (to.item && from.accepts && !canDrop(from, to.item))) {
    to.el.classList.add("shake");
    setTimeout(() => to.el.classList.remove("shake"), 350);
    return;
  }
  const swapped = to.item;
  fill(to, item);
  fill(from, swapped || null);
});

let downAt = null;
overlay.addEventListener("pointerdown", ev => { downAt = { x: ev.clientX, y: ev.clientY, t: Date.now() }; });
function maybeInspect(ev, s, item) {
  if (!downAt) return;
  const moved = Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y);
  if (moved < 6 && Date.now() - downAt.t < 500) {
    document.querySelectorAll(".slot.selected").forEach(e => e.classList.remove("selected"));
    s.el.classList.add("selected");
    inspect(item);
  }
}

/* ----------------------------------------------------------- skill web */
const NODE_NAMES = [
  "Iron Will", "Keen Eye", "Stone Skin", "Quick Hands", "Clear Mind",
  "Long Stride", "Steady Aim", "Deep Breath", "Second Wind", "Sharp Edge",
  "Warding Sign", "Bright Lantern", "Old Knowledge", "Sure Footing", "Patient Hunter",
  "Silver Tongue", "Night Vision", "Strong Back", "Light Sleeper", "Cold Blood",
  "Still Water", "High Ground", "First Spark", "Last Word", "Open Door",
  "Closed Fist", "Fair Wind", "Dry Powder", "Hard Bargain", "Soft Step",
  "Long Memory", "Early Riser", "Late Bloom", "Even Keel", "True North",
  "Plain Sight", "Spare Key", "Whetted Mind", "Braced Heart", "Quiet Hour",
];
const NODE_DESCS = [
  "+5% Ward while standing still.",
  "+8% chance to notice what matters.",
  "+12 Armor. Weighs nothing.",
  "+6% cast speed with relics.",
  "+10% mana regeneration.",
  "+8% movement on marble floors.",
  "+5% precision with instruments.",
  "Holding your breath lasts twice as long.",
  "Once a day, refuse to fall.",
  "+7% damage with brass and bronze.",
  "Wards you draw last 20% longer.",
  "Your light reaches 4 paces further.",
  "Read the old script without squinting.",
  "Never slip on the long stair.",
  "+10% damage after waiting your turn.",
];
let points = 12;
const pointsEl = $("#pointsLeft");
const webOverlay = $("#webOverlay");
const skillName = $("#skillName");
const skillDesc = $("#skillDesc");
const skillMeta = $("#skillMeta");

fetch("assets/layout.json").then(r => r.json()).then(L => {
  const nodes = L.skillNodes;
  // largest node = keystone; sort rest stable by position for naming
  nodes.forEach((n, i) => {
    const isKey = n.r > 60;
    const el = document.createElement("div");
    el.className = "node";
    const r = n.r + 4;
    Object.assign(el.style, {
      left: px(n.cx - r), top: px(n.cy - r), width: px(r * 2), height: px(r * 2),
    });
    const name = isKey ? "The Verdant Seal" : NODE_NAMES[i % NODE_NAMES.length];
    const desc = isKey ? "Every path in the web begins and ends at the seal."
      : NODE_DESCS[i % NODE_DESCS.length];
    if (isKey) el.classList.add("keystone");
    el.addEventListener("pointerenter", ev => {
      skillName.textContent = name;
      skillDesc.textContent = desc;
      skillMeta.textContent = el.classList.contains("on")
        ? "Learned" : (isKey ? "Keystone" : "Cost · 1 point");
      showTip({ name, rarity: el.classList.contains("on") ? "legendary" : "common",
        type: isKey ? "Keystone" : "Passive · 1 point", stats: [desc], flavor: "", round: true },
        name, stagePoint(ev));
    });
    el.addEventListener("pointerleave", hideTip);
    el.addEventListener("click", () => {
      if (isKey) return;
      if (el.classList.contains("on")) {
        el.classList.remove("on"); points++;
      } else if (points > 0) {
        el.classList.add("on"); points--;
      } else {
        el.classList.add("shake");
        setTimeout(() => el.classList.remove("shake"), 350);
      }
      pointsEl.textContent = points;
      skillMeta.textContent = el.classList.contains("on") ? "Learned" : "Cost · 1 point";
    });
    if (isKey) el.classList.add("on");
    webOverlay.appendChild(el);
  });

  buildRack(L);
});

/* -------------------------------------------------------------- HUD */
const vitals = {
  hp: { cur: 784, max: 900, el: $("#healthBar .deplete"), num: $("#healthNum") },
  mp: { cur: 312, max: 540, el: $("#manaBar .deplete"), num: $("#manaNum") },
};
const WELL = { left: 21, right: 17, w: 346 }; // display px of winged bar wells
function drawVitals() {
  for (const v of Object.values(vitals)) {
    const frac = Math.max(0, Math.min(1, v.cur / v.max));
    const wellW = WELL.w - WELL.left - WELL.right;
    v.el.style.width = px(Math.round(wellW * (1 - frac)));
    v.num.textContent = `${Math.round(v.cur)} / ${v.max}`;
  }
}
drawVitals();
setInterval(() => {
  vitals.hp.cur = Math.min(vitals.hp.max, vitals.hp.cur + 0.6);
  vitals.mp.cur = Math.min(vitals.mp.max, vitals.mp.cur + 1.4);
  drawVitals();
}, 250);

/* abilities */
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
const abils = [];
function buildRack(L) {
  const rackEl = $("#rackSlots");
  const showKeys = () => settings.keybinds;
  L.rackWells.forEach((wl, i) => {
    if (i >= ABILITIES.length) return;
    const [icon, name, cost, cd, desc] = ABILITIES[i];
    const el = document.createElement("div");
    el.className = "abil";
    Object.assign(el.style, { left: px(wl.x), top: px(wl.y), width: px(wl.w), height: px(wl.h) });
    el.innerHTML = `<img src="assets/${icon}.png"><div class="cd"></div><span class="key">${KEYS[i]}</span>`;
    const a = { el, name, cost, cd, desc, cdEl: el.querySelector(".cd"), until: 0 };
    el.addEventListener("click", () => cast(a));
    el.addEventListener("pointerenter", ev => {
      showTip({ name, rarity: "legendary", type: `Ability · ${cost} mana · ${cd}s`, stats: [], flavor: desc, round: true },
        name, stagePoint(ev));
    });
    el.addEventListener("pointerleave", hideTip);
    abils.push(a);
    rackEl.appendChild(el);
  });
  updateKeybinds();
}
function cast(a) {
  const now = performance.now();
  if (now < a.until) return;
  if (vitals.mp.cur < a.cost) {
    a.el.classList.add("oom");
    setTimeout(() => a.el.classList.remove("oom"), 350);
    return;
  }
  vitals.mp.cur -= a.cost;
  drawVitals();
  floatText(`−${a.cost}`, "#c9b3ef");
  a.until = now + a.cd * 1000;
  const tick = () => {
    const left = a.until - performance.now();
    if (left <= 0) { a.cdEl.style.background = "none"; return; }
    const deg = 360 * (left / (a.cd * 1000));
    a.cdEl.style.background = `conic-gradient(rgba(8,6,4,.78) ${deg}deg, transparent ${deg}deg)`;
    requestAnimationFrame(tick);
  };
  tick();
}
addEventListener("keydown", ev => {
  const i = KEYS.indexOf(ev.key);
  if (i >= 0 && abils[i]) cast(abils[i]);
  if (ev.key.toLowerCase() === "c") show("character");
  if (ev.key.toLowerCase() === "v") show("skills");
  if (ev.key === "Escape") backdrop.classList.toggle("open");
});

/* floating combat-style text over the mana bar */
function floatText(text, color) {
  const f = document.createElement("span");
  f.className = "floater";
  f.textContent = text;
  f.style.color = color;
  $("#manaBar").appendChild(f);
  setTimeout(() => f.remove(), 1100);
}

/* buffs */
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
    showTip({ name, rarity: "uncommon", type: "Active effect", stats: [], flavor: "", round: false }, name, stagePoint(ev)));
  b.addEventListener("pointerleave", hideTip);
  buffsEl.appendChild(b);
});

/* xp */
$("#xpFill").style.width = px(Math.round((820 - 160) * 0.62));
$("#xpbar").addEventListener("pointerenter", ev =>
  showTip(null, "Level 47 · 4,180 / 6,700 XP", stagePoint(ev)));
$("#xpbar").addEventListener("pointerleave", hideTip);

/* ----------------------------------------------------------- settings */
const settings = { music: true, motes: true, keybinds: true, quality: 2 };
const QUALITIES = ["Low", "Medium", "High"];
const backdrop = $("#modalBackdrop");
$("#settingsBtn").addEventListener("click", () => backdrop.classList.add("open"));
$("#closeBtn").addEventListener("click", () => backdrop.classList.remove("open"));
$("#applyBtn").addEventListener("click", () => backdrop.classList.remove("open"));
backdrop.addEventListener("click", ev => { if (ev.target === backdrop) backdrop.classList.remove("open"); });
document.querySelectorAll(".toggle").forEach(t => {
  t.addEventListener("click", () => {
    const k = t.dataset.set;
    settings[k] = !settings[k];
    t.querySelector("img").src = `assets/toggle_${settings[k] ? "on" : "off"}.png`;
    if (k === "motes") motesCanvas.style.display = settings.motes ? "block" : "none";
    if (k === "keybinds") updateKeybinds();
  });
});
$("#quality").addEventListener("click", () => {
  settings.quality = (settings.quality + 1) % 3;
  $("#quality span").textContent = QUALITIES[settings.quality];
});
function updateKeybinds() {
  document.querySelectorAll(".abil .key").forEach(k =>
    k.style.display = settings.keybinds ? "block" : "none");
}

/* -------------------------------------------------------------- motes */
const motesCanvas = $("#motes");
const ctx = motesCanvas.getContext("2d");
let motes = [];
function seedMotes() {
  motesCanvas.width = innerWidth; motesCanvas.height = innerHeight;
  motes = Array.from({ length: 64 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: 0.6 + Math.random() * 1.7,
    vy: 0.08 + Math.random() * 0.3,
    vx: (Math.random() - 0.5) * 0.12,
    a: 0.05 + Math.random() * 0.25,
    p: Math.random() * Math.PI * 2,
  }));
}
addEventListener("resize", seedMotes); seedMotes();
(function tick(t) {
  ctx.clearRect(0, 0, motesCanvas.width, motesCanvas.height);
  for (const m of motes) {
    m.y -= m.vy; m.x += m.vx + Math.sin(t / 3000 + m.p) * 0.05;
    if (m.y < -4) { m.y = innerHeight + 4; m.x = Math.random() * innerWidth; }
    const tw = m.a * (0.7 + 0.3 * Math.sin(t / 700 + m.p * 3));
    ctx.fillStyle = `rgba(232, 200, 130, ${tw})`;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(tick);
})(0);

})();
