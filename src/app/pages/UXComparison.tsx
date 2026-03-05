import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, Camera, Bell, X, ArrowLeft, ChevronDown,
  MapPin, Users, Image, AlertTriangle, Plus, Check, Zap
} from "lucide-react";

const SITE_IMG_1 = "https://images.unsplash.com/photo-1615469309529-733e81176c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const SITE_IMG_2 = "https://images.unsplash.com/photo-1770625296856-cb865be093da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const SITE_IMG_3 = "https://images.unsplash.com/photo-1704920110270-5c107519cdc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";

const PROJECTS = [
  { id: 1, name: "Kings Cross Phase 2", client: "Barratt Homes", photos: 47, team: 4, issues: 2, img: SITE_IMG_1 },
  { id: 2, name: "Canary Wharf Tower B", client: "Berkeley Group", photos: 23, team: 2, issues: 0, img: SITE_IMG_2 },
  { id: 3, name: "Manchester Piccadilly", client: "Taylor Wimpey", photos: 11, team: 3, issues: 1, img: SITE_IMG_3 },
];

const NOTIFICATIONS = [
  { id: 1, text: "Dave added 3 photos to Kings Cross", time: "2m ago", dot: "#22c55e" },
  { id: 2, text: "New issue flagged: Canary Wharf B", time: "14m ago", dot: "#f97316" },
  { id: 3, text: "Client viewed your report", time: "1h ago", dot: "#6366f1" },
];

