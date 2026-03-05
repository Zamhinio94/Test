import { motion, AnimatePresence } from "motion/react";
import { Upload, MessageSquare, Share2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Activity {
  id: string;
  type: "upload" | "message" | "share";
  user: string;
  team?: string;
  message?: string;
  time: string;
  photoCount?: number;
  images?: string[];
}

interface VisibleActivity extends Activity {
  renderKey: number;
}

const allActivities: Activity[] = [
  {
    id: "1",
    type: "upload",
    user: "Mike Chen",
    team: "Electrical Team",
    time: "Just now",
    photoCount: 4,
    images: [
      "https://images.unsplash.com/photo-1759916569063-8ee7eb32035e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      "https://images.unsplash.com/photo-1649587345666-0f4ad68aa723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      "https://images.unsplash.com/photo-1591588620679-c0351f19fda2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      "https://images.unsplash.com/photo-1769985134083-8b9df05db881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    ],
  },
  {
    id: "2",
    type: "message",
    user: "Sarah M.",
    message: "Hey, can you send me those photos?",
    time: "1 min ago",
  },
  {
    id: "3",
    type: "message",
    user: "Tom R.",
    team: "Site Manager",
    message: "Foundation looks solid - ready for inspection tomorrow?",
    time: "2 min ago",
  },
  {
    id: "4",
    type: "message",
    user: "James P.",
    message: "Yes, all set for 9am 👍",
    time: "2 min ago",
  },
  {
    id: "5",
    type: "upload",
    user: "Lisa Wong",
    team: "Concrete Team",
    time: "5 min ago",
    photoCount: 6,
    images: [
      "https://images.unsplash.com/photo-1659427921734-d4590f1e099f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      "https://images.unsplash.com/photo-1764856601179-dfeca7b37e4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      "https://images.unsplash.com/photo-1758304480989-38ce585ea04d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      "https://images.unsplash.com/photo-1770838772836-6de311c35a91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      "https://images.unsplash.com/photo-1591588620679-c0351f19fda2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      "https://images.unsplash.com/photo-1649587345666-0f4ad68aa723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    ],
  },
  {
    id: "7",
    type: "message",
    user: "Sarah M.",
    team: "Project Lead",
    message: "Great progress today team! Steel frame on schedule",
    time: "10 min ago",
  },
  {
    id: "8",
    type: "share",
    user: "Tom Rodriguez",
    team: "Site Manager",
    time: "12 min ago",
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const avatarColors = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
  "bg-gradient-to-br from-orange-500 to-orange-600",
  "bg-gradient-to-br from-pink-500 to-pink-600",
  "bg-gradient-to-br from-indigo-500 to-indigo-600",
];

const getAvatarColor = (id: string) => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
};

export function ActivityFeed() {
  const [visibleActivities, setVisibleActivities] = useState<VisibleActivity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const renderKeyRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allActivities.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newActivity = allActivities[currentIndex];
    renderKeyRef.current += 1;
    const renderKey = renderKeyRef.current;
    setVisibleActivities((prev) =>
      [{ ...newActivity, renderKey }, ...prev].slice(0, 3)
    );
  }, [currentIndex]);

  return (
    <div className="relative h-[200px] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-violet-50/30 to-transparent rounded-3xl" />

      <div className="relative w-full max-w-md mx-auto mt-3">
        <AnimatePresence mode="popLayout">
          {visibleActivities.map((activity, index) => (
            <motion.div
              key={activity.renderKey}
              layout
              initial={{
                opacity: 0,
                scale: 0.85,
                y: -16,
                rotateX: -15,
                filter: "blur(0px)",
              }}
              animate={{
                opacity: index === 0 ? 1 : Math.max(0, 0.4 - index * 0.2),
                scale: 1 - index * 0.04,
                y: index * 8,
                rotateX: 0,
                filter: index === 0 ? "blur(0px)" : `blur(${index}px)`,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 16,
                filter: "blur(4px)",
                transition: { duration: 0.3 },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.3 },
              }}
              className="absolute inset-x-0"
              style={{
                zIndex: 10 - index,
              }}
            >
              <div
                className={`mx-auto w-full backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                  index === 0
                    ? "bg-white shadow-2xl shadow-blue-100/50 border-blue-100/50"
                    : "bg-white/60 shadow-lg border-gray-100/50"
                }`}
              >
                <div className="px-3.5 py-2.5">
                  <div className="flex items-start gap-2.5">
                    {/* Avatar */}
                    <div
                      className={`size-8 rounded-lg ${getAvatarColor(activity.id)} shadow-md flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-white text-xs font-bold">
                        {getInitials(activity.user)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-bold text-gray-900">
                          {activity.team || activity.user}
                        </p>
                        <span className="text-[10px] font-semibold text-gray-400">
                          {activity.time}
                        </span>
                      </div>

                      {/* Content */}
                      {activity.type === "upload" && (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="size-3.5 rounded bg-blue-100 flex items-center justify-center">
                              <Upload className="size-2 text-blue-600" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-semibold text-gray-700">
                              uploaded {activity.photoCount} photos
                            </span>
                          </div>
                          {activity.images && activity.images.length > 0 && (
                            <div className="flex gap-1">
                              {activity.images.slice(0, 4).map((src, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className="relative flex-1 rounded-md overflow-hidden bg-gray-100"
                                  style={{ aspectRatio: "1 / 1", maxHeight: "44px" }}
                                >
                                  <img
                                    src={src}
                                    alt={`Photo ${imgIndex + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  {imgIndex === 3 && activity.images!.length > 4 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                      <span className="text-white text-[10px] font-bold">
                                        +{activity.images!.length - 4}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {activity.type === "message" && activity.message && (
                        <div className="flex items-start gap-1.5">
                          <div className="size-3.5 rounded bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MessageSquare className="size-2 text-violet-600" strokeWidth={2.5} />
                          </div>
                          <p className="text-[11px] text-gray-700 leading-snug flex-1">
                            {activity.message}
                          </p>
                        </div>
                      )}

                      {activity.type === "share" && (
                        <div className="flex items-center gap-1.5">
                          <div className="size-3.5 rounded bg-green-100 flex items-center justify-center">
                            <Share2 className="size-2 text-green-600" strokeWidth={2.5} />
                          </div>
                          <span className="text-[11px] font-semibold text-gray-700">
                            shared update with client
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}