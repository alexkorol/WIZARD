/* World layer: main menu, town, combat, party, chat, vendor, reliquary. */
(() => {
"use strict";
const { $, px } = FK;

/* ------------------------------------------------------------- menu */
document.querySelectorAll("#menuButtons .btn").forEach(b => {
  b.addEventListener("click", () => {
    const act = b.dataset.menu;
    if (act === "settings") { FK.openSettings(); return; }
    FK.setScene(act);
  });
});

/* ------------------------------------------------------------- chat */
const chatLogEl = $("#chatLog");
const chans = { local: [], party: [], log: [] };
let activeChan = "local";
function renderChat() {
  chatLogEl.replaceChildren(...chans[activeChan].slice(-40).map(m => {
    const line = document.createElement("div");
    line.className = `chatline ${m.cls || ""}`;
    if (m.who) {
      const who = document.createElement("b");
      who.textContent = `${m.who}:`;
      line.append(who, " ");
    }
    line.append(document.createTextNode(m.text));
    return line;
  }));
  chatLogEl.scrollTop = chatLogEl.scrollHeight;
}
FK.chatLog = (chan, text, who, cls) => {
  chans[chan].push({ text, who, cls });
  if (chan === activeChan) renderChat();
};
document.querySelectorAll(".chatTab").forEach(t =>
  t.addEventListener("click", () => {
    activeChan = t.dataset.chan;
    document.querySelectorAll(".chatTab").forEach(x =>
      x.classList.toggle("active", x === t));
    renderChat();
  }));
$("#chatInput input").addEventListener("keydown", ev => {
  if (ev.key === "Enter" && ev.target.value.trim()) {
    if (activeChan === "log") {
      activeChan = "local";
      document.querySelectorAll(".chatTab").forEach(x =>
        x.classList.toggle("active", x.dataset.chan === activeChan));
    }
    FK.chatLog(activeChan, ev.target.value.trim(), "You", "self");
    ev.target.value = "";
  }
  ev.stopPropagation();
});
FK.chatLog("local", "Entered Dungeon Level 1.", null, "sys");
FK.chatLog("party", "Party Member 1 has joined the party.", null, "sys");
FK.chatLog("party", "Party Member 2 has joined the party.", null, "sys");

/* ------------------------------------------------------------- party */
const PARTY = [
  { name: "Party Member 1", icon: "med_cherub", role: "role_shield", hp: 0.86, mp: 0.6, leader: true },
  { name: "Party Member 2", icon: "med_eaglehead", role: "role_sword", hp: 0.72, mp: 0.4, leader: false },
];
const partyEl = $("#party");
PARTY.forEach(p => {
  const d = document.createElement("div");
  d.className = "ally";
  d.tabIndex = 0;
  d.setAttribute("role", "button");
  d.innerHTML = `
    <img class="housing" src="assets/ally_housing.png">
    <img class="face" src="assets/${p.icon}.png">
    <img class="stateFrame" alt="">
    <img class="role" src="assets/${p.role}.png" alt="">
    ${p.leader ? '<img class="leader" src="assets/leader_wings.png" alt="">' : ""}
    <span class="aname">${p.name}</span>
    <span class="astate"></span>
    <div class="abar hp"><div></div></div>
    <div class="abar mp"><div></div></div>`;
  p.el = d;
  p.hpEl = d.querySelector(".abar.hp div");
  p.mpEl = d.querySelector(".abar.mp div");
  p.stateEl = d.querySelector(".stateFrame");
  p.stateLabel = d.querySelector(".astate");
  d.addEventListener("pointerenter", ev => {
    const status = p.dead ? "Dead" : p.downed ? "Downed · click to revive" : `${Math.round(p.hp * 100)}% life`;
    FK.showTip(null, `${p.name} · ${status}`, FK.stagePoint(ev));
  });
  d.addEventListener("pointerleave", FK.hideTip);
  const activate = () => { if (p.downed && !p.dead) reviveParty(p); };
  d.addEventListener("click", activate);
  d.addEventListener("keydown", ev => {
    if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); activate(); }
  });
  partyEl.appendChild(d);
});
function drawParty() {
  PARTY.forEach(p => {
    p.hpEl.style.width = px(Math.round(150 * (1 - p.hp)));
    p.mpEl.style.width = px(Math.round(150 * (1 - p.mp)));
    p.el.classList.toggle("downed", !!p.downed && !p.dead);
    p.el.classList.toggle("dead", !!p.dead);
    p.el.setAttribute("aria-label", p.dead ? `${p.name}, fallen` : p.downed
      ? `${p.name}, downed, revive` : `${p.name}, ${Math.round(p.hp * 100)} percent life`);
    if (p.dead || p.downed) {
      p.stateEl.src = `assets/${p.dead ? "dead_frame" : "downed_frame"}.png`;
    } else {
      p.stateEl.removeAttribute("src");
    }
    p.stateLabel.textContent = p.dead ? "Dead" : p.downed ? "Revive" : "";
  });
}
function reviveParty(p) {
  clearTimeout(p.fallTimer);
  p.downed = false;
  p.dead = false;
  p.hp = 0.35;
  drawParty();
  FK.chatLog("party", `${p.name} is back on their feet.`, null, "good");
}
function damageParty(p, amount) {
  if (p.dead || p.downed) return;
  p.hp = Math.max(0, p.hp - amount);
  if (p.hp === 0) {
    p.downed = true;
    FK.chatLog("party", `${p.name} is down. Revive them within 8 seconds.`, null, "bad");
    p.fallTimer = setTimeout(() => {
      if (!p.downed) return;
      p.dead = true;
      drawParty();
      FK.chatLog("party", `${p.name} died. Return to Dungeon Level 1 to revive.`, null, "bad");
    }, 8000);
  }
  drawParty();
}
drawParty();

