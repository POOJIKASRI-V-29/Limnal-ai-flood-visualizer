import { useState } from "react";
import FloodMap from "./FloodMap";
import "./App.css";

// ─── GAUGE ───────────────────────────────────────────────────────────────────
function Gauge({ score }) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const cx = 80, cy = 80, r = 58;
  const angle = -130 + (score / 100) * 260;
  const nx = cx + r * 0.85 * Math.cos(toRad(angle - 90));
  const ny = cy + r * 0.85 * Math.sin(toRad(angle - 90));
  return (
    <svg width="160" height="110" viewBox="0 0 160 110" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="gGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#ef4444" />
          <stop offset="35%"  stopColor="#f97316" />
          <stop offset="65%"  stopColor="#eab308" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <path d="M 22 88 A 58 58 0 1 1 138 88" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
      <path d="M 22 88 A 58 58 0 1 1 138 88" fill="none" stroke="url(#gGrad)" strokeWidth="12" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={8} fill="111827" stroke="white" strokeWidth="3" />
      <text x={cx} y={cy + 20} textAnchor="middle" fill="#111827" fontSize="18" fontWeight="700">{score}%</text>
    </svg>
  );
}

// ─── WEATHER ICON ────────────────────────────────────────────────────────────
function WeatherIcon({ storm }) {
  return (
    <svg width="34" height="30" viewBox="0 0 34 30">
      <ellipse cx="17" cy="11" rx="11" ry="7" fill="#94a3b8" />
      <ellipse cx="23" cy="13" rx="9" ry="6.5" fill="#64748b" />
      {storm ? (
        <polygon points="16,19 13,27 18,21 15,29 21,21" fill="#fbbf24" />
      ) : (
        [11, 16, 21].map(x => (
          <line key={x} x1={x} y1="20" x2={x - 2} y2="29" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" />
        ))
      )}
    </svg>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [city,        setCity]        = useState("Mumbai");
  const [rainfall,    setRainfall]    = useState(120);
  const [drainage,    setDrainage]    = useState(40);
  const [elevation,   setElevation]   = useState(35);
  const [score,       setScore]       = useState(82);
  const [level,       setLevel]       = useState("HIGH");
  const [loading,     setLoading]     = useState(false);
  const [clickedZone, setClickedZone] = useState(null);

  const computeScore = () =>
    Math.min(98, Math.round((rainfall / 300) * 50 + ((100 - drainage) / 100) * 30 + ((100 - elevation) / 100) * 20));
  const computeLevel = (s) => s >= 70 ? "HIGH" : s >= 40 ? "MODERATE" : "LOW";

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://limnal-ai-flood-visualizer-lz9g.onrender.com/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, rainfall, drainage, elevation }),
      });
      if (res.ok) {
        const data = await res.json();
        setScore(data.score);
        setLevel(data.level);
      } else throw new Error();
    } catch {
      const s = computeScore();
      setScore(s);
      setLevel(computeLevel(s));
    }
    setLoading(false);
  };

  const levelColor = level === "HIGH" ? "#ef4444" : level === "MODERATE" ? "#f97316" : "#22c55e";
  const getAIRecommendations = () => {

  if (level === "HIGH") {

    return {

      title: "⚠️ High Flood Risk",

      advice: [

        "Avoid low-lying roads.",

        "Keep emergency supplies ready.",

        "Monitor official weather alerts."

      ],

      explanation:

        "Heavy rainfall combined with poor drainage and low elevation significantly increases flood probability."

    };

  }

  if (level === "MODERATE") {

    return {

      title: "🚗 Moderate Flood Risk",

      advice: [

        "Travel carefully.",

        "Avoid stagnant water.",

        "Keep checking updates."

      ],

      explanation:

        "Environmental conditions indicate a moderate chance of flooding."

    };

  }

  return {

    title: "✅ Low Flood Risk",

    advice: [

      "Current conditions are stable.",

      "Continue monitoring weather.",

      "Safe to travel."

    ],

    explanation:

      "Low rainfall and favorable conditions indicate minimal flood risk."

  };

};

