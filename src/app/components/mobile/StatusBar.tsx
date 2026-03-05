import { Wifi } from "lucide-react";

interface StatusBarProps {
  theme?: "dark" | "light";
}

export function StatusBar({ theme = "light" }: StatusBarProps) {
  const isDark = theme === "dark";
  const color = isDark ? "text-white" : "text-gray-900";

  return (
    <div className={`h-[54px] flex items-end pb-2 px-6 flex-shrink-0 ${color}`}>
      <span className="text-[15px] font-semibold">9:41</span>
      <div className="ml-auto flex items-center gap-1.5">
        {/* Signal bars */}
        <div className="flex items-end gap-[2.5px]">
          {[3, 5, 7, 10].map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-[1px] bg-current"
              style={{ height: h }}
            />
          ))}
        </div>
        {/* WiFi */}
        <Wifi size={13} strokeWidth={1.8} />
        {/* Battery */}
        <div className="flex items-center gap-[1px]">
          <div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center px-[2px]">
            <div
              className="h-[6px] rounded-[1px] bg-current"
              style={{ width: "75%" }}
            />
          </div>
          <div
            className="w-[2px] h-[5px] rounded-r-[1px] bg-current"
            style={{ opacity: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
