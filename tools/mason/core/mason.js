/*
 * Mason — directional border tiles for terrain transitions. Part of WIZARD.
 *
 * Generates complete autotile border sets — the art for where one terrain
 * meets another — for square tiles (47-tile blob set) and hex tiles
 * (64-combination edge set). Deterministic per seed; the same seed always
 * paints the same set.
 *
 * The bitmask logic is pure and runs anywhere (node included); the painters
 * need a canvas 2D context and run in the browser.
 *
 * Square blob convention (8 neighbor bits):
 *   bit 0 = N, 1 = NE, 2 = E, 3 = SE, 4 = S, 5 = SW, 6 = W, 7 = NW
 *   A corner bit only matters when both adjacent edge bits are set;
 *   canonical() collapses the 256 raw masks onto the 47 blob tiles.
 *
 * Hex convention (pointy-top, y-down screen space, 6 edge bits):
 *   bit 0 = E, 1 = SE, 2 = SW, 3 = W, 4 = NW, 5 = NE
 *   All 64 combinations are distinct tiles.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Mason = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '1.0.0';

  // ---------------------------------------------------------------- rng

  function hashString(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash2(x, y, seed) {
    var h = (x * 374761393 + y * 668265263 + (seed | 0)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return (h ^ (h >>> 16)) >>> 0;
  }

  // ---------------------------------------------------------------- square blob masks

  var N = 1, NE = 2, E = 4, SE = 8, S = 16, SW = 32, W = 64, NW = 128;

  // Corner bits count only when both adjacent edges are present.
  function canonical(mask) {
    var m = mask & 255;
    if ((m & NE) && !((m & N) && (m & E))) m &= ~NE;
    if ((m & SE) && !((m & S) && (m & E))) m &= ~SE;
    if ((m & SW) && !((m & S) && (m & W))) m &= ~SW;
    if ((m & NW) && !((m & N) && (m & W))) m &= ~NW;
    return m;
  }

  var BLOB_MASKS = (function () {
    var seen = {};
    var list = [];
    for (var m = 0; m < 256; m++) {
      var c = canonical(m);
      if (!seen[c]) { seen[c] = true; list.push(c); }
    }
    list.sort(function (a, b) { return a - b; });
    return list;
  })();

  // 256 -> index into BLOB_MASKS
  var BLOB_LOOKUP = (function () {
    var idx = {};
    BLOB_MASKS.forEach(function (m, i) { idx[m] = i; });
    var table = new Array(256);
    for (var m = 0; m < 256; m++) table[m] = idx[canonical(m)];
    return table;
  })();

  // neighbor offsets in bit order (dx, dy), y-down
  var SQUARE_NEIGHBORS = [
    [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]
  ];

  // hex axial neighbor offsets (pointy-top, y-down): E, SE, SW, W, NW, NE
  var HEX_NEIGHBORS = [
    [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]
  ];

  var HEX_MASK_COUNT = 64;

  // ---------------------------------------------------------------- terrains

  var TERRAINS = {
    grass: {
      name: 'Grass', base: ['#4c6c36', '#446230'],
      rim: '#628a42', rimDark: 'rgba(20,32,12,0.5)', tufts: true
    },
    sand: {
      name: 'Sand', base: ['#d2b886', '#c6ac7a'],
      rim: '#e0c896', rimDark: 'rgba(90,70,40,0.35)'
    },
    water: {
      name: 'Water', base: ['#2e6284', '#295a7c'],
      rim: '#4a86a8', rimDark: 'rgba(10,26,38,0.5)', foam: '#d4ecf4', sparkle: true
    },
    stone: {
      name: 'Stone', base: ['#7a7870', '#6e6c64'],
      rim: '#8e8c82', rimDark: 'rgba(20,20,18,0.55)', cracks: true
    },
    snow: {
      name: 'Snow', base: ['#dfe6ea', '#d2dbe2'],
      rim: '#f2f6f8', rimDark: 'rgba(110,140,170,0.4)', sparkle: true
    },
    lava: {
      name: 'Lava', base: ['#c84a14', '#a83a10'],
      rim: '#3a2018', rimDark: 'rgba(0,0,0,0.4)', glow: '#ffb054', veins: true
    },
    dirt: {
      name: 'Dirt', base: ['#7a5c40', '#6e5238'],
      rim: '#8a6a4a', rimDark: 'rgba(30,20,12,0.45)'
    },
    void: {
      name: 'Void', base: ['#121020', '#0e0d1a'],
      rim: '#6a5aa8', rimDark: 'rgba(0,0,0,0.6)', stars: true, glowRim: true
    }
  };

  // ---------------------------------------------------------------- set parameters

  // Per-set deterministic edge curves. The wobble along each edge direction is
  // shared by every tile in the set, and its envelope is zero at both edge
  // endpoints, so any two tiles of the set butt together seamlessly.
  function makeSetParams(opts) {
    var seed = opts.seed;
    if (seed === undefined || seed === null || seed === '') seed = (Math.random() * 0xFFFFFFFF) >>> 0;
    if (typeof seed === 'string') seed = /^\d+$/.test(seed) ? (parseInt(seed, 10) >>> 0) : hashString(seed);
    var rng = mulberry32(seed >>> 0);
    function edgeParams() {
      return {
        f1: 1 + Math.floor(rng() * 3),        // 1..3 half-waves
        f2: 3 + Math.floor(rng() * 3),        // 3..5 half-waves
        p1: rng() * Math.PI * 2,
        p2: rng() * Math.PI * 2,
        a1: 0.5 + rng() * 0.5,
        a2: 0.25 + rng() * 0.35
      };
    }
    var edges = [];
    for (var i = 0; i < 6; i++) edges.push(edgeParams()); // 4 used by square, 6 by hex
    return {
      seed: seed >>> 0,
      size: opts.size || 32,
      inner: opts.inner || 'grass',
      outer: opts.outer || 'sand',
      shape: opts.shape === 'hex' ? 'hex' : 'square',
      borderFrac: opts.borderFrac || 0.3,   // border width as a fraction of tile size
      wobbleFrac: opts.wobbleFrac || 0.45,  // wobble amplitude relative to border width
      edges: edges
    };
  }

  // wobble along an edge: t in [0,1], returns multiplier around 1
  function wobble(params, edgeIndex, t, wobbleFrac) {
    var e = params.edges[edgeIndex];
    var env = Math.sin(Math.PI * t); // zero at both endpoints
    var n = e.a1 * Math.sin(Math.PI * e.f1 * t + e.p1) +
            e.a2 * Math.sin(Math.PI * e.f2 * t + e.p2);
    return 1 + wobbleFrac * env * n;
  }

  // ---------------------------------------------------------------- texture sampling

  function hexRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // per-pixel terrain color; wx/wy are world pixel coords so textures
  // continue across tiles in a painted grid
  function sampleTerrain(style, wx, wy, seed, out) {
    var h = hash2(wx, wy, seed);
    var base = hexRgb(style.base[h % 2]);
    var f = 0.93 + ((h >>> 4) % 14) / 100;
    var r = base[0] * f, g = base[1] * f, b = base[2] * f;
    if (style.veins) { // lava: bright veins on a coarse lattice
      var v = hash2(wx >> 2, wy >> 2, seed ^ 0x55aa) % 100;
      if (v > 72) {
        var glow = hexRgb(style.glow);
        var k = (v - 72) / 28 * 0.75;
        r += (glow[0] - r) * k; g += (glow[1] - g) * k; b += (glow[2] - b) * k;
      }
    }
    if (style.sparkle && h % 41 === 0) { r = Math.min(255, r + 70); g = Math.min(255, g + 70); b = Math.min(255, b + 70); }
    if (style.stars && h % 71 === 0) { r += 120; g += 120; b += 130; }
    if (style.cracks && h % 29 === 0) { r *= 0.72; g *= 0.72; b *= 0.72; }
    out[0] = r; out[1] = g; out[2] = b;
  }

  function mixInto(out, rgb, k) {
    out[0] += (rgb[0] - out[0]) * k;
    out[1] += (rgb[1] - out[1]) * k;
    out[2] += (rgb[2] - out[2]) * k;
  }

  // A sampler is (wx, wy, out) -> writes RGB. With a texture (an
  // ImageData-like {width, height, data}) it tiles the texture across
  // world space — the hook for AI-generated or hand-drawn art. Without
  // one it falls back to the procedural terrain style.
  function makeSampler(style, texture, seed) {
    if (texture && texture.width && texture.data) {
      var tw = texture.width, th = texture.height, td = texture.data;
      return function (wx, wy, out) {
        var tx = ((wx % tw) + tw) % tw;
        var ty = ((wy % th) + th) % th;
        var o = (ty * tw + tx) * 4;
        out[0] = td[o]; out[1] = td[o + 1]; out[2] = td[o + 2];
      };
    }
    return function (wx, wy, out) { sampleTerrain(style, wx, wy, seed, out); };
  }

  // ---------------------------------------------------------------- square tile painter

  /*
   * Paints one blob tile. The tile IS inner terrain; `mask` says which of
   * its 8 neighbors are also inner. Border art is drawn along every edge
   * facing outer terrain. wx0/wy0 anchor the texture in world space.
   */
  function paintSquareTile(ctx, px, py, params, mask, wx0, wy0) {
    var Ssz = params.size;
    var innerStyle = TERRAINS[params.inner], outerStyle = TERRAINS[params.outer];
    var seed = params.seed;
    var bw = Ssz * params.borderFrac;
    var m = canonical(mask);
    var img = ctx.createImageData(Ssz, Ssz);
    var data = img.data;
    var rimW = Math.max(1.5, Ssz * 0.09);
    var color = [0, 0, 0];
    var rimRgb = hexRgb(innerStyle.rim);
    var foamRgb = innerStyle.foam ? hexRgb(innerStyle.foam) : null;
    var outerFoamRgb = outerStyle.foam ? hexRgb(outerStyle.foam) : null;
    var glowRgb = innerStyle.glow ? hexRgb(innerStyle.glow) : (innerStyle.glowRim ? hexRgb(innerStyle.rim) : null);
    var tex = params.textures || {};
    var sampleInner = makeSampler(innerStyle, tex.inner, seed);
    var sampleOuter = makeSampler(outerStyle, tex.outer, seed);
    var overlay = params.overlay != null ? params.overlay : 1;

    for (var v = 0; v < Ssz; v++) {
      for (var u = 0; u < Ssz; u++) {
        // signed distance inside the inner region (positive = inside)
        var d = Infinity;
        if (!(m & N)) d = Math.min(d, v - bw * wobble(params, 0, u / (Ssz - 1), params.wobbleFrac));
        if (!(m & E)) d = Math.min(d, (Ssz - 1 - u) - bw * wobble(params, 1, v / (Ssz - 1), params.wobbleFrac));
        if (!(m & S)) d = Math.min(d, (Ssz - 1 - v) - bw * wobble(params, 2, u / (Ssz - 1), params.wobbleFrac));
        if (!(m & W)) d = Math.min(d, u - bw * wobble(params, 3, v / (Ssz - 1), params.wobbleFrac));
        // concave corner nibs where only the diagonal is outer
        if (!(m & NE) && (m & N) && (m & E)) d = Math.min(d, Math.hypot(u - (Ssz - 1), v) - bw);
        if (!(m & SE) && (m & S) && (m & E)) d = Math.min(d, Math.hypot(u - (Ssz - 1), v - (Ssz - 1)) - bw);
        if (!(m & SW) && (m & S) && (m & W)) d = Math.min(d, Math.hypot(u, v - (Ssz - 1)) - bw);
        if (!(m & NW) && (m & N) && (m & W)) d = Math.min(d, Math.hypot(u, v) - bw);

        var wx = wx0 + u, wy = wy0 + v;
        if (d < 0) {
          sampleOuter(wx, wy, color);
          // contact shading on the outer side of the boundary
          if (d > -rimW && overlay > 0) {
            var kOut = (1 + d / rimW) * overlay; // 1 at boundary -> 0 deep outside
            if (glowRgb) mixInto(color, glowRgb, kOut * 0.55);
            else color[0] *= 1 - kOut * 0.22, color[1] *= 1 - kOut * 0.22, color[2] *= 1 - kOut * 0.22;
            // lapping foam when the surrounding terrain is water
            if (outerFoamRgb && d > -rimW * 0.6 && hash2(wx, wy, seed ^ 0x77) % 6 < 2) {
              mixInto(color, outerFoamRgb, 0.7 * kOut);
            }
          }
        } else {
          sampleInner(wx, wy, color);
          if (d < rimW && isFinite(d) && overlay > 0) {
            var kIn = (1 - d / rimW) * overlay;
            mixInto(color, rimRgb, kIn * 0.7);
            if (foamRgb && d < rimW * 0.45 && hash2(wx, wy, seed ^ 0x77) % 5 < 2) {
              mixInto(color, foamRgb, 0.8 * overlay);
            }
          }
        }
        var o = (v * Ssz + u) * 4;
        data[o] = color[0]; data[o + 1] = color[1]; data[o + 2] = color[2]; data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, px, py);

    // vector flourishes: grass tufts overhanging the boundary
    if (innerStyle.tufts && m !== 255 && overlay > 0.3) {
      paintTufts(ctx, px, py, params, m, wx0, wy0);
    }
  }

  function paintTufts(ctx, px, py, params, m, wx0, wy0) {
    var Ssz = params.size;
    var bw = Ssz * params.borderFrac;
    var style = TERRAINS[params.inner];
    ctx.fillStyle = style.rim;
    var step = Math.max(3, Ssz >> 3);
    for (var t = step; t < Ssz - step; t += step) {
      var h = hash2(wx0 + t, wy0, params.seed ^ 0x3c3c);
      if (h % 3 !== 0) continue;
      var frac = t / (Ssz - 1);
      if (!(m & N)) tuft(ctx, px + t, py + bw * wobble(params, 0, frac, params.wobbleFrac), 0, -1, h);
      if (!(m & S)) tuft(ctx, px + t, py + Ssz - 1 - bw * wobble(params, 2, frac, params.wobbleFrac), 0, 1, h);
      if (!(m & W)) tuft(ctx, px + bw * wobble(params, 3, frac, params.wobbleFrac), py + t, -1, 0, h);
      if (!(m & E)) tuft(ctx, px + Ssz - 1 - bw * wobble(params, 1, frac, params.wobbleFrac), py + t, 1, 0, h);
    }
  }

  function tuft(ctx, x, y, dx, dy, h) {
    var len = 2 + h % 3;
    ctx.fillRect(Math.round(x + dx * 0), Math.round(y + dy * 0), 1, 1);
    ctx.fillRect(Math.round(x + dx * len * 0.6 + (h % 3 - 1)), Math.round(y + dy * len * 0.6), 1, Math.max(1, dy ? len >> 1 : 1));
  }

  // ---------------------------------------------------------------- hex tile painter

  // pointy-top hexagon inscribed in a size x size box
  function hexGeometry(size) {
    var R = size / 2;               // circumradius (vertical extent)
    var a = R * Math.sqrt(3) / 2;   // apothem
    var normals = [];
    for (var k = 0; k < 6; k++) {
      var th = k * Math.PI / 3;     // 0=E, then clockwise in screen space
      normals.push([Math.cos(th), Math.sin(th)]);
    }
    return { R: R, a: a, cx: size / 2, cy: size / 2, normals: normals };
  }

  function paintHexTile(ctx, px, py, params, mask, wx0, wy0) {
    var Ssz = params.size;
    var geo = hexGeometry(Ssz);
    var innerStyle = TERRAINS[params.inner], outerStyle = TERRAINS[params.outer];
    var seed = params.seed;
    var bw = Ssz * params.borderFrac * 0.75;
    var rimW = Math.max(1.5, Ssz * 0.08);
    var img = ctx.createImageData(Ssz, Ssz);
    var data = img.data;
    var color = [0, 0, 0];
    var rimRgb = hexRgb(innerStyle.rim);
    var foamRgb = innerStyle.foam ? hexRgb(innerStyle.foam) : null;
    var glowRgb = innerStyle.glow ? hexRgb(innerStyle.glow) : (innerStyle.glowRim ? hexRgb(innerStyle.rim) : null);
    var tex = params.textures || {};
    var sampleInner = makeSampler(innerStyle, tex.inner, seed);
    var sampleOuter = makeSampler(outerStyle, tex.outer, seed);
    var overlay = params.overlay != null ? params.overlay : 1;

    for (var v = 0; v < Ssz; v++) {
      for (var u = 0; u < Ssz; u++) {
        var rx = u - geo.cx, ry = v - geo.cy;
        var insideHex = true;
        var d = Infinity;
        for (var k = 0; k < 6 && insideHex; k++) {
          var proj = rx * geo.normals[k][0] + ry * geo.normals[k][1];
          if (proj > geo.a) insideHex = false;
          var edgeDist = geo.a - proj; // distance inward from edge k
          if (!(mask & (1 << k))) {
            // tangential coordinate along the edge for the wobble
            var tang = -rx * geo.normals[k][1] + ry * geo.normals[k][0];
            var t = (tang / geo.R + 1) / 2;
            var bb = bw * wobble(params, k, Math.max(0, Math.min(1, t)), params.wobbleFrac * 0.8);
            d = Math.min(d, edgeDist - bb);
          }
        }
        var o = (v * Ssz + u) * 4;
        if (!insideHex) { data[o + 3] = 0; continue; }
        var wx = wx0 + u, wy = wy0 + v;
        if (d < 0) {
          sampleOuter(wx, wy, color);
          if (d > -rimW && overlay > 0) {
            var kOut = (1 + d / rimW) * overlay;
            if (glowRgb) mixInto(color, glowRgb, kOut * 0.55);
            else color[0] *= 1 - kOut * 0.22, color[1] *= 1 - kOut * 0.22, color[2] *= 1 - kOut * 0.22;
          }
        } else {
          sampleInner(wx, wy, color);
          if (d < rimW && isFinite(d) && overlay > 0) {
            var kIn = (1 - d / rimW) * overlay;
            mixInto(color, rimRgb, kIn * 0.7);
            if (foamRgb && d < rimW * 0.45 && hash2(wx, wy, seed ^ 0x77) % 5 < 2) mixInto(color, foamRgb, 0.8 * overlay);
          }
        }
        data[o] = color[0]; data[o + 1] = color[1]; data[o + 2] = color[2]; data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, px, py);
  }

  // ---------------------------------------------------------------- template painters (AI hook)

  // Flat mask version of a tile: white inner region, black outer, red boundary
  // guide. Feed the exported template sheet to an image model, paint over
  // it, slice it back with the same JSON layout.
  function paintSquareTemplate(ctx, px, py, params, mask) {
    var real = { seed: params.seed, size: params.size, inner: params.inner, outer: params.outer, borderFrac: params.borderFrac, wobbleFrac: 0, edges: params.edges };
    var Ssz = params.size;
    var bw = Ssz * params.borderFrac;
    var m = canonical(mask);
    var img = ctx.createImageData(Ssz, Ssz);
    for (var v = 0; v < Ssz; v++) {
      for (var u = 0; u < Ssz; u++) {
        var d = Infinity;
        if (!(m & N)) d = Math.min(d, v - bw);
        if (!(m & E)) d = Math.min(d, (Ssz - 1 - u) - bw);
        if (!(m & S)) d = Math.min(d, (Ssz - 1 - v) - bw);
        if (!(m & W)) d = Math.min(d, u - bw);
        if (!(m & NE) && (m & N) && (m & E)) d = Math.min(d, Math.hypot(u - (Ssz - 1), v) - bw);
        if (!(m & SE) && (m & S) && (m & E)) d = Math.min(d, Math.hypot(u - (Ssz - 1), v - (Ssz - 1)) - bw);
        if (!(m & SW) && (m & S) && (m & W)) d = Math.min(d, Math.hypot(u, v - (Ssz - 1)) - bw);
        if (!(m & NW) && (m & N) && (m & W)) d = Math.min(d, Math.hypot(u, v) - bw);
        var o = (v * Ssz + u) * 4;
        var c = d < 0 ? 20 : 235;
        img.data[o] = c; img.data[o + 1] = c; img.data[o + 2] = c; img.data[o + 3] = 255;
        if (Math.abs(d) < 1) { img.data[o] = 220; img.data[o + 1] = 40; img.data[o + 2] = 40; }
      }
    }
    ctx.putImageData(img, px, py);
    void real;
  }

  // ---------------------------------------------------------------- sheet builders

  var SQUARE_SHEET_COLS = 8;

  function sheetLayout(shape) {
    if (shape === 'hex') {
      var hexes = [];
      for (var m = 0; m < 64; m++) hexes.push({ index: m, mask: m, col: m % 8, row: (m / 8) | 0 });
      return { cols: 8, rows: 8, tiles: hexes };
    }
    var tiles = BLOB_MASKS.map(function (mask, i) {
      return { index: i, mask: mask, col: i % SQUARE_SHEET_COLS, row: (i / SQUARE_SHEET_COLS) | 0 };
    });
    return { cols: SQUARE_SHEET_COLS, rows: Math.ceil(tiles.length / SQUARE_SHEET_COLS), tiles: tiles };
  }

  // Render the whole set onto a canvas. mode: 'art' (default) or 'template'.
  function renderSheet(canvas, params, mode) {
    var layout = sheetLayout(params.shape);
    var Ssz = params.size;
    canvas.width = layout.cols * Ssz;
    canvas.height = layout.rows * Ssz;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layout.tiles.forEach(function (t) {
      var px = t.col * Ssz, py = t.row * Ssz;
      if (mode === 'template') {
        if (params.shape === 'hex') paintHexTile(ctx, px, py, templateParams(params), t.mask, 0, 0);
        else paintSquareTemplate(ctx, px, py, params, t.mask);
      } else {
        if (params.shape === 'hex') paintHexTile(ctx, px, py, params, t.mask, px, py);
        else paintSquareTile(ctx, px, py, params, t.mask, px, py);
      }
    });
    return layout;
  }

  function templateParams(params) {
    // hex templates reuse the art painter with stark styles
    var p = {};
    Object.keys(params).forEach(function (k) { p[k] = params[k]; });
    p.wobbleFrac = 0;
    return p;
  }

  function sheetMetadata(params) {
    var layout = sheetLayout(params.shape);
    var meta = {
      generator: 'WIZARD Mason',
      version: VERSION,
      shape: params.shape,
      tileSize: params.size,
      seed: params.seed,
      inner: params.inner,
      outer: params.outer,
      neighborBits: params.shape === 'hex'
        ? ['E', 'SE', 'SW', 'W', 'NW', 'NE']
        : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
      tiles: layout.tiles.map(function (t) {
        return { index: t.index, mask: t.mask, x: t.col * params.size, y: t.row * params.size };
      })
    };
    if (params.shape === 'square') meta.lookup256 = BLOB_LOOKUP.slice();
    return meta;
  }

  return {
    VERSION: VERSION,
    TERRAINS: TERRAINS,
    BLOB_MASKS: BLOB_MASKS,
    BLOB_LOOKUP: BLOB_LOOKUP,
    SQUARE_NEIGHBORS: SQUARE_NEIGHBORS,
    HEX_NEIGHBORS: HEX_NEIGHBORS,
    HEX_MASK_COUNT: HEX_MASK_COUNT,
    canonical: canonical,
    makeSetParams: makeSetParams,
    makeSampler: makeSampler,
    wobble: wobble,
    hexGeometry: hexGeometry,
    paintSquareTile: paintSquareTile,
    paintHexTile: paintHexTile,
    renderSheet: renderSheet,
    sheetLayout: sheetLayout,
    sheetMetadata: sheetMetadata,
    hashString: hashString
  };
});
