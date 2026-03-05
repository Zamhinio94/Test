import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera, ArrowRight, Share2, PencilLine, Users,
  MapPin, Check, CheckCircle2, Link2, Mail, Image,
  Folder, ChevronRight,
} from "lucide-react";

interface OnboardingScreenProps {
  onDone: () => void;
}

/* ─── Step definitions ───────────────────────────────────────── */

const STEPS = [
  {
    id: "capture",
    eyebrow: "Step 1 of 4",
    title: "Shoot & tag in one tap",
    desc: "Photos land straight on the right job — GPS-pinned, timestamped, never lost in a camera roll.",
    accent: "#3478F6",
    accentDim: "rgba(52,120,246,0.15)",
  },
  {
    id: "invite",
    eyebrow: "Step 2 of 4",
    title: "Invite your whole team",
    desc: "Share a link, scan a QR code, or send via WhatsApp — everyone's in the same project instantly.",
    accent: "#1D3D8A",
    accentDim: "rgba(29,61,138,0.15)",
  },
  {
    id: "projects",
    eyebrow: "Step 3 of 4",
    title: "All your jobs in one place",
    desc: "Every project, every photo — searchable, labelled, and organised by site.",
    accent: "#0D9488",
    accentDim: "rgba(13,148,136,0.15)",
  },
  {
    id: "share",
    eyebrow: "Step 4 of 4",
    title: "Share with clients & contractors",
    desc: "Export a PDF report, send a live link, or WhatsApp photos straight from the job.",
    accent: "#D97706",
    accentDim: "rgba(217,119,6,0.15)",
  },
] as const;

/* ─── Per-step illustrations ─────────────────────────────────── */

