import { Folder, Camera, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface SwipeNavBarProps {
  activePanel: number;
  theme: "dark" | "light";
  onNavigate: (panel: number) => void;
}

const PANELS = [
  { label: "Projects", Icon: Folder },
  { label: "Camera", Icon: Camera },
  { label: "Inbox", Icon: Bell },
];

export function SwipeNavBar({ activePanel, theme, onNavigate }: SwipeNavBarProps) {
  const isDark = theme === "dark";

  const leftPanel = activePanel > 0 ? PANELS[activePanel - 1] : null;
  const rightPanel = activePanel < 2 ? PANELS[activePanel + 1] : null;

  const pillBase = isDark
    ? "bg-white/[0.13] border border-white/[0.14] text-white/80 active:bg-white/20"
    : "bg-white border border-gray-200 text-gray-700 shadow-sm active:bg-gray-50";

  const dotColor = isDark ? "bg-white" : "bg-gray-800";
  const stripBg = isDark ? "bg-black" : "bg-gray-50";

  return (
    <div
      className={`flex items-center justify-between px-4 flex-shrink-0 ${stripBg}`}
      style={{ height: 50 }}
    >
      {/* Left pill */}
      <div className="flex-1">
        {leftPanel ? (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => onNavigate(activePanel - 1)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 ${pillBase} transition-colors`}
          >
            <ChevronLeft size={13} strokeWidth={2.5} />
            <leftPanel.Icon size={13} strokeWidth={1.8} />
            <span className="text-xs font-semibold">{leftPanel.label}</span>
          </motion.button>
        ) : (
          <div />
        )}
      </div>

      {/* Position dots */}
      <div className="flex items-center gap-1.5 px-2">
        {[0, 1, 2].map((i) => (
          <motion.button
            key={i}
            onClick={() => onNavigate(i)}
            className={`rounded-full ${dotColor}`}
            animate={{
              width: i === activePanel ? 20 : 6,
              opacity: i === activePanel ? 0.85 : 0.18,
            }}
            style={{ height: 6 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
          />
        ))}
      </div>

      {/* Right pill */}
      <div className="flex-1 flex justify-end">
        {rightPanel ? (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => onNavigate(activePanel + 1)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 ${pillBase} transition-colors`}
          >
            <span className="text-xs font-semibold">{rightPanel.label}</span>
            <rightPanel.Icon size={13} strokeWidth={1.8} />
            <ChevronRight size={13} strokeWidth={2.5} />
          </motion.button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
