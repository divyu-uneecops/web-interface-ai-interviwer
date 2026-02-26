"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const METRICS = [
  { label: "Communication", score: 88 },
  { label: "Technical", score: 76 },
  // { label: "Problem Solving", score: 92 },
];

const TRANSCRIPT = [
  { from: "bot", text: "Can you walk me through your most impactful experience with distributed systems?" },
  { from: "user", text: "Sure! At my last role I designed a distributed cache layer that reduced API latency by 40%..." },
  { from: "bot", text: "Great. How did you handle cache invalidation under high load?" },
];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

function LiveScoringCard({ animate }: { animate: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let v = 0;
    const id = setInterval(() => {
      v += 2;
      if (v >= 85) { setCount(85); clearInterval(id); return; }
      setCount(v);
    }, 18);
    return () => clearInterval(id);
  }, [animate]);

  return (
    <div className="card scoring-card">
      <div className="card-header">
        <span className="scoring-icon">📊</span>
        <span className="card-title">Live Scoring</span>
        <span className="live-badge"><span className="pulse-dot" />LIVE</span>
      </div>

      <div className="metrics">
        {METRICS.map((m, i) => (
          <div className="metric-row" key={m.label} style={{ animationDelay: `${i * 0.12}s` }}>
            <span className="metric-label">{m.label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: animate ? `${m.score}%` : "0%", transitionDelay: `${0.3 + i * 0.15}s` }}
              />
            </div>
            <span className="metric-score">{m.score}</span>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div className="overall-row">
        <div className="overall-label">
          <span>Overall</span>
          <span>Score</span>
        </div>
        <div className="overall-score">{count}%</div>
      </div>
    </div>
  );
}

function AntiCheatBadge() {
  return (
    <div className="card anti-cheat-card">
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div className="shield-icon">🛡️</div>
        <div style={{ flex: 1 }}>
          <div className="badge-title">Anti-Cheating</div>
          <div className="badge-title" style={{ marginTop: "2px", fontSize: "12px", fontWeight: 600 }}>Active</div>
          <div className="badge-sub">✓ No violations detected</div>
        </div>
      </div>
    </div>
  );
}

function CandidateCard() {
  return (
    <div className="card candidate-card">
      <div className="avatar">👩‍💻</div>
      <div className="candidate-info">
        <div className="candidate-name">Sarah Chen</div>
        <div className="candidate-role">Senior Engineer · Round 2</div>
        <div className="candidate-status">
          <span className="status-dot" />
          Interview In Progress
        </div>
      </div>
    </div>
  );
}

function TranscriptPanel() {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="transcript-panel">
      <div className="transcript-header">TRANSCRIPT</div>
      <div className="transcript-messages">
        {TRANSCRIPT.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.from === "bot" ? "bot-msg" : "user-msg"}`}
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {msg.from === "bot" && <span className="bot-avatar">🤖</span>}
            <div className="msg-bubble">{msg.text}</div>
          </div>
        ))}
        <div className="typing-indicator">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-text">Candidate is responding...</span>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function AIInterviewerPanel() {
  return (
    <div className="interviewer-panel">
      <div className="timer-badge">⏱ 12:34</div>
      <div className="bot-orb">
        <div className="orb-ring" />
        <div className="bot-face">🤖</div>
      </div>
      <div className="bot-label">AI INTERVIEWER</div>
      <div className="waveform">
        {[3, 5, 8, 6, 4, 7, 5, 3, 6, 4].map((h, i) => (
          <div key={i} className="wave-bar" style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      <div className="caption-text">"…tell me about a time you led a cross-functional team…"</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function AIInterviewSession() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="ai-interview-session-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Syne:wght@700;800&display=swap');

        .ai-interview-session-root {
          --ai-green-dark: #0d2a1f;
          --ai-green-mid: #14532d;
          --ai-green-accent: #22c55e;
          --ai-green-light: #4ade80;
          --ai-bg-dark: #0f2318;
          --ai-card-bg: #ffffff;
          --ai-text-primary: #111827;
          --ai-text-muted: #6b7280;
          --ai-font-body: 'DM Sans', sans-serif;
          --ai-font-display: 'Syne', sans-serif;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: var(--ai-font-body);
          isolation: isolate;
          contain: layout style paint;
        }

        .ai-interview-session-root *,
        .ai-interview-session-root *::before,
        .ai-interview-session-root *::after {
          box-sizing: border-box;
        }

        .ai-interview-session-root .session-wrapper {
          height: 100%;
          width: 100%;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 25%, #bbf7d0 50%, #d1fae5 75%, #ecfdf5 100%);
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          font-family: var(--ai-font-body);
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .ai-interview-session-root .session-container {
          background: var(--ai-bg-dark);
          border-radius: 24px;
          padding: 16px;
          width: 100%;
          height: 100%;
          box-shadow: 0 32px 80px rgba(0,0,0,0.3);
          position: relative;
          overflow: visible;
          display: flex;
          flex-direction: column;
        }

        /* TOP BAR */
        .ai-interview-session-root .top-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .ai-interview-session-root .top-badge {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          color: var(--ai-green-accent);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ai-interview-session-root .top-title {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* MAIN LAYOUT */
        .ai-interview-session-root .main-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 12px;
          position: relative;
        }

        /* RIGHT PANEL - TRANSCRIPT */
        .transcript-panel {
          position: relative;
        }

        /* LEFT PANEL */
        .left-panel {
          background: #0a1f14;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 250px;
          position: relative;
        }

        .timer-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }

        .bot-orb {
          width: 90px;
          height: 90px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .orb-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid var(--ai-green-accent);
          box-shadow: 0 0 24px rgba(34,197,94,0.4), inset 0 0 24px rgba(34,197,94,0.08);
          animation: orb-pulse 2s ease-in-out infinite;
        }

        @keyframes orb-pulse {
          0%, 100% { box-shadow: 0 0 24px rgba(34,197,94,0.4), inset 0 0 24px rgba(34,197,94,0.08); }
          50% { box-shadow: 0 0 40px rgba(34,197,94,0.7), inset 0 0 40px rgba(34,197,94,0.15); }
        }

        .bot-face {
          font-size: 42px;
          z-index: 1;
        }

        .bot-label {
          font-family: var(--ai-font-display);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--ai-green-accent);
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 20px;
          padding: 4px 14px;
          margin-bottom: 14px;
        }

        .waveform {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-bottom: 14px;
        }

        .wave-bar {
          width: 4px;
          background: var(--ai-green-accent);
          border-radius: 2px;
          animation: wave 1.2s ease-in-out infinite alternate;
        }

        @keyframes wave {
          from { transform: scaleY(0.4); opacity: 0.5; }
          to { transform: scaleY(1); opacity: 1; }
        }

        .caption-text {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          text-align: center;
          max-width: 200px;
          font-style: italic;
          line-height: 1.5;
        }

        /* RIGHT PANEL - TRANSCRIPT */
        .transcript-panel {
          background: #0a1f14;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 250px;
        }

        .transcript-header {
          font-family: var(--ai-font-display);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.4);
          padding: 14px 18px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .transcript-messages {
          flex: 1;
          padding: 14px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .message {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          animation: fade-up 0.4s ease both;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bot-avatar {
          font-size: 18px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .msg-bubble {
          font-size: 13px;
          line-height: 1.5;
          padding: 10px 14px;
          border-radius: 12px;
          max-width: 90%;
        }

        .bot-msg .msg-bubble {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
          border-radius: 4px 12px 12px 12px;
        }

        .user-msg {
          flex-direction: row-reverse;
        }

        .user-msg .msg-bubble {
          background: rgba(34,197,94,0.12);
          color: rgba(255,255,255,0.9);
          border-radius: 12px 4px 12px 12px;
          border: 1px solid rgba(34,197,94,0.2);
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 6px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ai-green-accent);
          animation: typing 1.2s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }

        .typing-text {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          font-style: italic;
          margin-left: 4px;
        }

        /* BOTTOM BAR */
        .bottom-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 12px;
        }

        .end-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 20px;
          padding: 10px 24px;
          font-size: 13px;
          font-weight: 600;
          font-family: var(--ai-font-body);
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(220,38,38,0.35);
        }

        .end-btn:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        /* FLOATING CARDS */
        .ai-interview-session-root .card {
          background: var(--ai-card-bg);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1);
        }

        /* SCORING CARD - floats top-right outside main cards */
        .ai-interview-session-root .main-layout .scoring-card {
          position: absolute;
          top: -64px;
          right: -16px;
          width: 140px;
          padding: 10px 12px;
          z-index: 10;
          animation: floatY 4s ease-in-out infinite;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          border: 1px solid rgba(61,171,114,0.15);
        }

        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .scoring-icon {
          font-size: 14px;
        }

        .card-title {
          font-family: var(--ai-font-display);
          font-size: 10px;
          font-weight: 700;
          color: var(--ai-text-primary);
        }

        .live-badge {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 8px;
          font-weight: 700;
          color: var(--ai-green-accent);
          letter-spacing: 0.5px;
        }

        .pulse-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--ai-green-accent);
          display: inline-block;
          animation: pulse 1.6s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .metrics { display: flex; flex-direction: column; gap: 5px; }

        .metric-row {
          display: flex;
          align-items: center;
          gap: 4px;
          animation: fade-up 0.4s ease both;
        }

        .metric-label {
          font-size: 9px;
          color: var(--ai-text-muted);
          min-width: 60px;
          font-weight: 500;
        }

        .bar-track {
          flex: 1;
          height: 3px;
          background: #f3f4f6;
          border-radius: 99px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: var(--ai-green-accent);
          border-radius: 99px;
          transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
        }

        .metric-score {
          font-size: 9px;
          font-weight: 700;
          color: var(--ai-text-primary);
          min-width: 18px;
          text-align: right;
        }

        .divider { height: 1px; background: #f3f4f6; margin: 8px 0; }

        .overall-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .overall-label {
          display: flex;
          flex-direction: column;
          font-size: 9px;
          font-weight: 600;
          color: var(--ai-text-muted);
          line-height: 1.3;
        }

        .overall-score {
          font-family: var(--ai-font-display);
          font-size: 18px;
          font-weight: 800;
          color: var(--ai-green-accent);
          letter-spacing: -0.5px;
        }

        /* ANTI-CHEAT CARD - floats top-right */
        .ai-interview-session-root .anti-cheat-card {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 200px;
          padding: 14px 16px;
          z-index: 10;
          animation: float-in-right 0.5s 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 12px 40px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1);
        }

        @keyframes float-in-left {
          from { opacity: 0; transform: translateX(-30px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }

        .shield-icon { 
          font-size: 24px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .badge-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--ai-text-primary);
          line-height: 1.3;
          letter-spacing: -0.2px;
        }

        .badge-sub {
          font-size: 11px;
          color: var(--ai-green-accent);
          font-weight: 600;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* CANDIDATE CARD - floats bottom-left outside main cards */
        .ai-interview-session-root .main-layout .candidate-card {
          position: absolute;
          bottom: -75px;
          left: -20px;
          width: 160px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 10;
          animation: floatY 4s 1.5s ease-in-out infinite;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          border: 1px solid rgba(61,171,114,0.15);
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #a78bfa, #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(167, 139, 250, 0.3);
        }

        .candidate-name {
          font-family: var(--ai-font-display);
          font-size: 13px;
          font-weight: 700;
          color: var(--ai-text-primary);
          letter-spacing: -0.3px;
        }

        .candidate-role {
          font-size: 10px;
          color: var(--ai-text-muted);
          margin-top: 2px;
          font-weight: 500;
        }

        .candidate-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          color: var(--ai-green-accent);
          margin-top: 4px;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--ai-green-accent);
          animation: pulse 1.6s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .ai-interview-session-root .main-layout { grid-template-columns: 1fr; }
          .ai-interview-session-root .scoring-card { 
            position: static; 
            width: 100%; 
            margin-bottom: 12px; 
            right: auto;
            transform: none;
          }
          .ai-interview-session-root .anti-cheat-card { 
            position: static; 
            width: 100%; 
            margin-top: 10px; 
            top: auto;
            right: auto;
          }
          .ai-interview-session-root .candidate-card { 
            position: static; 
            width: 100%; 
            margin-top: 10px; 
            left: auto;
            transform: none;
          }
        }
      `}</style>

      <div className="session-wrapper">
        <div className="session-container">

          {/* TOP BAR */}
          <div className="top-bar">
            <div className="top-badge">🌐 50+ Languages Supported</div>
            <div className="top-title">🤖 AI Interview Session</div>
          </div>

          {/* FLOATING CARDS */}
          {/* <AntiCheatBadge /> */}

          {/* MAIN PANELS */}
          <div className="main-layout">
            {/* FLOATING SCORING CARD - positioned relative to main-layout */}
            <LiveScoringCard animate={animate} />
            {/* FLOATING CANDIDATE CARD - positioned relative to main-layout */}
            <CandidateCard />
            {/* Left - AI Interviewer */}
            <div className="left-panel">
              <div className="timer-badge">⏱ 12:34</div>
              <div className="bot-orb">
                <div className="orb-ring" />
                <div className="bot-face">🤖</div>
              </div>
              <div className="bot-label">AI INTERVIEWER</div>
              <div className="waveform">
                {[3, 5, 8, 6, 4, 7, 5, 3, 6, 4].map((h, i) => (
                  <div key={i} className="wave-bar" style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <div className="caption-text">"…tell me about a time you led a cross-functional team…"</div>
            </div>

            {/* Right - Transcript */}
            <TranscriptPanel />
          </div>

          {/* BOTTOM BAR */}
          <div className="bottom-bar">
            <button className="end-btn">End Session</button>
          </div>

        </div>
      </div>
    </div>
  );
}

