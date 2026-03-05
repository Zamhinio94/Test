import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Share2, Copy, Check, Mail, Link as LinkIcon, Clock } from "lucide-react";

interface ShareDialogProps {
  projectName: string;
  children?: React.ReactNode;
}

export function ShareDialog({ projectName, children }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [allowDownloads, setAllowDownloads] = useState(false);
  const [expiresIn, setExpiresIn] = useState("never");

  const shareUrl = `https://jobpics.uk/share/${Math.random().toString(36).substring(7)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Share2 className="size-4" />
            Share with Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Progress Update</DialogTitle>
          <p className="text-sm text-gray-600">
            Share {projectName} photos with your client in one click
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Share Link */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
              </Button>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-3 pt-2">
            <Label>Permissions</Label>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="size-4 text-gray-500" />
                <span className="text-sm">Anyone with link can view</span>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Allow comments</span>
              </div>
              <Switch checked={allowComments} onCheckedChange={setAllowComments} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Allow downloads</span>
              </div>
              <Switch checked={allowDownloads} onCheckedChange={setAllowDownloads} />
            </div>
          </div>

          {/* Expiration */}
          <div className="space-y-2 pt-2">
            <Label className="flex items-center gap-2">
              <Clock className="size-4" />
              Link Expiration
            </Label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="never">Never</option>
              <option value="1day">1 day</option>
              <option value="1week">1 week</option>
              <option value="1month">1 month</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 gap-2">
              <Mail className="size-4" />
              Email Link
            </Button>
            <Button className="flex-1 gap-2" onClick={handleCopy}>
              <Copy className="size-4" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <p className="font-medium mb-1">🚀 Instant Updates</p>
          <p className="text-xs">
            Your client will see new photos automatically - no need to send updates manually.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}