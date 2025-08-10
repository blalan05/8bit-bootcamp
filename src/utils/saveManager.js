const STORAGE_PREFIX = '8bit-bootcamp-save-v1-slot-';
const ACTIVE_SLOT_KEY = '8bit-bootcamp-active-slot';
const SAVE_VERSION = 1;

function createDefaultState() {
  return {
    playerName: '',
    background: '',
    week: 1,
    maxWeeks: 13,
    marineStats: {
      fitness: 50,
      discipline: 50,
      marksmanship: 50,
      leadership: 50
    },
    pft: {},
    asvab: {},
    completedMinigames: [],
    currentLocation: 'barracks',
    lastScene: 'TitleScene',
    updatedAt: Date.now()
  };
}

function storageKeyFor(slot) {
  const n = Number(slot) || 1;
  return `${STORAGE_PREFIX}${n}`;
}

function getActiveSlot() {
  try { return Number(localStorage.getItem(ACTIVE_SLOT_KEY)) || 0; } catch { return 0; }
}

function setActiveSlot(slot) {
  try { localStorage.setItem(ACTIVE_SLOT_KEY, String(Number(slot) || 1)); } catch {}
}

function hasSave(slot = getActiveSlot() || 1) {
  try { return !!localStorage.getItem(storageKeyFor(slot)); } catch { return false; }
}

function save(slot = getActiveSlot() || 1) {
  try {
    const state = window.gameState || createDefaultState();
    const payload = { version: SAVE_VERSION, state: { ...state, updatedAt: Date.now() } };
    localStorage.setItem(storageKeyFor(slot), JSON.stringify(payload));
    setActiveSlot(slot);
    try { window.dispatchEvent(new CustomEvent('game:saved', { detail: { at: Date.now(), slot } })); } catch {}
    return true;
  } catch (e) {
    console.warn('Save failed', e);
    return false;
  }
}

function load(slot = getActiveSlot() || 1) {
  try {
    const raw = localStorage.getItem(storageKeyFor(slot));
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || data.version !== SAVE_VERSION || !data.state) return false;
    window.gameState = { ...createDefaultState(), ...data.state };
    setActiveSlot(slot);
    return true;
  } catch (e) {
    console.warn('Load failed', e);
    return false;
  }
}

function clear(slot = getActiveSlot() || 1) {
  try {
    localStorage.removeItem(storageKeyFor(slot));
    const active = getActiveSlot();
    if (active === slot) {
      try { localStorage.removeItem(ACTIVE_SLOT_KEY); } catch {}
    }
    try { window.dispatchEvent(new CustomEvent('game:saveCleared', { detail: { at: Date.now(), slot } })); } catch {}
  } catch {}
}

function setLastSceneAndSave(sceneKey, slot = getActiveSlot() || 1) {
  if (!window.gameState) window.gameState = createDefaultState();
  window.gameState.lastScene = sceneKey;
  save(slot);
}

function loadActiveIfAny() {
  const slot = getActiveSlot();
  if (!slot) return false;
  return load(slot);
}

function listSlots() {
  const results = [];
  for (let s = 1; s <= 3; s++) {
    let exists = false;
    let meta = { playerName: '', week: 0, updatedAt: 0, lastScene: '' };
    try {
      const raw = localStorage.getItem(storageKeyFor(s));
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.version === SAVE_VERSION && data.state) {
          exists = true;
          const st = data.state;
          meta = {
            playerName: st.playerName || 'Recruit',
            week: st.week || 1,
            updatedAt: st.updatedAt || 0,
            lastScene: st.lastScene || ''
          };
        }
      }
    } catch {}
    results.push({ slot: s, exists, meta });
  }
  return results;
}

export default {
  STORAGE_PREFIX,
  ACTIVE_SLOT_KEY,
  SAVE_VERSION,
  createDefaultState,
  hasSave,
  save,
  load,
  clear,
  setLastSceneAndSave,
  getActiveSlot,
  setActiveSlot,
  loadActiveIfAny,
  listSlots
};
