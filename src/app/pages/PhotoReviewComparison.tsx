import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, PencilLine, Tag, AlertCircle, AlignLeft, ChevronRight, Share2,
} from "lucide-react";

const SITE_PHOTO = "https://images.unsplash.com/photo-1640476750068-72c645e653cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYnVpbGRpbmclMjByb29mdG9wJTIwYWVyaWFsfGVufDF8fHx8MTc3MjQ1NTU5M3ww&ixlib=rb-4.1.0&q=80&w=400";
const SITE_PHOTO_B = "https://images.unsplash.com/photo-1755288271423-462a0808deb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMHNjYWZmb2xkJTIwYnJpY2t3b3JrJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzI0NTU1OTZ8MA&ixlib=rb-4.1.0&q=80&w=400";

const SPRING = { type: "spring", stiffness: 340, damping: 32 } as const;

/* ── Phone shell ───────────────────────────────────────────────── */
function Phone({
  children,
  screenBg = "#000",
}: {
  children: React.ReactNode;
  screenBg?: string;
}) {
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden"
      style={{
        width: 210,
        height: 420,
        borderRadius: 34,
        background: "#0a0a0a",
        boxShadow: "0 28px 70px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Dynamic island */}
      <div
        className="absolute rounded-full z-30 pointer-events-none"
        style={{ top: 9, left: "50%", transform: "translateX(-50%)", width: 80, height: 24, background: "#000" }}
      />
      {/* Screen */}
      <div
        className="absolute inset-[2px] overflow-hidden"
        style={{ borderRadius: 32, background: screenBg }}
      >
        {/* Status bar gap */}
        <div style={{ height: 42 }} />
        {children}
      </div>
    </div>
  );
}

/* ── Shared photo thumbnail row (filmstrip) ────────────────────── */
function FilmStrip({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1.5 overflow-hidden">
      {[SITE_PHOTO, SITE_PHOTO_B, SITE_PHOTO].map((src, i) => (
        <div
          key={i}
          className="flex-shrink-0 overflow-hidden"
          style={{
            width: 36, height: 36, borderRadius: 6,
            border: i === 0 ? `2px solid ${color}` : "1.5px solid rgba(0,0,0,0.1)",
            opacity: i === 0 ? 1 : 0.55,
          }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ width: 36, height: 36, borderRadius: 6, background: "rgba(0,0,0,0.06)", border: "1.5px dashed rgba(0,0,0,0.15)" }}
      >
        <span style={{ fontSize: 7, color: "rgba(0,0,0,0.35)", fontWeight: 700 }}>+2</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OPTION 1 · Clean Card + White Panel
   Photo animates into a framed card, white panel rises below
───────────────────────────────────────────────────────────────── */
function Opt1() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col items-center gap-2">
      <Phone screenBg="#fff">
        <div className="relative" style={{ height: 374 }}>
          {/* Photo card */}
          <motion.div
            animate={open
              ? { top: 6, left: 6, right: 6, height: 148, borderRadius: 12 }
              : { top: 0, left: 0, right: 0, height: 374, borderRadius: 0 }}
            transition={SPRING}
            className="absolute overflow-hidden"
            style={{ zIndex: 1 }}
          >
            <img src={SITE_PHOTO} alt="" className="w-full h-full object-cover" />
            {/* Top bar overlay */}
            {!open && (
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.42)" }}>
                  <span style={{ color: "#fff", fontSize: 8 }}>✕</span>
                </div>
                <div className="rounded-full px-2 py-0.5" style={{ background: "rgba(0,0,0,0.42)" }}>
                  <span style={{ color: "#fff", fontSize: 7, fontWeight: 700 }}>1 of 3</span>
                </div>
                <div className="w-6 h-6" />
              </div>
            )}
          </motion.div>

          {/* White panel */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="panel"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={SPRING}
                className="absolute left-0 right-0 bottom-0"
                style={{ background: "#fff", borderRadius: "12px 12px 0 0", zIndex: 2 }}
              >
                {/* Handle */}
                <div className="flex justify-center pt-2 pb-1.5">
                  <div className="w-6 h-0.5 rounded-full" style={{ background: "#D1D5DB" }} />
                </div>

                {/* Filmstrip */}
                <div className="px-3 pb-2">
                  <FilmStrip color="#3478F6" />
                </div>

                {/* Description row */}
                <div className="px-3 pb-2">
                  <div
                    className="flex items-center gap-1.5 px-2"
                    style={{ height: 24, borderRadius: 7, background: "#EEF3FF", border: "1.5px solid #C7D7FD" }}
                  >
                    <AlignLeft size={8} strokeWidth={2} style={{ color: "#3478F6", flexShrink: 0 }} />
                    <span style={{ fontSize: 6.5, color: "#9CA3AF" }}>Add a description…</span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "#F3F4F6", marginBottom: 8 }} />

                {/* Action rows */}
                {[
                  { icon: PencilLine, label: "Mark up" },
                  { icon: Tag, label: "Label" },
                  { icon: AlertCircle, label: "Priority" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="mx-3 mb-1.5 flex items-center gap-2 px-2"
                    style={{ height: 24, borderRadius: 7, background: "#fff", border: "1.5px solid #EEF3FF" }}>
                    <div className="flex items-center justify-center rounded-md flex-shrink-0"
                      style={{ width: 16, height: 16, background: "#EEF3FF" }}>
                      <Icon size={8} strokeWidth={2} style={{ color: "#3478F6" }} />
                    </div>
                    <span className="flex-1" style={{ fontSize: 6.5, fontWeight: 600, color: "#111827" }}>{label}</span>
                    <ChevronRight size={6} strokeWidth={2.5} style={{ color: "#C7D7FD" }} />
                  </div>
                ))}

                {/* Save */}
                <div className="px-3 pt-1 pb-4">
                  <div className="flex items-center justify-center rounded-full" style={{ height: 24, background: "#3478F6" }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: "#fff" }}>Save 3 photos to Kings Cross Quarter</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Phone>
      <button
        onClick={() => setOpen(v => !v)}
        className="rounded-full px-3 py-1"
        style={{ background: "#EEF3FF", border: "1px solid #C7D7FD" }}
      >
        <span style={{ fontSize: 9.5, fontWeight: 700, color: "#3478F6" }}>
          {open ? "▶ Capture" : "◀ Review"}
        </span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OPTION 2 · Card + Periwinkle Tinted Panel
   Entire lower surface tinted #EEF3FF — unified branded feel
───────────────────────────────────────────────────────────────── */
function Opt2() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col items-center gap-2">
      <Phone screenBg="#EEF3FF">
        <div className="relative" style={{ height: 374 }}>
          {/* Photo card */}
          <motion.div
            animate={open
              ? { top: 6, left: 6, right: 6, height: 148, borderRadius: 12 }
              : { top: 0, left: 0, right: 0, height: 374, borderRadius: 0 }}
            transition={SPRING}
            className="absolute overflow-hidden"
            style={{ zIndex: 1 }}
          >
            <img src={SITE_PHOTO} alt="" className="w-full h-full object-cover" />
          </motion.div>

          {/* Periwinkle panel */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="panel"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={SPRING}
                className="absolute left-0 right-0 bottom-0"
                style={{ background: "#EEF3FF", borderRadius: "12px 12px 0 0", zIndex: 2 }}
              >
                <div className="flex justify-center pt-2 pb-1.5">
                  <div className="w-6 h-0.5 rounded-full" style={{ background: "#C7D7FD" }} />
                </div>

                <div className="px-3 pb-2">
                  <FilmStrip color="#3478F6" />
                </div>

                {/* Description */}
                <div className="px-3 pb-2">
                  <div className="flex items-center gap-1.5 px-2"
                    style={{ height: 24, borderRadius: 7, background: "#fff", border: "1.5px solid #C7D7FD" }}>
                    <AlignLeft size={8} strokeWidth={2} style={{ color: "#3478F6" }} />
                    <span style={{ fontSize: 6.5, color: "#9CA3AF" }}>Add a description…</span>
                  </div>
                </div>

                <div style={{ height: 1, background: "#C7D7FD", margin: "0 12px 8px" }} />

                {/* Action rows on white cards */}
                {[
                  { icon: PencilLine, label: "Mark up" },
                  { icon: Tag, label: "Label" },
                  { icon: AlertCircle, label: "Priority" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="mx-3 mb-1.5 flex items-center gap-2 px-2"
                    style={{ height: 24, borderRadius: 7, background: "#fff", border: "1.5px solid #C7D7FD" }}>
                    <div className="flex items-center justify-center rounded-md flex-shrink-0"
                      style={{ width: 16, height: 16, background: "#DBEAFE" }}>
                      <Icon size={8} strokeWidth={2} style={{ color: "#3478F6" }} />
                    </div>
                    <span className="flex-1" style={{ fontSize: 6.5, fontWeight: 600, color: "#111827" }}>{label}</span>
                    <ChevronRight size={6} strokeWidth={2.5} style={{ color: "#C7D7FD" }} />
                  </div>
                ))}

                <div className="px-3 pt-1 pb-4">
                  <div className="flex items-center justify-center rounded-full" style={{ height: 24, background: "#3478F6" }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: "#fff" }}>Save 3 photos to Kings Cross Quarter</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Phone>
      <button
        onClick={() => setOpen(v => !v)}
        className="rounded-full px-3 py-1"
        style={{ background: "#EEF3FF", border: "1px solid #C7D7FD" }}
      >
        <span style={{ fontSize: 9.5, fontWeight: 700, color: "#3478F6" }}>
          {open ? "▶ Capture" : "◀ Review"}
        </span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OPTION 3 · Full-bleed photo + Navy Shelf
   Photo stays full-screen — opaque navy panel slides up as a "shelf"
───────────────────────────────────────────────────────────────── */
function Opt3() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col items-center gap-2">
      <Phone screenBg="#000">
        <div className="relative" style={{ height: 374 }}>
          {/* Full-bleed photo — always visible */}
          <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
            <img src={SITE_PHOTO_B} alt="" className="w-full h-full object-cover" />
          </div>

          {/* Capture UI overlay */}
          {!open && (
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.42)" }}>
                <span style={{ color: "#fff", fontSize: 8 }}>✕</span>
              </div>
              <div className="rounded-full px-2 py-0.5" style={{ background: "rgba(0,0,0,0.42)" }}>
                <span style={{ color: "#fff", fontSize: 7, fontWeight: 700 }}>1 of 3</span>
              </div>
              <div className="w-6 h-6" />
            </div>
          )}

          {/* Navy shelf */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="panel"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={SPRING}
                className="absolute left-0 right-0 bottom-0"
                style={{ background: "#0E1F40", borderRadius: "12px 12px 0 0", zIndex: 2 }}
              >
                <div className="flex justify-center pt-2 pb-1.5">
                  <div className="w-6 h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                </div>

                {/* Filmstrip with dark style */}
                <div className="px-3 pb-2 flex items-center gap-1.5 overflow-hidden">
                  {[SITE_PHOTO_B, SITE_PHOTO, SITE_PHOTO_B].map((src, i) => (
                    <div key={i} className="flex-shrink-0 overflow-hidden"
                      style={{ width: 36, height: 36, borderRadius: 6, border: i === 0 ? "2px solid #3478F6" : "1.5px solid rgba(255,255,255,0.15)", opacity: i === 0 ? 1 : 0.5 }}>
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="flex-shrink-0 flex items-center justify-center"
                    style={{ width: 36, height: 36, borderRadius: 6, background: "rgba(255,255,255,0.07)", border: "1.5px dashed rgba(255,255,255,0.2)" }}>
                    <span style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>+2</span>
                  </div>
                </div>

                {/* Description */}
                <div className="px-3 pb-2">
                  <div className="flex items-center gap-1.5 px-2"
                    style={{ height: 24, borderRadius: 7, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <AlignLeft size={8} strokeWidth={2} style={{ color: "#3478F6" }} />
                    <span style={{ fontSize: 6.5, color: "rgba(255,255,255,0.35)" }}>Add a description…</span>
                  </div>
                </div>

                <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0 12px 8px" }} />

                {/* Circles */}
                <div className="flex items-start justify-center gap-6 px-3 pb-3">
                  {[
                    { icon: PencilLine, label: "Mark up" },
                    { icon: Tag, label: "Label" },
                    { icon: AlertCircle, label: "Priority" },
                    { icon: Share2, label: "Share" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <div className="flex items-center justify-center rounded-full"
                        style={{ width: 28, height: 28, background: "#1D3D8A", border: "1px solid rgba(52,120,246,0.35)" }}>
                        <Icon size={10} strokeWidth={1.75} style={{ color: "#93B4F8" }} />
                      </div>
                      <span style={{ fontSize: 5.5, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="px-3 pb-4">
                  <div className="flex items-center justify-center rounded-full" style={{ height: 24, background: "#3478F6" }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: "#fff" }}>Save 3 photos to Kings Cross Quarter</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Phone>
      <button
        onClick={() => setOpen(v => !v)}
        className="rounded-full px-3 py-1"
        style={{ background: "#EEF3FF", border: "1px solid #C7D7FD" }}
      >
        <span style={{ fontSize: 9.5, fontWeight: 700, color: "#3478F6" }}>
          {open ? "▶ Capture" : "◀ Review"}
        </span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OPTION 4 · Card + 3-Column Action Grid
   Same framed-card photo approach — actions as equal square tiles
───────────────────────────────────────────────────────────────── */
function Opt4() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col items-center gap-2">
      <Phone screenBg="#fff">
        <div className="relative" style={{ height: 374 }}>
          {/* Photo card */}
          <motion.div
            animate={open
              ? { top: 6, left: 6, right: 6, height: 140, borderRadius: 12 }
              : { top: 0, left: 0, right: 0, height: 374, borderRadius: 0 }}
            transition={SPRING}
            className="absolute overflow-hidden"
            style={{ zIndex: 1 }}
          >
            <img src={SITE_PHOTO} alt="" className="w-full h-full object-cover" />
          </motion.div>

          {/* White panel */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="panel"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={SPRING}
                className="absolute left-0 right-0 bottom-0"
                style={{ background: "#fff", borderRadius: "12px 12px 0 0", zIndex: 2 }}
              >
                <div className="flex justify-center pt-2 pb-1.5">
                  <div className="w-6 h-0.5 rounded-full" style={{ background: "#D1D5DB" }} />
                </div>

                <div className="px-3 pb-2">
                  <FilmStrip color="#3478F6" />
                </div>

                <div className="px-3 pb-2">
                  <div className="flex items-center gap-1.5 px-2"
                    style={{ height: 24, borderRadius: 7, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                    <AlignLeft size={8} strokeWidth={2} style={{ color: "#9CA3AF" }} />
                    <span style={{ fontSize: 6.5, color: "#9CA3AF" }}>Add a description…</span>
                  </div>
                </div>

                <div style={{ height: 1, background: "#F3F4F6", margin: "0 0 8px" }} />

                {/* 3-column grid */}
                <div className="px-3 pb-2 grid gap-1.5" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                  {[
                    { icon: PencilLine, label: "Mark up", color: "#3478F6", bg: "#EEF3FF" },
                    { icon: Tag, label: "Label", color: "#3478F6", bg: "#EEF3FF" },
                    { icon: AlertCircle, label: "Priority", color: "#3478F6", bg: "#EEF3FF" },
                  ].map(({ icon: Icon, label, color, bg }) => (
                    <div key={label}
                      className="flex flex-col items-center gap-1.5 py-3"
                      style={{ borderRadius: 8, background: "#fff", border: "1px solid #F0F0F0" }}>
                      <div className="flex items-center justify-center rounded-lg"
                        style={{ width: 24, height: 24, background: bg }}>
                        <Icon size={10} strokeWidth={2} style={{ color }} />
                      </div>
                      <span style={{ fontSize: 6, fontWeight: 600, color: "#374151" }}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="px-3 pb-4">
                  <div className="flex items-center justify-center rounded-full" style={{ height: 24, background: "#3478F6" }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: "#fff" }}>Save 3 photos to Kings Cross Quarter</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Phone>
      <button
        onClick={() => setOpen(v => !v)}
        className="rounded-full px-3 py-1"
        style={{ background: "#EEF3FF", border: "1px solid #C7D7FD" }}
      >
        <span style={{ fontSize: 9.5, fontWeight: 700, color: "#3478F6" }}>
          {open ? "▶ Capture" : "◀ Review"}
        </span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OPTION 5 · Card + Horizontal Pill Actions
   Compact horizontal row of action chips — minimal, modern, airy
───────────────────────────────────────────────────────────────── */
function Opt5() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col items-center gap-2">
      <Phone screenBg="#F5F8FF">
        <div className="relative" style={{ height: 374 }}>
          {/* Photo card */}
          <motion.div
            animate={open
              ? { top: 6, left: 6, right: 6, height: 160, borderRadius: 12 }
              : { top: 0, left: 0, right: 0, height: 374, borderRadius: 0 }}
            transition={SPRING}
            className="absolute overflow-hidden"
            style={{ zIndex: 1 }}
          >
            <img src={SITE_PHOTO} alt="" className="w-full h-full object-cover" />
          </motion.div>

          {/* Light blue-white panel */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="panel"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={SPRING}
                className="absolute left-0 right-0 bottom-0"
                style={{ background: "#F5F8FF", borderRadius: "12px 12px 0 0", zIndex: 2 }}
              >
                <div className="flex justify-center pt-2 pb-1.5">
                  <div className="w-6 h-0.5 rounded-full" style={{ background: "#C7D7FD" }} />
                </div>

                <div className="px-3 pb-2">
                  <FilmStrip color="#3478F6" />
                </div>

                {/* Description */}
                <div className="px-3 pb-2">
                  <div className="flex items-center gap-1.5 px-2"
                    style={{ height: 24, borderRadius: 7, background: "#fff", border: "1.5px solid #C7D7FD" }}>
                    <AlignLeft size={8} strokeWidth={2} style={{ color: "#3478F6" }} />
                    <span style={{ fontSize: 6.5, color: "#9CA3AF" }}>Add a description…</span>
                    <ChevronRight size={6} strokeWidth={2.5} style={{ color: "#C7D7FD", flexShrink: 0 }} />
                  </div>
                </div>

                <div style={{ height: 1, background: "#E0E7FF", margin: "0 0 8px" }} />

                {/* Horizontal pill actions */}
                <div className="px-3 pb-2 flex items-center gap-1.5">
                  {[
                    { icon: PencilLine, label: "Mark up" },
                    { icon: Tag, label: "Label" },
                    { icon: AlertCircle, label: "Priority" },
                    { icon: Share2, label: "Share" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label}
                      className="flex items-center gap-1 px-2 flex-shrink-0"
                      style={{ height: 22, borderRadius: 100, background: "#fff", border: "1.5px solid #C7D7FD" }}>
                      <Icon size={7} strokeWidth={2.5} style={{ color: "#3478F6" }} />
                      <span style={{ fontSize: 6, fontWeight: 600, color: "#111827" }}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="px-3 pb-4 pt-1.5">
                  <div className="flex items-center justify-center rounded-full" style={{ height: 24, background: "#3478F6" }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: "#fff" }}>Save 3 photos to Kings Cross Quarter</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Phone>
      <button
        onClick={() => setOpen(v => !v)}
        className="rounded-full px-3 py-1"
        style={{ background: "#EEF3FF", border: "1px solid #C7D7FD" }}
      >
        <span style={{ fontSize: 9.5, fontWeight: 700, color: "#3478F6" }}>
          {open ? "▶ Capture" : "◀ Review"}
        </span>
      </button>
    </div>
  );
}

/* ── Option card wrapper (matches DockComparison format) ───────── */
function OptionCard({
  number,
  title,
  note,
  badge,
  children,
}: {
  number: number | string;
  title: string;
  note: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden"
      style={{ background: "#fff", border: "1.5px solid #E5E7EB" }}
    >
      {/* Phone preview */}
      <div className="flex items-center justify-center py-6" style={{ background: "#F0F4FB" }}>
        {children}
      </div>

      {/* Label */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#0E1F40" }}
          >
            <span style={{ fontSize: 8, fontWeight: 800, color: "#fff" }}>{number}</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0E1F40" }}>{title}</p>
          {badge && (
            <span className="rounded-full px-2 py-0.5" style={{ background: "#FFF7ED", border: "1px solid #FDBA74" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#F97316" }}>{badge}</span>
            </span>
          )}
        </div>
        <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.55 }}>{note}</p>
      </div>
    </div>
  );
}

/* ── Annotation callout ─────────────────────────────────────────── */
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 mb-4 px-4 py-3 rounded-2xl" style={{ background: "#EEF3FF", border: "1.5px solid #C7D7FD" }}>
      <p style={{ fontSize: 11.5, color: "#1D3D8A", lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────── */
export function PhotoReviewComparison({ onBack }: { onBack?: () => void }) {
  return (
    <div className="min-h-screen" style={{ background: "#0E1F40" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.10)" }}
        >
          <ArrowLeft size={15} color="#fff" strokeWidth={2} />
        </button>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Review panel — options</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Tap ▶ Capture / ◀ Review to preview animation</p>
        </div>
      </div>

      {/* Animation insight callout */}
      <Callout>
        <strong>Image resize animation:</strong> In options 1, 2, 4 &amp; 5 the photo smoothly snaps
        from full-screen into a framed card as the review panel rises — photo and panel share the
        same spring timing so the motion feels like one connected gesture. Option 3 keeps the
        photo full-bleed; a navy shelf slides up beneath it instead.
      </Callout>

      {/* 2-col grid */}
      <div className="px-4 pb-8 grid grid-cols-2 gap-3">

        {/* Option 1 — full width */}
        <div className="col-span-2">
          <OptionCard
            number={1}
            title="White card + row actions"
            badge="Recommended"
            note="Photo springs into a framed card at the top. White panel rises with a description row and full-width icon + label rows. Every element matches the app's InviteTeamSheet / ShareSheet pattern — feels native and consistent."
          >
            <Opt1 />
          </OptionCard>
        </div>

        <OptionCard
          number={2}
          title="Periwinkle tinted panel"
          note="Same card-shrink animation. The whole panel surface is #EEF3FF — rows sit on white cards with #C7D7FD borders. More distinctly branded than plain white."
        >
          <Opt2 />
        </OptionCard>

        <OptionCard
          number={3}
          title="Full-bleed + navy shelf"
          note="Photo stays full-screen — the opaque #0E1F40 navy panel slides up as a shelf. No image resizing needed. Action circles use the informational #1D3D8A blue. Best when you want maximum photo visibility."
        >
          <Opt3 />
        </OptionCard>

        <OptionCard
          number={4}
          title="Card + 3-column grid"
          note="Photo shrinks to card. Actions presented as 3 equal square tiles in a row — bigger tap targets, instantly scannable at a glance. Clean, grid-first layout."
        >
          <Opt4 />
        </OptionCard>

        <OptionCard
          number={5}
          title="Card + horizontal pill chips"
          note="Most compact option. Photo card sits in the top ~43%. Horizontal pill row keeps all actions in a single scanning line. #F5F8FF screen background gives the whole surface a light blue wash."
        >
          <Opt5 />
        </OptionCard>

      </div>
    </div>
  );
}