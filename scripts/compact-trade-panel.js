const ROW_SELECTOR = ".player, [data-user-id], [data-player-id], .players-list > li";
const INACTIVE_SELECTOR = "#players-inactive, .players-inactive, [data-application-part='inactive']";
const TRADE_SELECTOR = ".item-piles-player-list-trade-button";

let observedRoot;
let observer;
let pendingFrame;

function resolveRoot(app, html) {
  const candidates = [app?.element, html, html?.[0], globalThis.ui?.players?.element];
  for (const candidate of candidates) {
    if (!(candidate instanceof HTMLElement)) continue;
    if (candidate.id === "players") return candidate;
    const players = candidate.querySelector("#players");
    if (players) return players;
  }
  return document.querySelector("#players")
    ?? candidates.find(candidate => candidate instanceof HTMLElement);
}

function hideUsers(root) {
  if (!root?.isConnected) return;
  root.classList.add("tely-ctp");

  // Select identities, not a particular Foundry template hierarchy or tag.
  // Keep only outer rows when a name or color marker also has a user ID.
  const candidates = Array.from(root.querySelectorAll(ROW_SELECTOR));
  const candidateSet = new Set(candidates);
  const rows = candidates.filter(row => {
    for (let parent = row.parentElement; parent && parent !== root; parent = parent.parentElement) {
      if (candidateSet.has(parent)) return false;
    }
    return true;
  });

  // Move the original trade node outside any user row added by a UI extension.
  // Its original click handlers remain attached; native Item Piles needs no move.
  for (const row of rows) {
    if (row.matches(TRADE_SELECTOR)) continue;
    for (const button of row.querySelectorAll(TRADE_SELECTOR)) row.after(button);
  }

  const userRows = rows.filter(row => !row.matches(TRADE_SELECTOR));
  const activeRows = userRows.filter(row => !row.closest(INACTIVE_SELECTOR));
  const slot = activeRows.find(row => row.getClientRects().length > 0)
    ?? activeRows[0];

  for (const row of userRows) {
    row.classList.add("tely-ctp-user-row");
    row.classList.toggle("tely-ctp-row-slot", row === slot);
    row.style.setProperty("visibility", "hidden", "important");
    row.style.setProperty("pointer-events", "none", "important");
    for (const child of row.querySelectorAll("*")) {
      child.style.setProperty("visibility", "hidden", "important");
    }
    row.inert = true;
    row.setAttribute("aria-hidden", "true");
  }
}

function apply(app, html) {
  const root = resolveRoot(app, html);
  if (!root) return;
  if (observedRoot !== root) {
    observer?.disconnect();
    if (pendingFrame !== undefined) cancelAnimationFrame(pendingFrame);
    pendingFrame = undefined;
    observedRoot = root;
    observer = new MutationObserver(() => {
      if (pendingFrame !== undefined) return;
      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = undefined;
        hideUsers(root);
      });
    });
    // Observe only child changes; ignore the classes and attributes set here.
    observer.observe(root, { childList: true, subtree: true });
  }
  hideUsers(root);
}

Hooks.on("renderPlayers", apply);
Hooks.on("renderPlayerList", apply);
Hooks.once("ready", () => apply());
