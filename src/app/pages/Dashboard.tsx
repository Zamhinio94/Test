import { motion } from "motion/react";
import { Link } from "react-router";
import { 
  Camera, 
  Users, 
  FolderOpen, 
  TrendingUp, 
  Plus,
  ChevronRight,
  Building2,
  MapPin
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ActivityFeed } from "../components/ActivityFeed";
import { ShareDialog } from "../components/ShareDialog";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

const projects = [
  {
    id: "1",
    name: "Kings Cross Development",
    location: "York Way, London N1",
    photos: 142,
    lastUpdate: "2 min ago",
    teamMembers: 5,
    status: "active",
    progress: 65,
    recentPhotos: [
      "https://images.unsplash.com/photo-1766595680977-fd4818afa337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwcHJvZ3Jlc3N8ZW58MXx8fHwxNzcxNjU5NDA3fDA&ixlib=rb-4.1.0&q=80&w=400",
      "https://images.unsplash.com/photo-1634586700814-84a73f78d90e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMGZvdW5kYXRpb24lMjB3b3JrfGVufDF8fHx8MTc3MTY4ODY3Nnww&ixlib=rb-4.1.0&q=80&w=400",
      "https://images.unsplash.com/photo-1763647745300-11337df81084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBmcmFtZXxlbnwxfHx8fDE3NzE2ODg2Nzd8MA&ixlib=rb-4.1.0&q=80&w=400",
    ],
  },
  {
    id: "2",
    name: "Manchester Arena Extension",
    location: "Deansgate, Manchester M3",
    photos: 89,
    lastUpdate: "15 min ago",
    teamMembers: 4,
    status: "active",
    progress: 42,
    recentPhotos: [
      "https://images.unsplash.com/photo-1764856601179-dfeca7b37e4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMHBvdXJpbmclMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzcxNjg4Njc3fDA&ixlib=rb-4.1.0&q=80&w=400",
      "https://images.unsplash.com/photo-1600965581129-eef8a214ec9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMGJlYW0lMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzcxNjc0OTc3fDA&ixlib=rb-4.1.0&q=80&w=400",
      "https://images.unsplash.com/photo-1673978483427-a26a15670e42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjBoZWxtZXR8ZW58MXx8fHwxNzcxNjE1NTgyfDA&ixlib=rb-4.1.0&q=80&w=400",
    ],
  },
];

const stats = [
  { label: "Total Photos", value: "1,234", icon: Camera, change: "+12% this week", color: "text-blue-600" },
  { label: "Active Projects", value: "8", icon: FolderOpen, change: "2 updated today", color: "text-green-600" },
  { label: "Team Members", value: "24", icon: Users, change: "8 online now", color: "text-purple-600" },
  { label: "Client Shares", value: "156", icon: TrendingUp, change: "+8 this week", color: "text-orange-600" },
];

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">JobPics</h1>
                <p className="text-sm text-gray-600">Real-time collaboration platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <Avatar className="size-8 border-2 border-white">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">MC</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-8 border-2 border-white">
                    <AvatarFallback className="bg-green-500 text-white text-xs">SM</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-8 border-2 border-white">
                    <AvatarFallback className="bg-purple-500 text-white text-xs">TR</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-8 border-2 border-white">
                    <AvatarFallback className="bg-orange-500 text-white text-xs">+5</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <Button className="gap-2">
                <Plus className="size-4" />
                Upload Photos
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-semibold mb-2">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                        <Icon className="size-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Active Projects</h2>
              <ShareDialog projectName="All Projects">
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronRight className="size-4" />
                  View All
                </Button>
              </ShareDialog>
            </div>

            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-base">{project.name}</CardTitle>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <MapPin className="size-3" />
                          {project.location}
                        </CardDescription>
                      </div>
                      <ShareDialog projectName={project.name}>
                        <Button variant="outline" size="sm" className="gap-2">
                          Share
                        </Button>
                      </ShareDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Recent Photos Preview */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {project.recentPhotos.map((photo, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                        >
                          <img
                            src={photo}
                            alt={`Recent photo ${i + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Project Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-600">
                        <span className="flex items-center gap-1">
                          <Camera className="size-4" />
                          {project.photos} photos
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-4" />
                          {project.teamMembers} members
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Updated {project.lastUpdate}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-blue-600 h-2 rounded-full"
                        />
                      </div>
                    </div>

                    <Link to={`/gallery/${project.id}`}>
                      <Button variant="ghost" className="w-full mt-4 gap-2">
                        View Gallery
                        <ChevronRight className="size-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Real-Time Updates</CardTitle>
                <CardDescription className="text-xs">
                  See what's happening across all projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityFeed />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}