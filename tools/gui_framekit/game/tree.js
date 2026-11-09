/* Passive tree demo — generated radial graph drawn with framekit crops
   and brass canvas connectors (replaces the flat concept poster). */
(() => {
"use strict";
const { $, px } = FK;

const W = 1100, C = W / 2;
const canvas = $("#treeCanvas");
const ctx = canvas.getContext("2d");
const overlayEl = $("#treeOverlay");

const SMALL_NAMES = [
  ["Ward", "+5% maximum Ward."],
  ["Critical Strike Chance", "+8% critical strike chance."],
  ["Armour", "+12 Armour."],
  ["Cast Speed", "+6% cast speed."],
  ["Mana Regeneration", "+10% mana regeneration."],
  ["Movement Speed", "+8% movement speed."],
  ["Accuracy", "+5% accuracy."],
  ["Life", "+10 maximum Life."],
  ["Life Regeneration", "Regenerate 1% of Life per second."],
  ["Physical Damage", "+7% physical damage."],
  ["Evasion", "+8% evasion."],
  ["Intelligence", "+8 Intelligence."],
  ["Projectile Damage", "+6% projectile damage."],
  ["Mana Cost", "-5% mana cost of skills."],
  ["Damage at Low Life", "+10% damage while below 30% Life."],
];
const NOTABLES = [
  ["med_star", "Damage Against Marked Enemies", "+15% damage against marked enemies."],
  ["med_shield", "Ward Duration", "Wards last 40% longer."],
  ["med_torch", "Light Radius", "+20% light radius."],
  ["med_snake", "Critical Strike Multiplier", "+12% critical strike multiplier."],
  ["med_scales", "Damage Taken Over Time", "Damage taken is spread over 4 seconds."],
  ["med_hourglass", "Damage After Standing Still", "+25% damage after standing still for 2 seconds."],
];
const OUTER = [
  ["socket_gold", "Intelligence per Notable", "+5 Intelligence per allocated notable."],
  ["med_sunteal", "Free Fire Nova at Full Life", "Fire Nova costs no mana while on full Life."],
  ["socket_gold", "Ward Cannot Break", "Wards cannot break; they expire instead."],
  ["med_eaglehead", "Cannot Be Stunned", "Cannot be stunned."],
  ["socket_gold", "+1 to All Skills", "+1 to level of all skills."],
  ["med_flower", "Area of Effect", "+10% area of effect."],
];

/* ------------------------------------------------------ generate graph */
const nodes = [];
function addNode(x, y, kind, icon, size, name, desc) {
  const n = { i: nodes.length, x, y, kind, icon, size, name, desc, on: false, edges: [] };
  nodes.push(n);
  return n;
}
const link = (a, b) => { a.edges.push(b); b.edges.push(a); };

const key = addNode(C, C, "keystone", "laurel_sun", 118, "Start",
  "Starting node. Every path begins here.");
key.on = true;

const SPOKES = 6;
let smallIdx = 0;
const ring1 = [], ring2 = [], ring3out = [];
for (let s = 0; s < SPOKES; s++) {
  const a = -Math.PI / 2 + s * (Math.PI * 2 / SPOKES);
  const dir = t => [C + Math.cos(a) * t, C + Math.sin(a) * t];
  const [x1, y1] = dir(160);
  const sm = SMALL_NAMES[smallIdx++ % SMALL_NAMES.length];
  const n1 = addNode(x1, y1, "small", "ring_plain", 46, sm[0], sm[1]);
  link(key, n1); ring1.push(n1);

  const [x2, y2] = dir(268);
  const nb = NOTABLES[s];
  const n2 = addNode(x2, y2, "notable", nb[0], 66, nb[1], nb[2]);
  link(n1, n2); ring2.push(n2);

  // two branch smalls past the notable
  const branch = [];
  for (const da of [-0.16, 0.16]) {
    const bx = C + Math.cos(a + da) * 372, by = C + Math.sin(a + da) * 372;
    const sm2 = SMALL_NAMES[smallIdx++ % SMALL_NAMES.length];
    const n3 = addNode(bx, by, "small", "ring_plain", 44, sm2[0], sm2[1]);
    link(n2, n3); branch.push(n3);
  }
  const [x4, y4] = dir(470);
  const ot = OUTER[s];
  const n4 = addNode(x4, y4, "outer", ot[0], 76, ot[1], ot[2]);
  branch.forEach(b => link(b, n4));
  ring3out.push({ branch, outer: n4 });
}
/* ring-road connectors between adjacent spokes at ring 1 */
for (let s = 0; s < SPOKES; s++) link(ring1[s], ring1[(s + 1) % SPOKES]);
/* cross-links between neighboring branch smalls of adjacent spokes */
for (let s = 0; s < SPOKES; s++) {
  link(ring3out[s].branch[1], ring3out[(s + 1) % SPOKES].branch[0]);
}

/* ------------------------------------------------------------- render */
function allocatable(n) { return !n.on && n.edges.some(e => e.on); }
function connectedWithout(skip) {
  const seen = new Set([key]);
  const q = [key];
  while (q.length) {
    const n = q.pop();
    n.edges.forEach(e => {
      if (e.on && e !== skip && !seen.has(e)) { seen.add(e); q.push(e); }
    });
  }
  return nodes.every(n => !n.on || n === skip || seen.has(n));
}

function drawEdges() {
  ctx.clearRect(0, 0, W, W);
  /* faint geometric guides */
  ctx.save();
  ctx.strokeStyle = "rgba(140,110,60,.10)";
  ctx.lineWidth = 1;
  [160, 268, 372, 470].forEach(r => {
    ctx.beginPath(); ctx.arc(C, C, r, 0, Math.PI * 2); ctx.stroke();
  });
  ctx.restore();
  const seen = new Set();
  nodes.forEach(a => a.edges.forEach(b => {
    const id = a.i < b.i ? `${a.i}-${b.i}` : `${b.i}-${a.i}`;
    if (seen.has(id)) return;
    seen.add(id);
    const lit = a.on && b.on;
    const half = a.on || b.on;
    ctx.strokeStyle = lit ? "rgba(240,200,110,.95)"
      : half ? "rgba(190,150,80,.55)" : "rgba(120,95,55,.35)";
    ctx.lineWidth = lit ? 3.2 : 2;
    ctx.shadowColor = lit ? "rgba(240,200,110,.7)" : "transparent";
    ctx.shadowBlur = lit ? 9 : 0;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }));
  ctx.shadowBlur = 0;
}

let points = 12;
const pointsEl = $("#pointsLeft");
const skillName = $("#skillName"), skillDesc = $("#skillDesc"), skillMeta = $("#skillMeta");

function refresh() {
  nodes.forEach(n => {
    n.el.classList.toggle("on", n.on);
    n.el.classList.toggle("open", allocatable(n) && points > 0);
    n.el.setAttribute("aria-pressed", String(n.on));
    n.el.setAttribute("aria-label", `${n.name}. ${nodeStatus(n)}`);
  });
  pointsEl.textContent = points;
  drawEdges();
}

function nodeStatus(n) {
  return n.kind === "keystone" ? "Keystone"
    : n.on ? "Learned" : allocatable(n) ? "Cost: 1 point" : "Requires a connected node";
}

let focusIndex = nodes.find(n => n.on)?.i || 0;
function focusNode(n) {
  focusIndex = n.i;
  nodes.forEach(candidate => { candidate.el.tabIndex = candidate === n ? 0 : -1; });
  n.el.focus({ preventScroll: true });
}

nodes.forEach(n => {
  const el = document.createElement("div");
  n.el = el;
  el.className = `tnode ${n.kind}`;
  el.tabIndex = n.i === focusIndex ? 0 : -1;
  el.setAttribute("role", "button");
  Object.assign(el.style, {
    left: px(n.x - n.size / 2), top: px(n.y - n.size / 2),
    width: px(n.size), height: px(n.size),
  });
  el.innerHTML = `<img src="assets/${n.icon}.png" alt="">`;
  const present = () => {
    skillName.textContent = n.name;
    skillDesc.textContent = n.desc;
    skillMeta.textContent = nodeStatus(n);
  };
  el.addEventListener("focus", present);
  el.addEventListener("pointerenter", ev => {
    present();
    FK.showTip({ name: n.name, rarity: n.on ? "legendary" : (n.kind === "notable" || n.kind === "outer") ? "epic" : "common",
      type: n.kind === "keystone" ? "Keystone" : n.kind === "outer" ? "Outer Passive · 1 point"
        : n.kind === "notable" ? "Notable · 1 point" : "Passive · 1 point",
      stats: [n.desc] }, n.name, FK.stagePoint(ev));
  });
  el.addEventListener("pointerleave", FK.hideTip);
  const activate = () => {
    if (n.kind === "keystone") return;
    const deny = () => {
      el.classList.add("shake");
      setTimeout(() => el.classList.remove("shake"), 350);
    };
    if (n.on) {
      n.on = false;
      if (!connectedWithout(n)) { n.on = true; deny(); return; }
      points++;
    } else if (points > 0 && n.edges.some(e => e.on)) {
      n.on = true; points--;
    } else { deny(); return; }
    skillMeta.textContent = n.on ? "Learned" : "Cost · 1 point";
    refresh();
  };
  el.addEventListener("click", activate);
  el.addEventListener("keydown", ev => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      activate();
      return;
    }
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = directions[ev.key];
    if (!direction) return;
    ev.preventDefault();
    const [dx, dy] = direction;
    const candidates = nodes.filter(candidate => candidate !== n &&
      (candidate.x - n.x) * dx + (candidate.y - n.y) * dy > 0);
    candidates.sort((a, b) => {
      const score = candidate => {
        const vx = candidate.x - n.x, vy = candidate.y - n.y;
        const forward = vx * dx + vy * dy;
        const lateral = Math.abs(vx * dy - vy * dx);
        return Math.hypot(vx, vy) + lateral * 1.8 - forward * .1;
      };
      return score(a) - score(b);
    });
    if (candidates[0]) focusNode(candidates[0]);
  });
  overlayEl.appendChild(el);
});
refresh();
})();
