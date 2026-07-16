import React from "react";
import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300" aria-live="polite">
      <span className="text-sm">Typing</span>
      <div className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block h-2.5 w-2.5 rounded-full bg-blue-400/80 dark:bg-blue-300/80"
            initial={{ y: 0, opacity: 0.6 }}
            animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

