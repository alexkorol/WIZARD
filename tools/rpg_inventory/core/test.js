/* Vesselforge test suite — run: node test.js */
'use strict';
const fs = require('fs');
const path = require('path');
const VesselForge = require('./vesselforge.js');
const pack = require('./verdigris-pack.js');

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log('  ok  ' + name); }
  catch (e) { failed++; console.log('FAIL  ' + name + ' — ' + e.message); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || 'assertion failed'); }
const eq = (a, b, msg) => assert(a === b, (msg || '') + ` (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`);

/* ---------------- pack validation ---------------- */
t('pack validates clean', () => {
  eq(VesselForge.validatePack(pack).length, 0, JSON.stringify(VesselForge.validatePack(pack)));
});
t('validation catches broken pack', () => {
  const bad = JSON.parse(JSON.stringify({ id: 'x', settings: {}, materials: { a: { tier: 1, vessel: [2, 2], patience: [2, 2] } }, forms: {}, brandMods: {}, themes: {}, archetypes: { z: { themeId: 'nope' } } }));
  assert(VesselForge.validatePack(bad).length > 0, 'should report issues');
});

const forge = VesselForge.createForge(pack, { seed: 12345 });

/* ---------------- determinism ---------------- */
t('seeded generation is reproducible', () => {
  const f1 = VesselForge.createForge(pack, { seed: 777 });
  const f2 = VesselForge.createForge(pack, { seed: 777 });
  const a = f1.generateItem({ ilvl: 40 });
  const b = f2.generateItem({ ilvl: 40 });
  eq(a.formId, b.formId); eq(a.materialId, b.materialId);
  eq(a.brands.length, b.brands.length);
});

