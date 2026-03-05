/**
 * /hero  — clean embed page for Framer (no nav chrome).
 *
 * In Framer, add an Embed component and point it to:
 *   https://your-vercel-url.vercel.app/hero
 *
 * The animation scales to fill whatever width the iframe is given
 * while keeping the 960:600 aspect ratio.
 *
 * Query param: ?size=desktop|tablet|mobile  (default: desktop)
 */
import { useEffect, useRef, useState } from "react";
import { HeroAnimationV2Canvas } from "./HeroAnimationV2";

const NATIVE = { desktop: { w: 960, h: 600 }, tablet: { w: 770, h: 480 }, mobile: { w: 350, h: 220 } } as const;
type SizeKey = keyof typeof NATIVE;

function getSize(): SizeKey {
  const p = new URLSearchParams(window.location.search).get("size") as SizeKey | null;
  return p && p in NATIVE ? p : "desktop";
}

export function HeroEmbed() {
  const [size]  = useState<SizeKey>(getSize);
  const native  = NATIVE[size];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(w / native.w);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [native.w]);

  const scaledH = Math.round(native.h * scale);

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        height: scaledH,
        background: "#050D1F",
        overflow: "hidden",
        // Remove border-radius so Framer can control the frame shape
        borderRadius: 0,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: native.w,
          height: native.h,
        }}
      >
        <HeroAnimationV2Canvas size={size} />
      </div>
    </div>
  );
}
