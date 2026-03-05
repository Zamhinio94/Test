import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Folder, Camera, Bell,
  ChevronLeft, ChevronRight, ArrowLeft, Check, X,
  ZapOff, RotateCcw,
} from "lucide-react";

const VIEWFINDER =
  "https://images.unsplash.com/photo-1748956628042-b73331e0b479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";

type Panel = 0 | 1 | 2;

// ─────────────────────────────────────────
// Shared screen panels
// ─────────────────────────────────────────

function ScreenCamera() {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <img src={VIEWFINDER} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.8 }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/65 pointer-events-none" />
      {/* grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/8" />
        <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/8" />
        <div className="absolute left-0 right-0 top-1/3 h-px bg-white/8" />
        <div className="absolute left-0 right-0 bottom-1/3 h-px bg-white/8" />
      </div>
      {/* top bar */}
      <div className="absolute left-0 right-0 flex justify-between items-center px-4" style={{ top: 52 }}>
        <div className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
          <ZapOff size={11} className="text-white/70" />
        </div>
        <div className="bg-black/50 rounded-full px-3 py-1">
          <span className="text-white font-semibold" style={{ fontSize: 9 }}>Kings Cross Quarter</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
          <RotateCcw size={11} className="text-white/70" />
        </div>
      </div>
      {/* focus brackets */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative" style={{ width: 72, height: 72, opacity: 0.5 }}>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white rounded-br-sm" />
        </div>
      </div>
      {/* shutter */}
      <div className="absolute bottom-16 left-0 right-0 flex items-center justify-center gap-6 pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
          <Folder size={13} className="text-white/70" />
        </div>
        <div className="w-14 h-14 rounded-full border-[2.5px] border-white/75 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-white" />
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-400" />
      </div>
    </div>
  );
}

