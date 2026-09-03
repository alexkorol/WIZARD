# components/hud — FK-104

These are compact, generic instruments for secondary resources, status, and
calibration surfaces. They do not replace the authored health and mana orbs in
`tools/wizard_orbs`; FrameKit owns only the chrome and controls around that
protected presentation.

HUD group for gui_framekit: `bar`, `globe`, `orb`, `meter`, `buff-icon`.
Contract: `tools/gui_framekit/INTERFACES.md` (frozen). All five are pure CSS
(no JS modules); each ships `<name>.css` + standalone `demo.html` importing
`../../../tokens/tokens.css`. Class prefix `fk-`, one root class per
component. Values are driven via inline custom properties / `data-*`
attributes; no color or length literals outside tokens.
