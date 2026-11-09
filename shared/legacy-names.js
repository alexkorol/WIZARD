// Saved-data keys retired by owner-rules/rename-map.json. The one WIZARD file where old names may
// appear (the lint skips it, as the ARPG's CombatTerminology.cs): pages call legacyName() on values
// they load from storage so saves made before a rename keep working.
(function (global) {
  var LEGACY = { 'Spirit': 'Self' };            // Arcane Lattice Sphere node (2026-11-08)
  global.legacyName = function (value) { return Object.prototype.hasOwnProperty.call(LEGACY, value) ? LEGACY[value] : value; };
})(typeof window !== 'undefined' ? window : globalThis);
