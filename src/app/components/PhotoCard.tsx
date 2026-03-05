import { motion } from "motion/react";
import { MapPin, Calendar, User, MessageSquare, Download, Share2, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";

interface PhotoCardProps {
  id: string;
  imageUrl: string;
  title: string;
  location: string;
  uploadedBy: string;
  timestamp: string;
  comments: number;
  views: number;
  isNew?: boolean;
  viewers?: string[];
}

export function PhotoCard({
  imageUrl,
  title,
  location,
  uploadedBy,
  timestamp,
  comments,
  views,
  isNew,
  viewers = [],
}: PhotoCardProps) {
  const [showViewers, setShowViewers] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isNew && (
          <Badge className="absolute top-2 right-2 bg-green-500 text-white">New</Badge>
        )}
        {viewers.length > 0 && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs cursor-pointer"
            onMouseEnter={() => setShowViewers(true)}
            onMouseLeave={() => setShowViewers(false)}
          >
            <Eye className="size-3" />
            <span>{viewers.length}</span>
            {showViewers && (
              <div className="absolute top-full left-0 mt-1 bg-white text-gray-800 p-2 rounded shadow-lg whitespace-nowrap z-10">
                <p className="text-xs font-medium mb-1">Currently viewing:</p>
                {viewers.map((viewer, i) => (
                  <p key={i} className="text-xs">{viewer}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2">{title}</h3>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="size-3.5" />
            <span>{uploadedBy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5" />
            <span>{timestamp}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              <span>{comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="size-3.5" />
              <span>{views}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <Download className="size-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <Share2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
