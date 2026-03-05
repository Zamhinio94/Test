import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, MessageSquare, Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  onClose: () => void;
}

function genCode() {
  const c = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const s = (n: number) =>
    Array.from({ length: n }, () => c[Math.floor(Math.random() * c.length)]).join("");
  return `${s(3)}-${s(4)}`;
}

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.524 5.855L.057 23.882l6.196-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.032-1.384l-.361-.215-3.735.87.936-3.618-.235-.372A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  );
}

export function HomeInviteSheet({ onClose }: Props) {
  const inviteCode = useMemo(() => genCode(), []);
  const inviteUrl  = `https://jobpics.uk/join/${inviteCode}`;
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey 👷 Join our team on JobPics — the site photo app.\n\nScan the QR or tap this link:\n${inviteUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareSMS = () => {
    const text = encodeURIComponent(`Join our team on JobPics 📸  ${inviteUrl}`);
    window.open(`sms:?body=${text}`, "_blank");
  };

  const shareEmail = () => {
    const subj = encodeURIComponent("You're invited to join our team on JobPics");
    const body = encodeURIComponent(
      `Hi,\n\nYou've been invited to join our team on JobPics — the site photo documentation app.\n\nClick here to get started:\n${inviteUrl}\n\nSee you on site!`
    );
    window.open(`mailto:?subject=${subj}&body=${body}`, "_blank");
  };

  const rows = [
    {
      id: "wa",
      label: "WhatsApp",
      desc: "Send via WhatsApp",
      iconBg: "#25D366",
      icon: <WaIcon />,
      onClick: shareWhatsApp,
    },
    {
      id: "sms",
      label: "Text message",
      desc: "Open in Messages",
      iconBg: "#007AFF",
      icon: <MessageSquare size={18} strokeWidth={1.8} color="#fff" />,
      onClick: shareSMS,
    },
    {
      id: "email",
      label: "Email",
      desc: "Send to their inbox",
      iconBg: "#6b7280",
      icon: <Mail size={18} strokeWidth={1.8} color="#fff" />,
      onClick: shareEmail,
    },
  ] as const;

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
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        className="absolute left-0 right-0 bottom-0 z-50 bg-white flex flex-col"
        style={{ borderRadius: "28px 28px 0 0", maxHeight: "92%" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "#e5e7eb" }} />
        </div>

        {/* Title block */}
        <div className="px-6 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
                Invite your team
              </p>
              <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>
                Share this link — they'll sign up from their end
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-full px-3 flex-shrink-0"
              style={{ height: 32, background: "#3478F6", marginTop: 2 }}
            >
              <Check size={13} strokeWidth={2.8} color="#fff" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Done</span>
            </motion.button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>

          {/* QR card */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.06 }}
            className="rounded-2xl bg-white flex flex-col items-center"
            style={{ border: "1px solid #E5E7EB", padding: "24px 20px 20px" }}
          >
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.18, type: "spring", stiffness: 320, damping: 22 }}
            >
              <QRCodeSVG value={inviteUrl} size={160} bgColor="#ffffff" fgColor="#0E1F40" level="M" />
            </motion.div>

            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 16, marginBottom: 8 }}>
              Scan to join, or tap the link to copy
            </p>

            {/* Tappable invite URL pill — press to copy */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={copyLink}
              className="flex items-center gap-2 rounded-xl px-4 w-full justify-between"
              style={{ height: 40, background: copied ? "#ecfdf5" : "#EEF2F9", border: `1px solid ${copied ? "#6ee7b7" : "#E5E7EB"}`, transition: "background 0.2s, border-color 0.2s" }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: copied ? "#059669" : "#0E1F40", fontFamily: "monospace", letterSpacing: "0.06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                jobpics.uk/join/{inviteCode}
              </span>
              <AnimatePresence mode="wait">
                {copied
                  ? <motion.div key="chk" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check size={14} strokeWidth={2.5} color="#059669" />
                    </motion.div>
                  : <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Copy size={13} strokeWidth={2} color="#9ca3af" />
                    </motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Share rows */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="rounded-2xl overflow-hidden bg-white"
            style={{ border: "1px solid #f3f4f6" }}
          >
            {rows.map((row, i) => (
              <motion.button
                key={row.id}
                whileTap={{ backgroundColor: "#f8faff" }}
                onClick={row.onClick}
                className="w-full flex items-center gap-3.5 px-4 text-left"
                style={{ height: 58, borderTop: i > 0 ? "1px solid #f9fafb" : "none", background: "white", transition: "background 0.15s" }}
              >
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 36, height: 36, background: row.iconBg }}
                >
                  {row.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
                    {row.label}
                  </p>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                    {row.desc}
                  </p>
                </div>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="flex-shrink-0">
                  <path d="M1 1l5 5-5 5" stroke="#d1d5db" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}