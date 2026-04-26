function ScreenSetup({ onStart }) {
  const [topic, setTopic] = React.useState('');
  const [waiting, setWaiting] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  // tilesConnected: toggled to true when hardware signals ready
  const [tilesConnected] = React.useState(false);

  React.useEffect(() => {
    if (!waiting) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [waiting]);

  const fmtTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleStart = () => {
    if (!topic.trim()) return;
    setElapsed(0);
    setWaiting(true);
  };

  const handleEnd = () => {
    setWaiting(false);
    onStart(topic.trim());
  };

  if (waiting) {
    return (
      <div className="col" style={{ minHeight: '100vh' }}>
        <div className="topbar" style={{ padding: 'clamp(14px,3vw,22px) clamp(16px,4vw,32px)' }}>
          <Logo />
          <Pill color="var(--paper)">● LIVE · {fmtTime(elapsed)}</Pill>
        </div>

        <div className="col center" style={{ flex: 1, padding: '0 clamp(16px,4vw,32px)', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 'min(280px, 80vw)', height: 200, marginBottom: 48 }}>
            <FloatingTile color="var(--yellow)" left="10%" top="20%" delay="0s" rot="-8deg">A</FloatingTile>
            <FloatingTile color="var(--coral)" left="50%" top="5%" delay="0.3s" rot="6deg">?</FloatingTile>
            <FloatingTile color="var(--blue)" left="70%" top="40%" delay="0.6s" rot="-4deg">i</FloatingTile>
            <FloatingTile color="var(--green)" left="20%" top="60%" delay="0.2s" rot="10deg">!</FloatingTile>
            <FloatingTile color="var(--purple)" left="55%" top="55%" delay="0.45s" rot="-12deg">+</FloatingTile>
          </div>

          <h1 className="display" style={{ fontSize: 'clamp(28px, 5vw, 64px)', margin: '0 0 16px', lineHeight: 1.05 }}>
            Kids are playing<span style={{ display: 'inline-block', animation: 'wiggle 1s infinite' }}>...</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2.5vw,20px)', color: 'var(--ink-soft)', maxWidth: 540, margin: '0 0 12px', fontWeight: 500 }}>
            Snapping tiles. Asking the narrators. Checking your sources...
          </p>
          <p style={{ fontSize: 'clamp(13px,2vw,16px)', color: '#777', margin: '0 0 56px', fontWeight: 600 }}>
            Topic: <span style={{ color: 'var(--ink)' }}>"{topic}"</span>
          </p>

          <div style={{ marginBottom: 56 }}>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>

          <ChunkyButton color="var(--coral)" textColor="white" onClick={handleEnd} size="lg">
            END SESSION
          </ChunkyButton>
        </div>
      </div>
    );
  }

  return (
    <div className="col" style={{ minHeight: '100vh' }}>
      <style>{`
        @keyframes breatheDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.75; }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        @media (max-width: 600px) {
          .setup-tip { font-size: 16px !important; }
          .setup-btn { width: 100% !important; max-width: 100% !important; }
        }
      `}</style>

      <div className="topbar" style={{ padding: 'clamp(14px,3vw,22px) clamp(16px,4vw,32px)', flexWrap: 'wrap', gap: 8 }}>
        <Logo />
        <span className="pill" style={{ background: 'var(--paper)', fontSize: 'clamp(11px,1.5vw,13px)' }}>
          EDUCATOR · COMMONSENSE MEDIA
        </span>
      </div>

      <div className="col center" style={{ flex: 1, padding: '0 clamp(16px,4vw,32px)' }}>
        <div style={{ width: '100%', maxWidth: 720, textAlign: 'center' }}>

          {/* Tile connection status — breathing pulse */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ position: 'relative', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{
                position: 'absolute',
                width: 14, height: 14,
                borderRadius: '50%',
                background: tilesConnected ? 'var(--green)' : '#bbb',
                animation: 'pulseRing 2s ease-out infinite',
              }} />
              <span style={{
                position: 'relative',
                display: 'inline-block',
                width: 12, height: 12,
                borderRadius: '50%',
                background: tilesConnected ? 'var(--green)' : '#bbb',
                border: '2.5px solid var(--ink)',
                animation: 'breatheDot 2s ease-in-out infinite',
              }} />
            </div>
            <span style={{ fontWeight: 700, letterSpacing: '0.05em', fontSize: 'clamp(11px,1.5vw,13px)' }}>
              {tilesConnected ? 'BLOCKS CONNECTED · 12 TILES READY' : 'WAITING FOR TILES...'}
            </span>
          </div>

          <h1 className="display" style={{
            fontSize: 'clamp(36px, 6vw, 84px)',
            lineHeight: 0.95,
            margin: '0 0 20px',
            letterSpacing: '-0.02em',
          }}>
            What's today's<br />
            <span style={{
              background: 'var(--yellow)',
              padding: '4px 18px',
              border: '3.5px solid var(--ink)',
              borderRadius: 14,
              display: 'inline-block',
              transform: 'rotate(-1.5deg)',
              marginTop: 12,
            }}>discussion?</span>
          </h1>

          <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: 'var(--ink-soft)', margin: '32px auto 40px', maxWidth: 480, fontWeight: 500 }}>
            Type one topic. The kids handle the rest with their tiles.
          </p>

          <input
            className="chunk-input"
            type="text"
            placeholder="e.g. Should robots make our laws?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            style={{
              width: '100%',
              fontSize: 'clamp(16px,3vw,24px)',
              textAlign: 'center',
              marginBottom: 36,
            }}
          />

          <ChunkyButton
            onClick={handleStart}
            color={topic.trim() ? 'var(--yellow)' : '#E5E5E5'}
            size="xl"
            style={{
              opacity: topic.trim() ? 1 : 0.6,
              pointerEvents: topic.trim() ? 'auto' : 'none',
              width: '100%',
              maxWidth: 480,
            }}
          >
            START GAME
          </ChunkyButton>
        </div>
      </div>

      <div className="setup-tip" style={{ padding: 'clamp(16px,3vw,24px)', textAlign: 'center', fontSize: 26, color: '#999', fontWeight: 600 }}>
        Tip: Keep it open-ended. Good topics spark debate.
      </div>
    </div>
  );
}

function FloatingTile({ children, color, left, top, delay, rot }) {
  return (
    <div
      style={{
        position: 'absolute',
        left, top,
        width: 56, height: 56,
        background: color,
        border: '2.5px solid var(--ink)',
        borderRadius: 12,
        boxShadow: '3px 3px 0 0 var(--ink)',
        display: 'grid', placeItems: 'center',
        fontFamily: 'Archivo Black',
        fontSize: 24,
        transform: `rotate(${rot})`,
        animation: `floatY 2.4s ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      {children}
      <style>{`@keyframes floatY { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }`}</style>
    </div>
  );
}

window.ScreenSetup = ScreenSetup;
