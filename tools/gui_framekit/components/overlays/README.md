# components/overlays — FK-106

Overlays group for gui_framekit: `modal`, `menu`, `toast`, `context-menu`.
Contract: `tools/gui_framekit/INTERFACES.md` (frozen). All pure CSS; each
ships `<name>.css` + standalone `demo.html` importing
`../../../tokens/tokens.css`. Visibility is attribute-driven (`[open]`) so
hosts toggle one property with no framework; positioning of pointer-anchored
overlays (context-menu, drag-following ghost) is the host's call. Class
prefix `fk-`; no literals outside tokens.