/* ------------------------------------------------------------- town */
const townEl = $("#sceneTown");
const NPCS = [
  { name: "Armour Vendor", icon: "med_bull", x: 560, y: 470, open: "trade" },
  { name: "Vendor", icon: "laurel_sun", x: 960, y: 380, open: "reliquary" },
  { name: "Journal", icon: "med_cherub", x: 1310, y: 500, open: "codex" },
];
NPCS.forEach(n => {
  const d = document.createElement("div");
  d.className = "npc";
  d.tabIndex = 0;
  d.setAttribute("role", "button");
  d.setAttribute("aria-label", `${n.name}, open ${n.open}`);
  d.style.left = px(n.x); d.style.top = px(n.y);
  d.innerHTML = `
    <img class="face" src="assets/${n.icon}.png" alt="">
    <span class="plate"><img src="assets/plate_winged.png" alt=""><b>${n.name}</b></span>`;
  const activate = () => {
    FK.openPane("left", n.open);
    if ((n.open === "trade" || n.open === "reliquary") && !FK.paneState.right)
      FK.openPane("right", n.open === "reliquary" ? "cosmetics" : "inventory");
  };
  d.addEventListener("click", activate);
  d.addEventListener("keydown", ev => {
    if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); activate(); }
  });
  d.addEventListener("pointerenter", ev =>
    FK.showTip(null, n.open ? `${n.name} — click to ${n.open === "trade" ? "trade" : "browse"}` : n.name, FK.stagePoint(ev)));
  d.addEventListener("pointerleave", FK.hideTip);
  townEl.appendChild(d);
});
const portal = document.createElement("div");
portal.className = "npc portal";
portal.tabIndex = 0;
portal.setAttribute("role", "button");
portal.setAttribute("aria-label", "Enter Dungeon Level 2");
portal.style.left = px(1620); portal.style.top = px(430);
portal.innerHTML = `
  <img class="face" src="assets/socket_gold.png" alt="">
  <span class="plate"><img src="assets/plate_winged.png" alt=""><b>To Dungeon Level 2</b></span>`;
portal.addEventListener("click", () => FK.setScene("combat"));
portal.addEventListener("keydown", ev => {
  if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); FK.setScene("combat"); }
});
townEl.appendChild(portal);

/* ------------------------------------------------------------ combat */
const combatEl = $("#sceneCombat");
const MONSTERS = [
  { name: "Skeleton", icon: "med_skull", rarity: "normal", max: 220, x: 520, y: 520, size: 74 },
  { name: "Skeleton", icon: "med_skull", rarity: "normal", max: 220, x: 660, y: 610, size: 74 },
  { name: "Adder", icon: "med_snake", rarity: "magic", max: 420, x: 900, y: 470, size: 84,
    affix: "Quick · Venomous" },
  { name: "Chained Guard", icon: "med_chain", rarity: "rare", max: 900, x: 1180, y: 560, size: 100,
    affix: "Cannot Be Knocked Back" },
];
const BOSS = { name: "Boss", icon: "med_lion", rarity: "unique",
  max: 4200, x: 1500, y: 420, size: 136 };
