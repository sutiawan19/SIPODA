"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Download } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "./Button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const WhatsappIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const TelegramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#0088cc" className="text-[#0088cc]" />
    <path d="M5.008 12.18c4.275-1.862 7.126-3.09 8.552-3.682 4.073-1.69 4.92-1.984 5.474-1.995.121-.002.392.028.566.17.147.12.188.283.207.397.019.115.04.348.021.522-.218 2.222-1.163 7.854-1.644 10.457-.204 1.107-.607 1.478-.997 1.515-.845.08-1.488-.557-2.308-1.096-1.282-.84-2.004-1.353-3.249-2.175-1.438-.95-.506-1.47.314-2.316.215-.221 3.948-3.626 4.02-3.935.009-.04.017-.184-.075-.246-.091-.061-.22-.02-.315.002-.134.03-2.274 1.444-6.425 4.246-.607.418-1.158.621-1.65.61-.54-.012-1.58-.306-2.355-.558-1.026-.334-1.84-.51-1.765-1.077.039-.296.347-.601.925-.916z" fill="#fff" />
  </svg>
);

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

export function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstagramShare = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(url);
    alert("Tautan disalin! Buka Instagram dan tempel tautan ini di Story atau Bio Anda.");
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("QRCode-Share");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR_Code_${title.replace(/\s+/g, "_")}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: WhatsappIcon,
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      color: "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20",
      onClick: undefined
    },
    {
      name: "Telegram",
      icon: TelegramIcon,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "bg-[#0088cc]/10 hover:bg-[#0088cc]/20",
      onClick: undefined
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      href: "#",
      color: "bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C]/20",
      onClick: handleInstagramShare
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-950/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Bagikan Hasil</h3>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-neutral-200 mb-4">
                  <QRCode
                    id="QRCode-Share"
                    value={url}
                    size={160}
                    level="Q"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-neutral-500 font-medium text-center">
                    Pindai QR Code ini untuk membuka
                  </p>
                  <Button variant="outline" size="sm" onClick={downloadQRCode} className="mt-1">
                    <Download className="w-4 h-4 mr-2" />
                    Unduh QR
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {shareLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={link.onClick}
                      target={link.onClick ? undefined : "_blank"}
                      rel={link.onClick ? undefined : "noopener noreferrer"}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors gap-2 ${link.color}`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{link.name}</span>
                    </a>
                  );
                })}
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-500 mb-2">Atau salin tautan:</p>
                <div className="flex items-center gap-2 p-2 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-neutral-700 px-2 outline-none"
                  />
                  <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Tersalin" : "Salin"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
