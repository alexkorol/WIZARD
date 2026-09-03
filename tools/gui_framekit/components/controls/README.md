# components/controls — FK-103

Controls group for gui_framekit: `button`, `input`, `slider`, `toggle`,
`tabs`. Contract: `tools/gui_framekit/INTERFACES.md` (frozen).

Each component directory ships `<name>.css` and a standalone `demo.html`
that imports `../../../tokens/tokens.css`. `tabs/` additionally ships
progressive-enhancement `tabs.js` (`init(root)`); everything else is pure
CSS. Class prefix `fk-`, one root class per component.

No color, spacing, radius, or type literals outside tokens (allowed:
`0`, `100%`, token fallbacks). No build step; serve over plain HTTP.
