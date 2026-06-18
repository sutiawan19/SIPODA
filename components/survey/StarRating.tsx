"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const LABELS = ["", "Sangat Buruk", "Buruk", "Cukup", "Baik", "Sangat Baik"];

export default function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            whileHover={readonly ? {} : { scale: 1.1 }}
            whileTap={readonly ? {} : { scale: 0.9 }}
            className={`${sizeMap[size]} transition-colors outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-sm ${readonly ? "cursor-default" : "cursor-pointer"}`}
            aria-label={`Beri nilai ${star}`}
          >
            <Star
              strokeWidth={1.5}
              className={`w-full h-full transition-all duration-150 ${
                star <= active
                  ? "fill-neutral-900 text-neutral-900"
                  : "fill-transparent text-neutral-300"
              }`}
            />
          </motion.button>
        ))}
      </div>
      {!readonly && active > 0 && (
        <motion.span 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-neutral-900 mt-1"
        >
          {LABELS[active]}
        </motion.span>
      )}
    </div>
  );
}
