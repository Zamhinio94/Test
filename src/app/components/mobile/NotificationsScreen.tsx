import { useState } from "react";
import { AtSign, Camera, Key, Check, X, ChevronLeft, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StatusBar } from "./StatusBar";

type NotifType = "mention" | "upload" | "request" | "safety";

interface Notification {
  id: string;
  type: NotifType;
  user: string;
  initials: string;
  color: string;
  borderHex: string;
  title: string;
  message: string;
  project: string;
  time: string;
  read: boolean;
  thumbnails?: string[];
  requestHandled?: "accepted" | "declined" | null;
  hazardDescription?: string;
  hazardPriority?: "urgent" | "high" | "medium";
  hazardArea?: string;
}

const initialNotifications: Notification[] = [
  {
    id: "0",
    type: "safety",
    user: "Mark T.",
    initials: "MT",
    color: "#FA3E3E",
    borderHex: "#FA3E3E",
    title: "Mark T. flagged a safety hazard",
    message: "Kings Cross Quarter",
    project: "Kings Cross Quarter",
    time: "Just now",
    read: false,
    hazardPriority: "urgent",
    hazardDescription: "Uncovered roof opening on flat roof, 3rd floor north elevation — no edge protection in place",
    hazardArea: "3rd Floor · North Elevation",
    thumbnails: [
      "https://images.unsplash.com/photo-1591397956797-ae6da1a585dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    ],
  },
  {
    id: "1",
    type: "mention",
    user: "Tom R.",
    initials: "TR",
    color: "#F97316",
    borderHex: "#fb923c",
    title: "Tom R. mentioned you",
    message: '"Check the foundation photos, @Jamie"',
    project: "Kings Cross Quarter",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    type: "upload",
    user: "Mike Chen",
    initials: "MC",
    color: "#3478F6",
    borderHex: "#60a5fa",
    title: "Mike Chen added 4 photos",
    message: "Kings Cross Quarter",
    project: "Kings Cross Quarter",
    time: "15m ago",
    read: false,
    thumbnails: [
      "https://images.unsplash.com/photo-1759916569063-8ee7eb32035e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
      "https://images.unsplash.com/photo-1649587345666-0f4ad68aa723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
      "https://images.unsplash.com/photo-1591588620679-c0351f19fda2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
      "https://images.unsplash.com/photo-1659427921734-d4590f1e099f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
    ],
  },
  {
    id: "3",
    type: "request",
    user: "Sarah M.",
    initials: "SM",
    color: "#EC4899",
    borderHex: "#f472b6",
    title: "Sarah M. requested your photos",
    message: "Heritage Park – Plot 12",
    project: "Heritage Park",
    time: "32m ago",
    read: false,
    requestHandled: null,
  },
  {
    id: "4",
    type: "upload",
    user: "Lisa Wong",
    initials: "LW",
    color: "#9B35CC",
    borderHex: "#c084fc",
    title: "Lisa Wong added 6 photos",
    message: "Riverside Quarter",
    project: "Riverside Quarter",
    time: "1h ago",
    read: true,
    thumbnails: [
      "https://images.unsplash.com/photo-1764856601179-dfeca7b37e4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
      "https://images.unsplash.com/photo-1758304480989-38ce585ea04d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
      "https://images.unsplash.com/photo-1770838772836-6de311c35a91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120",
    ],
  },
  {
    id: "5",
    type: "mention",
    user: "James P.",
    initials: "JP",
    color: "#22C55E",
    borderHex: "#4ade80",
    title: "James P. mentioned you",
    message: '"Foundation ready — @Jamie can you sign off?"',
    project: "Phase 2 – Piccadilly",
    time: "3h ago",
    read: true,
  },
];

const iconForType: Record<NotifType, React.ElementType> = {
  mention: AtSign,
  upload: Camera,
  request: Key,
  safety: AlertTriangle,
};

const iconBgForType: Record<NotifType, string> = {
  mention: "bg-blue-50 text-blue-600",
  upload: "bg-amber-50 text-amber-500",
  request: "bg-rose-50 text-rose-500",
  safety: "bg-red-50 text-red-600",
};

interface NotificationsScreenProps {
  onBack?: () => void;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [allRead, setAllRead] = useState(false);

  const markAllRead = () => {
    setNotifications((n) => n.map((item) => ({ ...item, read: true })));
    setAllRead(true);
  };

  const handleRequest = (id: string, action: "accepted" | "declined") => {
    setNotifications((n) =>
      n.map((item) =>
        item.id === id ? { ...item, requestHandled: action, read: true } : item
      )
    );
  };

  const todayIds = ["0", "1", "2", "3", "4"];
  const earlierIds = ["5"];

  const today = notifications.filter((n) => todayIds.includes(n.id));
  const earlier = notifications.filter((n) => earlierIds.includes(n.id));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col h-full" style={{ background: "#F0F5FA" }}>

      {/* Header — StatusBar + title row share the same white bg, no gap */}
      <div style={{ background: "#fff", borderBottom: "1px solid #D8DCE8" }}>
        <StatusBar theme="light" />
        <div className="flex items-center px-4 pt-2 pb-3 flex-shrink-0">

          {/* Left: back */}
          {onBack ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center gap-0.5 flex-shrink-0"
            >
              <ChevronLeft size={17} strokeWidth={2.5} style={{ color: "#3478F6" }} />
              <span style={{ fontSize: 15, color: "#3478F6", fontWeight: 500 }}>Home</span>
            </motion.button>
          ) : (
            <div style={{ width: 72 }} />
          )}

          {/* Centre: title + badge */}
          <div className="flex-1 flex items-center justify-center gap-2">
            <span style={{ fontSize: 16, fontWeight: 700, color: "#0E1F40" }}>Notifications</span>
            {unreadCount > 0 && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#3478F6" }}>
                <span className="text-white text-[10px] font-bold">{unreadCount}</span>
              </div>
            )}
          </div>

          {/* Right: mark all read */}
          <button
            onClick={markAllRead}
            disabled={allRead}
            className={`text-xs font-semibold transition-opacity flex-shrink-0 ${allRead ? "opacity-30" : "opacity-100"}`}
            style={{ color: "#3478F6" }}
          >
            Mark all read
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2" style={{ paddingBottom: 104, paddingTop: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#4E5A7A", textTransform: "uppercase", letterSpacing: "0.08em", paddingBottom: 4 }}>
          Today
        </p>
        <AnimatePresence>
          {today.map((n) => (
            <NotifCard
              key={n.id}
              notif={n}
              onRequest={handleRequest}
            />
          ))}
        </AnimatePresence>

        <p style={{ fontSize: 11, fontWeight: 700, color: "#4E5A7A", textTransform: "uppercase", letterSpacing: "0.08em", paddingBottom: 4, paddingTop: 8 }}>
          Earlier
        </p>
        <AnimatePresence>
          {earlier.map((n) => (
            <NotifCard
              key={n.id}
              notif={n}
              onRequest={handleRequest}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NotifCard({
  notif,
  onRequest,
}: {
  notif: Notification;
  onRequest: (id: string, action: "accepted" | "declined") => void;
}) {
  const Icon = iconForType[notif.type];
  const iconClass = iconBgForType[notif.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: notif.read ? 0.55 : 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: "1px solid #D8DCE8", borderLeft: `3px solid ${notif.borderHex}` }}
    >
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: notif.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{notif.initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className={`w-[18px] h-[18px] rounded-md flex items-center justify-center flex-shrink-0 ${iconClass}`}
                >
                  <Icon size={10} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-gray-900 leading-tight truncate">
                  {notif.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] text-gray-400">{notif.time}</span>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#3478F6" }} />
                )}
              </div>
            </div>

            {/* Message / project */}
            <p className="text-[11px] text-gray-500 leading-snug mb-0.5">
              {notif.type === "mention" ? (
                <span className="italic">{notif.message}</span>
              ) : notif.type === "safety" ? (
                <span className="font-semibold text-gray-600">{notif.message}</span>
              ) : (
                <>
                  {notif.type === "upload" ? "Added to " : "From "}
                  <span className="font-semibold text-gray-600">
                    {notif.message}
                  </span>
                </>
              )}
            </p>

            {/* Safety hazard detail card */}
            {notif.type === "safety" && notif.hazardDescription && (
              <div className="mt-2.5 rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(250,62,62,0.18)", background: "rgba(250,62,62,0.04)" }}>
                {/* Priority badge row */}
                <div className="flex items-center gap-2 px-3 pt-2.5 pb-1.5">
                  <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5"
                    style={{ background: "#FA3E3E" }}>
                    <AlertTriangle size={8} strokeWidth={3} style={{ color: "#fff" }} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {notif.hazardPriority ?? "urgent"}
                    </span>
                  </div>
                  {notif.hazardArea && (
                    <span style={{ fontSize: 10, color: "#6B7280" }}>{notif.hazardArea}</span>
                  )}
                </div>
                {/* Content row */}
                <div className="flex gap-2.5 px-3 pb-2.5">
                  {notif.thumbnails && notif.thumbnails[0] && (
                    <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 52, height: 52 }}>
                      <img src={notif.thumbnails[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.5, flex: 1 }}>
                    {notif.hazardDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Photo thumbnails (non-safety) */}
            {notif.type !== "safety" && notif.thumbnails && notif.thumbnails.length > 0 && (
              <div className="flex gap-1.5 mt-2">
                {notif.thumbnails.slice(0, 4).map((src, i) => (
                  <div
                    key={i}
                    className="relative flex-shrink-0 w-[52px] h-[52px] rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {i === 3 && notif.thumbnails!.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">
                          +{notif.thumbnails!.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Request actions */}
            {notif.type === "request" && (
              <div className="mt-2.5">
                {notif.requestHandled ? (
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 ${
                      notif.requestHandled === "accepted"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {notif.requestHandled === "accepted" ? (
                      <Check size={12} strokeWidth={2.5} />
                    ) : (
                      <X size={12} strokeWidth={2.5} />
                    )}
                    <span className="text-xs font-semibold capitalize">
                      {notif.requestHandled}
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRequest(notif.id, "accepted")}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 active:scale-95 transition-transform"
                      style={{ background: "#EEF2F9", color: "#1D3D8A" }}
                    >
                      <Check size={12} strokeWidth={2.5} />
                      <span className="text-xs font-semibold">Accept</span>
                    </button>
                    <button
                      onClick={() => onRequest(notif.id, "declined")}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-600 rounded-xl py-2 active:scale-95 transition-transform"
                    >
                      <X size={12} strokeWidth={2.5} />
                      <span className="text-xs font-semibold">Decline</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}