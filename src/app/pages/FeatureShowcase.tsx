import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Camera, PencilLine, Share2, Users, Search,
  Check, MapPin, Bell, Zap, ChevronRight, FileText, Link2,
  Upload, Clock, Filter,
} from "lucide-react";

/* ── Photos ─────────────────────────────────────────────────────── */
const P_ROOFING =
  "https://images.unsplash.com/photo-1738464329211-c86c6164862e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400";
const P_SCAFFOLD =
  "https://images.unsplash.com/photo-1768154333269-dfc6c98e1ddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400";
const P_FOUNDATION =
  "https://images.unsplash.com/photo-1659427921734-d4590f1e099f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400";
const P_ROOF_TILES =
  "https://images.unsplash.com/photo-1687274391166-d42f57232abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400";
const P_INTERIOR =
  "https://images.unsplash.com/photo-1768321914136-8329ceafb160?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400";

/* ── Hooks ───────────────────────────────────────────────────────── */
function useCycle(durations: number[]): number {
  const [phase, setPhase] = useState(0);
  const ref = useRef(durations);
  ref.current = durations;
  useEffect(() => {
    const id = setTimeout(
      () => setPhase((p) => (p + 1) % ref.current.length),
      ref.current[phase] ?? 1000,
    );
    return () => clearTimeout(id);
  }, [phase]);
  return phase;
}

function useWindowWidth(): number {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return width;
}

