"use client";

import { Toaster } from "react-hot-toast";

const ToasterMessage = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3700,
        style: {
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(6,182,212,0.22), rgba(99,102,241,0.22))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          color: "rgba(255, 255, 255, 0.94)",
          border: "1px solid rgba(59, 130, 246, 0.45)",
          borderRadius: "14px",
          boxShadow: "0 6px 20px rgba(59, 130, 246, 0.18)",
          fontSize: "14px",
          fontWeight: 500,
        },
      }}
    />
  );
};

export default ToasterMessage;
