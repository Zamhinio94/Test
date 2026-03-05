import { motion } from "motion/react";
import { Link, useParams } from "react-router";
import { 
  ArrowLeft, 
  Filter, 
  Download, 
  Grid3x3,
  List,
  Search,
  Plus,
  Calendar
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PhotoCard } from "../components/PhotoCard";
import { ShareDialog } from "../components/ShareDialog";
import { Badge } from "../components/ui/badge";
import { useState } from "react";

const mockPhotos = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1766595680977-fd4818afa337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwcHJvZ3Jlc3N8ZW58MXx8fHwxNzcxNjU5NDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Foundation Work - East Section",
    location: "Zone A, Kings Cross Development",
    uploadedBy: "Mike Chen",
    timestamp: "Today at 2:45 PM",
    comments: 3,
    views: 12,
    isNew: true,
    viewers: ["Sarah M.", "Tom R."],
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1634586700814-84a73f78d90e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMGZvdW5kYXRpb24lMjB3b3JrfGVufDF8fHx8MTc3MTY4ODY3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Excavation Complete",
    location: "Zone B, Kings Cross Development",
    uploadedBy: "James Park",
    timestamp: "Today at 11:20 AM",
    comments: 5,
    views: 24,
    isNew: true,
    viewers: ["Lisa W."],
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1763647745300-11337df81084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBmcmFtZXxlbnwxfHx8fDE3NzE2ODg2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Steel Frame Progress",
    location: "Main Structure",
    uploadedBy: "Sarah Miller",
    timestamp: "Yesterday at 4:15 PM",
    comments: 8,
    views: 45,
    viewers: [],
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1764856601179-dfeca7b37e4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMHBvdXJpbmclMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzcxNjg4Njc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Concrete Pour - Level 2",
    location: "Floor 2, East Wing",
    uploadedBy: "Tom Rodriguez",
    timestamp: "Yesterday at 9:30 AM",
    comments: 2,
    views: 18,
    viewers: [],
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1600965581129-eef8a214ec9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMGJlYW0lMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzcxNjc0OTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Structural Beams Installation",
    location: "Zone C, West Wing",
    uploadedBy: "Lisa Wong",
    timestamp: "Feb 19 at 3:00 PM",
    comments: 6,
    views: 32,
    viewers: [],
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1673978483427-a26a15670e42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjBoZWxtZXR8ZW58MXx8fHwxNzcxNjE1NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Safety Inspection",
    location: "All Zones",
    uploadedBy: "Mike Chen",
    timestamp: "Feb 19 at 10:15 AM",
    comments: 4,
    views: 28,
    viewers: [],
  },
];

export function PhotoGallery() {
  const { projectId } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Kings Cross Development</h1>
                <p className="text-sm text-gray-600">York Way, London N1</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <div className="size-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live Updates
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                Download All
              </Button>
              <ShareDialog projectName="Kings Cross Development" />
              <Button className="gap-2">
                <Plus className="size-4" />
                Upload Photos
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search photos by location, date, or team member..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Calendar className="size-4" />
              Date Range
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Filters
            </Button>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("list")}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Photo Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Recent Photos</h2>
            <p className="text-sm text-gray-600">142 total photos • 3 new today</p>
          </div>
        </div>

        <motion.div
          layout
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {mockPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <PhotoCard {...photo} />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg">
            Load More Photos
          </Button>
        </div>
      </main>
    </div>
  );
}