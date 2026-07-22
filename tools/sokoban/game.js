(function () {
  'use strict';

  var Core = window.SokobanRuntime;
  var Campaign = window.SokobanCampaign;
  var STORAGE_KEY = 'wizard.sokoban.vault.v2';
  var lessons = [
    'The first law of the deep: a reliquary may be pushed, but never pulled.',
    'A reliquary in an unmarked corner is lost. Read the stone before you push.',
    'Two reliquaries, two seals. Their order matters. Press U to rewind a mistake.',
    'Plan backward from each seal. Press H when you want the oracle to reveal one optimal push.'
  ];
  var els = {};
  var save = loadSave();
  var level = null;
  var state = null;
  var history = [];
  var hint = null;
  var touchStart = null;
  var replaying = false;
  var replayToken = 0;
  var analysisRevealed = false;
  var archiveThresholds = [1, 4, 8, 12, 16, 20, 22, 24];

  function byId(id) { return document.getElementById(id); }

  function loadSave() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored && stored.floor) return stored;
    } catch (error) { /* Start fresh if storage is unavailable or corrupt. */ }
    return { floor: 1, cleared: 0, bestEfficiency: null };
  }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); } catch (error) { /* Game remains playable without persistence. */ }
  }

  function cacheElements() {
    [
      'run-code', 'new-run', 'floor-number', 'difficulty-title', 'difficulty-pips', 'lesson',
      'optimal-pushes', 'solution-label', 'box-count', 'proof-states', 'status', 'move-count', 'push-count',
      'board-loading', 'board', 'victory', 'descend', 'undo', 'reset', 'hint',
      'floors-cleared', 'best-efficiency', 'floor-jump', 'floor-input', 'descend-debug', 'live-stats',
      'motif-name', 'victory-motif', 'victory-thesis', 'analysis-grade', 'analysis-lines',
      'analysis-switches', 'analysis-counter', 'analysis-straits', 'replay-proof', 'archive-fragments', 'archive-note'
    ].forEach(function (id) { els[id] = byId(id); });
  }

  function loadFloor(number) {
    replayToken += 1;
    save.floor = Math.min(Campaign.levels.length, Math.max(1, number));
    persist();
    els['board-loading'].classList.remove('hidden');
    els.victory.hidden = true;
    replaying = false;
    analysisRevealed = (save.cleared || 0) >= save.floor;
    els['live-stats'].hidden = !analysisRevealed;
    els.status.textContent = 'Opening the forged chamber…';
    els.board.setAttribute('aria-busy', 'true');
    hint = null;
    window.setTimeout(function () {
      try {
        level = Core.hydrate(Campaign.levels[save.floor - 1]);
        state = { player: level.player, boxes: level.boxes.slice(), moves: 0, pushes: 0, solved: false };
        history = [];
        updateMeta();
        render();
        els['board-loading'].classList.add('hidden');
        els.board.setAttribute('aria-busy', 'false');
        els.status.textContent = save.floor <= 4 ? 'Tutorial chamber · forged and solver verified' :
          level.boxes.length + '-relic theorem · tested offline across ' +
            compactNumber(level.solution.states) + (level.solution.proof === 'offline-constructive' ? '+ oracle states' : ' oracle states');
        els.board.focus({ preventScroll: true });
      } catch (error) {
        els.status.textContent = error.message || 'The chamber could not be carved.';
        els['board-loading'].innerHTML = '<span></span>Reload the campaign pack';
      }
    }, 40);
  }

  function updateMeta() {
    els['run-code'].textContent = Campaign.name;
    els['floor-number'].textContent = String(save.floor).padStart(2, '0');
    els['floor-input'].value = save.floor;
    els['difficulty-title'].textContent = level.rating.title;
    els.lesson.textContent = lessons[save.floor - 1] || dynamicLesson();
    els['motif-name'].textContent = analysisRevealed ? level.solution.analysis.motif : 'Sealed until solved';
    els['solution-label'].textContent = analysisRevealed ?
      (level.solution.moveOptimal ? 'Push / move optimum' : 'Verified route') : 'Proof length';
    els['optimal-pushes'].textContent = analysisRevealed ?
      level.solution.actions.length + ' pushes · ' + level.solution.moves + ' moves' : 'sealed';
    els['box-count'].textContent = level.boxes.length;
    els['proof-states'].textContent = analysisRevealed ?
      (level.solution.proof === 'search' || level.solution.proof === 'offline-search' ?
        compactNumber(level.solution.states) + ' states' :
        level.solution.proof === 'bounds' ? 'distance bound' :
          level.solution.proof === 'lexicographic' ? 'dual optimum' :
            level.solution.proof === 'move-search' ? 'movement search' :
              compactNumber(level.solution.states) + '+ states') : 'forged offline';
    els['replay-proof'].textContent = level.solution.moveOptimal ? 'Watch optimal route' : 'Watch clean route';
    els['floors-cleared'].textContent = save.cleared || 0;
    els['best-efficiency'].textContent = save.bestEfficiency ? Math.round(save.bestEfficiency * 100) + '%' : '—';
    updateArchive();
    var pipCount = Math.min(5, Math.max(1, Math.ceil(level.rating.score / 12)));
    els['difficulty-pips'].innerHTML = '';
    for (var i = 0; i < 5; i += 1) {
      var pip = document.createElement('i');
      if (i < pipCount) pip.className = 'on';
      els['difficulty-pips'].appendChild(pip);
    }
    els['difficulty-pips'].setAttribute('aria-label', 'Difficulty ' + pipCount + ' of 5');
    var atEnd = save.floor >= Campaign.levels.length;
    els.descend.disabled = atEnd;
    els.descend.innerHTML = atEnd ? 'Campaign complete' :
      'Descend to stage <span>' + String(save.floor + 1).padStart(2, '0') + '</span>';
    els['descend-debug'].disabled = atEnd;
  }

  function updateArchive() {
    var cleared = save.cleared || 0;
    var fragments = archiveThresholds.filter(function (floor) { return cleared >= floor; }).length;
    els['archive-fragments'].textContent = fragments + ' / ' + archiveThresholds.length;
    var notes = [
      'The archive opens after the first proof.',
      'I. Distance is not difficulty.',
      'II. A seal can be occupied too early.',
      'III. A useful push may look like retreat.',
      'IV. Shared space is the true currency.',
      'V. Boxes are not independent variables.',
      'VI. The shortest proof may feel impossible.',
      'VII. The final chambers outlast the lesser oracle.',
      'VIII. The Verdigris Vault remembers your proof.'
    ];
    els['archive-note'].textContent = notes[fragments];
  }

  function dynamicLesson() {
    if (level.solution.states >= 100000) return 'This chamber survived the full offline oracle budget. Expect attractive pushes that poison a later box-goal matching.';
    if (level.boxes.length >= 5) return 'The deep archive composes several box dependencies at once. Solve the packing order, not one relic at a time.';
    if (level.boxes.length >= 4) return 'At this depth, the order of pushes is the puzzle. Preserve lanes behind every reliquary.';
    if (level.solution.analysis.switches >= 3) return 'The shortest rite changes between reliquaries. Keep their paths from crossing too soon.';
    if (!level.solution.optimal) return 'Every chamber has a proven route, even when the oracle cannot exhaust its entire state space.';
    return 'Read the walls, preserve your standing squares, and distrust the seal that looks easiest.';
  }

  function compactNumber(value) {
    if (value >= 10000) return (value / 1000).toFixed(1) + 'k';
    return value.toLocaleString();
  }

  function render() {
    if (!level || !state) return;
    var floor = level.floor;
    var goals = new Set(level.goals);
    var boxes = new Set(state.boxes);
    els.board.style.setProperty('--cols', level.width);
    els.board.style.setProperty('--board-ratio', level.width + ' / ' + level.height);
    els.board.innerHTML = '';
    for (var y = 0; y < level.height; y += 1) {
      for (var x = 0; x < level.width; x += 1) {
        var cell = Core.indexOf(x, y, level.width);
        var tile = document.createElement('div');
        var isFloor = floor.has(cell);
        var isWall = !isFloor && (!level.walls || level.walls.has(cell));
        tile.className = 'tile ' + (isFloor ? 'floor' : isWall ? 'wall' : 'void');
        tile.setAttribute('role', 'gridcell');
        tile.style.setProperty('--texture-x', ((x * 83 + y * 29) % 101) + '%');
        tile.style.setProperty('--texture-y', ((x * 37 + y * 71) % 101) + '%');
        if (isWall) tile.style.setProperty('--scratch', ((x * 19 + y * 31) % 18 - 9) + 'deg');
        if (goals.has(cell)) tile.classList.add('goal');
        if (boxes.has(cell)) {
          tile.classList.add('box');
          if (goals.has(cell)) tile.classList.add('box-on-goal');
          var box = document.createElement('span');
          box.className = 'box-piece';
          box.setAttribute('aria-label', goals.has(cell) ? 'Reliquary on seal' : 'Reliquary');
          tile.appendChild(box);
        }
        if (state.player === cell) {
          var player = document.createElement('span');
          player.className = 'player-piece';
          player.setAttribute('aria-label', 'Delver');
          tile.appendChild(player);
        }
        if (hint && hint.box === cell) tile.classList.add('hint-box');
        if (hint && hint.destination === cell) tile.classList.add('hint-destination');
        els.board.appendChild(tile);
      }
    }
    els['move-count'].textContent = state.moves;
    els['push-count'].textContent = state.pushes;
    els.board.classList.toggle('deadlocked', !state.solved && hasStaticDeadlock());
    els.undo.disabled = history.length === 0 || state.solved || replaying;
  }

  function move(directionIndex) {
    if (!level || !state || state.solved || replaying) return;
    var direction = Core.DIRS[directionIndex];
    var p = Core.pointOf(state.player, level.width);
    var next = Core.indexOf(p.x + direction.x, p.y + direction.y, level.width);
    if (!level.floor.has(next)) return announce('Stone blocks the way.');
    var boxIndex = state.boxes.indexOf(next);
    var pushed = false;
    if (boxIndex !== -1) {
      var beyond = Core.indexOf(p.x + direction.x * 2, p.y + direction.y * 2, level.width);
      if (!level.floor.has(beyond) || state.boxes.indexOf(beyond) !== -1) return announce('The reliquary cannot move ' + direction.name + '.');
      history.push(snapshot());
      state.boxes[boxIndex] = beyond;
      state.pushes += 1;
      pushed = true;
    } else {
      history.push(snapshot());
    }
    state.player = next;
    state.moves += 1;
    hint = null;
    render();
    if (isSolved()) finishFloor();
    else if (pushed && hasStaticDeadlock()) announce('Dead branch detected. Undo remains unlimited.');
    else if (pushed) announce('Reliquary pushed ' + direction.name + '.');
  }

  function hasStaticDeadlock() {
    var dead = Core.staticDeadSquares(level);
    return state.boxes.some(function (box) { return dead.has(box); });
  }

  function snapshot() {
    return { player: state.player, boxes: state.boxes.slice(), moves: state.moves, pushes: state.pushes };
  }

  function restore(previous) {
    state.player = previous.player;
    state.boxes = previous.boxes.slice();
    state.moves = previous.moves;
    state.pushes = previous.pushes;
    state.solved = false;
    hint = null;
    els.victory.hidden = true;
    render();
  }

  function isSolved() {
    var goals = new Set(level.goals);
    return state.boxes.every(function (box) { return goals.has(box); });
  }

  function finishFloor() {
    state.solved = true;
    analysisRevealed = true;
    els['live-stats'].hidden = false;
    var pushEfficiency = Math.min(1, level.solution.actions.length / Math.max(1, state.pushes));
    var moveEfficiency = Math.min(1, level.solution.moves / Math.max(1, state.moves));
    var efficiency = (pushEfficiency + moveEfficiency) / 2;
    save.cleared = Math.max(save.cleared || 0, save.floor);
    save.bestEfficiency = save.bestEfficiency == null ? efficiency : Math.max(save.bestEfficiency, efficiency);
    persist();
    updateMeta();
    updateVictory(efficiency);
    render();
    announce('Stage ' + save.floor + ' cleared in ' + state.moves + ' moves · ' + state.pushes + ' pushes.');
    window.setTimeout(function () {
      els.victory.hidden = false;
      els.descend.focus();
    }, 360);
  }

  function updateVictory(efficiency) {
    var analysis = level.solution.analysis;
    var grade = efficiency >= 1 ? 'S' : efficiency >= 0.9 ? 'A' : efficiency >= 0.75 ? 'B' : 'C';
    els['victory-motif'].textContent = analysis.motif;
    els['victory-thesis'].textContent = analysis.thesis;
    els['analysis-grade'].textContent = grade;
    els['analysis-lines'].textContent = level.solution.moves;
    els['analysis-switches'].textContent = analysis.switches;
    els['analysis-counter'].textContent = analysis.counterintuitive;
    els['analysis-straits'].textContent = analysis.storageEntries || 0;
  }

  function announce(message) { els.status.textContent = message; }

  function undo() {
    if (!history.length || !state || state.solved || replaying) return;
    restore(history.pop());
    announce('One step rewound.');
  }

  function reset() {
    if (!level || replaying) return;
    state = { player: level.player, boxes: level.boxes.slice(), moves: 0, pushes: 0, solved: false };
    history = [];
    var walkDelay = level.solution.moves > 300 ? 18 : level.solution.moves > 140 ? 32 : 54;
    var pushDelay = level.solution.moves > 300 ? 48 : level.solution.moves > 140 ? 76 : 115;
    hint = null;
    els.victory.hidden = true;
    render();
    announce('Chamber reset. The proof still holds.');
  }

  function showHint() {
    if (!level || !state || state.solved || replaying) return;
    var routeHint = knownRouteHint();
    if (routeHint) {
      hint = routeHint;
      render();
      announce('Next verified push: ' + Core.directionName(hint.direction) + '. Gold marks the destination.');
      return;
    }
    announce('You have left the stored proof branch. Undo or reset to rejoin it.');
  }

  function knownRouteHint() {
    function boxKey(boxes) { return boxes.slice().sort(function (a, b) { return a - b; }).join(','); }
    var boxes = level.boxes.slice();
    var current = boxKey(state.boxes);
    for (var i = 0; i < level.solution.actions.length; i += 1) {
      if (boxKey(boxes) === current) return level.solution.actions[i];
      var action = level.solution.actions[i];
      var boxIndex = boxes.indexOf(action.box);
      if (boxIndex === -1) return null;
      boxes[boxIndex] = action.destination;
    }
    return null;
  }

  function walkPath(start, target, boxes) {
    if (start === target) return [];
    var blocked = new Set(boxes);
    var queue = [start];
    var parents = new Map();
    parents.set(start, null);
    for (var head = 0; head < queue.length; head += 1) {
      var cell = queue[head];
      var p = Core.pointOf(cell, level.width);
      for (var d = 0; d < Core.DIRS.length; d += 1) {
        var direction = Core.DIRS[d];
        var next = Core.indexOf(p.x + direction.x, p.y + direction.y, level.width);
        if (!level.floor.has(next) || blocked.has(next) || parents.has(next)) continue;
        parents.set(next, { previous: cell, direction: d });
        if (next === target) {
          var path = [];
          var cursor = next;
          while (cursor !== start) {
            var link = parents.get(cursor);
            path.push(link.direction);
            cursor = link.previous;
          }
          return path.reverse();
        }
        queue.push(next);
      }
    }
    return null;
  }

  function pause(milliseconds) {
    return new Promise(function (resolve) { window.setTimeout(resolve, milliseconds); });
  }

  async function replayProof() {
    if (!level || replaying || !analysisRevealed) return;
    replaying = true;
    var token = ++replayToken;
    els.victory.hidden = true;
    state = { player: level.player, boxes: level.boxes.slice(), moves: 0, pushes: 0, solved: false };
    history = [];
    announce(level.solution.moveOptimal ? 'Replaying the least-push, least-move proof…' : 'Replaying the cleanest verified route…');
    render();
    await pause(280);
    for (var a = 0; a < level.solution.actions.length && token === replayToken; a += 1) {
      var action = level.solution.actions[a];
      var source = Core.pointOf(action.box, level.width);
      var direction = Core.DIRS[action.direction];
      var stand = Core.indexOf(source.x - direction.x, source.y - direction.y, level.width);
      var route = walkPath(state.player, stand, state.boxes);
      if (!route) break;
      for (var r = 0; r < route.length && token === replayToken; r += 1) {
        var step = Core.DIRS[route[r]];
        var player = Core.pointOf(state.player, level.width);
        state.player = Core.indexOf(player.x + step.x, player.y + step.y, level.width);
        state.moves += 1;
        render();
        await pause(walkDelay);
      }
      if (token !== replayToken) return;
      var boxIndex = state.boxes.indexOf(action.box);
      if (boxIndex === -1) break;
      state.boxes[boxIndex] = action.destination;
      state.player = action.box;
      state.moves += 1;
      state.pushes += 1;
      render();
      await pause(pushDelay);
    }
    if (token !== replayToken) return;
    replaying = false;
    state.solved = isSolved();
    render();
    if (state.solved) {
      announce('Route complete: ' + state.moves + ' moves · ' + state.pushes + ' pushes.');
      await pause(260);
      els.victory.hidden = false;
      els.descend.focus();
    } else {
      announce('The proof replay was interrupted. Reset to try again.');
    }
  }

  function newRun() {
    var accepted = window.confirm('Reset the Verdigris Vault campaign? Your cleared-stage record will be erased.');
    if (!accepted) return;
    save.floor = 1;
    save.cleared = 0;
    save.bestEfficiency = null;
    persist();
    loadFloor(1);
  }

  function handleKey(event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || replaying) return;
    var key = event.key.toLowerCase();
    var directions = { arrowup: 0, w: 0, arrowright: 1, d: 1, arrowdown: 2, s: 2, arrowleft: 3, a: 3 };
    if (Object.prototype.hasOwnProperty.call(directions, key)) {
      event.preventDefault(); move(directions[key]);
    } else if (key === 'u' || key === 'z') { event.preventDefault(); undo(); }
    else if (key === 'r') { event.preventDefault(); reset(); }
    else if (key === 'h') { event.preventDefault(); showHint(); }
    else if (key === 'enter' && state && state.solved && save.floor < Campaign.levels.length) {
      event.preventDefault(); loadFloor(save.floor + 1);
    }
  }

  function bindEvents() {
    document.addEventListener('keydown', handleKey);
    els.undo.addEventListener('click', undo);
    els.reset.addEventListener('click', reset);
    els.hint.addEventListener('click', showHint);
    els['replay-proof'].addEventListener('click', replayProof);
    els['new-run'].addEventListener('click', newRun);
    els.descend.addEventListener('click', function () {
      if (save.floor < Campaign.levels.length) loadFloor(save.floor + 1);
    });
    els['descend-debug'].addEventListener('click', function () {
      if (save.floor < Campaign.levels.length) loadFloor(save.floor + 1);
    });
    els['floor-jump'].addEventListener('submit', function (event) {
      event.preventDefault();
      var requested = Math.floor(Number(els['floor-input'].value));
      if (!Number.isFinite(requested)) return announce('Enter a valid stage number.');
      loadFloor(Math.min(Campaign.levels.length, Math.max(1, requested)));
    });
    document.querySelectorAll('[data-direction]').forEach(function (button) {
      button.addEventListener('click', function () { move(Number(button.dataset.direction)); });
    });
    els.board.addEventListener('pointerdown', function (event) { touchStart = { x: event.clientX, y: event.clientY }; });
    els.board.addEventListener('pointerup', function (event) {
      if (!touchStart) return;
      var dx = event.clientX - touchStart.x;
      var dy = event.clientY - touchStart.y;
      touchStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
    });
  }

  cacheElements();
  bindEvents();
  updateLedgerOnly();
  loadFloor(save.floor);

  function updateLedgerOnly() {
    els['run-code'].textContent = Campaign.name;
    els['floors-cleared'].textContent = save.cleared || 0;
    els['best-efficiency'].textContent = save.bestEfficiency ? Math.round(save.bestEfficiency * 100) + '%' : '—';
    updateArchive();
  }
})();
