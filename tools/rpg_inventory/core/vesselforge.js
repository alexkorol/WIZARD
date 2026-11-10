/* =============================================================================
   Item crafting engine (file name kept for links: vesselforge.js)
   -----------------------------------------------------------------------------
   Zero dependencies. UMD: browser global `VesselForge` or Node require().
   All game content lives in a pack (see verdigris-pack.js); the engine is
   only rules. Items are plain JSON. RNG is seedable for reproducible tests.

   PROVISIONAL (docs/CRAFTING-PROVISIONAL.md, owner rule 52): the PoE crafting
   blueprint, adapted. Brands ✦ take the place of prefixes (crafted, fixed
   stat lines); bonds ◈ take the place of suffixes (they grow with the
   character's deeds: bond XP, Bond I → III). Animal parts ✧ also take a
   modifier place. Rarity sets the room: Normal holds no modifiers, Magic one
   or two, Rare up to four (at most two brands, up to three bonds). Add
   Modifier on a Normal item makes it Magic. Crafting is
   limited only by that room. The owner tunes all numbers in playtest.
   ============================================================================= */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.VesselForge = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------------- RNG (mulberry32, seedable) ---------------- */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const fmt = (tpl, v) => String(tpl).replace(/\{v\}/g, v);
  const ROMAN = ['I', 'II', 'III'];
  const RARITIES = ['normal', 'magic', 'rare'];
  const RARITY_NAMES = { normal: 'Normal', magic: 'Magic', rare: 'Rare' };
  /* Fields from the earlier draft (crafting uses, locked slots, material
     upgrade count, fixed slot count). Old saves carry them; normalizeItem
     strips them so they never reach the rules or the UI. */
  const REMOVED_ITEM_FIELDS = ['patience', 'patienceMax', 'scars', 'fired', 'vessel'];

  /* ---------------- Pack validation ---------------- */
  function validatePack(pack) {
    const issues = [];
    const need = (cond, msg) => { if (!cond) issues.push(msg); };
    need(pack && pack.id, 'pack.id missing');
    ['materials', 'forms', 'brandMods', 'themes', 'archetypes', 'settings'].forEach(k =>
      need(pack[k], `pack.${k} missing`));
    if (issues.length) return issues;

    Object.entries(pack.forms).forEach(([id, f]) => {
      need(f.kind && f.w > 0 && f.h > 0, `form ${id}: kind/w/h invalid`);
      (f.materials || []).forEach(m => need(pack.materials[m], `form ${id}: unknown material ${m}`));
      if (f.implicit) need(f.implicit.label, `form ${id}: implicit needs label`);
    });
    Object.entries(pack.materials).forEach(([id, m]) => {
      need(m.tier >= 1, `material ${id}: tier missing`);
    });
    Object.entries(pack.brandMods).forEach(([id, mod]) => {
      need(Array.isArray(mod.tiers) && mod.tiers.length, `brandMod ${id}: tiers missing`);
      need(Array.isArray(mod.kinds) && mod.kinds.length, `brandMod ${id}: kinds missing`);
      need(mod.label, `brandMod ${id}: label missing`);
    });
    Object.entries(pack.archetypes).forEach(([id, a]) =>
      need(pack.themes[a.themeId], `archetype ${id}: unknown theme ${a.themeId}`));
    Object.entries(pack.themes).forEach(([id, t]) => {
      need(t.mods && Object.keys(t.mods).length, `theme ${id}: no mods`);
      Object.entries(t.mods).forEach(([mid, m]) =>
        need(m.name && m.label && Array.isArray(m.roll), `theme ${id}.${mid}: name/label/roll required`));
    });
    Object.entries(pack.trophies || {}).forEach(([id, t]) => {
      need(t.fragments >= 1, `trophy ${id}: fragments count missing`);
      need(Array.isArray(t.mods) && t.mods.length, `trophy ${id}: mods missing`);
    });
    Object.entries(pack.pigments || {}).forEach(([id, p]) =>
      need(p.weights && Object.keys(p.weights).length, `pigment ${id}: weights missing`));
    Object.entries(pack.omens || {}).forEach(([id, o]) =>
      need(o.tag, `omen ${id}: tag missing`));
    return issues;
  }

  /* ---------------- Forge factory ---------------- */
  function createForge(pack, opts = {}) {
    const issues = validatePack(pack);
    if (issues.length) throw new Error('invalid pack: ' + issues.join('; '));

    const S = Object.assign({
      tierMults: [1, 1.6, 2.2],
      brandTierWeights: [10, 5, 2],   // weight of tier index 0/1/2 when gated in
      attuneBase: 80, attuneStep: 55,
      /* Room per rarity (provisional). Rare: up to two brands and four
         modifiers in all; bonds may reach three (with one brand) so that three
         bonds at Bond III can upgrade the item. */
      rarityLimits: {
        normal: { brands: 0, bonds: 0, total: 0 },
        magic: { brands: 2, bonds: 2, total: 2 },
        rare: { brands: 2, bonds: 3, total: 4 },
      },
      bondsToUpgrade: 3,
      /* Drop rarity weights before Item Rarity (provisional). */
      dropRarityWeights: { normal: 70, magic: 25, rare: 5 },
      dropBrands: { magic: [1, 2], rare: [1, 2] },
      sellBase: 25,
    }, pack.settings);

    let rand = mulberry32(opts.seed != null ? opts.seed : (Math.random() * 2 ** 32) | 0);
    const rnd = () => rand();
    const rint = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    const pickWeighted = (entries) => { // entries: [{w, ...}]
      const total = entries.reduce((s, e) => s + e.w, 0);
      if (total <= 0) return null;
      let roll = rnd() * total;
      for (const e of entries) { roll -= e.w; if (roll <= 0) return e; }
      return entries[entries.length - 1];
    };
    let idCounter = 0;
    const genId = () => 'vf' + (++idCounter).toString(36) + Math.floor(rnd() * 1e6).toString(36);
    const retiredForms = new Set(pack.retiredForms || []);
    const retiredMaterials = new Set(pack.retiredMaterials || []);
    const retiredArtIds = new Set(pack.retiredArtIds || []);
    const itemArtId = (formId, materialId) => `${formId}_${materialId}`;
    const isRetiredCombo = (formId, materialId) =>
      retiredForms.has(formId) || retiredMaterials.has(materialId) || retiredArtIds.has(itemArtId(formId, materialId));

    /* ---------------- basic queries ---------------- */
    const material = (item) => pack.materials[item.materialId];
    const form = (item) => pack.forms[item.formId];
    const isCraftable = (item) => !!(item && form(item) && !form(item).noVessel);
    const limits = (item) => S.rarityLimits[item.rarity] || S.rarityLimits.normal;
    const usedSlots = (item) => item.brands.length + item.bonds.length + item.trophies.length;
    const freeSlots = (item) => (isCraftable(item) ? Math.max(0, limits(item).total - usedSlots(item)) : 0);
    const canAddBrand = (item) => freeSlots(item) > 0 && item.brands.length < limits(item).brands;
    const canAddBond = (item) => freeSlots(item) > 0 && item.bonds.length < limits(item).bonds;
    const brandMod = (b) => pack.brandMods[b.modId];
    const bondMod = (b) => pack.themes[b.themeId].mods[b.modId];
    const bondValue = (bond) => {
      const v = bond.base * S.tierMults[bond.tier - 1];
      return v < 4 ? Math.round(v * 10) / 10 : Math.round(v);
    };
    const baseName = (item) => item.epithetName || `${material(item).name} ${form(item).name}`;
    const displayName = (item) => item.awakened ? item.awakened.name : baseName(item);
    const rarityName = (item) => RARITY_NAMES[item.rarity] || RARITY_NAMES.normal;
    const dominantBondTheme = (item) => {
      if (!item.bonds.length) return null;
      const counts = {};
      item.bonds.forEach(b => { counts[b.themeId] = (counts[b.themeId] || 0) + b.tier; });
      return Object.keys(pack.themes).sort((a, b) => (counts[b] || 0) - (counts[a] || 0))[0];
    };
    const nextSeq = (item) => {
      const all = [...item.brands, ...item.bonds, ...item.trophies];
      return all.reduce((m, x) => Math.max(m, x.seq || 0), 0) + 1;
    };

    /* ---------------- old saves ---------------- */
    /* Loads an item from any earlier save: strips removed fields (crafting
       uses, locked slots, class tag on bonds), assigns a rarity from what the
       item holds, and orders modifiers so Remove Last Modifier works. Items
       over their rarity's room keep every modifier; only adding is blocked. */
    function normalizeItem(src) {
      if (!src || typeof src !== 'object') return src;
      const item = JSON.parse(JSON.stringify(src));
      item.brands = Array.isArray(item.brands) ? item.brands : [];
      item.bonds = Array.isArray(item.bonds) ? item.bonds : [];
      item.trophies = Array.isArray(item.trophies) ? item.trophies : [];
      item.bonds.forEach(b => { delete b.kinship; });
      REMOVED_ITEM_FIELDS.forEach(k => { delete item[k]; });
      if (!item.att) item.att = { xp: 0, next: S.attuneBase, tc: {} };
      if (item.evolutions == null) item.evolutions = 0;
      if (!RARITIES.includes(item.rarity)) {
        const n = item.brands.length + item.bonds.length + item.trophies.length;
        item.rarity = !isCraftable(item) || n === 0 ? 'normal'
          : (n <= S.rarityLimits.magic.total ? 'magic' : 'rare');
      }
      let seq = 0;
      [...item.brands, ...item.bonds, ...item.trophies].forEach(m => {
        if (m.seq == null) m.seq = ++seq; else seq = Math.max(seq, m.seq);
      });
      return item;
    }

    /* ---------------- item generation ---------------- */
    function materialPoolFor(formRef, ilvl) {
      const formId = typeof formRef === 'string'
        ? formRef
        : Object.keys(pack.forms).find(id => pack.forms[id] === formRef);
      const formDef = typeof formRef === 'string' ? pack.forms[formRef] : formRef;
      if (!formDef || retiredForms.has(formId)) return [];
      const maxTier = 1 + Math.floor(ilvl / 15); // t2 @15, t3 @30, t4 @45, t5 @60, t6 @75
      return (formDef.materials || Object.keys(pack.materials))
        .map(id => ({ id, m: pack.materials[id] }))
        .filter(e => e.m.tier <= maxTier && !isRetiredCombo(formId, e.id))
        .map(e => ({ w: e.m.dropWeight || 10, id: e.id }));
    }

    /* Item Rarity (PoE "increased Rarity of Items found"), PROVISIONAL:
       X% increased Item Rarity multiplies the Magic and Rare drop weights by
       (1 + X/100); the Normal weight is unchanged. More Item Rarity therefore
       means a larger share of Magic and Rare drops; it does not change how
       many items drop. The owner tunes the weights in playtest. */
    function rarityOdds(itemRarity = 0) {
      const mult = 1 + Math.max(0, Number(itemRarity) || 0) / 100;
      const w = {
        normal: S.dropRarityWeights.normal,
        magic: S.dropRarityWeights.magic * mult,
        rare: S.dropRarityWeights.rare * mult,
      };
      const total = w.normal + w.magic + w.rare;
      return { normal: w.normal / total, magic: w.magic / total, rare: w.rare / total };
    }
    function rollRarity(itemRarity) {
      const odds = rarityOdds(itemRarity);
      return pickWeighted(RARITIES.map(r => ({ w: odds[r], r }))).r;
    }

    function generateItem(genOpts = {}) {
      const ilvl = genOpts.ilvl != null ? genOpts.ilvl : rint(1, 80);
      let formId = genOpts.formId;
      if (!formId) {
        // random drops only pick forms with a legal material at this ilvl
        const legal = Object.keys(pack.forms).filter(f =>
          !pack.forms[f].noDrop && !retiredForms.has(f) && materialPoolFor(f, ilvl).length);
        formId = pick(legal.length ? legal : Object.keys(pack.forms));
      }
      const formDef = pack.forms[formId];
      if (!formDef) throw new Error(`unknown form ${formId}`);
      if (retiredForms.has(formId)) throw new Error(`retired form ${formId}`);
      let materialId = genOpts.materialId;
      if (!materialId) {
        const poolEntry = pickWeighted(materialPoolFor(formId, ilvl));
        materialId = poolEntry ? poolEntry.id : (formDef.materials || Object.keys(pack.materials))[0];
      }
      if (isRetiredCombo(formId, materialId)) throw new Error(`retired item ${itemArtId(formId, materialId)}`);
      if (formDef.materials && !formDef.materials.includes(materialId)) {
        throw new Error(`form ${formId} cannot use material ${materialId}`);
      }
      const mat = pack.materials[materialId];
      if (!mat) throw new Error(`unknown material ${materialId}`);
      const item = {
        v: 2, id: genId(), formId, materialId,
        kind: formDef.kind, w: formDef.w, h: formDef.h, ilvl,
        rarity: 'normal',
        brands: [], bonds: [], trophies: [],
        att: { xp: 0, next: S.attuneBase, tc: {} },
        evolutions: 0,
        epithetName: null, awakened: null,
      };
      if (formDef.noVessel) return item;

      // rarity: explicit, else implied by a requested brand count, else rolled
      let rarity = genOpts.rarity;
      if (!RARITIES.includes(rarity)) {
        if (genOpts.brands != null) rarity = genOpts.brands <= 0 ? 'normal' : 'magic';
        else rarity = rollRarity(genOpts.itemRarity);
      }
      item.rarity = rarity;
      let n = genOpts.brands != null ? genOpts.brands
        : (S.dropBrands[rarity] ? rint(S.dropBrands[rarity][0], S.dropBrands[rarity][1]) : 0);
      n = Math.min(n, limits(item).brands, limits(item).total);
      for (let i = 0; i < n; i++) {
        const rolled = rollBrand(item, {});
        if (rolled) item.brands.push(rolled);
      }
      // a rolled drop whose base has no brand pool (jewels) stays Normal
      if (!genOpts.rarity && genOpts.brands == null && !item.brands.length) item.rarity = 'normal';
      maybeName(item);
      return item;
    }

    /* ---------------- brands ---------------- */
    function brandPool(item, o = {}) {
      const used = new Set([...item.brands.map(b => b.modId)]);
      const mat = material(item);
      const f = form(item);
      let pool = Object.entries(pack.brandMods)
        .filter(([id, m]) => m.kinds.includes(item.kind) && !used.has(id));
      if (o.omenId) {
        const tag = pack.omens[o.omenId].tag;
        pool = pool.filter(([, m]) => (m.tags || []).includes(tag));
      }
      return pool.map(([id, m]) => {
        let w = m.weight || 10;
        (m.tags || []).forEach(tag => {
          if (mat.weights && mat.weights[tag]) w *= mat.weights[tag];
          if (f.weights && f.weights[tag]) w *= f.weights[tag];
          if (o.pigmentId && pack.pigments[o.pigmentId].weights[tag]) {
            w *= pack.pigments[o.pigmentId].weights[tag];
          }
        });
        return { id, m, w };
      }).filter(e => e.w > 0);
    }

    function rollBrand(item, o) {
      const entry = pickWeighted(brandPool(item, o));
      if (!entry) return null;
      const gated = entry.m.tiers
        .map((t, i) => ({ t, i }))
        .filter(e => (e.t.minIlvl || 0) <= item.ilvl);
      if (!gated.length) return null;
      const tierPick = pickWeighted(gated.map(e => ({ w: S.brandTierWeights[e.i] || 1, e })));
      const tierDef = tierPick.e.t;
      return {
        id: genId(), modId: entry.id, tier: tierPick.e.i + 1,
        value: rint(tierDef.roll[0], tierDef.roll[1]),
        seq: nextSeq(item),
      };
    }

    function explainOdds(item, o = {}) {
      const pool = brandPool(item, o);
      const total = pool.reduce((s, e) => s + e.w, 0);
      return pool
        .map(e => ({ modId: e.id, label: fmt(e.m.label, '#'), p: total ? e.w / total : 0 }))
        .sort((a, b) => b.p - a.p);
    }

    const clone = (item) => JSON.parse(JSON.stringify(item));
    const err = (error) => ({ error });
    const checkTools = (o) => {
      if (o.omenId && !pack.omens[o.omenId]) return 'Unknown guaranteed-brand item';
      if (o.pigmentId && !pack.pigments[o.pigmentId]) return 'Unknown pigment';
      return null;
    };
    const addBrand = (item, o) => {
      const brand = rollBrand(item, o);
      if (!brand) return null;
      item.brands.push(brand);
      maybeName(item);
      return brand;
    };
    const brandText = (b) => `${fmt(brandMod(b).label, b.value)} (T${b.tier})`;

    /* ---------------- crafting currencies (PoE analogues) ---------------- */
    /* Add Modifier (Transmutation + Augmentation / Exalted Orb, merged): on a
       Normal item it makes the item Magic and adds one brand; otherwise it
       adds one brand while the rarity has room. Bonds are not crafted: they
       form from bond XP once the item is Magic or Rare. Pigments and
       guaranteed-brand items steer the brand. */
    function addModifier(srcItem, o = {}) {
      const item = clone(srcItem);
      if (!isCraftable(item)) return err('This item holds no modifiers');
      const wasNormal = item.rarity === 'normal';
      if (wasNormal) item.rarity = 'magic';
      if (freeSlots(item) <= 0) return err(`No room for another modifier on a ${rarityName(item)} item`);
      if (!canAddBrand(item)) return err(`A ${rarityName(item)} item holds no more brands`);
      const toolErr = checkTools(o);
      if (toolErr) return err(toolErr);
      const brand = addBrand(item, o);
      if (!brand) return err(o.omenId ? 'No brand with that tag fits this item' : 'No brand fits this item');
      return { item, event: { kind: 'craft', text: `${wasNormal ? 'Made Magic. ' : ''}Added brand: ${brandText(brand)}` } };
    }

    /* Upgrade to Rare (Regal Orb): makes a Magic item Rare and adds one brand. */
    function upgradeToRare(srcItem, o = {}) {
      const item = clone(srcItem);
      if (!isCraftable(item)) return err('This item holds no modifiers');
      if (item.rarity !== 'magic') return err('Only a Magic item can be upgraded to Rare');
      const toolErr = checkTools(o);
      if (toolErr) return err(toolErr);
      item.rarity = 'rare';
      if (!canAddBrand(item)) return err('A Rare item holds no more brands; remove one first');
      const brand = addBrand(item, o);
      if (!brand) return err(o.omenId ? 'No brand with that tag fits this item' : 'No brand fits this item');
      return { item, event: { kind: 'craft', text: `Upgraded to Rare. Added brand: ${brandText(brand)}` } };
    }

    /* Reroll Values (Divine Orb): rerolls every brand value within its tier and
       every bond's base value within its range. Tiers and Bond levels stay. */
    function rerollValues(srcItem) {
      const item = clone(srcItem);
      if (!item.brands.length && !item.bonds.length) return err('No modifier values to reroll');
      item.brands.forEach(b => {
        const tierDef = brandMod(b).tiers[b.tier - 1];
        if (tierDef) b.value = rint(tierDef.roll[0], tierDef.roll[1]);
      });
      item.bonds.forEach(b => {
        const m = bondMod(b);
        b.base = rint(m.roll[0], m.roll[1]);
      });
      return { item, event: { kind: 'craft', text: 'Modifier values rerolled' } };
    }

    /* Remove Last Modifier (Annulment Orb, adapted: last, not random): removes
       the most recently added brand, bond or animal part. Rarity stays. */
    function removeLastModifier(srcItem) {
      const item = clone(srcItem);
      const all = [
        ...item.brands.map((m, i) => ({ list: 'brands', m, i })),
        ...item.bonds.map((m, i) => ({ list: 'bonds', m, i })),
        ...item.trophies.map((m, i) => ({ list: 'trophies', m, i })),
      ];
      if (!all.length) return err('No modifier to remove');
      const last = all.reduce((best, e) => ((e.m.seq || 0) >= (best.m.seq || 0) ? e : best));
      item[last.list].splice(last.i, 1);
      const text = last.list === 'brands' ? `Removed brand: ${fmt(brandMod(last.m).label, last.m.value)}`
        : last.list === 'bonds' ? `Removed bond: ${bondMod(last.m).name}`
        : `Removed ${pack.trophies[last.m.trophyId].name}; it is destroyed.`;
      return { item, event: { kind: 'craft', text } };
    }

    /* ---------------- animal parts ---------------- */
    function addFragment(stash, trophyId) {
      const t = pack.trophies[trophyId];
      if (!t) return err('Unknown animal part');
      const next = Object.assign({}, stash);
      next[trophyId] = (next[trophyId] || 0) + 1;
      const completed = next[trophyId] >= t.fragments;
      return { stash: next, completed, event: { kind: 'sys', text: completed ? `${t.name} complete (${t.fragments}/${t.fragments})!` : `${t.name} fragment (${next[trophyId]}/${t.fragments})` } };
    }

    function socketTrophy(srcItem, trophyId, stash) {
      const t = pack.trophies[trophyId];
      if (!t) return err('Unknown animal part');
      if ((stash[trophyId] || 0) < t.fragments) return err(`Needs ${t.fragments} fragments`);
      const item = clone(srcItem);
      if (!isCraftable(item)) return err('This item holds no modifiers');
      if (!t.kinds.includes(item.kind)) return err(`A ${t.name} will not attach to this`);
      if (item.trophies.some(x => x.trophyId === trophyId)) return err('This animal part is already attached');
      if (freeSlots(item) <= 0) return err(`No room for another modifier on a ${rarityName(item)} item`);
      item.trophies.push({ id: genId(), trophyId, seq: nextSeq(item) });
      const nextStash = Object.assign({}, stash);
      nextStash[trophyId] -= t.fragments;
      return { item, stash: nextStash, event: { kind: 'craft', text: `Attached animal part: ${t.name}` } };
    }

    /* ---------------- bonds ---------------- */
    function rollBond(item) {
      const used = new Set(item.bonds.map(b => b.modId));
      const order = Object.keys(pack.themes)
        .filter(t => (item.att.tc[t] || 0) > 0)
        .sort((a, b) => (item.att.tc[b] || 0) - (item.att.tc[a] || 0));
      const searchOrder = [...(order.length ? order : [pick(Object.keys(pack.themes))]),
        ...Object.keys(pack.themes)];
      for (const themeId of searchOrder) {
        const pool = Object.entries(pack.themes[themeId].mods).filter(([id]) => !used.has(id));
        if (pool.length) {
          const [modId, m] = pick(pool);
          return { id: genId(), modId, themeId, base: rint(m.roll[0], m.roll[1]), tier: 1, seq: nextSeq(item) };
        }
      }
      return null;
    }

    function maybeName(item) {
      const nt = pack.nameTables;
      if (nt && !item.epithetName && item.brands.length + item.bonds.length + item.trophies.length >= 3) {
        item.epithetName = `${pick(nt.pre)} ${pick(nt.post)}`;
      }
    }

    /* The upgraded item is named after the character who raised it and gains
       its dominant bond theme's one power. */
    function awaken(item, charName) {
      const themeId = dominantBondTheme(item) || pick(Object.keys(pack.themes));
      const t = pack.themes[themeId];
      item.awakened = {
        name: charName ? `${charName}'s ${baseName(item)}` : baseName(item),
        themeId, power: t.power,
      };
    }

    const canUpgrade = (item) => !item.awakened && item.bonds.length >= S.bondsToUpgrade
      && item.bonds.every(b => b.tier === 3);

    const isSated = (item) => {
      if (!isCraftable(item)) return true;
      if (canAddBond(item)) return false;
      if (item.bonds.some(b => b.tier < 3)) return false;
      if (canUpgrade(item)) return false;
      return true;
    };

    function evolve(item, ctx) {
      if (canAddBond(item)) {
        const bond = rollBond(item);
        if (bond) {
          item.bonds.push(bond);
          item.evolutions += 1;
          maybeName(item);
          const m = bondMod(bond);
          return { kind: 'bond', text: `Bond formed on ${displayName(item)}: ${m.name} — ${fmt(m.label, bondValue(bond))}` };
        }
      }
      const weakest = item.bonds.filter(b => b.tier < 3).sort((a, b) => a.tier - b.tier)[0];
      if (weakest) {
        weakest.tier += 1;
        item.evolutions += 1;
        return { kind: 'bond', text: `Bond upgraded on ${displayName(item)}: ${bondMod(weakest).name} → ${ROMAN[weakest.tier - 1]}` };
      }
      if (canUpgrade(item)) {
        awaken(item, ctx && ctx.charName);
        item.evolutions += 1;
        return { kind: 'awake', text: `${displayName(item)} is upgraded: ${item.awakened.power}` };
      }
      return null;
    }

    function attune(srcItem, xp, themeWeights, ctx) {
      const item = clone(srcItem);
      const events = [];
      if (isSated(item)) return { item, events };
      Object.entries(themeWeights || {}).forEach(([t, w]) => {
        item.att.tc[t] = (item.att.tc[t] || 0) + w;
      });
      item.att.xp += xp;
      let guard = 0;
      while (item.att.xp >= item.att.next && guard < 8) {
        guard += 1;
        item.att.xp -= item.att.next;
        const ev = evolve(item, ctx);
        if (ev) events.push(ev);
        item.att.next = S.attuneBase + S.attuneStep * item.evolutions;
        if (isSated(item)) { item.att.xp = 0; break; }
      }
      return { item, events };
    }

    /* ---------------- character & simulated fights ---------------- */
    function createCharacter(o = {}) {
      return {
        v: 1, name: o.name || 'Unnamed',
        archetype: o.archetype || Object.keys(pack.archetypes)[0],
        xp: 0, gold: o.gold || 0, deeds: {}, fragments: {},
      };
    }
    const charLevel = (c) => 1 + Math.floor(c.xp / 100);

    /* Summed Item Rarity of the given items (the sheet's Item Rarity line). */
    function itemRarityOf(items, ctx = {}) {
      const agg = aggregate(items, ctx);
      if (agg.sheet && typeof agg.sheet.goods === 'number') return agg.sheet.goods;
      return (agg.sums.wealthy || 0) + (agg.sums.fortune || 0);
    }

    function venture(character, equipment, opts = {}) {
      const c = JSON.parse(JSON.stringify(character));
      const enc = opts.encounter || pick(pack.encounters || [{ text: 'travelled', themes: {} }]);
      const events = [];
      const gold = rint(20, 65);
      c.gold += gold;
      c.xp += rint(25, 45);
      const themes = Object.assign({}, enc.themes);
      const archTheme = pack.archetypes[c.archetype].themeId;
      themes[archTheme] = (themes[archTheme] || 0) + 1;
      Object.entries(themes).forEach(([t, w]) => { c.deeds[t] = (c.deeds[t] || 0) + w; });
      events.push({ kind: 'deed', text: `${c.name} ${enc.text}. (+${gold}g)` });

      const eq = {};
      const ctx = { charName: c.name, archetype: c.archetype };
      Object.entries(equipment).forEach(([slot, it]) => {
        if (!it || !isCraftable(it) || isSated(it)) { eq[slot] = it; return; }
        const res = attune(it, rint(16, 30), themes, ctx);
        eq[slot] = res.item;
        events.push(...res.events);
      });

      // Item Rarity of the equipped items (or the caller's sheet value) sets drop rarity odds.
      const itemRarity = opts.itemRarity != null ? opts.itemRarity
        : itemRarityOf(Object.values(equipment), { level: charLevel(character) });
      const drops = [];
      if (rnd() < 0.4) {
        drops.push(generateItem({ ilvl: Math.min(80, 10 + charLevel(c) * 3 + rint(0, 15)), itemRarity }));
      }
      const fragments = [];
      if (pack.trophies && rnd() < (enc.trophyChance != null ? enc.trophyChance : 0.35)) {
        const tid = enc.trophy || pick(Object.keys(pack.trophies));
        const res = addFragment(c.fragments, tid);
        c.fragments = res.stash;
        fragments.push(tid);
        events.push(res.event);
      }
      return { character: c, equipment: eq, drops, fragments, events, encounter: enc, itemRarity };
    }

    /* ---------------- aggregation ---------------- */
    function aggregate(items, ctx = {}) {
      const sums = {};
      const conditionals = [];
      const add = (id, v) => { if (id) sums[id] = (sums[id] || 0) + v; };
      items.filter(Boolean).forEach(item => {
        const f = form(item);
        if (f.implicit && f.implicit.stat) add(f.implicit.stat.id, f.implicit.stat.v);
        item.brands.forEach(b => {
          const m = brandMod(b);
          if (m.shape === 'flat' || m.shape === 'scalar') add(b.modId, b.value);
        });
        item.bonds.forEach(b => {
          const m = bondMod(b);
          conditionals.push({
            source: displayName(item), name: m.name, shape: m.shape || 'conditional',
            text: fmt(m.label, bondValue(b)), themeId: b.themeId, tier: b.tier,
          });
        });
        item.trophies.forEach(tr => {
          const t = pack.trophies[tr.trophyId];
          t.mods.forEach(m => {
            if (m.shape === 'flat' || m.shape === 'scalar') add(m.stat, m.v);
            else conditionals.push({ source: t.name, name: t.name, shape: m.shape, text: fmt(m.label, m.v) });
          });
          if (t.completionBonus) {
            conditionals.push({ source: t.name, name: t.name + ' (complete)', shape: t.completionBonus.shape || 'conditional', text: t.completionBonus.label });
          }
        });
        if (item.awakened) {
          conditionals.push({ source: displayName(item), name: 'Upgraded', shape: 'trigger', text: item.awakened.power, themeId: item.awakened.themeId });
        }
      });
      const sheet = pack.derive ? pack.derive(sums, items.filter(Boolean), ctx) : sums;
      return { sums, sheet, conditionals };
    }

    /* ---------------- presentation (UI-agnostic tooltip) ---------------- */
    function tooltip(item) {
      const lines = [];
      const mat = material(item);
      const f = form(item);
      const push = (section, text, tone) => lines.push({ section, text, tone: tone || 'normal' });
      push('name', displayName(item), item.awakened ? 'awakened' : (item.bonds.length > item.brands.length ? 'bonded' : (item.brands.length ? 'branded' : 'plain')));
      if (item.epithetName || item.awakened) push('base', `${mat.name} ${f.name}`);
      push('kind', `${f.kindLabel || item.kind} · ${mat.name} (tier ${mat.tier}) · Item Level ${item.ilvl}`);
      if (isCraftable(item)) {
        push('rarity', `${rarityName(item)} · ${usedSlots(item)}/${limits(item).total} modifiers`);
      }
      if (f.weapon) push('stat', `Damage ${Math.round(f.weapon.dmg[0] * mat.statMult)}–${Math.round(f.weapon.dmg[1] * mat.statMult)} · Speed ${f.weapon.aps}`);
      if (f.armor) push('stat', `Ward ${Math.round(f.armor * mat.statMult)}`);
      if (f.implicit) push('implicit', f.implicit.label);
      item.brands.forEach(b => push('brand', `✦ ${brandText(b)}`));
      item.bonds.forEach(b => {
        const m = bondMod(b);
        push('bond', `◈ ${m.name} — ${fmt(m.label, bondValue(b))} · Bond ${ROMAN[b.tier - 1]}`, 'bond');
      });
      item.trophies.forEach(tr => {
        const t = pack.trophies[tr.trophyId];
        push('trophy', `✧ ${t.name}`);
        t.mods.forEach(m => push('trophy', `   ${fmt(m.label, m.v)}`));
        if (t.completionBonus) push('trophy', `   ${t.completionBonus.label}`, 'bonus');
      });
      if (item.awakened) {
        push('power', item.awakened.power, 'awakened');
      }
      if (isCraftable(item) && !isSated(item)) push('attune', `Bond XP ${item.att.xp}/${item.att.next}`);
      return lines;
    }

    function sellValue(item) {
      if (!isCraftable(item)) return 40;
      const mat = material(item);
      return S.sellBase * mat.tier
        + Math.max(0, RARITIES.indexOf(item.rarity)) * 30
        + item.brands.length * 40
        + item.bonds.reduce((s, b) => s + b.tier * 25, 0)
        + item.trophies.length * 60
        + (item.awakened ? 400 : 0);
    }

    /* ---------------- serialization ---------------- */
    const serialize = (state) => JSON.stringify({ packId: pack.id, state });
    function deserialize(raw) {
      const data = JSON.parse(raw);
      if (data.packId !== pack.id) throw new Error(`save is for pack ${data.packId}, forge runs ${pack.id}`);
      return data.state;
    }

    return {
      pack, settings: S,
      reseed: (seed) => { rand = mulberry32(seed >>> 0); },
      // generation & loot
      generateItem, materialPoolFor, rarityOdds, itemRarityOf,
      // crafting currencies
      addModifier, upgradeToRare, rerollValues, removeLastModifier, explainOdds,
      // bonds
      attune, isSated,
      // animal parts
      addFragment, socketTrophy,
      // play loop
      createCharacter, charLevel, venture,
      // reading
      aggregate, tooltip, sellValue,
      displayName, rarityName, dominantBondTheme, bondValue, freeSlots, isCraftable,
      canAddBrand, canAddBond,
      // persistence
      normalizeItem, serialize, deserialize,
    };
  }

  return { createForge, validatePack, version: '2.0.0-provisional' };
}));
