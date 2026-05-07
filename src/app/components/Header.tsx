"use client";

import React from "react";
import DeepSyncBrand from "./DeepSyncBrand";
import TypewriterText from "./TypewriterText";

const Header = () => {
  return (
    <div className="text-center mb-12 px-2 transition-all duration-100">
      <div className="flex items-center justify-center mb-4">
        <DeepSyncBrand />
      </div>
      <TypewriterText
        text="An intelligent multi-agent research engine that searches, extracts, analyzes, and critiques information to generate deep, structured insights on any topic."
        className="text-blue-300/80 text-lg max-w-2xl mx-auto"
        delay={6000}
        speed={30}
      />
    </div>
  );
};

export default Header;