/* ─── Approach A ─── */
function ApproachA() {
  const [state, setState] = useState<"home" | "camera">("home");
  const [justShot, setJustShot] = useState(false);
  const [shotCount, setShotCount] = useState(0);

  function shoot() {
    setJustShot(true);
    setShotCount((n) => n + 1);
    setTimeout(() => setJustShot(false), 800);
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-white select-none">
      <AnimatePresence mode="wait">
        {state === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex flex-col"
            style={{ background: "#f5f5f7" }}
          >
            {/* Status bar */}
            <div className="flex-shrink-0" style={{ height: 44 }} />

            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 pb-3">
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>JobPics</div>
                <div style={{ fontSize: 12, color: "#888" }}>Thursday, 26 Feb</div>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: "#fff", border: "1px solid #e5e5e5" }}>
                  <Bell size={16} color="#444" />
                </div>
                <div className="absolute flex items-center justify-center rounded-full bg-red-500" style={{ top: -2, right: -2, width: 16, height: 16 }}>
                  <span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>3</span>
                </div>
              </div>
            </div>

            {/* Notifications strip */}
            <div className="flex-shrink-0 mx-4 mb-3 rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #f0f0f0" }}>
              {NOTIFICATIONS.map((n, i) => (
                <div key={n.id} className="flex items-center gap-2.5 px-3 py-2" style={{ borderTop: i > 0 ? "1px solid #f5f5f5" : "none" }}>
                  <div className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, background: n.dot }} />
                  <span style={{ fontSize: 10.5, color: "#444", flex: 1, lineHeight: 1.3 }}>{n.text}</span>
                  <span style={{ fontSize: 9, color: "#bbb" }}>{n.time}</span>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="flex-shrink-0 px-4 mb-2">
              <div style={{ fontSize: 13, fontWeight: 600, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Active Projects</div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-28" style={{ gap: 10, display: "flex", flexDirection: "column" }}>
              {PROJECTS.map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
                  <div className="relative" style={{ height: 80 }}>
                    <img src={p.img} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 100%)" }} />
                    <div className="absolute inset-0 flex flex-col justify-end p-3">
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{p.client}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <Image size={11} color="#6366f1" />
                      <span style={{ fontSize: 11, color: "#444" }}>{p.photos}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={11} color="#6366f1" />
                      <span style={{ fontSize: 11, color: "#444" }}>{p.team}</span>
                    </div>
                    {p.issues > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle size={11} color="#f97316" />
                        <span style={{ fontSize: 11, color: "#f97316" }}>{p.issues}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Camera FAB */}
            <div className="absolute" style={{ bottom: 30, left: "50%", transform: "translateX(-50%)" }}>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setState("camera")}
                className="flex items-center gap-2.5 rounded-full shadow-lg"
                style={{
                  background: "#111",
                  color: "#fff",
                  padding: "14px 28px",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: -0.2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)"
                }}
              >
                <Camera size={18} color="#fff" />
                Take photo
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex flex-col"
            style={{ background: "#000" }}
          >
            {/* Viewfinder */}
            <div className="absolute inset-0">
              <img src={SITE_IMG_1} className="w-full h-full object-cover" alt="" style={{ opacity: 0.85 }} />
              <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.18)" }} />
              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.25 }}>
                <div className="absolute" style={{ left: "33%", top: 0, bottom: 0, width: 1, background: "#fff" }} />
                <div className="absolute" style={{ left: "66%", top: 0, bottom: 0, width: 1, background: "#fff" }} />
                <div className="absolute" style={{ top: "33%", left: 0, right: 0, height: 1, background: "#fff" }} />
                <div className="absolute" style={{ top: "66%", left: 0, right: 0, height: 1, background: "#fff" }} />
              </div>
            </div>

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-4" style={{ paddingTop: 52 }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setState("home")}
                className="flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)" }}
              >
                <X size={18} color="#fff" />
              </motion.button>

              {/* Project indicator — no context lock */}
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}>
                <MapPin size={11} color="rgba(255,255,255,0.7)" />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>Kings Cross Phase 2</span>
                <ChevronDown size={12} color="rgba(255,255,255,0.6)" />
              </div>

              <div style={{ width: 36 }} />
            </div>

            {/* Shot count */}
            {shotCount > 0 && (
              <div className="relative z-10 flex justify-center mt-3">
                <div className="rounded-full px-3 py-1" style={{ background: "rgba(99,102,241,0.75)", backdropFilter: "blur(10px)" }}>
                  <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{shotCount} shot{shotCount > 1 ? "s" : ""} taken</span>
                </div>
              </div>
            )}

            {/* Flash feedback */}
            <AnimatePresence>
              {justShot && (
                <motion.div
                  key="flash"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-20 bg-white pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Shutter */}
            <div className="absolute z-10 flex flex-col items-center gap-3" style={{ bottom: 50, left: "50%", transform: "translateX(-50%)" }}>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={shoot}
                className="rounded-full"
                style={{
                  width: 72, height: 72,
                  background: "rgba(255,255,255,0.15)",
                  border: "3px solid rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <div className="rounded-full" style={{ width: 56, height: 56, background: "#fff" }} />
                </div>
              </motion.button>
            </div>

            {/* Bottom hint */}
            <div className="absolute z-10 flex justify-center" style={{ bottom: 20, left: 0, right: 0 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Tap X to return home</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Approach H ─── */
function ApproachH() {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [justShot, setJustShot] = useState(false);
  const [shotCounts, setShotCounts] = useState<Record<number, number>>({});

  const project = PROJECTS.find((p) => p.id === activeProject);

  function shoot() {
    if (!activeProject) return;
    setJustShot(true);
    setShotCounts((c) => ({ ...c, [activeProject]: (c[activeProject] || 0) + 1 }));
    setTimeout(() => setJustShot(false), 800);
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-white select-none">
      <AnimatePresence mode="wait">
        {activeProject === null ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex flex-col"
            style={{ background: "#f5f5f7" }}
          >
            {/* Status bar */}
            <div className="flex-shrink-0" style={{ height: 44 }} />

            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 pb-3">
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>JobPics</div>
                <div style={{ fontSize: 12, color: "#888" }}>Thursday, 26 Feb</div>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: "#fff", border: "1px solid #e5e5e5" }}>
                  <Bell size={16} color="#444" />
                </div>
                <div className="absolute flex items-center justify-center rounded-full bg-red-500" style={{ top: -2, right: -2, width: 16, height: 16 }}>
                  <span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>3</span>
                </div>
              </div>
            </div>

            {/* Notifications strip */}
            <div className="flex-shrink-0 mx-4 mb-3 rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #f0f0f0" }}>
              {NOTIFICATIONS.map((n, i) => (
                <div key={n.id} className="flex items-center gap-2.5 px-3 py-2" style={{ borderTop: i > 0 ? "1px solid #f5f5f5" : "none" }}>
                  <div className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, background: n.dot }} />
                  <span style={{ fontSize: 10.5, color: "#444", flex: 1, lineHeight: 1.3 }}>{n.text}</span>
                  <span style={{ fontSize: 9, color: "#bbb" }}>{n.time}</span>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="flex-shrink-0 px-4 mb-2">
              <div style={{ fontSize: 13, fontWeight: 600, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Tap a project to shoot</div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8" style={{ gap: 10, display: "flex", flexDirection: "column" }}>
              {PROJECTS.map((p) => (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveProject(p.id)}
                  className="rounded-2xl overflow-hidden text-left"
                  style={{ background: "#fff", border: "1px solid #ebebeb", display: "block", width: "100%" }}
                >
                  {/* Hero with camera tap affordance */}
                  <div className="relative" style={{ height: 100 }}>
                    <img src={p.img} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 100%)" }} />

                    {/* Left: project info */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3">
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{p.client}</div>
                    </div>

                    {/* Right: camera tap zone */}
                    <div
                      className="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center gap-1"
                      style={{ width: 72, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", borderLeft: "1px solid rgba(255,255,255,0.12)" }}
                    >
                      <Camera size={20} color="#fff" />
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Shoot</span>
                      {(shotCounts[p.id] || 0) > 0 && (
                        <div className="rounded-full px-1.5" style={{ background: "#6366f1", marginTop: 2 }}>
                          <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>+{shotCounts[p.id]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <Image size={11} color="#6366f1" />
                      <span style={{ fontSize: 11, color: "#444" }}>{p.photos + (shotCounts[p.id] || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={11} color="#6366f1" />
                      <span style={{ fontSize: 11, color: "#444" }}>{p.team}</span>
                    </div>
                    {p.issues > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle size={11} color="#f97316" />
                        <span style={{ fontSize: 11, color: "#f97316" }}>{p.issues}</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`camera-${activeProject}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex flex-col"
            style={{ background: "#000" }}
          >
            {/* Viewfinder */}
            <div className="absolute inset-0">
              <img src={project?.img} className="w-full h-full object-cover" alt="" style={{ opacity: 0.85 }} />
              <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.18)" }} />
              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.25 }}>
                <div className="absolute" style={{ left: "33%", top: 0, bottom: 0, width: 1, background: "#fff" }} />
                <div className="absolute" style={{ left: "66%", top: 0, bottom: 0, width: 1, background: "#fff" }} />
                <div className="absolute" style={{ top: "33%", left: 0, right: 0, height: 1, background: "#fff" }} />
                <div className="absolute" style={{ top: "66%", left: 0, right: 0, height: 1, background: "#fff" }} />
              </div>
            </div>

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-4" style={{ paddingTop: 52 }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveProject(null)}
                className="flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
              >
                <ArrowLeft size={14} color="#fff" />
                <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>Back</span>
              </motion.button>

              {/* Project LOCKED — no chevron */}
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "rgba(99,102,241,0.75)", backdropFilter: "blur(10px)" }}>
                <div className="rounded-full" style={{ width: 6, height: 6, background: "#a5f3fc" }} />
                <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{project?.name}</span>
              </div>

              <div style={{ width: 60 }} />
            </div>

            {/* Locked indicator */}
            <div className="relative z-10 flex justify-center mt-2">
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)" }}>
                <Check size={11} color="#4ade80" />
                <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.8)" }}>Saving to this project</span>
              </div>
            </div>

            {/* Shot count */}
            {(shotCounts[activeProject] || 0) > 0 && (
              <div className="relative z-10 flex justify-center mt-2">
                <div className="rounded-full px-3 py-1" style={{ background: "rgba(99,102,241,0.75)", backdropFilter: "blur(10px)" }}>
                  <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>
                    {shotCounts[activeProject]} shot{shotCounts[activeProject] > 1 ? "s" : ""} added
                  </span>
                </div>
              </div>
            )}

            {/* Flash feedback */}
            <AnimatePresence>
              {justShot && (
                <motion.div
                  key="flash"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-20 bg-white pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Shutter */}
            <div className="absolute z-10 flex flex-col items-center gap-3" style={{ bottom: 50, left: "50%", transform: "translateX(-50%)" }}>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={shoot}
                className="rounded-full"
                style={{
                  width: 72, height: 72,
                  background: "rgba(255,255,255,0.15)",
                  border: "3px solid rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <div className="rounded-full" style={{ width: 56, height: 56, background: "#fff" }} />
                </div>
              </motion.button>
            </div>

            {/* Bottom hint */}
            <div className="absolute z-10 flex justify-center" style={{ bottom: 20, left: 0, right: 0 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Tap Back to return to projects</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Phone Shell ─── */
function PhoneShell({ children, label, sublabel, accent }: {
  children: React.ReactNode;
  label: string;
  sublabel: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Label above */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-2" style={{ background: accent + "18", border: `1px solid ${accent}30` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>{label}</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", maxWidth: 220, lineHeight: 1.5 }}>{sublabel}</div>
      </div>

      {/* Phone */}
      <div className="relative" style={{ width: 260, height: 564 }}>
        {/* Frame */}
        <div
          className="absolute inset-0 rounded-[42px]"
          style={{
            background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 40%, #141416 100%)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />

        {/* Buttons */}
        <div className="absolute rounded-l-sm" style={{ left: -2, top: 84, width: 2, height: 20, background: "#2c2c30" }} />
        <div className="absolute rounded-l-sm" style={{ left: -2, top: 116, width: 2, height: 42, background: "#2c2c30" }} />
        <div className="absolute rounded-l-sm" style={{ left: -2, top: 168, width: 2, height: 42, background: "#2c2c30" }} />
        <div className="absolute rounded-r-sm" style={{ right: -2, top: 128, width: 2, height: 56, background: "#2c2c30" }} />

        {/* Screen */}
        <div className="absolute overflow-hidden rounded-[40px]" style={{ inset: 2, background: "#000" }}>
          {/* Dynamic island */}
          <div
            className="absolute rounded-full z-50 pointer-events-none"
            style={{ top: 7, left: "50%", transform: "translateX(-50%)", width: 84, height: 24, background: "#000" }}
          />
          {children}
          {/* Home indicator */}
          <div
            className="absolute pointer-events-none rounded-full z-50"
            style={{ bottom: 6, left: "50%", transform: "translateX(-50%)", width: 90, height: 4, background: "rgba(0,0,0,0.25)" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Trade-off row ─── */
function TradeoffRow({ label, a, h, winner }: { label: string; a: string; h: string; winner: "a" | "h" | "tie" }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 120px 1fr" }}>
      <div className="text-right">
        <div
          className="inline-block rounded-xl px-3 py-2 text-left"
          style={{
            fontSize: 11,
            lineHeight: 1.4,
            color: winner === "a" ? "#fff" : "rgba(255,255,255,0.55)",
            background: winner === "a" ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
            border: winner === "a" ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.07)",
            maxWidth: 200,
          }}
        >
          {a}
          {winner === "a" && <span className="ml-1">✓</span>}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.3 }}>{label}</span>
      </div>
      <div>
        <div
          className="inline-block rounded-xl px-3 py-2"
          style={{
            fontSize: 11,
            lineHeight: 1.4,
            color: winner === "h" ? "#fff" : "rgba(255,255,255,0.55)",
            background: winner === "h" ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
            border: winner === "h" ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.07)",
            maxWidth: 200,
          }}
        >
          {h}
          {winner === "h" && <span className="ml-1">✓</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export function UXComparison({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="min-h-screen w-full overflow-auto"
      style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, #141428 0%, #080810 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 rounded-full px-4 py-2 transition-opacity hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: 13 }}
        >
          <ArrowLeft size={14} />
          Back to app
        </button>

        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
            <Zap size={12} color="#818cf8" />
            <span style={{ fontSize: 12, color: "#818cf8", fontWeight: 600 }}>Interactive UX Comparison</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: -0.8, marginBottom: 8 }}>
            Two approaches, one decision
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            Both mockups are interactive — tap through each to feel the difference. Then compare the trade-offs below.
          </p>
        </div>

        {/* Phone comparison */}
        <div className="flex flex-col md:flex-row items-start justify-center gap-10 mb-14">
          <PhoneShell
            label="A — Camera button on home"
            sublabel="Home is primary. Camera opens over it. Tap the black button, then X to return."
            accent="#6366f1"
          >
            <ApproachA />
          </PhoneShell>

          <div className="hidden md:flex flex-col items-center justify-center self-center gap-3" style={{ paddingTop: 60 }}>
            <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>VS</span>
            <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
          </div>

          <PhoneShell
            label="H — Camera inside the project"
            sublabel="No separate camera destination. Tap the shoot zone on any project card to enter its camera."
            accent="#0ea5e9"
          >
            <ApproachH />
          </PhoneShell>
        </div>

        {/* Trade-off table */}
        <div className="mb-10">
          <h2 className="text-center mb-6" style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: -0.3 }}>
            Key trade-offs
          </h2>
          <div className="flex flex-col gap-3">
            {/* Headers */}
            <div className="grid gap-4 mb-1" style={{ gridTemplateColumns: "1fr 120px 1fr" }}>
              <div className="text-right">
                <span style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: 0.5 }}>Approach A</span>
              </div>
              <div />
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: 0.5 }}>Approach H</span>
              </div>
            </div>

            <TradeoffRow
              label="Speed to first photo"
              a="2 taps — home button, then shutter"
              h="1 tap — straight into project camera"
              winner="h"
            />
            <TradeoffRow
              label="Wrong project risk"
              a="Easy to shoot without checking project"
              h="Impossible — you choose project first"
              winner="h"
            />
            <TradeoffRow
              label="Simplicity of home screen"
              a="Clean list — camera is clearly separate"
              h="Cards have camera zones — slightly busier"
              winner="a"
            />
            <TradeoffRow
              label="Mental model"
              a="Familiar — camera is a mode you enter"
              h="New but logical — camera belongs to job"
              winner="tie"
            />
            <TradeoffRow
              label="Multi-project days"
              a="Must switch project manually in camera"
              h="Switch project by going back, tap new card"
              winner="h"
            />
            <TradeoffRow
              label="Learnability"
              a="Instantly obvious to anyone"
              h="Needs one discovery moment"
              winner="a"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full flex items-center justify-center" style={{ width: 32, height: 32, background: "rgba(99,102,241,0.2)" }}>
              <Zap size={14} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>The honest summary</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                <strong style={{ color: "rgba(255,255,255,0.8)" }}>A</strong> is more familiar and immediately learnable — anyone picks it up in seconds. But it has a real-world problem: a site worker could spend 20 minutes shooting and only realise at save time they were on the wrong project.
                <br /><br />
                <strong style={{ color: "rgba(255,255,255,0.8)" }}>H</strong> eliminates that problem entirely by making project context the entry point to shooting. The trade-off is one extra conceptual step — but on a building site where misfiled photos cause genuine commercial issues, that trade-off is worth it.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
