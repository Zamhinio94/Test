import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Check, PencilLine, Copy, AlignLeft, ChevronRight, Tag, AlertCircle, Plus, X, Camera, Loader2, Clock, MapPin, Search, UserPlus, AlertTriangle } from "lucide-react";
import { PdfFileIcon } from "./PdfFileIcon";
import { AnnotationCanvas } from "./AnnotationCanvas";
import { SafetyAlertSheet } from "./SafetyAlertSheet";

const FLOOR_LABELS = ["Ground", "First", "Second", "Third"];
const TYPE_LABELS  = ["Structural", "Electrical", "Plumbing", "Safety", "Defect", "Progress"];
const PRESET_LABELS = [...FLOOR_LABELS, ...TYPE_LABELS];

const PRIORITIES = [
  { id: "low",    label: "Low",    color: "#6b7280", bg: "rgba(107,114,128,0.22)" },
  { id: "medium", label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.22)"  },
  { id: "high",   label: "High",   color: "#f97316", bg: "rgba(249,115,22,0.22)"  },
  { id: "urgent", label: "Urgent", color: "#ef4444", bg: "rgba(239,68,68,0.22)"   },
];

type Sheet = "label" | "priority" | "share" | "markup" | "description" | null;

interface PhotoAnnotation {
  description: string;
  labels: string[];
  priority: string;
  annotated: boolean;
}

interface Photo {
  id: number;
  url: string;
}

interface PhotoReviewSheetProps {
  photos: Photo[];
  projectName: string;
  onUpload: () => void;
  onClose: () => void;
}

