import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, AlertTriangle, Flame, AlertCircle, Check,
  MapPin, ChevronDown, ChevronUp, Send,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */

export type AlertPriority = "urgent" | "high" | "medium";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

interface Photo {
  id: number;
  url: string;
}

interface SafetyAlertSheetProps {
  photos: Photo[];
  projectName: string;
  teamMembers: TeamMember[];
  onClose: () => void;
  onSent?: () => void;
}

/* ─── Priority config ───────────────────────────────────────── */

const PRIORITY_CONFIG: Record<AlertPriority, {
  label: string;
  sublabel: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ElementType;
}> = {
  urgent: {
    label: "Urgent",
    sublabel: "Immediate danger — alert everyone now",
    color: "#FA3E3E",
    bg: "rgba(250,62,62,0.08)",
    border: "rgba(250,62,62,0.30)",
    icon: Flame,
  },
  high: {
    label: "High",
    sublabel: "Serious risk — requires same-day action",
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.30)",
    icon: AlertCircle,
  },
  medium: {
    label: "Medium",
    sublabel: "Potential hazard — review before next shift",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.30)",
    icon: AlertCircle,
  },
};

/* ─── Sent confirmation overlay ─────────────────────────────── */

function SentConfirmation({
  priority,
  memberCount,
  onDone,
}: {
  priority: AlertPriority;
  memberCount: number;
  onDone: () => void;
}) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 rounded-t-3xl"
      style={{ background: "#fff" }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    >
      {/* Pulsing ring + icon */}
      <div className="relative mb-6">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}
          animate={{ scale: [1, 1.22, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative flex items-center justify-center rounded-full"
          style={{ width: 72, height: 72, background: cfg.bg, border: `1.5px solid ${cfg.border}` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 26, delay: 0.1 }}
        >
          <Send size={28} strokeWidth={2} style={{ color: cfg.color }} />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        style={{ fontSize: 20, fontWeight: 800, color: "#111827", textAlign: "center", marginBottom: 8 }}
      >
        {cfg.label} alert sent
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 1.5, marginBottom: 32 }}
      >
        {memberCount} team member{memberCount !== 1 ? "s" : ""} notified immediately.{"\n"}
        The hazard has been logged against these photos.
      </motion.p>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onDone}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="w-full flex items-center justify-center gap-2 rounded-full"
        style={{ height: 52, background: cfg.color }}
      >
        <Check size={16} strokeWidth={3} color="#fff" />
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Done</span>
      </motion.button>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */

