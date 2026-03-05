import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check } from "lucide-react";

/* ─── Aperture SVG icon — lens rings, not camera body ──────── */
function ApertureIcon({ size = 28, color = "#fff", strokeWidth = 1.6 }: { size?: number; color?: string; strokeWidth?: number }) {
  const r1 = size * 0.44;
  const r2 = size * 0.28;
  const r3 = size * 0.12;
  const cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx} cy={cx} r={r1} stroke={color} strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cx} r={r2} stroke={color} strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cx} r={r3} fill={color} />
    </svg>
  );
}

/* ─── Squircle clip path helper ─────────────────────────────── */
function Squircle({ size = 64, bg, children, glow }: { size: number; bg: string; children: React.ReactNode; glow?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.30),
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: glow ?? "none",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Mini phone bottom — shows button in situ ──────────────── */
function PhoneBottom({ children, bg = "dark" }: { children: React.ReactNode; bg?: "dark" | "light" }) {
  return (
    <div
      className="relative overflow-hidden flex flex-col justify-end"
      style={{
        width: 200,
        height: 130,
        borderRadius: 20,
        background: bg === "dark"
          ? "linear-gradient(to top, #0a0f1e 0%, #1a2744 55%, #2a3a5e 100%)"
          : "linear-gradient(to top, #e8edf7 0%, #f0f4fb 60%, #dde4f0 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Simulated status elements */}
      {bg === "dark" && (
        <div className="absolute top-3 left-0 right-0 flex justify-center opacity-30">
          <div className="h-0.5 w-12 rounded-full bg-white" />
        </div>
      )}
      {bg === "light" && (
        <div className="absolute top-4 left-4 right-4 h-6 rounded-lg opacity-20" style={{ background: "#0E1F40" }} />
      )}
      {/* Button area */}
      <div className="flex items-center justify-center pb-5">
        {children}
      </div>
      {/* Home bar */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <div className="h-1 w-10 rounded-full" style={{ background: bg === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)" }} />
      </div>
    </div>
  );
}

/* ─── Option card ────────────────────────────────────────────── */
function OptionCard({
  label,
  tag,
  description,
  pros,
  con,
  selected,
  onSelect,
  phone,
  accent,
}: {
  label: string;
  tag: string;
  description: string;
  pros: string[];
  con: string;
  selected: boolean;
  onSelect: () => void;
  phone: React.ReactNode;
  accent: string;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={onSelect}
      className="flex flex-col cursor-pointer rounded-2xl overflow-hidden"
      style={{
        border: selected ? `2px solid ${accent}` : "2px solid #E5E7EB",
        background: "#fff",
      }}
    >
      {/* Preview area */}
      <div
        className="flex items-center justify-center py-5"
        style={{ background: "#F4F7FD" }}
      >
        {phone}
      </div>

      {/* Info */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span
              className="inline-block rounded-full px-2 py-0.5 mb-1.5"
              style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", background: `${accent}18`, color: accent }}
            >
              {tag}
            </span>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#0E1F40" }}>{label}</p>
          </div>
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
            style={{
              width: 22, height: 22,
              background: selected ? accent : "#F3F4F6",
              border: selected ? `2px solid ${accent}` : "2px solid #E5E7EB",
              transition: "all 0.2s",
            }}
          >
            {selected && <Check size={11} color="#fff" strokeWidth={3} />}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{description}</p>

        <div className="flex flex-col gap-1.5">
          {pros.map(p => (
            <div key={p} className="flex items-start gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-px" style={{ background: "#F0FDF4" }}>
                <Check size={8} color="#16A34A" strokeWidth={3} />
              </div>
              <span style={{ fontSize: 11, color: "#374151" }}>{p}</span>
            </div>
          ))}
          <div className="flex items-start gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-px" style={{ background: "#FEF2F2" }}>
              <span style={{ fontSize: 8, color: "#DC2626", fontWeight: 700, lineHeight: 1 }}>✕</span>
            </div>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{con}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── The 4 button variants ─────────────────────────────────── */

// A — Navy pill + "Shoot"
function ButtonA() {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      className="flex items-center gap-2.5 rounded-full"
      style={{
        background: "#0E1F40",
        height: 52,
        paddingLeft: 20,
        paddingRight: 24,
        boxShadow: "0 0 0 4px rgba(249,115,22,0.18), 0 8px 20px rgba(14,31,64,0.45)",
      }}
    >
      <ApertureIcon size={22} color="#fff" strokeWidth={1.5} />
      <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>Shoot</span>
    </motion.button>
  );
}

// B — Orange pill + "Capture"
function ButtonB() {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      className="flex items-center gap-2.5 rounded-full"
      style={{
        background: "#F97316",
        height: 52,
        paddingLeft: 20,
        paddingRight: 24,
        boxShadow: "0 8px 24px rgba(249,115,22,0.50), 0 2px 8px rgba(249,115,22,0.30)",
      }}
    >
      <ApertureIcon size={22} color="#fff" strokeWidth={1.5} />
      <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>Capture</span>
    </motion.button>
  );
}

// C — Black squircle, aperture-only (no text)
function ButtonC() {
  return (
    <motion.button whileTap={{ scale: 0.94 }}>
      <Squircle
        size={62}
        bg="#0a0a0a"
        glow="0 0 0 3px rgba(249,115,22,0.30), 0 0 0 6px rgba(249,115,22,0.10), 0 10px 24px rgba(0,0,0,0.55)"
      >
        <ApertureIcon size={28} color="#fff" strokeWidth={1.4} />
      </Squircle>
    </motion.button>
  );
}

// D — Periwinkle/slate pill from reference palette
function ButtonD() {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      className="flex items-center gap-2.5 rounded-full"
      style={{
        background: "#4A6CF7",
        height: 52,
        paddingLeft: 20,
        paddingRight: 24,
        boxShadow: "0 8px 22px rgba(74,108,247,0.45), 0 2px 8px rgba(74,108,247,0.25)",
      }}
    >
      <ApertureIcon size={22} color="#fff" strokeWidth={1.5} />
      <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>Shoot</span>
    </motion.button>
  );
}

/* ─── Current (baseline) ─────────────────────────────────────── */
function ButtonCurrent() {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      className="rounded-full flex items-center justify-center"
      style={{
        width: 72, height: 72,
        background: "#3478F6",
        boxShadow: "0 8px 24px rgba(249,115,22,0.35), 0 0 0 3px rgba(249,115,22,0.15)",
      }}
    >
      {/* Standard camera icon (lucide-style) */}
      <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </motion.button>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
interface FABComparisonProps {
  onBack: () => void;
}

const OPTIONS = [
  {
    id: "A",
    label: "Navy Pill — \"Shoot\"",
    tag: "On-brand",
    accent: "#0E1F40",
    description: "Uses the brand identity colour as the button. The aperture icon replaces the camera body. The orange ring glow is the only warm touch.",
    pros: ["Nothing like CompanyCam", "Navy = our identity colour", "Text labels it as action not logo"],
    con: "May not pop against dark camera viewfinder",
    bg: "dark" as const,
    Button: ButtonA,
  },
  {
    id: "B",
    label: "Orange Pill — \"Capture\"",
    tag: "Boldest",
    accent: "#F97316",
    description: "Promotes the orange accent to the primary CTA. High contrast on any background. Zero brand confusion risk.",
    pros: ["Impossible to confuse with CompanyCam", "Very visible in the field", "Warm, energetic feel"],
    con: "Orange used sparingly elsewhere — this elevates it",
    bg: "dark" as const,
    Button: ButtonB,
  },
  {
    id: "C",
    label: "Black Squircle",
    tag: "Most distinct",
    accent: "#111111",
    description: "A rounded square instead of a circle. Aperture-only — no text, no camera body. The shape itself breaks the CompanyCam pattern.",
    pros: ["Shape is completely different", "Feels premium / tool-like", "Orange glow is the sole accent"],
    con: "No text — relies on icon alone for affordance",
    bg: "dark" as const,
    Button: ButtonC,
  },
  {
    id: "D",
    label: "Periwinkle Pill",
    tag: "New palette",
    accent: "#4A6CF7",
    description: "Pulls from the reference palette — a cooler, more periwinkle blue. Still a pill with text. Different hue from CompanyCam's cyan-blue.",
    pros: ["Fresh from the reference colour scheme", "Still clearly action-oriented", "Familiar pill shape"],
    con: "Still a blue pill — similar form to CompanyCam even if different hue",
    bg: "light" as const,
    Button: ButtonD,
  },
];

export function FABComparison({ onBack }: FABComparisonProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F4F7FD", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10"
        style={{ background: "#0E1F40", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.10)" }}
        >
          <ArrowLeft size={15} color="#fff" strokeWidth={2} />
        </button>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Camera button options</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>4 directions — pick one to apply</p>
        </div>
      </div>

      {/* Baseline reference */}
      <div className="px-5 pt-5 pb-3">
        <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
          Current (CompanyCam problem)
        </p>
        <div
          className="flex items-center gap-4 rounded-2xl px-4 py-4"
          style={{ background: "#fff", border: "2px solid #FCA5A5" }}
        >
          <PhoneBottom bg="dark">
            <ButtonCurrent />
          </PhoneBottom>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0E1F40" }}>Blue circle + camera icon</p>
            <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4, lineHeight: 1.5 }}>
              Identical to CompanyCam's logo. Blue circle, white camera body icon, centred. Direct competitors in the UK construction market.
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-5 pb-2 pt-1">
        <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Proposed options
        </p>
      </div>

      {/* Options grid */}
      <div className="px-5 pb-8 grid grid-cols-2 gap-3">
        {OPTIONS.map(opt => {
          const { Button } = opt;
          return (
            <OptionCard
              key={opt.id}
              label={opt.label}
              tag={opt.tag}
              accent={opt.accent}
              description={opt.description}
              pros={opt.pros}
              con={opt.con}
              selected={selected === opt.id}
              onSelect={() => setSelected(opt.id === selected ? null : opt.id)}
              phone={
                <PhoneBottom bg={opt.bg}>
                  <Button />
                </PhoneBottom>
              }
            />
          );
        })}
      </div>

      {/* Sticky apply bar */}
      <div
        className="sticky bottom-0 px-5 py-4 flex items-center gap-3"
        style={{ background: "#fff", borderTop: "1px solid #E5E7EB" }}
      >
        {selected ? (
          <>
            <div className="flex-1">
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0E1F40" }}>
                Option {selected} selected
              </p>
              <p style={{ fontSize: 11, color: "#9CA3AF" }}>
                {OPTIONS.find(o => o.id === selected)?.label}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-full px-5"
              style={{ height: 44, background: "#0E1F40" }}
            >
              <Check size={14} color="#fff" strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Apply this option</span>
            </motion.button>
          </>
        ) : (
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>Tap an option to select it</p>
        )}
      </div>
    </div>
  );
}