const bossBar = $("#bossBar");
const bossDeplete = bossBar.querySelector(".deplete");
$("#bossName").textContent = BOSS.name;

function spawnMonster(m) {
  m.cur = m.max;
  m.dead = false;
  const d = document.createElement("div");
  d.className = `monster rar-m-${m.rarity}`;
  d.tabIndex = 0;
  d.setAttribute("role", "button");
  d.style.left = px(m.x); d.style.top = px(m.y);
  d.innerHTML = `
    <span class="mname">${m.name}</span>
    ${m.affix ? `<span class="maffix">${m.affix}</span>` : ""}
    <div class="mbar"><div></div></div>
    <img class="mface" src="assets/${m.icon}.png" alt="" style="width:${m.size}px;height:${m.size}px">`;
  m.el = d;
  m.barEl = d.querySelector(".mbar div");
  const attack = () => hitMonster(m);
  d.addEventListener("click", attack);
  d.addEventListener("keydown", ev => {
    if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); attack(); }
  });
  d.addEventListener("pointerenter", ev =>
    FK.showTip(null, `${m.name} · ${Math.max(0, Math.round(m.cur))} / ${m.max}`, FK.stagePoint(ev)));
  d.addEventListener("pointerleave", FK.hideTip);
  combatEl.appendChild(d);
  drawMonster(m);
}
function drawMonster(m) {
  m.barEl.style.width = (100 * Math.max(0, m.cur) / m.max).toFixed(1) + "%";
  m.el.setAttribute("aria-label", `${m.name}, ${Math.max(0, Math.round(m.cur))} of ${m.max} health${m.dead ? ", defeated" : ", attack"}`);
  if (m === BOSS) bossDeplete.style.width = px(Math.round(560 * (1 - Math.max(0, m.cur) / m.max)));
}
function hitMonster(m) {
  if (m.dead) return;
  const dmg = 40 + Math.round(Math.random() * 60);
  const crit = Math.random() < 0.18;
  m.cur -= crit ? dmg * 2 : dmg;
  const f = document.createElement("span");
  f.className = "floater dmg" + (crit ? " crit" : "");
  f.textContent = crit ? `${dmg * 2}!` : dmg;
  m.el.appendChild(f);
  setTimeout(() => f.remove(), 1000);
  drawMonster(m);
  if (m.cur <= 0) {
    m.dead = true;
    m.el.classList.add("dead");
    m.el.tabIndex = -1;
    m.el.setAttribute("aria-disabled", "true");
    m.el.setAttribute("aria-label", `${m.name}, defeated`);
    FK.chatLog("log", `${m.name} destroyed.`, null, "good");
    if (Math.random() < 0.5) {
      const drop = [FK.ITEMS.curstone, FK.ITEMS.draught, FK.ITEMS.coral, FK.ITEMS.curorb][Math.floor(Math.random() * 4)];
      FK.addToPack(Object.assign({}, drop));
      FK.chatLog("log", `Picked up: ${drop.name}.`, null, "loot");
    }
    const goldDrop = 8 + Math.round(Math.random() * 30);
    FK.setGold(FK.gold + goldDrop);
    FK.chatLog("log", `+${goldDrop} gold.`, null, "loot");
    setTimeout(() => {
      if (m !== BOSS) { m.el.remove(); spawnMonster(m); }
      else bossBar.classList.remove("show");
    }, 3000);
  }
}
MONSTERS.forEach(spawnMonster);
spawnMonster(BOSS);

const exitPlate = document.createElement("div");
exitPlate.className = "npc portal";
exitPlate.tabIndex = 0;
exitPlate.setAttribute("role", "button");
exitPlate.setAttribute("aria-label", "Return to Dungeon Level 1");
exitPlate.style.left = px(320); exitPlate.style.top = px(300);
exitPlate.innerHTML = `
  <img class="face" src="assets/socket_ring.png" alt="">
  <span class="plate"><img src="assets/plate_winged.png" alt=""><b>Return to Level 1</b></span>`;
const returnToTown = () => FK.setScene("town");
exitPlate.addEventListener("click", returnToTown);
exitPlate.addEventListener("keydown", ev => {
  if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); returnToTown(); }
});
combatEl.appendChild(exitPlate);

