import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, Share2, UserPlus,
  Flame, AlertCircle, CheckCircle2,
  MapPin, Image as ImageIcon,
  MessageSquare, X, Upload,
  CheckCircle, Camera, FlagTriangleRight, AlertTriangle, Send,
  ChevronDown, Link, Eye, FileDown, RotateCcw, QrCode, Copy, Check,
  PencilLine, Tag, ChevronRight,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { StatusBar } from "./StatusBar";
import { PdfFileIcon } from "./PdfFileIcon";
import { InviteTeamSheet } from "./InviteTeamSheet";
import { ProjectShareSheet } from "./ProjectShareSheet";
import { AnnotationCanvas } from "./AnnotationCanvas";
import type { Project } from "./ProjectsScreen";

/* ─── Team data ─────────────────────────────────────────────── */

interface TeamMember {
  id: number;
  name: string;
  role: string;
  initials: string;
  color: string;
  photoCount: number;
  lastActive: string;
}

const TEAM_BY_PROJECT: Record<string, TeamMember[]> = {
  "1": [
    { id: 1, name: "James Walsh",    role: "Site Manager",     initials: "JW", color: "#3478F6", photoCount: 24, lastActive: "Today" },
    { id: 2, name: "Sarah Chen",     role: "Architect",        initials: "SC", color: "#6B3FDC", photoCount: 12, lastActive: "Today" },
    { id: 3, name: "Tom Briggs",     role: "QS",               initials: "TB", color: "#1D3D8A", photoCount: 7,  lastActive: "Yesterday" },
    { id: 4, name: "Emma Patel",     role: "Structural Eng.",  initials: "EP", color: "#9B35CC", photoCount: 4,  lastActive: "3 days ago" },
  ],
  "2": [
    { id: 1, name: "David Okafor",   role: "Project Manager",  initials: "DO", color: "#3478F6", photoCount: 18, lastActive: "Today" },
    { id: 2, name: "Lisa Morrison",  role: "Site Manager",     initials: "LM", color: "#6B3FDC", photoCount: 9,  lastActive: "Today" },
    { id: 3, name: "Ryan Hughes",    role: "Main Contractor",  initials: "RH", color: "#1D3D8A", photoCount: 6,  lastActive: "2 days ago" },
  ],
  "3": [
    { id: 1, name: "Priya Sharma",   role: "Project Director", initials: "PS", color: "#3478F6", photoCount: 11, lastActive: "Today" },
    { id: 2, name: "Ben Cartwright", role: "Site Manager",     initials: "BC", color: "#6B3FDC", photoCount: 8,  lastActive: "Yesterday" },
    { id: 3, name: "Chloe Davies",   role: "QS",               initials: "CD", color: "#1D3D8A", photoCount: 5,  lastActive: "Yesterday" },
    { id: 4, name: "Marcus Webb",    role: "M&E Engineer",     initials: "MW", color: "#9B35CC", photoCount: 3,  lastActive: "4 days ago" },
  ],
};

/* ─── Issues data ───────────────────────────────────────────── */

interface IssueItem {
  id: number;
  priority: "urgent" | "high" | "medium";
  label: string;
  area: string;
  photo?: string;
}

