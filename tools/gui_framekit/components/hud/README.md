# components/hud — FK-104

HUD group for gui_framekit: `bar`, `globe`, `orb`, `meter`, `buff-icon`.
Contract: `tools/gui_framekit/INTERFACES.md` (frozen). All five are pure CSS
(no JS modules); each ships `<name>.css` + standalone `demo.html` importing
`../../../tokens/tokens.css`. Class prefix `fk-`, one root class per
component. Values are driven via inline custom properties / `data-*`
attributes; no color or length literals outside tokens.
