// data.jsx — MindSandbox
// Connects to Flask backend and triggers React re-render on new responses.

const API_URL = "http://localhost:5050";

const NARRATORS = {
  hype:    { name: 'The Hype',    color: 'var(--coral)',  emoji: '🎉', bg: '#FFE2DE' },
  doubter: { name: 'The Doubter', color: 'var(--purple)', emoji: '😴', bg: '#EFE3FE' },
  scholar: { name: 'The Scholar', color: 'var(--blue)',   emoji: '📚', bg: '#DDEAFE' },
};

const SOURCES = {
  social_media:  { name: 'Social Media',   color: 'var(--coral)' },
  official_news: { name: 'Official News',  color: 'var(--blue)'  },
  academic:      { name: 'Academic Paper', color: 'var(--green)' },
};

let RESPONSES = [];
let HIGHLIGHT_MAP = {};
let _roundCounter = 1;

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

    RESPONSES = [...RESPONSES, data];
    HIGHLIGHT_MAP[data.id] = { narrator: [], source: [], tiles: [] };
    _roundCounter++;

    window.RESPONSES     = RESPONSES;
    window.HIGHLIGHT_MAP = HIGHLIGHT_MAP;

    // Trigger React re-render in ScreenCompare
    if (typeof window.__onNewResponse === 'function') {
      window.__onNewResponse(data);
    }

    return data;

  } catch (e) {
    console.error("[MindSandbox] Fetch failed — is api.py running on localhost:5050?", e);
    return null;
  }
}

function resetSession() {
  RESPONSES     = [];
  HIGHLIGHT_MAP = {};
  _roundCounter = 1;
  window.RESPONSES     = RESPONSES;
  window.HIGHLIGHT_MAP = HIGHLIGHT_MAP;
}

function diffSpans(cardA, cardB) {
  if (!cardA || !cardB) return null;
  return {
    narratorChanged: cardA.narrator !== cardB.narrator,
    sourceChanged:   cardA.source   !== cardB.source,
    tilesChanged:    JSON.stringify(cardA.tiles) !== JSON.stringify(cardB.tiles),
  };
}

window.NARRATORS        = NARRATORS;
window.SOURCES          = SOURCES;
window.RESPONSES        = RESPONSES;
window.HIGHLIGHT_MAP    = HIGHLIGHT_MAP;
window.diffSpans        = diffSpans;
window.generateResponse = generateResponse;
window.resetSession     = resetSession;
