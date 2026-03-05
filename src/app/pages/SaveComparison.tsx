import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MapPin, ZapOff, Images, Upload, ChevronDown, ArrowUp } from "lucide-react";

const VIEWFINDER =
  "https://images.unsplash.com/photo-1748956628042-b73331e0b479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";

const PHOTO_POOL = [
  "https://images.unsplash.com/photo-1585118213816-1c57f4b0b1dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
  "https://images.unsplash.com/photo-1659427921734-d4590f1e099f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
  "https://images.unsplash.com/photo-1766791783611-b1c6a7ad86bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
  "https://images.unsplash.com/photo-1755265141513-ebd3af526cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
];

const W = 230; // panel width px
const H = 460; // panel height px
const PROJECT = "Kings Cross Quarter";

// ── Shared thumbnail stack (right of shutter — same in both, purely passive) ─

function ThumbStack({ count }: { count: number }) {
  const photos = PHOTO_POOL.slice(0, Math.min(count, 3));
  return (
    <div style={{ width: 40, height: 40, position: "relative", overflow: "visible", flexShrink: 0 }}>
      {count === 0 && (
        <div
          style={{
            position: "absolute", inset: 0, borderRadius: 10,
            border: "1.5px dashed rgba(255,255,255,0.2)",
          }}
        />
      )}
      {photos.map((url, i) => {
        const d = photos.length - 1 - i;
        return (
          <motion.div
            key={i}
            animate={{ x: -d * 3, y: -d * 3 }}
            style={{
              position: "absolute", top: 0, left: 0,
              width: 40, height: 40, borderRadius: 10, overflow: "hidden",
              zIndex: i + 1,
              outline: "1.5px solid rgba(255,255,255,0.22)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              opacity: 1 - d * 0.18,
            }}
          >
            <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
          </motion.div>
        );
      })}
      {count > 0 && (
        <div
          style={{
            position: "absolute", top: 1, right: 1, zIndex: 10,
            background: "rgba(0,0,0,0.75)", borderRadius: 999,
            minWidth: 14, height: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 3px",
          }}
        >
          <span style={{ color: "#fff", fontSize: 7, fontWeight: 700 }}>{count}</span>
        </div>
      )}
    </div>
  );
}

// ── Option A — Glass chip floats INSIDE the viewfinder image area ─────────────

