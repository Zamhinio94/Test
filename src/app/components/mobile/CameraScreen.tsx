import { useState, useEffect } from "react";
import { Zap, Upload, MapPin, MapPinOff, Search, X, ChevronRight, Plus, ArrowLeft, Loader } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StatusBar } from "./StatusBar";
import { PhotoReviewSheet } from "./PhotoReviewSheet";

const VIEWFINDER_BG =
  "https://images.unsplash.com/photo-1615469309529-733e81176c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200";

const PHOTO_POOL = [
  "https://images.unsplash.com/photo-1615469309529-733e81176c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  "https://images.unsplash.com/photo-1585118213816-1c57f4b0b1dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  "https://images.unsplash.com/photo-1659427921734-d4590f1e099f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  "https://images.unsplash.com/photo-1625337905408-7b6fe970e187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  "https://images.unsplash.com/photo-1768321903836-de712f966a25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  "https://images.unsplash.com/photo-1730651066017-4b98ab60df6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
];

const PROJECTS = [
  "Kings Cross Quarter",
  "Phase 2 – Piccadilly",
  "Riverside Quarter",
];

const ALL_PROJECTS = [
  { id: "1", name: "Kings Cross Quarter",   address: "King's Cross, London N1C",      client: "Barratt Homes",   status: "live"     },
  { id: "2", name: "Phase 2 – Piccadilly",  address: "Piccadilly, Manchester M1",     client: "Taylor Wimpey",   status: "live"     },
  { id: "3", name: "Riverside Quarter",     address: "Bankside, London SE1",          client: "Berkeley Group",  status: "live"     },
  { id: "4", name: "Salford Quays Block C", address: "Salford Quays, Manchester M50", client: "Redrow Homes",    status: "complete" },
  { id: "5", name: "Leeds Dock Phase 1",    address: "Leeds Dock, Leeds LS10",        client: "Persimmon Homes", status: "complete" },
];

type Mode = "video" | "photo";
type GpsState = "detecting" | "matched" | "unmatched";

interface CameraScreenProps {
  onSheetChange?: (open: boolean) => void;
  onCountChange?: (count: number) => void;
  triggerReview?: number;
  onClose?: () => void;
}

