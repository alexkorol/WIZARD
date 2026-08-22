# Verdigris placeholder runtime evidence

Captured from the component sheet with Chrome DevTools Protocol at device scale 1. The local server was bound explicitly to `127.0.0.1:8164`; the capture controller used `127.0.0.1:8165`.

For both committed captures, script execution was disabled before navigation and all SVG, PNG, JPEG, and WebP requests were blocked. After capture, script execution was re-enabled without reloading and `typeof window.VerdigrisFrames` remained `undefined`, confirming that the baseline sheet did not execute the optional runtime.

## Captures

- `placeholders-1280x800.png` — true PNG at 1280 × 800. All four components and all five states are visible. DOM inspection found 20 matrix frames; layout and content width were exactly 1280px.
- `placeholders-375x900.png` — true PNG at 375 × 900. The keyboard-focus specimen and 8.93:1 disabled specimen are visible above the responsive component matrix. Layout and content width were exactly 375px, so there is no horizontal document overflow.

Both captures were personally opened and inspected. The CSS baseline remained complete with every image request blocked: content geometry, corners, borders, state differentiation, focus ring, and disabled text remained visible.

## Enhanced runtime audit

The same sheet was then reloaded with JavaScript enabled for interactive inspection:

- keyboard `Tab` focused the first button; the active element remained a `button` frame in the `focus` state with a solid 2px `rgb(117, 215, 193)` outline;
- emulated `prefers-reduced-motion: reduce` produced `transition-duration: 0s` and `animation-name: none`;
- the disabled button computed to `rgb(185, 181, 171)` on `rgb(21, 21, 20)` at opacity 1 (8.93:1 WCAG contrast);
- applying a 1px PNG through `VerdigrisFrames.setRasterDecoration` left the frame rectangle exactly `171.5 × 68` at the same coordinates and preserved its sole child `DIV`; only the pseudo-element `border-image-source` changed;
- all four SVG assets passed XML parsing and the deterministic runtime test rejects `<text>`, `<foreignObject>`, or embedded raster data.

## SHA-256

```text
70dc3a809b2fb935fbfeb9042d96bb1a131d027301fc287f820e91c99d65f079  placeholders-1280x800.png
3c7eb63055d1f6e6bc50a7160c3ba2adbaba568e619360b65577f130217e69eb  placeholders-375x900.png
```