function OptionA({ count, onSave }: { count: number; onSave: () => void }) {
  return (
    <div style={{ width: W, height: H, borderRadius: 28, overflow: "hidden", background: "#000", display: "flex", flexDirection: "column", position: "relative", userSelect: "none" }}>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px 4px", flexShrink: 0, zIndex: 2 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>9:41</span>
        <div style={{ width: 64, height: 12, borderRadius: 999, background: "#000" }} />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>●●●</span>
      </div>

      {/* Viewfinder — the chip lives in here */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        <img src={VIEWFINDER} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.72 }} alt="" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 45%, rgba(0,0,0,0.65) 100%)", pointerEvents: "none" }} />

        {/* Grid lines */}
        {[1/3, 2/3].map(p => (
          <div key={`v-${p}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${p*100}%`, width: 1, background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        ))}
        {[1/3, 2/3].map(p => (
          <div key={`h-${p}`} style={{ position: "absolute", left: 0, right: 0, top: `${p*100}%`, height: 1, background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        ))}

        {/* Focus brackets */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h], i) => (
            <div key={i} style={{
              position: "absolute", width: 12, height: 12, opacity: 0.45,
              [v]: "calc(50% - 20px)", [h]: "calc(50% - 20px)",
              borderTop: v === "top" ? "1.5px solid white" : "none",
              borderBottom: v === "bottom" ? "1.5px solid white" : "none",
              borderLeft: h === "left" ? "1.5px solid white" : "none",
              borderRight: h === "right" ? "1.5px solid white" : "none",
            }} />
          ))}
        </div>

        {/* Top bar — static, no save action here */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px 0" }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MapPin size={11} color="#4ade80" />
          </div>
          {/* Pill is passive — no transformation, just shows project */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", borderRadius: 999, padding: "4px 10px", border: "0.5px solid rgba(255,255,255,0.15)" }}>
            <MapPin size={8} color="#4ade80" />
            <span style={{ color: "#fff", fontSize: 9, fontWeight: 600, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{PROJECT}</span>
            <ChevronDown size={8} color="rgba(255,255,255,0.45)" />
          </div>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ZapOff size={11} color="rgba(255,255,255,0.65)" />
          </div>
        </div>

        {/* Zoom pill */}
        <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "2px 8px" }}>
          <span style={{ color: "#fff", fontSize: 9, fontWeight: 600 }}>1×</span>
        </div>

        {/* ━━━━ OPTION A SAVE ACTION: glass chip inside the viewfinder ━━━━ */}
        <AnimatePresence>
          {count > 0 && (
            <motion.button
              onClick={onSave}
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              whileTap={{ scale: 0.96 }}
              style={{
                position: "absolute",
                bottom: 38,
                left: 10, right: 10,
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(10,10,16,0.72)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "0.5px solid rgba(255,255,255,0.2)",
                borderRadius: 16,
                padding: "8px 10px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.5)",
                cursor: "pointer",
                zIndex: 5,
              }}
            >
              {/* Thumbnail row */}
              <div style={{ display: "flex", flexShrink: 0, position: "relative", width: PHOTO_POOL.slice(0, Math.min(count,3)).length * 14 + 6 }}>
                {PHOTO_POOL.slice(0, Math.min(count,3)).map((url, i) => (
                  <div key={i} style={{
                    position: "absolute", left: i * 14,
                    width: 22, height: 22, borderRadius: 6, overflow: "hidden",
                    zIndex: i + 1,
                    outline: "1.5px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 1px 5px rgba(0,0,0,0.5)",
                  }}>
                    <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
                <div style={{ color: "#fff", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {count} photo{count !== 1 ? "s" : ""} ready
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Kings Cross · tap to upload
                </div>
              </div>
              <div style={{ width: 26, height: 26, borderRadius: 999, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Upload size={11} color="#fff" strokeWidth={2.5} />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mode row */}
      <div style={{ background: "#000", display: "flex", alignItems: "center", justifyContent: "center", gap: 24, padding: "7px 0 5px" }}>
        <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>video</span>
        <span style={{ color: "#facc15", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>photo</span>
      </div>

      {/* Capture row */}
      <div style={{ background: "#000", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 20px 16px" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Images size={14} color="rgba(255,255,255,0.55)" />
        </div>
        {/* Shutter — purely decorative here, shooting is controlled externally */}
        <div style={{ position: "relative", width: 56, height: 56, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: "2.5px solid rgba(255,255,255,0.7)" }} />
          <div style={{ width: 46, height: 46, borderRadius: 999, background: "#fff" }} />
        </div>
        <ThumbStack count={count} />
      </div>
    </div>
  );
}

// ── Option B — Project pill at the TOP transforms ─────────────────────────────

function OptionB({ count, onSave }: { count: number; onSave: () => void }) {
  return (
    <div style={{ width: W, height: H, borderRadius: 28, overflow: "hidden", background: "#000", display: "flex", flexDirection: "column", position: "relative", userSelect: "none" }}>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px 4px", flexShrink: 0, zIndex: 2 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>9:41</span>
        <div style={{ width: 64, height: 12, borderRadius: 999, background: "#000" }} />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>●●●</span>
      </div>

      {/* Viewfinder */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        <img src={VIEWFINDER} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.72 }} alt="" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 45%, rgba(0,0,0,0.65) 100%)", pointerEvents: "none" }} />

        {/* Grid */}
        {[1/3, 2/3].map(p => (
          <div key={`v-${p}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${p*100}%`, width: 1, background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        ))}
        {[1/3, 2/3].map(p => (
          <div key={`h-${p}`} style={{ position: "absolute", left: 0, right: 0, top: `${p*100}%`, height: 1, background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        ))}

        {/* Focus brackets */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h], i) => (
            <div key={i} style={{
              position: "absolute", width: 12, height: 12, opacity: 0.45,
              [v]: "calc(50% - 20px)", [h]: "calc(50% - 20px)",
              borderTop: v === "top" ? "1.5px solid white" : "none",
              borderBottom: v === "bottom" ? "1.5px solid white" : "none",
              borderLeft: h === "left" ? "1.5px solid white" : "none",
              borderRight: h === "right" ? "1.5px solid white" : "none",
            }} />
          ))}
        </div>

        {/* Top bar — THE PILL IS THE SAVE ACTION */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px 0" }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MapPin size={11} color="#4ade80" />
          </div>

          {/* ━━━━ OPTION B SAVE ACTION: pill transforms ━━━━ */}
          <motion.button
            onClick={count > 0 ? onSave : undefined}
            whileTap={count > 0 ? { scale: 0.93 } : {}}
            animate={{
              background: count > 0 ? "rgba(5,150,105,0.35)" : "rgba(0,0,0,0.5)",
            }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: 999,
              padding: "5px 10px",
              border: count > 0 ? "0.5px solid rgba(52,211,153,0.55)" : "0.5px solid rgba(255,255,255,0.15)",
              cursor: count > 0 ? "pointer" : "default",
              position: "relative",
              boxShadow: count > 0 ? "0 0 0 0px rgba(52,211,153,0.4)" : "none",
              transition: "border 0.2s, box-shadow 0.2s",
            }}
          >
            <MapPin size={8} color={count > 0 ? "#6ee7b7" : "#4ade80"} />
            <span style={{
              fontSize: 9, fontWeight: 600,
              color: count > 0 ? "#a7f3d0" : "#fff",
              maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}>{PROJECT}</span>

            {/* Count + arrow slide in */}
            <AnimatePresence>
              {count > 0 && (
                <motion.div
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 2 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  style={{ display: "flex", alignItems: "center", gap: 3, overflow: "hidden", flexShrink: 0 }}
                >
                  <div style={{ width: 1, height: 12, background: "rgba(110,231,183,0.3)" }} />
                  <span style={{ color: "#6ee7b7", fontSize: 9, fontWeight: 700 }}>{count}</span>
                  <ArrowUp size={8} color="#6ee7b7" strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Breathing glow ring */}
            <AnimatePresence>
              {count > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: [0, 0.8, 0], scale: [0.97, 1.04, 0.97] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  style={{
                    position: "absolute", inset: -2, borderRadius: 999,
                    border: "1.5px solid rgba(52,211,153,0.65)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </AnimatePresence>
          </motion.button>

          <div style={{ width: 28, height: 28, borderRadius: 999, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ZapOff size={11} color="rgba(255,255,255,0.65)" />
          </div>
        </div>

        {/* Zoom pill */}
        <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "2px 8px" }}>
          <span style={{ color: "#fff", fontSize: 9, fontWeight: 600 }}>1×</span>
        </div>

        {/* No chip here — viewfinder is empty */}
      </div>

      {/* Mode row */}
      <div style={{ background: "#000", display: "flex", alignItems: "center", justifyContent: "center", gap: 24, padding: "7px 0 5px" }}>
        <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>video</span>
        <span style={{ color: "#facc15", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>photo</span>
      </div>

      {/* Capture row */}
      <div style={{ background: "#000", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 20px 16px" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Images size={14} color="rgba(255,255,255,0.55)" />
        </div>
        <div style={{ position: "relative", width: 56, height: 56, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: "2.5px solid rgba(255,255,255,0.7)" }} />
          <div style={{ width: 46, height: 46, borderRadius: 999, background: "#fff" }} />
        </div>
        <ThumbStack count={count} />
      </div>
    </div>
  );
}

// ── Callout arrow component ───────────────────────────────────────────────────

function Callout({ label, color, active }: { label: string; color: string; active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            position: "absolute", left: "50%", transform: "translateX(-50%)",
          }}
        >
          <div style={{
            background: color, borderRadius: 999, padding: "3px 10px",
            color: "#fff", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap",
            boxShadow: `0 2px 12px ${color}66`,
          }}>
            {label}
          </div>
          <div style={{ width: 1.5, height: 10, background: color, opacity: 0.6 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function SaveComparison({ onBack }: { onBack: () => void }) {
  // Shared count — one shoot button fires both so you see them side-by-side at the same state
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "32px 24px",
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, #141428 0%, #080810 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: 20, left: 20,
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 999, padding: "7px 14px",
          color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}
      >
        <ArrowLeft size={12} /> Back
      </button>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Save action — A vs B</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "6px 0 0" }}>
          Same photo count. One shared shoot button. Spot where each option puts the save action.
        </p>
      </div>

      {/* Both panels + annotations */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>

        {/* ─ Option A ─ */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {/* Label */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 999, padding: "4px 12px",
          }}>
            <div style={{ width: 16, height: 16, borderRadius: 999, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 8, fontWeight: 800 }}>A</span>
            </div>
            <span style={{ color: "rgba(147,197,253,1)", fontSize: 11, fontWeight: 600 }}>Chip inside the viewfinder</span>
          </div>

          {/* Phone + top callout (points at pill area — no action there) */}
          <div style={{ position: "relative" }}>
            {/* Top annotation: "pill unchanged" */}
            <div style={{
              position: "absolute", top: 48, left: "50%", transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap", zIndex: 20, pointerEvents: "none",
            }}>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 8 }}>pill unchanged</span>
            </div>

            {/* Bottom callout: "SAVE HERE" — points at the chip */}
            <div style={{ position: "absolute", zIndex: 20, pointerEvents: "none", bottom: 122, left: "50%", transform: "translateX(-50%)", width: "100%" }}>
              <Callout label="↑ SAVE ACTION HERE" color="#3b82f6" active={count > 0} />
            </div>

            <OptionA count={count} onSave={() => setCount(0)} />
          </div>

          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textAlign: "center", maxWidth: 210, lineHeight: 1.5 }}>
            A glass chip slides up <em>inside</em> the viewfinder image. Top bar and bottom controls stay completely static.
          </p>
        </div>

        {/* VS divider */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 72, alignSelf: "stretch" }}>
          <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 700 }}>VS</span>
          <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* ─ Option B ─ */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {/* Label */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 999, padding: "4px 12px",
          }}>
            <div style={{ width: 16, height: 16, borderRadius: 999, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 8, fontWeight: 800 }}>B</span>
            </div>
            <span style={{ color: "rgba(110,231,183,1)", fontSize: 11, fontWeight: 600 }}>Project pill transforms</span>
          </div>

          {/* Phone + top callout */}
          <div style={{ position: "relative" }}>
            {/* Top callout: "SAVE HERE" — points at the pill */}
            <div style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)", zIndex: 20, pointerEvents: "none", width: "100%" }}>
              <Callout label="↑ SAVE ACTION HERE" color="#10b981" active={count > 0} />
            </div>

            {/* Bottom annotation: "viewfinder clear" */}
            <div style={{
              position: "absolute", bottom: 120, left: "50%", transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap", zIndex: 20, pointerEvents: "none",
            }}>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 8 }}>viewfinder clear</span>
            </div>

            <OptionB count={count} onSave={() => setCount(0)} />
          </div>

          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textAlign: "center", maxWidth: 210, lineHeight: 1.5 }}>
            The project pill at the top turns green, shows a count, and pulses. Viewfinder stays completely clear for shooting.
          </p>
        </div>
      </div>

      {/* Shared shoot button */}
      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, margin: 0 }}>Shared shutter — fires both panels simultaneously</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button
            onTapStart={() => setCount(c => c + 1)}
            whileTap={{ scale: 0.88 }}
            style={{
              position: "relative", width: 64, height: 64, borderRadius: 999,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", background: "transparent", border: "none",
            }}
          >
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: "2.5px solid rgba(255,255,255,0.6)" }} />
            <div style={{ width: 52, height: 52, borderRadius: 999, background: "#fff", boxShadow: "0 2px 12px rgba(255,255,255,0.3)" }} />
          </motion.button>

          {count > 0 && (
            <button
              onClick={() => setCount(0)}
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 999, padding: "6px 14px",
                color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
            >
              Reset ({count})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}