import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, Check, MapPin, ArrowRight, Search, Link2, Mail, Navigation } from "lucide-react";

/* ─── Nominatim types ──────────────────────────────────────────── */

interface NominatimAddress {
  house_number?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  postcode?: string;
  building?: string;
  amenity?: string;
  retail?: string;
}

interface NominatimResult {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address: NominatimAddress;
}

function formatFullAddress(addr: NominatimAddress): string {
  const parts: string[] = [];
  const building = addr.amenity || addr.retail || addr.building;
  const street   = addr.road || "";
  if (building)                           parts.push(building);
  if (addr.house_number && street)        parts.push(`${addr.house_number} ${street}`);
  else if (street)                        parts.push(street);
  const area = addr.suburb || addr.neighbourhood || addr.quarter || addr.village;
  if (area)                               parts.push(area);
  const city = addr.city || addr.town || addr.county;
  if (city)                               parts.push(city);
  if (addr.postcode)                      parts.push(addr.postcode);
  return parts.join(", ");
}

function projectNameFromAddress(addr: NominatimAddress): string {
  const street = addr.road || "";
  if (addr.house_number && street) return `${addr.house_number} ${street}`;
  if (street)                      return street;
  return addr.suburb || addr.neighbourhood || addr.city || addr.town || "";
}

/* ─── Previous clients (recent-first order) ──────────────────── */

const PREV_CLIENTS = [
  "Barratt Homes", "Taylor Wimpey", "Berkeley Group",
  "Persimmon Homes", "Redrow", "Crest Nicholson",
  "Bellway", "Vistry Group", "Countryside Partnerships",
];

/* ─── Team members ────────────────────────────────────────────── */

const TEAM_MEMBERS = [
  { id: "1",  name: "Joe Walsh",    initials: "JW", color: "#3478F6", role: "Site Manager"       },
  { id: "2",  name: "Sam Clarke",   initials: "SC", color: "#6B3FDC", role: "Electrician"         },
  { id: "3",  name: "Mike Peters",  initials: "MP", color: "#1D3D8A", role: "Site Foreman"        },
  { id: "4",  name: "Rachel Hunt",  initials: "RH", color: "#F59E0B", role: "Health & Safety"     },
  { id: "5",  name: "Kate Morgan",  initials: "KM", color: "#FA3E3E", role: "Project Manager"     },
  { id: "6",  name: "Dan Foster",   initials: "DF", color: "#0D9488", role: "Bricklayer"          },
  { id: "7",  name: "Sarah Bell",   initials: "SB", color: "#9B35CC", role: "Quantity Surveyor"   },
  { id: "8",  name: "Tom Nash",     initials: "TN", color: "#0E1F40", role: "Structural Engineer" },
  { id: "9",  name: "Chris Webb",   initials: "CW", color: "#F97316", role: "Carpenter"           },
  { id: "10", name: "Liam Doyle",   initials: "LD", color: "#6366F1", role: "Plumber"             },
];

/* ─── Invite code ─────────────────────────────────────────────── */

function genInviteCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${seg(3)}-${seg(4)}`;
}

/* ─── Exported types ──────────────────────────────────────────── */

export interface NewProjectData {
  name: string;
  client: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  memberIds: string[];
}

interface Props {
  onClose: () => void;
  onCreate: (data: NewProjectData) => void;
}

/* ─── Vertical slide variants ─────────────────────────────────── */

const variants = {
  enter:  (d: number) => ({ y: d * 38, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit:   (d: number) => ({ y: -d * 38, opacity: 0 }),
};

/* ─── Underline input ─────────────────────────────────────────── */

function LineInput({
  value, onChange, onKeyDown, placeholder, inputRef, autoFocus, fontSize = 22,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  autoFocus?: boolean;
  fontSize?: number;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div style={{ position: "relative", paddingBottom: 2 }}>
      <input
        ref={inputRef} value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off" autoCorrect="off" spellCheck={false}
        className="w-full bg-transparent outline-none"
        style={{ fontSize, fontWeight: 500, color: "#111827", caretColor: "#3478F6", padding: "6px 36px 10px 0", lineHeight: 1.2 }}
      />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#F3F4F6" }}>
        <motion.div
          animate={{ scaleX: active ? 1 : 0, backgroundColor: focused ? "#3478F6" : active ? "rgba(52,120,246,0.3)" : "#E5E7EB" }}
          initial={{ scaleX: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          style={{ height: "100%", transformOrigin: "left", borderRadius: 1 }}
        />
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

export function NewProjectSheet({ onClose, onCreate }: Props) {
  const [step, setStep] = useState(1);
  const [dir,  setDir]  = useState(1);

  /* Step 1 — location */
  const [locQuery,      setLocQuery]      = useState("");
  const [locResults,    setLocResults]    = useState<NominatimResult[]>([]);
  const [locSearching,  setLocSearching]  = useState(false);
  const [locConfirmed,  setLocConfirmed]  = useState(false);
  const [locating,      setLocating]      = useState(false);
  const [locError,      setLocError]      = useState("");
  const [coordinates,   setCoordinates]   = useState<{ lat: number; lng: number } | null>(null);
  const [houseNumber,   setHouseNumber]   = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [locDisplay,    setLocDisplay]    = useState("");

  /* Step 2 — name */
  const [name, setName] = useState("");

  /* Step 3 — client */
  const [client, setClient] = useState("");

  /* Step 4 — team */
  const [teamSearch,  setTeamSearch]  = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copied,      setCopied]      = useState(false);
  const inviteCode = useMemo(() => genInviteCode(), []);

  /* Refs */
  const locInputRef  = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const clientRef    = useRef<HTMLInputElement>(null);
  const teamRef      = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 1) setTimeout(() => locInputRef.current?.focus(), 380);
    if (step === 2) setTimeout(() => { nameInputRef.current?.focus(); nameInputRef.current?.select(); }, 380);
    if (step === 3) setTimeout(() => clientRef.current?.focus(), 380);
    if (step === 4) setTimeout(() => teamRef.current?.focus(), 380);
  }, [step]);

  /* Nominatim debounced geocoding search */
  useEffect(() => {
    if (locQuery.trim().length < 3 || locConfirmed) {
      setLocResults([]);
      return;
    }
    setLocSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locQuery)}&countrycodes=gb&format=json&addressdetails=1&limit=6&dedupe=1`,
          { headers: { "User-Agent": "JobPics/1.0 (jobpics.uk)" } }
        );
        const data: NominatimResult[] = await res.json();
        setLocResults(data);
      } catch {
        setLocResults([]);
      } finally {
        setLocSearching(false);
      }
    }, 380);
    return () => clearTimeout(timer);
  }, [locQuery, locConfirmed]);

  useEffect(() => {
    if (step === 1 && locConfirmed) {
      const street = streetAddress.trim() || "";
      if (houseNumber.trim() && street) setName(`${houseNumber.trim()} ${street}`);
      else if (houseNumber.trim())      setName(houseNumber.trim());
      else if (street)                  setName(street);
    }
  }, [houseNumber, streetAddress, step, locConfirmed]);

  const TOTAL = 4;
  const goNext = () => { setDir(1);  setStep(s => s + 1); };
  const goBack = () => { setDir(-1); setStep(s => s - 1); };

  /* Pick a geocoded result */
  const pickResult = (r: NominatimResult) => {
    const formatted = formatFullAddress(r.address);
    setLocQuery(formatted);
    setCoordinates({ lat: parseFloat(r.lat), lng: parseFloat(r.lon) });
    setLocConfirmed(true);
    setLocResults([]);
    setHouseNumber(r.address.house_number ?? "");
    setName(projectNameFromAddress(r.address));
    setStreetAddress(r.address.road ?? "");
    setLocDisplay([r.address.city, r.address.postcode].filter(Boolean).join(" "));
  };

  /* GPS */
  const useMyLocation = () => {
    if (!navigator.geolocation) { setLocError("Geolocation not available on this device"); return; }
    setLocating(true); setLocError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en-GB`,
            { headers: { "User-Agent": "JobPics/1.0 (jobpics.uk)" } }
          );
          const data = await res.json();
          const addr: NominatimAddress = data.address ?? {};
          const formatted = formatFullAddress(addr);
          setLocQuery(formatted);
          setCoordinates({ lat: latitude, lng: longitude });
          setLocConfirmed(true);
          setLocResults([]);
          setHouseNumber(addr.house_number ?? "");
          setName(projectNameFromAddress(addr));
          setStreetAddress(addr.road ?? "");
          setLocDisplay([addr.city, addr.postcode].filter(Boolean).join(" "));
          setLocating(false);
        } catch {
          setLocating(false);
          setLocError("Couldn't resolve address — try typing it below");
        }
      },
      (err) => {
        setLocating(false);
        setLocError(err.code === 1 ? "Location access denied — please type address below" : "Couldn't get location — try typing it below");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  /* Team */
  const filteredTeam = teamSearch.trim()
    ? TEAM_MEMBERS.filter(m =>
        m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
        m.role.toLowerCase().includes(teamSearch.toLowerCase())
      )
    : TEAM_MEMBERS;
  const toggleMember = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* Share */
  const inviteUrl = `https://jobpics.uk/join/${inviteCode}`;
  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };
  const shareWhatsApp = () => {
    const text = encodeURIComponent(`You've been invited to join "${name || "a project"}" on JobPics 📸\n\n${inviteUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };
  const shareEmail = () => {
    const subject = encodeURIComponent(`Join ${name || "a project"} on JobPics`);
    const body = encodeURIComponent(`Hi,\n\nYou've been invited to join "${name || "a project"}" on JobPics — the site photo documentation app.\n\nClick to join: ${inviteUrl}\n\nSee you on site!`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  /* Create */
  const doCreate = () => {
    onCreate({
      name:        name.trim() || locQuery.trim(),
      client:      client.trim(),
      location:    locQuery.trim(),
      coordinates: coordinates ?? undefined,
      memberIds:   Array.from(selectedIds),
    });
    onClose();
  };

  /* Client chips */
  const clientChips = client.trim()
    ? PREV_CLIENTS.filter(c => c.toLowerCase().includes(client.toLowerCase()) && c.toLowerCase() !== client.toLowerCase())
    : PREV_CLIENTS;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.28)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="absolute left-0 right-0 bottom-0 z-50 bg-white flex flex-col"
        style={{ borderRadius: "28px 28px 0 0", minHeight: "88%" }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Progress bar — flat brand blue, no gradient ── */}
        <div style={{ height: 3, background: "#F3F4F6", borderRadius: "28px 28px 0 0", overflow: "hidden" }}>
          <motion.div
            animate={{ width: `${(step / TOTAL) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 36 }}
            style={{ height: "100%", background: "#3478F6" }}
          />
        </div>

        {/* ── Nav row ── */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <motion.button
            onClick={step === 1 ? onClose : goBack}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, background: "#F3F4F6" }}
          >
            {step === 1
              ? <X size={14} strokeWidth={2.2} style={{ color: "#6B7280" }} />
              : <ChevronLeft size={16} strokeWidth={2.4} style={{ color: "#6B7280" }} />
            }
          </motion.button>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL }, (_, i) => (
              <motion.div
                key={i}
                animate={{
                  width:      i + 1 === step ? 18 : 6,
                  background: i + 1 <= step ? "#3478F6" : "#E5E7EB",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                style={{ height: 6, borderRadius: 3 }}
              />
            ))}
          </div>

          {/* Invisible spacer to keep dots centred */}
          <div style={{ width: 32 }} />
        </div>

        {/* ── Step content ── */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 420, damping: 38 }}
              className="absolute inset-0 flex flex-col px-6 pt-4 pb-6"
            >

              {/* ══════════════════════════════════════════════
                  STEP 1 — LOCATION
                  ══════════════════════════════════════════════ */}
              {step === 1 && (
                <>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                    Where's the site?
                  </p>
                  <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 6, marginBottom: 18 }}>
                    We'll pin the exact location for every photo
                  </p>

                  {/* ── GPS / locating / confirmed card ── */}
                  <AnimatePresence mode="wait">
                    {locating ? (
                      <motion.div key="locating"
                        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                        className="flex items-center gap-3 rounded-2xl px-4 mb-4"
                        style={{ height: 56, background: "rgba(52,120,246,0.05)", border: "1.5px solid rgba(52,120,246,0.18)" }}
                      >
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          style={{ width: 18, height: 18, border: "2.5px solid rgba(52,120,246,0.2)", borderTopColor: "#3478F6", borderRadius: "50%", flexShrink: 0 }} />
                        <span style={{ fontSize: 15, fontWeight: 600, color: "#3478F6" }}>Finding your exact location…</span>
                      </motion.div>
                    ) : locConfirmed ? (
                      <motion.div key="confirmed"
                        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="rounded-2xl overflow-hidden mb-4"
                        style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}
                      >
                        {/* Confirmed header */}
                        <div className="flex items-center gap-3 px-4 pt-3.5 pb-2.5">
                          <div className="flex items-center justify-center rounded-full flex-shrink-0"
                            style={{ width: 28, height: 28, background: "#DCFCE7" }}>
                            <Check size={13} strokeWidth={3} style={{ color: "#16A34A" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: 11, color: "#86EFAC", fontWeight: 500 }}>Location pinned</p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#15803D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {locDisplay || locQuery}
                            </p>
                          </div>
                          <motion.button whileTap={{ scale: 0.9 }}
                            onClick={() => { setLocConfirmed(false); setLocQuery(""); setCoordinates(null); setHouseNumber(""); setStreetAddress(""); setLocDisplay(""); }}
                            style={{ width: 24, height: 24, borderRadius: "50%", background: "#BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <X size={10} strokeWidth={2.5} style={{ color: "#15803D" }} />
                          </motion.button>
                        </div>

                        {/* Street address row */}
                        <div style={{ height: 1, background: "rgba(134,239,172,0.4)", marginLeft: 16, marginRight: 16 }} />
                        <div className="px-4 pt-2.5 pb-2">
                          <p style={{ fontSize: 10, fontWeight: 600, color: "#86EFAC", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
                            Street address <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span>
                          </p>
                          <input
                            value={streetAddress}
                            onChange={e => setStreetAddress(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                            placeholder="e.g. Victoria Street, Kings Road…"
                            className="w-full bg-transparent outline-none placeholder:opacity-40"
                            style={{ fontSize: 15, fontWeight: 500, color: "#15803D", caretColor: "#16A34A" }}
                            autoComplete="street-address" autoCorrect="off" spellCheck={false}
                          />
                        </div>

                        {/* House / flat number */}
                        <div style={{ height: 1, background: "rgba(134,239,172,0.4)", marginLeft: 16, marginRight: 16 }} />
                        <div className="flex items-center gap-3 px-4 pt-2.5 pb-3.5">
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: 10, fontWeight: 600, color: "#86EFAC", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
                              House / flat no. <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span>
                            </p>
                            <input
                              value={houseNumber}
                              onChange={e => setHouseNumber(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && goNext()}
                              placeholder="e.g. 14, Flat 3B, Unit 7…"
                              className="w-full bg-transparent outline-none placeholder:opacity-40"
                              style={{ fontSize: 15, fontWeight: 500, color: "#15803D", caretColor: "#16A34A" }}
                              autoComplete="off" autoCorrect="off" spellCheck={false}
                            />
                          </div>
                          <motion.button whileTap={{ scale: 0.88 }} onClick={goNext}
                            className="flex items-center justify-center rounded-full flex-shrink-0"
                            style={{ width: 40, height: 40, background: "#3478F6" }}>
                            <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button key="gps"
                        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                        whileTap={{ scale: 0.96 }} onClick={useMyLocation}
                        className="flex items-center gap-3 rounded-2xl px-4 mb-4"
                        style={{ height: 56, background: "rgba(52,120,246,0.05)", border: "1.5px solid rgba(52,120,246,0.18)", textAlign: "left" }}
                      >
                        <div className="flex items-center justify-center rounded-full flex-shrink-0"
                          style={{ width: 34, height: 34, background: "rgba(52,120,246,0.1)" }}>
                          <Navigation size={15} strokeWidth={2} style={{ color: "#3478F6" }} />
                        </div>
                        <div className="flex-1">
                          <p style={{ fontSize: 15, fontWeight: 600, color: "#3478F6" }}>Use my location</p>
                          <p style={{ fontSize: 11, color: "rgba(52,120,246,0.45)" }}>Gets your precise GPS pin</p>
                        </div>
                        <ArrowRight size={15} strokeWidth={2} style={{ color: "rgba(52,120,246,0.35)" }} />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* GPS error */}
                  <AnimatePresence>
                    {locError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ fontSize: 12, color: "#FA3E3E", marginTop: -8, marginBottom: 10 }}>
                        {locError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* "or type" divider */}
                  {!locConfirmed && (
                    <div className="flex items-center gap-3 mb-4">
                      <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                      <span style={{ fontSize: 11, color: "#D1D5DB", fontWeight: 500, letterSpacing: "0.04em" }}>or type an address</span>
                      <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                    </div>
                  )}

                  {/* ── Search input ── */}
                  {!locConfirmed && (
                    <>
                      <div style={{ position: "relative" }}>
                        <LineInput
                          value={locQuery}
                          onChange={v => { setLocQuery(v); setLocConfirmed(false); setCoordinates(null); }}
                          onKeyDown={e => {
                            if (e.key === "Enter" && locResults.length > 0) pickResult(locResults[0]);
                          }}
                          placeholder="Street, postcode or building…"
                          inputRef={locInputRef}
                          fontSize={17}
                        />
                        {locSearching && (
                          <div style={{ position: "absolute", right: 0, top: 10 }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                              style={{ width: 14, height: 14, border: "2px solid #E5E7EB", borderTopColor: "#3478F6", borderRadius: "50%" }} />
                          </div>
                        )}
                      </div>

                      {/* Results dropdown */}
                      <AnimatePresence>
                        {locResults.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.14 }} className="mt-2"
                            style={{ background: "#fff", border: "1.5px solid #F3F4F6", borderRadius: 16, overflow: "hidden" }}>
                            {locResults.map((r, i) => {
                              const primary   = r.address.road || r.address.amenity || r.address.building || r.address.suburb || "";
                              const secondary = [r.address.city || r.address.town, r.address.postcode].filter(Boolean).join(" · ");
                              return (
                                <motion.button key={r.place_id} whileTap={{ backgroundColor: "rgba(52,120,246,0.04)" }}
                                  onClick={() => pickResult(r)} className="w-full flex items-center gap-3 px-4 py-3 text-left"
                                  style={{ borderTop: i > 0 ? "1px solid #F9FAFB" : "none" }}>
                                  <MapPin size={13} strokeWidth={2} style={{ color: "#9CA3AF", flexShrink: 0, marginTop: 1 }} />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {primary || formatFullAddress(r.address).split(",")[0]}
                                    </p>
                                    {secondary && (
                                      <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {secondary}
                                      </p>
                                    )}
                                  </div>
                                  {r.address.postcode && (
                                    <span className="rounded-full px-2 py-0.5 flex-shrink-0"
                                      style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", background: "#F3F4F6" }}>
                                      {r.address.postcode}
                                    </span>
                                  )}
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <p style={{ fontSize: 11, color: "#E5E7EB", marginTop: 10 }}>
                        Powered by OpenStreetMap
                      </p>
                    </>
                  )}

                  <div className="flex-1" />

                  {/* Continue with typed address */}
                  <AnimatePresence>
                    {locQuery.trim().length > 3 && !locConfirmed && locResults.length === 0 && !locSearching && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => {
                          setLocConfirmed(true); setName(locQuery.trim());
                        }} className="w-full rounded-full flex items-center justify-center gap-2"
                          style={{ height: 52, background: "#3478F6" }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Use this address</span>
                          <ArrowRight size={15} color="#fff" strokeWidth={2.2} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* ══════════════════════════════════════════════
                  STEP 2 — PROJECT NAME
                  ══════════════════════════════════════════════ */}
              {step === 2 && (
                <>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                    What's the project name?
                  </p>
                  {locQuery && (
                    <div className="flex items-center gap-1.5 mt-2 mb-1">
                      <MapPin size={11} strokeWidth={2} style={{ color: "#9CA3AF" }} />
                      <span style={{ fontSize: 12, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {locQuery}
                      </span>
                    </div>
                  )}
                  <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: locQuery ? 2 : 6, marginBottom: 18 }}>
                    Auto-filled from the address — edit freely
                  </p>
                  <div>
                    <LineInput
                      value={name} onChange={setName}
                      onKeyDown={e => e.key === "Enter" && name.trim() && goNext()}
                      placeholder="e.g. Block A, Phase 2…"
                      inputRef={nameInputRef}
                      fontSize={22}
                    />
                  </div>
                  <div className="flex-1" />
                  <motion.button whileTap={name.trim() ? { scale: 0.97 } : {}} onClick={() => name.trim() && goNext()}
                    className="w-full rounded-full flex items-center justify-center gap-2"
                    style={{ height: 52, background: "#3478F6", opacity: name.trim() ? 1 : 0.4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Next</span>
                    <ArrowRight size={15} strokeWidth={2.2} color="#fff" />
                  </motion.button>
                </>
              )}

              {/* ══════════════════════════════════════════════
                  STEP 3 — CLIENT
                  ══════════════════════════════════════════════ */}
              {step === 3 && (
                <>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                    Who's the client?
                  </p>
                  <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 6, marginBottom: 18 }}>
                    Required to create the project
                  </p>

                  <div style={{ position: "relative" }}>
                    <LineInput
                      value={client} onChange={setClient}
                      onKeyDown={e => e.key === "Enter" && goNext()}
                      placeholder="Type client name…"
                      inputRef={clientRef}
                      fontSize={20}
                    />
                    <AnimatePresence>
                      {client && (
                        <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
                          whileTap={{ scale: 0.85 }} onClick={() => setClient("")}
                          style={{ position: "absolute", right: 0, top: 10, width: 22, height: 22, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <X size={10} strokeWidth={2.5} style={{ color: "#9CA3AF" }} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Previously used clients */}
                  <AnimatePresence>
                    {clientChips.length > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5">
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#D1D5DB", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                          {client.trim() ? "Suggestions" : "Recent clients"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {clientChips.slice(0, 8).map(c => (
                            <motion.button key={c} whileTap={{ scale: 0.93 }}
                              onClick={() => setClient(c)}
                              className="px-3.5 py-2 rounded-full"
                              style={{
                                background: client === c ? "rgba(52,120,246,0.07)" : "#F9FAFB",
                                border: `1.5px solid ${client === c ? "rgba(52,120,246,0.2)" : "#F3F4F6"}`,
                                fontSize: 13, fontWeight: 500,
                                color: client === c ? "#3478F6" : "#374151",
                              }}>
                              {c}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex-1" />

                  <motion.button whileTap={client.trim() ? { scale: 0.97 } : {}} onClick={() => client.trim() && goNext()}
                    className="w-full rounded-full flex items-center justify-center gap-2"
                    style={{ height: 52, background: "#3478F6", opacity: client.trim() ? 1 : 0.4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Next</span>
                    <ArrowRight size={15} strokeWidth={2.2} color="#fff" />
                  </motion.button>
                </>
              )}

              {/* ══════════════════════════════════════════════
                  STEP 4 — TEAM + SHARE
                  ══════════════════════════════════════════════ */}
              {step === 4 && (
                <>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                    Who's on this job?
                  </p>
                  <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 6, marginBottom: 14 }}>
                    Add people or share an invite link
                  </p>

                  {/* Search bar */}
                  <div className="flex items-center gap-2.5 px-3.5 rounded-2xl mb-2"
                    style={{ background: "#F9FAFB", border: "1.5px solid #F3F4F6", height: 42, flexShrink: 0 }}>
                    <Search size={14} strokeWidth={2} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                    <input ref={teamRef} value={teamSearch} onChange={e => setTeamSearch(e.target.value)}
                      placeholder="Search by name or role…"
                      className="flex-1 bg-transparent outline-none"
                      style={{ fontSize: 14, color: "#111827" }}
                      autoComplete="off" />
                    {teamSearch && (
                      <button onClick={() => setTeamSearch("")}>
                        <X size={13} strokeWidth={2} style={{ color: "#D1D5DB" }} />
                      </button>
                    )}
                  </div>

                  {/* Team list */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{
                        border: "1.5px solid #F3F4F6",
                        background: "#fff",
                        maxHeight: 216,
                        overflowY: "auto",
                        WebkitOverflowScrolling: "touch" as const,
                      }}
                    >
                      {filteredTeam.length === 0 ? (
                        <p style={{ fontSize: 13, color: "#9CA3AF", padding: "14px 16px" }}>No matches</p>
                      ) : filteredTeam.map((member, i) => {
                        const on = selectedIds.has(member.id);
                        return (
                          <motion.button
                            key={member.id}
                            whileTap={{ backgroundColor: "rgba(52,120,246,0.03)" }}
                            onClick={() => toggleMember(member.id)}
                            className="w-full flex items-center gap-3 px-4 text-left"
                            style={{ borderTop: i > 0 ? "1px solid #F9FAFB" : "none", height: 54 }}
                          >
                            <motion.div
                              animate={{ boxShadow: on ? `0 0 0 2px #fff, 0 0 0 3.5px ${member.color}` : "none" }}
                              className="flex items-center justify-center rounded-full flex-shrink-0"
                              style={{ width: 38, height: 38, background: member.color }}
                            >
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{member.initials}</span>
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <p style={{ fontSize: 14, fontWeight: on ? 600 : 500, color: on ? "#3478F6" : "#111827" }}>
                                {member.name}
                              </p>
                              <p style={{ fontSize: 11, color: "#9CA3AF" }}>{member.role}</p>
                            </div>
                            <div className="flex-shrink-0 flex items-center justify-center rounded-full"
                              style={{
                                width: 22, height: 22,
                                background: on ? "#3478F6" : "transparent",
                                border: on ? "none" : "1.5px solid #E5E7EB",
                                transition: "background 0.13s, border 0.13s",
                              }}>
                              <AnimatePresence>
                                {on && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 26 }}>
                                    <Check size={11} strokeWidth={3} color="#fff" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    {/* Scroll-hint fade */}
                    {filteredTeam.length > 4 && (
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0, height: 32,
                        background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.9))",
                        borderRadius: "0 0 16px 16px", pointerEvents: "none",
                      }} />
                    )}
                  </div>

                  {/* Selected count */}
                  <AnimatePresence>
                    {selectedIds.size > 0 && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ fontSize: 12, color: "#3478F6", fontWeight: 600, marginTop: 7, flexShrink: 0 }}>
                        {selectedIds.size} {selectedIds.size === 1 ? "person" : "people"} added
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-4" style={{ flexShrink: 0 }}>
                    <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                    <span style={{ fontSize: 11, color: "#D1D5DB", fontWeight: 500, letterSpacing: "0.04em" }}>
                      or share an invite link
                    </span>
                    <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                  </div>

                  {/* Share options */}
                  <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #F3F4F6", flexShrink: 0 }}>
                    {/* WhatsApp */}
                    <motion.button whileTap={{ backgroundColor: "#F0FDF4" }} onClick={shareWhatsApp}
                      className="w-full flex items-center gap-3 px-4 text-left"
                      style={{ borderBottom: "1px solid #F3F4F6", height: 54 }}>
                      <div className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ width: 34, height: 34, background: "#25D366" }}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.524 5.855L.057 23.882l6.196-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.032-1.384l-.361-.215-3.735.87.936-3.618-.235-.372A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                        </svg>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", flex: 1 }}>Share via WhatsApp</p>
                      <ArrowRight size={14} strokeWidth={2} style={{ color: "#D1D5DB" }} />
                    </motion.button>

                    {/* Copy link */}
                    <motion.button whileTap={{ backgroundColor: "rgba(52,120,246,0.04)" }} onClick={copyLink}
                      className="w-full flex items-center gap-3 px-4 text-left"
                      style={{ borderBottom: "1px solid #F3F4F6", height: 54 }}>
                      <div className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ width: 34, height: 34, background: copied ? "#DCFCE7" : "rgba(52,120,246,0.08)" }}>
                        <AnimatePresence mode="wait">
                          {copied
                            ? <motion.div key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Check size={14} strokeWidth={3} style={{ color: "#16A34A" }} />
                              </motion.div>
                            : <motion.div key="l" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Link2 size={14} strokeWidth={2.2} style={{ color: "#3478F6" }} />
                              </motion.div>
                          }
                        </AnimatePresence>
                      </div>
                      <motion.p animate={{ color: copied ? "#16A34A" : "#111827" }}
                        style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>
                        {copied ? "Link copied!" : "Copy invite link"}
                      </motion.p>
                      <AnimatePresence mode="wait">
                        {copied
                          ? <motion.div key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Check size={14} strokeWidth={2.5} style={{ color: "#16A34A" }} />
                            </motion.div>
                          : <motion.div key="a" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <ArrowRight size={14} strokeWidth={2} style={{ color: "#D1D5DB" }} />
                            </motion.div>
                        }
                      </AnimatePresence>
                    </motion.button>

                    {/* Email */}
                    <motion.button whileTap={{ backgroundColor: "#FAFAFA" }} onClick={shareEmail}
                      className="w-full flex items-center gap-3 px-4 text-left" style={{ height: 54 }}>
                      <div className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ width: 34, height: 34, background: "#F3F4F6" }}>
                        <Mail size={15} strokeWidth={2} style={{ color: "#6B7280" }} />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", flex: 1 }}>Send by email</p>
                      <ArrowRight size={14} strokeWidth={2} style={{ color: "#D1D5DB" }} />
                    </motion.button>
                  </div>

                  <div className="flex-1" />

                  {/* Footer CTA */}
                  <div style={{ flexShrink: 0, paddingTop: 12 }}>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={doCreate}
                      className="w-full rounded-full flex items-center justify-center gap-2"
                      style={{ height: 52, background: "#3478F6" }}>
                      <Check size={15} color="#fff" strokeWidth={2.5} />
                      <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                        Create project{selectedIds.size > 0 ? ` · ${selectedIds.size} added` : ""}
                      </span>
                    </motion.button>
                    <button onClick={doCreate} className="w-full flex items-center justify-center mt-3 active:opacity-50 transition-opacity">
                      <span style={{ fontSize: 13, color: "#D1D5DB", fontWeight: 500 }}>Skip — I'll add people later</span>
                    </button>
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}