function ScreenProjects({ back }: { back?: () => void }) {
  return (
    <div className="w-full h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0" style={{ height: 52 }} />
      <div className="flex items-center justify-between px-4 pb-2">
        {back ? (
          <button onClick={back} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <ChevronLeft size={11} className="text-gray-600" />
          </button>
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-blue-500" />
        )}
        <span className="font-bold text-gray-900" style={{ fontSize: 11 }}>Projects</span>
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-bold" style={{ fontSize: 9 }}>+</span>
        </div>
      </div>
      {/* search */}
      <div className="mx-4 mb-2 h-6 bg-white rounded-lg border border-gray-200 flex items-center px-2.5 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-sm bg-gray-300" />
        <div className="h-1.5 bg-gray-200 rounded flex-1" />
      </div>
      {/* filters */}
      <div className="flex gap-1.5 px-4 mb-2.5">
        {["All", "Live", "Done"].map((f) => (
          <div key={f} className={`rounded-full px-2 py-0.5 font-bold ${f === "All" ? "bg-gray-900 text-white" : "bg-white text-gray-400 border border-gray-200"}`} style={{ fontSize: 8 }}>{f}</div>
        ))}
      </div>
      {/* cards */}
      <div className="flex-1 px-4 space-y-2 overflow-hidden">
        {[
          { name: "Kings Cross Quarter", client: "Barratt Homes", pct: 65, live: true },
          { name: "Phase 2 – Piccadilly", client: "Taylor Wimpey", pct: 40, live: true },
          { name: "Riverside Quarter", client: "Berkeley Group", pct: 78, live: false },
        ].map((p) => (
          <div key={p.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0 relative overflow-hidden">
                <img src={VIEWFINDER} className="absolute inset-0 w-full h-full object-cover opacity-70" />
                {p.live && (
                  <div className="absolute top-0.5 left-0.5 flex items-center gap-0.5 bg-black/65 rounded-full px-1">
                    <div className="w-1 h-1 rounded-full bg-red-500" />
                    <span className="text-white font-bold" style={{ fontSize: 5 }}>LIVE</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate" style={{ fontSize: 9 }}>{p.name}</div>
                <div className="text-gray-400 truncate" style={{ fontSize: 8 }}>{p.client}</div>
              </div>
              <ChevronRight size={10} className="text-gray-300 flex-shrink-0" />
            </div>
            <div className="h-1 bg-gray-100">
              <div className="h-full bg-blue-500" style={{ width: `${p.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenInbox({ back }: { back?: () => void }) {
  return (
    <div className="w-full h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0" style={{ height: 52 }} />
      <div className="flex items-center justify-between px-4 pb-3">
        {back ? (
          <button onClick={back} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <ChevronLeft size={11} className="text-gray-600" />
          </button>
        ) : <div className="w-6" />}
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900" style={{ fontSize: 11 }}>Inbox</span>
          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold" style={{ fontSize: 7 }}>3</span>
          </div>
        </div>
        <div className="w-6" />
      </div>
      <div className="flex-1 px-4 space-y-2 overflow-hidden">
        {[
          { name: "Tom R.", msg: "mentioned you in Kings Cross Quarter", color: "from-orange-400 to-orange-500", accent: "border-l-blue-400", unread: true },
          { name: "Mike C.", msg: "added 4 photos to Kings Cross", color: "from-blue-400 to-blue-600", accent: "border-l-amber-400", unread: true },
          { name: "Sarah M.", msg: "requested access to Heritage Park", color: "from-pink-400 to-rose-500", accent: "border-l-rose-400", unread: false },
          { name: "Lisa W.", msg: "shared Riverside Quarter report", color: "from-purple-400 to-purple-600", accent: "border-l-purple-400", unread: false },
        ].map((n) => (
          <div key={n.name} className={`bg-white rounded-xl border-l-[3px] ${n.accent} border border-gray-100 p-2 flex items-center gap-2`} style={{ opacity: n.unread ? 1 : 0.5 }}>
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${n.color} flex-shrink-0 flex items-center justify-center`}>
              <span className="text-white font-bold" style={{ fontSize: 6 }}>{n.name.split(" ").map((w) => w[0]).join("")}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900" style={{ fontSize: 8 }}>{n.name}</div>
              <div className="text-gray-400 truncate" style={{ fontSize: 7 }}>{n.msg}</div>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Demo A — Current: Swipe + Pill Nav
// ─────────────────────────────────────────

const NAV_PANELS = [
  { label: "Projects", Icon: Folder },
  { label: "Camera", Icon: Camera },
  { label: "Inbox", Icon: Bell },
];

function DemoSwipePills() {
  const [active, setActive] = useState<Panel>(1);

  const isDark = active === 1;
  const left = active > 0 ? NAV_PANELS[active - 1] : null;
  const right = active < 2 ? NAV_PANELS[active + 1] : null;

  const pillBase = isDark
    ? "bg-white/[0.13] border border-white/[0.16] text-white/85"
    : "bg-white border border-gray-200 text-gray-700 shadow-sm";
  const dotCol = isDark ? "bg-white" : "bg-gray-800";

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Nav strip */}
      <div
        className={`flex items-center justify-between px-4 flex-shrink-0 ${isDark ? "bg-black" : "bg-gray-50/95"}`}
        style={{ height: 56 }}
      >
        <div className="flex-1">
          {left ? (
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setActive((active - 1) as Panel)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors ${pillBase}`}
            >
              <ChevronLeft size={12} strokeWidth={2.5} />
              <left.Icon size={12} strokeWidth={1.8} />
              <span className="font-semibold" style={{ fontSize: 10 }}>{left.label}</span>
            </motion.button>
          ) : <div />}
        </div>
        <div className="flex items-center gap-1.5 px-2">
          {([0, 1, 2] as Panel[]).map((i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full ${dotCol}`}
              animate={{ width: i === active ? 18 : 5, opacity: i === active ? 0.85 : 0.18 }}
              style={{ height: 5 }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
            />
          ))}
        </div>
        <div className="flex-1 flex justify-end">
          {right ? (
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setActive((active + 1) as Panel)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors ${pillBase}`}
            >
              <span className="font-semibold" style={{ fontSize: 10 }}>{right.label}</span>
              <right.Icon size={12} strokeWidth={1.8} />
              <ChevronRight size={12} strokeWidth={2.5} />
            </motion.button>
          ) : <div />}
        </div>
      </div>

      {/* Screen */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {active === 0 && <ScreenProjects />}
            {active === 1 && <ScreenCamera />}
            {active === 2 && <ScreenInbox />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Demo B — Option 1: Bottom Tab Bar
// ─────────────────────────────────────────

function DemoBottomTabs() {
  const [active, setActive] = useState<Panel>(1);

  const tabs = [
    { id: 0 as Panel, Icon: Folder, label: "Projects" },
    { id: 1 as Panel, Icon: Camera, label: "Camera" },
    { id: 2 as Panel, Icon: Bell, label: "Inbox" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0"
          >
            {active === 0 && <ScreenProjects />}
            {active === 1 && <ScreenCamera />}
            {active === 2 && <ScreenInbox />}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Tab bar */}
      <div
        className="flex-shrink-0 flex items-center justify-around border-t"
        style={{
          background: "rgba(250,250,252,0.97)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(0,0,0,0.1)",
          paddingTop: 10,
          paddingBottom: 26,
        }}
      >
        {tabs.map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="flex flex-col items-center gap-1 px-5"
          >
            <motion.div
              className="flex items-center justify-center rounded-2xl"
              style={{ background: "rgba(59,130,246,0)" }}
              animate={{
                background: active === id ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0)",
                width: 44, height: 32,
              }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
            >
              <Icon
                size={19}
                strokeWidth={active === id ? 2.4 : 1.7}
                className={active === id ? "text-blue-600" : "text-gray-400"}
              />
            </motion.div>
            <span
              className="font-semibold transition-colors"
              style={{ fontSize: 9, color: active === id ? "#2563eb" : "#9ca3af" }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Phone frame
// ─────────────────────────────────────────

const PW = 310;
const PH = Math.round(PW * (852 / 393));

function PhoneFrame({ children, selected }: { children: React.ReactNode; selected: boolean }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: PW, height: PH }}>
      {/* Glow when selected */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-[46px] pointer-events-none"
            style={{ boxShadow: "0 0 0 3px rgba(59,130,246,0.65), 0 0 48px 8px rgba(59,130,246,0.2)" }}
          />
        )}
      </AnimatePresence>

      {/* Frame shell */}
      <div
        className="absolute inset-0 rounded-[46px]"
        style={{
          background: "linear-gradient(145deg, #2e2e32 0%, #1c1c20 40%, #141416 100%)",
          boxShadow: "0 60px 100px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      />

      {/* Side buttons */}
      {[{ side: "left", top: 164, h: 38 }, { side: "left", top: 224, h: 80 }, { side: "left", top: 318, h: 80 }, { side: "right", top: 248, h: 104 }].map((b, i) => (
        <div key={i} className={`absolute ${b.side === "left" ? "rounded-l-sm" : "rounded-r-sm"}`}
          style={{ [b.side]: -2.5, top: b.top, width: 3, height: b.h, background: "#2c2c30" }} />
      ))}

      {/* Screen */}
      <div className="absolute rounded-[44px] overflow-hidden" style={{ inset: 3, background: "#000" }}>
        {/* Dynamic island */}
        <div
          className="absolute rounded-full z-50 pointer-events-none"
          style={{ top: 9, left: "50%", transform: "translateX(-50%)", width: 100, height: 30, background: "#000" }}
        />
        {children}
        {/* Home indicator */}
        <div
          className="absolute rounded-full pointer-events-none z-50"
          style={{ bottom: 8, left: "50%", transform: "translateX(-50%)", width: 80, height: 5, background: "rgba(255,255,255,0.22)" }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Comparison rows
// ─────────────────────────────────────────

const OPTION_A = {
  label: "Current",
  title: "Swipe + Pill Nav",
  tagline: "What you've already built",
  pros: [
    "Camera fills the whole screen",
    "Swipe feel is fast and fluid",
    "Context-aware — only shows adjacent screens",
    "Dot indicator tracks exact position",
  ],
  cons: [
    "New users won't know to swipe",
    "Pills disappear when on the edge panel",
    "Requires onboarding to explain the model",
  ],
};

const OPTION_B = {
  label: "Option 1",
  title: "Bottom Tab Bar",
  tagline: "Like WhatsApp, Instagram & most UK apps",
  pros: [
    "Every tradie already knows this pattern",
    "All three screens equally reachable — always",
    "No onboarding needed at all",
    "Works with dirty or gloved fingers",
  ],
  cons: [
    "Tab bar clips the bottom of the camera view",
    "Camera doesn't feel like the \"home\" screen",
  ],
};

type OptionKey = "A" | "B" | null;

// ─────────────────────────────────────────
// Main export
// ─────────────────────────────────────────

export function NavComparison({ onBack }: { onBack: () => void }) {
  const [picked, setPicked] = useState<OptionKey>(null);

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: "radial-gradient(ellipse 100% 80% at 50% 20%, #141428 0%, #080810 100%)" }}
    >
      {/* Header */}
      <div className="w-full px-8 pt-8 pb-6 flex items-start justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-5 transition-opacity hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}
          >
            <ArrowLeft size={14} />
            <span>Back to app</span>
          </button>
          <h1 className="text-white font-bold mb-1" style={{ fontSize: 28 }}>Which feels right?</h1>
          <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13 }}>
            Both work — tap inside each phone to try them live, then decide
          </p>
        </div>
      </div>

      {/* Phones + info */}
      <div className="flex gap-8 px-8 pb-4 items-start justify-center flex-wrap">
        {([["A", OPTION_A, <DemoSwipePills />], ["B", OPTION_B, <DemoBottomTabs />]] as [OptionKey, typeof OPTION_A, React.ReactNode][]).map(
          ([key, opt, demo]) => (
            <div key={key as string} className="flex flex-col" style={{ width: PW }}>
              {/* Option tag */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="rounded-full px-2.5 py-1 font-bold"
                  style={{
                    background: key === "A" ? "rgba(255,255,255,0.1)" : "rgba(59,130,246,0.2)",
                    color: key === "A" ? "rgba(255,255,255,0.65)" : "rgba(147,197,253,1)",
                    fontSize: 10,
                    border: key === "A" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  {opt.label}
                </div>
                <span className="text-white font-bold" style={{ fontSize: 15 }}>{opt.title}</span>
              </div>

              <PhoneFrame selected={picked === key}>
                {demo}
              </PhoneFrame>

              {/* Tagline */}
              <p className="mt-4 mb-4" style={{ color: "rgba(255,255,255,0.38)", fontSize: 11 }}>
                {opt.tagline}
              </p>

              {/* Pros */}
              <div className="space-y-1.5 mb-2">
                {opt.pros.map((p) => (
                  <div key={p} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-px" style={{ background: "rgba(34,197,94,0.14)" }}>
                      <Check size={8} className="text-emerald-400" strokeWidth={2.5} />
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.58)", fontSize: 11.5 }}>{p}</span>
                  </div>
                ))}
              </div>

              {/* Cons */}
              <div className="space-y-1.5 mb-6">
                {opt.cons.map((c) => (
                  <div key={c} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-px" style={{ background: "rgba(239,68,68,0.12)" }}>
                      <X size={8} className="text-red-400" strokeWidth={2.5} />
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.32)", fontSize: 11.5 }}>{c}</span>
                  </div>
                ))}
              </div>

              {/* Pick button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setPicked(picked === key ? null : key)}
                className="w-full rounded-2xl font-semibold transition-all"
                style={{
                  padding: "13px 0",
                  fontSize: 13,
                  background: picked === key ? "#3b82f6" : "rgba(255,255,255,0.07)",
                  color: picked === key ? "#fff" : "rgba(255,255,255,0.45)",
                  border: picked === key ? "none" : "1px solid rgba(255,255,255,0.09)",
                }}
              >
                {picked === key ? "✓  This one" : "Pick this"}
              </motion.button>
            </div>
          )
        )}
      </div>

      {/* Combined note */}
      <div
        className="mx-8 mb-10 rounded-2xl px-5 py-4 max-w-2xl"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="font-semibold text-white mb-1" style={{ fontSize: 12 }}>💡 They can be combined</p>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, lineHeight: 1.6 }}>
          Bottom Tab Bar handles navigation for everyone on day one. Swipe gestures still work as a power-user shortcut for tradies who pick it up naturally — no conflict, both coexist.
        </p>
      </div>
    </div>
  );
}