import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Plus, Building2, ChevronDown, ArrowLeft } from "lucide-react";

const VIEWFINDER =
  "https://images.unsplash.com/photo-1748956628042-b73331e0b479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";

// ── Shared viewfinder shell ──────────────────────────────────────────────────
function Viewfinder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-black" style={{ borderRadius: 16, aspectRatio: "9/16", width: "100%" }}>
      <img
        src={VIEWFINDER}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.72 }}
      />
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-50% to-black/70 pointer-events-none" />
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/20" />
        <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/20" />
        <div className="absolute left-0 right-0 top-1/3 h-px bg-white/20" />
        <div className="absolute left-0 right-0 bottom-1/3 h-px bg-white/20" />
      </div>
      {/* Focus brackets */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative" style={{ width: 56, height: 56, opacity: 0.5 }}>
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white" />
        </div>
      </div>
      {/* Top status */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 pt-3">
        <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
          <MapPin size={10} className="text-white/30" />
        </div>
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="text-white/40 font-medium" style={{ fontSize: 8 }}>No project matched</span>
        </div>
        <div className="w-6 h-6" />
      </div>
      {/* Dim overlay — GPS unknown state */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      {/* Shutter row at bottom — dimmed to show shooting is blocked */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col">
        {/* The GPS prompt area */}
        {children}
        {/* Mode + shutter */}
        <div className="flex items-center justify-center gap-5 pt-2 pb-1.5">
          <span className="text-white/20 font-bold uppercase tracking-widest" style={{ fontSize: 7 }}>video</span>
          <span className="text-yellow-400/40 font-bold uppercase tracking-widest" style={{ fontSize: 7 }}>photo</span>
        </div>
        <div className="flex items-center justify-between px-6 pb-4 pt-1">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10" />
          <div className="relative w-14 h-14 rounded-full flex items-center justify-center opacity-30">
            <div className="absolute inset-0 rounded-full border-2 border-white/60" />
            <div className="w-11 h-11 rounded-full bg-white/70" />
          </div>
          <div className="w-9 h-9 rounded-xl border border-dashed border-white/15" />
        </div>
      </div>
    </div>
  );
}

// ── Option A — Two equal pills ───────────────────────────────────────────────
function OptionA() {
  const [active, setActive] = useState<null | "existing" | "new">(null);

  return (
    <Viewfinder>
      <div className="flex flex-col items-center gap-1.5 pb-2 pt-1 px-3">
        <span className="text-white/45 font-medium" style={{ fontSize: 9 }}>Location not detected</span>
        <div className="flex items-center gap-2 w-full justify-center">
          {/* Pill 1 — Select existing */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setActive(active === "existing" ? null : "existing")}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 border"
            style={{
              background: active === "existing" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)",
              borderColor: active === "existing" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Building2 size={9} className="text-white/80" strokeWidth={2} />
            <span className="text-white font-semibold" style={{ fontSize: 9 }}>Select existing</span>
          </motion.button>
          {/* Pill 2 — New project */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setActive(active === "new" ? null : "new")}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 border"
            style={{
              background: active === "new" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)",
              borderColor: active === "new" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Plus size={9} className="text-white/80" strokeWidth={2.5} />
            <span className="text-white font-semibold" style={{ fontSize: 9 }}>New project</span>
          </motion.button>
        </div>
      </div>
    </Viewfinder>
  );
}

// ── Option C — Primary pill + quiet secondary ────────────────────────────────
function OptionC() {
  const [active, setActive] = useState<null | "existing" | "new">(null);

  return (
    <Viewfinder>
      <div className="flex flex-col items-center gap-1.5 pb-2 pt-1">
        <span className="text-white/45 font-medium" style={{ fontSize: 9 }}>Location not detected</span>
        {/* Primary CTA */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setActive(active === "new" ? null : "new")}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border"
          style={{
            background: active === "new" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.14)",
            borderColor: active === "new" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          <Plus size={10} className="text-white/90" strokeWidth={2.5} />
          <span className="text-white font-semibold" style={{ fontSize: 10 }}>New project</span>
        </motion.button>
        {/* Secondary escape — quiet text link */}
        <button
          onClick={() => setActive(active === "existing" ? null : "existing")}
          className="flex items-center gap-1"
          style={{ opacity: active === "existing" ? 0.9 : 0.45 }}
        >
          <span className="text-white font-medium underline underline-offset-2" style={{ fontSize: 8 }}>
            or find an existing project
          </span>
          <ChevronDown size={8} className="text-white" />
        </button>
      </div>
    </Viewfinder>
  );
}

// ── Main comparison page ─────────────────────────────────────────────────────
interface GPSComparisonProps {
  onBack: () => void;
}

export function GPSComparison({ onBack }: GPSComparisonProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center py-10 px-6"
      style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, #141428 0%, #080810 100%)" }}
    >
      {/* Back */}
      <div className="w-full max-w-2xl mb-8 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-white/50 hover:text-white/80 transition-colors"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }}
        >
          <ArrowLeft size={12} />
          Back
        </button>
        <div>
          <p className="text-white/30 font-medium" style={{ fontSize: 11 }}>GPS unknown · unknown location state</p>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-white mb-1" style={{ fontSize: 20 }}>A vs C</h1>
        <p className="text-white/40" style={{ fontSize: 12 }}>How the camera viewfinder handles "location not detected"</p>
      </div>

      {/* Cards */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-8">
        {/* Option A */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center rounded-full text-white font-bold flex-shrink-0"
              style={{ width: 22, height: 22, fontSize: 11, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >A</span>
            <span className="text-white font-semibold" style={{ fontSize: 13 }}>Two equal pills</span>
          </div>
          <OptionA />
          <div className="space-y-2 pt-1">
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5" style={{ fontSize: 10 }}>✓</span>
              <span className="text-white/55" style={{ fontSize: 11 }}>Both options visible immediately — no hidden flow</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5" style={{ fontSize: 10 }}>✓</span>
              <span className="text-white/55" style={{ fontSize: 11 }}>Equal weight means no wrong default assumption</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400/70 mt-0.5" style={{ fontSize: 10 }}>✗</span>
              <span className="text-white/55" style={{ fontSize: 11 }}>Two competing CTAs — slight hesitation deciding which to tap</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400/70 mt-0.5" style={{ fontSize: 10 }}>✗</span>
              <span className="text-white/55" style={{ fontSize: 11 }}>More visual weight on the viewfinder</span>
            </div>
          </div>
        </div>

        {/* Option C */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center rounded-full text-white font-bold flex-shrink-0"
              style={{ width: 22, height: 22, fontSize: 11, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
            >C</span>
            <span className="text-white font-semibold" style={{ fontSize: 13 }}>Primary pill + quiet escape</span>
          </div>
          <OptionC />
          <div className="space-y-2 pt-1">
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5" style={{ fontSize: 10 }}>✓</span>
              <span className="text-white/55" style={{ fontSize: 11 }}>Cleaner — one obvious action, one quiet fallback</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5" style={{ fontSize: 10 }}>✓</span>
              <span className="text-white/55" style={{ fontSize: 11 }}>Less visual noise on the viewfinder</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400/70 mt-0.5" style={{ fontSize: 10 }}>✗</span>
              <span className="text-white/55" style={{ fontSize: 11 }}>Assumes new project is the likely action — may not always be true</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400/70 mt-0.5" style={{ fontSize: 10 }}>✗</span>
              <span className="text-white/55" style={{ fontSize: 11 }}>Secondary link is easy to miss for first-time users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-white/25 text-center mt-10 max-w-sm" style={{ fontSize: 11 }}>
        Tap either option to preview the active state. Neither opens a sheet — this is layout only.
      </p>
    </div>
  );
}