/* monsters fight back while the combat scene is active */
setInterval(() => {
  if (FK.scene !== "combat") return;
  const alive = MONSTERS.concat([BOSS]).filter(m => !m.dead);
  if (!alive.length) return;
  if (Math.random() < 0.65) {
    const dmg = 6 + Math.round(Math.random() * 12);
    FK.damagePlayer(dmg);
    FK.chatLog("log", `You take ${dmg} damage.`, null, "bad");
  } else {
    const standing = PARTY.filter(p => !p.dead && !p.downed);
    if (standing.length) {
      const p = standing[Math.floor(Math.random() * standing.length)];
      damageParty(p, 0.07 + Math.random() * 0.06);
    }
  }
}, 2200);
setInterval(() => {
  PARTY.forEach(p => {
    if (!p.dead && !p.downed) p.hp = Math.min(1, p.hp + 0.002);
    if (!p.dead) p.mp = Math.min(1, p.mp + 0.02);
  });
  drawParty();
}, 1000);

function syncScene(s) {
  if (s === "town") {
    PARTY.forEach(p => {
      clearTimeout(p.fallTimer);
      p.dead = false; p.downed = false; p.hp = Math.max(p.hp, 0.55);
    });
    drawParty();
  }
  townEl.classList.toggle("active", s === "town");
  combatEl.classList.toggle("active", s === "combat");
  bossBar.classList.toggle("show", s === "combat" && !BOSS.dead);
  $("#locationName").textContent =
    s === "combat" ? "Dungeon Level 2" : "Dungeon Level 1";
  if (s === "combat") FK.chatLog("log", "Entered Dungeon Level 2.", null, "sys");
}
document.addEventListener("fk-scene", ev => syncScene(ev.detail));
syncScene(FK.scene); /* core may have routed a deep link before we listened */

/* ------------------------------------------------------------ vendor */
const STOCK = [
  ["wand", 340], ["amber", 210], ["fetish", 75],
  ["ember", 130], ["bowl", 95], ["gemR", 150], ["draught", 45],
];
const vendorOverlay = $("#vendorOverlay");
STOCK.forEach(([key, price], i) => {
  const item = Object.assign({}, FK.ITEMS[key], { price });
  const d = document.createElement("button");
  d.type = "button";
  d.className = "vslot pane-slot";
  d.setAttribute("aria-label", `${item.name}, ${price} gold`);
  d.innerHTML = `<img src="assets/${item.icon}.png" class="${item.round ? "round" : ""}" alt=""><span class="vprice">${price}</span>`;
  d.addEventListener("pointerenter", ev => FK.showTip(item, item.name, FK.stagePoint(ev)));
  d.addEventListener("pointerleave", FK.hideTip);
  d.addEventListener("click", () => {
    if (d.classList.contains("sold")) return;
    if (FK.gold < price) {
      d.classList.add("shake");
      setTimeout(() => d.classList.remove("shake"), 350);
      FK.chatLog("log", `Not enough gold for ${item.name}.`, null, "bad");
      FK.notify?.(`Not enough gold for ${item.name}.`, "bad");
      return;
    }
    if (!FK.addToPack(Object.assign({}, FK.ITEMS[key]))) {
      FK.chatLog("log", "Your pack is full.", null, "bad");
      FK.notify?.("Your pack is full.", "bad");
      return;
    }
    FK.setGold(FK.gold - price);
    d.classList.add("sold");
    d.disabled = true;
    d.querySelector(".vprice").textContent = "Sold";
    d.setAttribute("aria-label", `${item.name}, sold`);
    FK.chatLog("log", `Bought ${item.name} for ${price} gold.`, null, "loot");
    FK.notify?.(`${item.name} added to your pack.`, "good");
  });
  vendorOverlay.appendChild(d);
});

