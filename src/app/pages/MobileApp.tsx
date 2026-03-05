import { HeroAnimation }         from "./HeroAnimation";
import { HeroAnimationV2 }        from "./HeroAnimationV2";
import { useState, useRef }       from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap }                    from "lucide-react";
import { ProjectsScreen }         from "../components/mobile/ProjectsScreen";
import { CameraScreen }           from "../components/mobile/CameraScreen";
import { NotificationsScreen }    from "../components/mobile/NotificationsScreen";
import { OnboardingScreen }       from "../components/mobile/OnboardingScreen";
import { SaveComparison }         from "./SaveComparison";
import { ShutterComparison }      from "./ShutterComparison";
import { DockComparison }         from "./DockComparison";
import { PhotoReviewComparison }  from "./PhotoReviewComparison";
import { FeatureShowcase }        from "./FeatureShowcase";

const PANEL_WIDTH = 387;

export function MobileApp() {
  const [activePanel,           setActivePanel]           = useState(0);
  const [showOnboarding,        setShowOnboarding]        = useState(true);
  const [showSaveComparison,    setShowSaveComparison]    = useState(false);
  const [showShutterComparison, setShowShutterComparison] = useState(false);
  const [showDockComparison,    setShowDockComparison]    = useState(false);
  const [showReviewComparison,  setShowReviewComparison]  = useState(false);
  const [showFeatureShowcase,   setShowFeatureShowcase]   = useState(false);
  const [showHeroAnimation,     setShowHeroAnimation]     = useState(false);
  const [showHeroAnimationV2,   setShowHeroAnimationV2]   = useState(false);
  const [cameraOpen,            setCameraOpen]            = useState(false);
  const [cameraSheetOpen,       setCameraSheetOpen]       = useState(false);
  const [projectsSheetOpen,     setProjectsSheetOpen]     = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (showSaveComparison)    return <SaveComparison onBack={() => setShowSaveComparison(false)} />;
  if (showShutterComparison) return <ShutterComparison onBack={() => setShowShutterComparison(false)} />;
  if (showDockComparison)    return <DockComparison onBack={() => setShowDockComparison(false)} />;
  if (showReviewComparison)  return <PhotoReviewComparison onBack={() => setShowReviewComparison(false)} />;
  if (showFeatureShowcase)   return <FeatureShowcase onBack={() => setShowFeatureShowcase(false)} />;
  if (showHeroAnimation)     return <HeroAnimation onBack={() => setShowHeroAnimation(false)} />;
  if (showHeroAnimationV2)   return <HeroAnimationV2 onBack={() => setShowHeroAnimationV2(false)} />;

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-auto py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, #1A2D5A 0%, #0A1428 100%)" }}
    >
      {/* Compare / prototype launcher buttons — top-right */}
      <button onClick={() => setShowSaveComparison(true)}    className="absolute top-6 right-6 flex items-center gap-2 rounded-full font-semibold transition-all hover:opacity-90" style={{ background: "rgba(255,255,255,0.08)",   border: "1px solid rgba(255,255,255,0.12)",  color: "rgba(255,255,255,0.6)", fontSize: 12, padding: "8px 16px" }}>Compare save options →</button>
      <button onClick={() => setShowShutterComparison(true)} className="absolute right-6 flex items-center gap-2 rounded-full font-semibold transition-all hover:opacity-90" style={{ top: 60,  background: "rgba(52,120,246,0.12)", border: "1px solid rgba(52,120,246,0.25)",  color: "#3478F6",                fontSize: 12, padding: "8px 16px" }}>Pill vs circle shutter →</button>
      <button onClick={() => setShowDockComparison(true)}    className="absolute right-6 flex items-center gap-2 rounded-full font-semibold transition-all hover:opacity-90" style={{ top: 104, background: "rgba(13,148,136,0.12)", border: "1px solid rgba(13,148,136,0.25)", color: "#0D9488",                fontSize: 12, padding: "8px 16px" }}>5 dock options →</button>
      <button onClick={() => setShowReviewComparison(true)}  className="absolute right-6 flex items-center gap-2 rounded-full font-semibold transition-all hover:opacity-90" style={{ top: 148, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)",  color: "#F97316",                fontSize: 12, padding: "8px 16px" }}>5 review panel options →</button>
      <button onClick={() => setShowFeatureShowcase(true)}   className="absolute right-6 flex items-center gap-2 rounded-full font-semibold transition-all hover:opacity-90" style={{ top: 192, background: "rgba(13,148,136,0.12)", border: "1px solid rgba(13,148,136,0.25)", color: "#0D9488",                fontSize: 12, padding: "8px 16px" }}>Feature showcase →</button>
      <button onClick={() => setShowHeroAnimation(true)}     className="absolute right-6 flex items-center gap-2 rounded-full font-semibold transition-all hover:opacity-90" style={{ top: 236, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)",  color: "#F97316",                fontSize: 12, padding: "8px 16px" }}>Hero animation →</button>
      <button onClick={() => setShowHeroAnimationV2(true)}   className="absolute right-6 flex items-center gap-2 rounded-full font-semibold transition-all hover:opacity-90" style={{ top: 280, background: "rgba(52,120,246,0.12)", border: "1px solid rgba(52,120,246,0.25)",  color: "#3478F6",                fontSize: 12, padding: "8px 16px" }}>Hero animation V2 →</button>

      {/* ── iPhone shell ── */}
      <div className="relative flex-shrink-0" style={{ width: 393, height: 852 }}>
        {/* Physical frame */}
        <div
          className="absolute inset-0 rounded-[54px]"
          style={{
            background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 40%, #141416 100%)",
            boxShadow: "0 60px 120px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
        {/* Volume buttons */}
        <div className="absolute rounded-l-sm" style={{ left: -2, top: 128, width: 3, height: 30,  background: "#1e2a3a" }} />
        <div className="absolute rounded-l-sm" style={{ left: -2, top: 178, width: 3, height: 64,  background: "#1e2a3a" }} />
        <div className="absolute rounded-l-sm" style={{ left: -2, top: 256, width: 3, height: 64,  background: "#1e2a3a" }} />
        {/* Power button */}
        <div className="absolute rounded-r-sm" style={{ right: -2, top: 194, width: 3, height: 84, background: "#1e2a3a" }} />

        {/* Screen area */}
        <div className="absolute rounded-[52px] overflow-hidden" style={{ inset: 3, background: "#000" }}>
          {/* Dynamic island */}
          <div className="absolute rounded-full z-50 pointer-events-none"
            style={{ top: 10, left: "50%", transform: "translateX(-50%)", width: 126, height: 37, background: "#000" }} />

          {/* Onboarding overlay */}
          <AnimatePresence>
            {showOnboarding && (
              <motion.div key="onboarding" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-40">
                <OnboardingScreen onDone={() => setShowOnboarding(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2-panel swipe: Home | Notifications */}
          <div ref={containerRef} className="h-full overflow-hidden" style={{ width: PANEL_WIDTH }}>
            <motion.div className="flex h-full" style={{ width: PANEL_WIDTH * 2 }}
              animate={{ x: -(activePanel * PANEL_WIDTH) }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}>
              <div className="h-full flex-shrink-0" style={{ width: PANEL_WIDTH }}>
                <ProjectsScreen
                  onOpenCamera={() => setCameraOpen(true)}
                  onOpenNotifications={() => setActivePanel(1)}
                  onSheetChange={setProjectsSheetOpen}
                />
              </div>
              <div className="h-full flex-shrink-0" style={{ width: PANEL_WIDTH }}>
                <NotificationsScreen onBack={() => setActivePanel(0)} />
              </div>
            </motion.div>
          </div>

          {/* Camera overlay */}
          <AnimatePresence>
            {cameraOpen && (
              <motion.div key="camera-overlay" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 38 }} className="absolute inset-0 z-20">
                <CameraScreen
                  onClose={() => { setCameraOpen(false); setCameraSheetOpen(false); }}
                  onSheetChange={setCameraSheetOpen}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Camera pill FAB */}
          <AnimatePresence>
            {!showOnboarding && !cameraOpen && !cameraSheetOpen && !projectsSheetOpen && (
              <motion.div key="camera-pill"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="absolute z-30 pointer-events-none flex justify-center"
                style={{ bottom: 22, left: 0, right: 0 }}>
                <motion.button whileTap={{ scale: 0.94 }} onClick={() => setCameraOpen(true)}
                  className="pointer-events-auto"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "#3478F6", border: "none", borderRadius: 999,
                    paddingLeft: 20, paddingRight: 28, height: 60, cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(52,120,246,0.5)", position: "relative",
                  }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M2 8.5C2 7.4 2.9 6.5 4 6.5h3.4l1.4-2h5.4l1.4 2H20c1.1 0 2 .9 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.5z" fill="white" />
                      <circle cx="12" cy="13.5" r="4"   fill="#3478F6" />
                      <circle cx="12" cy="13.5" r="2.7" fill="white"   />
                      <circle cx="12" cy="13.5" r="1.1" fill="#3478F6" />
                    </svg>
                    <div style={{ position: "absolute", top: -3, right: -3, width: 13, height: 13, borderRadius: "50%", background: "#F97316", border: "1px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Zap size={7} color="#fff" strokeWidth={2.5} fill="#fff" />
                    </div>
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>Snap</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Home indicator */}
          <div className="absolute pointer-events-none rounded-full z-50"
            style={{ bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, background: "rgba(255,255,255,0.28)" }} />
        </div>
      </div>
    </div>
  );
}