/* ---------------- generation invariants ---------------- */
t('generated items respect vessel/material invariants', () => {
  for (let i = 0; i < 200; i++) {
    const it = forge.generateItem({ ilvl: 1 + (i % 80) });
    const mat = pack.materials[it.materialId];
    const f = pack.forms[it.formId];
    assert(f.materials.includes(it.materialId), `${it.formId} in ${it.materialId}`);
    assert(mat.tier <= 1 + Math.floor(it.ilvl / 15), 'material tier gated by ilvl');
    if (it.vessel) {
      assert(it.brands.length <= it.vessel, 'brands fit vessel');
      assert(it.patience >= 0 && it.patience <= it.patienceMax, 'patience sane');
    }
  }
});
t('low ilvl never drops skymetal or unavailable mail', () => {
  for (let i = 0; i < 100; i++) {
    const it = forge.generateItem({ ilvl: 10 });
    assert(!['skymetal', 'rivetmail'].includes(it.materialId), it.materialId);
  }
});
t('jade is restricted to non-weapons or blunt weapon bases', () => {
  for (const [formId, form] of Object.entries(pack.forms)) {
    if (!form.materials || !form.materials.includes('jade')) continue;
    if (form.kind !== 'weapon') continue;
    assert(form.tags.includes('blunt'), `${formId} uses jade but is not blunt`);
    assert(!form.tags.includes('blade'), `${formId} uses jade but is a blade`);
    assert(!form.tags.includes('reach'), `${formId} uses jade but is reach`);
  }

  const targetPath = path.join(__dirname, 'targets.tsv');
  const rows = fs.readFileSync(targetPath, 'utf8').trim().split(/\r?\n/).slice(1);
  const bannedClasses = new Set(['dagger', 'sword', 'axe', 'great2h', 'polearm']);
  for (const line of rows) {
    const [artId, cls, , name, , desc] = line.split('\t');
    const text = `${artId} ${name} ${desc}`.toLowerCase();
    assert(!(bannedClasses.has(cls) && text.includes('jade')),
      `${artId} is a jade blade/reach target`);
  }
});
t('retired forms and art ids cannot be generated', () => {
  const retiredIds = new Set(pack.retiredArtIds || []);
  const retiredForms = new Set(pack.retiredForms || []);
  const retiredMaterials = new Set(pack.retiredMaterials || []);
  for (let i = 0; i < 500; i++) {
    const it = forge.generateItem({ ilvl: 1 + (i % 80) });
    assert(!retiredForms.has(it.formId), `generated retired form ${it.formId}`);
    assert(!retiredMaterials.has(it.materialId), `generated retired material ${it.materialId}`);
    assert(!retiredIds.has(`${it.formId}_${it.materialId}`),
      `generated retired art id ${it.formId}_${it.materialId}`);
  }

  let threw = false;
  try {
    forge.generateItem({ ilvl: 40, formId: 'khopesh', materialId: 'bronze' });
  } catch (e) {
    threw = /retired item/.test(e.message);
  }
  assert(threw, 'explicit retired khopesh_bronze generation must fail');
  threw = false;
  try {
    forge.generateItem({ ilvl: 80, formId: 'wrap', materialId: 'rivetmail' });
  } catch (e) {
    threw = /retired item/.test(e.message);
  }
  assert(threw, 'explicit retired rivetmail generation must fail');

  const testPack = JSON.parse(JSON.stringify(pack));
  testPack.forms.sling = {
    name: 'Sling', kind: 'weapon', kindLabel: 'Thrown weapon', w: 1, h: 2,
    icon: 'sling', weapon: { dmg: [3, 7], aps: 1.4 },
    tags: ['swift'], materials: ['hide', 'quilted'],
  };
  testPack.retiredForms = [...new Set([...(testPack.retiredForms || []), 'sling'])];
  const testForge = VesselForge.createForge(testPack, { seed: 99 });
  eq(testForge.materialPoolFor('sling', 80).length, 0, 'retired forms have no material pool');
  threw = false;
  try {
    testForge.generateItem({ ilvl: 40, formId: 'sling', materialId: 'hide' });
  } catch (e) {
    threw = /retired form/.test(e.message);
  }
  assert(threw, 'explicit retired sling generation must fail');
});
t('generation plan keeps currency art lane closed', () => {
  const planPath = path.join(__dirname, 'GENERATION-PLAN.md');
  const plan = fs.readFileSync(planPath, 'utf8');
  assert(!/Crafting currency \/ omens \/ pigments/.test(plan),
    'currency bucket must stay out of target counts');
  assert(!/Add 60 crafting\/currency rows/.test(plan),
    'generation order must not reintroduce currency rows');
  assert(/Currency\/crafting-material candidates are out of scope/.test(plan),
    'plan must carry the no-currency prompt rule');
  assert(/max 2 weapons/.test(plan),
    'plan must carry the prompt-batch weapon cap');
});
t('test prompts require novelty checks', () => {
  const planPath = path.join(__dirname, 'GENERATION-PLAN.md');
  const briefPath = path.join(__dirname, 'ASSET-BRIEF.md');
  const stylePath = path.join(__dirname, 'STYLE-EXPERIMENTS.md');
  const plan = fs.readFileSync(planPath, 'utf8');
  const brief = fs.readFileSync(briefPath, 'utf8');
  const style = fs.readFileSync(stylePath, 'utf8');
  assert(/no-repeat by default/.test(plan),
    'plan must require no-repeat prompt candidates');
  assert(/Style\s+calibration follows the same rule/.test(plan),
    'plan must require style calibration to be no-repeat too');
  assert(/TEST PROMPTS ARE NOVELTY-CHECKED NEW ITEMS/.test(brief),
    'brief must define test prompts as novelty-checked new items');
  assert(/extended to style\s+calibration/.test(brief),
    'brief changelog must record no-repeat style calibration');
  assert(/No-Repeat Rule/.test(style),
    'style experiments must carry the no-repeat rule');
  assert(/Style calibration prompts also use novel DESC content/.test(style),
    'style experiments must not allow generic repeat calibration prompts');
  assert(!/### Copper Torc/.test(style) && !/### Carved Jade Cudgel/.test(style),
    'style experiments must not keep full prompts for already-made items');
  assert(!/style-calibration repeat/.test(plan + brief + style),
    'docs must not preserve the old style-calibration repeat loophole');
});
t('generation plan requires concrete relic gear', () => {
  const planPath = path.join(__dirname, 'GENERATION-PLAN.md');
  const plan = fs.readFileSync(planPath, 'utf8');
  assert(/concrete ritual implement silhouettes/.test(plan),
    'plan must require concrete relic implement silhouettes');
  assert(/vajra\/dorje-like double-ended pronged sceptres/.test(plan),
    'plan must include vajra/dorje-like structural reference');
  assert(/Weak relic tropes/.test(plan),
    'plan must forbid weak relic trope prompts');
});
t('generation plan rejects weak prop-like bases', () => {
  const planPath = path.join(__dirname, 'GENERATION-PLAN.md');
  const plan = fs.readFileSync(planPath, 'utf8');
  assert(/Base-worthy gear rule/.test(plan),
    'plan must include a base-worthiness guardrail');
  assert(/Weak base-item concepts/.test(plan),
    'plan must list weak prop-like base concepts');
  assert(!/\| Shields \/ bucklers \|[^\n]*Wicker/.test(plan),
    'shield allocation must not use wicker as a positive source');
  assert(!/\| Rite foci \/ sceptres \|[^\n]*baton/i.test(plan),
    'rite allocation must not use batons as positive sources');
  assert(!/\| Throwing \/ sidearms \|[^\n]*Throwing knives, darts, hand stones/i.test(plan),
    'sidearm allocation must not use joke-sized thrown objects as positive sources');
  assert(/avoid bows\/slings, tiny darts, and hand stones/.test(plan),
    'sidearm allocation must explicitly reject tiny darts and hand stones');
  assert(!/\| Charms \/ relic curios \|[^\n]*ancestor tokens, shrine miniatures/i.test(plan),
    'curio allocation must not use shrine miniatures as positive sources');
  assert(/no loose tiny charms or shrine miniatures/.test(plan),
    'curio allocation must explicitly reject shrine miniatures');
});

