import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, UserPlus, Plus,
  ChevronRight, Sparkles, X,
  FileText, ArrowLeftRight, Send, Zap, Image, Bell,
  MoreHorizontal, Camera, CheckCircle2,
} from "lucide-react";
import { StatusBar } from "./StatusBar";
import { NewProjectSheet, NewProjectData } from "./NewProjectSheet";
import { HomeInviteSheet } from "./HomeInviteSheet";
import { InviteTeamSheet, InviteProject } from "./InviteTeamSheet";
import { ArchiveScreen } from "./ArchiveScreen";
import { LiveProjectScreen } from "./LiveProjectScreen";
import { DailyReportSheet, BeforeAfterSheet, ClientUpdateSheet, AutomationSheet } from "./QuickActionsSheet";
import { WrapUpSheet } from "./WrapUpSheet";

/* ─── Types ─────────────────────────────────────────────────── */

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  status: "live" | "archive";
  lastActivity: string;
  lastActivityDays: number;  // 0 = today → green, 2+ → amber
  thumbnail: string;
  progress: number;
  memberCount: number;
  photoCount: number;
  recentPhotos?: string[];   // up to 3 recent captures
  completedDate?: string;    // e.g. "Nov 2024" — archive only
}

/* ─── Photo URLs ─────────────────────────────────────────── */

const PX = {
  a: "https://images.unsplash.com/photo-1707725669477-18feaba381f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
  b: "https://images.unsplash.com/photo-1726589004565-bedfba94d3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
  c: "https://images.unsplash.com/photo-1646865006914-8d10d8e70f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
  d: "https://images.unsplash.com/photo-1679430786992-8bb54d023e2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
  e: "https://images.unsplash.com/photo-1770625296800-a2a911c7b763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
  f: "https://images.unsplash.com/photo-1652676306512-3ae85dfb9344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
};

/* ─── Initial data ───────────────────────────────────────────── */

const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Kings Cross Quarter",
    client: "Barratt Homes",
    location: "London, N1C",
    status: "live",
    lastActivity: "2m ago",
    lastActivityDays: 0,
    thumbnail: "https://images.unsplash.com/photo-1585118213816-1c57f4b0b1dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    progress: 65,
    memberCount: 8,
    photoCount: 47,
    recentPhotos: [PX.a, PX.b, PX.c],
  },
  {
    id: "2",
    name: "Phase 2 – Piccadilly",
    client: "Taylor Wimpey",
    location: "Manchester, M1",
    status: "live",
    lastActivity: "15m ago",
    lastActivityDays: 0,
    thumbnail: "https://images.unsplash.com/photo-1748956628042-b73331e0b479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    progress: 40,
    memberCount: 5,
    photoCount: 23,
    recentPhotos: [PX.d, PX.e, PX.b],
  },
  {
    id: "3",
    name: "Riverside Quarter",
    client: "Berkeley Group",
    location: "London, SE1",
    status: "live",
    lastActivity: "3 days ago",
    lastActivityDays: 3,
    thumbnail: "https://images.unsplash.com/photo-1766791783611-b1c6a7ad86bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    progress: 78,
    memberCount: 11,
    photoCount: 91,
    recentPhotos: [PX.c, PX.f, PX.a],
  },
  {
    id: "4",
    name: "Heritage Park",
    client: "Persimmon Homes",
    location: "Leeds, LS1",
    status: "archive",
    lastActivity: "Complete",
    lastActivityDays: 90,
    thumbnail: "https://images.unsplash.com/photo-1755265141513-ebd3af526cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    progress: 100,
    memberCount: 6,
    photoCount: 183,
    completedDate: "Nov 2024",
    recentPhotos: [PX.d, PX.e, PX.f],
  },
  {
    id: "5",
    name: "Plot 47 – North Block",
    client: "Redrow",
    location: "Bristol, BS1",
    status: "archive",
    lastActivity: "Complete",
    lastActivityDays: 120,
    thumbnail: "https://images.unsplash.com/photo-1762643119387-211dd1ed73da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    progress: 100,
    memberCount: 3,
    photoCount: 64,
    completedDate: "Aug 2024",
    recentPhotos: [PX.a, PX.c, PX.e],
  },
  {
    id: "6",
    name: "Salford Quays Block C",
    client: "Redrow Homes",
    location: "Manchester, M50",
    status: "archive",
    lastActivity: "Complete",
    lastActivityDays: 180,
    thumbnail: "https://images.unsplash.com/photo-1659427921734-d4590f1e099f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    progress: 100,
    memberCount: 4,
    photoCount: 219,
    completedDate: "Jun 2024",
    recentPhotos: [PX.b, PX.f, PX.d],
  },
  {
    id: "7",
    name: "Victoria Gate Phase 3",
    client: "Crest Nicholson",
    location: "Leeds, LS2",
    status: "archive",
    lastActivity: "Complete",
    lastActivityDays: 240,
    thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    progress: 100,
    memberCount: 7,
    photoCount: 312,
    completedDate: "Mar 2024",
    recentPhotos: [PX.e, PX.c, PX.b],
  },
];

