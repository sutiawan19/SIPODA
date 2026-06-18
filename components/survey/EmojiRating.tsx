"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface EmojiRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

const EMOJIS = [
  { score: 1, emoji: "😞", label: "Sangat Buruk" },
  { score: 2, emoji: "😕", label: "Buruk" },
  { score: 3, emoji: "😐", label: "Cukup" },
  { score: 4, emoji: "😊", label: "Baik" },
  { score: 5, emoji: "🤩", label: "Sangat Baik" },
];

export default function EmojiRating({ value, onChange, readonly = false }: EmojiRatingProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        {EMOJIS.map(({ score, emoji, label }) => (
          <motion.button
            key={score}
            type="button"
            disabled={readonly}
            whileHover={!readonly ? { scale: 1.25, y: -4 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            onClick={() => !readonly && onChange?.(score)}
            onMouseEnter={() => !readonly && setHovered(score)}
            onMouseLeave={() => !readonly && setHovered(0)}
            title={label}
            className={`relative text-3xl sm:text-4xl transition-all duration-150 rounded-2xl p-2 ${
              readonly ? "cursor-default" : "cursor-pointer"
            } ${
              score === active
                ? "bg-blue-50 ring-2 ring-blue-400 ring-offset-1"
                : score < active
                ? "opacity-60"
                : "opacity-40 hover:opacity-80"
            }`}
            aria-label={`Beri nilai ${score}: ${label}`}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
      {!readonly && active > 0 && (
        <motion.span
          key={active}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-blue-600"
        >
          {EMOJIS[active - 1]?.label}
        </motion.span>
      )}
    </div>
  );
}
