/*
 * fk-window optional enhancement — titlebar dragging.
 * Exported API: init(root: HTMLElement): void
 * CSS alone renders the component correctly; this only adds drag.
 */

function init(root) {
  const titlebar = root.querySelector(".fk-window__titlebar");
  if (!titlebar || root.dataset.fkWindowReady === "true") return;
  root.dataset.fkWindowReady = "true";

  let drag = null;

  function onPointerDown(event) {
    if (event.button !== 0) return;
    if (event.target.closest("button, a, input, select, textarea")) return;
    const rect = root.getBoundingClientRect();
    drag = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    root.style.position = "absolute";
    root.style.left = rect.left + "px";
    root.style.top = rect.top + "px";
    root.style.margin = "0";
    titlebar.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    root.style.left = event.clientX - drag.offsetX + "px";
    root.style.top = event.clientY - drag.offsetY + "px";
  }

  function onPointerUp(event) {
    if (drag && event.pointerId === drag.pointerId) {
      drag = null;
      titlebar.releasePointerCapture(event.pointerId);
    }
  }

  titlebar.addEventListener("pointerdown", onPointerDown);
  titlebar.addEventListener("pointermove", onPointerMove);
  titlebar.addEventListener("pointerup", onPointerUp);
  titlebar.addEventListener("pointercancel", onPointerUp);
}

export { init };