const CREATE_ACTIONS = [
  { id: "report",   label: "Daily Report",   icon: FileText,       iconBg: "#EEF3FF", iconFg: "#3478F6" },
  { id: "before",   label: "Before / After", icon: ArrowLeftRight, iconBg: "#F0FDFA", iconFg: "#0D9488" },
  { id: "client",   label: "Client Update",  icon: Send,           iconBg: "#FFFBEB", iconFg: "#D97706" },
  { id: "automate", label: "Automation",     icon: Zap,            iconBg: "#F5E8FC", iconFg: "#9B35CC" },
] as const;

/* ─── Gallery card (2×2 grid, matches archive style) ─────────── */

function GalleryCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const isActive   = project.lastActivityDays === 0;
  const dotColor   = isActive ? "#22C55E" : "#F59E0B";
  const activityText = isActive ? "Active today" : `${project.lastActivityDays}d ago`;

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      className="bg-white cursor-pointer flex flex-col overflow-hidden"
      style={{ borderRadius: 16, border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
    >
      {/* Thumbnail with name overlay */}
      <div className="relative" style={{ aspectRatio: "4/3" }}>
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: "#0E1F40" }} />
        )}
        {/* Gradient */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 52%)" }} />

        {/* Project name */}
        <p className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5 truncate"
          style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>
          {project.name}
        </p>
      </div>

      {/* Meta */}
      <div className="px-2.5 pt-2 pb-2.5">
        <p style={{ fontSize: 12, color: "#374151" }}>{project.client}</p>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1">
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#6B7280" }}>{activityText}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280" }}>{project.photoCount} photos</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Live project card — gallery style matching archive ──────── */

function LiveCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const isActive = project.lastActivityDays === 0;
  const dotColor = isActive ? "#22C55E" : "#F59E0B";
  const activityText = isActive ? "Today" : `${project.lastActivityDays}d ago`;

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      className="bg-white cursor-pointer flex flex-col overflow-hidden"
      style={{ borderRadius: 16, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
    >
      {/* Photo — fixed px height, no aspectRatio */}
      <div className="relative flex-shrink-0" style={{ height: 130 }}>
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: "#0E1F40" }} />
        )}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0) 55%)" }} />

        {/* Name — 2-line clamp pinned to bottom of photo */}
        <p className="absolute bottom-0 left-0 right-0 px-2.5 pb-2"
          style={{
            fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.3,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
          {project.name}
        </p>
      </div>

      {/* Meta — fixed height, always identical across both cols */}
      <div className="flex flex-col justify-between px-2.5 pt-2 pb-2.5" style={{ height: 52 }}>
        <p className="truncate" style={{ fontSize: 12, color: "#374151" }}>{project.client}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#6B7280" }}>{activityText}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280" }}>{project.photoCount} photos</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Screen ─────────────────────────────────────────────────── */

interface ProjectsScreenProps {
  onOpenCamera?: () => void;
  onOpenNotifications?: () => void;
  onSheetChange?: (open: boolean) => void;
}

export function ProjectsScreen({ onOpenCamera, onOpenNotifications, onSheetChange }: ProjectsScreenProps) {
  const [projects, setProjects]     = useState<Project[]>(INITIAL_PROJECTS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch]         = useState("");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [liveInviteOpen, setLiveInviteOpen] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState<"report" | "before" | "client" | "automate" | null>(null);
  const [wrapUpOpen, setWrapUpOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const matchesSearch = (p: Project) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  };

  const liveProjects    = projects.filter(p => p.status === "live" && matchesSearch(p));
  const archiveProjects = projects.filter(p => p.status === "archive");

  const openSearch = () => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 80); };
  const closeSearch = () => { setSearchOpen(false); setSearch(""); };

  const handleCreateProject = (data: NewProjectData) => {
    setProjects(prev => [{
      id:              String(Date.now()),
      name:            data.name,
      client:          data.client,
      location:        data.location,
      status:          "live",
      lastActivity:    "Just now",
      lastActivityDays: 0,
      thumbnail:       "",
      progress:        0,
      memberCount:     1 + (data.memberIds?.length ?? 0),
      photoCount:      0,
    }, ...prev]);
  };

  const mosaicProjects  = archiveProjects.slice(0, 3);
  const mosaicRemainder = Math.max(0, archiveProjects.length - 3);

  const inviteProjects: InviteProject[] = projects
    .filter(p => p.status === "live")
    .map(p => ({ id: p.id, name: p.name, client: p.client, location: p.location, thumbnail: p.thumbnail }));

  const openProject = (id: string) => setOpenProjectId(id);
  const closeProject = () => setOpenProjectId(null);
  const openedProject = projects.find(p => p.id === openProjectId) ?? null;

  const handleComplete = (id: string) => {
    setProjects(prev => prev.map(p =>
      p.id === id
        ? { ...p, status: "archive" as const, lastActivity: "Complete", completedDate: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }) }
        : p
    ));
    setOpenProjectId(null);
  };

  const liveInviteProject: InviteProject[] = openedProject
    ? [{ id: openedProject.id, name: openedProject.name, client: openedProject.client, location: openedProject.location, thumbnail: openedProject.thumbnail }]
    : [];

  return (
    <div className="relative flex flex-col h-full select-none overflow-hidden" style={{ background: "#F0F5FA" }}>

      {/* ── Main home view ── */}
      <div className="flex flex-col h-full">

        {/* White header zone: StatusBar + title row share same bg */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
          <StatusBar theme="light" />

          {/* Header row — relative so title can be truly centred */}
          <div className="relative flex items-center px-5 pb-3">
            <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{ background: "#0E1F40" }}>
              <span className="text-white text-xs font-bold">JD</span>
            </button>
            {/* Absolutely centred title ignores sibling widths */}
            <span className="absolute inset-x-0 text-center pointer-events-none" style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Home</span>
            <div className="flex items-center gap-2 ml-auto z-10">
              <div className="relative">
                <button
                  onClick={onOpenNotifications}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 active:opacity-70 transition-opacity"
                  style={{ background: "#F3F4F6" }}
                >
                  <Bell size={15} strokeWidth={2} style={{ color: "#374151" }} />
                </button>
                <div className="absolute flex items-center justify-center rounded-full pointer-events-none" style={{ top: -2, right: -2, width: 15, height: 15, background: "#FA3E3E" }}>
                  <span className="text-white font-bold" style={{ fontSize: 7 }}>3</span>
                </div>
              </div>
              <button
                onClick={openSearch}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 active:opacity-70 transition-opacity"
                style={{ background: "#F3F4F6" }}
              >
                <Search size={15} strokeWidth={2} style={{ color: "#374151" }} />
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="overflow-hidden px-4"
              style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}
            >
              <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 mb-3 mt-3" style={{ background: "#F3F4F6" }}>
                <Search size={14} strokeWidth={2} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                <input
                  ref={searchRef} type="text"
                  placeholder="Search projects, clients, locations…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: 14, color: "#111827" }}
                />
                <button onClick={closeSearch}>
                  <X size={15} strokeWidth={2} style={{ color: "#9CA3AF" }} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar" style={{ paddingBottom: 100 }}>

          {/* Split pill: New project | Invite — sticky float with gradient fade */}
          <div className="sticky top-0 z-10 px-4 pt-3 pb-6" style={{
            background: "linear-gradient(to bottom, #F0F5FA 0%, #F0F5FA 65%, rgba(240,245,250,0) 100%)",
            pointerEvents: "none",
          }}>
            <div className="flex rounded-full overflow-hidden bg-white" style={{ height: 50, border: "1px solid #E5E7EB", boxShadow: "0 2px 10px rgba(14,31,64,0.07)", pointerEvents: "auto" }}>
              <motion.button
                whileTap={{ scale: 0.97 }} onClick={() => { setNewProjectOpen(true); onSheetChange?.(true); }}
                className="flex-1 flex items-center justify-center gap-2 active:opacity-70 transition-opacity"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#EEF3FF" }}>
                  <Plus size={12} strokeWidth={2.5} style={{ color: "#3478F6" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#3478F6" }}>New project</span>
              </motion.button>
              <div style={{ width: 1, background: "#E5E7EB", margin: "10px 0" }} />
              <motion.button
                whileTap={{ scale: 0.97 }} onClick={() => { setInviteOpen(true); onSheetChange?.(true); }}
                className="flex-1 flex items-center gap-2 active:opacity-70 transition-opacity"
                style={{ paddingLeft: 28 }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#EEF3FF" }}>
                  <UserPlus size={12} strokeWidth={2.5} style={{ color: "#3478F6" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#3478F6" }}>Invite team</span>
              </motion.button>
            </div>
          </div>

          {/* ── CREATE ── */}
          <div className="px-4 mb-1">
            <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Quick actions</p>
            <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #E5E7EB" }}>
              {[0, 1].map(row => (
                <div key={row}>
                  {row === 1 && <div style={{ height: 1, background: "#E5E7EB" }} />}
                  <div className="flex">
                    {CREATE_ACTIONS.slice(row * 2, row * 2 + 2).map((action, col) => {
                      const Icon = action.icon;
                      const actionKey = action.id as "report" | "before" | "client" | "automate";
                      return (
                        <div key={action.id} className="flex-1 flex">
                          {col === 1 && <div style={{ width: 1, background: "#E5E7EB", margin: "10px 0" }} />}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setActiveQuickAction(actionKey); onSheetChange?.(true); }}
                            className="flex-1 flex items-center gap-2.5 px-3.5 py-3 active:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                              style={{ width: 28, height: 28, background: action.iconBg }}>
                              <Icon size={13} strokeWidth={2} style={{ color: action.iconFg }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#0E1F40" }}>{action.label}</span>
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── LIVE ── */}
          {liveProjects.length > 0 && (
            <div className="px-4 mt-5">
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  Live projects <span style={{ color: "#9CA3AF", fontWeight: 500 }}>({liveProjects.length})</span>
                </p>
              </div>

              {/* Mark as Complete banner */}
              <motion.button
                whileTap={{ scale: 0.985 }}
                onClick={() => { setWrapUpOpen(true); onSheetChange?.(true); }}
                className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-3 mb-3 active:opacity-80"
                style={{ background: "#EEF3FF", border: "1px solid #C7D7FD" }}>
                <CheckCircle2 size={22} strokeWidth={2} style={{ color: "#0D9488", flexShrink: 0 }} />
                <p className="flex-1 text-left" style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>
                  Ready to sign off? Mark{" "}
                  <span style={{ fontWeight: 700, color: "#0E1F40" }}>
                    {liveProjects.length} live {liveProjects.length === 1 ? "project" : "projects"}
                  </span>{" "}
                  as complete.
                </p>
                <ChevronRight size={14} strokeWidth={2.5} style={{ color: "#9CA3AF", flexShrink: 0 }} />
              </motion.button>

              <div className="grid grid-cols-2 gap-2.5">
                <AnimatePresence>
                  {liveProjects.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28, delay: i * 0.04 }}
                    >
                      <LiveCard project={p} onOpen={() => openProject(p.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {liveProjects.length === 0 && !search && (
            <div className="flex flex-col items-center justify-center py-10 px-8">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <Camera size={20} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-400 text-center">No live projects — tap "New project" to start</p>
            </div>
          )}

          {/* ── TRACK RECORD ── */}
          <div className="px-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <p style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Track record</p>
              <button className="text-xs font-semibold active:opacity-60" style={{ color: "#3478F6" }}>Create first →</button>
            </div>
            <button
              className="w-full bg-white rounded-xl border flex items-center gap-2.5 px-3 py-3 active:bg-gray-50 transition-colors text-left"
              style={{ border: "1px solid #E5E7EB" }}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Share your track record</p>
                <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1, lineHeight: 1.4 }}>Use your jobs to win more work — share with clients, your website, or LinkedIn</p>
              </div>
              <ChevronRight size={15} style={{ color: "#D1D5DB" }} className="flex-shrink-0" />
            </button>
          </div>

          {/* ── COMPLETED & ARCHIVED ── */}
          {archiveProjects.length > 0 && (
            <div className="px-4 mt-5">
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  Complete <span style={{ color: "#9CA3AF", fontWeight: 500 }}>({archiveProjects.length})</span>
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.985 }}
                onClick={() => setArchiveOpen(true)}
                className="w-full bg-white rounded-xl overflow-hidden text-left"
                style={{ border: "1px solid #E5E7EB" }}
              >
                {/* Mosaic thumbnails */}
                <div className="flex gap-0.5 p-2.5 pb-2">
                  <div className="flex-1 rounded-xl overflow-hidden" style={{ height: 116 }}>
                    <img src={mosaicProjects[0]?.thumbnail} alt="" className="w-full h-full object-cover"
                      style={{ filter: "grayscale(40%)" }} />
                  </div>
                  {mosaicProjects.length > 1 && (
                    <div className="flex flex-col gap-0.5" style={{ width: "38%" }}>
                      <div className="rounded-xl overflow-hidden flex-1">
                        <img src={mosaicProjects[1]?.thumbnail} alt="" className="w-full h-full object-cover"
                          style={{ filter: "grayscale(40%)" }} />
                      </div>
                      <div className="rounded-xl overflow-hidden flex-1 relative">
                        <img
                          src={mosaicProjects[2]?.thumbnail ?? mosaicProjects[1]?.thumbnail}
                          alt="" className="w-full h-full object-cover"
                          style={{ filter: "grayscale(40%)" }}
                        />
                        {mosaicRemainder > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-xl"
                            style={{ background: "rgba(0,0,0,0.50)" }}>
                            <span className="text-white font-bold" style={{ fontSize: 15 }}>+{mosaicRemainder}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between px-3.5 py-3"
                  style={{ borderTop: "1px solid #F3F4F6" }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>View all complete projects</span>
                    <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                      {archiveProjects.length} projects · {archiveProjects.reduce((s, p) => s + p.photoCount, 0)} photos archived
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: "#D1D5DB" }} strokeWidth={2} />
                </div>
              </motion.button>
            </div>
          )}

          {/* No results */}
          {search && liveProjects.length === 0 && (
            <div className="py-12 px-8">
              <p className="text-sm text-gray-400 text-center">No results for "{search}"</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Live Project detail screen ── */}
      <AnimatePresence>
        {openedProject && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="absolute inset-0 z-10"
          >
            <LiveProjectScreen
              project={openedProject}
              onBack={closeProject}
              onOpenCamera={onOpenCamera}
              onInvite={() => { setLiveInviteOpen(true); onSheetChange?.(true); }}
              onSheetChange={onSheetChange}
              onComplete={() => handleComplete(openedProject.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Archive screen (slides in from right) ── */}
      <AnimatePresence>
        {archiveOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="absolute inset-0 z-10"
          >
            <ArchiveScreen
              projects={archiveProjects}
              onBack={() => setArchiveOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── New Project sheet ── */}
      <AnimatePresence>
        {newProjectOpen && (
          <NewProjectSheet
            onClose={() => { setNewProjectOpen(false); onSheetChange?.(false); }}
            onCreate={handleCreateProject}
          />
        )}
      </AnimatePresence>

      {/* ── Quick Action sheets ── */}
      <AnimatePresence>
        {activeQuickAction === "report" && (
          <DailyReportSheet
            projects={projects}
            onClose={() => { setActiveQuickAction(null); onSheetChange?.(false); }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeQuickAction === "before" && (
          <BeforeAfterSheet
            projects={projects}
            onClose={() => { setActiveQuickAction(null); onSheetChange?.(false); }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeQuickAction === "client" && (
          <ClientUpdateSheet
            projects={projects}
            onClose={() => { setActiveQuickAction(null); onSheetChange?.(false); }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeQuickAction === "automate" && (
          <AutomationSheet
            projects={projects}
            onClose={() => { setActiveQuickAction(null); onSheetChange?.(false); }}
          />
        )}
      </AnimatePresence>

      {/* ── Invite Team sheet (home — QR / share links) ── */}
      <AnimatePresence>
        {inviteOpen && (
          <HomeInviteSheet onClose={() => { setInviteOpen(false); onSheetChange?.(false); }} />
        )}
      </AnimatePresence>

      {/* ── Invite Team sheet — rendered here (outside z-10 context) so it sits above tab bar ── */}
      <AnimatePresence>
        {liveInviteOpen && (
          <InviteTeamSheet
            projects={liveInviteProject}
            onClose={() => { setLiveInviteOpen(false); onSheetChange?.(false); }}
          />
        )}
      </AnimatePresence>

      {/* ── Wrap Up sheet ── */}
      <AnimatePresence>
        {wrapUpOpen && (
          <WrapUpSheet
            projects={projects.filter(p => p.status === "live")}
            onClose={() => { setWrapUpOpen(false); onSheetChange?.(false); }}
            onComplete={(ids) => {
              ids.forEach(id => handleComplete(id));
              setWrapUpOpen(false);
              onSheetChange?.(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}