/* ── ShowcasePhone — scales proportionally from 280×600 reference ── */
function ShowcasePhone({
  children,
  w = 280,
  h = 600,
}: {
  children: React.ReactNode;
  w?: number;
  h?: number;
}) {
  const r = w / 280; // scale ratio
  const fr = Math.round(46 * r);   // frame border-radius
  const sr = Math.round(43 * r);   // screen border-radius
  const diW = Math.round(88 * r);  // dynamic island width
  const diH = Math.round(27 * r);  // dynamic island height
  const diTop = Math.round(10 * r);
  const inset = Math.max(2, Math.round(3 * r));
  const sbH = Math.round(42 * (h / 600)); // status bar height

  // Button positions (proportional to height)
  const btnW = Math.max(2, Math.round(3 * r));
  const muteTop = Math.round(h * 0.18);
  const muteH = Math.round(h * 0.037);
  const volTop = Math.round(h * 0.247);
  const volH = Math.round(h * 0.083);
  const vol2Top = Math.round(h * 0.35);
  const powTop = Math.round(h * 0.258);
  const powH = Math.round(h * 0.11);

  const homeW = Math.round(80 * r);
  const homeFontSize = Math.round(10 * r);

  return (
    <div className="relative flex-shrink-0" style={{ width: w, height: h }}>
      {/* Frame */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: fr,
          background: "#1a1a1e",
          boxShadow:
            "0 32px 72px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      />

      {/* Volume buttons */}
      <div className="absolute rounded-l-sm" style={{ left: -btnW + 1, top: muteTop, width: btnW, height: muteH, background: "#1e2a3a" }} />
      <div className="absolute rounded-l-sm" style={{ left: -btnW + 1, top: volTop, width: btnW, height: volH, background: "#1e2a3a" }} />
      <div className="absolute rounded-l-sm" style={{ left: -btnW + 1, top: vol2Top, width: btnW, height: volH, background: "#1e2a3a" }} />
      {/* Power button */}
      <div className="absolute rounded-r-sm" style={{ right: -btnW + 1, top: powTop, width: btnW, height: powH, background: "#1e2a3a" }} />

      {/* Screen */}
      <div
        className="absolute overflow-hidden"
        style={{ inset, borderRadius: sr, background: "#000" }}
      >
        {/* Dynamic island */}
        <div
          className="absolute rounded-full z-50 pointer-events-none"
          style={{
            top: diTop, left: "50%", transform: "translateX(-50%)",
            width: diW, height: diH, background: "#000",
          }}
        />

        {/* Status bar — centred alongside the Dynamic Island, not below it */}
        <div
          className="absolute z-40 pointer-events-none flex items-center justify-between"
          style={{ top: diTop, left: 0, right: 0, height: diH, paddingLeft: Math.round(20 * r), paddingRight: Math.round(20 * r) }}
        >
          <span style={{ fontSize: homeFontSize, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width={Math.round(14 * r)} height={Math.round(10 * r)} viewBox="0 0 14 10" fill="none">
              <rect x="0" y="6" width="2.5" height="4" rx="0.5" fill="rgba(255,255,255,0.7)" />
              <rect x="3.5" y="4" width="2.5" height="6" rx="0.5" fill="rgba(255,255,255,0.7)" />
              <rect x="7" y="2" width="2.5" height="8" rx="0.5" fill="rgba(255,255,255,0.7)" />
              <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="rgba(255,255,255,0.7)" />
            </svg>
            <svg width={Math.round(18 * r)} height={Math.round(10 * r)} viewBox="0 0 18 10" fill="none">
              <rect x="0.5" y="0.5" width="15" height="9" rx="2" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <rect x="15.5" y="3.5" width="2" height="3" rx="0.5" fill="rgba(255,255,255,0.5)" />
              <rect x="2" y="2" width="10" height="6" rx="1" fill="rgba(255,255,255,0.75)" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-0" style={{ paddingTop: sbH }}>
          {children}
        </div>

        {/* Home indicator */}
        <div
          className="absolute pointer-events-none rounded-full z-50"
          style={{
            bottom: Math.round(8 * r), left: "50%", transform: "translateX(-50%)",
            width: homeW, height: Math.round(4 * r),
            background: "rgba(255,255,255,0.25)",
          }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ANIMATION COMPONENTS (all use w-full h-full, scale automatically)
════════════════════════════════════════════════════════════════ */

/* ── 1. Capture ──────────────────────────────────────────────────── */
function CaptureAnim() {
  const phase = useCycle([1400, 180, 120, 700, 900, 180, 120, 700, 1600]);
  const photos2 = phase >= 7 ? 2 : phase >= 3 ? 1 : 0;
  const shutterPressed = phase === 1 || phase === 5;
  const flash = phase === 2 || phase === 6;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#0a0a0a" }}>
      <img src={P_ROOFING} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.85 }} />

      {/* Grid overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
        <line x1="33.3%" y1="0" x2="33.3%" y2="100%" stroke="white" strokeWidth="0.8" />
        <line x1="66.6%" y1="0" x2="66.6%" y2="100%" stroke="white" strokeWidth="0.8" />
        <line x1="0" y1="33.3%" x2="100%" y2="33.3%" stroke="white" strokeWidth="0.8" />
        <line x1="0" y1="66.6%" x2="100%" y2="66.6%" stroke="white" strokeWidth="0.8" />
      </svg>

      {/* Focus square */}
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{ top: "28%", left: "50%", transform: "translate(-50%, 0)", width: 72, height: 72 }}
      >
        {([{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }] as React.CSSProperties[]).map((pos, i) => (
          <div key={i} className="absolute" style={{
            ...pos, width: 14, height: 14,
            borderTop: i < 2 ? "1.5px solid #F97316" : undefined,
            borderBottom: i >= 2 ? "1.5px solid #F97316" : undefined,
            borderLeft: i % 2 === 0 ? "1.5px solid #F97316" : undefined,
            borderRight: i % 2 === 1 ? "1.5px solid #F97316" : undefined,
          }} />
        ))}
      </motion.div>

      <AnimatePresence>
        {flash && (
          <motion.div key="flash" initial={{ opacity: 0 }} animate={{ opacity: 0.95 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }} className="absolute inset-0" style={{ background: "#fff", zIndex: 20 }} />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between z-10" style={{ padding: "8px 14px" }}>
        <div className="flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: "rgba(0,0,0,0.45)" }}>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>✕</span>
        </div>
        <div className="rounded-full px-2.5 py-1 flex items-center gap-1" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#0D9488" }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>Kings Cross Quarter</span>
        </div>
        <div className="flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: "rgba(0,0,0,0.45)" }}>
          <Zap size={12} color="#F97316" fill="#F97316" />
        </div>
      </div>

      {/* GPS chip */}
      <div className="absolute flex items-center gap-1 rounded-full px-2 py-0.5 z-10"
        style={{ bottom: 104, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.5)" }}>
        <MapPin size={8} color="#3478F6" />
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap" }}>51.5308° N, 0.1234° W</span>
      </div>

      {/* Bottom tray + shutter */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between z-10"
        style={{ padding: "10px 20px 28px", background: "rgba(0,0,0,0.55)" }}>
        <div className="flex items-center gap-1" style={{ width: 56 }}>
          {photos2 >= 1 && (
            <motion.div key="t1" initial={{ opacity: 0, x: 30, scale: 0.6 }} animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="overflow-hidden rounded-md" style={{ width: 26, height: 26, border: "1.5px solid #fff", flexShrink: 0 }}>
              <img src={P_ROOFING} alt="" className="w-full h-full object-cover" />
            </motion.div>
          )}
          {photos2 >= 2 && (
            <motion.div key="t2" initial={{ opacity: 0, x: 30, scale: 0.6 }} animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="overflow-hidden rounded-md" style={{ width: 26, height: 26, border: "1.5px solid #fff", flexShrink: 0 }}>
              <img src={P_ROOFING} alt="" className="w-full h-full object-cover" />
            </motion.div>
          )}
        </div>
        <motion.div animate={{ scale: shutterPressed ? 0.88 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="flex items-center justify-center rounded-full" style={{ width: 60, height: 60, background: "#fff", border: "3px solid rgba(255,255,255,0.35)" }}>
          <div className="rounded-full" style={{ width: 50, height: 50, background: "#fff", border: "2px solid rgba(0,0,0,0.08)" }} />
        </motion.div>
        <div className="flex flex-col items-center" style={{ width: 56 }}>
          <AnimatePresence mode="wait">
            <motion.span key={photos2} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }} style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>
              {photos2 > 0 ? `${photos2} photo${photos2 > 1 ? "s" : ""}` : ""}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── 2. Mark-up ──────────────────────────────────────────────────── */
function MarkupAnim() {
  const phase = useCycle([600, 400, 1800, 500, 900, 2000]);
  const arrowVisible = phase >= 2;
  const labelVisible = phase >= 3;
  const circleVisible = phase >= 4;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#fff" }}>
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between z-20"
        style={{ background: "#0E1F40", padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <ArrowLeft size={14} color="rgba(255,255,255,0.7)" />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Mark up</span>
        </div>
        <div className="rounded-full px-3 flex items-center justify-center" style={{ height: 24, background: "#3478F6" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>Done</span>
        </div>
      </div>

      <div className="absolute left-0 right-0 overflow-hidden" style={{ top: 40, height: 320 }}>
        <img src={P_SCAFFOLD} alt="" className="w-full h-full object-cover" />
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
          {arrowVisible && (
            <motion.path d="M 80 80 L 160 180" stroke="#FA3E3E" strokeWidth="2.5" strokeLinecap="round" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "easeOut" }} />
          )}
          {arrowVisible && (
            <motion.path d="M 155 165 L 160 180 L 147 175" stroke="#FA3E3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.8, ease: "easeOut" }} />
          )}
          {circleVisible && (
            <motion.circle cx="200" cy="110" r="28" stroke="#F97316" strokeWidth="2.5" fill="none"
              strokeDasharray="176" initial={{ strokeDashoffset: 176 }} animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }} />
          )}
        </svg>
        <AnimatePresence>
          {labelVisible && (
            <motion.div key="lbl" initial={{ opacity: 0, scale: 0.7, x: -10 }} animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="absolute flex items-center gap-1 rounded-full px-2 py-0.5"
              style={{ bottom: 60, left: 155, background: "#FA3E3E", zIndex: 15 }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>Crack in render</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {phase >= 1 && (
          <motion.div key="toolbar" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="absolute left-0 right-0 z-20" style={{ top: 362, background: "#fff", borderTop: "1px solid #F3F4F6" }}>
            <div className="flex items-center justify-center gap-5 py-3">
              {[
                { icon: PencilLine, label: "Pen", active: false },
                { icon: () => <svg width="12" height="12" viewBox="0 0 12 12"><line x1="2" y1="10" x2="10" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M8 2 L10 2 L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>, label: "Arrow", active: true },
                { icon: () => <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.8" fill="none" /></svg>, label: "Circle", active: false },
                { icon: () => <span style={{ fontSize: 11, fontWeight: 700 }}>T</span>, label: "Text", active: false },
              ].map(({ icon: Icon, label, active }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center rounded-xl"
                    style={{ width: 34, height: 34, background: active ? "#EEF3FF" : "#F9FAFB", border: active ? "1.5px solid #C7D7FD" : "1.5px solid #F0F0F0", color: active ? "#3478F6" : "#9CA3AF" }}>
                    <Icon />
                  </div>
                  <span style={{ fontSize: 7, color: active ? "#3478F6" : "#9CA3AF", fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 pb-3">
              {["#FA3E3E", "#F97316", "#3478F6", "#0D9488", "#0E1F40"].map((c, i) => (
                <div key={c} className="rounded-full" style={{ width: i === 0 ? 20 : 16, height: i === 0 ? 20 : 16, background: c, border: i === 0 ? "2px solid #1D3D8A" : "none", flexShrink: 0 }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-0 right-0 z-20 px-4" style={{ bottom: 28 }}>
        <div className="flex items-center justify-center rounded-full" style={{ height: 36, background: "#3478F6" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>Save mark-up</span>
        </div>
      </div>
    </div>
  );
}

/* ── 3. Share ────────────────────────────────────────────────────── */
function ShareAnim() {
  const phase = useCycle([1200, 250, 800, 2200, 900]);
  const sheetOpen = phase >= 2;
  const qrVisible = phase >= 3;
  const btnPressed = phase === 1;
  const PHOTOS = [P_ROOFING, P_SCAFFOLD, P_FOUNDATION, P_ROOF_TILES, P_INTERIOR, P_ROOFING];

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#F4F7FD" }}>
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between"
        style={{ background: "#0E1F40", padding: "8px 14px" }}>
        <div className="flex items-center gap-2">
          <ArrowLeft size={14} color="rgba(255,255,255,0.6)" />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Kings Cross Quarter</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Barratt Homes · 16 photos</div>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-full"
          style={{ width: 26, height: 26, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <Share2 size={11} color="#fff" />
        </div>
      </div>

      <div className="absolute left-0 right-0 grid gap-0.5"
        style={{ top: 40, gridTemplateColumns: "1fr 1fr 1fr", zIndex: 1 }}>
        {PHOTOS.map((src, i) => (
          <div key={i} className="overflow-hidden" style={{ aspectRatio: "1", opacity: 0.9 }}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <motion.div animate={{ scale: btnPressed ? 0.94 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="absolute left-0 right-0 z-10 px-4" style={{ bottom: 40 }}>
        <div className="flex items-center justify-center gap-2 rounded-full" style={{ height: 36, background: "#3478F6" }}>
          <Share2 size={12} color="#fff" />
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>Share project</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {sheetOpen && (
          <motion.div key="sheet" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="absolute left-0 right-0 bottom-0 z-20"
            style={{ background: "#fff", borderRadius: "16px 16px 0 0", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)" }}>
            <div className="flex justify-center pt-2 pb-2">
              <div className="w-8 h-1 rounded-full" style={{ background: "#E5E7EB" }} />
            </div>
            <div className="px-4 pb-3">
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0E1F40" }}>Share project</p>
              <p style={{ fontSize: 9, color: "#9CA3AF", marginTop: 1 }}>Kings Cross Quarter · 16 photos</p>
            </div>
            {[{ icon: "💬", label: "WhatsApp", sub: "Send to contacts" }, { icon: "✉️", label: "Email", sub: "Compose message" }].map(({ icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-2.5" style={{ borderTop: "1px solid #F3F4F6" }}>
                <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 32, height: 32, background: "#F3F4F6" }}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#111827" }}>{label}</p>
                  <p style={{ fontSize: 8, color: "#9CA3AF" }}>{sub}</p>
                </div>
                <ChevronRight size={11} color="#D1D5DB" />
              </div>
            ))}
            <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderTop: "1px solid #F3F4F6" }}>
              <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: 32, height: 32, background: "#FFF3F0", border: "1px solid #FED7CC" }}>
                <FileText size={14} color="#FA3E3E" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 10, fontWeight: 600, color: "#111827" }}>PDF photo report</p>
                <p style={{ fontSize: 8, color: "#9CA3AF" }}>Generate & share</p>
              </div>
              <ChevronRight size={11} color="#D1D5DB" />
            </div>
            <div className="mx-4 my-3 p-3 rounded-2xl flex items-center gap-3" style={{ background: "#EEF3FF", border: "1.5px solid #C7D7FD" }}>
              <AnimatePresence>
                {qrVisible && (
                  <motion.div key="qr" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 44, height: 44, background: "#fff", padding: 4 }}>
                    <svg width="36" height="36" viewBox="0 0 36 36">
                      <rect x="0" y="0" width="14" height="14" rx="2" fill="#0E1F40" />
                      <rect x="2" y="2" width="10" height="10" rx="1" fill="#fff" />
                      <rect x="4" y="4" width="6" height="6" rx="0.5" fill="#0E1F40" />
                      <rect x="22" y="0" width="14" height="14" rx="2" fill="#0E1F40" />
                      <rect x="24" y="2" width="10" height="10" rx="1" fill="#fff" />
                      <rect x="26" y="4" width="6" height="6" rx="0.5" fill="#0E1F40" />
                      <rect x="0" y="22" width="14" height="14" rx="2" fill="#0E1F40" />
                      <rect x="2" y="24" width="10" height="10" rx="1" fill="#fff" />
                      <rect x="4" y="26" width="6" height="6" rx="0.5" fill="#0E1F40" />
                      {[2, 5, 8, 14, 17, 20, 23, 26, 29, 32].map((x, i) => (
                        <rect key={i} x={x} y={17} width="2" height="2" fill="#0E1F40" opacity={i % 3 === 0 ? 0.3 : 1} />
                      ))}
                      {[17, 20, 23, 26, 29, 32].map((y, i) => (
                        <rect key={i} x={17} y={y} width="2" height="2" fill="#0E1F40" opacity={i % 2 === 0 ? 1 : 0.3} />
                      ))}
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 9, fontWeight: 700, color: "#1D3D8A" }}>Share via QR code</p>
                <p style={{ fontSize: 8, color: "#4B6CB7", marginTop: 1 }}>jobpics.uk/kc-quarter</p>
              </div>
              <Link2 size={12} color="#3478F6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 4. Teams ────────────────────────────────────────────────────── */
function TeamsAnim() {
  const phase = useCycle([1200, 900, 700, 2200, 1000]);
  const TEAM = [
    { initials: "TB", color: "#3478F6" },
    { initials: "SE", color: "#0D9488" },
    { initials: "JW", color: "#F97316" },
  ];
  const FEED = [
    { src: P_SCAFFOLD, author: "Tom Barrett", count: "4 photos", time: "2 min ago", initials: "TB", color: "#3478F6" },
    { src: P_FOUNDATION, author: "James Wright", count: "2 photos", time: "18 min ago", initials: "JW", color: "#F97316" },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#F4F7FD" }}>
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div key="notif" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="absolute left-3 right-3 z-50 flex items-center gap-2.5 rounded-2xl px-3 py-2.5"
            style={{ top: 8, background: "#0E1F40", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 28, height: 28, background: "#3478F6" }}>
              <Bell size={12} color="#fff" />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>Sarah Evans uploaded 3 photos</p>
              <p style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Kings Cross Quarter · just now</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between"
        style={{ background: "#0E1F40", padding: "8px 14px" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Kings Cross Quarter</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Live · Phase 2</div>
        </div>
        <div className="flex items-center">
          {TEAM.map((m, i) => (
            <div key={m.initials} className="flex items-center justify-center rounded-full"
              style={{ width: 20, height: 20, background: m.color, border: "1.5px solid #0E1F40", marginLeft: i > 0 ? -6 : 0, zIndex: 3 - i }}>
              <span style={{ fontSize: 7, fontWeight: 800, color: "#fff" }}>{m.initials}</span>
            </div>
          ))}
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.55)", marginLeft: 6 }}>3</span>
        </div>
      </div>

      <div className="absolute left-0 right-0 flex items-center justify-between px-3"
        style={{ top: 42, paddingTop: 10, paddingBottom: 6 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "#6B7280" }}>Recent activity</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FA3E3E" }} />
          <span style={{ fontSize: 8, color: "#FA3E3E", fontWeight: 600 }}>Live</span>
        </div>
      </div>

      <div className="absolute left-0 right-0 flex flex-col gap-2 px-3" style={{ top: 84 }}>
        <AnimatePresence>
          {phase === 1 && (
            <motion.div key="uploading" initial={{ opacity: 0, y: -20, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", stiffness: 380, damping: 30 }} className="overflow-hidden">
              <div className="flex items-center gap-2.5 rounded-2xl p-2.5" style={{ background: "#EEF3FF", border: "1.5px solid #C7D7FD" }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 28, height: 28, background: "#3478F6" }}>
                  <Upload size={12} color="#fff" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 9, fontWeight: 600, color: "#1D3D8A" }}>Uploading 3 photos…</p>
                  <div className="mt-1 rounded-full overflow-hidden" style={{ height: 3, background: "#C7D7FD" }}>
                    <motion.div className="h-full rounded-full" style={{ background: "#3478F6" }}
                      animate={{ width: ["0%", "75%"] }} transition={{ duration: 0.85, ease: "easeOut" }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 3 && (
            <motion.div key="newphoto" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}>
              <div className="flex items-start gap-2.5 rounded-2xl p-2.5" style={{ background: "#fff", border: "1.5px solid #E5E7EB" }}>
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 28, height: 28, background: "#0D9488" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>SE</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p style={{ fontSize: 9, fontWeight: 600, color: "#111827" }}>Sarah Evans</p>
                    <div className="flex items-center gap-1">
                      <Clock size={7} color="#9CA3AF" />
                      <span style={{ fontSize: 7, color: "#9CA3AF" }}>just now</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[P_INTERIOR, P_ROOF_TILES, P_FOUNDATION].map((src, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.12, type: "spring", stiffness: 400 }}
                        className="overflow-hidden rounded-lg flex-shrink-0" style={{ width: 42, height: 42 }}>
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {FEED.map((item) => (
          <div key={item.author} className="flex items-start gap-2.5 rounded-2xl p-2.5"
            style={{ background: "#fff", border: "1.5px solid #E5E7EB" }}>
            <div className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: 28, height: 28, background: item.color }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{item.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p style={{ fontSize: 9, fontWeight: 600, color: "#111827" }}>{item.author}</p>
                <div className="flex items-center gap-1">
                  <Clock size={7} color="#9CA3AF" />
                  <span style={{ fontSize: 7, color: "#9CA3AF" }}>{item.time}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="overflow-hidden rounded-lg flex-shrink-0" style={{ width: 42, height: 42 }}>
                  <img src={item.src} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 42, height: 42, background: "#F3F4F6" }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#9CA3AF" }}>{item.count}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 5. Retrieval ────────────────────────────────────────────────── */
function RetrievalAnim() {
  const phase = useCycle([800, 2400, 500, 2000, 600]);
  const [chars, setChars] = useState(0);
  const QUERY = "Roof level 2";

  useEffect(() => {
    if (phase === 1 && chars < QUERY.length) {
      const id = setTimeout(() => setChars((c) => c + 1), 170);
      return () => clearTimeout(id);
    }
    if (phase === 0 || phase === 4) setChars(0);
  }, [phase, chars]);

  const isFiltered = phase >= 2;
  const ALL = [P_ROOFING, P_SCAFFOLD, P_FOUNDATION, P_ROOF_TILES, P_INTERIOR, P_ROOFING, P_SCAFFOLD, P_FOUNDATION];
  const MATCH = [0, 3];

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#F4F7FD" }}>
      <div className="absolute top-0 left-0 right-0 z-10" style={{ background: "#0E1F40", padding: "8px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>All projects</div>
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>47 photos across 6 projects</div>
      </div>

      <div className="absolute left-0 right-0 z-10 px-3" style={{ top: 42, paddingTop: 10 }}>
        <div className="flex items-center gap-2 rounded-2xl px-3"
          style={{ height: 34, background: "#fff", border: `1.5px solid ${chars > 0 ? "#C7D7FD" : "#E5E7EB"}`, transition: "border-color 0.2s" }}>
          <Search size={12} color={chars > 0 ? "#3478F6" : "#9CA3AF"} />
          <span style={{ fontSize: 10, color: chars > 0 ? "#111827" : "#9CA3AF", flex: 1 }}>
            {chars > 0 ? QUERY.slice(0, chars) : "Search photos…"}
            {phase === 1 && chars < QUERY.length && (
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ marginLeft: 1, color: "#3478F6" }}>|</motion.span>
            )}
          </span>
          {chars > 0 && (
            <div className="flex items-center gap-1 rounded-full px-1.5" style={{ background: "#EEF3FF", height: 18 }}>
              <Filter size={7} color="#3478F6" />
              <span style={{ fontSize: 7, color: "#3478F6", fontWeight: 600 }}>Filter</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFiltered && (
          <motion.div key="count" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute left-3 right-3 z-10" style={{ top: 92 }}>
            <span style={{ fontSize: 9, color: "#6B7280" }}>
              <span style={{ fontWeight: 700, color: "#3478F6" }}>2 photos</span> matched "{QUERY}"
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-0 right-0" style={{ top: isFiltered ? 110 : 92, transition: "top 0.3s ease" }}>
        {isFiltered ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
            className="px-3 grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {MATCH.map((idx, i) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 400 }}
                className="overflow-hidden rounded-2xl" style={{ border: "2px solid #3478F6", boxShadow: "0 0 0 3px rgba(52,120,246,0.12)" }}>
                <div className="relative" style={{ aspectRatio: "1" }}>
                  <img src={ALL[idx]} alt="" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5" style={{ background: "rgba(14,31,64,0.82)" }}>
                    <p style={{ fontSize: 8, fontWeight: 600, color: "#fff" }}>Roof level 2</p>
                    <p style={{ fontSize: 7, color: "rgba(255,255,255,0.55)" }}>Kings Cross Quarter</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="grid gap-0.5" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            {ALL.map((src, i) => (
              <div key={i} className="overflow-hidden" style={{ aspectRatio: "1", opacity: 0.88 }}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Feature config ──────────────────────────────────────────────── */
const FEATURES = [
  {
    id: "capture", icon: Camera, label: "Capture",
    headline: "Point, tap, captured.",
    description: "Take geo-tagged, timestamped site photos in a single tap. Every shot lands straight into the right project — organised, searchable, done.",
    bullets: ["Automatic GPS & timestamp on every photo", "Works offline in basements and plant rooms", "Zero manual filing or uploading needed"],
    accentColor: "#3478F6", component: CaptureAnim,
  },
  {
    id: "markup", icon: PencilLine, label: "Mark up",
    headline: "Show exactly what you mean.",
    description: "Draw arrows, circle defects, drop labels — directly onto your photos. Eliminate the back-and-forth and get site issues resolved faster.",
    bullets: ["Pen, arrow and circle tools built in", "Annotations saved with the original photo", "Instantly visible to the whole team"],
    accentColor: "#FA3E3E", component: MarkupAnim,
  },
  {
    id: "share", icon: Share2, label: "Share easily",
    headline: "Every photo, one tap away.",
    description: "All your project photos in one organised place. Share via link, QR code or PDF photo report — with clients, subcontractors or the whole team.",
    bullets: ["One-tap PDF photo report generation", "QR codes for instant sharing on site", "Custom share links on the jobpics.uk domain"],
    accentColor: "#0D9488", component: ShareAnim,
  },
  {
    id: "teams", icon: Users, label: "Teams",
    headline: "Field and office, in sync.",
    description: "Photos taken on site appear in every team member's feed the moment they're captured. No end-of-day uploads, no missing context.",
    bullets: ["Real-time activity feed per project", "Instant push notifications to the whole team", "Field workers and site managers always aligned"],
    accentColor: "#F97316", component: TeamsAnim,
  },
  {
    id: "retrieval", icon: Search, label: "Easy retrieval",
    headline: "Find any photo in seconds.",
    description: "Search your entire project archive by location, date, label or keyword. No more hunting through camera rolls or email chains.",
    bullets: ["Search across all projects at once", "Filter by date, label or team member", "Every photo traceable back to its source"],
    accentColor: "#1D3D8A", component: RetrievalAnim,
  },
] as const;

/* ── Shared sub-components ───────────────────────────────────────── */

function NavDots({ active, total, accentColor, onSelect }: {
  active: number; total: number; accentColor: string; onSelect: (i: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onSelect(i)} style={{
          width: i === active ? 20 : 6, height: 6, borderRadius: 99,
          background: i === active ? accentColor : "rgba(255,255,255,0.18)",
          border: "none", cursor: "pointer", padding: 0,
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

function PrevNextArrows({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const btn: React.CSSProperties = {
    width: 34, height: 34, borderRadius: "50%",
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  };
  return (
    <>
      <button onClick={onPrev} style={btn}><ArrowLeft size={13} color="rgba(255,255,255,0.6)" /></button>
      <button onClick={onNext} style={btn}><ArrowLeft size={13} color="rgba(255,255,255,0.6)" style={{ transform: "rotate(180deg)" }} /></button>
    </>
  );
}

function AnimatedPhone({ active, w, h }: { active: number; w: number; h: number }) {
  const Anim = FEATURES[active].component;
  return (
    <ShowcasePhone w={w} h={h}>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }} className="absolute inset-0">
          <Anim />
        </motion.div>
      </AnimatePresence>
    </ShowcasePhone>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT — picks layout based on window width
════════════════════════════════════════════════════════════════ */
export function FeatureShowcase({ onBack }: { onBack: () => void }) {
  const windowWidth = useWindowWidth();
  const [active, setActive] = useState(0);

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  // mobile = < 640

  const feature = FEATURES[active];
  const prev = () => setActive((p) => (p - 1 + FEATURES.length) % FEATURES.length);
  const next = () => setActive((p) => (p + 1) % FEATURES.length);

  // Swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) diff > 0 ? next() : prev();
  };

  const BG: React.CSSProperties = { background: "#050D1F", minHeight: "100vh", fontFamily: "'Inter', sans-serif" };

  /* ─── MOBILE (<640px) ─────────────────────────────────────────── */
  if (!isDesktop && !isTablet) {
    const phoneW = Math.min(windowWidth - 40, 240);
    const phoneH = Math.round(phoneW * (600 / 280));

    return (
      <div style={{ ...BG, display: "flex", flexDirection: "column" }}
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

        {/* Header */}
        <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "6px 12px", cursor: "pointer" }}>
            <ArrowLeft size={12} color="rgba(255,255,255,0.6)" />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Back</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 24, height: 24, background: "#3478F6", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Camera size={12} color="#fff" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>JobPics</span>
          </div>
        </div>

        {/* Feature label */}
        <AnimatePresence mode="wait">
          <motion.div key={`ml-${active}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} style={{ padding: "16px 20px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", fontWeight: 600 }}>{String(active + 1).padStart(2, "0")} / 05</span>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 20, height: 20, background: feature.accentColor, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <feature.icon size={10} color="#fff" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{feature.label}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Phone */}
        <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 16px", flexShrink: 0 }}>
          <AnimatedPhone active={active} w={phoneW} h={phoneH} />
        </div>

        {/* Dot nav + arrows */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, paddingBottom: 18 }}>
          <PrevNextArrows onPrev={prev} onNext={next} />
          <NavDots active={active} total={FEATURES.length} accentColor={feature.accentColor} onSelect={setActive} />
        </div>

        {/* Headline + description */}
        <AnimatePresence mode="wait">
          <motion.div key={`md-${active}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }} style={{ padding: "0 20px 40px" }}>
            <div style={{ width: 24, height: 3, borderRadius: 99, background: feature.accentColor, marginBottom: 12 }} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 10 }}>{feature.headline}</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{feature.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  /* ─── TABLET (640–1023px) ─────────────────────────────────────── */
  if (isTablet) {
    const phoneW = 230;
    const phoneH = Math.round(phoneW * (600 / 280));

    return (
      <div style={{ ...BG, display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "7px 14px", cursor: "pointer" }}>
            <ArrowLeft size={13} color="rgba(255,255,255,0.6)" />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Back</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "#3478F6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Camera size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>JobPics</span>
          </div>
          <div style={{ width: 90 }} />
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "28px 24px 18px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.2 }}>See it in action</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>Five features that transform how your teams capture and share site photos.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 2, padding: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 99, overflowX: "auto" }}>
            {FEATURES.map((f, i) => {
              const isAct = active === i;
              return (
                <button key={f.id} onClick={() => setActive(i)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 13px",
                  background: isAct ? "#3478F6" : "transparent", border: "none", borderRadius: 99, cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  <f.icon size={12} color={isAct ? "#fff" : "rgba(255,255,255,0.4)"} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: isAct ? "#fff" : "rgba(255,255,255,0.45)" }}>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phone */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 24, flexShrink: 0 }}>
          <AnimatedPhone active={active} w={phoneW} h={phoneH} />
        </div>

        {/* Feature info below phone */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }} style={{ textAlign: "center", padding: "0 40px 40px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ width: 28, height: 3, borderRadius: 99, background: feature.accentColor }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", marginBottom: 10 }}>{feature.headline}</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 20px" }}>{feature.description}</p>
            {/* Bullets — 3 col on tablet */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {feature.bullets.map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 99, padding: "7px 14px" }}>
                  <Check size={10} color={feature.accentColor} strokeWidth={2.5} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
              <PrevNextArrows onPrev={prev} onNext={next} />
              <NavDots active={active} total={FEATURES.length} accentColor={feature.accentColor} onSelect={setActive} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  /* ─── DESKTOP (≥1024px) ───────────────────────────────────────── */
  return (
    <div style={{ ...BG, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "8px 16px", cursor: "pointer" }}>
          <ArrowLeft size={13} color="rgba(255,255,255,0.6)" />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Back</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, background: "#3478F6", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Camera size={15} color="#fff" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>JobPics</span>
        </div>
        <div style={{ width: 100 }} />
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "40px 24px 28px", flexShrink: 0 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(52,120,246,0.12)", border: "1px solid rgba(52,120,246,0.25)", borderRadius: 99, padding: "5px 14px", marginBottom: 16 }}>
          <Zap size={10} color="#3478F6" fill="#3478F6" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#3478F6", letterSpacing: "0.05em" }}>FEATURE SHOWCASE</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15 }}>See JobPics in action</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginTop: 10, lineHeight: 1.6 }}>
          Five core features that transform how site teams capture, share and retrieve job photos.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 36, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 99 }}>
          {FEATURES.map((f, i) => {
            const isAct = active === i;
            return (
              <button key={f.id} onClick={() => setActive(i)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "9px 18px",
                background: isAct ? "#3478F6" : "transparent", border: "none", borderRadius: 99, cursor: "pointer",
              }}>
                <f.icon size={13} color={isAct ? "#fff" : "rgba(255,255,255,0.4)"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: isAct ? "#fff" : "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "0 56px 56px", gap: 72, maxWidth: 1080, margin: "0 auto", width: "100%" }}>

        {/* Left: feature info */}
        <div style={{ flex: 1, maxWidth: 400 }}>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.24, ease: "easeOut" }}>
              {/* Counter */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, opacity: 0.45 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>{active + 1}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>
                  {String(active + 1).padStart(2, "0")} / 05
                </span>
              </div>

              {/* Icon */}
              <div style={{ width: 54, height: 54, background: feature.accentColor, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <feature.icon size={26} color="#fff" />
              </div>

              {/* Headline */}
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 14 }}>{feature.headline}</h2>

              {/* Accent line */}
              <div style={{ width: 36, height: 3, borderRadius: 99, background: feature.accentColor, marginBottom: 18 }} />

              {/* Description */}
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: 26 }}>{feature.description}</p>

              {/* Bullets */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {feature.bullets.map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${feature.accentColor}22`, border: `1px solid ${feature.accentColor}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Check size={9} color={feature.accentColor} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Nav */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <PrevNextArrows onPrev={prev} onNext={next} />
                <NavDots active={active} total={FEATURES.length} accentColor={feature.accentColor} onSelect={setActive} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: phone */}
        <div style={{ flexShrink: 0 }}>
          <AnimatedPhone active={active} w={280} h={600} />
        </div>
      </div>
    </div>
  );
}