/* ── Share sheet — slides up after save, Instagram-style ── */
function PostSaveShareSheet({
  photos,
  projectName,
  onClose,
}: {
  photos: Photo[];
  projectName: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [pdfState, setPdfState] = useState<"idle" | "generating" | "ready">("idle");
  const [teamQuery, setTeamQuery] = useState("");
  const [teamAdded, setTeamAdded] = useState<Set<string>>(new Set());
  const [safetyOpen, setSafetyOpen] = useState(false);
  const shareUrl = `https://jobpics.uk/share/batch-${Math.random().toString(36).slice(2, 8)}`;
  const waMessage = encodeURIComponent(`Site photos saved to ${projectName} — view here: ${shareUrl}`);

  const TEAM_USERS = [
    { id: "u1", name: "Jamie Kearney",  role: "Site Manager",    color: "#3b82f6", initials: "JK" },
    { id: "u2", name: "Sarah Wilson",   role: "Project Lead",    color: "#10b981", initials: "SW" },
    { id: "u3", name: "Mark Thompson",  role: "Foreman",         color: "#ef4444", initials: "MT" },
    { id: "u4", name: "Tom Bradley",    role: "Sub-contractor",  color: "#8b5cf6", initials: "TB" },
    { id: "u5", name: "Rob Hughes",     role: "Site Engineer",   color: "#f59e0b", initials: "RH" },
    { id: "u6", name: "Laura Chen",     role: "Project Manager", color: "#6366f1", initials: "LC" },
    { id: "u7", name: "Phil Davies",    role: "Qty Surveyor",    color: "#06b6d4", initials: "PD" },
  ];

  const filteredTeam = TEAM_USERS.filter(u =>
    !teamQuery.trim() ||
    u.name.toLowerCase().includes(teamQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(teamQuery.toLowerCase())
  );

  const toggleTeam = (id: string) =>
    setTeamAdded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2500); };

  const handlePdf = () => {
    if (pdfState !== "idle") return;
    setPdfState("generating");
    setTimeout(() => setPdfState("ready"), 2000);
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 36 }}
      className="absolute left-0 right-0 bottom-0 z-50 flex flex-col"
      style={{
        borderRadius: "26px 26px 0 0",
        background: "#fff",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.10)",
        border: "0.5px solid rgba(0,0,0,0.07)",
        borderBottom: "none",
        maxHeight: "92%",
      }}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3.5 pb-1 flex-shrink-0">
        <div className="w-8 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
      </div>

      {/* Header — title + ✓ Done top-right */}
      <div className="flex items-center gap-3 px-5 pt-2 pb-3 flex-shrink-0">
        <div className="flex-1">
          <p className="font-semibold" style={{ fontSize: 16, color: "#111827" }}>
            {photos.length} photo{photos.length !== 1 ? "s" : ""} saved
          </p>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>{projectName}</p>
        </div>
        {/* ✓ Done — blue fill */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={onClose}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 500, damping: 28 }}
          className="flex items-center gap-1.5 rounded-full flex-shrink-0"
          style={{ background: "#3478F6", paddingLeft: 14, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}
        >
          <Check size={13} strokeWidth={3} color="#fff" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Done</span>
        </motion.button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {/* ── Safety alert CTA — compact row ── */}
        <div className="px-4 pt-3 pb-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setSafetyOpen(true)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 380, damping: 32 }}
            className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5"
            style={{
              background: "rgba(250,62,62,0.06)",
              border: "1.5px solid rgba(250,62,62,0.22)",
            }}
          >
            {/* Icon */}
            <div className="relative flex-shrink-0 flex items-center justify-center rounded-xl"
              style={{ width: 34, height: 34, background: "rgba(250,62,62,0.10)", border: "1px solid rgba(250,62,62,0.25)" }}>
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ border: "1px solid rgba(250,62,62,0.45)" }}
                animate={{ opacity: [0.4, 0, 0.4], scale: [1, 1.15, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <AlertTriangle size={15} strokeWidth={2.5} style={{ color: "#FA3E3E" }} />
            </div>
            <div className="flex flex-col items-start text-left min-w-0 flex-1">
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FA3E3E" }}>Flag a safety hazard</span>
              <span style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Alert team with priority &amp; location</span>
            </div>
            <ChevronRight size={14} strokeWidth={2.5} style={{ color: "rgba(250,62,62,0.4)", flexShrink: 0 }} />
          </motion.button>
        </div>

        {/* ── Share with your team ── */}
        <div className="px-4" style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
          <p className="mb-3 font-semibold" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af" }}>
            Share with your team
          </p>

          {/* WhatsApp */}
          <motion.a
            href={`https://wa.me/?text=${waMessage}`}
            target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3.5 w-full rounded-2xl mb-2.5 px-4"
            style={{ height: 62, background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)", textDecoration: "none" }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(22,163,74,0.12)" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#16a34a"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold" style={{ fontSize: 14, color: "#111827" }}>Share on WhatsApp</p>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>Send photos &amp; link to your team</p>
            </div>
            <ChevronRight size={14} style={{ color: "rgba(22,163,74,0.45)" }} />
          </motion.a>

          {/* Copy share link */}
          <motion.button
            onClick={handleCopy}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3.5 w-full rounded-2xl px-4 mb-2.5"
            style={{ height: 62, background: copied ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)", border: `1px solid ${copied ? "rgba(99,102,241,0.28)" : "rgba(99,102,241,0.14)"}`, transition: "background 0.22s, border-color 0.22s" }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: copied ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.10)", transition: "background 0.22s" }}>
              <AnimatePresence mode="wait">
                {copied
                  ? <motion.div key="chk" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={17} color="#6366f1" strokeWidth={2.5} /></motion.div>
                  : <motion.div key="cpy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy size={17} style={{ color: "#6366f1" }} strokeWidth={1.75} /></motion.div>
                }
              </AnimatePresence>
            </div>
            <div className="flex-1 text-left">
              <AnimatePresence mode="wait">
                {copied
                  ? <motion.p key="ct" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-semibold" style={{ fontSize: 14, color: "#6366f1" }}>Link copied!</motion.p>
                  : <motion.p key="cp" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-semibold" style={{ fontSize: 14, color: "#111827" }}>Copy share link</motion.p>
                }
              </AnimatePresence>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>{shareUrl.replace("https://", "")}</p>
            </div>
            {!copied && <ChevronRight size={14} style={{ color: "rgba(99,102,241,0.4)" }} />}
          </motion.button>

          {/* PDF report */}
          <motion.button
            onClick={handlePdf}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
            whileTap={pdfState === "idle" ? { scale: 0.97 } : {}}
            className="flex items-center gap-3.5 w-full rounded-2xl px-4"
            style={{
              height: 62,
              background: "#FAFAFA",
              border: `1px solid ${pdfState === "ready" ? "#FECACA" : "#F3F4F6"}`,
              transition: "background 0.3s, border-color 0.3s",
              cursor: pdfState === "generating" ? "default" : "pointer",
            }}
          >
            <AnimatePresence mode="wait">
              {pdfState === "idle"
                ? <motion.div key="idl" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex-shrink-0"><PdfFileIcon size={42} /></motion.div>
                : <motion.div key="state" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FEE2E2" }}>
                    {pdfState === "generating"
                      ? <Loader2 size={17} style={{ color: "#DC2626" }} className="animate-spin" />
                      : <Check size={17} color="#DC2626" strokeWidth={2.5} />
                    }
                  </motion.div>
              }
            </AnimatePresence>
            <div className="flex-1 text-left">
              <AnimatePresence mode="wait">
                {pdfState === "generating"
                  ? <motion.p key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-semibold" style={{ fontSize: 14, color: "#111827" }}>Generating report…</motion.p>
                  : pdfState === "ready"
                    ? <motion.p key="rdy" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="font-semibold" style={{ fontSize: 14, color: "#111827" }}>PDF ready — tap to save</motion.p>
                    : <motion.p key="idl" className="font-semibold" style={{ fontSize: 14, color: "#111827" }}>PDF photo report</motion.p>
                }
              </AnimatePresence>
              <p style={{ fontSize: 11, color: "#9CA3AF" }}>
                {pdfState === "ready" ? `${photos.length} photos · labels · priority` : "Photos, labels & priority in one doc"}
              </p>
            </div>
            {pdfState === "idle" && <ChevronRight size={14} style={{ color: "#FECACA" }} />}
          </motion.button>
        </div>

        {/* ── Add team members ── */}
        <div className="px-4 pt-5 pb-10" style={{ borderTop: "1px solid #f3f4f6", marginTop: 16 }}>
          <p className="mb-3 font-semibold" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af" }}>
            Add team members
          </p>

          {/* Search */}
          <div className="flex items-center gap-2.5 rounded-2xl px-3.5 mb-3"
            style={{ background: "#f9fafb", border: "1.5px solid #f3f4f6", height: 42 }}>
            <Search size={14} strokeWidth={2} style={{ color: "#9ca3af", flexShrink: 0 }} />
            <input
              value={teamQuery}
              onChange={e => setTeamQuery(e.target.value)}
              placeholder="Search by name or role…"
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: 13, color: "#111827" }}
            />
            {teamQuery.length > 0 && (
              <button onClick={() => setTeamQuery("")}>
                <X size={12} strokeWidth={2} style={{ color: "#9ca3af" }} />
              </button>
            )}
          </div>

          {/* People rows */}
          <div className="flex flex-col gap-0.5">
            {filteredTeam.map(user => {
              const isAdded = teamAdded.has(user.id);
              return (
                <motion.button
                  key={user.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleTeam(user.id)}
                  className="flex items-center gap-3 rounded-2xl px-3 text-left w-full"
                  style={{
                    height: 56,
                    background: isAdded ? `${user.color}0d` : "transparent",
                    border: `1.5px solid ${isAdded ? `${user.color}30` : "transparent"}`,
                    transition: "background 0.18s, border-color 0.18s",
                  }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${user.color}18`, border: `1.5px solid ${user.color}30` }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: user.color }}>{user.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.2 }}>{user.name}</p>
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{user.role}</p>
                  </div>
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.div key="added" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                        className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: user.color, flexShrink: 0 }}>
                        <Check size={10} strokeWidth={3} color="#fff" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Added</span>
                      </motion.div>
                    ) : (
                      <motion.div key="add" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#f3f4f6" }}>
                        <UserPlus size={13} strokeWidth={2} style={{ color: "#6b7280" }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safety alert sheet — rendered inside PostSaveShareSheet so it has access to safetyOpen */}
      <AnimatePresence>
        {safetyOpen && (
          <SafetyAlertSheet
            photos={photos}
            projectName={projectName}
            teamMembers={TEAM_USERS}
            onClose={() => setSafetyOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main component ─────────────────────────────────── */
export function PhotoReviewSheet({ photos, projectName, onUpload, onClose }: PhotoReviewSheetProps) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [hudVisible, setHudVisible] = useState(true);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [saved, setSaved] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showAnnotator, setShowAnnotator] = useState(false);

  // Timestamp — captured once at mount (when photos are first reviewed)
  const [timestamp] = useState(() => {
    const now = new Date();
    const date = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return `${date}  ${time}`;
  });

  // Geolocation — request on mount, show coords or a fallback
  const [geoLabel, setGeoLabel] = useState<string>("Locating…");
  useEffect(() => {
    if (!navigator.geolocation) { setGeoLabel("London, UK"); return; }
    const id = navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lat = Math.abs(coords.latitude).toFixed(4);
        const lng = Math.abs(coords.longitude).toFixed(4);
        const latDir = coords.latitude  >= 0 ? "N" : "S";
        const lngDir = coords.longitude >= 0 ? "E" : "W";
        setGeoLabel(`${lat}°${latDir}  ${lng}°${lngDir}`);
      },
      () => setGeoLabel("London, N1C"),
      { timeout: 6000 }
    );
    return () => { /* no cancel needed for getCurrentPosition */ void id; };
  }, []);

  // Shared across all photos
  const [batchDescription, setBatchDescription] = useState("");
  // Per-photo annotations
  const [annotations, setAnnotations] = useState<Record<number, PhotoAnnotation>>(() =>
    Object.fromEntries(photos.map(p => [p.id, { description: "", labels: [], priority: "", annotated: false }]))
  );

  // Custom labels (user-added)
  const [customLabels, setCustomLabels] = useState<string[]>([]);
  const [newLabelText, setNewLabelText] = useState("");
  const labelInputRef = useRef<HTMLInputElement>(null);

  const allLabels = [...PRESET_LABELS, ...customLabels];

  const photo = photos[photoIdx];
  const ann = annotations[photo.id];

  const updateAnn = (patch: Partial<PhotoAnnotation>) =>
    setAnnotations(a => ({ ...a, [photo.id]: { ...a[photo.id], ...patch } }));

  const toggleLabel = (l: string) =>
    updateAnn({ labels: ann.labels.includes(l) ? ann.labels.filter(x => x !== l) : [...ann.labels, l] });

  const addCustomLabel = () => {
    const trimmed = newLabelText.trim();
    if (!trimmed || allLabels.includes(trimmed)) return;
    setCustomLabels(prev => [...prev, trimmed]);
    updateAnn({ labels: [...ann.labels, trimmed] });
    setNewLabelText("");
    labelInputRef.current?.focus();
  };

  const priObj = PRIORITIES.find(p => p.id === ann.priority);

  const handleSave = () => {
    setSaved(true);
    setShowShareSheet(true);
  };

  // Badges
  const labelBadge    = ann.labels.length > 0;
  const priorityBadge = ann.priority !== "";
  const annotateBadge = ann.annotated;

  const PRE_SAVE_ACTIONS = [
    { id: "markup" as const, icon: PencilLine,  label: "Mark up", badge: annotateBadge },
    { id: "label"    as Sheet, icon: Tag,        label: "Label",    badge: labelBadge },
    { id: "priority" as Sheet, icon: AlertCircle, label: "Priority", badge: priorityBadge },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 overflow-hidden"
      style={{ background: "#000" }}
    >

      {/* ── Photo ── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={photo.id}
            src={photo.url}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: 110, background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: 340, background: "linear-gradient(to top, rgba(0,0,0,0.96) 50%, transparent 100%)" }} />
      </div>

      {/* ── Floating annotation chips ── */}
      <AnimatePresence>
        {hudVisible && (ann.labels.length > 0 || ann.priority) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute top-16 left-4 flex flex-col gap-1.5 z-10 pointer-events-none"
          >
            {ann.labels.slice(0, 3).map(l => (
              <div key={l} className="self-start rounded-full px-2.5 py-0.5" style={{ background: "rgba(79,110,247,0.7)", backdropFilter: "blur(10px)" }}>
                <span className="text-white font-semibold" style={{ fontSize: 10 }}>{l}</span>
              </div>
            ))}
            {ann.labels.length > 3 && (
              <div className="self-start rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)" }}>
                <span className="text-white/60 font-semibold" style={{ fontSize: 10 }}>+{ann.labels.length - 3}</span>
              </div>
            )}
            {priObj && (
              <div className="self-start rounded-full px-2.5 py-0.5 flex items-center gap-1" style={{ background: priObj.bg, backdropFilter: "blur(10px)", border: `0.5px solid ${priObj.color}60` }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: priObj.color }} />
                <span className="font-semibold" style={{ fontSize: 10, color: priObj.color }}>{priObj.label}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tap zones ── */}
      <div className="absolute inset-0 z-10 flex" style={{ bottom: 280 }}>
        <div className="flex-1 h-full" onClick={() => photoIdx > 0 && setPhotoIdx(i => i - 1)} />
        <div className="flex-1 h-full" onClick={() => setHudVisible(v => !v)} />
        <div className="flex-1 h-full" onClick={() => photoIdx < photos.length - 1 && setPhotoIdx(i => i + 1)} />
      </div>

      {/* ── Metadata stamp — timestamp + GPS, sits below top HUD ── */}
      <div
        className="absolute right-4 z-[15] pointer-events-none flex flex-col items-end gap-1.5"
        style={{ top: 76 }}
      >
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5"
          style={{
            background: "rgba(0,0,0,0.58)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.5px solid rgba(255,255,255,0.12)",
          }}
        >
          <Clock size={9} style={{ color: "rgba(255,255,255,0.55)", flexShrink: 0 }} />
          <span style={{ fontSize: 9.5, fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>
            {timestamp}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5"
          style={{
            background: "rgba(0,0,0,0.58)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.5px solid rgba(255,255,255,0.12)",
          }}
        >
          <MapPin size={9} style={{ color: "#67e8f9", flexShrink: 0 }} />
          <span style={{ fontSize: 9.5, fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>
            {geoLabel}
          </span>
        </motion.div>
      </div>

      {/* ── Top HUD ── */}
      <AnimatePresence>
        {hudVisible && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4"
          >
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(14px)", border: "0.5px solid rgba(255,255,255,0.12)" }}
            >
              <X size={15} className="text-white" strokeWidth={2} />
            </button>
            <div className="rounded-full px-3.5 py-1.5" style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(14px)", border: "0.5px solid rgba(255,255,255,0.12)" }}>
              <span className="text-white font-semibold" style={{ fontSize: 12 }}>{photoIdx + 1} of {photos.length}</span>
            </div>
            {/* Right slot — tick appears when saved */}
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.div
                  key="saved-tick"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 28 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(34,197,94,0.22)", border: "0.5px solid rgba(34,197,94,0.5)" }}
                >
                  <Check size={16} color="#22c55e" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <div key="empty" className="w-9 h-9" />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom panel ── */}
      <AnimatePresence>
        {hudVisible && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="absolute left-0 right-0 bottom-0 z-20"
          >
            {/* Filmstrip */}
            {photos.length > 1 && (
              <div className="px-4 pb-3">
                <div className="mb-2 self-start inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(12px)", border: "0.5px solid rgba(255,255,255,0.18)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{photos.length}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>photos</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                  {photos.map((p, i) => (
                    <motion.button
                      key={p.id}
                      onClick={() => setPhotoIdx(i)}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        opacity: i === photoIdx ? 1 : 0.62,
                        scale: i === photoIdx ? 1.05 : 0.95,
                      }}
                      transition={{ duration: 0.16 }}
                      className="flex-shrink-0 overflow-hidden relative"
                      style={{
                        width: 60, height: 60,
                        borderRadius: 13,
                        border: i === photoIdx ? "2.5px solid rgba(255,255,255,0.95)" : "2px solid rgba(255,255,255,0.25)",
                        boxShadow: i === photoIdx ? "0 3px 12px rgba(0,0,0,0.4)" : "none",
                      }}
                    >
                      <img src={p.url} alt="" className="w-full h-full object-cover" />
                      <div
                        className="absolute bottom-1 right-1 flex items-center justify-center rounded-full"
                        style={{
                          width: 15, height: 15,
                          background: i === photoIdx ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.52)",
                        }}
                      >
                        <span style={{ fontSize: 8, fontWeight: 700, color: i === photoIdx ? "#000" : "#fff" }}>{i + 1}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Description row */}
            <div className="px-4 pb-3" style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
              <button
                onClick={() => setSheet("description")}
                className="w-full flex items-center gap-3 px-4 active:opacity-80 transition-opacity"
                style={{
                  height: 50,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.13)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "0.5px solid rgba(255,255,255,0.22)",
                }}
              >
                <AlignLeft size={15} strokeWidth={1.75} className="flex-shrink-0" style={{ color: "rgba(255,255,255,0.55)" }} />
                <span className="flex-1 text-left truncate" style={{ fontSize: 13, color: batchDescription ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.42)", fontStyle: batchDescription ? "normal" : "italic" }}>
                  {batchDescription || "Add a description…"}
                </span>
                {batchDescription ? (
                  <span className="rounded-full px-2 py-0.5 flex-shrink-0" style={{ background: "rgba(79,110,247,0.3)", border: "0.5px solid rgba(79,110,247,0.55)" }}>
                    <span style={{ fontSize: 9, color: "#a5b4fc", fontWeight: 600 }}>All photos</span>
                  </span>
                ) : (
                  <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.32)" }} className="flex-shrink-0" />
                )}
              </button>
            </div>

            {/* Action circles */}
            <div className="flex items-start justify-center gap-7 px-4 pt-4 pb-4" style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}>
              {PRE_SAVE_ACTIONS.map(({ id, icon: Icon, label, badge }) => (
                <motion.button
                  key={id}
                  onClick={() => id === "markup" ? setShowAnnotator(true) : setSheet(id as Sheet)}
                  whileTap={{ scale: 0.88 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="relative flex items-center justify-center rounded-full"
                    style={{ width: 58, height: 58, background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.14)" }}
                  >
                    <Icon size={22} className="text-white" strokeWidth={1.5} />
                    {badge && (
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full"
                        style={{ background: "#4F6EF7", border: "1.5px solid #000" }}
                      />
                    )}
                  </div>
                  <span className="text-white/55 font-semibold" style={{ fontSize: 11 }}>{label}</span>
                </motion.button>
              ))}

              <AnimatePresence>
                {saved && (
                  <motion.button
                    key="share-circle"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setShowShareSheet(true)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex items-center justify-center rounded-full" style={{ width: 58, height: 58, background: "rgba(79,110,247,0.22)", border: "0.5px solid rgba(79,110,247,0.5)" }}>
                      <Share2 size={22} strokeWidth={1.5} style={{ color: "#a5b4fc" }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#a5b4fc" }}>Share</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Save button */}
            <div className="px-4 pb-7">
              <AnimatePresence mode="wait">
                {!saved ? (
                  <motion.button
                    key="save"
                    onClick={handleSave}
                    whileTap={{ scale: 0.97 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="w-full rounded-full flex items-center justify-center"
                    style={{ background: "#3478F6", height: 52 }}
                  >
                    <span className="text-white font-bold" style={{ fontSize: 15 }}>
                      Save {photos.length} photo{photos.length !== 1 ? "s" : ""} to {projectName}
                    </span>
                  </motion.button>
                ) : (
                  <motion.div key="spacer" initial={{ opacity: 0 }} animate={{ opacity: 0 }} style={{ height: 52 }} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Half-sheets (Label / Priority / Description / Mark up) ── */}
      <AnimatePresence>
        {sheet !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-30"
              onClick={() => setSheet(null)}
            />
            <motion.div
              key={sheet}
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="absolute left-0 right-0 bottom-0 z-40 flex flex-col"
              style={{
                borderRadius: "22px 22px 0 0",
                background: "rgba(14,14,20,0.98)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderBottom: "none",
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3.5 pb-1 flex-shrink-0">
                <div className="w-8 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
              </div>

              {/* Header — no X, just title + Done */}
              <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
                <div>
                  <span className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>
                    {sheet === "label" ? "Label" : sheet === "priority" ? "Priority" : sheet === "markup" ? "Mark up" : "Description"}
                  </span>
                  {sheet === "description" && (
                    <div className="mt-1">
                      <span className="rounded-full px-2.5 py-0.5 inline-block" style={{ background: "rgba(79,110,247,0.2)", border: "0.5px solid rgba(79,110,247,0.4)" }}>
                        <span style={{ fontSize: 10, color: "#a5b4fc", fontWeight: 600 }}>Applies to all {photos.length} photos</span>
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSheet(null)}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 flex-shrink-0"
                  style={{ background: "#3478F6" }}
                >
                  <Check size={12} strokeWidth={3} color="#fff" />
                  <span className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>Done</span>
                </button>
              </div>

              {/* ── Label sheet ── */}
              {sheet === "label" && (
                <div className="flex-1 overflow-y-auto px-4 pb-10" style={{ scrollbarWidth: "none" }}>

                  {/* Floor row — single horizontal strip */}
                  <p className="mb-2.5 font-semibold" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)" }}>
                    Floor
                  </p>
                  <div className="flex gap-2 mb-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                    {FLOOR_LABELS.map(l => {
                      const on = ann.labels.includes(l);
                      return (
                        <motion.button
                          key={l}
                          onClick={() => toggleLabel(l)}
                          whileTap={{ scale: 0.93 }}
                          animate={{
                            background: on ? "rgba(79,110,247,0.28)" : "rgba(255,255,255,0.07)",
                            borderColor: on ? "rgba(79,110,247,0.7)" : "rgba(255,255,255,0.12)",
                          }}
                          transition={{ duration: 0.13 }}
                          className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2"
                          style={{ border: "0.5px solid" }}
                        >
                          {on && <Check size={10} strokeWidth={3} color="#a5b4fc" />}
                          <span className="font-semibold whitespace-nowrap" style={{ fontSize: 12, color: on ? "#a5b4fc" : "rgba(255,255,255,0.55)" }}>
                            {l}
                          </span>
                        </motion.button>
                      );
                    })}
                    {/* Add custom floor */}
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => {
                        const val = prompt("Enter floor name");
                        if (val?.trim()) {
                          setCustomLabels(prev => prev.includes(val.trim()) ? prev : [...prev, val.trim()]);
                          updateAnn({ labels: [...ann.labels, val.trim()] });
                        }
                      }}
                      className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2"
                      style={{ border: "0.5px dashed rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.04)" }}
                    >
                      <Plus size={10} strokeWidth={2.5} style={{ color: "rgba(255,255,255,0.35)" }} />
                      <span className="font-semibold whitespace-nowrap" style={{ fontSize: 12, color: "rgba(255,255,255,0.32)" }}>Add</span>
                    </motion.button>
                  </div>

                  {/* Type labels — clean 3-column grid */}
                  <p className="mb-2.5 font-semibold" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)" }}>
                    Type
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {TYPE_LABELS.map(l => {
                      const on = ann.labels.includes(l);
                      return (
                        <motion.button
                          key={l}
                          onClick={() => toggleLabel(l)}
                          whileTap={{ scale: 0.93 }}
                          animate={{
                            background: on ? "rgba(79,110,247,0.28)" : "rgba(255,255,255,0.07)",
                            borderColor: on ? "rgba(79,110,247,0.7)" : "rgba(255,255,255,0.12)",
                          }}
                          transition={{ duration: 0.13 }}
                          className="flex items-center justify-center gap-1 rounded-2xl py-2.5"
                          style={{ border: "0.5px solid" }}
                        >
                          {on && <Check size={10} strokeWidth={3} color="#a5b4fc" />}
                          <span className="font-semibold" style={{ fontSize: 12, color: on ? "#a5b4fc" : "rgba(255,255,255,0.55)" }}>
                            {l}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Custom labels */}
                  {customLabels.length > 0 && (
                    <>
                      <p className="mb-2.5 font-semibold" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)" }}>
                        Custom
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {customLabels.map(l => {
                          const on = ann.labels.includes(l);
                          return (
                            <motion.button
                              key={l}
                              onClick={() => toggleLabel(l)}
                              whileTap={{ scale: 0.93 }}
                              animate={{
                                background: on ? "rgba(79,110,247,0.28)" : "rgba(255,255,255,0.07)",
                                borderColor: on ? "rgba(79,110,247,0.7)" : "rgba(255,255,255,0.28)",
                              }}
                              transition={{ duration: 0.13 }}
                              className="flex items-center gap-1.5 rounded-full px-3.5 py-2"
                              style={{ border: "0.5px solid" }}
                            >
                              {on && <Check size={10} strokeWidth={3} color="#a5b4fc" />}
                              <span className="font-semibold" style={{ fontSize: 12, color: on ? "#a5b4fc" : "rgba(255,255,255,0.55)" }}>
                                {l}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Add custom label */}
                  <div
                    className="flex items-center gap-2 rounded-2xl px-3 py-2 mb-2"
                    style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)" }}
                  >
                    <Plus size={14} strokeWidth={2} style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
                    <input
                      ref={labelInputRef}
                      value={newLabelText}
                      onChange={e => setNewLabelText(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addCustomLabel()}
                      placeholder="Add a custom label…"
                      className="flex-1 bg-transparent outline-none"
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", caretColor: "#a5b4fc" }}
                    />
                    <AnimatePresence>
                      {newLabelText.trim().length > 0 && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={addCustomLabel}
                          className="rounded-full px-2.5 py-1 flex-shrink-0"
                          style={{ background: "#4F6EF7" }}
                        >
                          <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>Add</span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* ── Priority sheet ── */}
              {sheet === "priority" && (
                <div className="px-4 pb-10">
                  <p className="text-white/35 mb-4 font-semibold" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    How urgent is this?
                  </p>
                  <div className="flex flex-col gap-2.5 mb-2">
                    {PRIORITIES.map(p => {
                      const on = ann.priority === p.id;
                      return (
                        <motion.button
                          key={p.id}
                          onClick={() => updateAnn({ priority: on ? "" : p.id })}
                          whileTap={{ scale: 0.98 }}
                          animate={{
                            background: on ? p.bg : "rgba(255,255,255,0.06)",
                            borderColor: on ? p.color : "rgba(255,255,255,0.1)",
                          }}
                          transition={{ duration: 0.13 }}
                          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl"
                          style={{ border: "0.5px solid" }}
                        >
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color, opacity: on ? 1 : 0.35 }} />
                          <span className="font-semibold flex-1 text-left" style={{ fontSize: 14, color: on ? p.color : "rgba(255,255,255,0.5)" }}>
                            {p.label}
                          </span>
                          {on && <Check size={14} strokeWidth={2.5} style={{ color: p.color }} />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Description sheet ── */}
              {sheet === "description" && (
                <div className="flex-1 px-4 pb-10 flex flex-col" style={{ scrollbarWidth: "none" }}>
                  <textarea
                    value={batchDescription}
                    onChange={e => setBatchDescription(e.target.value)}
                    placeholder="e.g. Roof inspection, east elevation, 3rd floor…"
                    rows={4}
                    className="w-full rounded-2xl px-4 py-3.5 outline-none resize-none mb-4"
                    style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 1.6 }}
                    autoFocus
                  />
                  {batchDescription.length > 0 && (
                    <p className="text-right -mt-2 mb-3" style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>
                      {batchDescription.length} chars
                    </p>
                  )}
                </div>
              )}

              {/* ── Mark up sheet ── */}
              {sheet === "markup" && (
                <div className="px-4 pb-10 flex flex-col items-center gap-4">
                  <div
                    className="w-full rounded-2xl p-6 flex flex-col items-center gap-3"
                    style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.08)" }}
                  >
                    <PencilLine size={28} className="text-white/25" strokeWidth={1.5} />
                    <p className="text-white/50 text-center" style={{ fontSize: 13, lineHeight: 1.55 }}>
                      Draw arrows, circles and text directly on the photo.
                    </p>
                    <p className="text-white/25 text-center" style={{ fontSize: 11 }}>
                      Coming in the next update
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Annotation canvas (full-screen) ── */}
      <AnimatePresence>
        {showAnnotator && (
          <AnnotationCanvas
            photoUrl={photo.url}
            onDone={(hasAnnotations) => {
              if (hasAnnotations) updateAnn({ annotated: true });
              setShowAnnotator(false);
            }}
            onCancel={() => setShowAnnotator(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Post-save share sheet ── */}
      <AnimatePresence>
        {showShareSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/50"
              onClick={() => { setShowShareSheet(false); onClose(); }}
            />
            <PostSaveShareSheet
              photos={photos}
              projectName={projectName}
              onClose={() => { setShowShareSheet(false); onClose(); }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}