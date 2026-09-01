/*
 * fk-dialog optional enhancement — open/close wiring.
 * Exported API: init(root: HTMLElement): void
 *
 * init(root) wires:
 *   - elements matching [data-fk-dialog-open="<id>"] open the dialog
 *   - [data-fk-dialog-close] inside the card close it
 *   - Escape closes; backdrop click closes
 *   - focus moves into the card on open and returns on close
 * CSS alone renders both states; this only adds behavior.
 */

function openDialog(root) {
  root.dataset.fkLastFocused = "true";
  root.dataset.fkReturnFocus = document.activeElement
    ? document.activeElement.id || ""
    : "";
  root.classList.add("fk-dialog--open");
  const target =
    root.querySelector("[autofocus]") ||
    root.querySelector("button, a, input, select, textarea") ||
    root.querySelector(".fk-dialog__card");
  if (target && typeof target.focus === "function") target.focus();
}

function closeDialog(root) {
  root.classList.remove("fk-dialog--open");
  const returnId = root.dataset.fkReturnFocus || "";
  const returnTo = returnId ? document.getElementById(returnId) : null;
  if (returnTo) returnTo.focus();
}

function init(root) {
  if (root.dataset.fkDialogReady === "true") return;
  root.dataset.fkDialogReady = "true";

  document.querySelectorAll('[data-fk-dialog-open]').forEach((opener) => {
    opener.addEventListener("click", () => openDialog(root));
  });

  root.querySelectorAll("[data-fk-dialog-close]").forEach((closer) => {
    closer.addEventListener("click", () => closeDialog(root));
  });

  root.addEventListener("click", (event) => {
    if (event.target === root) closeDialog(root);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDialog(root);
  });

  root.fkDialog = { open: () => openDialog(root), close: () => closeDialog(root) };
}

export { init };
