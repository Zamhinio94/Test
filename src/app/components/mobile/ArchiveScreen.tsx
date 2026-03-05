import { StatusBar } from "./StatusBar";
import { PdfFileIcon } from "./PdfFileIcon";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, Search, X, Image as ImageIcon,
  MapPin, Calendar, Link2, Share2, Mail,
  Sparkles, Download, Users, MessageSquare, RotateCcw,
} from "lucide-react";
import type { Project } from "./ProjectsScreen";

interface Props {
  projects: Project[];
  onBack: () => void;
}

/* ─── WhatsApp icon (inline SVG) ────────────────────────────── */

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─── Completed project full page ────────────────────────────── */

function CompletedProjectPage({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  const [copied, setCopied]       = useState(false);
  const [showcased, setShowcased] = useState(false);
  const [reopenConfirm, setReopenConfirm] = useState(false);

  const projectUrl    = `https://jobpics.uk/projects/${project.id}`;
  const trackRecordUrl = `https://jobpics.uk/track-record/${project.id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(projectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `${project.name} by ${project.client} — ${project.photoCount} photos archived on JobPics.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: project.name, text, url: projectUrl });
      } else {
        await navigator.clipboard.writeText(`${text}\n${projectUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* dismissed */ }
  };

  const handleShowcase = async () => {
    const text = `Take a look at our completed project — ${project.name} by ${project.client}. View the full photo record: ${trackRecordUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${project.name} — Track Record`, text, url: trackRecordUrl });
      } else {
        await navigator.clipboard.writeText(trackRecordUrl);
        setShowcased(true);
        setTimeout(() => setShowcased(false), 2000);
      }
    } catch { /* dismissed */ }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi! I wanted to share the photo record for *${project.name}* (${project.client}, ${project.location}).\n\nView the full project on JobPics:\n${projectUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleSMS = () => {
    const text = encodeURIComponent(
      `${project.name} by ${project.client} — ${project.photoCount} photos archived on JobPics.\n\n${projectUrl}`
    );
    window.open(`sms:?body=${text}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Project Record: ${project.name}`);
    const body = encodeURIComponent(
      `Hi,\n\nPlease find the photo record for ${project.name} (${project.client}, ${project.location}) completed ${project.completedDate ?? ""}.\n\nView the full project record on JobPics:\n${projectUrl}\n\nOr view the track record:\n${trackRecordUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  // Fill photos: use recentPhotos + thumbnail fallback to show 6 tiles
  const basePhotos = project.recentPhotos?.length
    ? project.recentPhotos
    : [project.thumbnail];
  const galleryPhotos = [
    ...basePhotos,
    ...Array(Math.max(0, 6 - basePhotos.length)).fill(project.thumbnail),
  ].slice(0, 6);

  const SHARE_ACTIONS = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <WhatsAppIcon size={18} />,
      bg: "#dcfce7",
      color: "#16a34a",
      action: handleWhatsApp,
    },
    {
      id: "copy",
      label: copied ? "Copied!" : "Copy link",
      icon: <Link2 size={17} strokeWidth={2} />,
      bg: copied ? "#f0fdf4" : "#ede9fe",
      color: copied ? "#16a34a" : "#7c3aed",
      action: handleCopy,
    },
    {
      id: "showcase",
      label: showcased ? "Copied!" : "Showcase",
      icon: <Sparkles size={17} strokeWidth={2} />,
      bg: "#fef9c3",
      color: "#ca8a04",
      action: handleShowcase,
    },
    {
      id: "email",
      label: "Email",
      icon: <Mail size={17} strokeWidth={2} />,
      bg: "#dbeafe",
      color: "#1d4ed8",
      action: handleEmail,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar theme="light" />

      {/* iOS nav header */}
      <div className="flex items-center px-4 pt-1 pb-2 flex-shrink-0">
        <motion.button
          whileTap={{ scale: 0.93 }} onClick={onBack}
          className="flex items-center gap-0.5"
        >
          <ChevronLeft size={17} strokeWidth={2.5} style={{ color: "#3478F6" }} />
          <span style={{ fontSize: 15, color: "#3478F6", fontWeight: 500 }}>Complete</span>
        </motion.button>
        <p className="flex-1 text-center truncate px-2"
          style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
          {project.name}
        </p>
        <div style={{ width: 80 }} />
      </div>

      {/* Scrollable page content */}
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: 108 }}>

        {/* ── Hero photo ── */}
        <div className="relative mx-4 rounded-3xl overflow-hidden" style={{ height: 228 }}>
          <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0) 52%)" }} />

          {/* COMPLETED badge */}
          <div className="absolute top-3.5 right-3.5 rounded-full px-3 py-1.5 flex items-center justify-center"
            style={{ background: "rgba(16,185,129,0.92)", backdropFilter: "blur(8px)" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.08em", lineHeight: 1 }}>
              COMPLETE
            </span>
          </div>

          {/* Name + client overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.15 }}>
              {project.name}
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 3 }}>
              {project.client}
            </p>
          </div>
        </div>

        {/* ── Location + date pills ── */}
        <div className="flex gap-2 px-4 mt-3">
          <div className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 flex-1"
            style={{ background: "#f9fafb", border: "1px solid #f3f4f6" }}>
            <MapPin size={12} strokeWidth={2} style={{ color: "#9ca3af", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {project.location}
            </span>
          </div>
          {project.completedDate && (
            <div className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 flex-shrink-0"
              style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <Calendar size={12} strokeWidth={2} style={{ color: "#16a34a", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, whiteSpace: "nowrap" }}>
                {project.completedDate}
              </span>
            </div>
          )}
        </div>

        {/* ── Stats row ── */}
        <div className="flex items-center gap-0 mx-4 mt-2 rounded-2xl overflow-hidden"
          style={{ border: "1px solid #f3f4f6", background: "#fafafa" }}>
          <div className="flex-1 flex items-center gap-2 px-4 py-3">
            <ImageIcon size={14} strokeWidth={2} style={{ color: "#6366f1", flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{project.photoCount}</span>
              <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 4 }}>photos</span>
            </div>
          </div>
          <div style={{ width: 1, height: 28, background: "#e5e7eb", flexShrink: 0 }} />
          <div className="flex-1 flex items-center gap-2 px-4 py-3">
            <Users size={14} strokeWidth={2} style={{ color: "#14b8a6", flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{project.memberCount}</span>
              <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 4 }}>team</span>
            </div>
          </div>
        </div>

        {/* ── Share section ── */}
        <div className="px-4 mt-5">
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>
            Share
          </p>
          <div className="flex gap-2">
            {[
              { id: "whatsapp", label: "WhatsApp", icon: <WhatsAppIcon size={15} />,                  bg: "#e8fdf1", iconBg: "#25D366",                       fg: "#15803d", action: handleWhatsApp },
              { id: "sms",     label: "Text",      icon: <MessageSquare size={15} strokeWidth={1.8} />, bg: "#eff6ff", iconBg: "#007AFF",                       fg: "#1d4ed8", action: handleSMS      },
              { id: "copy",    label: copied ? "Copied!" : "Copy", icon: <Link2 size={15} strokeWidth={2} />, bg: copied ? "#e8fdf1" : "#eef2ff", iconBg: copied ? "#10b981" : "#6366f1", fg: copied ? "#15803d" : "#4f46e5", action: handleCopy },
              { id: "email",   label: "Email",     icon: <Mail size={15} strokeWidth={1.8} />,          bg: "#f9fafb", iconBg: "#6b7280",                       fg: "#6b7280", action: handleEmail    },
            ].map(a => (
              <motion.button
                key={a.id}
                whileTap={{ scale: 0.88 }}
                onClick={a.action}
                className="flex-1 flex flex-col items-center gap-2 py-3 rounded-2xl"
                style={{ background: a.bg, transition: "background 0.2s" }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: a.iconBg, transition: "background 0.2s" }}>
                  <span style={{ color: "#fff", display: "flex", alignItems: "center" }}>{a.icon}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: a.fg, letterSpacing: "0.01em" }}>{a.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Track Record section ── */}
        <div className="px-4 mt-5">
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>
            Track Record
          </p>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12, lineHeight: 1.5 }}>
            Use your jobs to help you win more work — share with clients, your website, or LinkedIn
          </p>

          {/* Track record card — clean, minimal */}
          <div className="rounded-2xl overflow-hidden mb-2.5" style={{ border: "1px solid #e5e7eb" }}>
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ background: "#fafafa" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#EDE9FE", border: "1px solid #DDD6FE" }}>
                <Sparkles size={14} strokeWidth={2} style={{ color: "#7C3AED" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Client-facing portfolio view</p>
                <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  jobpics.uk/track-record/{project.id}
                </p>
              </div>
            </div>
            <div style={{ height: 1, background: "#f3f4f6" }} />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleShowcase}
              className="w-full flex items-center justify-center gap-2 py-3.5"
              style={{ background: "#fff" }}
            >
              <Sparkles size={13} strokeWidth={2} style={{ color: showcased ? "#16a34a" : "#7C3AED" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: showcased ? "#16a34a" : "#7C3AED" }}>
                {showcased ? "Link copied!" : "Add to Track Record"}
              </span>
            </motion.button>
          </div>

          {/* PDF photo report — clean red style */}
          <motion.button
            whileTap={{ scale: 0.975 }}
            className="w-full flex items-center gap-3 rounded-2xl px-4 mb-2.5"
            style={{ height: 64, background: "#FAFAFA", border: "1px solid #F3F4F6" }}
          >
            <PdfFileIcon size={40} className="flex-shrink-0" />
            <div className="flex-1 text-left">
              <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>PDF photo report</p>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>PDF · {project.photoCount} photos · all annotations</p>
            </div>
            <ChevronLeft size={14} strokeWidth={2} style={{ color: "#FECACA", transform: "rotate(180deg)" }} />
          </motion.button>

          {/* Re-open project */}
          <AnimatePresence>
            {!reopenConfirm ? (
              <motion.button
                key="reopen-prompt"
                whileTap={{ scale: 0.97 }}
                onClick={() => setReopenConfirm(true)}
                className="w-full flex items-center gap-3 rounded-2xl px-4"
                style={{ height: 52, background: "#F9FAFB", border: "1px solid #F3F4F6" }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#FFF7ED", border: "1px solid #FDBA74" }}>
                  <RotateCcw size={14} strokeWidth={2} style={{ color: "#F97316" }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>Re-open project</span>
                <ChevronLeft size={13} strokeWidth={2} style={{ color: "#D1D5DB", marginLeft: "auto", transform: "rotate(180deg)" }} />
              </motion.button>
            ) : (
              <motion.div
                key="reopen-confirm"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl px-4 py-3.5"
                style={{ background: "#FFF7ED", border: "1.5px solid #FDBA74" }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12 }}>
                  Re-open "{project.name}" and move it back to Live?
                </p>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setReopenConfirm(false)}
                    className="flex-1 rounded-xl py-2.5 flex items-center justify-center"
                    style={{ background: "#fff", border: "1px solid #E5E7EB" }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>Cancel</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { setReopenConfirm(false); onBack(); }}
                    className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-1.5"
                    style={{ background: "#F97316" }}
                  >
                    <RotateCcw size={12} strokeWidth={2.5} color="#fff" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Re-open</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Photos gallery ── */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Photos
            </p>
            <button style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>
              View all {project.photoCount} →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {galleryPhotos.map((url, i) => (
              <motion.div
                key={i}
                whileTap={{ scale: 0.96 }}
                className="rounded-xl overflow-hidden cursor-pointer"
                style={{ aspectRatio: "1 / 1" }}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Archive grid tile ───────────────────────────────────────── */

function ArchiveTile({ project, onSelect }: { project: Project; onSelect: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="w-full text-left flex flex-col"
      style={{ borderRadius: 16, overflow: "hidden", background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="relative" style={{ height: 114 }}>
        <img
          src={project.thumbnail} alt={project.name}
          className="w-full h-full object-cover"
          style={{ filter: "grayscale(38%)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.58) 0%, transparent 52%)" }} />
        <p style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 10px 8px",
          fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.25,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {project.name}
        </p>
      </div>
      <div style={{ padding: "8px 10px 10px" }}>
        <p style={{ fontSize: 11, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {project.client}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span style={{ fontSize: 10, color: "#9ca3af" }}>{project.completedDate ?? project.lastActivity}</span>
          <span style={{ fontSize: 10, color: "#a5b4fc", fontWeight: 600 }}>{project.photoCount} photos</span>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── Archive screen ──────────────────────────────────────────── */

export function ArchiveScreen({ projects, onBack }: Props) {
  const [search, setSearch]     = useState("");
  const [yearFilter, setYear]   = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const totalPhotos = projects.reduce((s, p) => s + p.photoCount, 0);
  const clientCount = new Set(projects.map(p => p.client)).size;

  const years = [...new Set(
    projects
      .map(p => p.completedDate?.match(/\d{4}/)?.[0])
      .filter((y): y is string => Boolean(y))
  )].sort((a, b) => +b - +a);

  const filtered = projects.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.client.toLowerCase().includes(q) &&
        !p.location.toLowerCase().includes(q)
      ) return false;
    }
    if (yearFilter !== "All" && !p.completedDate?.includes(yearFilter)) return false;
    return true;
  });

  return (
    <div className="relative flex flex-col h-full bg-white">

      {/* ── Archive list view ── */}
      <div className="flex flex-col h-full">
        <StatusBar theme="light" />

        {/* Header */}
        <div className="flex items-center px-4 pt-2 pb-3 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }} onClick={onBack}
            className="flex items-center gap-0.5"
          >
            <ChevronLeft size={17} strokeWidth={2.5} style={{ color: "#3478F6" }} />
            <span style={{ fontSize: 15, color: "#3478F6", fontWeight: 500 }}>Home</span>
          </motion.button>
          <p className="flex-1 text-center" style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
            Complete
          </p>
          <div style={{ width: 72 }} />
        </div>

        {/* Stats banner */}
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="flex items-center rounded-2xl px-4 py-3"
            style={{ background: "#f9fafb", border: "1.5px solid #f3f4f6" }}>
            <div className="flex-1 text-center">
              <p style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{projects.length}</p>
              <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>projects</p>
            </div>
            <div style={{ width: 1, height: 28, background: "#e5e7eb" }} />
            <div className="flex-1 text-center">
              <p style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                {totalPhotos >= 1000 ? `${(totalPhotos / 1000).toFixed(1)}k` : totalPhotos}
              </p>
              <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>photos</p>
            </div>
            <div style={{ width: 1, height: 28, background: "#e5e7eb" }} />
            <div className="flex-1 text-center">
              <p style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{clientCount}</p>
              <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>clients</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-2.5 flex-shrink-0">
          <div className="flex items-center gap-2 rounded-2xl px-3.5"
            style={{ background: "#f3f4f6", height: 40 }}>
            <Search size={13} strokeWidth={2} style={{ color: "#9ca3af", flexShrink: 0 }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search projects, clients, locations…"
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: 13, color: "#111827" }}
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} strokeWidth={2} style={{ color: "#d1d5db" }} />
              </button>
            )}
          </div>
        </div>

        {/* Year filter */}
        {years.length > 0 && (
          <div className="flex gap-2 px-4 pb-3 flex-shrink-0 overflow-x-auto no-scrollbar">
            {["All", ...years].map(yr => {
              const on = yearFilter === yr;
              return (
                <motion.button
                  key={yr} whileTap={{ scale: 0.93 }}
                  onClick={() => setYear(yr)}
                  className="flex-shrink-0 rounded-full px-3.5 py-1.5"
                  style={{
                    background: on ? "#111827" : "#f3f4f6",
                    fontSize: 12, fontWeight: on ? 600 : 500,
                    color: on ? "#fff" : "#6b7280",
                    transition: "background 0.12s, color 0.12s",
                  }}
                >
                  {yr}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4" style={{ paddingBottom: 100 }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "#f3f4f6" }}>
                <ImageIcon size={18} style={{ color: "#d1d5db" }} />
              </div>
              <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center" }}>
                No completed projects{search ? ` matching "${search}"` : ""}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 380, damping: 32 }}
                >
                  <ArchiveTile project={p} onSelect={() => setSelected(p)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Full project page — slides in from right ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="absolute inset-0 bg-white"
          >
            <CompletedProjectPage
              project={selected}
              onBack={() => setSelected(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}