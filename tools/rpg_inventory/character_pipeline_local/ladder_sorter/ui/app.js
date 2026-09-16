const state = {
  data: null,
  currentId: null,
  loadedId: null,
  csrf: null,
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[ch]);
}

function toast(message, isError = false) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.toggle("error", isError);
  node.classList.remove("hidden");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.add("hidden"), 4200);
}

async function api(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: {"Content-Type": "application/json", "X-CSRF-Token": state.csrf},
    body: JSON.stringify(payload ?? {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function reviewMode() {
  return state.data.reviewItems.length > 0;
}

function visibleEntries() {
  if (reviewMode()) {
    return state.data.reviewItems.filter(item => $("#showReviewed").checked || item.status === "needs_review");
  }
  return state.data.unsafeItems.filter(item => !item.deferred);
}

function currentEntry() {
  const entries = visibleEntries();
  return entries.find(entry => entry.id === state.currentId) || entries[0] || null;
}

function renderStats() {
  const stats = state.data.stats;
  const values = [
    [stats.needsReview, "Needs your review"],
    [stats.assistantSorted, "Assistant-sorted"],
    [stats.reviewed, "Reviewed"],
    [stats.ignored, "Ignored"],
    [stats.assistantAssignments, "Assistant assignments"],
    [stats.savedEvents, "Saved feedback events"],
    [stats.undoable, "Undoable reviews"],
  ];
  $("#stats").innerHTML = values.map(([value, label]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join("");
  $("#undoButton").disabled = stats.undoable === 0;
  $("#feedbackPath").textContent = state.data.feedbackPath;
}

function renderQueue() {
  const entries = visibleEntries();
  const current = currentEntry();
  state.currentId = current?.id ?? null;
  $("#queueTitle").textContent = reviewMode()
    ? `${entries.length} assignment${entries.length === 1 ? "" : "s"} ${$("#showReviewed").checked ? "shown" : "to review"}`
    : `${entries.length} unassigned image${entries.length === 1 ? "" : "s"}`;
  $("#queueList").innerHTML = entries.map(entry => {
    const isReview = entry.kind === "review";
    const title = isReview && entry.sourceIndex ? `#${entry.sourceIndex} · ${entry.name}` : entry.name;
    const detail = isReview
      ? `${entry.folder} · ${entry.confidence} confidence${entry.status === "reviewed" ? " · REVIEWED" : entry.status === "ignored" ? " · IGNORED" : entry.status === "assistant_sorted" ? " · ASSISTANT-SORTED" : ""}`
      : `${entry.position ? `Position ${entry.position} · ` : ""}unassigned`;
    return `<button class="queue-item ${entry.id === state.currentId ? "active" : ""}" data-id="${entry.id}">
      <img src="${entry.imageUrl}" alt="" loading="lazy">
      <span class="queue-copy"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></span>
    </button>`;
  }).join("");
  $$(".queue-item").forEach(button => button.addEventListener("click", () => {
    state.currentId = button.dataset.id;
    state.loadedId = null;
    render();
  }));
}

function populateFactionSelect() {
  const current = $("#factionSelect").value;
  const factions = [...new Map(state.data.folders.map(folder => [folder.faction, folder.factionLabel])).entries()];
  $("#factionSelect").innerHTML = '<option value="">Choose...</option>' + factions.map(([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`).join("");
  $("#factionSelect").value = current;
}

function selectedManualFolder() {
  const faction = $("#factionSelect").value;
  const axis = $("#manualAxisSelect").value;
  const tier = Number($("#manualTierSelect").value);
  if (!faction || !axis) return null;
  if (axis === "MISC") return state.data.folders.find(folder => folder.faction === faction && folder.axis === "MISC") || null;
  if (!tier) return null;
  return state.data.folders.find(folder => folder.faction === faction && folder.axis === axis && folder.tier === tier) || null;
}

function loadSelection(item) {
  if (state.loadedId === item.id) return;
  $("#factionSelect").value = item.kind === "review" ? item.faction : "";
  $("#manualAxisSelect").value = item.kind === "review" ? item.axis : "";
  $("#manualTierSelect").value = item.kind === "review" && item.tier ? String(item.tier) : "";
  $("#manualNote").value = "";
  state.loadedId = item.id;
}

function confidenceClass(item) {
  if (item.status === "reviewed" || item.status === "assistant_sorted") return "safe";
  if (item.status === "ignored") return "caution";
  if (item.confidence === "high") return "safe";
  if (item.confidence === "medium") return "medium";
  return "caution";
}

function renderManual(item) {
  loadSelection(item);
  const isReview = item.kind === "review";
  $("#reviewEyebrow").textContent = isReview ? "ASSISTANT ASSIGNMENT" : "UNASSIGNED IMAGE";
  $("#manualName").textContent = isReview && item.sourceIndex ? `#${item.sourceIndex} · ${item.name}` : item.name;
  $("#manualReason").textContent = isReview
    ? `${item.confidence.toUpperCase()} confidence — ${item.assistantNote || "No visual note recorded."}`
    : (item.reason || "Choose a complete destination for this image.");
  const badge = $("#confidenceBadge");
  badge.className = `confidence ${confidenceClass(item)}`;
  badge.textContent = item.status === "reviewed" ? "REVIEWED" : item.status === "ignored" ? "IGNORED" : item.status === "assistant_sorted" ? "ASSISTANT-SORTED" : (isReview ? `${item.confidence.toUpperCase()} CONFIDENCE` : "UNASSIGNED");
  $("#ignoreButton").classList.toggle("hidden", !isReview);
  $("#ignoreButton").disabled = item.status === "ignored";
  $("#ignoreButton").textContent = item.status === "ignored" ? "Already ignored" : "Ignore — not a character";
  $("#instructionCallout").innerHTML = isReview
    ? `<strong>Only the highlighted image is being reviewed.</strong> Current guess: <strong>${escapeHtml(item.folder)}</strong>. Keep it or change any selector below.`
    : "<strong>Only the highlighted image will move.</strong> Other boards remain independent.";
  $("#currentGuess").innerHTML = isReview
    ? `<span>${item.status === "ignored" ? "Ignored from" : "Assistant guess"}</span><strong>${escapeHtml(item.folder)}</strong><small>${escapeHtml(item.status === "ignored" ? item.ignoreReason : (item.assistantNote || "No note"))}</small>`
    : "";
  $("#manualImage").src = item.imageUrl;
  const wrap = $("#manualImageWrap");
  wrap.onclick = () => openLightbox(item.imageUrl, item.name);
  wrap.onkeydown = event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(item.imageUrl, item.name);
    }
  };
  updateManualSelection();
}

function updateManualSelection() {
  const item = currentEntry();
  const axis = $("#manualAxisSelect").value;
  $("#manualTierLabel").classList.toggle("hidden", axis === "MISC");
  const folder = selectedManualFolder();
  $("#moveOneButton").disabled = !folder;
  if (!folder) {
    $("#moveOneButton").textContent = "Choose a destination first";
    $("#manualReference").innerHTML = "Choose a destination to see an existing reference image.";
    return;
  }
  const isReview = item?.kind === "review";
  const changed = isReview && folder.name !== item.folder;
  $("#actionHeading").textContent = changed ? "Save the correction" : (isReview ? "Confirm the assistant assignment" : "Assign this image");
  $("#moveOneButton").textContent = changed
    ? `Save correction → ${folder.name}`
    : (item?.status === "ignored" ? `Restore to ${folder.name}` : (isReview ? `Confirm ${folder.name}` : `Assign to ${folder.name}`));
  $("#manualReference").innerHTML = `${folder.coverUrl ? `<img src="${folder.coverUrl}" alt="Existing ladder reference">` : ""}<div><strong>${escapeHtml(folder.name)}</strong><br>${folder.count} existing image${folder.count === 1 ? "" : "s"}</div>`;
}

function openLightbox(url, caption) {
  $("#lightboxImage").src = url;
  $("#lightboxCaption").textContent = caption || "Character crop";
  $("#imageLightbox").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  $("#closeLightbox").focus();
}

function closeLightbox() {
  $("#imageLightbox").classList.add("hidden");
  $("#lightboxImage").removeAttribute("src");
  document.body.style.overflow = "";
}

function renderReview() {
  const entry = currentEntry();
  $("#emptyState").classList.toggle("hidden", !!entry);
  $("#manualReview").classList.toggle("hidden", !entry);
  if (entry) renderManual(entry);
}

function render() {
  renderStats();
  renderQueue();
  renderReview();
}

async function refresh(preferSame = false) {
  const previous = preferSame ? state.currentId : null;
  const response = await fetch("/api/state", {cache: "no-store"});
  state.data = await response.json();
  state.csrf = state.data.csrfToken;
  populateFactionSelect();
  if (!previous || !visibleEntries().some(entry => entry.id === previous)) {
    state.currentId = null;
    state.loadedId = null;
  }
  render();
}

$("#showReviewed").addEventListener("change", () => { state.currentId = null; state.loadedId = null; render(); });
["#factionSelect", "#manualAxisSelect", "#manualTierSelect"].forEach(selector => $(selector).addEventListener("change", updateManualSelection));

$("#moveOneButton").addEventListener("click", async () => {
  const item = currentEntry();
  const folder = selectedManualFolder();
  if (!item || !folder) return;
  try {
    if (item.kind === "review") {
      const result = await api("/api/review", {reviewId: item.id, folder: folder.name, note: $("#manualNote").value});
      toast(result.changed ? `Correction saved: ${folder.name}.` : "Assignment confirmed.");
    } else {
      await api("/api/move-one", {itemId: item.id, folder: folder.name, note: $("#manualNote").value});
      toast(`Moved to ${folder.name}.`);
    }
    state.currentId = null;
    state.loadedId = null;
    await refresh();
  } catch (error) { toast(error.message, true); }
});

$("#nextButton").addEventListener("click", () => {
  const entries = visibleEntries();
  if (!entries.length) return;
  const index = Math.max(0, entries.findIndex(entry => entry.id === state.currentId));
  state.currentId = entries[(index + 1) % entries.length].id;
  state.loadedId = null;
  render();
});

$("#ignoreButton").addEventListener("click", async () => {
  const item = currentEntry();
  if (!item || item.kind !== "review") return;
  try {
    await api("/api/ignore", {reviewId: item.id, note: $("#manualNote").value});
    toast("Ignored and removed from the character ladders.");
    state.currentId = null;
    state.loadedId = null;
    await refresh();
  } catch (error) { toast(error.message, true); }
});

$("#undoButton").addEventListener("click", async () => {
  try {
    const result = await api("/api/undo", {});
    toast(`Undid the last review (${result.undone} file move${result.undone === 1 ? "" : "s"}).`);
    state.currentId = null;
    state.loadedId = null;
    await refresh();
  } catch (error) { toast(error.message, true); }
});

$("#closeLightbox").addEventListener("click", closeLightbox);
$("#imageLightbox").addEventListener("click", event => { if (event.target === $("#imageLightbox")) closeLightbox(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeLightbox(); });

refresh().catch(error => toast(error.message, true));
