import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Camera } from "lucide-react";
const solarImg       = "https://images.unsplash.com/photo-1635424710928-0544e8512eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const roofSlateImg   = "https://images.unsplash.com/photo-1765025315539-52c45c051c54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const timberFrameImg = "https://images.unsplash.com/photo-1762813384339-c526d5533976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

/* ─────────────────────────────────────────────────────────────────
   CAPTURED PHOTOS
───────────────────────────────────────────────────────────────── */
const CAP_TOM   = "https://images.unsplash.com/photo-1701289532783-bc3b011629a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
const CAP_GRID2 = timberFrameImg;
const CAP_JAMES = solarImg;
const CAP_GRID4 = roofSlateImg;
const CAP_GRID5 = "https://images.unsplash.com/photo-1757219525975-03b5984bc6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
const CAP_SARAH = "https://images.unsplash.com/photo-1758101755915-462eddc23f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";

/* ─────────────────────────────────────────────────────────────────
   VIEWFINDER PHOTOS
───────────────────────────────────────────────────────────────── */
const VIEW_TOM   = "https://images.unsplash.com/photo-1645397827527-3f1c07730733?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
const VIEW_SARAH = "https://images.unsplash.com/photo-1467733238130-bb6846885316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
const VIEW_JAMES = "https://images.unsplash.com/photo-1592818976384-135c0af56c27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";

/* ─────────────────────────────────────────────────────────────────
   WORKERS
───────────────────────────────────────────────────────────────── */
const WORKERS = [
  { name: "Tom",   role: "Roofer",      color: "#3478F6", initial: "T",
    viewPhoto: VIEW_TOM,   capturedPhoto: CAP_TOM,
    location: "Kings Cross", sublocation: "Block A · Roof Level 4", time: "09:34",
    cardStart: 1, shutterPhase: 2, flyPhase: 3, syncPhase: 4,  gridPhase: 4  },
  { name: "Sarah", role: "Electrician", color: "#F97316", initial: "S",
    viewPhoto: VIEW_SARAH, capturedPhoto: CAP_SARAH,
    location: "Kings Cross", sublocation: "Block B · Electrical Room", time: "10:12",
    cardStart: 5, shutterPhase: 6, flyPhase: 7, syncPhase: 8,  gridPhase: 8  },
  { name: "James", role: "Solar",       color: "#0D9488", initial: "J",
    viewPhoto: VIEW_JAMES, capturedPhoto: CAP_JAMES,
    location: "Kings Cross", sublocation: "South Elevation · Grid 3", time: "11:45",
    cardStart: 9, shutterPhase: 10, flyPhase: 11, syncPhase: 12, gridPhase: 12 },
] as const;

const SYNC_OVERLAY_COLORS: Record<string, string> = {
  Tom:   "#7FB5FA",
  Sarah: "#FBB87A",
  James: "#3ECFC3",
};

const GRID_ALL = [CAP_GRID4, CAP_GRID2, CAP_GRID5, CAP_TOM, CAP_SARAH, CAP_JAMES];

/* ─────────────────────────────────────────────────────────────────
   PHASES
───────────────────────────────────────────────────────────────── */
const PHASE_MS = [
  500,
  1000, 1100, 480, 700,
  1000, 1100, 480, 700,
  1000, 1100, 480, 900,
  2200, 350,
];

function useCycle(ms: number[]): number {
  const [p, setP] = useState(0);
  const ref = useRef(ms);
  ref.current = ms;
  useEffect(() => {
    const id = setTimeout(() => setP(c => (c + 1) % ref.current.length), ref.current[p] ?? 1000);
    return () => clearTimeout(id);
  }, [p]);
  return p;
}

/* ─────────────────────────────────────────────────────────────────
   LAYOUT TYPES
───────────────────────────────────────────────────────────────── */
type Pt = { x: number; y: number };
type UnitCfg = {
  left: number; top: number;
  cardW: number; cardH: number; phoneOffY: number;
  phoneW: number; phoneH: number;
  flyFromX: number; flyFromY: number;
  rScale: number;
  done: { left: number; top: number; w: number; h: number } | null;
};
type AppCfg = {
  x: number; y: number; w: number; h: number;
  showChrome: boolean; sidebarW: number; chromeH: number; headerH: number;
};
type LayoutCfg = {
  canvas:  { w: number; h: number };
  unit:    UnitCfg;
  flyTos:  [Pt, Pt, Pt];
  app:     AppCfg;
  flyCard: { w: number; h: number };
};

