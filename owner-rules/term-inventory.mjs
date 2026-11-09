#!/usr/bin/env node
// Player-facing term inventory for WIZARD and the ARPG (owner, 2026-11-08: "I'm noticing a lot
// of remaining made up stuff ... I need a thorough purge").
//   node owner-rules/term-inventory.mjs --wizard <WIZARD root> --arpg <ARPG repo root> --out <dir>
// Reads exactly what lint.mjs reads (same file lists, same string extraction), then records every
// term: each capitalised word in player text or docs, every word of a Title Case label, and every
// watched mechanic word in any case. Classification comes from term-verdicts.json (origin and
// verdict per term) plus the rules below; unknown terms are reported as "unreviewed".
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parts, PROFILES, prose, isLabel } from './lint.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const V = JSON.parse(readFileSync(join(HERE, 'term-verdicts.json'), 'utf8'));
const WATCH = new Set(V.watch.map(w => w.toLowerCase()));

function* walk(dir, skip) {
  for (const name of readdirSync(dir)) {
    if (skip.includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p, skip); else yield p;
  }
}

function sources(repo, root) {
  const p = PROFILES[repo](root);
  const game = new Set([...(p.game || []), ...(p.text || []), ...(p.tree || []), ...(p.labels || [])]);
  if (repo === 'wizard') {
    // Data files players or the owner read in the live tools.
    for (const f of walk(join(root, 'tools'), ['node_modules', 'dist', '.git', 'fixtures', 'assets_staging', 'assets_inbox', 'review_assets', 'evidence']))
      if (f.endsWith('.json') && !f.endsWith('package.json') && !f.endsWith('package-lock.json') && statSync(f).size < 3_000_000) game.add(f);
  } else {
    const res = join(root, 'the ARPG/Assets/ARPG/Resources');
    for (const f of walk(res, [])) if (/\.(json|txt)$/.test(f) && statSync(f).size < 3_000_000) game.add(f);
  }
  return { game: [...game].filter(existsSync), docs: (p.docs || []).filter(existsSync) };
}

const TOKEN = /[A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Z]/g;
const terms = new Map();
function note(term, surface, repo, kind, file, context) {
  const key = term.toLowerCase().replace(/['’]s$/, '').replace(/['’]/g, '');
  if (key.length < 2) return;
  let t = terms.get(key);
  if (!t) terms.set(key, t = { term: key, surfaces: new Set(), count: { wizard: 0, arpg: 0 }, kinds: new Set(), files: new Map(), context: null, inLabel: false });
  t.surfaces.add(surface); t.count[repo]++; t.kinds.add(kind);
  t.files.set(file, (t.files.get(file) || 0) + 1);
  if (!t.context || (kind !== 'doc' && t.contextKind === 'doc')) { t.context = context.trim().slice(0, 140); t.contextKind = kind; }
}