export function SafetyAlertSheet({
  photos,
  projectName,
  teamMembers,
  onClose,
  onSent,
}: SafetyAlertSheetProps) {
  const [priority, setPriority] = useState<AlertPriority>("urgent");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState(projectName);
  // All members selected by default (urgency bias)
  const [selected, setSelected] = useState<Set<string>>(
    new Set(teamMembers.map((m) => m.id))
  );
  const [teamExpanded, setTeamExpanded] = useState(true);
  const [sent, setSent] = useState(false);

  const cfg = PRIORITY_CONFIG[priority];
  const selectedCount = selected.size;
  const canSend = description.trim().length > 0 && selectedCount > 0;

  const toggleMember = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (selected.size === teamMembers.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(teamMembers.map((m) => m.id)));
    }
  };

  // When switching to Urgent, re-select everyone
  const handlePriority = (p: AlertPriority) => {
    setPriority(p);
    if (p === "urgent") setSelected(new Set(teamMembers.map((m) => m.id)));
  };

  const handleSend = () => {
    if (!canSend) return;
    setSent(true);
    setTimeout(() => {
      onSent?.();
      onClose();
    }, 3200);
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.55)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onPointerDown={onClose}
    >
      <motion.div
        className="relative rounded-t-3xl flex flex-col overflow-hidden"
        style={{ background: "#fff", maxHeight: "92%", minHeight: 540 }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Sent overlay */}
        <AnimatePresence>
          {sent && (
            <SentConfirmation
              priority={priority}
              memberCount={selectedCount}
              onDone={onClose}
            />
          )}
        </AnimatePresence>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="rounded-full" style={{ width: 36, height: 4, background: "#E5E7EB" }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-2 pb-4 flex-shrink-0"
          style={{ borderBottom: "1px solid #F3F4F6" }}
        >
          <div className="flex items-center gap-2.5">
            {/* Pulsing warning icon */}
            <div
              className="relative flex items-center justify-center rounded-xl"
              style={{ width: 38, height: 38, background: "rgba(250,62,62,0.09)", border: "1.5px solid rgba(250,62,62,0.22)" }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ border: "1.5px solid rgba(250,62,62,0.40)" }}
                animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.18, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <AlertTriangle size={17} strokeWidth={2.5} style={{ color: "#FA3E3E" }} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Flag safety hazard</p>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Alert your team immediately</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onClose}
            className="flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, background: "#F3F4F6" }}
          >
            <X size={15} strokeWidth={2.5} style={{ color: "#6B7280" }} />
          </motion.button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

          {/* Photo strip */}
          <div className="flex gap-2.5 px-4 pt-4 pb-3 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
            {photos.map((p, i) => (
              <div
                key={p.id}
                className="flex-shrink-0 rounded-2xl overflow-hidden relative"
                style={{ width: 68, height: 68, border: "2px solid #fff", outline: "1px solid rgba(0,0,0,0.08)" }}
              >
                <img src={p.url} alt="" className="w-full h-full object-cover" />
                <div
                  className="absolute bottom-1 right-1 flex items-center justify-center rounded-full"
                  style={{ width: 15, height: 15, background: "rgba(0,0,0,0.52)" }}
                >
                  <span style={{ fontSize: 8, fontWeight: 700, color: "#fff" }}>{i + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Priority ─────────────────────────────────────────── */}
          <div className="px-4 pb-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <p
              className="mb-2.5"
              style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF" }}
            >
              Severity
            </p>
            <div className="flex gap-2">
              {(["urgent", "high", "medium"] as AlertPriority[]).map((p) => {
                const c = PRIORITY_CONFIG[p];
                const Icon = c.icon;
                const active = priority === p;
                return (
                  <motion.button
                    key={p}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePriority(p)}
                    className="flex-1 flex flex-col items-center justify-center gap-1 rounded-2xl py-3"
                    style={{
                      background: active ? c.bg : "#F9FAFB",
                      border: `1.5px solid ${active ? c.border : "#F3F4F6"}`,
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                  >
                    <Icon size={16} strokeWidth={2.5} style={{ color: active ? c.color : "#9CA3AF" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: active ? c.color : "#9CA3AF" }}>
                      {c.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            {/* Severity sublabel */}
            <motion.p
              key={priority}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="mt-2.5"
              style={{ fontSize: 12, color: cfg.color, textAlign: "center" }}
            >
              {cfg.sublabel}
            </motion.p>
          </div>

          {/* ── Description ──────────────────────────────────────── */}
          <div className="px-4 pt-4 pb-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <p
              className="mb-2.5"
              style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF" }}
            >
              Describe the hazard
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Uncovered roof opening on flat roof, 3rd floor, north elevation — not signed off, no edge protection in place"
              rows={3}
              className="w-full rounded-2xl px-4 py-3 resize-none outline-none"
              style={{
                background: "#F9FAFB",
                border: `1.5px solid ${description.length > 0 ? cfg.border : "#F3F4F6"}`,
                fontSize: 13,
                color: "#111827",
                lineHeight: 1.55,
                transition: "border-color 0.15s",
              }}
            />
          </div>

          {/* ── Location ─────────────────────────────────────────── */}
          <div className="px-4 pt-4 pb-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <p
              className="mb-2.5"
              style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF" }}
            >
              Location / area
            </p>
            <div
              className="flex items-center gap-2.5 rounded-2xl px-4"
              style={{ background: "#F9FAFB", border: "1.5px solid #F3F4F6", height: 46 }}
            >
              <MapPin size={14} strokeWidth={2.5} style={{ color: "#3478F6", flexShrink: 0 }} />
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Project / area / grid ref"
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: 13, color: "#111827" }}
              />
            </div>
          </div>

          {/* ── Team picker ──────────────────────────────────────── */}
          <div className="px-4 pt-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <p
                style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3AF" }}
              >
                Alert team members
              </p>
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleAll}
                  style={{ fontSize: 12, fontWeight: 600, color: "#3478F6" }}
                >
                  {selected.size === teamMembers.length ? "Deselect all" : "Select all"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setTeamExpanded((v) => !v)}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 26, height: 26, background: "#F3F4F6" }}
                >
                  {teamExpanded
                    ? <ChevronUp size={13} strokeWidth={2.5} style={{ color: "#6B7280" }} />
                    : <ChevronDown size={13} strokeWidth={2.5} style={{ color: "#6B7280" }} />
                  }
                </motion.button>
              </div>
            </div>

            {/* Selected count pill */}
            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 mb-3 self-start inline-flex"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                <div
                  className="rounded-full"
                  style={{ width: 6, height: 6, background: cfg.color }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>
                  {selectedCount} of {teamMembers.length} will be alerted
                </span>
              </motion.div>
            )}

            <AnimatePresence>
              {teamExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden flex flex-col gap-1.5"
                >
                  {teamMembers.map((member) => {
                    const isSelected = selected.has(member.id);
                    return (
                      <motion.button
                        key={member.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleMember(member.id)}
                        className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left w-full"
                        style={{
                          background: isSelected ? cfg.bg : "#F9FAFB",
                          border: `1.5px solid ${isSelected ? cfg.border : "#F3F4F6"}`,
                          transition: "background 0.15s, border-color 0.15s",
                        }}
                      >
                        {/* Avatar */}
                        <div
                          className="flex-shrink-0 flex items-center justify-center rounded-full"
                          style={{ width: 36, height: 36, background: member.color }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>
                            {member.initials}
                          </span>
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{member.name}</p>
                          <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{member.role}</p>
                        </div>
                        {/* Checkbox */}
                        <motion.div
                          className="flex-shrink-0 flex items-center justify-center rounded-full"
                          style={{
                            width: 24, height: 24,
                            background: isSelected ? cfg.color : "#E5E7EB",
                            transition: "background 0.15s",
                          }}
                          animate={isSelected ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                          transition={{ duration: 0.22 }}
                        >
                          {isSelected && (
                            <Check size={12} strokeWidth={3} color="#fff" />
                          )}
                        </motion.div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Sticky CTA ──────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 px-4 py-4"
          style={{ borderTop: "1px solid #F3F4F6", background: "#fff" }}
        >
          <motion.button
            whileTap={canSend ? { scale: 0.97 } : {}}
            onClick={handleSend}
            className="w-full flex items-center justify-center gap-2.5 rounded-full"
            style={{
              height: 54,
              background: canSend ? cfg.color : "#E5E7EB",
              transition: "background 0.2s",
            }}
          >
            <AlertTriangle size={16} strokeWidth={2.5} style={{ color: canSend ? "#fff" : "#9CA3AF" }} />
            <span style={{ fontSize: 15, fontWeight: 800, color: canSend ? "#fff" : "#9CA3AF" }}>
              {canSend
                ? `Send ${cfg.label.toLowerCase()} alert to ${selectedCount} member${selectedCount !== 1 ? "s" : ""}`
                : "Describe the hazard to continue"
              }
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}