const ISSUES_BY_PROJECT: Record<string, IssueItem[]> = {
  "1": [
    { id: 1, priority: "urgent", label: "Roof drainage gap",    area: "3rd Floor · North",   photo: "https://images.unsplash.com/photo-1591397956797-ae6da1a585dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
    { id: 2, priority: "high",   label: "Exposed conduit",      area: "2nd Floor · East",    photo: "https://images.unsplash.com/photo-1609560553431-650d9cab1a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
  ],
  "2": [
    { id: 1, priority: "high",   label: "Rebar alignment",      area: "Ground slab · B2",    photo: "https://images.unsplash.com/photo-1770119057699-37ec0cce44e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
  ],
  "3": [
    { id: 1, priority: "urgent", label: "Waterproofing breach", area: "Basement · SW corner", photo: "https://images.unsplash.com/photo-1591397956797-ae6da1a585dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
    { id: 2, priority: "medium", label: "Window reveal gap",    area: "1st Floor · West",    photo: "https://images.unsplash.com/photo-1609560553431-650d9cab1a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200" },
  ],
};

const PRIORITY_CONFIG = {
  urgent: { color: "#FA3E3E", bg: "rgba(250,62,62,0.07)",  label: "Urgent", icon: Flame       },
  high:   { color: "#F97316", bg: "rgba(249,115,22,0.07)", label: "High",   icon: AlertCircle },
  medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.07)", label: "Medium", icon: AlertCircle },
};

/* ─── Photo feed data (stages → grouped by day) ─────────────── */

interface PhotoGroup {
  date: string;
  label: string;
  photos: string[];
}

const PHOTO_GROUPS_BY_PROJECT: Record<string, PhotoGroup[]> = {
  "1": [
    {
      date: "Today",
      label: "1st floor frame",
      photos: [
        "https://images.unsplash.com/photo-1679430786992-8bb54d023e2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1646865006914-8d10d8e70f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1625337905408-7b6fe970e187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1726589004565-bedfba94d3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    {
      date: "14 Feb",
      label: "1st fix MEP",
      photos: [
        "https://images.unsplash.com/photo-1609560553431-650d9cab1a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1679430786992-8bb54d023e2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1590889580823-47d5a524c6bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    {
      date: "31 Jan",
      label: "Ground floor slab",
      photos: [
        "https://images.unsplash.com/photo-1646865006914-8d10d8e70f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1759579471231-4e68075ebc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1591397956797-ae6da1a585dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    {
      date: "17 Jan",
      label: "Foundation poured",
      photos: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1625337905408-7b6fe970e187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1726589004565-bedfba94d3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    {
      date: "3 Jan",
      label: "Site clearance",
      photos: [
        "https://images.unsplash.com/photo-1590889580823-47d5a524c6bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1609560553431-650d9cab1a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
  ],
  "2": [
    {
      date: "Today",
      label: "Concrete pour",
      photos: [
        "https://images.unsplash.com/photo-1770625296800-a2a911c7b763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1759579471231-4e68075ebc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1652676306512-3ae85dfb9344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    {
      date: "3 Feb",
      label: "Steel frame",
      photos: [
        "https://images.unsplash.com/photo-1652676306512-3ae85dfb9344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1609560553431-650d9cab1a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1646865006914-8d10d8e70f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1590889580823-47d5a524c6bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    {
      date: "20 Jan",
      label: "Groundworks",
      photos: [
        "https://images.unsplash.com/photo-1759579471231-4e68075ebc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1591397956797-ae6da1a585dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
  ],
  "3": [
    {
      date: "Today",
      label: "External envelope",
      photos: [
        "https://images.unsplash.com/photo-1730651066017-4b98ab60df6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1726589004565-bedfba94d3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1590889580823-47d5a524c6bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1679430786992-8bb54d023e2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    {
      date: "5 Feb",
      label: "RC frame",
      photos: [
        "https://images.unsplash.com/photo-1759579471231-4e68075ebc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1646865006914-8d10d8e70f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1730651066017-4b98ab60df6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    {
      date: "22 Jan",
      label: "Piling works",
      photos: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1759579471231-4e68075ebc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1591397956797-ae6da1a585dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
    {
      date: "8 Jan",
      label: "Demolition",
      photos: [
        "https://images.unsplash.com/photo-1590889580823-47d5a524c6bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "https://images.unsplash.com/photo-1609560553431-650d9cab1a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      ],
    },
  ],
};

/* ─── Fullscreen photo viewer ───────────────────────────────── */

const VIEWER_PRIORITIES = [
  { id: "low",    label: "Low",    color: "#6B7280", bg: "rgba(107,114,128,0.15)" },
  { id: "medium", label: "Medium", color: "#F59E0B", bg: "rgba(245,158,11,0.15)"  },
  { id: "high",   label: "High",   color: "#F97316", bg: "rgba(249,115,22,0.15)"  },
  { id: "urgent", label: "Urgent", color: "#FA3E3E", bg: "rgba(250,62,62,0.15)"   },
];

const VIEWER_LABELS = ["Ground", "First", "Second", "Third", "Structural", "Electrical", "Plumbing", "Safety", "Defect", "Progress"];

function PhotoViewer({ url, onClose }: { url: string; onClose: () => void }) {
  const [description, setDescription] = React.useState("");
  const [editingDesc,  setEditingDesc]  = React.useState(false);
  const [labels,       setLabels]       = React.useState<string[]>([]);
  const [priority,     setPriority]     = React.useState<string | null>(null);
  const [sheet,        setSheet]        = React.useState<"label" | "priority" | "markup" | null>(null);
  const [annotated,    setAnnotated]    = React.useState(false);
  const descRef = React.useRef<HTMLInputElement>(null);

  const priorityCfg = VIEWER_PRIORITIES.find(p => p.id === priority) ?? null;

  const toggleLabel = (l: string) =>
    setLabels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col"
      style={{ background: "#000" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <StatusBar theme="dark" />

      {/* Image fills the entire screen */}
      <div className="absolute inset-0">
        <img src={url} alt="" className="w-full h-full object-cover" />
        {/* top vignette */}
        <div className="absolute inset-x-0 top-0"    style={{ height: 130, background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)" }} />
        {/* bottom vignette — deep so all bottom UI reads clearly */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: 320, background: "linear-gradient(to top, rgba(0,0,0,0.92) 35%, transparent)" }} />
      </div>

      {/* ── Top bar: close + status badges ── */}
      <div className="relative flex items-center px-4 pt-2 pb-2 flex-shrink-0 gap-2">
        <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 36, height: 36, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
          <X size={18} style={{ color: "#fff" }} />
        </motion.button>

        {/* Priority badge — fully solid */}
        {priorityCfg && (
          <motion.div key="priority-badge" initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: priorityCfg.color }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.75)" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{priorityCfg.label}</span>
          </motion.div>
        )}

        {/* Marked up badge — solid blue */}
        {annotated && (
          <motion.div key="annotated-badge" initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: "#3478F6" }}>
            <PencilLine size={11} style={{ color: "#fff" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Marked up</span>
          </motion.div>
        )}
      </div>

      {/* ── Spacer — image shows through here ── */}
      <div className="flex-1" />

      {/* ── Label chips — solid white so they're always legible ── */}
      {labels.length > 0 && (
        <div className="relative flex gap-2 px-4 mb-3 flex-shrink-0 flex-wrap">
          {labels.map(l => (
            <div key={l} className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ background: "#fff" }}>
              <Tag size={11} style={{ color: "#3478F6" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#3478F6" }}>{l}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Description bar — sits directly above the action buttons ── */}
      <div className="relative mx-4 mb-4 flex-shrink-0">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => { setEditingDesc(true); setTimeout(() => descRef.current?.focus(), 60); }}
          className="flex items-center rounded-2xl px-4 gap-3"
          style={{ height: 50, background: "rgba(22,22,30,0.80)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" style={{ flexShrink: 0 }}>
            <rect y="0"  width="16" height="2" rx="1" fill="rgba(255,255,255,0.45)" />
            <rect y="6"  width="12" height="2" rx="1" fill="rgba(255,255,255,0.45)" />
            <rect y="12" width="8"  height="2" rx="1" fill="rgba(255,255,255,0.45)" />
          </svg>
          {editingDesc ? (
            <input
              ref={descRef}
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={() => setEditingDesc(false)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); setEditingDesc(false); } }}
              placeholder="Add a description..."
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: 15, color: description ? "#fff" : "rgba(255,255,255,0.45)", fontWeight: description ? 500 : 400 }}
            />
          ) : (
            <span className="flex-1" style={{ fontSize: 15, color: description ? "#fff" : "rgba(255,255,255,0.42)", fontWeight: description ? 500 : 400 }}>
              {description || "Add a description..."}
            </span>
          )}
          <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
        </motion.div>
      </div>

      {/* ── Action buttons: Mark up · Label · Priority ── */}
      <div className="relative flex justify-center gap-10 pb-10 flex-shrink-0">

        {/* Mark up */}
        <div className="flex flex-col items-center gap-2">
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => setSheet("markup")}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 60, height: 60,
              background: annotated ? "#3478F6" : "rgba(22,22,30,0.80)",
              backdropFilter: "blur(12px)",
              border: annotated ? "none" : "1px solid rgba(255,255,255,0.14)",
            }}>
            <PencilLine size={22} strokeWidth={1.75} style={{ color: "#fff" }} />
          </motion.button>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Mark up</span>
        </div>

        {/* Label */}
        <div className="flex flex-col items-center gap-2">
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => setSheet("label")}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 60, height: 60,
              background: labels.length ? "#3478F6" : "rgba(22,22,30,0.80)",
              backdropFilter: "blur(12px)",
              border: labels.length ? "none" : "1px solid rgba(255,255,255,0.14)",
            }}>
            <Tag size={22} strokeWidth={1.75} style={{ color: "#fff" }} />
          </motion.button>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Label</span>
        </div>

        {/* Priority */}
        <div className="flex flex-col items-center gap-2">
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => setSheet("priority")}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 60, height: 60,
              background: priorityCfg ? priorityCfg.color : "rgba(22,22,30,0.80)",
              backdropFilter: "blur(12px)",
              border: priorityCfg ? "none" : "1px solid rgba(255,255,255,0.14)",
            }}>
            <AlertCircle size={22} strokeWidth={1.75} style={{ color: "#fff" }} />
          </motion.button>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Priority</span>
        </div>

      </div>

      {/* ── Markup canvas ── */}
      <AnimatePresence>
        {sheet === "markup" && (
          <motion.div className="absolute inset-0" style={{ zIndex: 60 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <AnnotationCanvas
              photoUrl={url}
              onDone={() => { setAnnotated(true); setSheet(null); }}
              onCancel={() => setSheet(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Label sheet ── */}
      <AnimatePresence>
        {sheet === "label" && (
          <motion.div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 60, background: "rgba(0,0,0,0.55)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onPointerDown={() => setSheet(null)}>
            <motion.div className="rounded-t-3xl flex flex-col"
              style={{ background: "#1C1C24", paddingBottom: 36 }}
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              onPointerDown={e => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-1">
                <div className="rounded-full" style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)" }} />
              </div>
              <div className="flex items-center justify-between px-5 pt-3 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Add label</p>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => setSheet(null)}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 32, height: 32, background: "rgba(255,255,255,0.08)" }}>
                  <X size={15} strokeWidth={2.5} style={{ color: "rgba(255,255,255,0.6)" }} />
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2.5 px-5 pt-4 pb-2">
                {VIEWER_LABELS.map(l => {
                  const active = labels.includes(l);
                  return (
                    <motion.button key={l} whileTap={{ scale: 0.94 }}
                      onClick={() => toggleLabel(l)}
                      className="flex items-center gap-2 rounded-full px-4 py-2"
                      style={{ background: active ? "#3478F6" : "rgba(255,255,255,0.07)", border: active ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                      {active && <Check size={12} strokeWidth={3} style={{ color: "#fff" }} />}
                      <span style={{ fontSize: 14, fontWeight: 600, color: active ? "#fff" : "rgba(255,255,255,0.7)" }}>{l}</span>
                    </motion.button>
                  );
                })}
              </div>
              <div className="px-5 pt-4">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setSheet(null)}
                  className="w-full flex items-center justify-center rounded-full"
                  style={{ height: 52, background: "#3478F6" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                    {labels.length ? `Apply ${labels.length} label${labels.length > 1 ? "s" : ""}` : "Done"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Priority sheet ── */}
      <AnimatePresence>
        {sheet === "priority" && (
          <motion.div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 60, background: "rgba(0,0,0,0.55)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onPointerDown={() => setSheet(null)}>
            <motion.div className="rounded-t-3xl flex flex-col"
              style={{ background: "#1C1C24", paddingBottom: 36 }}
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              onPointerDown={e => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-1">
                <div className="rounded-full" style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)" }} />
              </div>
              <div className="flex items-center justify-between px-5 pt-3 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Set priority</p>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => setSheet(null)}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 32, height: 32, background: "rgba(255,255,255,0.08)" }}>
                  <X size={15} strokeWidth={2.5} style={{ color: "rgba(255,255,255,0.6)" }} />
                </motion.button>
              </div>
              <div className="flex flex-col gap-2.5 px-5 pt-4">
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => { setPriority(null); setSheet(null); }}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
                  style={{ background: priority === null ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)", border: priority === null ? "1.5px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex-shrink-0 flex items-center justify-center rounded-xl"
                    style={{ width: 40, height: 40, background: "rgba(255,255,255,0.06)" }}>
                    <X size={16} style={{ color: "rgba(255,255,255,0.38)" }} />
                  </div>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>No priority</span>
                  {priority === null && <Check size={16} strokeWidth={3} style={{ color: "#fff" }} />}
                </motion.button>
                {VIEWER_PRIORITIES.map(p => (
                  <motion.button key={p.id} whileTap={{ scale: 0.97 }}
                    onClick={() => { setPriority(p.id); setSheet(null); }}
                    className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
                    style={{ background: priority === p.id ? p.bg : "rgba(255,255,255,0.04)", border: priority === p.id ? `1.5px solid ${p.color}55` : "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex-shrink-0 flex items-center justify-center rounded-xl"
                      style={{ width: 40, height: 40, background: `${p.color}1A` }}>
                      <AlertCircle size={18} strokeWidth={2} style={{ color: p.color }} />
                    </div>
                    <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: priority === p.id ? p.color : "rgba(255,255,255,0.78)" }}>{p.label}</span>
                    {priority === p.id && <Check size={16} strokeWidth={3} style={{ color: p.color }} />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Complete Project sheet ─────────────────────────────────── */

function CompleteProjectSheet({ projectName, onClose, onConfirm }: {
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div className="absolute inset-0 z-40 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.45)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onPointerDown={onClose}>

      <motion.div
        className="rounded-t-3xl flex flex-col"
        style={{ background: "#fff", paddingBottom: 36 }}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        onPointerDown={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="rounded-full" style={{ width: 36, height: 4, background: "#E5E7EB" }} />
        </div>

        {/* Icon */}
        <div className="flex justify-center pt-5 pb-4">
          <div className="flex items-center justify-center rounded-2xl"
            style={{ width: 60, height: 60, background: "rgba(13,148,136,0.08)", border: "1.5px solid rgba(13,148,136,0.2)" }}>
            <CheckCircle2 size={26} strokeWidth={1.75} style={{ color: "#0D9488" }} />
          </div>
        </div>

        {/* Copy */}
        <div className="px-6 pb-6 text-center">
          <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            Mark project as done?
          </p>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.55 }}>
            <span style={{ fontWeight: 600, color: "#374151" }}>{projectName}</span> will be archived.
            Team members will lose edit access and no new photos or issues can be added.
          </p>
        </div>

        {/* Warning pill */}
        <div className="mx-6 mb-6 flex items-start gap-2.5 rounded-2xl px-4 py-3"
          style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)" }}>
          <AlertTriangle size={14} strokeWidth={2.5} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
            This can be reversed by an admin at any time. Make sure all photos and issues are resolved first.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 px-6">
          <motion.button whileTap={{ scale: 0.97 }} onClick={onConfirm}
            className="w-full flex items-center justify-center gap-2 rounded-full"
            style={{ height: 52, background: "#0D9488" }}>
            <CheckCircle2 size={15} strokeWidth={2.5} style={{ color: "#fff" }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Mark as complete</span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
            className="w-full flex items-center justify-center rounded-full"
            style={{ height: 52, background: "#F3F4F6" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>Cancel</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Reactivate Project sheet ──────────────────────────────── */

function ReactivateProjectSheet({ projectName, onClose, onConfirm }: {
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div className="absolute inset-0 z-40 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.45)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onPointerDown={onClose}>

      <motion.div
        className="rounded-t-3xl flex flex-col"
        style={{ background: "#fff", paddingBottom: 36 }}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        onPointerDown={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="rounded-full" style={{ width: 36, height: 4, background: "#E5E7EB" }} />
        </div>

        {/* Icon */}
        <div className="flex justify-center pt-5 pb-4">
          <div className="flex items-center justify-center rounded-2xl"
            style={{ width: 60, height: 60, background: "rgba(52,120,246,0.07)", border: "1.5px solid rgba(52,120,246,0.18)" }}>
            <RotateCcw size={24} strokeWidth={1.75} style={{ color: "#3478F6" }} />
          </div>
        </div>

        {/* Copy */}
        <div className="px-6 pb-5 text-center">
          <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            Move back to Live?
          </p>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.55 }}>
            <span style={{ fontWeight: 600, color: "#374151" }}>{projectName}</span> will be reopened.
            Team members will regain edit access and can add new photos and issues.
          </p>
        </div>

        {/* Info pill */}
        <div className="mx-6 mb-6 flex items-start gap-2.5 rounded-2xl px-4 py-3"
          style={{ background: "rgba(52,120,246,0.05)", border: "1px solid rgba(52,120,246,0.15)" }}>
          <CheckCircle2 size={14} strokeWidth={2.5} style={{ color: "#3478F6", flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#1D3D8A", lineHeight: 1.5 }}>
            The project history, photos, and issues will all be fully restored.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 px-6">
          <motion.button whileTap={{ scale: 0.97 }} onClick={onConfirm}
            className="w-full flex items-center justify-center gap-2 rounded-full"
            style={{ height: 52, background: "#3478F6" }}>
            <RotateCcw size={15} strokeWidth={2.5} style={{ color: "#fff" }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Yes, move to Live</span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
            className="w-full flex items-center justify-center rounded-full"
            style={{ height: 52, background: "#F3F4F6" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>Cancel</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Chat data ─────────────────────────────────────────────── */

interface ChatMessage {
  id: number;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  text: string;
  time: string;
  isMe: boolean;
}

const CHAT_BY_PROJECT: Record<string, ChatMessage[]> = {
  "1": [
    { id: 1, authorName: "Sarah Chen",   authorInitials: "SC", authorColor: "#6B3FDC", text: "Morning all — scaffold boards on Level 2 need checking before we pour today",       time: "8:12am", isMe: false },
    { id: 2, authorName: "Tom Briggs",   authorInitials: "TB", authorColor: "#1D3D8A", text: "@Sarah Chen already flagged it, will get eyes on before 9",                       time: "8:19am", isMe: false },
    { id: 3, authorName: "James Walsh",  authorInitials: "JW", authorColor: "#3478F6", text: "Cheers @Tom Briggs — can you also grab photos once it's signed off?",              time: "8:24am", isMe: true  },
    { id: 4, authorName: "Emma Patel",   authorInitials: "EP", authorColor: "#9B35CC", text: "Structural drawings updated — Rev C uploaded to the shared drive",                 time: "9:47am", isMe: false },
    { id: 5, authorName: "Sarah Chen",   authorInitials: "SC", authorColor: "#6B3FDC", text: "@Emma Patel perfect timing, Barratt Homes are coming on site Thursday for a review", time: "9:52am", isMe: false },
    { id: 6, authorName: "James Walsh",  authorInitials: "JW", authorColor: "#3478F6", text: "@Emma Patel @Sarah Chen I'll prep a photo pack for Thursday, can one of you confirm the agenda?", time: "10:03am", isMe: true },
  ],
  "2": [
    { id: 1, authorName: "David Okafor",  authorInitials: "DO", authorColor: "#3478F6", text: "Pour scheduled for 7am tomorrow — all hands on",                            time: "Yesterday", isMe: true  },
    { id: 2, authorName: "Lisa Morrison", authorInitials: "LM", authorColor: "#6B3FDC", text: "Confirmed. @Ryan Hughes can you make sure the pump truck is booked?",         time: "Yesterday", isMe: false },
    { id: 3, authorName: "Ryan Hughes",   authorInitials: "RH", authorColor: "#1D3D8A", text: "Done — booked for 6:45am arrival",                                           time: "Yesterday", isMe: false },
  ],
  "3": [
    { id: 1, authorName: "Priya Sharma",   authorInitials: "PS", authorColor: "#3478F6", text: "Waterproofing issue on the SW corner needs resolving before backfill", time: "2 days ago", isMe: true  },
    { id: 2, authorName: "Ben Cartwright", authorInitials: "BC", authorColor: "#6B3FDC", text: "@Priya Sharma I've raised it as urgent — photos uploaded",              time: "2 days ago", isMe: false },
    { id: 3, authorName: "Marcus Webb",    authorInitials: "MW", authorColor: "#9B35CC", text: "M&E sign-off done on floors 1–3, moving to floor 4 this week",          time: "Yesterday", isMe: false },
  ],
};

/* ─── Render message text with @mention highlights ─────────── */

function renderMentions(text: string, isMe: boolean) {
  const parts = text.split(/(@[A-Z][a-z]+(?: [A-Z][a-z]+)*)/g);
  return parts.map((part, i) =>
    part.startsWith("@")
      ? <span key={i} style={{ fontWeight: 700, color: isMe ? "rgba(255,255,255,0.9)" : "#3478F6" }}>{part}</span>
      : part
  );
}

/* ─── Project Chat sheet ─────────────────────────────────────── */

function ProjectChatSheet({ teamMembers, messages: initialMessages, onClose }: {
  teamMembers: TeamMember[];
  messages: ChatMessage[];
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, []);

  const handleChange = (val: string) => {
    setInput(val);
    const match = val.match(/@(\w*)$/);
    setMentionQuery(match ? match[1].toLowerCase() : null);
  };

  const filteredMembers = mentionQuery !== null
    ? teamMembers.filter(m => m.name.toLowerCase().includes(mentionQuery!))
    : [];

  const insertMention = (name: string) => {
    const updated = input.replace(/@\w*$/, `@${name} `);
    setInput(updated);
    setMentionQuery(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      authorName: "James Walsh",
      authorInitials: "JW",
      authorColor: "#3478F6",
      text: trimmed,
      time: "Now",
      isMe: true,
    }]);
    setInput("");
    setMentionQuery(null);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <motion.div className="absolute inset-0 z-40 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.45)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onPointerDown={onClose}>

      <motion.div className="rounded-t-3xl flex flex-col overflow-hidden"
        style={{ background: "#fff", height: "88%" }}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        onPointerDown={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="rounded-full" style={{ width: 36, height: 4, background: "#E5E7EB" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4 flex-shrink-0"
          style={{ borderBottom: "1px solid #F3F4F6" }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Project chat</p>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
              {teamMembers.length} members · type @ to mention
            </p>
          </div>
          <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
            className="flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, background: "#F3F4F6" }}>
            <X size={15} strokeWidth={2.5} style={{ color: "#6B7280" }} />
          </motion.button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.isMe ? "flex-row-reverse" : ""}`}>
              {!msg.isMe && (
                <div className="flex-shrink-0 self-end flex items-center justify-center rounded-full"
                  style={{ width: 28, height: 28, background: msg.authorColor }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{msg.authorInitials}</span>
                </div>
              )}
              <div className={`flex flex-col gap-1 ${msg.isMe ? "items-end" : "items-start"}`} style={{ maxWidth: "75%" }}>
                {!msg.isMe && (
                  <span style={{ fontSize: 11, color: "#9CA3AF", paddingLeft: 2 }}>{msg.authorName}</span>
                )}
                <div className="rounded-2xl px-3.5 py-2.5" style={{
                  background: msg.isMe ? "#3478F6" : "#F3F4F6",
                  borderBottomRightRadius: msg.isMe ? 4 : 18,
                  borderBottomLeftRadius:  msg.isMe ? 18 : 4,
                }}>
                  <p style={{ fontSize: 14, color: msg.isMe ? "#fff" : "#111827", lineHeight: 1.5 }}>
                    {renderMentions(msg.text, msg.isMe)}
                  </p>
                </div>
                <span style={{ fontSize: 10, color: "#C4C9D4" }}>{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* @mention picker — floats above input */}
        <AnimatePresence>
          {filteredMembers.length > 0 && (
            <motion.div className="flex-shrink-0 mx-4 mb-2 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              style={{ border: "1px solid #E5E7EB", background: "#fff" }}>
              {filteredMembers.map((m, i) => (
                <motion.button key={m.id} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-4 py-2.5"
                  style={{ borderBottom: i < filteredMembers.length - 1 ? "1px solid #F3F4F6" : "none" }}
                  onPointerDown={e => { e.preventDefault(); insertMention(m.name); }}>
                  <div className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ width: 30, height: 30, background: m.color }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{m.initials}</span>
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{m.name}</span>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{m.role}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3"
          style={{ borderTop: "1px solid #F3F4F6" }}>
          <div className="flex-1 flex items-center rounded-full px-4 gap-2"
            style={{ background: "#F3F4F6", minHeight: 44 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => handleChange(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Message… type @ to mention"
              style={{ flex: 1, background: "transparent", outline: "none", fontSize: 14, color: "#111827", paddingTop: 10, paddingBottom: 10 }}
            />
          </div>
          <motion.button whileTap={{ scale: 0.88 }} onClick={send}
            className="flex-shrink-0 flex items-center justify-center rounded-full"
            style={{ width: 44, height: 44, background: input.trim() ? "#3478F6" : "#E5E7EB", transition: "background 0.15s" }}>
            <Send size={16} strokeWidth={2.5} style={{ color: input.trim() ? "#fff" : "#9CA3AF" }} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Share picker sheet ─────────────────────────────────────── */

function SharePickerSheet({ onClose, onCopyLink, onExportPDF, onClientView }: {
  onClose: () => void;
  onCopyLink: () => void;
  onExportPDF: () => void;
  onClientView: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const options: {
    icon: React.ElementType;
    label: string;
    sub: string;
    color: string;
    action: () => void;
    closeAfter: boolean;
  }[] = [
    {
      icon: copied ? CheckCircle : Link,
      label: copied ? "Link copied!" : "Copy jobpics.uk link",
      sub: "Invite to join & upload photos",
      color: copied ? "#16A34A" : "#3478F6",
      action: handleCopy,
      closeAfter: false,
    },
    {
      icon: null,
      label: "Export PDF",
      sub: "Download a full photo report",
      color: "#DC2626",
      action: onExportPDF,
      closeAfter: true,
    },
    {
      icon: Eye,
      label: "Client view",
      sub: "Open a client-facing project page",
      color: "#6B3FDC",
      action: onClientView,
      closeAfter: false,
    },
  ];

  return (
    <motion.div className="absolute inset-0 z-40 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.45)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onPointerDown={onClose}>

      <motion.div
        className="rounded-t-3xl flex flex-col"
        style={{ background: "#fff", paddingBottom: 36 }}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        onPointerDown={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="rounded-full" style={{ width: 36, height: 4, background: "#E5E7EB" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 flex-shrink-0"
          style={{ borderBottom: "1px solid #F3F4F6" }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Share project</p>
          <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
            className="flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, background: "#F3F4F6" }}>
            <X size={15} strokeWidth={2.5} style={{ color: "#6B7280" }} />
          </motion.button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 px-4 pt-4">
          {options.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <motion.button key={i} whileTap={{ scale: 0.97 }}
                onClick={() => { opt.action(); if (opt.closeAfter) onClose(); }}
                className="flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left"
                style={{ background: `${opt.color}0D`, border: `1px solid ${opt.color}20` }}>
                <div className="flex-shrink-0 flex items-center justify-center rounded-xl"
                  style={{ width: 42, height: 42, background: Icon ? `${opt.color}18` : "transparent" }}>
                  {Icon ? <Icon size={18} strokeWidth={2} style={{ color: opt.color }} /> : <PdfFileIcon size={42} />}
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{opt.label}</span>
                  <span style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{opt.sub}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Types ─────────────────────────────────────────────────── */

type Tab = "photos" | "issues" | "team";

interface Props {
  project: Project;
  onBack: () => void;
  onOpenCamera?: () => void;
  onSheetChange?: (open: boolean) => void;
  onComplete?: () => void;
}

/* ─── Main screen ───────────────────────────────────────────── */

export function LiveProjectScreen({ project, onBack, onOpenCamera, onSheetChange, onComplete }: Props) {
  const [resolvedIssues, setResolvedIssues]   = useState<Set<number>>(new Set());
  const [inviteOpen, setInviteOpen]           = useState(false);
  const [shareOpen, setShareOpen]             = useState(false);
  const [sharePickerOpen, setSharePickerOpen] = useState(false);
  const [activeTab, setActiveTab]             = useState<Tab>("photos");
  const [lightboxUrl, setLightboxUrl]         = useState<string | null>(null);
  const [completeOpen, setCompleteOpen]       = useState(false);
  const [reactivateOpen, setReactivateOpen]   = useState(false);
  const [isCompleted, setIsCompleted]         = useState(false);
  const [chatOpen, setChatOpen]               = useState(false);
  const [qrOpen, setQrOpen]                   = useState(false);
  const [linkCopied, setLinkCopied]           = useState(false);

  // Mock: first team member is always the admin (project creator)
  const isAdmin = true;

  const openInvite       = () => { setInviteOpen(true);       onSheetChange?.(true);  };
  const closeInvite      = () => { setInviteOpen(false);      if (!shareOpen && !sharePickerOpen) onSheetChange?.(false); };
  const openShare        = () => { setShareOpen(true);        onSheetChange?.(true);  };
  const closeShare       = () => { setShareOpen(false);       if (!inviteOpen) onSheetChange?.(false); };
  const openSharePicker  = () => { setSharePickerOpen(true);  onSheetChange?.(true);  };
  const closeSharePicker = () => { setSharePickerOpen(false); onSheetChange?.(false); };
  const openPhoto        = (url: string) => { setLightboxUrl(url); onSheetChange?.(true);  };
  const closePhoto       = () => { setLightboxUrl(null); onSheetChange?.(false); };
  const openComplete     = () => { setCompleteOpen(true);     onSheetChange?.(true);  };
  const closeComplete    = () => { setCompleteOpen(false);    onSheetChange?.(false); };
  const confirmComplete    = () => { setIsCompleted(true);  setCompleteOpen(false);   onSheetChange?.(false); setTimeout(() => onComplete?.(), 800); };
  const openReactivate     = () => { setReactivateOpen(true);  onSheetChange?.(true);  };
  const closeReactivate    = () => { setReactivateOpen(false); onSheetChange?.(false); };
  const confirmReactivate  = () => { setIsCompleted(false); setReactivateOpen(false); onSheetChange?.(false); };
  const openChat         = () => { setChatOpen(true);         onSheetChange?.(true);  };
  const closeChat        = () => { setChatOpen(false);        onSheetChange?.(false); };
  const openQr           = () => { setQrOpen(true);           onSheetChange?.(true);  };
  const closeQr          = () => { setQrOpen(false);          onSheetChange?.(false); };
  const joinUrl = `https://jobpics.uk/join/${project.id}`;
  const copyLink = () => {
    navigator.clipboard?.writeText(joinUrl).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const allIssues   = ISSUES_BY_PROJECT[project.id] ?? [];
  const issues      = allIssues.filter(i => !resolvedIssues.has(i.id));
  const photoGroups = PHOTO_GROUPS_BY_PROJECT[project.id] ?? [];
  const teamMembers = TEAM_BY_PROJECT[project.id] ?? [];
  const chatMessages = CHAT_BY_PROJECT[project.id] ?? [];
  const isLive      = project.lastActivityDays === 0;

  const tabs: { id: Tab; label: string; badge?: number; badgeRed?: boolean }[] = [
    { id: "photos", label: "Photos", badge: project.photoCount },
    { id: "issues", label: "Issues", badge: issues.length, badgeRed: issues.length > 0 },
    { id: "team",   label: "Team",   badge: project.memberCount },
  ];

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#F0F5FA" }}>

      {/* ── Header ── */}
      <div className="flex-shrink-0" style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <StatusBar theme="light" />

        {/* Title row — 3-column flex: back button | centred title | mirrored spacer */}
        <div className="flex items-center px-4 pt-3 pb-1">

          {/* Left — fixed width so the mirror spacer on the right keeps the title centred */}
          <motion.button whileTap={{ scale: 0.95 }} onClick={onBack}
            className="flex items-center gap-0.5"
            style={{ width: 80, flexShrink: 0 }}>
            <ChevronLeft size={17} strokeWidth={2.5} style={{ color: "#3478F6" }} />
            <span style={{ fontSize: 15, color: "#3478F6", fontWeight: 500 }}>Home</span>
          </motion.button>

          {/* Centre — flex-1 so it only ever occupies the space between the two fixed sides */}
          <div className="flex-1 flex justify-center overflow-hidden">
            <span style={{ fontSize: 17, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {project.name}
            </span>
          </div>

          {/* Right — QR code join button */}
          <div style={{ width: 80, flexShrink: 0 }} className="flex justify-end">
            <motion.button whileTap={{ scale: 0.9 }} onClick={openQr}
              className="flex items-center justify-center rounded-xl"
              style={{ width: 34, height: 34, background: "#F3F4F6" }}>
              <QrCode size={16} strokeWidth={2} style={{ color: "#374151" }} />
            </motion.button>
          </div>
        </div>

        {/* Meta strip — location · client left, LIVE right */}
        <div className="flex items-center gap-3 px-4 pt-1 pb-5">
          <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
            <MapPin size={13} strokeWidth={2.5} style={{ color: "#3478F6", flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {project.location}
            </span>
            {project.client && (
              <>
                <span style={{ color: "#D1D5DB", flexShrink: 0 }}>·</span>
                <span style={{ fontSize: 13, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 1, minWidth: 0 }}>
                  {project.client}
                </span>
              </>
            )}
          </div>

          {/* Live / inactive indicator — clean, no pill */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="relative flex-shrink-0" style={{ width: 6, height: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: isLive ? "#22C55E" : "#F59E0B" }} />
              {isLive && <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "#22C55E", opacity: 0.45 }} />}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", color: isLive ? "#16A34A" : "#D97706" }}>
              {isLive ? "Live" : `${project.lastActivityDays}d ago`}
            </span>
          </div>
        </div>

        {/* Action strip — 3 pills */}
        <div className="flex gap-2.5 px-4 pb-5">
          {/* Invite — outlined, in line with Chat and Share */}
          <motion.button whileTap={{ scale: 0.96 }} onClick={openInvite}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-white"
            style={{ height: 46, border: "1px solid #E5E7EB" }}>
            <UserPlus size={14} strokeWidth={2.5} color="#3478F6" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3478F6" }}>Invite</span>
          </motion.button>

          {/* Chat — outlined, direct action */}
          <motion.button whileTap={{ scale: 0.96 }} onClick={openChat}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-white"
            style={{ height: 46, border: "1px solid #E5E7EB" }}>
            <MessageSquare size={14} strokeWidth={2} color="#3478F6" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3478F6" }}>Chat</span>
          </motion.button>

          {/* Share ▾ — outlined, grouped outputs picker */}
          <motion.button whileTap={{ scale: 0.96 }} onClick={openSharePicker}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-white"
            style={{ height: 46, border: "1px solid #E5E7EB" }}>
            <Share2 size={14} strokeWidth={2} color="#3478F6" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3478F6" }}>Share</span>
            <ChevronDown size={11} strokeWidth={3} color="rgba(52,120,246,0.5)" style={{ marginLeft: -3 }} />
          </motion.button>


        </div>

        {/* Tab bar */}
        <div className="flex" style={{ borderTop: "1px solid #F3F4F6" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 relative py-3.5">
              <span style={{
                fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? "#0E1F40" : "#9CA3AF",
                transition: "color 0.15s",
              }}>
                {tab.label}
              </span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="rounded-full flex items-center justify-center"
                  style={{
                    minWidth: 20, height: 20, paddingLeft: 5, paddingRight: 5,
                    fontSize: 11, fontWeight: 700,
                    background: tab.badgeRed ? "#FA3E3E" : (activeTab === tab.id ? "#0E1F40" : "#E5E7EB"),
                    color: tab.badgeRed || activeTab === tab.id ? "#fff" : "#6B7280",
                  }}>
                  {tab.badge}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-line" className="absolute bottom-0 left-5 right-5 rounded-full"
                  style={{ height: 2.5, background: "#3478F6" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none", paddingBottom: 100 }}>

        {/* ── PHOTOS TAB (day-grouped feed) ── */}
        {activeTab === "photos" && (
          <div className="px-4 pt-4 flex flex-col gap-5">
            {/* Upload button */}
            <motion.button whileTap={{ scale: 0.97 }} onClick={onOpenCamera}
              className="w-full flex items-center justify-center gap-2 rounded-2xl"
              style={{ height: 48, background: "#fff", border: "1.5px solid #C7D7FD" }}>
              <Upload size={15} strokeWidth={2} style={{ color: "#3478F6" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#3478F6" }}>Upload photos</span>
            </motion.button>

            {photoGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-12 gap-3">
                <div className="flex items-center justify-center rounded-2xl"
                  style={{ width: 56, height: 56, background: "#EEF3FF" }}>
                  <Camera size={24} strokeWidth={1.5} style={{ color: "#F97316" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>No photos yet</span>
                <span style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>
                  Upload your first photo to start documenting this project.
                </span>
              </div>
            ) : (
              photoGroups.map((group, gi) => (
                <div key={gi}>
                  {/* Day header */}
                  <div className="flex items-center gap-2 mb-2.5 px-0.5">
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#0E1F40" }}>{group.date}</p>
                      <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{group.label}</p>
                    </div>
                    <span style={{ fontSize: 11, color: "#C4C9D4", flexShrink: 0 }}>
                      {group.photos.length} photo{group.photos.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {/* Photo grid */}
                  <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
                    {group.photos.map((url, pi) => (
                      <motion.button key={pi} whileTap={{ scale: 0.95 }}
                        onClick={() => openPhoto(url)}
                        className="overflow-hidden"
                        style={{
                          aspectRatio: "1",
                          borderTopLeftRadius:     gi === 0 && pi === 0 ? 16 : 0,
                          borderTopRightRadius:    gi === 0 && pi === 2 ? 16 : 0,
                          borderBottomLeftRadius:  pi === 0 && pi === group.photos.length - 1 ? 16 : 0,
                          borderBottomRightRadius: pi === 2 && pi === group.photos.length - 1 ? 16 : 0,
                        }}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* ── Complete project — bottom of photos, admin only ── */}
            {isAdmin && photoGroups.length > 0 && (
              <div className="mt-2 mb-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1" style={{ height: 1, background: "#F3F4F6" }} />
                  <span style={{ fontSize: 11, color: "#D1D5DB", letterSpacing: "0.04em" }}>ADMIN</span>
                  <div className="flex-1" style={{ height: 1, background: "#F3F4F6" }} />
                </div>

                {isCompleted ? (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={openReactivate}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5"
                    style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.20)" }}>
                    <CheckCircle size={15} strokeWidth={2.5} style={{ color: "#16A34A" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}>Complete · tap to reactivate</span>
                  </motion.button>
                ) : (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={openComplete}
                    className="w-full flex items-center justify-center gap-2 rounded-full py-3.5"
                    style={{ background: "#F0FDFA", border: "1.5px solid rgba(13,148,136,0.28)" }}>
                    <CheckCircle2 size={14} strokeWidth={2.5} style={{ color: "#0D9488" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0D9488" }}>Mark as complete</span>
                  </motion.button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ISSUES TAB ── */}
        {activeTab === "issues" && (
          <div className="p-4">
            {issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-16 gap-3">
                <div className="flex items-center justify-center rounded-2xl"
                  style={{ width: 56, height: 56, background: "#F0FDF4" }}>
                  <CheckCircle size={24} strokeWidth={1.5} style={{ color: "#22C55E" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>No open issues</span>
                <span style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>
                  All issues have been resolved. Nice work.
                </span>
              </div>
            ) : (
              <AnimatePresence>
                <div className="flex flex-col gap-2">
                  {issues.map(issue => {
                    const cfg  = PRIORITY_CONFIG[issue.priority];
                    const Icon = cfg.icon;
                    return (
                      <motion.div key={issue.id} layout
                        exit={{ opacity: 0, x: 32, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 rounded-2xl px-3.5 py-3 bg-white"
                        style={{ border: `1px solid ${cfg.color}22` }}>
                        {issue.photo && (
                          <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 44, height: 44 }}>
                            <img src={issue.photo} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <Icon size={10} strokeWidth={2.5} style={{ color: cfg.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{cfg.label}</span>
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.2 }}>{issue.label}</p>
                          <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{issue.area}</p>
                        </div>
                        <motion.button whileTap={{ scale: 0.88 }}
                          onClick={() => setResolvedIssues(s => new Set([...s, issue.id]))}
                          className="flex-shrink-0 flex items-center justify-center rounded-full"
                          style={{ width: 32, height: 32, background: cfg.bg, border: `1px solid ${cfg.color}33` }}>
                          <CheckCircle2 size={14} strokeWidth={2} style={{ color: cfg.color }} />
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            )}
          </div>
        )}

        {/* ── TEAM TAB ── */}
        {activeTab === "team" && (
          <div className="p-4 flex flex-col gap-3">
            {/* Invite button */}
            <motion.button whileTap={{ scale: 0.97 }} onClick={openInvite}
              className="w-full flex items-center justify-center gap-2 rounded-2xl"
              style={{ height: 48, background: "#fff", border: "1.5px solid #C7D7FD" }}>
              <UserPlus size={15} strokeWidth={2} style={{ color: "#3478F6" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#3478F6" }}>Invite team member</span>
            </motion.button>

            {teamMembers.map(member => (
              <motion.div key={member.id} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 bg-white"
                style={{ border: "1px solid #F3F4F6" }}>
                {/* Avatar */}
                <div className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: 44, height: 44, background: member.color }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>
                    {member.initials}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{member.name}</p>
                  <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{member.role}</p>
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end flex-shrink-0 gap-1">
                  <div className="flex items-center gap-1">
                    <ImageIcon size={10} strokeWidth={2} style={{ color: "#9CA3AF" }} />
                    <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{member.photoCount}</span>
                  </div>
                  <span style={{ fontSize: 10, color: "#C4C9D4" }}>{member.lastActive}</span>
                </div>
              </motion.div>
            ))}

            {/* ── Complete project — admin only, bottom of list ── */}
            {isAdmin && (
              <div className="mt-4">
                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1" style={{ height: 1, background: "#F3F4F6" }} />
                  <span style={{ fontSize: 11, color: "#D1D5DB", letterSpacing: "0.04em" }}>ADMIN</span>
                  <div className="flex-1" style={{ height: 1, background: "#F3F4F6" }} />
                </div>

                {isCompleted ? (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={openReactivate}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5"
                    style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.20)" }}>
                    <CheckCircle size={15} strokeWidth={2.5} style={{ color: "#16A34A" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}>Complete · tap to reactivate</span>
                  </motion.button>
                ) : (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={openComplete}
                    className="w-full flex items-center justify-center gap-2 rounded-full py-3.5"
                    style={{ background: "#F0FDFA", border: "1.5px solid rgba(13,148,136,0.28)" }}>
                    <CheckCircle2 size={14} strokeWidth={2.5} style={{ color: "#0D9488" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0D9488" }}>Mark as complete</span>
                  </motion.button>
                )}
              </div>
            )}
          </div>
        )}


      </div>

      {/* ── Sheets ── */}
      <AnimatePresence>
        {inviteOpen && <InviteTeamSheet projectName={project.name} onClose={closeInvite} />}
      </AnimatePresence>
      <AnimatePresence>
        {shareOpen && <ProjectShareSheet projectName={project.name} onClose={closeShare} />}
      </AnimatePresence>
      <AnimatePresence>
        {sharePickerOpen && (
          <SharePickerSheet
            onClose={closeSharePicker}
            onCopyLink={() => {
              navigator.clipboard?.writeText(`https://jobpics.uk/p/${project.id}`).catch(() => {});
            }}
            onExportPDF={() => {/* mock PDF export */}}
            onClientView={() => {
              closeSharePicker();
              setTimeout(() => openShare(), 260);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {completeOpen && (
          <CompleteProjectSheet
            projectName={project.name}
            onClose={closeComplete}
            onConfirm={confirmComplete}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {reactivateOpen && (
          <ReactivateProjectSheet
            projectName={project.name}
            onClose={closeReactivate}
            onConfirm={confirmReactivate}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {chatOpen && (
          <ProjectChatSheet
            teamMembers={teamMembers}
            messages={chatMessages}
            onClose={closeChat}
          />
        )}
      </AnimatePresence>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxUrl && <PhotoViewer url={lightboxUrl} onClose={closePhoto} />}
      </AnimatePresence>

      {/* ── QR Code join sheet ── */}
      <AnimatePresence>
        {qrOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50" style={{ background: "rgba(0,0,0,0.45)" }}
              onClick={closeQr}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl"
              style={{ paddingBottom: 36 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 rounded-full" style={{ background: "#E5E7EB" }} />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-5">
                <div>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>Join project</p>
                  <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>Scan to join {project.name}</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={closeQr}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "#F3F4F6" }}>
                  <X size={15} strokeWidth={2.5} style={{ color: "#6B7280" }} />
                </motion.button>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center px-6 gap-5">
                <div className="p-4 rounded-2xl" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                  <QRCodeSVG
                    value={joinUrl}
                    size={196}
                    bgColor="#F9FAFB"
                    fgColor="#0E1F40"
                    level="M"
                  />
                </div>

                {/* URL row */}
                <div className="w-full flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{ background: "#F3F4F6" }}>
                  <p className="flex-1 truncate" style={{ fontSize: 12, color: "#6B7280", fontFamily: "monospace" }}>
                    {joinUrl}
                  </p>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={copyLink}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
                    style={{ background: linkCopied ? "#ECFDF5" : "#fff", border: `1px solid ${linkCopied ? "#6EE7B7" : "#E5E7EB"}`, flexShrink: 0 }}>
                    {linkCopied
                      ? <Check size={13} strokeWidth={2.5} style={{ color: "#059669" }} />
                      : <Copy size={13} strokeWidth={2} style={{ color: "#6B7280" }} />}
                    <span style={{ fontSize: 12, fontWeight: 600, color: linkCopied ? "#059669" : "#374151" }}>
                      {linkCopied ? "Copied" : "Copy"}
                    </span>
                  </motion.button>
                </div>

                {/* Info */}
                <p className="text-center" style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
                  Team members who scan this code will be added to<br /><span style={{ fontWeight: 600, color: "#374151" }}>{project.name}</span> immediately
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}