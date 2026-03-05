import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

interface Props {
  onBack: () => void;
}

/* ── Camera icon SVG shared between both variants ────────────── */
function CameraIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M2 8.5C2 7.4 2.9 6.5 4 6.5h3.4l1.4-2h5.4l1.4 2H20c1.1 0 2 .9 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.5z"
        fill={color}
      />
      <circle cx="12" cy="13.5" r="4" fill={color === "#fff" ? "#3478F6" : "#fff"} />
      <circle cx="12" cy="13.5" r="2.7" fill={color} />
      <circle cx="12" cy="13.5" r="1.1" fill={color === "#fff" ? "#3478F6" : "#fff"} />
    </svg>
  );
}

/* ── Simulated phone shell ────────────────────────────────────── */
function PhoneShell({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Phone */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{
          width: 220,
          height: 440,
          borderRadius: 36,
          background: "#0a0a0a",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Dynamic island */}
        <div
          className="absolute rounded-full z-20"
          style={{
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 90,
            height: 26,
            background: "#000",
          }}
        />

        {/* Screen — projects list mockup */}
        <div className="absolute inset-0 flex flex-col" style={{ background: "#F4F7FD" }}>
          {/* Status bar area */}
          <div style={{ height: 44 }} />

          {/* Mini project cards */}
          <div className="px-3 flex flex-col gap-2 pt-1">
            {["Kings Cross Quarter", "Phase 2 – Piccadilly", "Riverside Quarter"].map((name, i) => (
              <div
                key={name}
                className="rounded-2xl px-3 py-2.5 flex items-center gap-2.5"
                style={{ background: "#fff", opacity: 1 - i * 0.12 }}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#0D9488" }} />
                <div className="flex-1 min-w-0">
                  <div className="h-2 rounded-full" style={{ background: "#0E1F40", width: "80%", opacity: 0.85 }} />
                  <div className="h-1.5 rounded-full mt-1" style={{ background: "#9CA3AF", width: "55%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Home bar */}
        <div
          className="absolute bottom-2 left-0 right-0 flex justify-center z-10 pointer-events-none"
          style={{ bottom: 6 }}
        >
          <div className="h-1 w-20 rounded-full" style={{ background: "rgba(0,0,0,0.22)" }} />
        </div>

        {/* FAB slot */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center z-10"
          style={{ bottom: 22 }}
        >
          {children}
        </div>
      </div>

      {/* Label beneath phone */}
      <p
        className="text-center"
        style={{ fontSize: 13, fontWeight: 700, color: "#0E1F40", letterSpacing: "-0.01em" }}
      >
        {label}
      </p>
    </div>
  );
}

/* ── VARIANT A — current: wide blue capsule pill ─────────────── */
function PillVariant() {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      className="relative flex items-center rounded-full"
      style={{
        background: "#3478F6",
        height: 60,
        paddingLeft: 20,
        paddingRight: 28,
        gap: 10,
        boxShadow: "0 8px 24px rgba(52,120,246,0.5)",
      }}
    >
      <CameraIcon color="#fff" />
      <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
        Snap
      </span>
      {/* Orange dot */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: "#F97316",
          border: "2px solid #3478F6",
        }}
      />
    </motion.button>
  );
}

/* ── VARIANT B — new: white circle shutter ───────────────────── */
function CircleVariant() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.button
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 72,
          height: 72,
          background: "#fff",
          border: "2px solid rgba(52,120,246,0.15)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
        }}
      >
        <CameraIcon color="#3478F6" />
        {/* Orange dot */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: "#F97316",
            border: "2px solid #fff",
          }}
        />
      </motion.button>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#3478F6", letterSpacing: "-0.01em" }}>
        Snap
      </span>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export function ShutterComparison({ onBack }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F4F7FD", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10"
        style={{
          background: "#0E1F40",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.10)" }}
        >
          <ArrowLeft size={15} color="#fff" strokeWidth={2} />
        </button>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Camera button — style comparison</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
            Current pill vs. white circle shutter
          </p>
        </div>
      </div>

      {/* Side-by-side phones */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="flex items-start gap-10 justify-center flex-wrap">
          <PhoneShell label="Current — blue pill">
            <PillVariant />
          </PhoneShell>

          {/* VS divider */}
          <div className="flex items-center self-center">
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                background: "#E5E7EB",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: "#6B7280", letterSpacing: "0.02em" }}>
                VS
              </span>
            </div>
          </div>

          <PhoneShell label="New — white circle shutter">
            <CircleVariant />
          </PhoneShell>
        </div>
      </div>

      {/* Notes strip */}
      <div
        className="mx-5 mb-8 rounded-2xl px-5 py-4 flex flex-col gap-3"
        style={{ background: "#fff", border: "1px solid #E5E7EB" }}
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <p style={{ fontSize: 12, fontWeight: 700, color: "#3478F6", marginBottom: 4 }}>Blue pill</p>
            <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.55 }}>
              Wide, label-forward. Takes more horizontal space. Blue background makes it feel like a CTA button.
            </p>
          </div>
          <div className="flex-1">
            <p style={{ fontSize: 12, fontWeight: 700, color: "#0E1F40", marginBottom: 4 }}>White circle</p>
            <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.55 }}>
              Compact shutter shape — matches the in-app shutter button. White floats cleanly over any background. Blue icon + label below ties to brand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
