/* Functional content for FrameKit's independent side panes. */
(() => {
"use strict";
const { $, ITEMS } = FK;

const STASH_CAPACITY = 40;
const STASH = [
  "greataxe", "gauntlets", "amber", "mirror", "fetish", "gemR", "gemE",
  "curorb", "cursigil", "curstone", "draught", "ember", "bowl", "ironring",
  "coral", "hourglass", "wand", "ring2",
].map(key => Object.assign({}, ITEMS[key]));
while (STASH.length < STASH_CAPACITY) STASH.push(null);

function itemButton(item, className = "pane-slot") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.setAttribute("aria-label", `${item.name}, ${item.rarity}${item.qty > 1 ? `, quantity ${item.qty}` : ""}`);
  button.innerHTML = `<img src="assets/${item.icon}.png" alt=""><span class="slot-qty">${item.qty > 1 ? item.qty : ""}</span>`;
  button.addEventListener("pointerenter", ev => FK.showTip(item, item.name, FK.stagePoint(ev)));
  button.addEventListener("pointerleave", FK.hideTip);
  return button;
}

/* --------------------------------------------------------------- stash */
const stashGrid = $("#stashGrid");
const stashCount = $("#stashCount");
const stashTarget = $("#stashTarget");
const stashDeposit = $("#stashDeposit");
function renderStash() {
  stashGrid.replaceChildren();
  stashCount.textContent = `Account storage · ${STASH.filter(Boolean).length} / ${STASH_CAPACITY}`;
  STASH.forEach((item, index) => {
    if (!item) {
      const empty = document.createElement("div");
      empty.className = "pane-slot empty";
      empty.setAttribute("aria-hidden", "true");
      stashGrid.appendChild(empty);
      return;
    }
    const button = itemButton(item);
    button.title = "Move to inventory";
    button.setAttribute("aria-label", `${button.getAttribute("aria-label")}, move to inventory`);
    button.addEventListener("click", () => {
      if (!FK.addToPack(Object.assign({}, item))) {
        FK.chatLog("log", "Your inventory is full.", null, "bad");
        FK.notify?.("Your inventory is full.", "bad");
        button.classList.add("shake");
        setTimeout(() => button.classList.remove("shake"), 350);
        return;
      }
      STASH[index] = null;
      FK.openPane("right", "inventory");
      FK.chatLog("log", `${item.name} moved from stash to inventory.`, null, "loot");
      FK.notify?.(`${item.name} moved to your pack.`, "good");
      renderStash();
    });
    stashGrid.appendChild(button);
  });
  syncSelectionTools();
}
function syncSelectionTools() {
  const slot = FK.selectedSlot;
  const canDeposit = Boolean(slot?.item && slot.zone === "inventory" && STASH.includes(null));
  stashTarget.textContent = slot?.item && slot.zone === "inventory"
    ? `${slot.item.name} selected for storage.`
    : "Select an inventory item to deposit it.";
  stashDeposit.disabled = !canDeposit;
}
stashDeposit.addEventListener("click", () => {
  const slot = FK.selectedSlot;
  const target = STASH.indexOf(null);
  if (target < 0 || !slot?.item || slot.zone !== "inventory") return;
  const item = Object.assign({}, slot.item);
  const removed = FK.removeFromPack(slot, slot.item.qty || 1);
  if (!removed) return;
  STASH[target] = item;
  FK.chatLog("log", `${item.name} moved from inventory to stash.`, null, "loot");
  FK.notify?.(`${item.name} stored in your stash.`, "good");
  renderStash();
});
renderStash();

/* --------------------------------------------------------------- codex */
const CODEX = [
  { title: "Warden of the Verdant Seal", type: "Standing · The Sunken Archive", icon: "med_sun",
    body: "The lower vaults have been quiet for nine days. The lamps along the long stair are lit and the ledger is current." },
  ...Object.values(ITEMS).filter(item => item.flavor || /Quest|Key|Curio/.test(item.type)).map(item => ({
    title: item.name, type: item.type, icon: item.icon,
    body: item.flavor || (item.stats || []).join(" · "), rarity: item.rarity,
  })),
];
const codexList = $("#codexList");
const codexEntry = $("#codexEntry");
function selectCodex(entry, button) {
  codexList.querySelectorAll("button").forEach(b => b.setAttribute("aria-current", String(b === button)));
  codexEntry.innerHTML = `<img src="assets/${entry.icon}.png" alt=""><div><p>${entry.type}</p><h3 class="rar-${entry.rarity || "common"}">${entry.title}</h3><div class="codex-rule"></div><p>${entry.body}</p></div>`;
}
CODEX.forEach((entry, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "codex-entry";
  button.id = `codex-entry-${index}`;
  button.setAttribute("aria-controls", "codexEntry");
  button.innerHTML = `<img src="assets/${entry.icon}.png" alt=""><span><b>${entry.title}</b><small>${entry.type}</small></span>`;
  button.addEventListener("click", () => selectCodex(entry, button));
  codexList.appendChild(button);
  if (index === 0) selectCodex(entry, button);
});

/* ------------------------------------------------------------ crafting */
const RECIPES = [
  { id: "reforge", catalyst: "curorb", title: "Reforge Colors", text: "Use a Chromatic Orb on selected equipment.", mark: "Prismatic", stat: "Sockets reforged at the Brass Crucible" },
  { id: "hone", catalyst: "curstone", title: "Hone Quality", text: "Use a Whetstone to temper selected equipment.", mark: "Tempered", stat: "+5% quality from Crucible honing" },
  { id: "seal", catalyst: "cursigil", title: "Seal Modifier", text: "Use a Binding Sigil to seal the selected item's inscription.", mark: "Sealed", stat: "Inscription sealed against reforging" },
];
const craftRecipes = $("#craftRecipes");
const craftTarget = $("#craftTarget");
function catalystCount(key) {
  return FK.inventorySlots().reduce((n, slot) => n + (slot.item?.key === key ? (slot.item.qty || 1) : 0), 0);
}
function syncCrafting() {
  const slot = FK.selectedSlot;
  const valid = Boolean(slot?.item?.equip && slot.zone === "inventory");
  craftTarget.textContent = valid ? `Target · ${slot.item.name}` : "Select equipment in Inventory.";
  RECIPES.forEach(recipe => {
    const applied = Boolean(valid && slot.item.crafted?.[recipe.id]);
    const count = catalystCount(recipe.catalyst);
    recipe.button.disabled = !valid || applied || count < 1;
    recipe.button.textContent = applied ? "Applied" : `Craft · ${count}`;
    recipe.button.title = applied ? "This operation is already applied" : `${count} ${ITEMS[recipe.catalyst].name} available`;
    recipe.button.setAttribute("aria-label", applied
      ? `${recipe.title}, already applied to ${slot.item.name}`
      : valid
        ? `${recipe.title} on ${slot.item.name}, ${count} catalysts available`
        : `${recipe.title}, select equipment in Inventory first`);
  });
}
function craft(recipe, button) {
  const slot = FK.selectedSlot;
  if (!slot || !slot.item || !slot.item.equip || slot.zone !== "inventory") {
    FK.chatLog("log", "Select a piece of equipment in Inventory first.", null, "bad");
    FK.notify?.("Select equipment in Inventory first.", "bad");
    button.classList.add("shake");
    setTimeout(() => button.classList.remove("shake"), 350);
    FK.openPane("right", "inventory");
    return;
  }
  if (slot.item.crafted?.[recipe.id]) return;
  if (!FK.consumeItem(recipe.catalyst)) {
    FK.chatLog("log", `No ${ITEMS[recipe.catalyst].name} remains in your inventory.`, null, "bad");
    FK.notify?.(`No ${ITEMS[recipe.catalyst].name} remains.`, "bad");
    return;
  }
  const item = Object.assign({}, slot.item, {
    name: `${recipe.mark} ${slot.item.name}`,
    stats: [...(slot.item.stats || []), recipe.stat],
    crafted: { ...(slot.item.crafted || {}), [recipe.id]: true },
  });
  FK.fillSlot(slot, item);
  FK.selectedSlot = slot;
  slot.el.classList.add("selected");
  FK.inspectItem(item);
  document.dispatchEvent(new CustomEvent("fk-selection-change", { detail: { slot, item } }));
  FK.chatLog("log", `${item.name} completed.`, null, "good");
  FK.notify?.(`${item.name} completed.`, "good");
  syncCrafting();
}
RECIPES.forEach(recipe => {
  const item = ITEMS[recipe.catalyst];
  const row = document.createElement("article");
  row.className = "craft-recipe";
  row.innerHTML = `<img src="assets/${item.icon}.png" alt=""><div><h3>${recipe.title}</h3><p>${recipe.text}</p></div><button class="pane-action" type="button">Craft</button>`;
  recipe.button = row.querySelector("button");
  recipe.button.addEventListener("click", ev => craft(recipe, ev.currentTarget));
  craftRecipes.appendChild(row);
});
document.addEventListener("fk-selection-change", () => { syncSelectionTools(); syncCrafting(); });
document.addEventListener("fk-inventory-change", () => { syncSelectionTools(); syncCrafting(); });
syncCrafting();

/* ----------------------------------------------------------- cosmetics */
const cosmeticGrid = $("#cosmeticGrid");
const cosmeticPreview = $("#cosmeticPreview");
const equipped = new Set();
function renderCosmetics() {
  const cosmetics = FK.COSMETICS || [];
  cosmeticGrid.replaceChildren();
  cosmeticPreview.innerHTML = `<img src="assets/med_cherub2.png" alt="Aurelius"><div><span>${equipped.size ? "Ceremonial effects active" : "Unadorned"}</span><b>${[...equipped].map(id => cosmetics.find(c => c.id === id)?.name).filter(Boolean).join(" · ") || "No cosmetics equipped"}</b></div>`;
  cosmetics.forEach(cosmetic => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pane-card cosmetic-card";
    const isEquipped = equipped.has(cosmetic.id);
    if (cosmetic.owned) button.setAttribute("aria-pressed", String(isEquipped));
    button.setAttribute("aria-label", cosmetic.owned
      ? `${cosmetic.name}, ${isEquipped ? "equipped" : "owned"}`
      : `${cosmetic.name}, locked, ${cosmetic.price} shards in the Reliquary`);
    button.innerHTML = `<img src="assets/${cosmetic.icon}.png" alt=""><b>${cosmetic.name}</b><small>${cosmetic.owned ? (isEquipped ? "Equipped" : "Owned") : `${cosmetic.price} shards`}</small>`;
    button.addEventListener("click", () => {
      if (!cosmetic.owned) {
        FK.openPane("left", "reliquary");
        FK.chatLog("log", `${cosmetic.name} is available in the Reliquary.`, null, "sys");
        FK.notify?.(`${cosmetic.name} is locked.`, "bad");
        return;
      }
      if (isEquipped) equipped.delete(cosmetic.id);
      else {
        cosmetics.filter(c => c.slot === cosmetic.slot).forEach(c => equipped.delete(c.id));
        equipped.add(cosmetic.id);
      }
      FK.stage.dataset.cosmetics = [...equipped].join(" ");
      FK.chatLog("log", `${cosmetic.name} ${isEquipped ? "unequipped" : "equipped"}.`, null, "good");
      FK.notify?.(`${cosmetic.name} ${isEquipped ? "unequipped" : "equipped"}.`, "good");
      renderCosmetics();
    });
    cosmeticGrid.appendChild(button);
  });
}
document.addEventListener("fk-cosmetics-change", renderCosmetics);
renderCosmetics();
})();