/* ---------------- crafting: sear/patience/pigment/omen ---------------- */
t('sear adds a brand and spends patience', () => {
  const it = forge.generateItem({ ilvl: 40, formId: 'dagger', materialId: 'bronze', brands: 0 });
  const r = forge.sear(it);
  assert(!r.error, r.error);
  eq(r.item.brands.length, 1);
  eq(r.item.patience, it.patience - 1);
});
t('patience exhaustion closes crafting', () => {
  let it = forge.generateItem({ ilvl: 40, formId: 'dagger', materialId: 'bronze', brands: 0 });
  let guard = 0;
  while (it.patience > 0 && guard++ < 30) {
    const r = it.brands.length ? forge.efface(it) : forge.sear(it);
    if (r.error) break;
    it = r.item;
  }
  const r = forge.sear(it);
  assert(r.error && /patience/i.test(r.error), 'should refuse: ' + r.error);
});
t('omen guarantees tag', () => {
  for (let i = 0; i < 30; i++) {
    const it = forge.generateItem({ ilvl: 40, formId: 'wrap', materialId: 'quilted', brands: 0 });
    const r = forge.sear(it, { omenId: 'entrail_omen' });
    if (r.error) continue;
    const mod = pack.brandMods[r.item.brands[0].modId];
    assert(mod.tags.includes('ward'), `omen gave ${r.item.brands[0].modId}`);
  }
});
t('pigment skews odds and explainOdds sums to 1', () => {
  const it = forge.generateItem({ ilvl: 40, formId: 'handaxe', materialId: 'bronze', brands: 0 });
  const plain = forge.explainOdds(it);
  const skewed = forge.explainOdds(it, { pigmentId: 'red_ochre' });
  const sum = skewed.reduce((s, e) => s + e.p, 0);
  assert(Math.abs(sum - 1) < 1e-9, 'probabilities sum to 1');
  const pOf = (list, id) => (list.find(e => e.modId === id) || { p: 0 }).p;
  assert(pOf(skewed, 'keen') > pOf(plain, 'keen'), 'red ochre boosts blade mods');
});
t('brand tiers gate by ilvl', () => {
  for (let i = 0; i < 60; i++) {
    const it = forge.generateItem({ ilvl: 5, formId: 'handaxe', materialId: 'flint', brands: 0 });
    const r = forge.sear(it);
    if (r.error) continue;
    eq(r.item.brands[0].tier, 1, 'ilvl 5 rolls only T1');
  }
});

