import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { ArrowUpRight, PenLine, Circle, Square, Type, Undo2, Check, X } from "lucide-react";

type Tool    = "arrow" | "pen" | "shape" | "text";
type ShapeSub = "circle" | "rect";

interface Point { x: number; y: number; }

type Stroke =
  | { id: string; type: "pen";    points: Point[]; color: string; width: number }
  | { id: string; type: "arrow";  x1: number; y1: number; x2: number; y2: number; color: string; width: number }
  | { id: string; type: "circle"; cx: number; cy: number; rx: number; ry: number; color: string; width: number }
  | { id: string; type: "rect";   x: number; y: number; w: number; h: number; color: string; width: number }
  | { id: string; type: "text";   x: number; y: number; text: string; color: string };

const PALETTE = ["#ef4444", "#f97316", "#f59e0b", "#4ade80", "#60a5fa", "#fff"];

/* Shape sub-options shown in popup */
const SHAPE_OPTIONS: { id: ShapeSub; icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>; label: string }[] = [
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "rect",   icon: Square, label: "Square" },
];

const SHAPE_ICON_MAP: Record<ShapeSub, typeof Circle> = {
  circle: Circle,
  rect:   Square,
};

/* Main tool strip */
const STRIP_TOOLS: { id: Tool; label: string }[] = [
  { id: "arrow", label: "Arrow"  },
  { id: "pen",   label: "Draw"   },
  { id: "shape", label: "Shapes" },
  { id: "text",  label: "Text"   },
];

const STRIP_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  arrow: ArrowUpRight,
  pen:   PenLine,
  text:  Type,
};

/* Fixed Shape button icon — circle + square, never changes */
function ShapeToolIcon({ iconColor }: { iconColor: string }) {
  return (
    <svg width="26" height="18" viewBox="0 0 26 18" fill="none">
      <circle cx="6" cy="9" r="5" stroke={iconColor} strokeWidth="1.65" />
      <rect x="15" y="4" width="9" height="10" rx="2" stroke={iconColor} strokeWidth="1.65" />
    </svg>
  );
}

const TEXT_PRESETS = ["Defect", "Check", "Action req", "Query", "OK ✓", "Hold", "Miss"];

const uid = () => Math.random().toString(36).slice(2, 9);

function smoothPath(pts: Point[]): string {
  if (pts.length < 2) return `M${pts[0]?.x ?? 0} ${pts[0]?.y ?? 0}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x} ${pts[i].y} ${mx} ${my}`;
  }
  const l = pts[pts.length - 1];
  d += ` L ${l.x} ${l.y}`;
  return d;
}

function arrowHeadPath(x1: number, y1: number, x2: number, y2: number, size: number): string {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const s = Math.PI / 6;
  return `M ${x2 - size * Math.cos(a - s)} ${y2 - size * Math.sin(a - s)} L ${x2} ${y2} L ${x2 - size * Math.cos(a + s)} ${y2 - size * Math.sin(a + s)}`;
}

interface Props {
  photoUrl: string;
  onDone: (hasAnnotations: boolean) => void;
  onCancel: () => void;
}

