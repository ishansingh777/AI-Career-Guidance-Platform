import { motion } from "framer-motion";

export function Blobs() {
  return (
    <>
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 -right-28 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

