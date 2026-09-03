/* Character + inventory content mounted into independent left/right panes. */
(() => {
"use strict";
const { $, px } = FK;
const overlay = $("#paneLayer");
const leftOverlay = $("#leftCharacterContent");
const rightOverlay = $("#rightCharacterContent");

/* ------------------------------------------------------------- items */
const I = (icon, name, rarity, type, opts = {}) =>
  Object.assign({ icon, name, rarity, type,
    round: !/^items\//.test(icon) && !/gem_|pennant|sq_|tri_|chev/.test(icon) }, opts);

const ITEMS = FK.ITEMS = {
  khopesh:  I("items/khopesh_skymetal", "Skymetal Khopesh", "legendary", "Main Hand · Sword",
              { equip: "weapon", stats: ["112–186 damage", "+12% attack speed", "+34 Grace"], flavor: "Fell from a clear sky. Kept its temper." }),
  scaleshield: I("items/hideshield_bronzescale", "Bronze Scale Shield", "rare", "Off Hand · Shield",
              { equip: "offhand", stats: ["+52 Armor", "+11% block"], flavor: "" }),
  greataxe: I("items/greataxe_obsidian", "Obsidian Greataxe", "epic", "Two-Hand · Axe",
              { equip: "weapon", stats: ["203–288 damage", "+22% against structures"], flavor: "The edge is one molecule of night." }),
  helm:     I("items/helm_bronzescale", "Bronze Scale Helm", "rare", "Head",
              { equip: "helm", stats: ["+31 Armor", "+9 Will"], flavor: "" }),
  plate:    I("items/astral_plate", "Astral Plate", "epic", "Body",
              { equip: "chest", stats: ["+88 Armor", "+15 Ward", "You can see the web faintly"], flavor: "" }),
  girdle:   I("items/girdle_bronzeplate", "Bronze Girdle", "uncommon", "Waist",
              { equip: "belt", stats: ["+16 Armor", "+1 Belt Slot"], flavor: "" }),
  greaves:  I("items/greaves_bronze", "Bronze Greaves", "rare", "Feet",
              { equip: "boots", stats: ["+24 Armor", "+8% Stride"], flavor: "" }),
  onyx:     I("items/onyx_amulet", "Onyx Amulet", "epic", "Neck · Talisman",
              { equip: "amulet", stats: ["+18 Will", "+5% Spell Echo"], flavor: "It remembers being worn." }),
  gauntlets: I("items/chain_gauntlets", "Chain Gauntlets", "uncommon", "Hands",
              { stats: ["+14 Armor"], flavor: "", value: 120 }),
  wand:     I("items/arc_wand", "Arc Wand", "rare", "Main Hand · Wand",
              { equip: "weapon", stats: ["+41 Spell Power", "Chains once"], value: 340 }),
  coral:    I("items/coral_ring", "Coral Ring", "uncommon", "Ring",
              { stats: ["+22 Vitality"], value: 90 }),
  ironring: I("items/iron_ring", "Iron Ring", "common", "Ring",
              { stats: ["+9 Armor"], value: 35 }),
  amber:    I("items/curio_amber", "Amber Curio", "rare", "Curio",
              { stats: ["Something is inside it"], value: 210, flavor: "It was expensive when it was sap." }),
  mirror:   I("items/mirror_obsidian", "Obsidian Mirror", "epic", "Curio",
              { stats: ["Shows the room behind the room"], value: 620 }),
  fetish:   I("items/fetish_bone", "Bone Fetish", "uncommon", "Curio",
              { stats: ["+4% damage to the ungrateful dead"], value: 75 }),
  curorb:   I("items/cur_orb", "Chromatic Orb", "rare", "Currency", { qty: 7, stats: ["Reforges an item's colors"], value: 60 }),
  cursigil: I("items/cur_sigil", "Binding Sigil", "epic", "Currency", { qty: 2, stats: ["Seals a modifier in place"], value: 240 }),
  curstone: I("items/cur_stone", "Whetstone", "common", "Currency", { qty: 14, stats: ["+quality, once"], value: 8 }),
  draught:  I("items/cur_draught", "Verdant Draught", "uncommon", "Consumable", { qty: 5, stats: ["Restores 180 life"], value: 45 }),
  ember:    I("items/ember_shell", "Ember Shell", "rare", "Reagent", { qty: 3, stats: ["Warm forever"], value: 130 }),
  bowl:     I("items/bowl_bronze_offering", "Offering Bowl", "uncommon", "Reagent", { stats: ["Accepts most things"], value: 95 }),
  gemR:     I("gem_rare", "Sapphire Shard", "rare", "Socket Gem", { equip: "gem", stats: ["+8% Mana"], qty: 3, value: 150 }),
  gemE:     I("gem_epic", "Amethyst Shard", "epic", "Socket Gem", { equip: "gem", stats: ["+6% Spell Echo"], value: 420 }),
  gemL:     I("gem_legendary", "Amber Shard", "legendary", "Socket Gem", { equip: "gem", stats: ["+1 Radiant Skill"], value: 1100 }),
  key:      I("med_key", "Vault Key", "legendary", "Key", { stats: ["Opens one locked thing"], flavor: "The teeth rearrange when you look away." }),
  hourglass: I("med_hourglass", "Silent Hourglass", "epic", "Curio", { stats: ["The sand falls upward"], value: 480 }),
  ring2:    I("socket_gold", "Radiant Ring", "legendary", "Ring · Relic", { stats: ["+1 to the Verdant Seal"], value: 1500 }),
  qbanner:  I("pennant_quest", "Charter: The Lower Vaults", "uncommon", "Quest", { stats: ["Bring a light. Bring two."] }),
  wfire:    I("tri_fire", "Ember Ward", "uncommon", "Consumable · Ward", { qty: 5, stats: ["+40% Fire Ward for 60s"], value: 30 }),
  wbolt:    I("tri_bolt", "Storm Ward", "uncommon", "Consumable · Ward", { qty: 3, stats: ["+40% Storm Ward for 60s"], value: 30 }),
  wskull:   I("tri_skull", "Grave Ward", "rare", "Consumable · Ward", { qty: 2, stats: ["+40% Grave Ward for 60s"], value: 60 }),
  haste:    I("chev_double", "March Order", "rare", "Consumable", { qty: 4, stats: ["+20% Stride for 30s"], value: 55 }),
  charm1:   I("sq_heart", "Heart Charm", "uncommon", "Charm", { charm: true, stats: ["+20 Vitality"] }),
  charm2:   I("sq_star", "Star Charm", "rare", "Charm", { charm: true, stats: ["+2% Crit"] }),
};
Object.entries(ITEMS).forEach(([key, item]) => { item.key = key; });

/* ------------------------------------------------------------- slots */
const div = (cls, style, parent) => {
  const d = document.createElement("div");
  d.className = cls;
  Object.assign(d.style, style);
  (parent || leftOverlay).appendChild(d);
  return d;
};
const slots = FK.slots = [];
function makeSlot(x, y, w, h, opts = {}) {
  const parent = x >= 805 ? rightOverlay : leftOverlay;
  const el = div("slot", { left: px(x), top: px(y), width: px(w), height: px(h) }, parent);
  const s = Object.assign({ el, item: null }, opts);
  el._slot = s;
  el.tabIndex = -1;
  el.setAttribute("role", "button");
  slots.push(s);
  renderSlot(s);
  return s;
}
function renderSlot(s) {
  s.el.innerHTML = "";
  s.el.classList.toggle("filled", !!s.item);
  s.el.tabIndex = s.item ? 0 : -1;
  if (!s.item) {
    s.el.removeAttribute("role");
    s.el.setAttribute("aria-hidden", "true");
    s.el.removeAttribute("aria-label");
    return;
  }
  s.el.setAttribute("role", "button");
  s.el.setAttribute("aria-hidden", "false");
  s.el.setAttribute("aria-pressed", String(FK.selectedSlot === s));
  const img = document.createElement("img");
  img.src = `assets/${s.item.icon}.png`;
  img.className = "item" + (s.item.round ? " round" : "") +
    (s.item.rarity && s.item.rarity !== "common" ? ` r-${s.item.rarity}` : "");
  s.el.appendChild(img);
  if (s.item.qty > 1) {
    const q = document.createElement("span");
    q.className = "qty"; q.textContent = s.item.qty;
    s.el.appendChild(q);
  }
  s.el.setAttribute("aria-label", `${s.label || "Item"}: ${s.item.name}${s.item.qty > 1 ? `, quantity ${s.item.qty}` : ""}`);
}
function announceInventory() {
  document.dispatchEvent(new CustomEvent("fk-inventory-change"));
}
const fill = FK.fillSlot = (s, item) => {
  const previous = s.item;
  s.item = item;
  renderSlot(s);
  if (FK.selectedSlot === s && previous !== item) {
    s.el.classList.remove("selected");
    FK.selectedSlot = null;
    document.dispatchEvent(new CustomEvent("fk-selection-change", { detail: { slot: null, item: null } }));
  }
  announceInventory();
};
FK.inventorySlots = () => slots.filter(s => s.zone === "inventory");
FK.addToPack = (item) => {
  const free = slots.find(t => t.zone === "inventory" && !t.item);
  if (!free) return false;
  fill(free, item);
  return true;
};
FK.removeFromPack = (slot, qty = 1) => {
  if (!slot || slot.zone !== "inventory" || !slot.item) return null;
  const removed = Object.assign({}, slot.item, { qty: Math.min(qty, slot.item.qty || 1) });
  const next = (slot.item.qty || 1) > qty ? Object.assign({}, slot.item, { qty: slot.item.qty - qty }) : null;
  fill(slot, next);
  return removed;
};
FK.consumeItem = (key, qty = 1) => {
  const available = FK.inventorySlots().reduce((total, slot) =>
    total + (slot.item?.key === key ? (slot.item.qty || 1) : 0), 0);
  if (available < qty) return false;
  let left = qty;
  for (const slot of FK.inventorySlots()) {
    if (!slot.item || slot.item.key !== key) continue;
    const take = Math.min(left, slot.item.qty || 1);
    FK.removeFromPack(slot, take);
    left -= take;
    if (!left) return true;
  }
  return true;
};

/* equipment (right panel top) */
const EQUIP = [
  ["weapon", 873, 135, 111, 248, "Main Hand"],
  ["helm", 1006, 111, 108, 122, "Head"],
  ["chest", 1135, 111, 110, 186, "Body"],
  ["offhand", 1401, 125, 110, 256, "Off Hand"],
  ["gem", 1264, 97, 57, 63, "Socket"],
  ["gem", 1263, 173, 58, 61, "Socket"],
  ["gem", 1333, 173, 56, 64, "Socket"],
  ["belt", 1006, 254, 108, 127, "Waist"],
  ["boots", 1264, 254, 116, 128, "Feet"],
  ["amulet", 1135, 316, 110, 65, "Neck"],
];
const equipSlots = {};
EQUIP.forEach(([kind, x, y, w, h, label], i) => {
  const s = makeSlot(x, y, w, h, { accepts: kind, label, zone: "equipment" });
  if (kind === "weapon") equipSlots.weapon = s;
  if (kind === "offhand") equipSlots.offhand = s;
});
fill(equipSlots.weapon, ITEMS.khopesh);
fill(equipSlots.offhand, ITEMS.scaleshield);
const bySlotKind = k => slots.filter(s => s.accepts === k);
fill(bySlotKind("helm")[0], ITEMS.helm);
fill(bySlotKind("chest")[0], ITEMS.plate);
fill(bySlotKind("belt")[0], ITEMS.girdle);
fill(bySlotKind("boots")[0], ITEMS.greaves);
fill(bySlotKind("amulet")[0], ITEMS.onyx);
fill(bySlotKind("gem")[0], ITEMS.gemR);
fill(bySlotKind("gem")[1], ITEMS.gemE);

/* weapon sets I / II — PoE-style swap on the two tall slots */
const weaponSets = { I: null, II: { weapon: ITEMS.greataxe, offhand: null } };
let activeSet = "I";
function swapSets(to) {
  if (to === activeSet) return;
  weaponSets[activeSet] = { weapon: equipSlots.weapon.item, offhand: equipSlots.offhand.item };
  const nx = weaponSets[to] || { weapon: null, offhand: null };
  fill(equipSlots.weapon, nx.weapon);
  fill(equipSlots.offhand, nx.offhand);
  activeSet = to;
  document.querySelectorAll(".setBtn, .setTag").forEach(b =>
    b.classList.toggle("active", b.dataset.set === to));
  FK.chatLog && FK.chatLog("log", `Weapon set ${to} readied.`);
}
FK.swapSets = swapSets;
/* set tags on the spread itself, above each tall slot */
[["I", 873], ["II", 930]].forEach(([tag, x]) => {
  const b = div("setTag" + (tag === "I" ? " active" : ""), { left: px(x), top: px(100) }, rightOverlay);
  b.textContent = tag;
  b.dataset.set = tag;
  b.addEventListener("click", () => swapSets(tag));
});
document.querySelectorAll("#setSwap .setBtn").forEach(b =>
  b.addEventListener("click", () => swapSets(b.dataset.set)));

/* stats triangle — the triad circles hold attribute values */
const TRIAD = [
  [318, 155, "Will", 61, "will"],
  [261, 276, "Might", 34, "might"],
  [375, 276, "Grace", 42, "grace"],
];
TRIAD.forEach(([cx, cy, label, val, cls]) => {
  const d = div(`triad ${cls}`, { left: px(cx - 27), top: px(cy - 27) });
  d.innerHTML = `<b>${val}</b><span>${label}</span>`;
  d.addEventListener("pointerenter", ev =>
    FK.showTip(null, `${label} · ${val}`, FK.stagePoint(ev)));
  d.addEventListener("pointerleave", FK.hideTip);
});

/* charm row */
[[232, 338, 35, 39], [276, 338, 36, 39], [321, 335, 37, 42], [365, 338, 36, 39]]
  .forEach(([x, y, w, h], i) => {
    const s = makeSlot(x, y, w, h, { accepts: "charm", label: "Charm", zone: "charm" });
    if (i === 0) fill(s, ITEMS.charm1);
    if (i === 1) fill(s, ITEMS.charm2);
  });
/* belt / quick row */
const QUICK = [[77, 153, 229, 305, 381, 457, 533, 608].map(x => [x, 497, 60, 65]), [[681, 497, 49, 66]]].flat();
const quickItems = [ITEMS.draught, ITEMS.wfire, ITEMS.wbolt, ITEMS.haste, ITEMS.wskull];
QUICK.forEach(([x, y, w, h], i) => {
  const s = makeSlot(x, y, w, h, { accepts: "consumable", label: "Belt", pack: true, zone: "belt" });
  if (quickItems[i]) fill(s, quickItems[i]);
});

/* inventory grid */
const COLS = [855, 907, 960, 1012, 1065, 1118, 1170, 1223, 1276, 1328, 1381, 1434, 1486];
const ROWS = [402, 458, 512, 567, 621, 676, 732, 786];
const bagItems = [
  ITEMS.key, ITEMS.wand, ITEMS.hourglass, ITEMS.mirror, ITEMS.gemL, null, ITEMS.coral, ITEMS.ironring,
  ITEMS.ring2, null, ITEMS.qbanner, null, ITEMS.amber,
  ITEMS.gauntlets, ITEMS.fetish, ITEMS.curorb, ITEMS.cursigil, ITEMS.curstone, null, ITEMS.ember, ITEMS.bowl,
];
let bi = 0;
ROWS.forEach((y, r) => COLS.forEach(x => {
  const s = makeSlot(x, y, 49, 50, { label: "Pack", pack: true, zone: "inventory" });
  const it = r < 2 ? bagItems[bi++] : null;
  if (it) fill(s, it);
}));
[1062, 1132, 1202, 1272].forEach((x, i) => {
  const s = makeSlot(x, 858, 50, 50, { label: "Reagent", pack: true, zone: "inventory" });
  if (i === 0) fill(s, ITEMS.curstone);
  if (i === 1) fill(s, ITEMS.ember);
});

/* portrait arch */
const arch = div("spread-text", { left: px(80), top: px(119), width: px(128), height: px(279) });
arch.innerHTML = `<img src="assets/med_cherub2.png" style="position:absolute;left:9px;top:52px;width:110px;height:110px;border-radius:50%;filter:drop-shadow(0 0 16px rgba(240,209,138,.25))">`;

/* info well */
const info = div("spread-text", { left: px(392), top: px(140), width: px(322), height: px(238) });
info.innerHTML = `
  <div id="charName">Aurelius</div>
  <div id="charTitle">Mage · Ninth Circle · Level 47</div>
  <div class="divider"></div>
  <div class="statline"><span>Vitality</span><b>900</b></div>
  <div class="statline"><span>Mana</span><b>540</b></div>
  <div class="statline"><span>Ward</span><b>117</b></div>
  <div class="statline"><span>Renown</span><b>2,406</b></div>`;

const plq = (x, y, w, h, k, v) => {
  const p = div("plaque-label", { left: px(x), top: px(y), width: px(w), height: px(h) });
  p.innerHTML = `<span>${k}</span><b>${v}</b>`;
};
plq(165, 441, 116, 36, "Base Armor", "188");
plq(283, 441, 113, 36, "Base Power", "241");

/* lore / inspect well */
const lore = div("spread-text", { left: px(96), top: px(608), width: px(600), height: px(280) });
function inspect(item) {
  if (!item) {
    lore.innerHTML = `
      <div id="loreTitleRow">
        <img id="loreIcon" src="assets/med_sun.png" style="border-radius:50%">
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
      <img id="loreIcon" src="assets/${item.icon}.png" style="${item.round ? "border-radius:50%" : ""}">
      <div><div id="loreName" class="rar-${item.rarity}">${item.name}</div>
      <div id="loreType">${item.type} · ${item.rarity}${item.value ? ` · worth ${item.value} gold` : ""}</div></div>
    </div>
    <div class="divider"></div>
    <div id="loreStats">${(item.stats || []).map(s => `<div>${s}</div>`).join("")}</div>
    <div id="loreBody">${item.flavor ? `<em>${item.flavor}</em>` : ""}</div>`;
}
FK.inspectItem = inspect;
inspect(null);

const inventorySelection = $("#inventorySelection");
const inventoryPrimary = $("#inventoryPrimary");
const inventoryUse = $("#inventoryUse");

function selectSlot(s) {
  document.querySelectorAll(".slot.selected").forEach(el => {
    el.classList.remove("selected");
    el.setAttribute("aria-pressed", "false");
  });
  const item = s?.item || null;
  FK.selectedSlot = item ? s : null;
  if (item) {
    s.el.classList.add("selected");
    s.el.setAttribute("aria-pressed", "true");
  }
  inspect(item);
  syncInventoryActions();
  document.dispatchEvent(new CustomEvent("fk-selection-change", { detail: { slot: item ? s : null, item } }));
}

function actionTarget(s) {
  if (!s?.item) return null;
  if (s.zone === "inventory") {
    const accepts = s.item.charm ? "charm" : s.item.equip;
    if (!accepts) return null;
    const targets = slots.filter(t => t.accepts === accepts);
    return targets.find(t => !t.item) || targets[0] || null;
  }
  return slots.find(t => t.zone === "inventory" && !t.item) || null;
}

function syncInventoryActions() {
  const s = FK.selectedSlot;
  const item = s?.item;
  inventorySelection.textContent = item
    ? `${item.name} · ${s.zone === "inventory" ? "Pack" : s.label || "Equipped"}`
    : "Select an item to inspect it.";
  const target = actionTarget(s);
  inventoryPrimary.textContent = s?.zone === "inventory" ? "Equip" : "Unequip";
  inventoryPrimary.disabled = !item || !target;
  inventoryUse.disabled = !item || !/Consumable/.test(item.type);
}

function movePrimary(s = FK.selectedSlot) {
  if (!s?.item) return false;
  const to = actionTarget(s);
  if (!to) {
    FK.notify?.("No compatible slot is available.", "bad");
    return false;
  }
  const item = s.item;
  const swapped = to.item;
  fill(to, item);
  fill(s, swapped || null);
  selectSlot(to);
  FK.notify?.(`${item.name} ${s.zone === "inventory" ? "equipped" : "moved to your pack"}.`, "good");
  return true;
}

function useConsumable(s = FK.selectedSlot) {
  if (!s?.item || !/Consumable/.test(s.item.type)) return false;
  const item = s.item;
  FK.floatText((item.stats && item.stats[0]) || item.name, "#b9e0b4", "#orbHealth");
  if (/Restores/.test((item.stats || [""])[0])) {
    FK.vitals.hp.cur = Math.min(FK.vitals.hp.max, FK.vitals.hp.cur + 180);
    FK.drawVitals();
  }
  const next = item.qty > 1 ? Object.assign({}, item, { qty: item.qty - 1 }) : null;
  fill(s, next);
  selectSlot(next ? s : null);
  FK.notify?.(`${item.name} used.`, "good");
  return true;
}
inventoryPrimary.addEventListener("click", () => movePrimary());
inventoryUse.addEventListener("click", () => useConsumable());
syncInventoryActions();

/* --------------------------------------------------- drag + inspect */
let drag = null;
let pendingDrag = null;
let dragOver = null;
const ghost = document.createElement("div");
ghost.id = "ghost";
ghost.style.display = "none";
FK.stage.appendChild(ghost);

function slotFromEvent(ev) {
  const els = document.elementsFromPoint(ev.clientX, ev.clientY);
  for (const el of els) if (el._slot) return el._slot;
  return null;
}
function canDrop(s, item) {
  if (!s.accepts) return true;
  if (s.accepts === "gem") return item.equip === "gem";
  if (s.accepts === "charm") return !!item.charm;
  if (s.accepts === "consumable") return /Consumable/.test(item.type);
  return item.equip === s.accepts;
}

let downAt = null;
overlay.addEventListener("pointerdown", ev => {
  if (ev.button !== 0) return;
  downAt = { x: ev.clientX, y: ev.clientY, t: Date.now() };
  const s = slotFromEvent(ev);
  if (!s || !s.item) return;
  pendingDrag = { from: s, item: s.item, pointerId: ev.pointerId };
  try { overlay.setPointerCapture(ev.pointerId); } catch (_) { /* capture is best-effort */ }
});

overlay.addEventListener("pointermove", ev => {
  if (pendingDrag && downAt && Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y) >= 6) {
    drag = pendingDrag;
    pendingDrag = null;
    ghost.innerHTML = `<img src="assets/${drag.item.icon}.png">`;
    ghost.style.display = "block";
    slots.forEach(t => {
      if (t !== drag.from && t.accepts && canDrop(t, drag.item)) t.el.classList.add("can-take");
    });
    FK.hideTip();
  }
  if (drag) {
    const pt = FK.stagePoint(ev);
    ghost.style.left = px(pt.x - 29); ghost.style.top = px(pt.y - 29);
    const over = slotFromEvent(ev);
    if (dragOver && dragOver !== over) dragOver.el.classList.remove("drop-ok", "drop-bad");
    dragOver = over;
    if (over && over !== drag.from)
      over.el.classList.add(canDrop(over, drag.item) ? "drop-ok" : "drop-bad");
    return;
  }
  const s = slotFromEvent(ev);
  if (s && (s.item || s.accepts)) {
    FK.showTip(s.item, s.label, FK.stagePoint(ev));
  } else if (!ev.target.closest || !ev.target.closest(".abil,.tnode,.buff,.triad,.monster,.npc,.ally,.vslot,.pane-slot,#xpbar,.orbCluster")) {
    FK.hideTip();
  }
});

overlay.addEventListener("pointerup", ev => {
  if (!drag && !pendingDrag) return;
  try { overlay.releasePointerCapture(ev.pointerId); } catch (_) { /* already released */ }
  if (pendingDrag) {
    const { from, item } = pendingDrag;
    pendingDrag = null;
    maybeInspect(ev, from, item);
    return;
  }
  ghost.style.display = "none";
  slots.forEach(s => s.el.classList.remove("drop-ok", "drop-bad", "can-take"));
  dragOver = null;
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

function maybeInspect(ev, s, item) {
  if (!downAt) return;
  const moved = Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y);
  if (moved < 6 && Date.now() - downAt.t < 500) {
    selectSlot(s);
  }
}

overlay.addEventListener("keydown", ev => {
  const s = ev.target && ev.target._slot;
  if (!s || !s.item) return;
  if (ev.key === "Enter" || ev.key === " ") {
    ev.preventDefault();
    selectSlot(s);
  } else if (ev.key.toLowerCase() === "e") {
    ev.preventDefault();
    selectSlot(s);
    movePrimary(s);
  } else if (ev.key.toLowerCase() === "u") {
    ev.preventDefault();
    selectSlot(s);
    useConsumable(s);
  }
});

/* double-click: equip / unequip */
overlay.addEventListener("dblclick", ev => {
  const s = slotFromEvent(ev);
  if (!s || !s.item) return;
  selectSlot(s);
  movePrimary(s);
});

/* right-click consumable: use one */
overlay.addEventListener("contextmenu", ev => {
  const s = slotFromEvent(ev);
  if (!s || !s.item) return;
  ev.preventDefault();
  if (!/Consumable/.test(s.item.type)) return;
  selectSlot(s);
  useConsumable(s);
});

FK.cancelDrag = () => {
  const pointerId = drag?.pointerId ?? pendingDrag?.pointerId;
  if (pointerId != null) {
    try { overlay.releasePointerCapture(pointerId); } catch (_) { /* already released */ }
  }
  drag = null;
  pendingDrag = null;
  downAt = null;
  dragOver = null;
  ghost.style.display = "none";
  slots.forEach(s => s.el.classList.remove("drop-ok", "drop-bad", "can-take"));
};
overlay.addEventListener("pointercancel", FK.cancelDrag);
addEventListener("blur", FK.cancelDrag);
document.addEventListener("fk-pane", FK.cancelDrag);
document.addEventListener("fk-workspace", FK.cancelDrag);
document.addEventListener("fk-scene", FK.cancelDrag);
})();