export function AnnotationCanvas({ photoUrl, onDone, onCancel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState({ w: 390, h: 700 });

  const [strokes, setStrokes]       = useState<Stroke[]>([]);
  const [liveStroke, setLiveStroke] = useState<Stroke | null>(null);

  const [tool, setTool]             = useState<Tool | null>(null);
  const [color, setColor]           = useState(PALETTE[0]);
  const [activeShape, setActiveShape] = useState<ShapeSub>("circle");
  const [shapePopupOpen, setShapePopupOpen] = useState(false);

  /* Animation controls */
  const doneControls   = useAnimation();
  const topBarControls = useAnimation();
  const bottomControls = useAnimation();

  /* Entrance sequence */
  useEffect(() => {
    const seq = async () => {
      await bottomControls.start({ y: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } });
      await topBarControls.start({ y: 0, opacity: 1, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } });
      await doneControls.start({
        scale: [1, 1.1, 0.95, 1.04, 1],
        boxShadow: [
          "0 0 0px rgba(79,110,247,0)",
          "0 0 22px rgba(79,110,247,0.7)",
          "0 0 10px rgba(79,110,247,0.3)",
          "0 0 0px rgba(79,110,247,0)",
        ],
        transition: { duration: 0.55, ease: "easeOut" },
      });
    };
    seq();
  }, []);

  /* Bounce on first stroke */
  useEffect(() => {
    if (strokes.length === 1) {
      doneControls.start({
        scale: [1, 1.14, 0.93, 1.04, 1],
        transition: { duration: 0.45, ease: "easeOut" },
      });
    }
  }, [strokes.length]);

  /* Text placement */
  const [textTarget, setTextTarget] = useState<Point | null>(null);
  const [textVal, setTextVal]       = useState("");

  /* Hot-path refs (avoid stale closures in imperative listeners) */
  const drawingRef      = useRef(false);
  const startPtRef      = useRef<Point | null>(null);
  const penPtsRef       = useRef<Point[]>([]);
  const toolRef         = useRef<Tool | null>(null);
  const colorRef        = useRef(PALETTE[0]);
  const strokeWRef      = useRef(4.5); // always bold — one weight
  const activeShapeRef  = useRef<ShapeSub>("circle");
  const popupOpenRef    = useRef(false);

  useEffect(() => { toolRef.current       = tool;        }, [tool]);
  useEffect(() => { colorRef.current      = color;       }, [color]);
  useEffect(() => { activeShapeRef.current = activeShape; }, [activeShape]);
  useEffect(() => { popupOpenRef.current  = shapePopupOpen; }, [shapePopupOpen]);

  /* Container resize observer */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSvgSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getPos = (e: TouchEvent | MouseEvent): Point => {
    const rect = containerRef.current!.getBoundingClientRect();
    const cx = "touches" in e
      ? ((e as TouchEvent).touches[0] ?? (e as TouchEvent).changedTouches[0]).clientX
      : (e as MouseEvent).clientX;
    const cy = "touches" in e
      ? ((e as TouchEvent).touches[0] ?? (e as TouchEvent).changedTouches[0]).clientY
      : (e as MouseEvent).clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  };

  /* Imperative listeners (non-passive for preventDefault) */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent | MouseEvent) => {
      // Dismiss shape popup on canvas tap
      if (popupOpenRef.current) { setShapePopupOpen(false); return; }
      if (toolRef.current === null) return;
      if (toolRef.current === "text") return;

      e.preventDefault();
      const pos = getPos(e);
      drawingRef.current  = true;
      startPtRef.current  = pos;

      if (toolRef.current === "pen") {
        penPtsRef.current = [pos];
        setLiveStroke({ id: "live", type: "pen", points: [pos], color: colorRef.current, width: strokeWRef.current });
      }
    };

    const onMove = (e: TouchEvent | MouseEvent) => {
      if (!drawingRef.current || !startPtRef.current) return;
      e.preventDefault();
      const pos = getPos(e);
      const sp  = startPtRef.current;
      const c   = colorRef.current;
      const w   = strokeWRef.current;

      if (toolRef.current === "pen") {
        penPtsRef.current = [...penPtsRef.current, pos];
        setLiveStroke({ id: "live", type: "pen", points: [...penPtsRef.current], color: c, width: w });
      } else if (toolRef.current === "arrow") {
        setLiveStroke({ id: "live", type: "arrow", x1: sp.x, y1: sp.y, x2: pos.x, y2: pos.y, color: c, width: w });
      } else if (toolRef.current === "shape") {
        const sub = activeShapeRef.current;
        if (sub === "circle") {
          setLiveStroke({ id: "live", type: "circle",
            cx: (sp.x + pos.x) / 2, cy: (sp.y + pos.y) / 2,
            rx: Math.abs(pos.x - sp.x) / 2, ry: Math.abs(pos.y - sp.y) / 2,
            color: c, width: w });
        } else if (sub === "rect") {
          setLiveStroke({ id: "live", type: "rect",
            x: Math.min(sp.x, pos.x), y: Math.min(sp.y, pos.y),
            w: Math.abs(pos.x - sp.x), h: Math.abs(pos.y - sp.y),
            color: c, width: w });
        }
      }
    };

    const onEnd = () => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      setLiveStroke(prev => {
        if (prev) setStrokes(s => [...s, { ...prev, id: uid() }]);
        return null;
      });
      penPtsRef.current  = [];
      startPtRef.current = null;
    };

    el.addEventListener("touchstart", onStart as EventListener, { passive: false });
    el.addEventListener("touchmove",  onMove  as EventListener, { passive: false });
    el.addEventListener("touchend",   onEnd   as EventListener, { passive: false });
    el.addEventListener("mousedown",  onStart as EventListener);
    el.addEventListener("mousemove",  onMove  as EventListener);
    el.addEventListener("mouseup",    onEnd   as EventListener);

    return () => {
      el.removeEventListener("touchstart", onStart as EventListener);
      el.removeEventListener("touchmove",  onMove  as EventListener);
      el.removeEventListener("touchend",   onEnd   as EventListener);
      el.removeEventListener("mousedown",  onStart as EventListener);
      el.removeEventListener("mousemove",  onMove  as EventListener);
      el.removeEventListener("mouseup",    onEnd   as EventListener);
    };
  }, []);

  /* Text tap via React synthetic events */
  const handleTextTap = (e: React.TouchEvent | React.MouseEvent) => {
    if (toolRef.current !== "text") return;
    const rect = containerRef.current!.getBoundingClientRect();
    let cx: number, cy: number;
    if ("touches" in e) {
      const t = e.changedTouches[0];
      cx = t.clientX - rect.left; cy = t.clientY - rect.top;
    } else {
      cx = (e as React.MouseEvent).clientX - rect.left;
      cy = (e as React.MouseEvent).clientY - rect.top;
    }
    setTextTarget({ x: cx, y: cy });
    setTextVal("");
  };

  const placeText = (text: string) => {
    if (!textTarget || !text.trim()) { setTextTarget(null); return; }
    setStrokes(s => [...s, { id: uid(), type: "text", x: textTarget.x, y: textTarget.y - 8, text: text.trim(), color: colorRef.current }]);
    setTextTarget(null);
    setTextVal("");
  };

  const undo = () => setStrokes(s => s.slice(0, -1));

  /* SVG stroke renderer */
  const renderStroke = (s: Stroke, key: string) => {
    switch (s.type) {
      case "pen":
        return <path key={key} d={smoothPath(s.points)} stroke={s.color} strokeWidth={s.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
      case "arrow": {
        const hSize = s.width * 5;
        return (
          <g key={key}>
            <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.color} strokeWidth={s.width} strokeLinecap="round" />
            <path d={arrowHeadPath(s.x1, s.y1, s.x2, s.y2, hSize)} stroke={s.color} strokeWidth={s.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      }
      case "circle":
        return <ellipse key={key} cx={s.cx} cy={s.cy} rx={Math.max(s.rx, 2)} ry={Math.max(s.ry, 2)} stroke={s.color} strokeWidth={s.width} fill="none" strokeLinecap="round" />;
      case "rect":
        return <rect key={key} x={s.x} y={s.y} width={Math.max(s.w, 2)} height={Math.max(s.h, 2)} stroke={s.color} strokeWidth={s.width} fill="none" strokeLinecap="round" strokeLinejoin="round" rx={3} />;
      case "text": {
        // Measure actual text width using canvas for pixel-perfect background rect
        const textPx = (() => {
          try {
            const cv = document.createElement("canvas");
            const ctx = cv.getContext("2d");
            if (!ctx) return s.text.length * 7;
            ctx.font = `700 13px -apple-system, BlinkMacSystemFont, sans-serif`;
            return Math.ceil(ctx.measureText(s.text).width);
          } catch {
            return s.text.length * 7;
          }
        })();
        const pH = 7; // horizontal padding each side
        return (
          <g key={key}>
            <rect x={s.x - pH} y={s.y - 15} width={textPx + pH * 2} height={22} rx={5} fill={s.color} opacity={0.88} />
            <text x={s.x} y={s.y} fill="#fff" fontSize={13} fontWeight="700" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
              {s.text}
            </text>
          </g>
        );
      }
      default: return null;
    }
  };

  const activeColor = color;

  /* Shape tool button helpers */
  const handleShapeTap = () => {
    if (tool !== "shape") {
      setTool("shape");
      setShapePopupOpen(true);
    } else {
      setShapePopupOpen(v => !v);
    }
    setTextTarget(null);
  };

  const selectShape = (sub: ShapeSub, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setActiveShape(sub);
    setShapePopupOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-50 flex flex-col"
      style={{ background: "#000", borderRadius: "24px 24px 0 0", overflow: "hidden" }}
    >
      {/* ── Top bar ── */}
      <motion.div
        initial={{ y: -56, opacity: 0 }}
        animate={topBarControls}
        className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(24px)", borderBottom: "0.5px solid rgba(255,255,255,0.07)", zIndex: 10 }}
      >
        {/* X — cancel */}
        <motion.button
          onClick={onCancel}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center rounded-full"
          style={{ width: 36, height: 36, background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.16)" }}
        >
          <X size={14} style={{ color: "rgba(255,255,255,0.7)" }} strokeWidth={2.5} />
        </motion.button>

        {/* Done */}
        <motion.button
          onClick={() => onDone(strokes.length > 0)}
          whileTap={{ scale: 0.9 }}
          animate={doneControls}
          className="flex items-center gap-1.5 rounded-full px-3.5 relative overflow-hidden"
          style={{
            height: 36,
            background: strokes.length > 0 ? "#4F6EF7" : "rgba(79,110,247,0.22)",
            border: `0.5px solid ${strokes.length > 0 ? "rgba(79,110,247,0.8)" : "rgba(79,110,247,0.35)"}`,
            transition: "background 0.25s, border-color 0.25s",
            boxShadow: strokes.length > 0 ? "0 0 18px rgba(79,110,247,0.55)" : "none",
          }}
        >
          <AnimatePresence>
            {strokes.length === 1 && (
              <motion.div
                key="sheen"
                initial={{ x: "-100%", opacity: 0.6 }}
                animate={{ x: "200%", opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", skewX: -15 }}
              />
            )}
          </AnimatePresence>
          <Check size={13} color="#fff" strokeWidth={2.5} />
          <span className="text-white font-semibold" style={{ fontSize: 13 }}>Done</span>
        </motion.button>
      </motion.div>

      {/* ── Drawing area ── */}
      <div
        ref={containerRef}
        className="relative flex-1"
        style={{ touchAction: "none", cursor: tool === null ? "default" : "crosshair", userSelect: "none" }}
        onTouchEnd={tool === "text" ? handleTextTap : undefined}
        onClick={tool === "text" ? handleTextTap : undefined}
      >
        <img src={photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.1)" }} />

        <svg className="absolute inset-0" width={svgSize.w} height={svgSize.h} style={{ overflow: "visible" }}>
          {strokes.map(s => renderStroke(s, s.id))}
          {liveStroke && renderStroke(liveStroke, "live")}
        </svg>

        {/* Text cursor pin */}
        {textTarget && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="absolute w-4 h-4 rounded-full pointer-events-none"
            style={{ left: textTarget.x - 8, top: textTarget.y - 8, background: activeColor, border: "2px solid #fff", boxShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
          />
        )}

        {/* First-use ghost hint */}
        <AnimatePresence>
          {strokes.length === 0 && !liveStroke && !textTarget && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none"
            >
              <div
                className="rounded-full px-4 py-2"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "0.5px solid rgba(255,255,255,0.12)" }}
              >
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  {tool === null
                    ? "Choose a tool below to start"
                    : tool === "text"
                    ? "Tap on the photo to place text"
                    : tool === "arrow"
                    ? "Drag to draw an arrow"
                    : tool === "shape"
                    ? `Drag to draw a ${activeShape}`
                    : "Drag to draw"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom controls ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={bottomControls}
        className="flex-shrink-0"
        style={{ background: "rgba(8,8,14,0.92)", backdropFilter: "blur(32px)", borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
      >
        {/* Colour row */}
        <div className="flex items-center justify-center gap-3 px-4 pt-4 pb-2.5">
          {PALETTE.map(c => (
            <motion.button
              key={c}
              onClick={() => setColor(c)}
              whileTap={{ scale: 0.82 }}
              className="rounded-full flex-shrink-0"
              style={{
                width: 22, height: 22,
                background: c,
                boxShadow: color === c ? `0 0 0 2px #000, 0 0 0 4px ${c}` : "0 0 0 0.5px rgba(255,255,255,0.2)",
                transition: "box-shadow 0.15s",
              }}
            />
          ))}
        </div>

        {/* Tool strip — Undo + 4 tools */}
        <div className="flex items-start justify-around px-3 pt-1 pb-7">

          {/* Undo */}
          <motion.button
            onClick={undo}
            whileTap={strokes.length > 0 ? { scale: 0.86 } : {}}
            disabled={strokes.length === 0}
            className="flex flex-col items-center gap-1.5"
          >
            <motion.div
              animate={{ opacity: strokes.length > 0 ? 1 : 0.28 }}
              transition={{ duration: 0.16 }}
              className="flex items-center justify-center rounded-full"
              style={{ width: 54, height: 54, background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.1)" }}
            >
              <Undo2 size={21} strokeWidth={1.6} style={{ color: "rgba(255,255,255,0.7)" }} />
            </motion.div>
            <span style={{ fontSize: 10, fontWeight: 600, color: strokes.length > 0 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)", transition: "color 0.16s" }}>
              Undo
            </span>
          </motion.button>

          {/* Arrow, Freehand, Shape, Text */}
          {STRIP_TOOLS.map(({ id, label }) => {
            const active   = tool === id;
            const isShape  = id === "shape";

            // For non-shape tools, use STRIP_ICONS; shape renders its own fixed icon below
            const IconComp = STRIP_ICONS[id];

            return (
              <div key={id} className="relative flex flex-col items-center gap-1.5">

                {/* Shape popup — plain div handles CSS positioning, motion.div handles animation only */}
                {isShape && (
                  <AnimatePresence>
                    {shapePopupOpen && (
                      <div
                        className="absolute z-50"
                        style={{ bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.82, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.82, y: 6 }}
                          transition={{ type: "spring", stiffness: 480, damping: 30 }}
                          className="flex gap-1.5 p-2"
                          style={{
                            background: "rgba(18,18,28,0.97)",
                            backdropFilter: "blur(32px)",
                            WebkitBackdropFilter: "blur(32px)",
                            border: "0.5px solid rgba(255,255,255,0.13)",
                            borderRadius: 18,
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          {SHAPE_OPTIONS.map(opt => {
                            const SubIcon = opt.icon;
                            const subActive = activeShape === opt.id;
                            return (
                              <motion.button
                                key={opt.id}
                                whileTap={{ scale: 0.88 }}
                                onClick={e => selectShape(opt.id, e)}
                                className="flex flex-col items-center gap-1.5 rounded-2xl px-3 py-2.5"
                                style={{
                                  background: subActive ? activeColor : "rgba(255,255,255,0.07)",
                                  border: `0.5px solid ${subActive ? activeColor : "rgba(255,255,255,0.1)"}`,
                                  minWidth: 56,
                                }}
                              >
                                <SubIcon
                                  size={20}
                                  strokeWidth={1.6}
                                  style={{ color: subActive ? "#fff" : "rgba(255,255,255,0.55)" }}
                                />
                                <span style={{ fontSize: 9, fontWeight: 700, color: subActive ? "#fff" : "rgba(255,255,255,0.4)", letterSpacing: "0.02em" }}>
                                  {opt.label}
                                </span>
                              </motion.button>
                            );
                          })}

                          {/* Downward notch */}
                          <div
                            className="absolute left-1/2 top-full"
                            style={{
                              transform: "translateX(-50%)",
                              width: 0, height: 0,
                              borderLeft: "6px solid transparent",
                              borderRight: "6px solid transparent",
                              borderTop: "6px solid rgba(18,18,28,0.97)",
                            }}
                          />
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                )}

                <motion.button
                  onClick={isShape ? handleShapeTap : () => { setTool(id as Tool); setTextTarget(null); setShapePopupOpen(false); }}
                  whileTap={{ scale: 0.86 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <motion.div
                    animate={{
                      background: active ? activeColor : "rgba(255,255,255,0.08)",
                      borderColor: active ? activeColor : "rgba(255,255,255,0.1)",
                    }}
                    transition={{ duration: 0.16 }}
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 54, height: 54, border: "0.5px solid" }}
                  >
                    {isShape
                      ? <ShapeToolIcon iconColor={active ? "#fff" : "rgba(255,255,255,0.4)"} />
                      : <IconComp size={21} strokeWidth={1.6} style={{ color: active ? "#fff" : "rgba(255,255,255,0.4)", transition: "color 0.16s" }} />
                    }
                  </motion.div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: active ? "#fff" : "rgba(255,255,255,0.3)", transition: "color 0.16s" }}>
                    {label}
                  </span>
                </motion.button>

              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Text placement sheet ── */}
      <AnimatePresence>
        {textTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-20"
              style={{ background: "#000" }}
              onClick={() => setTextTarget(null)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 440, damping: 36 }}
              className="absolute left-0 right-0 bottom-0 z-30"
              style={{
                borderRadius: "20px 20px 0 0",
                background: "rgba(12,12,18,0.99)",
                backdropFilter: "blur(40px)",
                border: "0.5px solid rgba(255,255,255,0.09)",
                borderBottom: "none",
              }}
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-7 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
              </div>

              <p className="px-5 mb-3 font-semibold" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.09em", color: "rgba(255,255,255,0.3)" }}>
                Quick labels
              </p>

              <div className="flex flex-wrap gap-2 px-4 mb-4">
                {TEXT_PRESETS.map(preset => (
                  <motion.button
                    key={preset}
                    onClick={() => placeText(preset)}
                    whileTap={{ scale: 0.88 }}
                    className="rounded-full px-3.5 py-2"
                    style={{ background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.15)" }}
                  >
                    <span className="font-semibold" style={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>{preset}</span>
                  </motion.button>
                ))}
              </div>

              <div
                className="mx-4 mb-6 flex items-center gap-2 rounded-2xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.11)" }}
              >
                <input
                  value={textVal}
                  onChange={e => setTextVal(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") placeText(textVal); }}
                  placeholder="Custom label…"
                  autoFocus
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", caretColor: activeColor }}
                />
                <AnimatePresence>
                  {textVal.trim().length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.75 }}
                      onClick={() => placeText(textVal)}
                      className="rounded-full px-3 py-1.5"
                      style={{ background: activeColor }}
                    >
                      <span className="text-white font-semibold" style={{ fontSize: 12 }}>Place</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}