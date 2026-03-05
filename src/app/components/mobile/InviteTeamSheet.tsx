import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, Check, UserPlus, Copy, ChevronRight, MessageSquare } from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────── */

interface Props {
  projectName?: string;
  onClose: () => void;
}

/* ─── Helpers ─────────────────────────────────────────────────── */

function genBatchCode() {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
        fill="#16a34a"
      />
      <path
        d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.524 5.855L.057 23.882l6.196-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.032-1.384l-.361-.215-3.735.87.936-3.618-.235-.372A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"
        fill="#16a34a"
      />
    </svg>
  );
}

/* ─── Mock platform users ─────────────────────────────────────── */

const PLATFORM_USERS = [
  { id: "u1", name: "Jamie Kearney",  role: "Site Manager",      color: "#3B82F6", initials: "JK" },
  { id: "u2", name: "Sarah Wilson",   role: "Project Lead",      color: "#10B981", initials: "SW" },
  { id: "u3", name: "Mark Thompson",  role: "Foreman",           color: "#EF4444", initials: "MT" },
  { id: "u4", name: "Tom Bradley",    role: "Sub-contractor",    color: "#8B5CF6", initials: "TB" },
  { id: "u5", name: "Rob Hughes",     role: "Site Engineer",     color: "#F59E0B", initials: "RH" },
  { id: "u6", name: "Laura Chen",     role: "Project Manager",   color: "#6366F1", initials: "LC" },
  { id: "u7", name: "Phil Davies",    role: "Quantity Surveyor", color: "#06B6D4", initials: "PD" },
  { id: "u8", name: "Kate Summers",   role: "Architect",         color: "#EC4899", initials: "KS" },
];

/* ─── Main ────────────────────────────────────────────────────── */

export function InviteTeamSheet({ projectName, onClose }: Props) {
  const batchCode = useMemo(() => genBatchCode(), []);
  const shareUrl  = `jobpics.uk/share/batch-${batchCode}`;
  const fullUrl   = `https://${shareUrl}`;

  const [query,  setQuery]  = useState("");
  const [added,  setAdded]  = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const filtered = PLATFORM_USERS.filter(u =>
    !query.trim() ||
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.role.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (id: string) =>
    setAdded(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const copyLink = async () => {
    await navigator.clipboard.writeText(fullUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const shareWhatsApp = () => {
    const name = projectName ?? "this project";
    const text = encodeURIComponent(
      `You've been invited to join "${name}" on JobPics 📸\n\nView & upload photos here: ${fullUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareSMS = () => {
    const name = projectName ?? "this project";
    const text = encodeURIComponent(
      `You've been invited to join "${name}" on JobPics. View & upload photos: ${fullUrl}`
    );
    window.open(`sms:?body=${text}`, "_blank");
  };

  const addedCount = added.size;

  const shareRows = [
    {
      id: "wa",
      label: "Share on WhatsApp",
      desc: "Send photos & link to your team",
      iconBg: "#DCFCE7",
      icon: <WaIcon />,
      chevronColor: "#86EFAC",
      onClick: shareWhatsApp,
    },
    {
      id: "sms",
      label: "Text message",
      desc: "Send invite via SMS",
      iconBg: "#DBEAFE",
      icon: <MessageSquare size={18} strokeWidth={2} style={{ color: "#2563EB" }} />,
      chevronColor: "#93C5FD",
      onClick: shareSMS,
    },
    {
      id: "copy",
      label: copied ? "Copied!" : "Copy share link",
      desc: shareUrl,
      iconBg: "#EDE9FE",
      icon: (
        <AnimatePresence mode="wait">
          {copied
            ? <motion.div key="chk" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check size={18} strokeWidth={2.5} style={{ color: "#7C3AED" }} />
              </motion.div>
            : <motion.div key="cp" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Copy size={17} strokeWidth={2} style={{ color: "#7C3AED" }} />
              </motion.div>
          }
        </AnimatePresence>
      ),
      chevronColor: "#C4B5FD",
      onClick: copyLink,
    },
  ] as const;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.28)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="absolute left-0 right-0 bottom-0 z-50 bg-white flex flex-col"
        style={{ borderRadius: "28px 28px 0 0", maxHeight: "92%" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "#E5E7EB" }} />
        </div>

        {/* Nav row — X left, Done pill right */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <motion.button
            onClick={onClose} whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#F3F4F6" }}
          >
            <X size={14} strokeWidth={2.2} style={{ color: "#6B7280" }} />
          </motion.button>

          {/* Done pill — top RHS */}
          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.93 }}
            animate={{ backgroundColor: addedCount > 0 ? "#3478F6" : "#3478F6" }}
            className="flex items-center gap-1.5 rounded-full px-3.5"
            style={{ height: 34, background: "#3478F6" }}
          >
            <Check size={13} strokeWidth={2.8} color="#fff" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
              {addedCount > 0 ? `Done · ${addedCount}` : "Done"}
            </span>
          </motion.button>
        </div>

        {/* Title */}
        <div className="px-6 pb-5 flex-shrink-0">
          <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
            Invite to project
          </p>
          {projectName && (
            <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>{projectName}</p>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-5 pb-8" style={{ scrollbarWidth: "none" }}>

          {/* ── Share with your team ── */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 10 }}>
              Share with your team
            </p>
            <div className="flex flex-col gap-2.5">
              {shareRows.map(row => (
                <motion.button
                  key={row.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={row.onClick}
                  className="flex items-center gap-3.5 w-full rounded-2xl px-4 text-left"
                  style={{ height: 64, background: "#FAFAFA", border: "1px solid #F3F4F6" }}
                >
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ width: 40, height: 40, background: row.iconBg }}>
                    {row.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
                      {row.label}
                    </p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {row.desc}
                    </p>
                  </div>
                  <ChevronRight size={15} strokeWidth={2} style={{ color: row.chevronColor, flexShrink: 0 }} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── Add team members ── */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 10 }}>
              Add team members
            </p>

            {/* Search */}
            <div className="flex items-center gap-2.5 rounded-2xl px-3.5 mb-2"
              style={{ background: "#F9FAFB", border: "1.5px solid #F3F4F6", height: 44 }}>
              <Search size={15} strokeWidth={2} style={{ color: "#9CA3AF", flexShrink: 0 }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or role..."
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: 14, color: "#111827" }}
              />
              {query.length > 0 && (
                <button onClick={() => setQuery("")}>
                  <X size={13} strokeWidth={2} style={{ color: "#9CA3AF" }} />
                </button>
              )}
            </div>

            {/* People list */}
            <div className="flex flex-col gap-1">
              {filtered.map(user => {
                const isAdded = added.has(user.id);
                return (
                  <motion.button
                    key={user.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggle(user.id)}
                    className="flex items-center gap-3 rounded-2xl px-3.5 text-left w-full"
                    style={{
                      height: 62,
                      background: isAdded ? `${user.color}0d` : "transparent",
                      transition: "background 0.18s",
                    }}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${user.color}18`, border: `1.5px solid ${user.color}30` }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: user.color }}>{user.initials}</span>
                    </div>

                    {/* Name + role */}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.2 }}>{user.name}</p>
                      <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{user.role}</p>
                    </div>

                    {/* Add / Added toggle */}
                    <AnimatePresence mode="wait">
                      {isAdded ? (
                        <motion.div
                          key="added"
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 flex-shrink-0"
                          style={{ background: user.color }}
                        >
                          <Check size={11} strokeWidth={3} color="#fff" />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Added</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="add"
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "#F3F4F6" }}
                        >
                          <UserPlus size={14} strokeWidth={2} style={{ color: "#6B7280" }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
