"use client";
import React from "react";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Button component that renders a customizable button element.
 * 
 * @param {ReactNode} children - The content to be displayed inside the button.
 * @param {string} type - The button type, can be "primary" or any other string for default styling.
 * @param {Function} onClick - The callback function to be executed on button click.
 * @param {string} classes - Additional CSS classes to be applied to the button.
 * @param {boolean} showCursor - If true, the button will have a "cursor-none" class applied.
 */

/******  9dc5a90b-e332-4bb3-a500-f42c183fe4bf  *******/const Button = ({ children, type, onClick, classes = "", showCursor = false }) => {
  const baseClasses =
    "text-sm tablet:text-base p-1 laptop:p-2 m-1 laptop:m-2 rounded-lg transition-all duration-300 ease-out first:ml-0 hover:scale-105 active:scale-100 link";

  const isCursorNone = showCursor ? "cursor-none" : "";

  if (type === "primary") {
    return (
      <button
        onClick={onClick}
        type="button"
        className={`${baseClasses} bg-white text-black ${isCursorNone} ${classes}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={`${baseClasses} flex items-center hover:bg-slate-600 text-white ${isCursorNone} ${classes}`}
    >
      {children}
    </button>
  );
};

export default Button;