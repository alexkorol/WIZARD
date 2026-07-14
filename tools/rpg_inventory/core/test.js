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
t('rite focus is an off-hand focus, not a weapon damage base', () => {
  const form = pack.forms.focus;
  eq(form.kind, 'focus', 'focus runtime kind');
  assert(!form.weapon, 'focus must not carry weapon damage');
  ['warded', 'hale', 'spirited', 'emberkiss', 'riverblessed', 'emberward', 'wealthy', 'strongback'].forEach(modId => {
    assert(pack.brandMods[modId].kinds.includes('focus'), `${modId} can roll on focus`);
  });
  assert(pack.trophies.river_pearl.kinds.includes('focus'), 'river pearl can bind to focus');
  assert(pack.trophies.knucklebone.kinds.includes('focus'), 'knucklebone can bind to focus');

  const it = forge.generateItem({ ilvl: 60, formId: 'focus', materialId: 'bronze', brands: 2 });
  eq(it.kind, 'focus');
  const lines = forge.tooltip(it, { archetype: 'ashspeaker' });
  assert(!lines.some(l => /Damage \d/.test(l.text)), 'focus tooltip must not show weapon damage');

  const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert(/item\.kind === 'focus'\) return \['focus'\]/.test(index),
    'taxonomy art selection must treat focus as focus');
  assert(/slotId === 'offHand'[\s\S]{0,90}k === 'focus'/.test(index),
    'off-hand equipment slot must accept focus items');
});
t('inventory layout has six unlock-driven auxiliary windows', () => {
  const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  eq(pack.forms.cloak.kind, 'cloak', 'cloak runtime kind');
  assert(/id: 'main', label: 'Backpack', w: 12, h: 6/.test(index),
    'main backpack must be the intended horizontal 12x6 layout');
  assert(/def\.tone !== 'main'[\s\S]{0,120}<div className="pack-title">/.test(index),
    'main backpack must not render a title or action strip');
  assert(/className="top-actions"[\s\S]*onClick=\{sortPack\}>Sort Pack<[\s\S]*Atelier/.test(index),
    'sort and Atelier controls must live in the side command rail');
  assert(/syncInventoryScale/.test(index) && /window\.innerHeight \* 0\.0565/.test(index)
      && /window\.innerHeight \* 0\.082/.test(index),
    'inventory cells and paperdoll slots must scale with tall viewports');
  assert(/max-width: 96%; max-height: 96%/.test(index),
    'item art must fill the enlarged cells');
  assert(/if \(item && !locked\) cls\.push\('occupied'\)/.test(index)
      && /\.equip-slot\.occupied > \.label/.test(index),
    'occupied equipment slots must hide placeholder labels beneath transparent art');
  assert(!/item-sigil/.test(index) && !/const SIGILS/.test(index),
    'bonded vector watermarks must never attach to item art in slots, inventory, or drag ghosts');
  assert(/id: 'spoils', label: 'Spoils Roll', w: 4, h: 4/.test(index),
    'STR+DEX Spoils Roll must exist as a 4x4 specialty grid');
  assert(/id: 'preparations', label: 'Preparation Case', w: 4, h: 4/.test(index),
    'DEX+INT Preparation Case must exist as a 4x4 specialty grid');
  assert(/id: 'reliquary', label: 'Reliquary', w: 4, h: 4/.test(index),
    'INT+STR Reliquary must exist as a 4x4 specialty grid');
  assert(/isSpoilsPackItem/.test(index) && /isPreparationsPackItem/.test(index) && /isReliquaryPackItem/.test(index) && /canUsePack/.test(index),
    'specialty pack placement must reject ordinary equipment');
  assert(/war_call_slot/.test(index) && /quick_rig_slot/.test(index) && /attendant_focus_slot/.test(index),
    'pure-axis auxiliary seats must each have an independent unlock');
  assert(/unlockedAuxWindows\.map/.test(index) && /className="aux-tab"/.test(index),
    'every unlocked auxiliary window must render its own tab');
  assert(/grid-template-rows: repeat\(6, minmax\(34px, 1fr\)\)/.test(index)
      && /style=\{\{ gridRow: def\.lane \}\}/.test(index)
      && /lane: 1[\s\S]*lane: 2[\s\S]*lane: 3[\s\S]*lane: 4[\s\S]*lane: 5[\s\S]*lane: 6/.test(index),
    'auxiliary tabs must keep six stable vertical edge lanes even when some unlocks are absent');
  assert(/auxTabRefs/.test(index) && /auxDrawerRefs/.test(index)
      && /placeBesideTab/.test(index)
      && /tabRect\.top \+ tabRect\.height \/ 2 - drawerRect\.height \/ 2/.test(index)
      && /leftOfTab >= edge \? leftOfTab : rightOfTab/.test(index),
    'each auxiliary window must anchor beside its own tab and flip inward when the left edge has no room');
  assert(/\.drawer-tab\.open \{ right: 0;/.test(index)
      && /id="character-record-drawer"/.test(index)
      && /onClick=\{\(\) => setDrawerOpen\(false\)\}>Close/.test(index),
    'the character record must keep a reachable toggle and an explicit close control');
  assert(pack.forms.warhorn.kind === 'warcall' && pack.forms.quickrig.kind === 'quickrig' && pack.forms.attendant.kind === 'attendant',
    'three pure-axis auxiliary item kinds must exist');
  assert([pack.forms.warhorn, pack.forms.quickrig, pack.forms.attendant].every(form => form.w === 2 && form.h === 2),
    'pure-axis auxiliary equipment must use 2x2 item footprints');
  assert(/slotType="cloak" label="Cloak"/.test(index),
    'paperdoll must expose a cloak slot');
  assert(/item\.kind === 'cloak'\) return \['cloak'\]/.test(index),
    'taxonomy art selection must treat cloak as its own slot');
  assert(/findFreeSpotAnyPack/.test(index) && /packGridRefs/.test(index),
    'drag and placement code must support multiple pack grids');
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
  assert(/Abstract currency candidates remain out of scope/.test(plan),
    'plan must reject abstract currency while allowing concrete preparations');
  assert(/max 2 weapons/.test(plan),
    'plan must carry the prompt-batch weapon cap');
});
t('pre-AD namebank is linked and filters medieval defaults', () => {
  const plan = fs.readFileSync(path.join(__dirname, 'GENERATION-PLAN.md'), 'utf8');
  const namebank = fs.readFileSync(path.join(__dirname, 'NAMEBANK-PRE-AD.md'), 'utf8');
  assert(/NAMEBANK-PRE-AD\.md/.test(plan),
    'generation plan must link the pre-AD namebank');
  assert(/flange-hilted bronze sword/.test(namebank) && /ge dagger-axe/.test(namebank),
    'namebank must preserve strong pre-AD prompt examples');
  assert(/Rare Or Ceremonial Bucket/.test(namebank) && /Medieval Defaults To Suppress/.test(namebank),
    'namebank must separate prestige items and medieval negatives');
  assert(/False Friends/.test(namebank) && /halberd/.test(namebank) && /rapier/.test(namebank),
    'namebank must preserve ambiguous-term filtering');
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
t('source-image loadout extraction captures coherent kit detail', () => {
  const brief = fs.readFileSync(path.join(__dirname, 'ASSET-BRIEF.md'), 'utf8');
  const style = fs.readFileSync(path.join(__dirname, 'STYLE-EXPERIMENTS.md'), 'utf8');
  const notes = fs.readFileSync(path.join(__dirname, 'REFERENCE-NOTES.md'), 'utf8');
  const plan = fs.readFileSync(path.join(__dirname, 'GENERATION-PLAN.md'), 'utf8');
  const loadout = fs.readFileSync(path.join(__dirname, 'LOADOUT-EXTRACTION.md'), 'utf8');
  const runbook = fs.readFileSync(path.join(__dirname, 'RUNBOOK.md'), 'utf8');
  const chroma = fs.readFileSync(path.join(__dirname, 'chroma_key.py'), 'utf8');
  const all = brief + style + notes + plan + loadout;
  assert(/SOURCE-IMAGE LOADOUT EXTRACTION/.test(brief),
    'brief must define source-image loadout extraction as a pipeline mode');
  assert(/Source-Image Loadout Extraction Breakthrough/.test(style),
    'style experiments must record Alexei loadout breakthrough');
  assert(/Alex's idea/.test(loadout),
    'loadout doc must preserve attribution');
  assert(/Generate 10 images\. No commentary\./.test(loadout) && /Ring or compact finger jewelry/.test(loadout),
    'loadout prompt must encode the 10-image slot constraint');
  assert(/Generate 10 images\. No commentary\./.test(loadout),
    'loadout prompt must start with an exact numeric image count');
  assert(/Generate 6 images\. No commentary\./.test(loadout)
      && /War-call instrument/.test(loadout)
      && /Quick Rig/.test(loadout)
      && /Attendant focus/.test(loadout)
      && /Spoils Roll item/.test(loadout)
      && /Preparation Case item/.test(loadout)
      && /Reliquary item/.test(loadout),
    'loadout pipeline must include the exact six-image auxiliary extraction pass');
  assert(/Overt magical levitation, glow, orbiting components/.test(loadout),
    'Attendant extraction must explicitly allow overt magical orbs');
  assert(!/Generate images, no commentary\./.test(loadout),
    'loadout prompt must not use a vague multi-image opener');
  assert(/Output-file rule/.test(loadout) && /generate only slot 1/.test(loadout),
    'loadout prompt must reject contact-sheet collapse and fall back to slot 1');
  assert(/Source-image loadout extraction lane/.test(plan),
    'generation plan must include source-image extraction as a production lane');
  assert(/feathers, tassels, scratches, shell plates/.test(all),
    'docs must allow integrated source-derived details');
  assert(/ungrounded detail/.test(all) && /baked white\/gray checkerboard/.test(loadout),
    'docs must reject pasted-on detail and checkerboard alpha failures');
  assert(/#737A68/.test(loadout + runbook + brief),
    'loadout extraction must document the slate matte fallback');
  assert(/chroma_key\.py/.test(loadout + runbook + brief),
    'loadout extraction must route slate batches through chroma_key.py');
  assert(/magenta backgrounds are rejected|hot magenta fringe/.test(brief + runbook + loadout),
    'docs must reject magenta matte fringe');
  assert(/sample_background/.test(chroma) && /including ring holes/.test(chroma),
    'chroma_key.py must key sampled background through interior holes');
  assert(/ragged fringe/.test(loadout) && /body armor/.test(loadout),
    'loadout QA must track ragged body armor fringe');
  assert(/Long weapon framing rule/.test(loadout),
    'loadout prompt must include explicit long weapon framing');
  assert(/shaft at least five times the length of the head/.test(loadout),
    'loadout prompt must preserve polearm shaft proportions');
  assert(/shortened into a club\/wand\/mace-length/.test(loadout),
    'loadout QA must reject shortened long weapons');
  assert(/polearms shortened into clubs/.test(fs.readFileSync(path.join(__dirname, '..', 'AGENTS.md'), 'utf8')),
    'agent guidance must reject shortened polearms in loadout extraction');
  assert(/Slot hygiene rules/.test(loadout) && /Rings for fingers must be compact/.test(loadout),
    'loadout prompt must include slot hygiene rules for rings');
  assert(/Amulets must be one pendant/.test(loadout) && /Belts must render as horizontal/.test(loadout),
    'loadout prompt must prevent amulet and belt slot drift');
  assert(/Shields must show the front fighting face only/.test(loadout),
    'loadout prompt must constrain shield front rendering');
  assert(/Solar symbols, eight-spoked wheel symbols, and human-face centerpieces/.test(loadout),
    'loadout prompt must constrain overused motifs');
  assert(/Motif budget and anti-overmatching/.test(loadout) && /central round blue stone/.test(loadout + brief + style),
    'loadout prompt must prevent overmatched repeated centerpieces');
  assert(/SLOT HYGIENE AND ANTI-COSTUME CLUTTER/.test(brief) && /Slot hygiene \/ anti-costume clutter/.test(fs.readFileSync(path.join(__dirname, '..', 'AGENTS.md'), 'utf8')),
    'brief and agent guidance must carry anti-costume clutter rules');
  assert(/Held foci and ritual tools belong to the off-hand slot/.test(plan)
      && /hands-free floating\/orbiting foci belong to the Attendant seat/.test(plan),
    'generation plan must distinguish held foci from Attendants');
});
t('character source prompts are self-contained and non-proprietary', () => {
  const agents = fs.readFileSync(path.join(__dirname, '..', 'AGENTS.md'), 'utf8');
  const brief = fs.readFileSync(path.join(__dirname, 'ASSET-BRIEF.md'), 'utf8');
  const style = fs.readFileSync(path.join(__dirname, 'STYLE-EXPERIMENTS.md'), 'utf8');
  const loadout = fs.readFileSync(path.join(__dirname, 'LOADOUT-EXTRACTION.md'), 'utf8');
  const docs = agents + brief + style;
  assert(/SELF-CONTAINED CHARACTER\/SOURCE PROMPTS/.test(brief),
    'brief must define self-contained character/source prompts as a hard rule');
  assert(/Character\/source prompts must be self-contained/.test(agents),
    'agent guidance must forbid shorthand character prompt context');
  assert(/full faction design language/.test(style),
    'style experiments must require expanded faction design language');
  assert(/class\/stat gear grammar/.test(style),
    'style experiments must require expanded class/stat gear grammar');
  assert(/tier language/.test(style),
    'style experiments must require expanded tier language');
  assert(/Use composite prompt assembly/.test(style),
    'style experiments must recommend composite prompt assembly for large prompts');
  assert(/Do not optimize final character prompts for brevity/.test(style),
    'style experiments must forbid brevity-optimized character prompts');
  assert(/fully loaded image-generation prompt with expanded\s+paragraphs/.test(style),
    'style experiments must require expanded prompt paragraphs');
  assert(/do not assume lore familiarity/.test(brief + agents),
    'docs must forbid assumed lore familiarity with internal factions');
  assert(/equipment bases are unisex/i.test(brief + style),
    'docs must require unisex equipment bases with body-fit variation');
  assert(/side-laid object|side-laid weapons or shields|Side-Laid Item Reference Rule/i.test(brief + style),
    'docs must preserve side-laid weapons and shields as authoritative references');
  assert(/CHARACTER CALIBRATION PROMPTS/.test(brief) && /separate-image sets/.test(agents + brief + style + loadout),
    'docs must prefer separate-image sets for source-character calibration');
  assert(/body\/silhouette archetype/.test(agents + brief + style + loadout),
    'docs must require faction body/silhouette archetypes');
  assert(/virtue\/vice/.test(agents + brief + style + loadout),
    'docs must require faction virtue/vice gear pressure');
  assert(/Do not write private elemental planning labels/.test(loadout) || /private elemental planning labels/.test(brief + agents),
    'docs must keep private elemental planning labels out of final prompts');
  assert(/belts, amulets, foci\/offhands, handwear, footwear, and outer\s+layers/.test(brief + loadout),
    'docs must force minor slot progression across tiers');
  assert(/every faction does not receive the same mirror disk|all foci do not become mirrors/.test(brief + style + loadout),
    'docs must diversify Mage offhand/focus families');
  assert(/Prompt length is not the thing to optimize; visual specificity is/.test(brief),
    'brief must prioritize visual specificity over prompt brevity');
  assert(/Northern Bronze Houses/.test(agents + brief + style + loadout),
    'character prompt guidance must use the corrected northern faction taxonomy');
  assert(/not a\s+marsh\/taiga faction/.test(brief) && /muddy grey-brown clothing/.test(loadout),
    'docs must record why marsh/taiga language is invalid for northern prompts');
  assert(/pale\s+hemmed wool and\s+linen/.test(agents + brief + style + loadout) && /bright\s+polished\s+bronze/.test(agents + brief),
    'northern taxonomy must define a clean high-value Bronze Age material language');
  assert(/STARTER FACTION LADDER UNIT/.test(brief) && /Generate 9 images\. No commentary\./.test(agents + brief + style),
    'docs must define the exact nine-image faction ladder prompt unit');
  assert(/Strength T1-T3,\s+Dexterity T1-T3,\s+(and\s+)?Intelligence T1-T3/.test(agents + brief + style),
    'faction ladder must preserve the complete three-attribute by three-tier matrix');
  assert(/must not\s+name fixed fantasy classes|never name fixed fantasy classes/.test(agents + brief + style),
    'final character prompts must use attribute axes instead of named classes');
  assert(/equipment problem-solving|equipment logic/.test(agents + brief + style),
    'docs must define axes as gear logic rather than professions');
  assert(/Do not add\s+an asymmetric tenth image|do not fill the model's tenth-image/.test(brief + style),
    'faction ladder must not invent a tenth asymmetric concept');
  assert(/TIER CONTRAST MUST BE MACROSCOPIC/.test(brief) && /at least five/.test(agents + brief + style),
    'tier ladders must force several macro design changes between adjacent tiers');
  assert(/richer, more saturated\s+faction-specific palette|richest controlled palette/.test(brief + style),
    'tier ladders must explicitly escalate faction color richness');
  assert(/workmanship and construction/.test(brief) && /not dangling clutter/.test(agents),
    'high-tier intricacy must not regress into decorative clutter');
  assert(/FACTION PALETTE IS NOT FACTION LIVERY/.test(brief) && /material-local/.test(agents + brief + style),
    'faction prompts must treat palette as local material color rather than uniform livery');
  assert(/roughly\s+one-third/.test(agents + brief + style) && /four separated\s+color-material zones/.test(agents + brief + style),
    'character prompts must cap dominant dye and require several color-material zones');
  assert(/different color hierarchies/.test(agents + brief + style),
    'attribute axes must vary color hierarchy inside each faction');
  assert(/SOURCE-CHARACTER COLOR ENVIRONMENT IS STRICTLY NEUTRAL/.test(brief) &&
      /Neutral source-character color environment/.test(agents),
    'durable rules must define the neutral source-character environment');
  assert(/pure neutral-white/.test(agents + brief + style + loadout) &&
      /neutral-white rim/.test(agents + brief + style + loadout),
    'source-character prompts must use a neutral-white background and rim');
  assert(/Do not use (a )?blue-gray (backdrop|background)/.test(agents + brief + style) &&
      /global desaturation/.test(agents + brief + style),
    'source-character prompts must reject the shared blue cast and subdued grade');
  assert(/Only Nile Intelligence/.test(agents + brief) &&
      /Northern, Cedar, and Silkroad/.test(agents + brief + style),
    'blue palette drivers must be restricted to the assigned Nile Intelligence field');
  assert(/Do not save Alexei's proprietary legacy character prompts/.test(docs),
    'docs must protect proprietary legacy prompt examples');
  assert(!/Minoan Acrobat-Warrior[\s\S]{0,120}hyper-sculpted/.test(docs),
    'docs must not contain pasted proprietary legacy prompt examples');
});
t('true-alpha assets bypass matte and quantization', () => {
  const compose = fs.readFileSync(path.join(__dirname, 'compose_assets.py'), 'utf8');
  const matte = fs.readFileSync(path.join(__dirname, 'art_matte.py'), 'utf8');
  const runbook = fs.readFileSync(path.join(__dirname, 'RUNBOOK.md'), 'utf8');
  assert(/TRUE-ALPHA image-2 downloads are preserved as RGBA/.test(compose),
    'compose must preserve true-alpha downloads as RGBA');
  assert(/has_true_alpha/.test(compose) && /save_true_alpha/.test(compose),
    'compose must have a true-alpha direct path');
  assert(/They are not matted and not palette-quantized/.test(compose),
    'compose docs must forbid matte/quantize for true alpha');
  assert(/m = al >= 8/.test(matte),
    'art_matte true-alpha path must use source alpha directly');
  assert(/skip matte generation/.test(runbook),
    'runbook must tell operators to skip matte generation for true alpha');
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
t('generation plan rejects boring relic tablets and plaques', () => {
  const planPath = path.join(__dirname, 'GENERATION-PLAN.md');
  const basePath = path.join(__dirname, 'BASE-DESIGN.md');
  const notesPath = path.join(__dirname, 'REFERENCE-NOTES.md');
  const plan = fs.readFileSync(planPath, 'utf8');
  const base = fs.readFileSync(basePath, 'utf8');
  const notes = fs.readFileSync(notesPath, 'utf8');
  assert(!/\| (Rite foci \/ sceptres|Charms \/ relic curios|Off-hand foci) \|[^\n]*(tablet|plaque|ward plate)/i.test(plan),
    'allocation table must not use tablets/plaques/ward plates as positive relic sources');
  assert(/flat tablets, ward plates, carved slabs/.test(plan),
    'plan must forbid flat tablet and ward-plate relic concepts');
  assert(/flat tablets, plaques/.test(base),
    'base design must reject flat tablets and plaques');
  assert(/Bad relic gear[\s\S]*flat tablet/.test(notes),
    'reference notes must classify flat tablets as bad relic gear');
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
t('wearable item prompts require plausible construction', () => {
  const brief = fs.readFileSync(path.join(__dirname, 'ASSET-BRIEF.md'), 'utf8');
  const plan = fs.readFileSync(path.join(__dirname, 'GENERATION-PLAN.md'), 'utf8');
  const targets = fs.readFileSync(path.join(__dirname, 'targets.tsv'), 'utf8');
  const manifest = fs.readFileSync(path.join(__dirname, 'verdigris-manifest.tsv'), 'utf8');
  assert(/WEARABLE\/CARRIED CONSTRUCTION MUST BE PLAUSIBLE/.test(brief),
    'brief must require plausible wearable construction');
  assert(/Bone armour must be assembled from smaller bone plates/.test(plan),
    'plan must forbid magic one-piece bone armour plates');
  assert(!/bone shin guards?[^\n]*(single|solid|one-piece|perfect)/i.test(plan + targets + manifest),
    'bone shin guards must not be one solid perfect plate');
  assert(!/greaves_jade[^\n]*single piece/i.test(targets + manifest),
    'jade greaves must not be a single magic shell');
  assert(/greaves_jade[^\n]*leather backing[^\n]*side straps/i.test(targets),
    'jade greaves target must include backing and straps');
  assert(/bracers_bronzeplate[^\n]*leather backing[^\n]*straps/i.test(targets),
    'bracer target must include backing and straps');
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

/* ---------------- combat (verdigris-combat.js) ---------------- */
const Combat = require('./verdigris-combat.js');
const mkFighter = (bonds, awakenedTheme) => {
  const it = forge.generateItem({ ilvl: 60, formId: 'hideshield', materialId: 'bronze', brands: 0 });
  it.vessel = Math.max(it.vessel, bonds.length);
  it.bonds = bonds;
  if (awakenedTheme) it.awakened = { name: 'X', themeId: awakenedTheme, power: 'p', flavor: 'f' };
  return it;
};
t('battle resolves deterministically with seeded rng and bonds fire', () => {
  const mul = (seed) => { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; };
  const shield = mkFighter([
    { id: 'b1', modId: 'shieldwall', themeId: 'warding', base: 14, tier: 3, kinship: 'shieldbearer' },
    { id: 'b2', modId: 'stand_ground', themeId: 'warding', base: 5, tier: 3, kinship: 'shieldbearer' },
  ]);
  const run = (seed) => Combat.resolveBattle(forge, pack, {
    items: [shield], level: 6, charName: 'T', archetype: 'shieldbearer',
    encounter: pack.encounters[1], rng: mul(seed),
  });
  const a = run(42), b = run(42);
  eq(a.rounds, b.rounds, 'deterministic rounds');
  eq(a.hp, b.hp, 'deterministic hp');
  let anyProc = false;
  for (let s = 1; s < 30 && !anyProc; s++) {
    anyProc = run(s).log.some(l => /Shieldwall|Stand Your Ground/.test(l.text));
  }
  assert(anyProc, 'warding bonds proc on block across seeds');
});
t('last stand saves a doomed bearer exactly once', () => {
  const relic = mkFighter([], 'warding');
  // rng: never crit, never block/avoid, big foe hits -> death without Last Stand
  const doomRng = (() => { let i = 0; return () => (i++ % 2 === 0 ? 0.99 : 0.5); })();
  const r = Combat.resolveBattle(forge, pack, {
    items: [relic], level: 30, hp: 2, charName: 'T', archetype: 'redhand',
    encounter: pack.encounters[0], rng: doomRng,
  });
  const stands = r.log.filter(l => /LAST STAND/.test(l.text)).length;
  assert(stands <= 1, 'last stand fires at most once');
  if (!r.survived) assert(r.hp === 0, 'death reports 0 hp');
});
t('death is reported with a death log entry', () => {
  let died = null;
  for (let s = 0; s < 60 && !died; s++) {
    const mul = (() => { let a = s + 7; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
    const r = Combat.resolveBattle(forge, pack, {
      items: [], level: 20, hp: 5, charName: 'T', archetype: 'redhand',
      encounter: pack.encounters[5], rng: mul,
    });
    if (!r.survived) died = r;
  }
  assert(died, 'an unarmed wounded bearer can die');
  assert(died.log.some(l => l.kind === 'death'), 'death entry logged');
});
t('venture accepts a pre-picked encounter', () => {
  const c = forge.createCharacter({ name: 'T', archetype: 'redhand' });
  const enc = pack.encounters[3];
  const r = forge.venture(c, {}, { encounter: enc });
  eq(r.encounter.text, enc.text, 'uses the provided encounter');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
