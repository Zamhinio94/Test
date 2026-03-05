import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export function ProjectDetails() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Project Details</h1>
        <p className="text-gray-600 mt-2">Project details page coming soon...</p>
      </div>
    </div>
  );
}
