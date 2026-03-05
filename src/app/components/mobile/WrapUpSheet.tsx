import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, MapPin, Camera } from "lucide-react";
import type { Project } from "./ProjectsScreen";

interface WrapUpSheetProps {
  projects: Project[];
  onClose: () => void;
  onComplete: (ids: string[]) => void;
}

export function WrapUpSheet({ projects, onClose, onComplete }: WrapUpSheetProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const count = checked.size;
  const canConfirm = count > 0;

  const handleConfirm = () => {
    if (canConfirm) onComplete([...checked]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(17,24,39,0.45)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 360, damping: 36 }}
        className="flex flex-col rounded-t-3xl overflow-hidden"
        style={{ background: "#fff", maxHeight: "82vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="rounded-full" style={{ width: 36, height: 4, background: "#E5E7EB" }} />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-2 pb-4 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: 34, height: 34, background: "#F3F4F6" }}>
            <X size={15} strokeWidth={2.5} style={{ color: "#6B7280" }} />
          </motion.button>
          <div className="flex-1">
            <p style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Mark as complete</p>
            <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>
              Tick off the jobs you're ready to sign off
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#F3F4F6", flexShrink: 0 }} />

        {/* Project list */}
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 8 }}>
          {projects.map((p, i) => {
            const isChecked = checked.has(p.id);
            const isStale = p.lastActivityDays >= 2;
            return (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.985 }}
                onClick={() => toggle(p.id)}
                className="w-full flex items-center gap-3.5 px-5 text-left"
                style={{
                  paddingTop: 14, paddingBottom: 14,
                  borderBottom: i < projects.length - 1 ? "1px solid #F3F4F6" : "none",
                  background: isChecked ? "#F0FDF4" : "#fff",
                  transition: "background 0.15s",
                }}
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 rounded-xl overflow-hidden"
                  style={{ width: 48, height: 48, background: "#EEF2F9" }}>
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={16} style={{ color: "#9CA3AF" }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: 14, fontWeight: 700, color: isChecked ? "#15803D" : "#111827" }}>
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>{p.client}</span>
                    {isStale && (
                      <span className="rounded-full px-1.5 py-0.5"
                        style={{ fontSize: 10, fontWeight: 700, color: "#D97706", background: "#FEF3C7" }}>
                        {p.lastActivityDays}d inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={10} strokeWidth={2} style={{ color: "#C4C9D4", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#C4C9D4" }}>{p.location}</span>
                    <span style={{ fontSize: 11, color: "#D1D5DB", marginLeft: 4 }}>· {p.photoCount} photos</span>
                  </div>
                </div>

                {/* Check circle */}
                <div className="flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {isChecked ? (
                      <motion.div
                        key="on"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}>
                        <CheckCircle2 size={24} color="#0D9488" strokeWidth={2.5} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="off"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}>
                        <div className="rounded-full"
                          style={{ width: 24, height: 24, border: "2px solid #D1D5DB" }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 pb-8 pt-3" style={{ borderTop: "1px solid #F3F4F6" }}>
          <motion.button
            whileTap={canConfirm ? { scale: 0.97 } : {}}
            onClick={handleConfirm}
            className="w-full flex items-center justify-center rounded-2xl"
            style={{
              height: 54,
              background: canConfirm ? "#0D9488" : "#F3F4F6",
              transition: "background 0.2s",
            }}>
            <AnimatePresence mode="wait">
              {canConfirm ? (
                <motion.span
                  key="active"
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                  Mark {count} job{count !== 1 ? "s" : ""} as complete
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ fontSize: 15, fontWeight: 600, color: "#9CA3AF" }}>
                  Select jobs above
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}