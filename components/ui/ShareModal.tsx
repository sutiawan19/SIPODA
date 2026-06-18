"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, MessageCircle, Send, Camera } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

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

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      color: "bg-green-50 text-green-600 hover:bg-green-100",
      onClick: undefined
    },
    {
      name: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "bg-blue-50 text-blue-500 hover:bg-blue-100",
      onClick: undefined
    },
    {
      name: "Instagram",
      icon: Camera,
      href: "#",
      color: "bg-pink-50 text-pink-600 hover:bg-pink-100",
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
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-neutral-600 px-2 outline-none"
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
