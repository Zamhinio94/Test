import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Check, Copy, ChevronDown, ChevronRight, Clock, Bell,
  Send, Loader2, Plus, Mail, FileText,
  Zap, BarChart3, Sparkles, CheckCircle,
} from "lucide-react";
import type { Project } from "./ProjectsScreen";
import { PdfFileIcon } from "./PdfFileIcon";

/* ─── Shared photo / contributor data ──────────────────────── */

const PHOTOS_BY_PROJECT: Record<string, string[]> = {
  "1": [
    "https://images.unsplash.com/photo-1707725669477-18feaba381f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1760043208847-69138f1e32f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1646865006914-8d10d8e70f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1591397956797-ae6da1a585dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1609560553431-650d9cab1a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  ],
  "2": [
    "https://images.unsplash.com/photo-1585118213816-1c57f4b0b1dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1659427921734-d4590f1e099f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1770119057699-37ec0cce44e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1766791783611-b1c6a7ad86bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1590889580823-47d5a524c6bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  ],
  "3": [
    "https://images.unsplash.com/photo-1771528587314-d541e6c9c3c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1590889580823-47d5a524c6bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1707725669477-18feaba381f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1646865006914-8d10d8e70f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    "https://images.unsplash.com/photo-1762643119387-211dd1ed73da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  ],
};

const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1585118213816-1c57f4b0b1dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1707725669477-18feaba381f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "https://images.unsplash.com/photo-1591397956797-ae6da1a585dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
];

const CONTRIBUTORS_BY_PROJECT: Record<string, Array<{ initials: string; color: string; count: number; name: string }>> = {
  "1": [
    { initials: "JW", color: "#3478F6", count: 5, name: "James Walsh" },
    { initials: "SC", color: "#6B3FDC", count: 3, name: "Sarah Chen" },
    { initials: "TB", color: "#1D3D8A", count: 2, name: "Tom Briggs" },
  ],
  "2": [
    { initials: "DO", color: "#3478F6", count: 4, name: "David Okafor" },
    { initials: "LM", color: "#6B3FDC", count: 3, name: "Lisa Morrison" },
  ],
  "3": [
    { initials: "PS", color: "#3478F6", count: 6, name: "Priya Sharma" },
    { initials: "BC", color: "#6B3FDC", count: 2, name: "Ben Cartwright" },
  ],
};

const FALLBACK_CONTRIBUTORS = [{ initials: "ME", color: "#3478F6", count: 3, name: "You" }];

function getPhotos(id: string) { return PHOTOS_BY_PROJECT[id] ?? FALLBACK_PHOTOS; }
function getContributors(id: string) { return CONTRIBUTORS_BY_PROJECT[id] ?? FALLBACK_CONTRIBUTORS; }

/* ─── WhatsApp icon ─────────────────────────────────────────── */
function WAIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#16a34a" />
    </svg>
  );
}

/* ─── Shared sub-components ─────────────────────────────────── */

function Handle() {
  return (
    <div className="flex justify-center pt-3.5 pb-1 flex-shrink-0">
      <div className="w-8 h-1 rounded-full" style={{ background: "#E5E7EB" }} />
    </div>
  );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center px-5 pt-3 pb-4 flex-shrink-0 relative"
      style={{ borderBottom: "1px solid #F3F4F6" }}>
      <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ width: 32, height: 32, background: "#F3F4F6" }}>
        <X size={15} strokeWidth={2.5} style={{ color: "#6B7280" }} />
      </motion.button>
      <p className="absolute left-0 right-0 text-center pointer-events-none"
        style={{ fontSize: 16, fontWeight: 700, color: "#0E1F40" }}>{title}</p>
    </div>
  );
}

