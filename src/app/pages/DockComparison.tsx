import React from "react";
import { ArrowLeft, Home, UserPlus, Zap, Bell, FolderOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router";

// Replaced figma:asset imports — not supported outside Figma Make
const exampleYosee    = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600";
const exampleFloating = "https://images.unsplash.com/photo-1551650975-87deedd944c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600";

/* ─── Shared camera icon ─────────────────────────────────────── */
function CamIcon({ color, size = 22 }: { color: string; size?: number }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path
        d="M2 8.5C2 7.4 2.9 6.5 4 6.5h3.4l1.4-2h5.4l1.4 2H20c1.1 0 2 .9 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.5z"
        fill={color}
      />
      <circle cx="12" cy="13.5" r="3.8" fill={color === "#fff" ? "#3478F6" : "#fff"} />
      <circle cx="12" cy="13.5" r="2.4" fill={color} />
      <circle cx="12" cy="13.5" r="1" fill={color === "#fff" ? "#3478F6" : "#fff"} />
    </svg>
  );
}

/* ─── Shutter ring helper (classic camera shutter look) ─────── */
function ShutterButton({
  size = 68,
  fill,
  border,
  innerFill,
  icon,
}: {
  size?: number;
  fill: string;
  border: string;
  innerFill?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: fill,
        border: `3px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {innerFill ? (
        <div
          style={{
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: "50%",
            background: innerFill,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      ) : (
        icon
      )}
    </div>
  );
}

/* ─── Mini phone shell ───────────────────────────────────────── */
function Phone({ children, bg = "#F4F7FD" }: { children: React.ReactNode; bg?: string }) {
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden flex flex-col"
      style={{
        width: 210,
        height: 420,
        borderRadius: 34,
        background: "#0a0a0a",
        boxShadow: "0 28px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Dynamic island */}
      <div
        className="absolute rounded-full z-20 pointer-events-none"
        style={{ top: 9, left: "50%", transform: "translateX(-50%)", width: 80, height: 24, background: "#000" }}
      />

      {/* Screen */}
      <div className="absolute inset-[2px] rounded-[32px] overflow-hidden flex flex-col" style={{ background: bg }}>
        {/* Status bar gap */}
        <div style={{ height: 42 }} />

        {/* Simulated project cards */}
        <div className="px-3 flex flex-col gap-1.5 flex-1">
          {["Kings Cross Quarter", "Phase 2 – Piccadilly", "Riverside Quarter"].map((name, i) => (
            <div
              key={name}
              className="rounded-xl px-3 py-2 flex items-center gap-2"
              style={{ background: "#fff", opacity: 1 - i * 0.1 }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#0D9488" }} />
              <div className="flex-1 min-w-0">
                <div className="h-2 rounded-full mb-1" style={{ background: "#0E1F40", opacity: 0.75, width: "82%" }} />
                <div className="h-1.5 rounded-full" style={{ background: "#9CA3AF", width: "50%" }} />
              </div>
            </div>
          ))}
        </div>

        {/* FAB / dock area */}
        <div className="relative flex items-end justify-center" style={{ paddingBottom: 20, minHeight: 96 }}>
          {children}
        </div>

        {/* Home bar */}
        <div className="flex justify-center pb-2">
          <div className="h-1 w-16 rounded-full" style={{ background: "rgba(0,0,0,0.18)" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Option card ────────────────────────────────────────────── */
function OptionCard({
  number,
  title,
  note,
  children,
}: {
  number: number;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden"
      style={{ background: "#fff", border: "1.5px solid #E5E7EB" }}
    >
      {/* Phone preview */}
      <div
        className="flex items-center justify-center py-6"
        style={{ background: "#F0F4FB" }}
      >
        {children}
      </div>

      {/* Label */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#0E1F40" }}
          >
            <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>{number}</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0E1F40" }}>{title}</p>
        </div>
        <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.55 }}>{note}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CURRENT — Proportionally scaled replica of the live pill FAB.
   Phone mockup is 210px wide vs ~430px real → scale ≈ 0.5×
   Real values: h:60 pl:20 pr:28 gap:10 cam:28 text:17
   Scaled:      h:30 pl:10 pr:14 gap:5  cam:14 text:9
══════════════════════════════════════════════════════════════ */
function OptCurrent() {
  return (
    <Phone>
      <div style={{ position: "relative", display: "inline-flex" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "#3478F6",
            borderRadius: 999,
            paddingLeft: 10,
            paddingRight: 14,
            height: 30,
          }}
        >
          {/* Camera SVG — white body, blue inner rings, scaled to 14px */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M2 8.5C2 7.4 2.9 6.5 4 6.5h3.4l1.4-2h5.4l1.4 2H20c1.1 0 2 .9 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.5z" fill="white" />
            <circle cx="12" cy="13.5" r="4" fill="#3478F6" />
            <circle cx="12" cy="13.5" r="2.7" fill="white" />
            <circle cx="12" cy="13.5" r="1.1" fill="#3478F6" />
          </svg>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>Snap</span>
        </div>
        {/* Orange flash badge — top-right, like 6o */}
        <div
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            width: 13,
            height: 13,
            borderRadius: "50%",
            background: "#F97316",
            border: "1.5px solid #3478F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zap size={6} color="#fff" strokeWidth={2.5} fill="#fff" />
        </div>
      </div>
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   OPTION 1 — Current: wide blue capsule pill
══════════════════════════════════════════════════════════════ */
function Opt1() {
  return (
    <Phone>
      <div
        className="flex items-center rounded-full"
        style={{
          background: "#3478F6",
          border: "2px solid #1D3D8A",
          height: 46,
          paddingLeft: 14,
          paddingRight: 10,
          gap: 7,
        }}
      >
        {/* Camera with flash badge pinned to its top-right */}
        <div className="relative" style={{ flexShrink: 0 }}>
          <CamIcon color="#fff" size={26} />
          <div
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#fff",
              border: "1.5px solid #1D3D8A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={6} color="#1D3D8A" strokeWidth={2.5} fill="#1D3D8A" />
          </div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.08em", fontStyle: "italic" }}>
          SNAP
        </span>
      </div>
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   OPTION 1b — Same pill, blue diagonal gradient
   #62A8EE (top-right light sky) → #2B5EC8 (bottom-left deep blue)
══════════════════════════════════════════════════════════════ */
function Opt1b() {
  return (
    <Phone>
      <div
        className="flex items-center rounded-full"
        style={{
          background: "linear-gradient(135deg, #62A8EE 0%, #2B5EC8 100%)",
          border: "2px solid #1D3D8A",
          height: 46,
          paddingLeft: 14,
          paddingRight: 10,
          gap: 7,
        }}
      >
        <div className="relative" style={{ flexShrink: 0 }}>
          <CamIcon color="#fff" size={26} />
          <div
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#fff",
              border: "1.5px solid #1D3D8A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={6} color="#1D3D8A" strokeWidth={2.5} fill="#1D3D8A" />
          </div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.08em", fontStyle: "italic" }}>
          SNAP
        </span>
      </div>
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   OPTION 2 — White circle shutter, blue border, Snap inside, flash top-right
══════════════════════════════════════════════════════════════ */
function Opt2() {
  return (
    <Phone bg="#ECEEF8">
      <div className="relative flex items-center justify-center" style={{ width: 58, height: 58 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "#fff",
            border: "2.5px solid #1D3D8A",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CamIcon color="#1D3D8A" size={20} />
          <span style={{ fontSize: 8, fontWeight: 800, color: "#0E1F40", letterSpacing: "0.04em" }}>SNAP</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#F97316",
            border: "2px solid #ECEEF8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zap size={9} color="#fff" strokeWidth={2.5} fill="#fff" />
        </div>
      </div>
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   OPTION 2b — Light sky-blue fill circle, dark teal border/icon
══════════════════════════════════════════════════════════════ */
function Opt2b() {
  return (
    <Phone bg="#F0F9FF">
      <div className="relative flex items-center justify-center" style={{ width: 58, height: 58 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "#E4F4FC",
            border: "2.5px solid #0B6B8A",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CamIcon color="#0B6B8A" size={20} />
          <span style={{ fontSize: 8, fontWeight: 800, color: "#0B4D6A", letterSpacing: "0.04em" }}>SNAP</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#F97316",
            border: "2px solid #F0F9FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zap size={9} color="#fff" strokeWidth={2.5} fill="#fff" />
        </div>
      </div>
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   OPTION 6b — Flat navy FAB circle, icon-only, teal flash badge
   Drops the cartoon outline + crammed text for a clean app-native feel.
   Navy matches the app header; badge style mirrors Options 1 & 7.
══════════════════════════════════════════════════════════════ */
function Opt6b() {
  return (
    <Phone bg="#F0F9FF">
      <div className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
        {/* Solid teal FAB — uses 6's border colour as the fill */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "#0B6B8A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CamIcon color="#fff" size={26} />
        </div>

        {/* White flash badge with teal border */}
        <div
          style={{
            position: "absolute",
            top: 1,
            right: 1,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#E4F4FC",
            border: "1.5px solid #0B6B8A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zap size={7} color="#0B6B8A" strokeWidth={2.5} fill="#0B6B8A" />
        </div>
      </div>
    </Phone>
  );
}

/* ─── Shared circle FAB builder (used by 6c–6g) ─────────────── */
function CircleFAB({
  bg,
  border,
  camColor,
  badgeBg,
  badgeBorder,
  zapColor,
  phoneBg = "#F4F7FD",
}: {
  bg: string;
  border?: string;
  camColor: string;
  badgeBg: string;
  badgeBorder: string;
  zapColor: string;
  phoneBg?: string;
}) {
  return (
    <Phone bg={phoneBg}>
      <div className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: bg,
            border: border ?? "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CamIcon color={camColor} size={26} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 1,
            right: 1,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: badgeBg,
            border: `1.5px solid ${badgeBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zap size={7} color={zapColor} strokeWidth={2.5} fill={zapColor} />
        </div>
      </div>
    </Phone>
  );
}

/* ──────────────────────────────────────────────────────────────
   6c — User spec: light ice-blue fill, dark navy outline, white camera
   Darker navy border lifts it cleanly from the pale fill.
─────────────────────────────────────────────────────��──────── */
function Opt6c() {
  return (
    <CircleFAB
      phoneBg="#EEF4FF"
      bg="#D4E8FF"
      border="2.5px solid #1D3D8A"
      camColor="#1D3D8A"
      badgeBg="#fff"
      badgeBorder="#1D3D8A"
      zapColor="#1D3D8A"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6d — Star-app cobalt: deep royal-blue solid FAB (ref: star icon)
   Rich cobalt #1E3A9E — no border, flat, high-contrast white icon.
────────────────────────────────────────────────────────────── */
function Opt6d() {
  return (
    <CircleFAB
      bg="#1E3A9E"
      camColor="#fff"
      badgeBg="#fff"
      badgeBorder="#1E3A9E"
      zapColor="#1E3A9E"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6k — 6d + white border ring
────────────────────────────────────────────────────────────── */
function Opt6k() {
  return (
    <CircleFAB
      bg="#1E3A9E"
      border="2.5px solid #fff"
      camColor="#fff"
      badgeBg="#fff"
      badgeBorder="#1E3A9E"
      zapColor="#1E3A9E"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6e — Box cyan: vivid sky-cyan solid FAB (ref: Box bright-fill logo)
   #00AEEF — punchy, playful but still clean and flat.
────────────────────────────────────────────────────────────── */
function Opt6e() {
  return (
    <CircleFAB
      phoneBg="#F0FAFF"
      bg="#00AEEF"
      camColor="#fff"
      badgeBg="#fff"
      badgeBorder="#0089C0"
      zapColor="#0089C0"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6l — 6e + white border ring
───────────────────────────────────────────────────────────── */
function Opt6l() {
  return (
    <CircleFAB
      phoneBg="#F0FAFF"
      bg="#00AEEF"
      border="2.5px solid #fff"
      camColor="#fff"
      badgeBg="#fff"
      badgeBorder="#0089C0"
      zapColor="#0089C0"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6f — Box outline: white fill, sky-blue stroke, sky-blue camera
   (ref: Box transparent/outline logo) — lightest, most minimal feel.
────────────────────────────────────────────────────────────── */
function Opt6f() {
  return (
    <CircleFAB
      phoneBg="#F0FAFF"
      bg="#fff"
      border="2.5px solid #29ABE2"
      camColor="#29ABE2"
      badgeBg="#fff"
      badgeBorder="#29ABE2"
      zapColor="#29ABE2"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6g — Box royal blue: clean electric-blue solid FAB
   (ref: Box white-bg logo — #2952E0) — closest to app's own CTA blue.
──────────────────────────────────────────────────────────── */
function Opt6g() {
  return (
    <CircleFAB
      bg="#fff"
      border="2.5px solid #2952E0"
      camColor="#2952E0"
      badgeBg="#fff"
      badgeBorder="#1A3AB0"
      zapColor="#1A3AB0"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6o — 6g + orange flash badge (from Option 6)
   Same white fill + electric-blue border/camera, but the zap
   badge swaps to the orange accent — adds energy vs the flat navy.
───────────────────────────────────────────────────────────── */
function Opt6o() {
  return (
    <CircleFAB
      bg="#fff"
      border="2.5px solid #2952E0"
      camColor="#2952E0"
      badgeBg="#F97316"
      badgeBorder="#F97316"
      zapColor="#fff"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6p — 6o with flash inside the circle
   White fill, #2952E0 border. Camera icon sits slightly above
   centre; orange Zap lives in the bottom-right quadrant inside
   the circle — no external badge at all.
───────────────────────────────────────────────────────────── */
function Opt6p() {
  return (
    <Phone>
      <div className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "#fff",
            border: "2.5px solid #2952E0",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CamIcon color="#2952E0" size={26} />

          {/* Orange flash badge — top-right of camera icon, inside the circle */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 11,
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#F97316",
              border: "1px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={6} color="#fff" strokeWidth={2.5} fill="#fff" />
          </div>
        </div>
      </div>
    </Phone>
  );
}

/* ──────────────────────────────────────────────────────────────
   6h — Darkblue brand: vivid electric periwinkle-blue fill
   Ref: Darkblue.com — #3933F5 — bold, saturated, high-energy.
────────────────────────────────────────────────────────────── */
function Opt6h() {
  return (
    <CircleFAB
      bg="#3933F5"
      camColor="#fff"
      badgeBg="#fff"
      badgeBorder="#2620C4"
      zapColor="#2620C4"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6m — 6h + white border ring
────────────────────────────────────────────────────────────── */
function Opt6m() {
  return (
    <CircleFAB
      bg="#3933F5"
      border="2.5px solid #fff"
      camColor="#fff"
      badgeBg="#fff"
      badgeBorder="#2620C4"
      zapColor="#2620C4"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6n — 6h colours flipped: white fill + periwinkle border & camera
────────────────────────────────────────────────────────────── */
function Opt6n() {
  return (
    <CircleFAB
      bg="#fff"
      border="2.5px solid #3933F5"
      camColor="#3933F5"
      badgeBg="#fff"
      badgeBorder="#3933F5"
      zapColor="#3933F5"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   6i — Deskflow brand: flipped — bright sky-blue fill + near-black camera
────────────────────────────────────────────────────────────── */
function Opt6i() {
  return (
    <CircleFAB
      phoneBg="#F0F4FF"
      bg="#2BB5F5"
      camColor="#080C3E"
      badgeBg="#080C3E"
      badgeBorder="#2BB5F5"
      zapColor="#2BB5F5"
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   6j — Cloudbox brand: flipped — electric cyan fill + deep cobalt camera
────────────────────────────────────────────────────────────── */
function Opt6j() {
  return (
    <CircleFAB
      phoneBg="#EEF0FF"
      bg="#00C8FF"
      camColor="#1717A8"
      badgeBg="#1717A8"
      badgeBorder="#00C8FF"
      zapColor="#00C8FF"
    />
  );
}

/* ═════════════════════════════════════════════════════════════
   6q–6t  ·  App-blues series
   Every colour taken directly from the JobPics palette —
   no new hues introduced.

   App palette blues:
     #EEF3FF  — light periwinkle (icon-bg, "New project" pill)
     #1D3D8A  — informational navy
     #3478F6  — electric blue (CTA)
     #0E1F40  — deep navy (app header / brand)
══════════════════════════════════════════════════════════════ */

/* 6q — Light periwinkle fill  ·  electric-blue border + cam
   Mirrors the "New project" icon-chip seen throughout the app.
   Soft, approachable, 100% on-brand. */
function Opt6q() {
  return (
    <CircleFAB
      phoneBg="#F0F5FA"
      bg="#EEF3FF"
      border="2.5px solid #3478F6"
      camColor="#3478F6"
      badgeBg="#3478F6"
      badgeBorder="#EEF3FF"
      zapColor="#fff"
    />
  );
}

/* 6r — Informational navy fill  ·  white camera + white badge
   Uses #1D3D8A — the mid-weight navy already used for info
   states in headers, status labels and active tabs. */
function Opt6r() {
  return (
    <CircleFAB
      phoneBg="#EEF3FF"
      bg="#1D3D8A"
      camColor="#fff"
      badgeBg="#fff"
      badgeBorder="#1D3D8A"
      zapColor="#1D3D8A"
    />
  );
}

/* 6s — Deep navy body  ·  electric-blue camera + badge
   #0E1F40 fill — the header / brand navy — with #3478F6
   electric-blue icon and zap. Maximum contrast, premium feel. */
function Opt6s() {
  return (
    <CircleFAB
      phoneBg="#EEF3FF"
      bg="#0E1F40"
      camColor="#3478F6"
      badgeBg="#3478F6"
      badgeBorder="#0E1F40"
      zapColor="#fff"
    />
  );
}

/* 6t — Electric-blue fill  ·  deep navy camera + border
   Flips 6s: #3478F6 CTA fill with the dark #0E1F40 icon and
   matching border. Mirrors the app's primary button colour. */
function Opt6t() {
  return (
    <CircleFAB
      phoneBg="#EEF3FF"
      bg="#3478F6"
      border="2.5px solid #0E1F40"
      camColor="#0E1F40"
      badgeBg="#0E1F40"
      badgeBorder="#3478F6"
      zapColor="#3478F6"
    />
  );
}

/* ══════════════════════════════════════════════════════════════
   OPTION 3 — Mid-blue circle, darker border, 'Snap' in centre
══════════════════════════════════════════════════════════════ */
function Opt3() {
  return (
    <Phone>
      <div className="flex flex-col items-center gap-1.5">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#3478F6",
            border: "3px solid #1D3D8A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CamIcon color="#fff" size={22} />
          <span style={{ fontSize: 8, fontWeight: 800, color: "#fff", letterSpacing: "0.03em" }}>SNAP</span>
        </div>
      </div>
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   OPTION 4 — Seamless floating pill dock: icons either side of a
   raised centre shutter that protrudes upward from one unified bar.
   The phone-bg–coloured border ring on the circle creates the
   "carved out of the bar" island effect — no separate tiles/gaps.
══════════════════════════════════════════════════════════════ */
function Opt4() {
  const phoneBg = "#EDF1F7";
  return (
    <Phone bg={phoneBg}>
      <div className="relative flex items-end justify-center" style={{ width: 132, height: 62 }}>

        {/* ── Compact white floating pill ── */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between rounded-full"
          style={{
            height: 40,
            background: "#fff",
            paddingLeft: 12,
            paddingRight: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          }}
        >
          {/* Folder with plus badge */}
          <div className="relative">
            <FolderOpen size={16} strokeWidth={1.75} color="#9CA3AF" />
            <div
              style={{
                position: "absolute",
                top: -4,
                right: -5,
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#3478F6",
                border: "1.5px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={6} color="#fff" strokeWidth={3} />
            </div>
          </div>

          {/* Centre gap for shutter */}
          <div style={{ width: 42 }} />

          <UserPlus size={16} strokeWidth={1.75} color="#9CA3AF" />
        </div>

        {/* ── Raised blue shutter ── */}
        <div
          className="absolute"
          style={{
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "#3478F6",
            border: `3px solid ${phoneBg}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CamIcon color="#fff" size={20} />
        </div>

      </div>
    </Phone>
  );
}

/* ══════════════════════════════════════════════════════════════
   OPTION 5 — Floating tab bar, protruding centre button
   Inspired by second attachment (pill bar + raised CTA)
══════════════════════════════════════════════════════════════ */
function Opt5() {
  const phoneBg = "#F4F7FD";
  return (
    <Phone bg={phoneBg}>
      <div className="relative flex items-end justify-center" style={{ width: 160, height: 70 }}>

        {/* ── Floating pill bar ── */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between rounded-full"
          style={{
            height: 44,
            background: "#fff",
            paddingLeft: 16,
            paddingRight: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          }}
        >
          {/* Left — Home */}
          <div className="flex flex-col items-center gap-0.5">
            <Home size={16} strokeWidth={1.75} style={{ color: "#0E1F40" }} />
            <span style={{ fontSize: 7, fontWeight: 600, color: "#0E1F40" }}>Home</span>
          </div>

          {/* Centre gap */}
          <div style={{ width: 48 }} />

          {/* Right — Notifications */}
          <div className="relative flex flex-col items-center gap-0.5">
            <Bell size={16} strokeWidth={1.75} style={{ color: "#9CA3AF" }} />
            <span style={{ fontSize: 7, fontWeight: 600, color: "#9CA3AF" }}>Alerts</span>
            <div style={{ position: "absolute", top: -1, right: -2, width: 6, height: 6, borderRadius: "50%", background: "#FA3E3E", border: "1px solid #fff" }} />
          </div>
        </div>

        {/* ── Protruding blue shutter ── */}
        <div
          className="absolute"
          style={{
            bottom: 22,
            left: "50%",
            transform: "translateX(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#3478F6",
            border: `3px solid ${phoneBg}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CamIcon color="#fff" size={20} />
        </div>

      </div>
    </Phone>
  );
}

/* ═════════════════════════════════════════════════════════════
   OPTION 7 — Blue pill (Option 1 shape) in Option 6 colour scheme
══════════════════════════════════════════════════════════════ */
function Opt7() {
  return (
    <Phone bg="#F0F9FF">
      <div
        className="flex items-center rounded-full"
        style={{
          background: "#E4F4FC",
          border: "2px solid #0B6B8A",
          height: 46,
          paddingLeft: 14,
          paddingRight: 10,
          gap: 7,
        }}
      >
        {/* Camera with flash badge pinned to its top-right */}
        <div className="relative" style={{ flexShrink: 0 }}>
          <CamIcon color="#0B6B8A" size={26} />
          <div
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#fff",
              border: "1.5px solid #0B6B8A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={6} color="#0B6B8A" strokeWidth={2.5} fill="#0B6B8A" />
          </div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 900, color: "#0B4D6A", letterSpacing: "0.08em", fontStyle: "italic" }}>
          SNAP
        </span>
      </div>
    </Phone>
  );
}

/* ─── Reference images ───────────────────────────────────────── */
function ReferenceImages() {
  return (
    <div className="px-5 pb-6">
      <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
        Reference images used for options 4 &amp; 5
      </p>
      <div className="flex gap-3">
        <div className="flex-1 rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
          <img src={exampleYosee} alt="Yosee dock reference" className="w-full object-cover" />
          <p className="px-3 py-2" style={{ fontSize: 10, color: "#6B7280" }}>Option 4 inspired by</p>
        </div>
        <div className="flex-1 rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
          <img src={exampleFloating} alt="Floating tab bar reference" className="w-full object-cover" />
          <p className="px-3 py-2" style={{ fontSize: 10, color: "#6B7280" }}>Option 5 inspired by</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export function DockComparison({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F4F7FD", fontFamily: "Inter, sans-serif" }}>

      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-4 sticky top-0 z-10"
        style={{ background: "#0E1F40", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <button
          onClick={handleBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.10)" }}
        >
          <ArrowLeft size={15} color="#fff" strokeWidth={2} />
        </button>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Dock / FAB — options</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Comparison only — nothing implemented yet</p>
        </div>
      </div>

      {/* 2-col grid */}
      <div className="px-4 pt-5 pb-4 grid grid-cols-2 gap-3">

        {/* Current live screenshot — full width reference card */}
        <div className="col-span-2">
          <OptionCard number={"★" as any} title="Current — live in app today" note="Screenshot of the actual Snap button as it appears in the app right now. All other options are measured against this.">
            <OptCurrent />
          </OptionCard>
        </div>

        {/* Option 4 — moved to top */}
        <OptionCard number={4} title="Pill dock — 3-button" note="Projects icon left, blue pill centre with shutter circle, Invite icon right. Icons only, no labels.">
          <Opt4 />
        </OptionCard>

        {/* Option 5 — moved to top, full width */}
        <div className="col-span-2">
          <OptionCard number={5} title="Floating tab bar — protruding shutter" note="White pill bar with Home + Alerts flanking a raised blue shutter circle in the centre. Snap label below the circle. Inspired by second reference image.">
            <Opt5 />
          </OptionCard>
        </div>

        <OptionCard number={1} title="Current — blue pill" note="Wide capsule with camera icon + Snap label. Blue bg, white text. Orange notification dot.">
          <Opt1 />
        </OptionCard>

        <OptionCard number={"1b" as any} title="Blue gradient pill" note="Same pill shape as Option 1 but with a diagonal sky-to-deep-blue gradient.">
          <Opt1b />
        </OptionCard>

        <OptionCard number={2} title="White circle shutter" note="White fill, navy border. Camera icon + SNAP text inside the circle. Orange flash badge top-right.">
          <Opt2 />
        </OptionCard>

        <OptionCard number={3} title="Mid-blue shutter + Snap" note="Solid blue circle, darker navy border. Camera icon + SNAP text sit inside the circle together.">
          <Opt3 />
        </OptionCard>

        <OptionCard number={6} title="Sky-blue fill circle (2b)" note="Light cyan fill, dark teal border & icon. Two-tone feel inspired by the teal reference. Orange flash badge.">
          <Opt2b />
        </OptionCard>

        <OptionCard number={"6b" as any} title="Navy FAB circle — app-native" note="Flat #0E1F40 navy circle, icon-only. No border, no cramped text. Teal flash badge matches Options 1 & 7. Echoes the app's own header colour.">
          <Opt6b />
        </OptionCard>

        <OptionCard number={"6c" as any} title="Light ice-blue fill, dark navy outline, white camera" note="Darker navy border lifts it cleanly from the pale fill.">
          <Opt6c />
        </OptionCard>

        <OptionCard number={"6d" as any} title="Star-app cobalt: deep royal-blue solid FAB" note="Rich cobalt #1E3A9E — no border, flat, high-contrast white icon.">
          <Opt6d />
        </OptionCard>

        <OptionCard number={"6k" as any} title="Star-app cobalt: deep royal-blue solid FAB + white border ring" note="Rich cobalt #1E3A9E — no border, flat, high-contrast white icon.">
          <Opt6k />
        </OptionCard>

        <OptionCard number={"6e" as any} title="Box cyan: vivid sky-cyan solid FAB" note="#00AEEF — punchy, playful but still clean and flat.">
          <Opt6e />
        </OptionCard>

        <OptionCard number={"6l" as any} title="Box cyan: vivid sky-cyan solid FAB + white border ring" note="#00AEEF — punchy, playful but still clean and flat.">
          <Opt6l />
        </OptionCard>

        <OptionCard number={"6f" as any} title="Box outline: white fill, sky-blue stroke, sky-blue camera" note="Lightest, most minimal feel.">
          <Opt6f />
        </OptionCard>

        <OptionCard number={"6g" as any} title="Box royal blue: clean electric-blue solid FAB" note="Closest to app's own CTA blue.">
          <Opt6g />
        </OptionCard>

        <OptionCard number={"6o" as any} title="6g + orange flash badge" note="White fill, electric-blue border & camera — same as 6g but with the orange accent zap badge from Option 6.">
          <Opt6o />
        </OptionCard>

        <OptionCard number={"6p" as any} title="6o — flash inside the circle" note="Same white fill + electric-blue border, camera nudged up, orange Zap sits in the bottom-right quadrant inside the circle. No external badge.">
          <Opt6p />
        </OptionCard>

        <OptionCard number={"6h" as any} title="Darkblue brand: vivid electric periwinkle-blue fill" note="Ref: Darkblue.com — #3933F5 — bold, saturated, high-energy.">
          <Opt6h />
        </OptionCard>

        <OptionCard number={"6m" as any} title="Darkblue brand: vivid electric periwinkle-blue fill + white border ring" note="Ref: Darkblue.com — #3933F5 — bold, saturated, high-energy.">
          <Opt6m />
        </OptionCard>

        <OptionCard number={"6n" as any} title="Darkblue brand: white fill + periwinkle border & camera" note="Ref: Darkblue.com — #3933F5 — bold, saturated, high-energy.">
          <Opt6n />
        </OptionCard>

        <OptionCard number={"6i" as any} title="Deskflow brand: flipped — bright sky-blue fill + near-black camera" note="Ref: Deskflow — #080C3E deep navy body, #2BB5F5 bright sky icon. Strong contrast — the icon colour carries all the energy.">
          <Opt6i />
        </OptionCard>

        <OptionCard number={"6j" as any} title="Cloudbox brand: flipped — electric cyan fill + deep cobalt camera" note="Ref: Cloudbox — #1717A8 cobalt body, #00C8FF electric cyan icon. Rich two-tone — icon pops hard against the dark fill.">
          <Opt6j />
        </OptionCard>

        <OptionCard number={"6q" as any} title="App-blues: light periwinkle fill, electric-blue border + cam" note="Mirrors the 'New project' icon-chip seen throughout the app. Soft, approachable, 100% on-brand.">
          <Opt6q />
        </OptionCard>

        <OptionCard number={"6r" as any} title="App-blues: informational navy fill, white camera + white badge" note="Uses #1D3D8A — the mid-weight navy already used for info states in headers, status labels and active tabs.">
          <Opt6r />
        </OptionCard>

        <OptionCard number={"6s" as any} title="App-blues: deep navy body, electric-blue camera + badge" note="#0E1F40 fill — the header / brand navy — with #3478F6 electric-blue icon and zap. Maximum contrast, premium feel.">
          <Opt6s />
        </OptionCard>

        <OptionCard number={"6t" as any} title="App-blues: electric-blue fill, deep navy camera + border" note="Flips 6s: #3478F6 CTA fill with the dark #0E1F40 icon and matching border. Mirrors the app's primary button colour.">
          <Opt6t />
        </OptionCard>

        <OptionCard number={7} title="Teal pill (1 shape × 6 colours)" note="Same wide capsule shape as Option 1 but using the sky-blue fill, dark teal border, teal icon & text from Option 6. Orange dot retained.">
          <Opt7 />
        </OptionCard>

      </div>

      {/* Reference images */}
      <ReferenceImages />
    </div>
  );
}