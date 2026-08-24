# components/inventory — FK-105

Inventory group for gui_framekit: `grid`, `slot`, `item-tooltip`,
`drag-ghost`. Contract: `tools/gui_framekit/INTERFACES.md` (frozen). All
pure CSS; each component ships `<name>.css` + standalone `demo.html`
importing `../../../tokens/tokens.css`. Class prefix `fk-`, one root class
per component. Tooltip shows on `[data-tip-host]:hover/:focus-within`;
drag-ghost is pointer-followed by the host app (position: fixed, no
pointer-events). No literals outside tokens.