/* ---------------- firing ---------------- */
t('firing ascends, scars, silences, or shatters — and hide never skips tiers', () => {
  const seen = {};
  for (let i = 0; i < 120; i++) {
    const it = forge.generateItem({ ilvl: 30, formId: 'wrap', materialId: 'hide', brands: 0 });
    const r = forge.fire(it);
    if (r.destroyed) { seen.shatter = 1; continue; }
    assert(!r.error, r.error);
    if (r.item.materialId !== 'hide') { seen.ascend = 1; eq(r.item.materialId, 'quilted'); }
    else if (r.item.scars > it.scars) seen.scar = 1;
    else seen.silent = 1;
  }
  assert(seen.ascend && seen.scar && seen.silent && seen.shatter, JSON.stringify(seen));
});
t('top materials cannot be fired', () => {
  const it = forge.generateItem({ ilvl: 79, formId: 'wrap', materialId: 'bronzescale', brands: 0 });
  assert(forge.fire(it).error, 'retired mail ascension must refuse the kiln');
});

/* ---------------- trophies ---------------- */
t('trophy fragments complete and socket', () => {
  let stash = {};
  let completed = false;
  for (let i = 0; i < 5; i++) {
    const r = forge.addFragment(stash, 'boar_tusk');
    stash = r.stash; completed = r.completed;
  }
  assert(completed, '5/5 completes');
  const it = forge.generateItem({ ilvl: 30, formId: 'spear', materialId: 'copper', brands: 0 });
  const r = forge.socketTrophy(it, 'boar_tusk', stash);
  assert(!r.error, r.error);
  eq(r.item.trophies.length, 1);
  eq(r.stash.boar_tusk, 0, 'fragments consumed');
  const r2 = forge.socketTrophy(r.item, 'boar_tusk', { boar_tusk: 5 });
  assert(r2.error, 'no duplicate trophies');
});
t('trophy respects kind restriction', () => {
  const it = forge.generateItem({ ilvl: 30, formId: 'sandals', materialId: 'hide', brands: 0 });
  assert(forge.socketTrophy(it, 'boar_tusk', { boar_tusk: 5 }).error, 'tusk on sandals must fail');
});

/* ---------------- bonds & kinship ---------------- */
t('attunement forms themed kinship bonds and estranges correctly', () => {
  let it = forge.generateItem({ ilvl: 30, formId: 'hideshield', materialId: 'bronze', brands: 0 });
  const ctx = { charName: 'Orun', archetype: 'shieldbearer' };
  let events = [];
  for (let i = 0; i < 12 && !it.bonds.length; i++) {
    const r = forge.attune(it, 60, { warding: 3 }, ctx);
    it = r.item; events.push(...r.events);
  }
  assert(it.bonds.length >= 1, 'bond formed');
  eq(it.bonds[0].themeId, 'warding', 'dominant theme wins');
  eq(it.bonds[0].kinship, 'shieldbearer');
  const full = forge.bondValue(it.bonds[0], false);
  const est = forge.bondValue(it.bonds[0], true);
  assert(Math.abs(est - full / 2) <= 0.55, `estranged ~half (${est} vs ${full})`);
  assert(forge.isEstranged(it.bonds[0], 'redhand'), 'estranged for redhand');
  assert(!forge.isEstranged(it.bonds[0], 'shieldbearer'), 'kin for shieldbearer');
});
t('the full life of an item: bonds to tier III then awakening', () => {
  let it = forge.generateItem({ ilvl: 40, formId: 'hideshield', materialId: 'bronze', brands: 0 });
  it.vessel = 3;
  const ctx = { charName: 'Orun', archetype: 'shieldbearer' };
  let awakeEvent = null;
  for (let i = 0; i < 60 && !it.awakened; i++) {
    const r = forge.attune(it, 200, { warding: 2 }, ctx);
    it = r.item;
    const aw = r.events.find(e => e.kind === 'awake');
    if (aw) awakeEvent = aw;
  }
  assert(it.awakened, 'item awakens');
  assert(awakeEvent && /AWAKENED/.test(awakeEvent.text), 'awake event fired');
  assert(it.awakened.name.startsWith("Orun's"), it.awakened.name);
  assert(forge.isSated(it), 'awakened full item is sated');
});
t('sever scars the slot', () => {
  let it = forge.generateItem({ ilvl: 30, formId: 'spear', materialId: 'copper', brands: 0 });
  const r0 = forge.attune(it, 100, { slaughter: 2 }, { charName: 'X', archetype: 'redhand' });
  it = r0.item;
  if (!it.bonds.length) return; // rng gave a tier-up instead; fine
  const before = it.bonds.length;
  const r = forge.sever(it);
  eq(r.item.bonds.length, before - 1);
  eq(r.item.scars, 1);
});

