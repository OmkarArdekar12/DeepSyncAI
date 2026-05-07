"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div
      initial={{ display: "none", opacity: 0, y: 16 }}
      animate={{ display: "flex", opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 2 }}
      className="w-full px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm bg-black/70 border-t border-black/70 transition-all duration-100"
    >
      <p className="text-purple-300/70 text-center md:text-left">
        &copy; {new Date().getFullYear()} DeepSyncAI. Created by{" "}
        <a
          href="https://github.com/OmkarArdekar12"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-300/70 hover:text-purple-300 hover:underline transition"
        >
          Omkar Ardekar
        </a>
        .
      </p>
      <div className="flex items-center gap-6">
        <a
          href="https://github.com/OmkarArdekar12"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-blue-300/70 hover:text-blue-300 transition"
        >
          <FaGithub size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/omkarardekar09"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-blue-300/70 hover:text-blue-300 transition"
        >
          <FaLinkedin size={20} />
        </a>
      </div>
    </motion.div>
  );
};

export default Footer;