function ProjectPicker({ projects, selectedId, onSelect }: {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const live = projects.filter(p => p.status === "live");
  const sel = live.find(p => p.id === selectedId) ?? live[0];
  if (!sel) return null;

  return (
    <div className="relative z-10">
      <motion.button whileTap={{ scale: 0.98 }} onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 rounded-2xl"
        style={{ height: 54, background: "#EEF3FF", border: "1.5px solid #BFDBFE" }}>
        <div className="flex-1 text-left min-w-0">
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0E1F40" }}
            className="truncate">{sel.name}</p>
          <p style={{ fontSize: 11, color: "#6B7280" }}>{sel.client} · {sel.location}</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={15} strokeWidth={2.5} style={{ color: "#3478F6" }} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute left-0 right-0 rounded-2xl overflow-hidden mt-1.5"
            style={{ background: "#fff", border: "1.5px solid #E5E7EB", boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}>
            {live.map((p, i) => (
              <motion.button key={p.id} whileTap={{ scale: 0.98 }}
                onClick={() => { onSelect(p.id); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-blue-50 transition-colors"
                style={{ borderBottom: i < live.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0E1F40" }} className="truncate">{p.name}</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF" }}>{p.client}</p>
                </div>
                {p.id === selectedId && <Check size={14} strokeWidth={2.5} style={{ color: "#3478F6", flexShrink: 0 }} />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionRow({
  icon, label, sub, color, onClick, state, children,
}: {
  icon: ReactNode;
  label: string;
  sub?: string;
  color: string;
  onClick?: () => void;
  state?: "idle" | "loading" | "done";
  children?: ReactNode;
}) {
  const bg = `${color}0D`;
  const border = `1px solid ${color}20`;
  return (
    <motion.button
      onClick={onClick}
      whileTap={state === "loading" ? {} : { scale: 0.97 }}
      className="w-full flex items-center gap-3.5 rounded-2xl px-4 text-left"
      style={{ height: 60, background: state === "done" ? `${color}12` : bg, border: state === "done" ? `1px solid ${color}35` : border, transition: "background 0.25s, border-color 0.25s" }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, transition: "background 0.25s" }}>
        <AnimatePresence mode="wait">
          {state === "loading"
            ? <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 size={16} style={{ color }} strokeWidth={2} className="animate-spin" />
              </motion.div>
            : state === "done"
            ? <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 24 }}>
                <Check size={16} color={color} strokeWidth={2.5} />
              </motion.div>
            : <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {icon}
              </motion.div>
          }
        </AnimatePresence>
      </div>
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.p key={state} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
            {label}
          </motion.p>
        </AnimatePresence>
        {sub && <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{sub}</p>}
      </div>
      {children}
      {!children && state === "idle" && <ChevronRight size={14} style={{ color: `${color}60`, flexShrink: 0 }} />}
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════════════
   1. DAILY REPORT SHEET
   ════════════════════════════════════════════════════════════════ */

export function DailyReportSheet({ projects, onClose }: { projects: Project[]; onClose: () => void }) {
  const live = projects.filter(p => p.status === "live");
  const [selectedId, setSelectedId] = useState(live[0]?.id ?? "1");
  const [waState,  setWaState]  = useState<"idle" | "loading" | "done">("idle");
  const [copied,   setCopied]   = useState(false);
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "done">("idle");

  const sel  = live.find(p => p.id === selectedId) ?? live[0];
  const photos     = getPhotos(selectedId).slice(0, 3);
  const contribs   = getContributors(selectedId);
  const totalPhotos = contribs.reduce((s, c) => s + c.count, 0);
  const today      = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const shareUrl   = `https://jobpics.uk/report/${selectedId}/${new Date().toISOString().slice(0, 10)}`;
  const waMsg      = encodeURIComponent(
    `📸 Daily site report — ${sel?.name}, ${today}\n\n${totalPhotos} photos added today by ${contribs.map(c => c.name.split(" ")[0]).join(", ")}.\n\nView full report: ${shareUrl}`
  );

  const handleWa = () => {
    setWaState("loading");
    setTimeout(() => { window.open(`https://wa.me/?text=${waMsg}`, "_blank"); setWaState("done"); setTimeout(() => setWaState("idle"), 2500); }, 500);
  };
  const handleCopy = () => { navigator.clipboard.writeText(shareUrl).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2500); };
  const handlePdf  = () => {
    if (pdfState !== "idle") return;
    setPdfState("loading");
    setTimeout(() => setPdfState("done"), 2200);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-40" style={{ background: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 38 }}
        className="absolute left-0 right-0 bottom-0 z-50 flex flex-col bg-white"
        style={{ borderRadius: "26px 26px 0 0", maxHeight: "91%" }}
        onClick={e => e.stopPropagation()}>
        <Handle />
        <Header title="Daily Report" onClose={onClose} />

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="px-5 pt-4 pb-8 flex flex-col gap-4">

            {/* Date + count badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "#EEF3FF" }}>
                <Clock size={11} style={{ color: "#3478F6" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#3478F6" }}>{today}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#16A34A" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#16A34A" }}>{totalPhotos} photos today</span>
              </div>
            </div>

            {/* Project picker */}
            {live.length > 0 ? (
              <ProjectPicker projects={projects} selectedId={selectedId} onSelect={setSelectedId} />
            ) : (
              <div className="rounded-2xl px-4 py-6 flex flex-col items-center gap-2" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>No live projects yet — create one first to generate reports.</p>
              </div>
            )}

            {/* Report preview card */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
              {/* Header row */}
              <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Report preview
                </span>
                <div className="flex -space-x-1.5">
                  {contribs.map(c => (
                    <div key={c.initials} className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${c.color}18`, border: "2px solid #fff" }}>
                      <span style={{ fontSize: 8, fontWeight: 800, color: c.color }}>{c.initials}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Photo strip */}
              <div className="flex gap-0.5">
                {photos.map((url, i) => (
                  <div key={i} className="flex-1 overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {/* Summary text */}
              <div className="px-4 py-3">
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.55 }}>
                  <span style={{ fontWeight: 700 }}>{sel?.name ?? "Project"}</span>
                  {" "}— {totalPhotos} photos captured today by{" "}
                  <span style={{ fontWeight: 600 }}>{contribs.map(c => c.name.split(" ")[0]).join(", ")}</span>.
                </p>
              </div>
            </div>

            {/* Actions */}
            <ActionRow
              icon={<WAIcon />} label={waState === "done" ? "Sent!" : "Send via WhatsApp"}
              sub="Share report with client" color="#16a34a"
              onClick={handleWa} state={waState} />

            <ActionRow
              icon={<Copy size={16} style={{ color: "#6366f1" }} />}
              label={copied ? "Link copied!" : "Copy report link"}
              sub={shareUrl.replace("https://", "")} color="#6366f1"
              onClick={handleCopy} state={copied ? "done" : "idle"} />

            {/* PDF row — amber when ready */}
            <motion.button whileTap={pdfState === "loading" ? {} : { scale: 0.97 }} onClick={handlePdf}
              className="w-full flex items-center gap-3.5 rounded-2xl px-4 text-left"
              style={{
                height: 60,
                background: pdfState === "done" ? "#FEF3C7" : "rgba(52,120,246,0.05)",
                border: `1px solid ${pdfState === "done" ? "#D97706" : "rgba(52,120,246,0.12)"}`,
                transition: "background 0.3s, border-color 0.3s",
              }}>
              <AnimatePresence mode="wait">
                {pdfState === "idle"
                  ? <motion.div key="i" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex-shrink-0"><PdfFileIcon size={42} /></motion.div>
                  : <motion.div key="state" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: pdfState === "done" ? "#FDE68A" : "rgba(52,120,246,0.09)" }}>
                      {pdfState === "loading"
                        ? <Loader2 size={16} style={{ color: "#3478F6" }} className="animate-spin" />
                        : <Check size={16} color="#D97706" strokeWidth={2.5} />
                      }
                    </motion.div>
                }
              </AnimatePresence>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 14, fontWeight: 700, color: pdfState === "done" ? "#92400E" : "#111827" }}>
                  {pdfState === "loading" ? "Generating PDF…" : pdfState === "done" ? "PDF ready — tap to save" : "Generate PDF report"}
                </p>
                <p style={{ fontSize: 12, color: pdfState === "done" ? "#B45309" : "#9CA3AF", marginTop: 1 }}>
                  {pdfState === "done" ? "Tap to download · share below" : "Photos, labels & summary"}
                </p>
              </div>
            </motion.button>

          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. BEFORE / AFTER SHEET
   ════════════════════════════════════════════════════════════════ */

export function BeforeAfterSheet({ projects, onClose }: { projects: Project[]; onClose: () => void }) {
  const live = projects.filter(p => p.status === "live");
  const [selectedId,    setSelectedId]    = useState(live[0]?.id ?? "1");
  const [beforeUrl,     setBeforeUrl]     = useState<string | null>(null);
  const [afterUrl,      setAfterUrl]      = useState<string | null>(null);
  const [pickerFor,     setPickerFor]     = useState<"before" | "after" | null>(null);
  const [copied,        setCopied]        = useState(false);
  const [waState,       setWaState]       = useState<"idle" | "loading" | "done">("idle");
  const [emailState,    setEmailState]    = useState<"idle" | "loading" | "done">("idle");
  const [pdfState,      setPdfState]      = useState<"idle" | "loading" | "done">("idle");
  const [pdfWaState,    setPdfWaState]    = useState<"idle" | "loading" | "done">("idle");
  const [pdfEmailState, setPdfEmailState] = useState<"idle" | "loading" | "done">("idle");

  const photos   = getPhotos(selectedId);
  const sel      = live.find(p => p.id === selectedId) ?? live[0];
  const shareUrl = `https://jobpics.uk/compare/${selectedId}/${Date.now().toString(36)}`;
  const waMsg    = encodeURIComponent(`Progress update on ${sel?.name ?? "project"} 📸\n\nBefore vs After comparison: ${shareUrl}`);

  const handleWa = () => {
    setWaState("loading");
    setTimeout(() => { window.open(`https://wa.me/?text=${waMsg}`, "_blank"); setWaState("done"); setTimeout(() => setWaState("idle"), 2500); }, 500);
  };
  const handleEmail = () => {
    setEmailState("loading");
    const subject = encodeURIComponent(`Before/After: ${sel?.name ?? "Project"}`);
    const body    = encodeURIComponent(`Hi,\n\nPlease find the Before/After comparison for ${sel?.name ?? "the project"} here:\n${shareUrl}\n\nJobPics`);
    setTimeout(() => { window.open(`mailto:?subject=${subject}&body=${body}`, "_blank"); setEmailState("done"); setTimeout(() => setEmailState("idle"), 2500); }, 400);
  };
  const handleCopy    = () => { navigator.clipboard.writeText(shareUrl).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2500); };
  const handlePdf     = () => { if (pdfState !== "idle") return; setPdfState("loading"); setTimeout(() => setPdfState("done"), 2200); };
  const handlePdfWa   = () => {
    setPdfWaState("loading");
    const msg = encodeURIComponent(`Before/After PDF for ${sel?.name ?? "project"} 📄\n\nView: ${shareUrl}`);
    setTimeout(() => { window.open(`https://wa.me/?text=${msg}`, "_blank"); setPdfWaState("done"); setTimeout(() => setPdfWaState("idle"), 2500); }, 400);
  };
  const handlePdfEmail = () => {
    setPdfEmailState("loading");
    const subject = encodeURIComponent(`Before/After PDF — ${sel?.name ?? "Project"}`);
    const body    = encodeURIComponent(`Hi,\n\nPlease find the Before/After PDF for ${sel?.name ?? "the project"}:\n${shareUrl}.pdf\n\nJobPics`);
    setTimeout(() => { window.open(`mailto:?subject=${subject}&body=${body}`, "_blank"); setPdfEmailState("done"); setTimeout(() => setPdfEmailState("idle"), 2500); }, 400);
  };

  const bothSelected = beforeUrl && afterUrl;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-40" style={{ background: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 38 }}
        className="absolute left-0 right-0 bottom-0 z-50 flex flex-col bg-white"
        style={{ borderRadius: "26px 26px 0 0", maxHeight: "91%" }}
        onClick={e => e.stopPropagation()}>
        <Handle />
        <Header title="Before / After" onClose={onClose} />

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none", minHeight: 0 }}>
          <div className="px-5 pt-4 pb-8 flex flex-col gap-4">

            {/* Project picker */}
            <ProjectPicker projects={projects} selectedId={selectedId} onSelect={(id) => {
              setSelectedId(id);
              setBeforeUrl(null);
              setAfterUrl(null);
              setPdfState("idle");
            }} />

            {/* Two photo slots */}
            <div className="flex gap-3">
              {(["before", "after"] as const).map(slot => {
                const isSet   = slot === "before" ? beforeUrl : afterUrl;
                const label   = slot === "before" ? "BEFORE" : "AFTER";
                const pillBg  = slot === "before" ? "rgba(15,15,20,0.68)" : "#3478F6";
                const pillBdr = slot === "before" ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.22)";
                return (
                  <motion.button key={slot} whileTap={{ scale: 0.97 }} onClick={() => setPickerFor(slot)}
                    className="flex-1 rounded-2xl overflow-hidden relative"
                    style={{ aspectRatio: "3/4", background: "#F3F4F6", border: `1.5px solid ${isSet ? "#BFDBFE" : "#E5E7EB"}` }}>
                    {isSet ? (
                      <>
                        <img src={isSet} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        {/* Pill + close row */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <div className="rounded-full px-2.5 py-1"
                            style={{ background: pillBg, border: `1px solid ${pillBdr}`, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.08em" }}>{label}</span>
                          </div>
                          <motion.button whileTap={{ scale: 0.88 }}
                            onClick={e => { e.stopPropagation(); slot === "before" ? setBeforeUrl(null) : setAfterUrl(null); }}
                            className="flex items-center justify-center rounded-full"
                            style={{ width: 24, height: 24, background: "rgba(0,0,0,0.52)", border: "1px solid rgba(255,255,255,0.15)" }}>
                            <X size={10} color="#fff" strokeWidth={2.5} />
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center justify-center rounded-full"
                          style={{ width: 36, height: 36, background: "#E5E7EB" }}>
                          <Plus size={16} strokeWidth={2} style={{ color: "#9CA3AF" }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.07em" }}>{label}</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Hint when neither selected */}
            {!beforeUrl && !afterUrl && (
              <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
                Tap each slot to pick a photo from this project
              </p>
            )}

            {/* Share + export — appear when both selected */}
            <AnimatePresence>
              {bothSelected && (
                <motion.div key="share-actions"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-3">

                  {/* ── Share Comparison — compact ── */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1" style={{ height: 1, background: "#F3F4F6" }} />
                    <span style={{ fontSize: 10, color: "#D1D5DB", fontWeight: 600, letterSpacing: "0.06em" }}>SHARE COMPARISON</span>
                    <div className="flex-1" style={{ height: 1, background: "#F3F4F6" }} />
                  </div>

                  {/* WhatsApp + Email — side-by-side pills */}
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleWa}
                      className="flex-1 flex items-center justify-center rounded-2xl"
                      style={{ height: 44, background: waState === "done" ? "#dcfce7" : "#f0fdf4", border: `1.5px solid ${waState === "done" ? "#86efac" : "#bbf7d0"}`, transition: "background 0.2s, border-color 0.2s" }}>
                      <AnimatePresence mode="wait">
                        {waState === "loading"
                          ? <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Loader2 size={13} style={{ color: "#16a34a" }} className="animate-spin" /></motion.div>
                          : waState === "done"
                          ? <motion.div key="d" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 24 }} className="flex items-center gap-1"><Check size={13} color="#16a34a" strokeWidth={2.5} /><span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>Sent!</span></motion.div>
                          : <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5"><WAIcon /><span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>WhatsApp</span></motion.div>
                        }
                      </AnimatePresence>
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleEmail}
                      className="flex-1 flex items-center justify-center rounded-2xl"
                      style={{ height: 44, background: emailState === "done" ? "#eff6ff" : "#eef3ff", border: `1.5px solid ${emailState === "done" ? "#93c5fd" : "#bfdbfe"}`, transition: "background 0.2s, border-color 0.2s" }}>
                      <AnimatePresence mode="wait">
                        {emailState === "loading"
                          ? <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Loader2 size={13} style={{ color: "#1D3D8A" }} className="animate-spin" /></motion.div>
                          : emailState === "done"
                          ? <motion.div key="d" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 24 }} className="flex items-center gap-1"><Check size={13} color="#1D3D8A" strokeWidth={2.5} /><span style={{ fontSize: 12, fontWeight: 700, color: "#1D3D8A" }}>Sent!</span></motion.div>
                          : <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5"><Mail size={13} style={{ color: "#1D3D8A" }} /><span style={{ fontSize: 12, fontWeight: 700, color: "#1D3D8A" }}>Email</span></motion.div>
                        }
                      </AnimatePresence>
                    </motion.button>
                  </div>

                  {/* Copy link — slim full-width row */}
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleCopy}
                    className="w-full flex items-center gap-2.5 rounded-2xl px-3.5"
                    style={{ height: 40, background: copied ? "#f5f3ff" : "#fafafa", border: `1.5px solid ${copied ? "#ddd6fe" : "#E5E7EB"}`, transition: "background 0.2s, border-color 0.2s" }}>
                    <div className="flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ width: 24, height: 24, background: copied ? "#6366f115" : "#F3F4F6" }}>
                      {copied ? <Check size={11} color="#6366f1" strokeWidth={2.5} /> : <Copy size={11} style={{ color: "#9CA3AF" }} strokeWidth={2} />}
                    </div>
                    <span className="flex-1 truncate text-left" style={{ fontSize: 11, fontWeight: 600, color: copied ? "#6366f1" : "#6B7280" }}>
                      {copied ? "Link copied!" : shareUrl.replace("https://", "")}
                    </span>
                    {!copied && <ChevronRight size={12} style={{ color: "#D1D5DB", flexShrink: 0 }} />}
                  </motion.button>

                  {/* ── Export PDF — compact ── */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1" style={{ height: 1, background: "#F3F4F6" }} />
                    <span style={{ fontSize: 10, color: "#D1D5DB", fontWeight: 600, letterSpacing: "0.06em" }}>EXPORT PDF</span>
                    <div className="flex-1" style={{ height: 1, background: "#F3F4F6" }} />
                  </div>

                  {/* PDF trigger row */}
                  <motion.button whileTap={pdfState === "loading" ? {} : { scale: 0.97 }} onClick={handlePdf}
                    className="w-full flex items-center gap-3 rounded-2xl px-3.5"
                    style={{
                      height: 50,
                      background: pdfState === "done" ? "#FEF3C7" : "#F5F8FF",
                      border: `1.5px solid ${pdfState === "done" ? "#D97706" : "#dbeafe"}`,
                      transition: "background 0.3s, border-color 0.3s",
                    }}>
                    <AnimatePresence mode="wait">
                      {pdfState === "idle"
                        ? <motion.div key="i" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex-shrink-0"><PdfFileIcon size={36} /></motion.div>
                        : <motion.div key="state" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center justify-center rounded-full flex-shrink-0"
                            style={{ width: 32, height: 32, background: pdfState === "done" ? "#FDE68A" : "#EEF3FF" }}>
                            {pdfState === "loading"
                              ? <Loader2 size={14} style={{ color: "#3478F6" }} className="animate-spin" />
                              : <Check size={14} color="#D97706" strokeWidth={2.5} />
                            }
                          </motion.div>
                      }
                    </AnimatePresence>
                    <div className="flex-1 text-left min-w-0">
                      <p style={{ fontSize: 13, fontWeight: 700, color: pdfState === "done" ? "#92400E" : "#0E1F40" }}>
                        {pdfState === "loading" ? "Generating PDF…" : pdfState === "done" ? "PDF ready — send it" : "Export as PDF"}
                      </p>
                      {pdfState === "done"
                        ? <p style={{ fontSize: 11, color: "#B45309", marginTop: 1 }}>Share via WhatsApp or Email below</p>
                        : <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Side-by-side comparison report</p>
                      }
                    </div>
                    {pdfState === "idle" && <ChevronRight size={13} style={{ color: "#BFDBFE", flexShrink: 0 }} />}
                  </motion.button>

                  {/* Compact 2-button share strip — pops in right under PDF row */}
                  <AnimatePresence>
                    {pdfState === "done" && (
                      <motion.div
                        key="pdf-strip"
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                        className="flex gap-2.5">

                        {/* WhatsApp pill */}
                        <motion.button whileTap={{ scale: 0.95 }} onClick={handlePdfWa}
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl"
                          style={{
                            height: 48,
                            background: pdfWaState === "done" ? "#dcfce7" : "#f0fdf4",
                            border: `1.5px solid ${pdfWaState === "done" ? "#86efac" : "#bbf7d0"}`,
                            transition: "background 0.2s, border-color 0.2s",
                          }}>
                          <AnimatePresence mode="wait">
                            {pdfWaState === "loading"
                              ? <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                  <Loader2 size={14} style={{ color: "#16a34a" }} className="animate-spin" />
                                </motion.div>
                              : pdfWaState === "done"
                              ? <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 24 }} className="flex items-center gap-1.5">
                                  <Check size={14} color="#16a34a" strokeWidth={2.5} />
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>Sent!</span>
                                </motion.div>
                              : <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                                  <WAIcon />
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>WhatsApp</span>
                                </motion.div>
                            }
                          </AnimatePresence>
                        </motion.button>

                        {/* Email pill */}
                        <motion.button whileTap={{ scale: 0.95 }} onClick={handlePdfEmail}
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl"
                          style={{
                            height: 48,
                            background: pdfEmailState === "done" ? "#eff6ff" : "#eef3ff",
                            border: `1.5px solid ${pdfEmailState === "done" ? "#93c5fd" : "#bfdbfe"}`,
                            transition: "background 0.2s, border-color 0.2s",
                          }}>
                          <AnimatePresence mode="wait">
                            {pdfEmailState === "loading"
                              ? <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                  <Loader2 size={14} style={{ color: "#1D3D8A" }} className="animate-spin" />
                                </motion.div>
                              : pdfEmailState === "done"
                              ? <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 24 }} className="flex items-center gap-1.5">
                                  <Check size={14} color="#1D3D8A" strokeWidth={2.5} />
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1D3D8A" }}>Sent!</span>
                                </motion.div>
                              : <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                                  <Mail size={14} style={{ color: "#1D3D8A" }} />
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1D3D8A" }}>Email</span>
                                </motion.div>
                            }
                          </AnimatePresence>
                        </motion.button>

                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* ── Photo picker overlay (slides up within sheet) ── */}
        <AnimatePresence>
          {pickerFor && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 rounded-t-3xl" style={{ background: "rgba(0,0,0,0.35)" }}
                onClick={() => setPickerFor(null)} />
              <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 36 }}
                className="absolute left-0 right-0 bottom-0 z-20 rounded-t-3xl overflow-hidden flex flex-col"
                style={{ background: "#fff", maxHeight: "70%" }}
                onClick={e => e.stopPropagation()}>
                <Handle />
                <div className="flex items-center justify-between px-5 pt-1 pb-3 flex-shrink-0"
                  style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0E1F40" }}>
                    Pick {pickerFor === "before" ? "Before" : "After"} photo
                  </span>
                  <button onClick={() => setPickerFor(null)}
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 28, height: 28, background: "#F3F4F6" }}>
                    <X size={13} strokeWidth={2.5} style={{ color: "#6B7280" }} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: "none" }}>
                  <div className="grid grid-cols-3 gap-1.5">
                    {photos.map((url, i) => {
                      const isSelected      = pickerFor === "before" ? beforeUrl === url : afterUrl === url;
                      const isOtherSelected = pickerFor === "before" ? afterUrl === url  : beforeUrl === url;
                      return (
                        <motion.button key={i} whileTap={{ scale: 0.93 }}
                          disabled={isOtherSelected}
                          onClick={() => {
                            if (pickerFor === "before") setBeforeUrl(url);
                            else setAfterUrl(url);
                            setPickerFor(null);
                          }}
                          className="relative overflow-hidden rounded-xl"
                          style={{ aspectRatio: "1", opacity: isOtherSelected ? 0.3 : 1 }}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl"
                              style={{ background: "rgba(52,120,246,0.45)" }}>
                              <Check size={20} color="#fff" strokeWidth={3} />
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 rounded-full flex items-center justify-center"
                            style={{ width: 16, height: 16, background: "rgba(0,0,0,0.5)" }}>
                            <span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>{i + 1}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. CLIENT UPDATE SHEET
   ════════════════════════════════════════════════════════════════ */

export function ClientUpdateSheet({ projects, onClose }: { projects: Project[]; onClose: () => void }) {
  const live = projects.filter(p => p.status === "live");
  const [selectedId, setSelectedId] = useState(live[0]?.id ?? "1");
  const [waState, setWaState] = useState<"idle" | "loading" | "done">("idle");
  const [copied,  setCopied]  = useState(false);

  const sel = live.find(p => p.id === selectedId) ?? live[0];
  const photos = getPhotos(selectedId);
  const previewPhotos = photos.slice(0, 3);
  const [excluded, setExcluded] = useState<Set<number>>(new Set());

  const clientName = sel?.client ?? "Client";
  const projectName = sel?.name ?? "the project";
  const contribs = getContributors(selectedId);
  const total = contribs.reduce((s, c) => s + c.count, 0);
  const shareUrl = `https://jobpics.uk/project/${selectedId}`;

  const defaultMsg = `Hi ${clientName},\n\nQuick update on ${projectName} — ${total} photos added today by the site team.\n\nKey progress captured today. Please review and let us know if you have any questions.\n\nView full photo log: ${shareUrl}\n\n— James Walsh, JobPics`;
  const [message, setMessage] = useState(defaultMsg);

  // Reset message when project changes
  const handleProjectChange = (id: string) => {
    setSelectedId(id);
    setExcluded(new Set());
    const newSel = live.find(p => p.id === id);
    const newContribs = getContributors(id);
    const newTotal = newContribs.reduce((s, c) => s + c.count, 0);
    setMessage(`Hi ${newSel?.client ?? "Client"},\n\nQuick update on ${newSel?.name ?? "the project"} — ${newTotal} photos added today by the site team.\n\nKey progress captured today. Please review and let us know if you have any questions.\n\nView full photo log: https://jobpics.uk/project/${id}\n\n— James Walsh, JobPics`);
  };

  const includedCount = previewPhotos.length - excluded.size;
  const waMsg = encodeURIComponent(`${message}${includedCount > 0 ? `\n\n📸 ${includedCount} photos attached` : ""}`);

  const handleWa = () => {
    setWaState("loading");
    setTimeout(() => { window.open(`https://wa.me/?text=${waMsg}`, "_blank"); setWaState("done"); setTimeout(() => setWaState("idle"), 2500); }, 500);
  };
  const handleCopy = () => { navigator.clipboard.writeText(message).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2500); };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-40" style={{ background: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 38 }}
        className="absolute left-0 right-0 bottom-0 z-50 flex flex-col bg-white"
        style={{ borderRadius: "26px 26px 0 0", maxHeight: "91%" }}
        onClick={e => e.stopPropagation()}>
        <Handle />
        <Header title="Client Update" onClose={onClose} />

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="px-5 pt-4 pb-8 flex flex-col gap-4">

            {/* To: row */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", flexShrink: 0 }}>TO</span>
              <div className="flex-1 rounded-full px-3 py-1.5" style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#D97706" }}>{clientName}</span>
              </div>
            </div>

            {/* Project picker */}
            <ProjectPicker projects={projects} selectedId={selectedId} onSelect={handleProjectChange} />

            {/* Message editor */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</span>
                <span style={{ fontSize: 10, color: "#D1D5DB" }}>{message.length} chars</span>
              </div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={7}
                className="w-full rounded-2xl px-4 py-3.5 outline-none resize-none"
                style={{
                  background: "#F9FAFB",
                  border: "1.5px solid #E5E7EB",
                  fontSize: 13,
                  color: "#374151",
                  lineHeight: 1.65,
                }}
              />
            </div>

            {/* Attached photos */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Attached photos
                </span>
                <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                  {includedCount} of {previewPhotos.length} · tap to exclude
                </span>
              </div>
              <div className="flex gap-2">
                {previewPhotos.map((url, i) => {
                  const isExcluded = excluded.has(i);
                  return (
                    <motion.button key={i} whileTap={{ scale: 0.93 }}
                      onClick={() => setExcluded(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                      className="flex-1 rounded-xl overflow-hidden relative"
                      style={{ aspectRatio: "1", border: isExcluded ? "2px solid #F3F4F6" : "2px solid #BFDBFE" }}>
                      <img src={url} alt="" className="w-full h-full object-cover"
                        style={{ opacity: isExcluded ? 0.3 : 1, transition: "opacity 0.18s" }} />
                      {isExcluded && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                          <X size={18} strokeWidth={2.5} style={{ color: "#9CA3AF" }} />
                        </div>
                      )}
                      {!isExcluded && (
                        <div className="absolute top-1 right-1 flex items-center justify-center rounded-full"
                          style={{ width: 16, height: 16, background: "#3478F6" }}>
                          <Check size={8} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <ActionRow
              icon={<WAIcon />} label={waState === "done" ? "Sent!" : "Send via WhatsApp"}
              sub={`To ${clientName}`} color="#16a34a"
              onClick={handleWa} state={waState} />
            <ActionRow
              icon={<Copy size={16} style={{ color: "#6366f1" }} />}
              label={copied ? "Message copied!" : "Copy message"}
              sub="Paste into any app" color="#6366f1"
              onClick={handleCopy} state={copied ? "done" : "idle"} />

          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. AUTOMATION SHEET
   ════════════════════════════════════════════════════════════════ */

const REPORT_TIMES = ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button onClick={() => onChange(!on)} whileTap={{ scale: 0.92 }}
      className="flex-shrink-0 rounded-full relative"
      style={{ width: 44, height: 26, background: on ? "#3478F6" : "#E5E7EB", transition: "background 0.2s" }}>
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-1 rounded-full"
        style={{ width: 18, height: 18, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }} />
    </motion.button>
  );
}

export function AutomationSheet({ projects, onClose }: { projects: Project[]; onClose: () => void }) {
  const [reportOn,    setReportOn]    = useState(true);
  const [reportTimeIdx, setReportTimeIdx] = useState(1); // 5:00 PM default
  const [alertsOn,    setAlertsOn]    = useState(true);
  const [inactiveOn,  setInactiveOn]  = useState(false);
  const [inactiveDays, setInactiveDays] = useState(3);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const liveCount = projects.filter(p => p.status === "live").length;

  const comingSoon = [
    { icon: Sparkles, label: "AI auto-labelling", sub: "Detect structural, electrical & safety issues automatically" },
    { icon: BarChart3, label: "Weekly summary PDF", sub: "Auto-generate weekly report every Monday morning" },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-40" style={{ background: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 38 }}
        className="absolute left-0 right-0 bottom-0 z-50 flex flex-col bg-white"
        style={{ borderRadius: "26px 26px 0 0", maxHeight: "91%" }}
        onClick={e => e.stopPropagation()}>
        <Handle />
        <Header title="Automations" onClose={onClose} />

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="px-5 pt-4 pb-8 flex flex-col gap-5">

            {/* Coverage note */}
            <div className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3"
              style={{ background: "#EEF3FF", border: "1px solid #BFDBFE" }}>
              <Zap size={14} strokeWidth={2} style={{ color: "#F97316", flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: "#1D3D8A", lineHeight: 1.4 }}>
                Automations apply to all <span style={{ fontWeight: 700 }}>{liveCount} live project{liveCount !== 1 ? "s" : ""}</span> in your account.
              </p>
            </div>

            {/* Active automations */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em", paddingLeft: 2 }}>
                Active
              </span>

              {/* Daily Report */}
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ width: 36, height: 36, background: "#EEF3FF" }}>
                    <FileText size={15} strokeWidth={2} style={{ color: "#3478F6" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Daily report to client</p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Auto-generate & send each day</p>
                  </div>
                  <Toggle on={reportOn} onChange={setReportOn} />
                </div>
                <AnimatePresence>
                  {reportOn && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3"
                        style={{ borderTop: "1px solid #F3F4F6", background: "#F9FAFB" }}>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>Send time</span>
                        <motion.button whileTap={{ scale: 0.93 }}
                          onClick={() => setReportTimeIdx(i => (i + 1) % REPORT_TIMES.length)}
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                          style={{ background: "#3478F6" }}>
                          <Clock size={11} color="#fff" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{REPORT_TIMES[reportTimeIdx]}</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Upload alerts */}
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
                style={{ border: "1px solid #E5E7EB" }}>
                <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 36, height: 36, background: "#F0FDFA" }}>
                  <Bell size={15} strokeWidth={2} style={{ color: "#0D9488" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Upload alerts</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Notify team when photos are posted</p>
                </div>
                <Toggle on={alertsOn} onChange={setAlertsOn} />
              </div>

              {/* Inactivity alert */}
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ width: 36, height: 36, background: "#FFFBEB" }}>
                    <Send size={15} strokeWidth={2} style={{ color: "#D97706" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Inactivity alert</p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Flag if no photos uploaded</p>
                  </div>
                  <Toggle on={inactiveOn} onChange={setInactiveOn} />
                </div>
                <AnimatePresence>
                  {inactiveOn && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3"
                        style={{ borderTop: "1px solid #F3F4F6", background: "#F9FAFB" }}>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>Alert after</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 5, 7].map(d => (
                            <motion.button key={d} whileTap={{ scale: 0.88 }}
                              onClick={() => setInactiveDays(d)}
                              className="rounded-full px-3 py-1.5 flex-shrink-0"
                              style={{
                                background: inactiveDays === d ? "#D97706" : "#F3F4F6",
                                transition: "background 0.15s",
                              }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: inactiveDays === d ? "#fff" : "#6B7280" }}>
                                {d}d
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Coming soon */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontSize: 11, fontWeight: 700, color: "#D1D5DB", textTransform: "uppercase", letterSpacing: "0.07em", paddingLeft: 2 }}>
                Coming soon
              </span>
              {comingSoon.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
                  style={{ border: "1px solid #F3F4F6", background: "#FAFAFA", opacity: 0.6 }}>
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ width: 36, height: 36, background: "#F3F4F6" }}>
                    <Icon size={15} strokeWidth={2} style={{ color: "#9CA3AF" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280" }}>{label}</p>
                    <p style={{ fontSize: 11, color: "#D1D5DB", marginTop: 1 }}>{sub}</p>
                  </div>
                  <div className="rounded-full px-2 py-0.5 flex-shrink-0" style={{ background: "#F3F4F6" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.05em" }}>SOON</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Save button */}
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 rounded-full"
              style={{ height: 52, background: saved ? "#16A34A" : "#3478F6", transition: "background 0.25s" }}>
              <AnimatePresence mode="wait">
                {saved
                  ? <motion.div key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <CheckCircle size={16} color="#fff" strokeWidth={2.5} />
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Saved</span>
                    </motion.div>
                  : <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Save settings</motion.span>
                }
              </AnimatePresence>
            </motion.button>

          </div>
        </div>
      </motion.div>
    </>
  );
}