/* ─────────────────────────────────────────────────────────────────
   CONFIGS
───────────────────────────────────────────────────────────────── */
const CFGS: Record<"desktop" | "tablet" | "mobile", LayoutCfg> = {
  desktop: {
    canvas: { w: 960, h: 600 },
    unit: {
      left: 105, top: 64,
      cardW: 191, cardH: 40, phoneOffY: 48,
      phoneW: 191, phoneH: 415,
      flyFromX: 200, flyFromY: 320,
      rScale: 1,
      done: { left: 10, top: 88, w: 138, h: 300 },
    },
    flyTos:  [{ x: 457, y: 342 }, { x: 647, y: 342 }, { x: 837, y: 342 }],
    app:     { x: 312, y: 50, w: 626, h: 500, showChrome: true, sidebarW: 44, chromeH: 32, headerH: 36 },
    flyCard: { w: 96, h: 72 },
  },
  tablet: {
    canvas: { w: 770, h: 480 },
    unit: {
      left: 82, top: 56,
      cardW: 148, cardH: 32, phoneOffY: 40,
      phoneW: 148, phoneH: 322,
      flyFromX: 156, flyFromY: 257,
      rScale: 0.77,
      done: { left: 8, top: 71, w: 107, h: 233 },
    },
    flyTos:  [{ x: 363, y: 283 }, { x: 520, y: 283 }, { x: 677, y: 283 }],
    app:     { x: 244, y: 40, w: 518, h: 400, showChrome: true, sidebarW: 36, chromeH: 28, headerH: 30 },
    flyCard: { w: 72, h: 54 },
  },
  mobile: {
    canvas: { w: 350, h: 220 },
    unit: {
      left: 6, top: 10,
      cardW: 82, cardH: 24, phoneOffY: 31,
      phoneW: 82, phoneH: 178,
      flyFromX: 47, flyFromY: 130,
      rScale: 0.44,
      done: null,
    },
    flyTos:  [{ x: 143, y: 120 }, { x: 222, y: 120 }, { x: 301, y: 120 }],
    app:     { x: 100, y: 8, w: 244, h: 204, showChrome: false, sidebarW: 0, chromeH: 0, headerH: 18 },
    flyCard: { w: 40, h: 30 },
  },
};

