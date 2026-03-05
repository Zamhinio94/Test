import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Tag, PencilLine, Share2, Check, ChevronLeft, AlignLeft, ChevronRight } from "lucide-react";

const PHOTO_URL = "https://images.unsplash.com/photo-1694521787162-5373b598945c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYnVpbGRpbmclMjByb29mJTIwYWVyaWFsfGVufDF8fHx8MTc3MjA1OTkyNXww&ixlib=rb-4.1.0&q=80&w=1080";

/* ─── Shared chrome ─────────────────────────────────── */

function PhoneShell({ children, label, sublabel }: { children: React.ReactNode; label: string; sublabel: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Label above */}
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-7 h-7 rounded-full mb-2"
          style={{ background: "rgba(79,110,247,0.25)", border: "1px solid rgba(79,110,247,0.5)" }}
        >
          <span style={{ fontSize: 13, color: "#a5b4fc", fontWeight: 700 }}>{label}</span>
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", maxWidth: 200 }}>{sublabel}</p>
      </div>

      {/* Phone frame */}
      <div className="relative flex-shrink-0" style={{ width: 280, height: 560 }}>
        {/* Frame */}
        <div
          className="absolute inset-0 rounded-[40px]"
          style={{
            background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 40%, #141416 100%)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.85), 0 0 0 0.5px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
        {/* Buttons */}
        <div className="absolute rounded-l-sm" style={{ left: -1.5, top: 90, width: 2.5, height: 20, background: "#2c2c30" }} />
        <div className="absolute rounded-l-sm" style={{ left: -1.5, top: 120, width: 2.5, height: 44, background: "#2c2c30" }} />
        <div className="absolute rounded-l-sm" style={{ left: -1.5, top: 174, width: 2.5, height: 44, background: "#2c2c30" }} />
        <div className="absolute rounded-r-sm" style={{ right: -1.5, top: 130, width: 2.5, height: 56, background: "#2c2c30" }} />

        {/* Screen */}
        <div className="absolute overflow-hidden rounded-[38px]" style={{ inset: 2, background: "#000" }}>
          {/* Dynamic island */}
          <div
            className="absolute rounded-full z-50 pointer-events-none"
            style={{ top: 7, left: "50%", transform: "translateX(-50%)", width: 90, height: 26, background: "#000" }}
          />
          {children}
        </div>

        {/* Home indicator */}
        <div
          className="absolute rounded-full z-50 pointer-events-none"
          style={{ bottom: 6, left: "50%", transform: "translateX(-50%)", width: 80, height: 3.5, background: "rgba(255,255,255,0.28)" }}
        />
      </div>
    </div>
  );
}

/* ─── Shared bottom action row ─────────────────────── */
function ActionRow() {
  return (
    <div className="flex gap-2 px-3">
      {[
        { icon: PencilLine, label: "Mark up" },
        { icon: Tag, label: "Tag" },
        { icon: Share2, label: "Share" },
      ].map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.09)", border: "0.5px solid rgba(255,255,255,0.12)" }}
        >
          <Icon size={16} className="text-white" strokeWidth={1.6} />
          <span className="text-white font-semibold" style={{ fontSize: 10 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function SaveButton({ projectName }: { projectName: string }) {
  return (
    <div className="px-3 pt-3 pb-5">
      <div
        className="w-full rounded-full flex items-center justify-center"
        style={{ background: "#4F6EF7", height: 44 }}
      >
        <span className="text-white font-semibold" style={{ fontSize: 13 }}>Save 3 photos to {projectName}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VARIANT A — Caption overlay on the photo
══════════════════════════════════════════════════════ */
function VariantA() {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Photo */}
      <div className="relative flex-1 overflow-hidden">
        <img src={PHOTO_URL} alt="" className="absolute inset-0 w-full h-full object-cover" />

        {/* Scrim top */}
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: 80, background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)" }} />
        {/* Scrim bottom */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: 120, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }} />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-10 z-10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}>
            <X size={12} className="text-white" strokeWidth={2} />
          </div>
          <div className="rounded-full px-3 py-1" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}>
            <span className="text-white font-semibold" style={{ fontSize: 11 }}>1 of 3</span>
          </div>
          <div className="w-8 h-8" />
        </div>

        {/* ── Caption bar — lives ON the photo ── */}
        <motion.button
          onClick={() => setEditing(true)}
          className="absolute left-3 right-3 bottom-3 z-10"
          whileTap={{ scale: 0.98 }}
          style={{ cursor: "text" }}
        >
          <motion.div
            animate={{
              background: editing ? "rgba(0,0,0,0.72)" : text ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.3)",
              borderColor: editing ? "rgba(79,110,247,0.7)" : "rgba(255,255,255,0.18)",
            }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl px-3 py-2.5 flex items-center gap-2"
            style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "0.5px solid" }}
          >
            <PencilLine size={12} strokeWidth={1.8} style={{ color: editing ? "#a5b4fc" : "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            {editing ? (
              <input
                ref={inputRef}
                value={text}
                onChange={e => setText(e.target.value)}
                onBlur={() => setEditing(false)}
                placeholder="Caption this batch…"
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: 13, color: "rgba(255,255,255,0.92)", caretColor: "#a5b4fc" }}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span
                className="flex-1"
                style={{
                  fontSize: 13,
                  color: text ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.3)",
                  fontStyle: text ? "normal" : "italic",
                }}
              >
                {text || "Caption this batch…"}
              </span>
            )}
            {text && !editing && (
              <span className="rounded-full px-1.5 py-0.5 flex-shrink-0" style={{ background: "rgba(79,110,247,0.3)", border: "0.5px solid rgba(79,110,247,0.5)" }}>
                <span style={{ fontSize: 8, color: "#a5b4fc", fontWeight: 600 }}>×3</span>
              </span>
            )}
            {editing && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onMouseDown={e => { e.preventDefault(); setEditing(false); }}
                className="rounded-full px-2 py-0.5 flex-shrink-0"
                style={{ background: "#4F6EF7" }}
              >
                <span style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>Done</span>
              </motion.button>
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Bottom panel */}
      <div style={{ background: "#0a0a0f", paddingTop: 14 }}>
        {/* Filmstrip */}
        <div className="flex gap-2 px-3 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden rounded-lg"
              style={{ width: 40, height: 40, border: i === 0 ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent", opacity: i === 0 ? 1 : 0.4 }}
            >
              <img src={PHOTO_URL} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <ActionRow />
        <SaveButton projectName="Barratt — Leeds" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VARIANT C — Sticky note card
══════════════════════════════════════════════════════ */
function VariantC() {
  const [text, setText] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (sheetOpen) setTimeout(() => textareaRef.current?.focus(), 80);
  }, [sheetOpen]);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Photo */}
      <div className="relative" style={{ height: "52%" }}>
        <img src={PHOTO_URL} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: 80, background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: 60, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)" }} />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-10 z-10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}>
            <X size={12} className="text-white" strokeWidth={2} />
          </div>
          <div className="rounded-full px-3 py-1" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}>
            <span className="text-white font-semibold" style={{ fontSize: 11 }}>1 of 3</span>
          </div>
          <div className="w-8 h-8" />
        </div>
      </div>

      {/* Bottom panel */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#0a0a0f" }}>
        <div className="flex-1 overflow-y-auto px-3 pt-3" style={{ scrollbarWidth: "none" }}>

          {/* ── Sticky note card ── */}
          <motion.button
            onClick={() => setSheetOpen(true)}
            whileTap={{ scale: 0.97 }}
            className="w-full mb-3 text-left"
            style={{ display: "block" }}
          >
            <motion.div
              className="relative w-full rounded-2xl px-4 py-3 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                boxShadow: "0 4px 20px rgba(251,191,36,0.25), 0 1px 3px rgba(0,0,0,0.3)",
                transform: "rotate(-0.4deg)",
              }}
            >
              {/* Ruled lines */}
              {[0,1,2].map(i => (
                <div key={i} className="absolute left-0 right-0" style={{ top: 32 + i * 20, height: 1, background: "rgba(180,120,0,0.08)" }} />
              ))}
              {/* Red margin line */}
              <div className="absolute top-0 bottom-0" style={{ left: 28, width: 1, background: "rgba(220,50,50,0.12)" }} />

              <div className="flex items-start gap-2 pl-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold mb-1" style={{ fontSize: 9, color: "rgba(120,80,0,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Site note · all 3 photos
                  </p>
                  {text ? (
                    <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.5 }}>{text}</p>
                  ) : (
                    <p style={{ fontSize: 13, color: "rgba(120,80,0,0.35)", fontStyle: "italic", lineHeight: 1.5 }}>
                      Tap to add a site note…
                    </p>
                  )}
                </div>
                <PencilLine size={13} strokeWidth={1.8} style={{ color: "rgba(120,80,0,0.3)", flexShrink: 0, marginTop: 2 }} />
              </div>

              {/* Folded corner */}
              <div
                className="absolute bottom-0 right-0"
                style={{
                  width: 0, height: 0,
                  borderLeft: "14px solid transparent",
                  borderBottom: "14px solid rgba(251,191,36,0.4)",
                  filter: "drop-shadow(-1px -1px 2px rgba(0,0,0,0.1))",
                }}
              />
            </motion.div>
          </motion.button>

          {/* Filmstrip */}
          <div className="flex gap-2 pb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="flex-shrink-0 overflow-hidden rounded-lg"
                style={{ width: 38, height: 38, border: i === 0 ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent", opacity: i === 0 ? 1 : 0.4 }}
              >
                <img src={PHOTO_URL} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0">
          <ActionRow />
          <SaveButton projectName="Barratt — Leeds" />
        </div>
      </div>

      {/* Edit sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-30"
              style={{ background: "rgba(0,0,0,0.4)" }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
              className="absolute left-0 right-0 bottom-0 z-40 rounded-t-3xl flex flex-col"
              style={{ background: "#fef3c7", maxHeight: "65%" }}
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-7 h-0.5 rounded-full" style={{ background: "rgba(120,80,0,0.2)" }} />
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <p className="font-semibold" style={{ fontSize: 13, color: "#78350f" }}>Site note</p>
                <div className="rounded-full px-2 py-0.5" style={{ background: "rgba(120,80,0,0.12)" }}>
                  <span style={{ fontSize: 9, color: "rgba(120,80,0,0.6)", fontWeight: 600 }}>Applies to all 3 photos</span>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="e.g. Roof inspection, east elevation, 3rd floor…"
                rows={4}
                className="flex-1 mx-4 mb-3 rounded-xl px-3 py-2.5 outline-none resize-none"
                style={{
                  background: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(120,80,0,0.12)",
                  color: "#78350f",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              />
              <button
                onClick={() => setSheetOpen(false)}
                className="mx-4 mb-6 rounded-full flex items-center justify-center"
                style={{ background: "#d97706", height: 44 }}
              >
                <Check size={14} color="#fff" strokeWidth={2.5} />
                <span className="text-white font-semibold ml-2" style={{ fontSize: 13 }}>Done</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VARIANT D — Hero title / editorial header
══════════════════════════════════════════════════════ */
function VariantD() {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Photo */}
      <div className="relative" style={{ height: "44%" }}>
        <img src={PHOTO_URL} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: 80, background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: 70, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }} />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-10 z-10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}>
            <X size={12} className="text-white" strokeWidth={2} />
          </div>
          <div className="rounded-full px-3 py-1" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}>
            <span className="text-white font-semibold" style={{ fontSize: 11 }}>1 of 3</span>
          </div>
          <div className="w-8 h-8" />
        </div>
      </div>

      {/* Bottom panel */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#0a0a0f" }}>
        {/* ── Hero title area ── */}
        <div
          className="px-4 pt-4 pb-3 flex-shrink-0"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-1.5">
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Batch description
            </span>
            <span className="rounded-full px-1.5 py-0.5" style={{ background: "rgba(79,110,247,0.18)", border: "0.5px solid rgba(79,110,247,0.35)" }}>
              <span style={{ fontSize: 8, color: "#a5b4fc", fontWeight: 600 }}>3 photos</span>
            </span>
          </div>

          {/* Editable hero title */}
          <motion.button
            onClick={() => setEditing(true)}
            className="w-full text-left"
            whileTap={{ scale: 0.99 }}
            style={{ cursor: "text" }}
          >
            {editing ? (
              <input
                ref={inputRef}
                value={text}
                onChange={e => setText(e.target.value)}
                onBlur={() => setEditing(false)}
                placeholder="Untitled batch"
                className="w-full bg-transparent outline-none"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.92)",
                  caretColor: "#4F6EF7",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                }}
                onKeyDown={e => e.key === "Enter" && setEditing(false)}
              />
            ) : (
              <motion.p
                animate={{ opacity: text ? 1 : 0.22 }}
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: text ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.9)",
                  fontStyle: text ? "normal" : "italic",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                }}
              >
                {text || "Untitled batch"}
              </motion.p>
            )}
          </motion.button>

          {/* Sub-info line */}
          <AnimatePresence>
            {text && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="mt-1"
                style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}
              >
                Barratt Homes — Leeds · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Filmstrip */}
        <div className="flex gap-2 px-3 py-3 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden rounded-lg"
              style={{ width: 38, height: 38, border: i === 0 ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent", opacity: i === 0 ? 1 : 0.4 }}
            >
              <img src={PHOTO_URL} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex-shrink-0">
          <ActionRow />
          <SaveButton projectName="Barratt — Leeds" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main comparison page ────────────────────────── */

export function DescriptionVariantComparison({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="min-h-screen w-full overflow-auto py-10"
      style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, #141428 0%, #080810 100%)" }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 flex items-center gap-2 rounded-full px-4 py-2 z-50"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.6)",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <ChevronLeft size={13} strokeWidth={2.5} />
        Back
      </button>

      {/* Header */}
      <div className="text-center mb-10 px-6">
        <h1 className="text-white font-bold mb-2" style={{ fontSize: 22, letterSpacing: "-0.02em" }}>
          Description field — 3 concepts
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
          Each variant is interactive — tap & type to feel the difference
        </p>
      </div>

      {/* Three phones */}
      <div className="flex flex-wrap justify-center gap-10 px-6">
        <PhoneShell
          label="A"
          sublabel="Caption lives on the photo — tap the bar to edit inline"
        >
          <VariantA />
        </PhoneShell>

        <PhoneShell
          label="C"
          sublabel="Sticky note card — warm, tactile, impossible to miss"
        >
          <VariantC />
        </PhoneShell>

        <PhoneShell
          label="D"
          sublabel="Hero title — tap the big italic text to name the batch"
        >
          <VariantD />
        </PhoneShell>
      </div>

      {/* Verdict row */}
      <div className="flex flex-wrap justify-center gap-5 mt-12 px-6 max-w-4xl mx-auto">
        {[
          { label: "A", title: "Caption on photo", pro: "Most 'native' to photo apps. Description is literally on the image.", con: "Can obscure the photo. Less useful if you shoot portrait subjects." },
          { label: "C", title: "Sticky note", pro: "Unmissable. Warm contrast draws the eye. Physical diary feel.", con: "Colour clash on dark UI. Panel feels busier." },
          { label: "D", title: "Hero title", pro: "Gives the batch a name — professional, report-ready. Clean hierarchy.", con: "Requires intent to type — passive users may skip it." },
        ].map(v => (
          <div
            key={v.label}
            className="flex-1 rounded-2xl p-4"
            style={{ minWidth: 200, maxWidth: 260, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(79,110,247,0.25)", border: "1px solid rgba(79,110,247,0.5)" }}
              >
                <span style={{ fontSize: 11, color: "#a5b4fc", fontWeight: 700 }}>{v.label}</span>
              </div>
              <span className="text-white font-semibold" style={{ fontSize: 13 }}>{v.title}</span>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.55, marginBottom: 8 }}>
              <span style={{ color: "rgba(134,239,172,0.9)" }}>✓ </span>{v.pro}
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.55 }}>
              <span style={{ color: "rgba(251,113,133,0.8)" }}>↳ </span>{v.con}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}