function scan(repo, root) {
  const { game, docs } = sources(repo, root);
  for (const [list, kind] of [[game, 'game'], [docs, 'doc']]) for (const file of list) {
    let ps; try { ps = parts(file); } catch { continue; }
    const rel = `${repo}:${relative(root, file)}`;
    for (const [, raw] of ps) {
      if (typeof raw !== 'string' || !raw.trim()) continue;
      const text = kind === 'doc' ? raw.replace(/`[^`]*`/g, ' ').replace(/https?:\/\/\S+/g, ' ') : raw;
      const clean = prose(text);
      const label = kind === 'game' && isLabel(text);
      for (const m of clean.match(TOKEN) || []) for (const part of m.split('-')) {
        if (!part) continue;
        const lower = part.toLowerCase();
        if (label || /^[A-Z]/.test(part) || WATCH.has(lower)) note(part, part, repo, label ? 'label' : kind, rel, text);
      }
    }
  }
}

// ---- classification -------------------------------------------------------------------------
const DICT = new Set(existsSync('/usr/share/dict/words') ? readFileSync('/usr/share/dict/words', 'utf8').split('\n').map(w => w.toLowerCase()) : []);
const POE = new Set(V.poe.map(w => w.toLowerCase()));
const OWNER = new Set(Object.keys(V.owner).map(w => w.toLowerCase()));
function classify(t) {
  const o = V.terms[t.term];
  if (o) return o;
  if (OWNER.has(t.term)) return { origin: 'owner', verdict: 'keep', note: V.owner[t.term] };
  if (POE.has(t.term)) return { origin: 'poe', verdict: 'keep' };
  const docOnly = !t.kinds.has('game') && !t.kinds.has('label');
  const base = t.term.replace(/(ies)$/, 'y').replace(/(es|s|ed|ing)$/, '');
  if (DICT.has(t.term) || DICT.has(base) || DICT.has(t.term.replace(/s$/, ''))) return { origin: 'plain', verdict: 'keep' };
  if (docOnly) return { origin: 'unreviewed-doc', verdict: 'review' };
  return { origin: 'unreviewed', verdict: 'review' };
}

const wizard = arg('--wizard'), arpg = arg('--arpg'), out = arg('--out') || HERE;
if (wizard) scan('wizard', wizard);
if (arpg) scan('arpg', arpg);
const rows = [...terms.values()].map(t => {
  const c = classify(t);
  const files = [...t.files].sort((a, b) => b[1] - a[1]);
  return { term: t.term, surfaces: [...t.surfaces].slice(0, 6), count: t.count, total: t.count.wizard + t.count.arpg,
    kinds: [...t.kinds].sort(), fileCount: files.length, files: files.slice(0, 8).map(([f, n]) => `${f} (${n})`),
    context: t.context, origin: c.origin, verdict: c.verdict, after: c.after ?? null, note: c.note ?? null };
}).sort((a, b) => a.term.localeCompare(b.term));
writeFileSync(join(out, 'TERM-INVENTORY.json'), JSON.stringify({ generated: new Date().toISOString().slice(0, 10), rule: V.rule, terms: rows }, null, 1) + '\n');
// Markdown inventory: one row per term (purged terms first), with where it appears and its verdict.
const esc = x => String(x ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');
const md = ['# Term inventory', '', `Generated ${new Date().toISOString().slice(0, 10)} by owner-rules/term-inventory.mjs from the player-facing text of WIZARD and the ARPG and the WIZARD docs. Machine-readable copy: TERM-INVENTORY.json.`, '',
  `Rule: ${V.rule}`, '', 'Origin: owner (the owner introduced it; evidence quoted), poe (standard PoE term, same meaning), plain (plain English, used plainly), real-world (real place, person, object), technical (code or tool jargon), other-game, agent-invented. Kinds: label (word of a Title Case name), game (player-facing text or data), doc (WIZARD docs).', '',
  '| Term | Verdict | After | Origin | Count (WIZARD / ARPG) | Kinds | Files | Example | Note |', '|---|---|---|---|---|---|---|---|---|'];
for (const r of [...rows].sort((a, b) => (a.verdict === 'purge' ? 0 : 1) - (b.verdict === 'purge' ? 0 : 1) || a.term.localeCompare(b.term)))
  md.push(`| ${esc(r.term)} | ${r.verdict} | ${esc(r.after)} | ${r.origin} | ${r.count.wizard} / ${r.count.arpg} | ${r.kinds.join(', ')} | ${r.fileCount}: ${esc(r.files.slice(0, 3).join('; '))} | ${esc(r.context).slice(0, 80)} | ${esc(r.note)} |`);
writeFileSync(join(out, 'TERM-INVENTORY.md'), md.join('\n') + '\n');
// Glossary: every kept term that players can read (game text, labels, tool pages). Doc-only terms stay out.
if (process.argv.includes('--glossary')) {
  const g = rows.filter(r => r.verdict === 'keep' && (r.kinds.includes('game') || r.kinds.includes('label')))
    .map(r => ({ term: r.term, origin: r.origin, note: r.note || undefined }));
  for (const [term, note] of Object.entries(V.owner)) if (!g.some(x => x.term === term)) g.push({ term, origin: 'owner', note });
  // Every word of an approved replacement name (rename-map.json 'after') is a glossary term: it must be
  // a dictionary word, an owner/PoE term, or have a keep verdict; anything else stops the build.
  const MAPF = JSON.parse(readFileSync(join(HERE, 'rename-map.json'), 'utf8'));
  for (const e of MAPF.entries) for (const w of String(e.after || '').match(/[A-Za-z][A-Za-z'’]*/g) || []) {
    const term = w.toLowerCase().replace(/['’]s$/, '');
    if (term.length < 2 || g.some(x => x.term === term)) continue;
    const v = V.terms[term];
    if (v && v.verdict !== 'keep') continue;
    const origin = v ? v.origin : OWNER.has(term) ? 'owner' : POE.has(term) ? 'poe' : [term, term.replace(/s$/, ''), term.replace(/(es|ed|ing)$/, ''), term.replace(/(ed|ing)$/, 'e'), term.replace(/ies$/, 'y')].some(x => DICT.has(x)) ? 'plain' : null;
    if (!origin) throw new Error(`term-inventory: replacement word "${w}" (${e.before} -> ${e.after}) has no verdict; add it to term-verdicts.json`);
    g.push({ term, origin, note: `replacement word (${e.before} -> ${e.after})` });
  }
  g.sort((a, b) => a.term.localeCompare(b.term));
  writeFileSync(join(HERE, 'glossary.json'), JSON.stringify({ rule: V.rule, generated: new Date().toISOString().slice(0, 10),
    howToAdd: 'A new term enters only with its origin: owner (quote the owner), poe (same meaning as in PoE), or plain (plain English used plainly). Edit term-verdicts.json and rerun term-inventory.mjs --glossary.', terms: g }, null, 1) + '\n');
  const gm = ['# Glossary (closed)', '', 'Every capitalised word in player-facing text, and every word of a Title Case label or stat name, in WIZARD and the ARPG must be one of these terms. `owner-rules/lint.mjs` fails otherwise, in both repositories\' gates. Source: glossary.json, generated by term-inventory.mjs from term-verdicts.json.', '',
    `Rule: ${V.rule}`, '', `Terms: ${g.length} (owner ${g.filter(x => x.origin === 'owner').length}, PoE ${g.filter(x => x.origin === 'poe').length}, plain ${g.filter(x => x.origin === 'plain').length}, other kept ${g.filter(x => !['owner', 'poe', 'plain'].includes(x.origin)).length}).`, '',
    '## Owner and PoE terms', '', '| Term | Origin | Evidence |', '|---|---|---|',
    ...g.filter(x => x.origin === 'owner' || x.origin === 'poe').map(x => `| ${x.term} | ${x.origin} | ${esc(x.note)} |`), '',
    '## Plain English and other kept words', '', g.filter(x => x.origin !== 'owner' && x.origin !== 'poe').map(x => x.term + (x.origin === 'plain' ? '' : ` (${x.origin})`)).join(', '), ''];
  writeFileSync(join(HERE, 'GLOSSARY.md'), gm.join('\n'));
}
const by = rows.reduce((m, r) => (m[`${r.origin}/${r.verdict}`] = (m[`${r.origin}/${r.verdict}`] || 0) + 1, m), {});
console.log(`term-inventory: ${rows.length} terms`, by);
