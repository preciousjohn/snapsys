// data.jsx — MindSandbox
// Replaces static mock data with live calls to the Flask backend (api.py)
// All window.* globals are preserved so other files need zero changes.

// ── API endpoint ──────────────────────────────────────────────────────────────
const API_URL = "http://localhost:5050";

// ── Narrator definitions (matches backend persona keys) ───────────────────────
const NARRATORS = {
  hype:    { name: 'The Hype',    color: 'var(--coral)',  emoji: '🎉', bg: '#FFE2DE' },
  doubter: { name: 'The Doubter', color: 'var(--purple)', emoji: '😴', bg: '#EFE3FE' },
  scholar: { name: 'The Scholar', color: 'var(--blue)',   emoji: '📚', bg: '#DDEAFE' },
};

// ── Source definitions (matches backend source_type keys) ─────────────────────
const SOURCES = {
  social_media:  { name: 'Social Media',   color: 'var(--coral)' },
  official_news: { name: 'Official News',  color: 'var(--blue)'  },
  academic:      { name: 'Academic Paper', color: 'var(--green)' },
};

// ── Live response store ───────────────────────────────────────────────────────
let RESPONSES = [];
let HIGHLIGHT_MAP = {};
let _roundCounter = 1;

// ── Main generate function — call this when NFC tile is placed ────────────────
//
//   topicId:   "topic_climate" | "topic_forest" | "topic_ocean" | ...
//   sourceId:  "source_social" | "source_news" | "source_academic"
//   personaId: "persona_hype" | "persona_doubter" | "persona_scholar"
//   question:  optional string (defaults to a generic prompt)
//
// Returns the new response object, or null on error.
//
async function generateResponse({ topicId, sourceId, personaId, question }) {
  try {
    const res = await fetch(`${API_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic_id:   topicId,
        source_id:  sourceId,
        persona_id: personaId,
        question:   question || "Tell me something interesting about this topic.",
        round:      _roundCounter,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("[MindSandbox] API error:", err);
      return null;
    }

    const data = await res.json();

    // Add to store
    RESPONSES = [...RESPONSES, data];

    // Build a basic highlight map entry (no hand-authoring needed)
    HIGHLIGHT_MAP[data.id] = {
      narrator: [],
      source: [],
      tiles: [],
    };

    _roundCounter++;

    // Keep window globals in sync
    window.RESPONSES   = RESPONSES;
    window.HIGHLIGHT_MAP = HIGHLIGHT_MAP;

    return data;

  } catch (e) {
    console.error("[MindSandbox] Fetch failed — is api.py running?", e);
    return null;
  }
}

// ── Reset session ─────────────────────────────────────────────────────────────
function resetSession() {
  RESPONSES    = [];
  HIGHLIGHT_MAP = {};
  _roundCounter = 1;
  window.RESPONSES    = RESPONSES;
  window.HIGHLIGHT_MAP = HIGHLIGHT_MAP;
}

// ── Diff helper (unchanged, used by ComparePanel) ─────────────────────────────
function diffSpans(cardA, cardB) {
  if (!cardA || !cardB) return null;
  return {
    narratorChanged: cardA.narrator !== cardB.narrator,
    sourceChanged:   cardA.source   !== cardB.source,
    tilesChanged:    JSON.stringify(cardA.tiles) !== JSON.stringify(cardB.tiles),
  };
}

// ── Expose everything on window (zero changes needed in other files) ──────────
window.NARRATORS       = NARRATORS;
window.SOURCES         = SOURCES;
window.RESPONSES       = RESPONSES;
window.HIGHLIGHT_MAP   = HIGHLIGHT_MAP;
window.diffSpans       = diffSpans;
window.generateResponse = generateResponse;
window.resetSession    = resetSession;