/* The counterparty shop and player offer are separate, mirroring a real trade window. */
const tradeOfferItem = $("#tradeOfferItem");
const tradeAddOffer = $("#tradeAddOffer");
const tradeAccept = $("#tradeAccept");
const tradeCancel = $("#tradeCancel");
const vendorHint = $("#vendorHint");
let tradeOffer = null;
function syncTradeOffer() {
  const selected = FK.selectedSlot;
  const canOffer = Boolean(selected?.item && selected.zone === "inventory" && selected.item.value);
  tradeAddOffer.disabled = !canOffer;
  tradeAddOffer.setAttribute("aria-label", canOffer ? `Offer ${selected.item.name} to the vendor` : "Offer selected pack item to the vendor");
  tradeAccept.disabled = !tradeOffer;
  tradeCancel.disabled = !tradeOffer;
  if (!tradeOffer) tradeOfferItem.textContent = canOffer
    ? `${selected.item.name} selected · the vendor will quote a price.`
    : "Select a valuable pack item to sell.";
}
function clearTradeOffer(message = "Offer cleared.") {
  tradeOffer = null;
  vendorHint.textContent = message;
  syncTradeOffer();
}
tradeAddOffer.addEventListener("click", () => {
  const slot = FK.selectedSlot;
  if (!slot?.item || slot.zone !== "inventory" || !slot.item.value) return;
  const quantity = slot.item.qty || 1;
  const quote = Math.max(1, Math.floor(slot.item.value * quantity * 0.55));
  tradeOffer = { slot, item: slot.item, quote, quantity };
  tradeOfferItem.textContent = `${slot.item.name}${quantity > 1 ? ` ×${quantity}` : ""} · the vendor offers ${quote} gold.`;
  vendorHint.textContent = "Accept the vendor's price, or cancel to keep the item.";
  tradeAccept.disabled = false;
  tradeCancel.disabled = false;
});
tradeAccept.addEventListener("click", () => {
  if (!tradeOffer) return;
  const { slot, item, quote, quantity } = tradeOffer;
  if (slot.item !== item) {
    clearTradeOffer("The offered item moved. Select it again.");
    FK.notify?.("The offered item moved.", "bad");
    return;
  }
  FK.removeFromPack(slot, quantity);
  FK.setGold(FK.gold + quote);
  FK.chatLog("log", `Sold ${item.name} to the vendor for ${quote} gold.`, null, "loot");
  FK.notify?.(`Trade accepted · +${quote} gold`, "good");
  clearTradeOffer("Trade complete.");
});
tradeCancel.addEventListener("click", () => clearTradeOffer());
document.addEventListener("fk-selection-change", () => {
  if (tradeOffer && tradeOffer.slot.item !== tradeOffer.item) tradeOffer = null;
  syncTradeOffer();
});
document.addEventListener("fk-inventory-change", () => {
  if (tradeOffer && tradeOffer.slot.item !== tradeOffer.item) tradeOffer = null;
  syncTradeOffer();
});
syncTradeOffer();

/* ------------------------------------------------------------- shop */
const MTX = FK.COSMETICS = [
  { id: "gleam", slot: "weapon", card: "card_gold", icon: "laurel_sun", name: "Gold Weapon Glow", price: 950, flavor: "Weapon effect", owned: false },
  { id: "footprints", slot: "trail", card: "card_green", icon: "med_flower", name: "Green Footprints", price: 420, flavor: "Footstep trail", owned: true },
  { id: "portal", slot: "portal", card: "card_red", icon: "tri_fire", name: "Fire Portal", price: 780, flavor: "Portal effect", owned: false },
];
const cardsEl = $("#shopCards");
MTX.forEach(cosmetic => {
  const { card, icon, name, price, flavor } = cosmetic;
  const d = document.createElement("div");
  d.className = "shopCard";
  d.innerHTML = `
    <img class="cardArt" src="assets/${card}.png" alt="">
    <img class="cardIcon" src="assets/${icon}.png" alt="">
    <div class="cardName">${name}</div>
    <div class="cardFlavor">${flavor}</div>
    <button class="btn small" aria-label="Buy ${name} for ${price} points"><img src="assets/btn_primary.png" alt=""><span>${price} points</span></button>`;
  const btn = d.querySelector(".btn");
  if (cosmetic.owned) {
    d.classList.add("owned");
    btn.classList.add("owned");
    btn.disabled = true;
    btn.querySelector("span").textContent = "Owned";
    btn.setAttribute("aria-label", `${name}, owned`);
  }
  btn.addEventListener("click", () => {
    if (cosmetic.owned) return;
    if (FK.shards < price) {
      btn.classList.add("shake");
      setTimeout(() => btn.classList.remove("shake"), 350);
      FK.notify?.(`You need ${price - FK.shards} more points.`, "bad");
      return;
    }
    FK.setShards(FK.shards - price);
    cosmetic.owned = true;
    d.classList.add("owned");
    btn.classList.add("owned");
    btn.disabled = true;
    btn.querySelector("span").textContent = "Owned";
    btn.setAttribute("aria-label", `${name}, owned`);
    FK.chatLog("log", `Unlocked: ${name}.`, null, "loot");
    FK.notify?.(`${name} unlocked.`, "good");
    document.dispatchEvent(new CustomEvent("fk-cosmetics-change"));
  });
  cardsEl.appendChild(d);
});
})();