const ai = getAIRecommendations();
  const S = {
    logo:{fontSize:40,marginBottom:8},
    page: { minHeight: "100vh", width: "100%", background: "linear-gradient(160deg,#0a1628 0%,#0f2044 55%,#0a2235 100%)", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" },
    header: { width: "100%", textAlign: "center", padding: "20px 0", background: "linear-gradient(90deg,#1a3a6e,#1e4080,#1a3a6e)", borderBottom: "1px solid rgba(59,130,246,0.3)" },
    h1: { margin: 0, color: "#e2eeff", fontSize: 28, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" },
    sub: { margin: "6px 0 0", color: "#7aa4d8", fontSize: 12, letterSpacing: "0.2em" },
    body: {

 display:"flex",

 gap:24,

 padding:"24px 32px",

 width:"100%",

 boxSizing:"border-box",

 flexWrap:"nowrap"

},
    leftCol: { display: "flex", flexDirection: "column", gap: 16, width: 340, flexShrink: 0 },
    rightCol: { flex: 1, minWidth: 320, display: "flex", flexDirection: "column", gap: 20 },
    card: { background: "rgba(255,255,255,0.96)", borderRadius: 16, padding: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" },
    cardTitle: { margin: "0 0 14px", fontSize: 17, fontWeight: 700, color: "#1e293b" },
    label: { display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 },
    select: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, fontWeight: 500, color: "#1e293b", background: "white", marginBottom: 14, cursor: "pointer" },
    slider: { width: "100%", marginBottom: 14, accentColor: "#2563eb", display: "block" },
    btn: { width: "100%", padding: "12px 0", borderRadius: 12, background: "linear-gradient(90deg,#1d4ed8,#2563eb)", color: "white", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(37,99,235,0.45)" },
    factorRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
    factorDot: (color) => ({ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 700 }),
    actionCard: { flex: 1, minWidth: 160, borderRadius: 14, padding: "14px 16px", background: "#1a3564", color: "white" },
    zoneAlert: { padding: "10px 14px", borderRadius: 10, marginBottom: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", fontSize: 12, color: "#1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" },
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.h1}>
 🌊 LIMNAL
</h1>

<p style={S.sub}>
 Urban Flood Intelligence Platform
</p>
      </div>

      <div style={S.body}>
        {/* LEFT */}
        <div style={S.leftCol}>
          <div style={S.card}>
            <h2 style={S.cardTitle}>Input Data</h2>
            <label style={S.label}>Select City</label>
            <select style={S.select} value={city} onChange={e => { setCity(e.target.value); setClickedZone(null); }}>
              {["Mumbai", "Delhi", "Chennai"].map(c => <option key={c}>{c}</option>)}
            </select>
            <label style={S.label}>Rainfall in Last 24 Hours <span style={{ color: "#1d4ed8", fontWeight: 700 }}>{rainfall} mm</span></label>
            <input type="range" min={0} max={300} value={rainfall} onChange={e => setRainfall(+e.target.value)} style={S.slider} />
            <label style={S.label}>Drainage Capacity <span style={{ color: "#1d4ed8", fontWeight: 700 }}>{drainage}%</span></label>
            <input type="range" min={0} max={100} value={drainage} onChange={e => setDrainage(+e.target.value)} style={S.slider} />
            <label style={S.label}>Elevation Factor <span style={{ color: "#1d4ed8", fontWeight: 700 }}>{elevation}%</span></label>
            <input type="range" min={0} max={100} value={elevation} onChange={e => setElevation(+e.target.value)} style={S.slider} />
            <button style={{ ...S.btn, opacity: loading ? 0.65 : 1 }} onClick={analyze} disabled={loading}>
              {loading ? "Analyzing…" : "Analyze Risk"}
            </button>
          </div>

          <div style={S.card}>
            <h2 style={S.cardTitle}>Risk Assessment</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Flood Risk Level:</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: levelColor }}>{level}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}><Gauge score={score} /></div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", margin: "4px 0 10px" }}>Flood Severity Score</p>
            {[{ n: 1, label: "High Rainfall", color: "#ef4444" }, { n: 2, label: "Poor Drainage", color: "#f97316" }, { n: 3, label: "Low Elevation", color: "#eab308" }].map(f => (
              <div key={f.n} style={S.factorRow}>
                <div style={S.factorDot(f.color)}>{f.n}</div>
                <span style={{ fontSize: 12, color: "#475569" }}>{f.label}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, height: 44, borderRadius: 8, overflow: "hidden", background: "linear-gradient(to top,rgba(30,58,138,0.2),transparent)" }}>
              <svg width="100%" height="44" viewBox="0 0 280 44" preserveAspectRatio="none">
                <path d="M0,44 L0,28 L18,28 L18,18 L28,18 L28,8 L38,8 L38,18 L52,18 L52,24 L68,24 L68,14 L78,14 L78,4 L88,4 L88,14 L100,14 L100,24 L114,24 L114,16 L124,16 L124,6 L134,6 L134,16 L148,16 L148,26 L163,26 L163,18 L173,18 L173,10 L183,10 L183,18 L198,18 L198,26 L213,26 L213,20 L223,20 L223,28 L238,28 L238,33 L253,33 L253,26 L263,26 L263,33 L280,33 L280,44 Z" fill="rgba(30,58,138,0.35)" />
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={S.rightCol}>
          <div style={S.card}>
            <h2 style={{ ...S.cardTitle, marginBottom: 12 }}>
              Flood Risk Map – <span style={{ color: "#1d4ed8" }}>{city}</span>
              <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8, fontWeight: 400 }}>Hover or click a zone</span>
            </h2>

            {clickedZone && (
              <div style={S.zoneAlert}>
                <span>
                  📍 <strong>{clickedZone.name}</strong> — Risk:{" "}
                  <strong style={{ color: clickedZone.risk === "high" ? "#ef4444" : clickedZone.risk === "moderate" ? "#f97316" : "#22c55e" }}>
                    {clickedZone.risk.toUpperCase()}
                  </strong>{" "}
                  | Flood Intensity: <strong>{Math.round(clickedZone.intensity * 100)}%</strong>
                </span>
                <button onClick={() => setClickedZone(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16, lineHeight: 1 }}>✕</button>
              </div>
            )}

            <FloodMap
 city={city}
 rainfall={rainfall}
 drainage={drainage}
 elevation={elevation}
 score={score}
 level={level}
 onZoneClick={setClickedZone}
/>
          </div>

         <div style={S.card}>

  <h2 style={{ ...S.cardTitle, marginBottom: 12 }}>

    Flood Advisory

  </h2>

  <div
    style={{

      background:"#f8fafc",

      padding:"16px",

      borderRadius:"12px",

      marginBottom:"16px"

    }}

  >

    <h3
      style={{

        margin:"0 0 10px",

        color:"#2563eb"

      }}

    >

      {ai.title}

    </h3>

    <p
      style={{

        color:"#475569",

        lineHeight:1.6

      }}

    >

      {ai.explanation}

    </p>

  </div>

  <div
    style={{

      display:"flex",

      gap:"12px",

      flexWrap:"wrap"

    }}

  >

    {ai.advice.map((item,index)=>(

      <div

        key={index}

        style={{

          flex:1,

          minWidth:"180px",

          background:"#1a3564",

          color:"white",

          padding:"16px",

          borderRadius:"12px"

        }}

      >

        {item}

      </div>

    ))}

  </div>

</div>
        </div>
      </div>
    </div>
  );
}