export function CameraScreen({ onSheetChange, onCountChange, triggerReview, onClose }: CameraScreenProps) {
  const [flash, setFlash] = useState(false);
  const [mode, setMode] = useState<Mode>("photo");
  const [projectIdx, setProjectIdx] = useState(0);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [capturedPhotos, setCapturedPhotos] = useState<{ id: number; url: string }[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [projectConfirmed, setProjectConfirmed] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const [gpsState, setGpsState] = useState<GpsState>("detecting");
  const [projectManuallySelected, setProjectManuallySelected] = useState(false);

  // Simulate GPS lookup on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate no match found — in production this checks coords against project geofences
      setGpsState("unmatched");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const openPicker = () => { setPickerOpen(true); onSheetChange?.(true); };
  const closePicker = () => { setPickerOpen(false); setSearch(""); onSheetChange?.(false); };

  const recentPhotos = capturedPhotos.slice(-3);

  const filteredProjects = ALL_PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase())
  );

  const handleCapture = () => {
    if (!projectConfirmed) setProjectConfirmed(true);
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 100);
    setCapturedPhotos((prev) => [
      ...prev,
      { id: Date.now(), url: PHOTO_POOL[prev.length % PHOTO_POOL.length] },
    ]);
  };

  const handleSave = () => {
    setReviewOpen(true);
    onSheetChange?.(true);
  };

  const handleUpload = () => {
    setCapturedPhotos([]);
    setReviewOpen(false);
    onSheetChange?.(false);
  };

  const handleSelectExisting = (idx: number) => {
    setProjectIdx(idx % PROJECTS.length);
    setProjectConfirmed(false);
    setProjectManuallySelected(true);
    setGpsState("matched");
    closePicker();
  };

  const cycleZoom = () => {
    setZoom((z) => (z === 1 ? 2 : z === 2 ? 0.5 : 1));
  };

  const handleDiscard = () => {
    setCapturedPhotos([]);
  };

  // Notify parent whenever count changes
  useEffect(() => {
    onCountChange?.(capturedPhotos.length);
  }, [capturedPhotos.length]);

  // Parent can trigger review open (e.g. from tab bar CTA)
  useEffect(() => {
    if (triggerReview && capturedPhotos.length > 0) {
      setReviewOpen(true);
      onSheetChange?.(true);
    }
  }, [triggerReview]);

  return (
    <div className="h-full bg-black select-none relative overflow-hidden">

      {/* ── Viewfinder — full bleed incl. status bar area ── */}
      <div className="absolute inset-0">
        <img
          src={VIEWFINDER_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.75 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-50% to-black/60 pointer-events-none" />

        {/* StatusBar overlaid at top */}
        <div className="relative z-10">
          <StatusBar theme="dark" />
        </div>

        {/* Shutter flash */}
        <AnimatePresence>
          {shutterFlash && (
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute inset-0 bg-white z-20 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Rule-of-thirds grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/12" />
          <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/12" />
          <div className="absolute left-0 right-0 top-1/3 h-px bg-white/12" />
          <div className="absolute left-0 right-0 bottom-1/3 h-px bg-white/12" />
        </div>

        {/* Focus brackets */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-28 h-28" style={{ opacity: 0.65 }}>
            <div className="absolute top-0 left-0 w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-white" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-[1.5px] border-r-[1.5px] border-white" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-[1.5px] border-l-[1.5px] border-white" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-[1.5px] border-r-[1.5px] border-white" />
          </div>
        </div>

        {/* ── "Location not recognised" banner ── */}
        <AnimatePresence>
          {gpsState === "unmatched" && !projectManuallySelected && (
            <motion.div
              key="gps-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="absolute left-4 right-4 z-10 flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{
                top: 120,
                background: "#EEF3FF",
              }}
            >
              <MapPinOff size={15} color="#1D3D8A" strokeWidth={2} style={{ flexShrink: 0, opacity: 0.6 }} />
              <div className="flex-1">
                <p className="text-xs font-bold" style={{ color: "#0E1F40" }}>Location not recognised</p>
                <p className="text-[11px]" style={{ color: "#1D3D8A", opacity: 0.7 }}>Tap the project pill above to assign manually</p>
              </div>
              <button
                onClick={() => setProjectManuallySelected(true)}
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "rgba(29,61,138,0.1)" }}
              >
                <X size={11} color="#1D3D8A" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Top controls: Back/Discard | Project pill | Flash ── */}
        <div className="absolute left-0 right-0 flex items-center justify-between px-5 pt-2.5" style={{ top: 54 }}>
          {/* LEFT — back when empty, discard when shots taken */}
          <div className="w-10 h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {capturedPhotos.length > 0 ? (
                <motion.button
                  key="discard"
                  onClick={handleDiscard}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
                >
                  <X size={16} className="text-white" strokeWidth={2} />
                </motion.button>
              ) : onClose ? (
                <motion.button
                  key="back"
                  onClick={onClose}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
                >
                  <X size={16} className="text-white" strokeWidth={2} />
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>

          {/* CENTER — Project pill */}
          <button
            onClick={openPicker}
            className="relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 max-w-[190px] active:scale-95 transition-transform"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(14px)",
              border: "0.5px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* Pulse ring — only when project unconfirmed & matched */}
            <AnimatePresence>
              {!projectConfirmed && gpsState === "matched" && (
                <motion.span
                  key="pulse"
                  className="absolute pointer-events-none rounded-full"
                  style={{ inset: -4, border: "1.5px solid rgba(96,165,250,0.75)" }}
                  animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.05, 1] }}
                  exit={{ opacity: 0, scale: 1.18, transition: { duration: 0.28, ease: "easeOut" } }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>

            {/* Amber dot — unmatched only, very selective use of orange */}
            {gpsState === "unmatched" && !projectManuallySelected && (
              <div style={{
                position: "absolute", top: -2, right: -2,
                width: 7, height: 7, borderRadius: "50%",
                background: "#F97316", border: "1.5px solid rgba(0,0,0,0.5)",
              }} />
            )}

            {/* Icon: spinner → pin-off → pin */}
            {gpsState === "detecting" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader size={11} color="rgba(255,255,255,0.6)" />
              </motion.div>
            ) : gpsState === "unmatched" && !projectManuallySelected ? (
              <MapPinOff size={11} color="rgba(255,255,255,0.7)" />
            ) : (
              <MapPin size={11} color="#60a5fa" className="flex-shrink-0" />
            )}

            <span className="text-xs font-semibold truncate text-white">
              {gpsState === "detecting"
                ? "Detecting…"
                : gpsState === "unmatched" && !projectManuallySelected
                  ? "Select project"
                  : PROJECTS[projectIdx]}
            </span>
          </button>

          {/* RIGHT — Flash */}
          <button
            onClick={() => setFlash(f => !f)}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
          >
            <Zap
              size={17}
              strokeWidth={1.75}
              className={flash ? "text-yellow-300" : "text-white/60"}
              fill={flash ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Zoom pill */}
        <button
          onClick={cycleZoom}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full px-3 py-1"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)" }}
        >
          <span className="text-white text-xs font-semibold">{zoom}×</span>
        </button>

        <AnimatePresence>
          {/* removed — replaced by full-width save button below capture row */}
        </AnimatePresence>
      </div>

      {/* ── Bottom bar — single static container, nothing moves ── */}
      <div className="absolute bottom-0 left-0 right-0 bg-black z-10">

        {/* Capture row — always on top of the bar */}
        <div className="flex items-center justify-between px-10 pt-4 pb-2">
          {/* LEFT — Upload from gallery */}
          <button
            onClick={() => {}}
            className="w-14 h-14 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <Upload size={20} className="text-white" strokeWidth={1.75} />
          </button>

          {/* CENTER — Shutter */}
          <motion.button
            onTapStart={handleCapture}
            whileTap={{ scale: 0.88 }}
            className="relative w-[78px] h-[78px] rounded-full flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full border-[3px] border-white/75" />
            <div className="w-[62px] h-[62px] rounded-full bg-white shadow-md" />
          </motion.button>

          {/* RIGHT — Thumbnail stack */}
          <button
            className="w-14 h-14 flex items-center justify-center relative"
            onClick={capturedPhotos.length > 0 ? handleSave : undefined}
            style={{ opacity: capturedPhotos.length > 0 ? 1 : 0.3 }}
          >
            <div className="relative w-14 h-14">
              <AnimatePresence>
                {capturedPhotos.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-2xl border-2 border-dashed border-white/20"
                  />
                ) : (
                  recentPhotos.map((photo, i) => {
                    const offset = (recentPhotos.length - 1 - i) * 3;
                    return (
                      <motion.div
                        key={photo.id}
                        initial={{ scale: 0.6, opacity: 0, x: -20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-white/60"
                        style={{
                          zIndex: i,
                          transform: `translate(${-offset}px, ${-offset}px) scale(${1 - offset * 0.008})`,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                        }}
                      >
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
            {capturedPhotos.length > 0 && (
              <div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-10"
                style={{ background: "#3478F6", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
              >
                <span className="text-white text-[10px] font-bold">{capturedPhotos.length}</span>
              </div>
            )}
          </button>

        </div>

        {/* Pill slot — always 76px tall at the bottom so position matches review sheet */}
        <div className="px-4 pb-7 pt-2" style={{ height: 76 }}>
          <AnimatePresence>
            {capturedPhotos.length > 0 && (
              <motion.div
                key="save-pill"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
              >
                {gpsState === "unmatched" && !projectManuallySelected ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={openPicker}
                    className="w-full rounded-full flex items-center justify-center gap-2"
                    style={{ background: "#0E1F40", height: 52 }}
                  >
                    <MapPinOff size={15} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                    <span className="font-bold text-white" style={{ fontSize: 15 }}>
                      Select a project to save
                    </span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    className="w-full rounded-full flex items-center justify-center"
                    style={{ background: "#3478F6", height: 52 }}
                  >
                    <span className="text-white font-bold" style={{ fontSize: 15 }}>
                      Save &amp; review · {capturedPhotos.length} photo{capturedPhotos.length !== 1 ? "s" : ""}
                    </span>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Project picker sheet ── */}
      <AnimatePresence>
        {pickerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePicker}
              className="absolute inset-0 bg-black/50 z-30"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl flex flex-col"
              style={{ maxHeight: "88%" }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-9 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="relative flex items-center px-5 py-2.5 flex-shrink-0">
                <button
                  onClick={closePicker}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={14} className="text-gray-500" strokeWidth={2.5} />
                </button>
                <span className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-gray-900 whitespace-nowrap">
                  Select project
                </span>
              </div>

              {/* Search */}
              <div className="px-4 pb-3 flex-shrink-0">
                <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2.5">
                  <Search size={13} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
                  <input
                    type="text"
                    placeholder="Search by name, address or client…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none"
                    autoFocus
                  />
                  {search && (
                    <button onClick={() => setSearch("")}>
                      <X size={11} className="text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* ── New project — top of list, prominent when GPS unmatched ── */}
              <div className="px-4 pb-3 flex-shrink-0">
                {gpsState === "unmatched" && !projectManuallySelected ? (
                  <button
                    onClick={closePicker}
                    className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 active:opacity-80 transition-opacity"
                    style={{ background: "#3478F6" }}
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Plus size={15} color="#fff" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-white">Create new project</p>
                      <p className="text-[11px] text-white/70">No matching site found nearby</p>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={closePicker}
                    className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Plus size={14} className="text-blue-500" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-semibold text-blue-500">New project</span>
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="mx-4 mb-1 flex-shrink-0 border-t border-gray-100" />

              {/* Project list — scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {filteredProjects.map((project, i) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectExisting(i)}
                    className="w-full flex items-center gap-3 px-4 py-3 active:bg-gray-50 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0`} style={{ background: project.status === "live" ? "#22C55E" : "#D1D5DB" }} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{project.name}</p>
                      <p className="text-[11px] text-gray-400 leading-snug">{project.address} · {project.client}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                  </button>
                ))}
                {filteredProjects.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-8">No projects match "{search}"</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Photo review sheet ── */}
      <AnimatePresence>
        {reviewOpen && capturedPhotos.length > 0 && (
          <PhotoReviewSheet
            photos={capturedPhotos}
            projectName={PROJECTS[projectIdx]}
            onUpload={handleUpload}
            onClose={() => { setReviewOpen(false); onSheetChange?.(false); onClose?.(); }}
          />
        )}
      </AnimatePresence>

      {/* Tab bar spacer */}
      <div className="bg-black" style={{ height: 72 }} />
    </div>
  );
}