/* ---------------- venture loop ---------------- */
t('venture updates character, attunes gear, may drop loot/fragments', () => {
  const f = VesselForge.createForge(pack, { seed: 42 });
  let c = f.createCharacter({ name: 'Orun', archetype: 'shieldbearer', gold: 0 });
  let eq_ = { mainHand: f.generateItem({ ilvl: 20, formId: 'spear', materialId: 'copper', brands: 0 }) };
  let drops = 0, frags = 0;
  for (let i = 0; i < 25; i++) {
    const r = f.venture(c, eq_);
    c = r.character; eq_ = r.equipment;
    drops += r.drops.length; frags += r.fragments.length;
  }
  assert(c.gold > 0 && c.xp > 0, 'gold and xp gained');
  assert(drops > 0, 'some loot dropped');
  assert(frags > 0, 'some fragments found');
  assert((c.deeds.warding || 0) > 0, 'archetype biases deeds');
});

/* ---------------- aggregation, panoply, tooltip ---------------- */
t('aggregate splits flat sheet from conditionals', () => {
  const it = forge.generateItem({ ilvl: 40, formId: 'wrap', materialId: 'quilted', brands: 0 });
  it.brands.push({ id: 'b1', modId: 'hale', tier: 1, value: 20 });
  it.bonds.push({ id: 'd1', modId: 'shieldwall', themeId: 'warding', base: 10, tier: 1, kinship: 'shieldbearer' });
  const agg = forge.aggregate([it], { archetype: 'shieldbearer', level: 1 });
  eq(agg.sums.hale, 20, 'brand in sums');
  eq(agg.conditionals.length, 1, 'bond in conditionals');
  assert(agg.sheet.life >= 110, 'derive() applied: ' + agg.sheet.life);
  assert(!('shieldwall' in agg.sums), 'bond NOT in flat sums');
});
t('panoply detects player-authored sets', () => {
  const mk = () => {
    const it = forge.generateItem({ ilvl: 60, formId: 'hideshield', materialId: 'bronze', brands: 0 });
    it.bonds = [{ id: 'x', modId: 'shieldwall', themeId: 'warding', base: 10, tier: 3, kinship: 'shieldbearer' }];
    it.awakened = { name: "Orun's Stone Oath", themeId: 'warding', power: 'p', flavor: 'f' };
    return it;
  };
  const ps = forge.panoply([mk(), mk()]);
  eq(ps.length, 1);
  eq(ps[0].count, 2);
  assert(/Panoply \(2\)/.test(ps[0].bonus.label));
});
t('tooltip returns structured UI-agnostic lines', () => {
  const it = forge.generateItem({ ilvl: 40, formId: 'dagger', materialId: 'bronze', brands: 2 });
  const lines = forge.tooltip(it, { archetype: 'redhand' });
  assert(lines.every(l => l.section && typeof l.text === 'string'), 'line shape');
  assert(lines.some(l => l.section === 'name'), 'has name');
  assert(lines.some(l => l.section === 'vessel' && /Patience/.test(l.text)), 'shows patience');
});

/* ---------------- serialization ---------------- */
t('serialize/deserialize round-trips and rejects foreign packs', () => {
  const it = forge.generateItem({ ilvl: 33 });
  const raw = forge.serialize({ items: [it] });
  const back = forge.deserialize(raw);
  eq(back.items[0].id, it.id);
  let threw = false;
  try { forge.deserialize(JSON.stringify({ packId: 'other', state: {} })); } catch (e) { threw = true; }
  assert(threw, 'foreign pack save must be rejected');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