function IllustrationCapture() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3" style={{ height: 172 }}>
      {/* Viewfinder */}
      <div className="relative flex items-center justify-center rounded-2xl overflow-hidden"
        style={{ width: 148, height: 110, background: "rgba(52,120,246,0.08)", border: "1.5px solid rgba(52,120,246,0.2)" }}>
        {/* Corner brackets */}
        {[["top-2 left-2","border-t-2 border-l-2"],["top-2 right-2","border-t-2 border-r-2"],["bottom-2 left-2","border-b-2 border-l-2"],["bottom-2 right-2","border-b-2 border-r-2"]].map(([pos, bdr], i) => (
          <div key={i} className={`absolute w-4 h-4 ${pos} ${bdr}`} style={{ borderColor: "#3478F6", borderRadius: 2 }} />
        ))}
        {/* Grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(52,120,246,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(52,120,246,0.07) 1px,transparent 1px)",
          backgroundSize: "37px 37px"
        }} />
        {/* Centre reticle */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(52,120,246,0.18)", border: "1.5px solid rgba(52,120,246,0.4)" }}>
          <Camera size={14} style={{ color: "#3478F6" }} strokeWidth={2} />
        </div>
      </div>
      {/* Tag chips */}
      <div className="flex items-center gap-2">
        {[
          { icon: MapPin, label: "Kings Cross, London" },
          { icon: Check, label: "Tagged" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(52,120,246,0.12)", border: "1px solid rgba(52,120,246,0.22)" }}>
            <Icon size={10} style={{ color: "#3478F6" }} strokeWidth={2.2} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "#3478F6" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IllustrationInvite() {
  const members = [
    { initials: "JW", color: "#3b82f6" },
    { initials: "SC", color: "#8b5cf6" },
    { initials: "MP", color: "#10b981" },
    { initials: "RH", color: "#f59e0b" },
  ];
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4" style={{ height: 172 }}>
      {/* Avatar cluster */}
      <div className="flex items-center">
        {members.map((m, i) => (
          <div key={m.initials}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 40, height: 40, background: m.color,
              border: "2.5px solid rgba(16,16,22,0.9)",
              marginLeft: i === 0 ? 0 : -10, zIndex: members.length - i,
            }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{m.initials}</span>
          </div>
        ))}
        {/* +3 bubble */}
        <div className="flex items-center justify-center rounded-full"
          style={{ width: 40, height: 40, background: "rgba(59,77,181,0.2)", border: "2.5px solid rgba(16,16,22,0.9)", marginLeft: -10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#a5b4fc" }}>+3</span>
        </div>
      </div>
      {/* Share methods */}
      <div className="flex items-center gap-2">
        {[
          { icon: Link2, label: "Link", bg: "rgba(59,77,181,0.14)", col: "#818cf8" },
          { icon: Share2, label: "WhatsApp", bg: "rgba(37,211,102,0.14)", col: "#25D366" },
          { icon: Mail, label: "Email", bg: "rgba(255,255,255,0.07)", col: "rgba(255,255,255,0.5)" },
        ].map(({ icon: Icon, label, bg, col }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: bg, border: "1px solid rgba(255,255,255,0.08)" }}>
              <Icon size={15} style={{ color: col }} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IllustrationProjects() {
  const projects = [
    { name: "Kings Cross Quarter", client: "Barratt Homes", photos: 24, status: "Live", statusBg: "rgba(34,197,94,0.15)", statusCol: "#22C55E" },
    { name: "Phase 2 – Piccadilly", client: "Taylor Wimpey", photos: 41, status: "Live", statusBg: "rgba(34,197,94,0.15)", statusCol: "#22C55E" },
    { name: "Riverside Quarter", client: "Berkeley Group", photos: 18, status: "Complete", statusBg: "rgba(13,148,136,0.15)", statusCol: "#0D9488" },
  ];
  return (
    <div className="w-full flex flex-col gap-1.5" style={{ height: 172 }}>
      {projects.map((p, i) => (
        <motion.div key={p.name}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 + i * 0.07 }}
          className="flex items-center gap-2.5 px-3 rounded-xl"
          style={{ height: 50, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(13,148,136,0.18)" }}>
            <Folder size={13} style={{ color: "#0D9488" }} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 11, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{p.client} · {p.photos} photos</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: p.statusBg }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: p.statusCol }}>{p.status}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function IllustrationShare() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3" style={{ height: 172 }}>
      {/* PDF card */}
      <div className="flex items-center gap-3 px-3.5 rounded-2xl w-full"
        style={{ height: 52, background: "rgba(217,119,6,0.12)", border: "1px solid rgba(217,119,6,0.25)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(217,119,6,0.22)" }}>
          <Image size={15} style={{ color: "#D97706" }} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Export PDF Report</p>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>All 41 photos · Kings Cross Quarter</p>
        </div>
        <ChevronRight size={13} style={{ color: "rgba(255,255,255,0.25)" }} />
      </div>

      {/* Share methods row */}
      <div className="flex items-center gap-2 w-full">
        {[
          { label: "WhatsApp", bg: "rgba(37,211,102,0.13)", col: "#25D366", icon: Share2 },
          { label: "Live link", bg: "rgba(52,120,246,0.13)", col: "#3478F6", icon: Link2 },
          { label: "Done", bg: "rgba(13,148,136,0.13)", col: "#0D9488", icon: CheckCircle2 },
        ].map(({ label, bg, col, icon: Icon }) => (
          <div key={label} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl"
            style={{ height: 38, background: bg, border: `0.5px solid ${col}44` }}>
            <Icon size={12} style={{ color: col }} strokeWidth={2.2} />
            <span style={{ fontSize: 10, fontWeight: 600, color: col }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ILLUSTRATIONS = [IllustrationCapture, IllustrationInvite, IllustrationProjects, IllustrationShare];

/* ─── Main component ─────────────────────────────────────────── */

export function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [dismissed, setDismissed] = useState(false);

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Illustration = ILLUSTRATIONS[step];

  const goNext = () => {
    if (isLast) {
      setDismissed(true);
      setTimeout(onDone, 320);
    } else {
      setDir(1);
      setStep(s => s + 1);
    }
  };

  const goTo = (i: number) => {
    setDir(i > step ? 1 : -1);
    setStep(i);
  };

  const slideVariants = {
    enter:  (d: number) => ({ x: d * 28, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: -d * 28, opacity: 0 }),
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-5"
      style={{ background: "rgba(0,0,0,0.62)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      animate={dismissed ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.28 }}
    >
      {/* Dynamic island clearance */}
      <div style={{ height: 52 }} />

      {/* ── Glass card ── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        className="w-full rounded-[28px] overflow-hidden flex flex-col"
        style={{
          background: "rgba(14,14,20,0.92)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(52px)",
          WebkitBackdropFilter: "blur(52px)",
        }}
      >
        {/* Logo strip */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-5"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
          <div>
            <p className="text-white font-bold" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>JobPics</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
              Site photos. Instant visibility.
            </p>
          </div>
        </div>

        {/* Step content — animated */}
        <div className="px-5 pt-5 pb-2 overflow-hidden" style={{ minHeight: 290 }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 420, damping: 38 }}
            >
              {/* Eyebrow */}
              <p style={{ fontSize: 11, fontWeight: 600, color: current.accent, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                {current.eyebrow}
              </p>

              {/* Illustration area */}
              <div className="w-full rounded-2xl flex items-center justify-center px-2 py-3 mb-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
                <Illustration />
              </div>

              {/* Title */}
              <p className="text-white font-bold" style={{ fontSize: 18, lineHeight: 1.25, marginBottom: 6 }}>
                {current.title}
              </p>

              {/* Description */}
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
                {current.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 py-4">
          {STEPS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              animate={{
                width: i === step ? 20 : 6,
                background: i === step ? current.accent : "rgba(255,255,255,0.18)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="rounded-full"
              style={{ height: 6 }}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="px-5 pb-6">
          <motion.button
            onClick={goNext}
            whileTap={{ scale: 0.97 }}
            animate={{ background: current.accent }}
            transition={{ duration: 0.22 }}
            className="w-full flex items-center justify-center gap-2 rounded-full"
            style={{ height: 52 }}
          >
            <span className="text-white font-semibold" style={{ fontSize: 15 }}>
              {isLast ? "Let's go" : "Next"}
            </span>
            <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1" />
    </motion.div>
  );
}