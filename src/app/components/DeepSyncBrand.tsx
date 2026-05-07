"use client";

import { motion } from "framer-motion";
import { TbAtom } from "react-icons/tb";

const DeepSyncBrand = () => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-3 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -9 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30"
      >
        <TbAtom size={42} className="text-blue-400" />
      </motion.div>

      <motion.span
        className="text-4xl sm:text-5xl font-extrabold tracking-tight flex items-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <span className="text-white">Deep</span>
        <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent">
          Sync
        </span>
        <span className="bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          AI
        </span>
      </motion.span>
    </div>
  );
};

export default DeepSyncBrand;
