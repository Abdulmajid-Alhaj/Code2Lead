// src/components/Chevron.js
import React from "react";

const Chevron = ({ direction = "right", className = "w-20 h-20" }) => {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        transform:
          direction === "left"
            ? "scaleX(-1) scaleY(1)"
            : "scaleX(1) scaleY(-1)",
      }}
    >
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#144D74" />
          <stop offset="60%" stopColor="#470158" />
          <stop offset="100%" stopColor="#470158" />
        </linearGradient>
      </defs>
      <path d="M0 0 L320 256 L0 512 L512 256 Z" fill="url(#grad)" />
    </svg>
  );
};

export default Chevron;
