(function (root) {
  'use strict';

  var DIRS = [
    { x: 0, y: -1, name: 'north' },
    { x: 1, y: 0, name: 'east' },
    { x: 0, y: 1, name: 'south' },
    { x: -1, y: 0, name: 'west' }
  ];

  function indexOf(x, y, width) { return y * width + x; }
  function pointOf(index, width) { return { x: index % width, y: Math.floor(index / width) }; }
  function directionName(direction) { return DIRS[direction] ? DIRS[direction].name : ''; }

  function hydrate(raw) {
    return {
      id: raw.id,
      stage: raw.stage,
      sourceFloor: raw.sourceFloor,
      width: raw.width,
      height: raw.height,
      floor: new Set(raw.floor),
      walls: new Set(raw.walls),
      deadSquares: new Set(raw.deadSquares),
      goals: raw.goals.slice(),
      boxes: raw.boxes.slice(),
      player: raw.player,
      rating: raw.rating,
      difficultyKey: raw.difficultyKey,
      solution: raw.solution
    };
  }

  function staticDeadSquares(level) { return level.deadSquares; }

  root.SokobanRuntime = {
    DIRS: DIRS,
    directionName: directionName,
    hydrate: hydrate,
    indexOf: indexOf,
    pointOf: pointOf,
    staticDeadSquares: staticDeadSquares
  };
})(typeof window !== 'undefined' ? window : globalThis);