/* ─────────────────────────────────────────────────────────────────
   VIEWFINDER GRID
───────────────────────────────────────────────────────────────── */
function ViewfinderGrid({ sW, sH }: { sW: number; sH: number }) {
  const cs  = Math.round(Math.min(sW, sH) * 0.46);
  const fx  = (sW - cs) / 2, fy = (sH - cs) / 2;
  const arm = Math.max(4, Math.round(cs * 0.22));
  const lw  = Math.max(0.6, sW * 0.012);
  const t3w = sW / 3, t3h = sH / 3;
  return (
    <svg width={sW} height={sH} viewBox={`0 0 ${sW} ${sH}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <rect width={sW} height={sH} fill="rgba(0,0,0,0.15)" />
      <line x1={t3w}   y1={0}  x2={t3w}   y2={sH} stroke="#fff" strokeWidth={lw} opacity={0.22} />
      <line x1={t3w*2} y1={0}  x2={t3w*2} y2={sH} stroke="#fff" strokeWidth={lw} opacity={0.22} />
      <line x1={0} y1={t3h}   x2={sW} y2={t3h}   stroke="#fff" strokeWidth={lw} opacity={0.22} />
      <line x1={0} y1={t3h*2} x2={sW} y2={t3h*2} stroke="#fff" strokeWidth={lw} opacity={0.22} />
      {[
        `M${fx+arm} ${fy} H${fx} V${fy+arm}`,
        `M${fx+cs-arm} ${fy} H${fx+cs} V${fy+arm}`,
        `M${fx+arm} ${fy+cs} H${fx} V${fy+cs-arm}`,
        `M${fx+cs-arm} ${fy+cs} H${fx+cs} V${fy+cs-arm}`,
      ].map((d, i) => <path key={i} d={d} stroke="#fff" strokeWidth={lw*2.2} fill="none" strokeLinecap="round" />)}
      <circle cx={sW*0.07} cy={sH*0.04} r={sW*0.022} fill="#FA3E3E" />
      <text x={sW*0.105} y={sH*0.058} fill="rgba(255,255,255,0.88)" fontSize={Math.max(7, sW*0.056)} fontFamily="monospace" fontWeight="bold">REC</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   VIEWFINDER META HUD  — top-centre location pill
───────────────────────────────────────────────────────────────── */
function ViewfinderMetaHUD({ worker, sW, sH }: { worker: typeof WORKERS[number]; sW: number; sH: number }) {
  const fs    = Math.max(5.5, Math.round(sW * 0.062));
  const fsS   = Math.max(4.5, Math.round(sW * 0.050));
  const pad   = Math.max(4,   Math.round(sW * 0.052));
  const br    = Math.max(3,   Math.round(sW * 0.055));
  const top   = Math.max(14,  Math.round(sH * 0.115));
  const pinSz = Math.max(7,   Math.round(fs));

  return (
    <div style={{
      position: "absolute", top,
      left: "50%", transform: "translateX(-50%)",
      pointerEvents: "none", zIndex: 22,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: Math.round(sW * 0.032),
        background: "rgba(0,0,0,0.52)", backdropFilter: "blur(6px)",
        borderRadius: br, padding: `${Math.round(pad * 0.5)}px ${pad}px`,
        border: "0.5px solid rgba(255,255,255,0.18)",
        whiteSpace: "nowrap",
      }}>
        <svg width={pinSz} height={pinSz} viewBox="0 0 12 14" fill="none" style={{ flexShrink: 0 }}>
          <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" fill={worker.color} />
          <circle cx="6" cy="5" r="1.8" fill="rgba(255,255,255,0.9)" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ fontSize: fs, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
            {worker.location}
          </span>
          {sW >= 90 && (
            <span style={{ fontSize: fsS, color: "rgba(255,255,255,0.58)", lineHeight: 1.2 }}>
              {worker.sublocation}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PHOTO STAMP  — centred two-row bar
──────────────────────────────────────────────────────────────── */
function PhotoStamp({ worker, sW, sH, doAnimate = true }: {
  worker: typeof WORKERS[number]; sW: number; sH: number; doAnimate?: boolean;
}) {
  const fs     = Math.max(6,  Math.round(sW * 0.072));
  const fsT    = Math.max(5,  Math.round(sW * 0.057));
  const pad    = Math.max(5,  Math.round(sW * 0.058));
  const vpad   = Math.max(3,  Math.round(sW * 0.032));
  const rowGap = Math.max(1,  Math.round(sW * 0.018));
  const pinSz  = Math.max(6,  Math.round(fs * 0.95));
  const pinGap = Math.max(2,  Math.round(sW * 0.028));
  const barH   = vpad * 2 + fs + rowGap + fsT + 4;

  const bar = (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "#040812",
      borderTop: `1.5px solid ${worker.color}`,
      // No backdropFilter — it creates a compositing layer that escapes
      // ancestor overflow:hidden clipping, causing boxy corners.
      // No explicit border-radius — outer overflow:hidden+cr clips cleanly.
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      padding: `${vpad}px ${pad}px`,
      gap: rowGap,
      pointerEvents: "none",
    }}>
      {/* Row 1 — location, centred */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: pinGap }}>
        <svg width={pinSz} height={pinSz} viewBox="0 0 12 14" fill="none" style={{ flexShrink: 0 }}>
          <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" fill={worker.color} />
          <circle cx="6" cy="5" r="1.8" fill="rgba(255,255,255,0.9)" />
        </svg>
        <span style={{ fontSize: fs, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
          {worker.location}
        </span>
      </div>
      {/* Row 2 — time, centred */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <span style={{
          fontSize: fsT, fontWeight: 500,
          color: "rgba(255,255,255,0.46)",
          whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums",
        }}>
          {worker.time} · 03 Mar
        </span>
      </div>
    </div>
  );

  if (!doAnimate) return <>{bar}</>;

  return (
    <motion.div
      key={`stamp-${worker.name}`}
      initial={{ y: barH + 4, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.31, ease: [0.2, 0, 0.16, 1], delay: 0.27 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}
    >
      {bar}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   GRID META PILL
───────────────────────────────────────────────────────────────── */
function GridMetaPill({ worker, headerH }: { worker: typeof WORKERS[number]; headerH: number }) {
  const fs    = Math.max(4,   Math.round(headerH * 0.22));
  const ph    = Math.max(8,   Math.round(headerH * 0.36));
  const px    = Math.max(3,   Math.round(headerH * 0.12));
  const pinSz = Math.max(5,   Math.round(fs * 1.1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.34, duration: 0.20 }}
      style={{
        position: "absolute",
        bottom: Math.round(headerH * 0.12),
        right: Math.round(headerH * 0.1),
        display: "flex", alignItems: "center", gap: Math.round(headerH * 0.08),
        background: "rgba(5,10,20,0.7)", backdropFilter: "blur(4px)",
        borderRadius: ph, padding: `${Math.round(ph * 0.22)}px ${px}px`,
        border: "0.5px solid rgba(255,255,255,0.14)",
        zIndex: 12, pointerEvents: "none",
      }}
    >
      <svg width={pinSz} height={pinSz} viewBox="0 0 12 14" fill="none" style={{ flexShrink: 0 }}>
        <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" fill={worker.color} />
        <circle cx="6" cy="5" r="1.8" fill="rgba(255,255,255,0.85)" />
      </svg>
      <span style={{ fontSize: fs, fontWeight: 600, color: "rgba(255,255,255,0.88)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
        {worker.time}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MARKUP SVG
───────────────────────────────────────────────────────────────── */
function MarkupSVG({ workerName, color, sW, sH, animated = false }: {
  workerName: string; color: string; sW: number; sH: number; animated?: boolean;
}) {
  const xs = sW / 100, ys = sH / 75;
  const sw = Math.max(1, sW * 0.022);

  const draw = (duration: number, delay = 0) => animated
    ? { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration, delay, ease: [0.4, 0, 0.2, 1] as number[] } }
    : {};
  const pop = (delay = 0, scale = true) => animated
    ? { initial: { opacity: 0, ...(scale ? { scale: 0 } : {}) }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.22, delay, type: "spring" as const, stiffness: 480, damping: 22 } }
    : {};
  const fade = (delay = 0) => animated
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2, delay } }
    : {};

  if (workerName === "Tom") {
    const r = 12 * Math.min(xs, ys), cx = 44*xs, cy = 55*ys;
    const lx1 = cx+r*.7, ly1 = cy-r*.7, lx2 = cx+r*1.5, ly2 = cy-r*1.5;
    return (
      <svg width={sW} height={sH} viewBox={`0 0 ${sW} ${sH}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <motion.circle cx={cx} cy={cy} r={r} fill={`${color}20`} stroke="none" {...fade(0)} />
        <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} {...draw(0.55, 0)} />
        <motion.circle cx={cx} cy={cy} r={sw*1.3} fill={color} {...pop(0.45)} />
        <motion.line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={color} strokeWidth={sw*.85} strokeLinecap="round" {...draw(0.28, 0.5)} />
        <motion.circle cx={lx2} cy={ly2} r={sw*1.1} fill={color} {...pop(0.76)} />
        <motion.rect x={lx2-sw*2.5} y={ly2-sw*3.5} width={sw*5} height={sw*7} rx={sw} fill={color} opacity={0.9} {...pop(0.82)} />
        <motion.text x={lx2} y={ly2+sw*1.6} textAnchor="middle" fill="#fff" fontSize={sw*4} fontWeight="bold" fontFamily="sans-serif" {...fade(1.0)}>!</motion.text>
      </svg>
    );
  }

  if (workerName === "Sarah") {
    const x1=10*xs, y1=10*ys, rw=80*xs, rh=58*ys;
    const corners: [number,number][] = [[x1,y1],[x1+rw,y1],[x1,y1+rh],[x1+rw,y1+rh]];
    return (
      <svg width={sW} height={sH} viewBox={`0 0 ${sW} ${sH}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <motion.rect x={x1} y={y1} width={rw} height={rh} fill={`${color}14`} stroke="none" {...fade(0)} />
        <motion.rect x={x1} y={y1} width={rw} height={rh} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={`${sw*3.5} ${sw*2}`} {...draw(0.6, 0)} />
        {corners.map(([bx, by], i) => (
          <motion.circle key={i} cx={bx} cy={by} r={sw*1.8} fill={color} {...pop(0.55 + i * 0.07)} />
        ))}
        <motion.rect x={x1+rw-sw*16} y={y1-sw*6} width={sw*16} height={sw*5.5} rx={sw} fill={color} {...pop(0.88)} />
        <motion.text x={x1+rw-sw*8} y={y1-sw*1.8} textAnchor="middle" fill="#fff" fontSize={sw*3.2} fontWeight="bold" fontFamily="sans-serif" {...fade(1.05)}>INSPECT</motion.text>
      </svg>
    );
  }

  // James — Solar
  const ax=12*xs, ay=62*ys, bx=85*xs, by=32*ys;
  const ang = Math.atan2(by-ay, bx-ax), ah = sw*4.5;
  const mx = (ax+bx)/2, my = (ay+by)/2;
  return (
    <svg width={sW} height={sH} viewBox={`0 0 ${sW} ${sH}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <motion.circle cx={ax} cy={ay} r={sw*1.6} fill={color} {...pop(0)} />
      <motion.line x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${sw*3} ${sw*2}`} {...draw(0.55, 0.1)} />
      <motion.path d={`M${bx} ${by} L${bx-ah*Math.cos(ang-.5)} ${by-ah*Math.sin(ang-.5)} L${bx-ah*Math.cos(ang+.5)} ${by-ah*Math.sin(ang+.5)} Z`} fill={color} {...pop(0.62)} />
      <motion.rect x={mx-sw*9} y={my-sw*4} width={sw*18} height={sw*7} rx={sw*2} fill={color} {...pop(0.72)} />
      <motion.text x={mx} y={my+sw*1.8} textAnchor="middle" fill="#fff" fontSize={sw*3.2} fontWeight="bold" fontFamily="sans-serif" {...fade(0.92)}>12 PANELS</motion.text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   iPHONE BODY
───────────────────────────────────────────────────────────────── */
function IPhoneBody({
  phoneW, phoneH, worker, children, isShutter = false,
}: {
  phoneW: number; phoneH: number;
  worker: typeof WORKERS[number];
  children: React.ReactNode;
  isShutter?: boolean;
}) {
  const bz    = Math.round(phoneW * 0.04);   // thinner bezel → less chin
  const sW    = phoneW - bz * 2;
  const sH    = phoneH - bz * 2;
  const cr    = Math.round(phoneW * 0.20);   // large modern-iPhone corner radius
  const sBR   = Math.round(phoneW * 0.165);  // screen radius tracks outer
  const diW   = Math.round(sW * 0.36);
  const diH   = Math.max(8, Math.round(phoneH * 0.028));
  const diTop = Math.max(6, Math.round(sH * 0.016));

  return (
    <div style={{
      width: phoneW, height: phoneH,
      background: "#0A0E1A",
      borderRadius: cr,
      position: "relative",
      overflow: "hidden",
      boxShadow: isShutter
        ? `0 0 0 3px #fff, 0 0 0 6px ${worker.color}, 0 0 40px ${worker.color}90, 0 28px 72px rgba(0,0,0,0.85)`
        : `0 0 0 2.5px ${worker.color}, 0 0 22px ${worker.color}50, 0 20px 56px rgba(0,0,0,0.7)`,
    }}>
      <div style={{
        position: "absolute", left: bz, top: bz, width: sW,
        // Top corners: sBR gives the proper bezel gap vs outer cr (intentional).
        // Bottom corners: 0 (sharp). Height extends past outer body by cr so the
        // outer overflow:hidden+cr clips through a flat rectangular edge —
        // matching the phone border exactly with zero gap or crescent.
        // All four corners use sBR — mirrors the top exactly.
        // The sBR corner sits just inside the outer cr corner, leaving the
        // same thin dark bezel gap on all sides (top AND bottom).
        // Pull screen bottom up by 3×bz — leaves a 2×bz dark chin
        // so the outer cr curve is fully visible at the bottom.
        height: phoneH - bz * 3,
        borderRadius: sBR,
        overflow: "hidden", background: "#050A14",
      }}>
        {children}
        <div style={{
          position: "absolute", top: diTop, left: "50%",
          transform: "translateX(-50%)",
          width: diW, height: diH,
          borderRadius: diH,
          background: "#000",
          zIndex: 40, pointerEvents: "none",
        }} />
      </div>
      {/* Volume buttons — LEFT */}
      <div style={{ position: "absolute", left: -1, top: "20%", width: 3, height: "4.5%", background: "rgba(255,255,255,0.12)", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", left: -1, top: "30%", width: 3, height: "8%",   background: "rgba(255,255,255,0.12)", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", left: -1, top: "41%", width: 3, height: "8%",   background: "rgba(255,255,255,0.12)", borderRadius: "2px 0 0 2px" }} />
      {/* Power button — RIGHT */}
      <div style={{ position: "absolute", right: -1, top: "30%", width: 3, height: "14%", background: "rgba(255,255,255,0.12)", borderRadius: "0 2px 2px 0" }} />
      {/* Home indicator */}
      <div style={{
        position: "absolute", bottom: Math.round(phoneH * 0.018), left: "50%",
        transform: "translateX(-50%)",
        width: Math.round(phoneW * 0.32), height: Math.round(phoneH * 0.009),
        borderRadius: 99, background: "rgba(255,255,255,0.25)",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ACTIVE iPHONE
───────────────────────────────────────────────────────────────── */
function ActivePhone({ worker, phoneW, phoneH, phase }: {
  worker: typeof WORKERS[number]; phoneW: number; phoneH: number; phase: number;
}) {
  const bz = Math.round(phoneW * 0.05);
  const sW = phoneW - bz * 2;
  const sH = phoneH - bz * 2;

  const isViewfinder = phase === worker.cardStart;
  const isShutter    = phase === worker.shutterPhase;
  const showMarkup   = phase >= worker.shutterPhase && phase < worker.syncPhase;
  const showSync     = phase === worker.syncPhase;

  const photoSrc = phase < worker.shutterPhase ? worker.viewPhoto : worker.capturedPhoto;

  return (
    <motion.div
      animate={isShutter ? { scale: [1, 1.038, 1] } : { scale: 1 }}
      transition={{ duration: 0.26, times: [0, 0.35, 1] }}
    >
      <IPhoneBody phoneW={phoneW} phoneH={phoneH} worker={worker} isShutter={isShutter}>
        <AnimatePresence mode="wait">
          <motion.img
            key={photoSrc}
            src={photoSrc}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AnimatePresence>

        {isViewfinder && <ViewfinderGrid sW={sW} sH={sH} />}
        {isViewfinder && <ViewfinderMetaHUD worker={worker} sW={sW} sH={sH} />}

        {isViewfinder && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: Math.round(sH*0.17),
            background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <motion.div
              animate={{ scale: [1, 1.14, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: Math.round(sW*0.18), height: Math.round(sW*0.18),
                borderRadius: "50%", background: "#fff",
                boxShadow: `0 0 0 ${Math.round(sW*0.028)}px rgba(255,255,255,0.28)`,
              }}
            />
          </div>
        )}

        {showMarkup && (
          <motion.div key={`mk-${worker.name}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18, delay: 0.16 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <MarkupSVG workerName={worker.name} color={worker.color} sW={sW} sH={sH} animated={true} />
          </motion.div>
        )}

        {showMarkup && <PhotoStamp worker={worker} sW={sW} sH={sH} doAnimate={true} />}

        <AnimatePresence>
          {isShutter && (
            <motion.div key="flash"
              initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.38 }}
              style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 30 }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSync && (
            <motion.div key="sync"
              initial={{ clipPath: "circle(0% at 50% 45%)" }}
              animate={{ clipPath: "circle(150% at 50% 45%)" }}
              exit={{ clipPath: "circle(0% at 50% 45%)" }}
              transition={{ duration: 0.34, ease: [0.32, 0, 0.18, 1] }}
              style={{
                position: "absolute", inset: 0,
                background: `${SYNC_OVERLAY_COLORS[worker.name]}`,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: Math.round(sH*0.04), zIndex: 30,
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 16, delay: 0.06 }}
                style={{ width: Math.round(sW*0.36), height: Math.round(sW*0.36), borderRadius: "50%", background: "rgba(255,255,255,0.22)", border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width={Math.round(sW*0.22)} height={Math.round(sW*0.22)} viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                style={{ fontSize: Math.round(sH*0.065), fontWeight: 800, color: "#fff" }}>
                Synced ✓
              </motion.span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                style={{ fontSize: Math.round(sH*0.042), color: "rgba(255,255,255,0.7)" }}>
                Kings Cross
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </IPhoneBody>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DONE iPHONE
───────────────────────────────────────────────────────────────── */
function DonePhone({ worker, w, h, left, top }: {
  worker: typeof WORKERS[number]; w: number; h: number; left: number; top: number;
}) {
  const bz    = Math.round(w * 0.04);
  const sW    = w - bz * 2;
  const sH    = h - bz * 2;
  const cardH = Math.round(w * 0.22);
  const gap   = Math.round(h * 0.02);

  return (
    <motion.div
      initial={{ x: -(left + w + 30), opacity: 0 }}
      animate={{ x: 0, opacity: 0.82 }}
      exit={{ x: -(left + w + 30), opacity: 0 }}
      transition={{ type: "spring", stiffness: 295, damping: 26 }}
      style={{ position: "absolute", left, top, zIndex: 38 }}
    >
      <IdentityCard worker={worker} cardW={w} cardH={cardH} />
      <div style={{ height: gap }} />
      <IPhoneBody phoneW={w} phoneH={h} worker={worker}>
        <img src={worker.capturedPhoto} alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <MarkupSVG workerName={worker.name} color={worker.color} sW={sW} sH={sH} />
        <PhotoStamp worker={worker} sW={sW} sH={sH} doAnimate={false} />
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.18 }}
          style={{
            position: "absolute", bottom: Math.round(h * 0.05), right: Math.round(w * 0.06),
            width: Math.round(w * 0.2), height: Math.round(w * 0.2),
            borderRadius: "50%", background: "#0D9488",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `${Math.max(1.5, Math.round(w * 0.015))}px solid rgba(255,255,255,0.9)`,
            zIndex: 20,
          }}
        >
          <svg width={Math.round(w * 0.12)} height={Math.round(w * 0.12)} viewBox="0 0 10 10">
            <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </motion.div>
      </IPhoneBody>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   IDENTITY CARD
───────────────────────────────────────────────────────────────── */
function IdentityCard({ worker, cardW, cardH }: { worker: typeof WORKERS[number]; cardW: number; cardH: number }) {
  return (
    <div style={{
      width: cardW, height: cardH,
      background: "#fff", borderRadius: Math.round(cardH*0.28),
      border: "1px solid rgba(0,0,0,0.07)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.32)",
      display: "flex", alignItems: "center",
      padding: `0 ${Math.round(cardH*0.3)}px`, gap: Math.round(cardH*0.32),
    }}>
      <div style={{
        width: Math.round(cardH*0.74), height: Math.round(cardH*0.74),
        borderRadius: "50%", background: worker.color, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: Math.round(cardH*0.38), fontWeight: 800, color: "#fff", lineHeight: 1 }}>{worker.initial}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: Math.round(cardH*0.34), fontWeight: 700, color: "#0E1F40", whiteSpace: "nowrap", lineHeight: 1.2 }}>{worker.name}</div>
        <div style={{ fontSize: Math.round(cardH*0.27), color: "#64748B", whiteSpace: "nowrap", lineHeight: 1.2 }}>{worker.role}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   WORKER UNIT
   FIX: card top = -unit.cardH so it sits flush against the phone top
   with zero gap (previously -0.72*cardH left a visible dark gap)
───────────────────────────────────────────────────────────────── */
function WorkerUnit({ worker, unit, phase }: { worker: typeof WORKERS[number]; unit: UnitCfg; phase: number }) {
  const visible   = phase >= worker.cardStart && phase <= worker.syncPhase;
  const offscreen = -(unit.left + unit.phoneW + 60);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div key={`unit-${worker.name}`}
          initial={{ x: offscreen, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: offscreen, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 25 }}
          style={{ position: "absolute", left: unit.left, top: unit.top + unit.phoneOffY, zIndex: 50 }}
        >
          <ActivePhone worker={worker} phoneW={unit.phoneW} phoneH={unit.phoneH} phase={phase} />
          {/* Card sits flush on the phone top — bottom edge aligns with phone top edge */}
          <div style={{
            position: "absolute",
            top: -unit.cardH,
            left: 0,
            zIndex: 55,
          }}>
            <IdentityCard worker={worker} cardW={unit.cardW} cardH={unit.cardH} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SHUTTER RIPPLE
───────────────────────────────────────────────────────────────── */
function ShutterRipple({ cx, cy, active, rScale }: { cx: number; cy: number; active: boolean; rScale: number }) {
  if (!active) return null;
  return (
    <>
      {[80, 132, 182].map((sz, i) => {
        const s = Math.round(sz * rScale);
        return (
          <motion.div key={i}
            initial={{ scale: 0, opacity: 0.78 - i*0.18 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.50, delay: i*0.10, ease: [0.18, 0, 0.45, 1] }}
            style={{
              position: "absolute", left: cx-s/2, top: cy-s/2,
              width: s, height: s, borderRadius: "50%",
              border: `${i===0 ? 2.5 : 1.5}px solid rgba(255,255,255,${0.7 - i*0.2})`,
              pointerEvents: "none", zIndex: 55,
            }}
          />
        );
      })}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FLYING PHOTO
───────────────────────────────────────────────────────────────── */
function FlyingPhoto({ worker, flyFrom, flyTo, flyCard, phase }: {
  worker: typeof WORKERS[number]; flyFrom: Pt; flyTo: Pt;
  flyCard: { w: number; h: number }; phase: number;
}) {
  if (phase !== worker.flyPhase) return null;
  return (
    <motion.div key={`fly-${worker.name}`}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.55 }}
      animate={{ x: flyTo.x - flyFrom.x, y: flyTo.y - flyFrom.y, opacity: 1, scale: 0.9 }}
      transition={{ duration: 0.16, ease: [0.2, 0, 0.14, 1] }}
      style={{
        position: "absolute",
        left: flyFrom.x - flyCard.w/2, top: flyFrom.y - flyCard.h/2,
        width: flyCard.w, height: flyCard.h,
        borderRadius: Math.round(flyCard.w*0.1), overflow: "hidden",
        border: "2.5px solid rgba(255,255,255,0.85)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1.5px ${worker.color}`,
        zIndex: 65, pointerEvents: "none",
      }}
    >
      <img src={worker.capturedPhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <MarkupSVG workerName={worker.name} color={worker.color} sW={flyCard.w} sH={flyCard.h} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BROWSER
───────────────────────────────────────────────────────────────── */
function HeroBrowser({ cfg, phase }: { cfg: LayoutCfg; phase: number }) {
  const { app } = cfg;
  const photoCount =
    3 +
    (phase >= 4  && phase < 14 ? 1 : 0) +
    (phase >= 8  && phase < 14 ? 1 : 0) +
    (phase >= 12 && phase < 14 ? 1 : 0);
  const justLanded = phase === 4 ? 3 : phase === 8 ? 4 : phase === 12 ? 5 : -1;
  const br         = Math.round(app.w * 0.012);

  return (
    <div style={{
      position: "absolute", left: app.x, top: app.y, width: app.w, height: app.h,
      borderRadius: br, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
    }}>
      {app.showChrome && (
        <div style={{
          height: app.chromeH, background: "#1a1a1e",
          display: "flex", alignItems: "center",
          padding: `0 ${Math.round(app.chromeH*0.44)}px`, gap: Math.round(app.chromeH*0.4),
          borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
        }}>
          {["#FF5F57","#FFBD2E","#28C840"].map(c => (
            <div key={c} style={{ width: Math.round(app.chromeH*0.3), height: Math.round(app.chromeH*0.3), borderRadius: "50%", background: c }} />
          ))}
          <div style={{ flex: 1, height: Math.round(app.chromeH*0.56), borderRadius: 4, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: Math.round(app.chromeH*0.3), color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>jobpics.co.uk/kings-cross-quarter</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", height: app.showChrome ? `calc(100% - ${app.chromeH}px)` : "100%", background: "#fff" }}>
        {app.showChrome && app.sidebarW > 0 && (
          <div style={{
            width: app.sidebarW, background: "#F8FAFC",
            display: "flex", flexDirection: "column", alignItems: "center",
            paddingTop: Math.round(app.sidebarW*0.3), gap: Math.round(app.sidebarW*0.2),
            flexShrink: 0, borderRight: "1px solid #E8EDF3",
          }}>
            {[{l:"KCQ",a:true},{l:"PH2",a:false},{l:"RW",a:false}].map(({l,a}) => (
              <div key={l} style={{ width: Math.round(app.sidebarW*0.6), height: Math.round(app.sidebarW*0.6), borderRadius: Math.round(app.sidebarW*0.15), background: a?"#3478F6":"rgba(52,120,246,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize: Math.round(app.sidebarW*0.15), fontWeight: 800, color: a?"#fff":"#1D3D8A" }}>{l}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", background: "#fff" }}>
          <div style={{
            height: Math.round(app.headerH * 1.15),
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: `0 ${Math.round(app.headerH * 0.5)}px`,
            flexShrink: 0, borderBottom: "1px solid #E8EDF3", background: "#fff",
          }}>
            <span style={{ fontSize: Math.round(app.headerH * 0.38), fontWeight: 700, color: "#0E1F40", whiteSpace: "nowrap" }}>
              Kings Cross
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: Math.round(app.headerH * 0.36), flexShrink: 0 }}>
              <div style={{ display: "flex" }}>
                {WORKERS.map((w, i) => {
                  const synced = phase >= w.gridPhase && phase < 14;
                  return (
                    <motion.div key={w.name}
                      animate={{ background: synced ? w.color : "#CBD5E1" }}
                      transition={{ duration: 0.32 }}
                      style={{
                        width:  Math.round(app.headerH * 0.82),
                        height: Math.round(app.headerH * 0.82),
                        borderRadius: "50%",
                        border: `${Math.max(2, Math.round(app.headerH * 0.09))}px solid #fff`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginLeft: i === 0 ? 0 : -Math.round(app.headerH * 0.24),
                        zIndex: 3 - i, position: "relative",
                      }}
                    >
                      <span style={{ fontSize: Math.round(app.headerH * 0.31), fontWeight: 800, color: "#fff", lineHeight: 1 }}>{w.initial}</span>
                    </motion.div>
                  );
                })}
              </div>
              <motion.span key={photoCount}
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                style={{ fontSize: Math.round(app.headerH * 0.36), fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}
              >
                {photoCount} photo{photoCount !== 1 ? "s" : ""}
              </motion.span>
            </div>
          </div>

          <div style={{
            padding: `${Math.round(app.headerH * 0.32)}px ${Math.round(app.headerH * 0.5)}px ${Math.round(app.headerH * 0.12)}px`,
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: Math.round(app.headerH * 0.27),
              fontWeight: 600,
              color: "#94A3B8",
              textTransform: "uppercase" as const,
              letterSpacing: "0.07em",
            }}>Today</span>
          </div>

          <div style={{
            flex: 1, padding: Math.round(app.headerH*0.3),
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: Math.round(app.headerH*0.16), alignContent: "start",
            background: "#F8FAFC", overflowY: "hidden",
          }}>
            {GRID_ALL.map((src, i) => {
              const wi = i - 3;
              const w  = wi >= 0 ? WORKERS[wi] : null;
              return (
                <div key={i} style={{ borderRadius: Math.round(app.headerH*0.2), overflow: "hidden", aspectRatio: "4/3", position: "relative", background: "#E8EDF3" }}>
                  <AnimatePresence>
                    {i < photoCount && (
                      <motion.div key={`p-${i}`}
                        initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ position: "absolute", inset: 0 }}
                      >
                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {w && <MarkupSVG workerName={w.name} color={w.color} sW={220} sH={165} />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {i === justLanded && (
                    <motion.div key={`hl-${i}`}
                      initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.72, delay: 0.07 }}
                      style={{ position: "absolute", inset: 0, border: `${Math.max(2, Math.round(app.headerH*0.08))}px solid #3478F6`, borderRadius: Math.round(app.headerH*0.2), pointerEvents: "none", zIndex: 5 }}
                    />
                  )}
                  {w && i < photoCount && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.22, type: "spring", stiffness: 440, damping: 20 }}
                        style={{
                          position: "absolute", bottom: Math.round(app.headerH*0.12), left: Math.round(app.headerH*0.12),
                          width: Math.round(app.headerH*0.5), height: Math.round(app.headerH*0.5),
                          borderRadius: "50%", background: w.color,
                          border: `${Math.max(1.5, Math.round(app.headerH*0.06))}px solid #fff`,
                          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
                        }}
                      >
                        <span style={{ fontSize: Math.round(app.headerH*0.17), fontWeight: 800, color: "#fff", lineHeight: 1 }}>{w.initial}</span>
                      </motion.div>
                      <GridMetaPill worker={w} headerH={app.headerH} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CANVAS
───────────────────────────────────────────────────────────────── */
export function HeroAnimationV2Canvas({ size }: { size: "desktop" | "tablet" | "mobile" }) {
  const cfg   = CFGS[size];
  const phase = useCycle(PHASE_MS);
  const { unit } = cfg;
  const shutterActive = WORKERS.some(w => phase === w.shutterPhase);

  const doneWorkerIdx =
    phase >= 5 && phase <= 8  ? 0 :
    phase >= 9 && phase <= 12 ? 1 :
    -1;
  const doneWorker = doneWorkerIdx >= 0 ? WORKERS[doneWorkerIdx] : null;
  const donePos    = unit.done;

  return (
    <div style={{ position: "relative", width: cfg.canvas.w, height: cfg.canvas.h, background: "#050D1F", borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }} aria-hidden>
        <defs><pattern id={`dp2-${size}`} x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.1" fill="white" /></pattern></defs>
        <rect width="100%" height="100%" fill={`url(#dp2-${size})`} />
      </svg>

      <AnimatePresence>
        {doneWorker && donePos && (
          <DonePhone
            key={`done-${doneWorker.name}`}
            worker={doneWorker}
            w={donePos.w} h={donePos.h}
            left={donePos.left} top={donePos.top}
          />
        )}
      </AnimatePresence>

      {WORKERS.map(w => <WorkerUnit key={w.name} worker={w} unit={unit} phase={phase} />)}
      <ShutterRipple cx={unit.flyFromX} cy={unit.flyFromY} active={shutterActive} rScale={unit.rScale} />
      <HeroBrowser cfg={cfg} phase={phase} />
      {WORKERS.map((w, i) => (
        <FlyingPhoto key={w.name} worker={w}
          flyFrom={{ x: unit.flyFromX, y: unit.flyFromY }}
          flyTo={cfg.flyTos[i]} flyCard={cfg.flyCard} phase={phase}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
type SizeKey = "desktop" | "tablet" | "mobile";
const SIZE_TABS: { key: SizeKey; label: string; dims: string }[] = [
  { key: "desktop", label: "Desktop", dims: "960 × 600" },
  { key: "tablet",  label: "Tablet",  dims: "770 × 480" },
  { key: "mobile",  label: "Mobile",  dims: "350 × 220" },
];

export function HeroAnimationV2({ onBack }: { onBack: () => void }) {
  const [size, setSize] = useState<SizeKey>("desktop");
  return (
    <div style={{ minHeight: "100vh", background: "#030B18", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "7px 14px", cursor: "pointer" }}>
          <ArrowLeft size={13} color="rgba(255,255,255,0.6)" />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Back</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, background: "#3478F6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Camera size={13} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Hero Animation V2</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Workers on site · capture → dashboard</div>
          </div>
        </div>
        <div style={{ width: 100 }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "28px 0 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 2, padding: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 99 }}>
          {SIZE_TABS.map(({ key, label, dims }) => {
            const active = size === key;
            return (
              <button key={key} onClick={() => setSize(key)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", background: active ? "#3478F6" : "transparent", border: "none", borderRadius: 99, cursor: "pointer" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: active ? "#fff" : "rgba(255,255,255,0.45)" }}>{label}</span>
                <span style={{ fontSize: 10, color: active ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.22)" }}>{dims}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "0 24px 40px", overflowX: "auto" }}>
        <HeroAnimationV2Canvas size={size} />
      </div>
    </div>
  );
}