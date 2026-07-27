import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GlobalSensoryUX = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<"default" | "hover" | "read">("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // No custom cursor on touch devices.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setMousePosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;

      // Opt-in: an element marks itself with data-cursor="read".
      if (target.closest('[data-cursor="read"]')) {
        setCursorState("read");
      }
      else if (target.closest('a') || target.closest('button') || target.closest('.cursor-pointer')) {
        setCursorState("hover");
      }
      else {
        setCursorState("default");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <>
      {/* Hides the native cursor so only ours shows. Gated on `pointer: fine`
          so touch devices keep their normal behaviour. */}
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.04] mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[10000] hidden lg:flex items-center justify-center rounded-full mix-blend-difference bg-white"
          animate={{
            x: mousePosition.x - (cursorState === "read" ? 32 : cursorState === "hover" ? 12 : 8),
            y: mousePosition.y - (cursorState === "read" ? 32 : cursorState === "hover" ? 12 : 8),
            width: cursorState === "read" ? 64 : cursorState === "hover" ? 24 : 16,
            height: cursorState === "read" ? 64 : cursorState === "hover" ? 24 : 16,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
          {cursorState === "read" && (
            <span className="text-[10px] font-bold text-black uppercase tracking-widest">
              Read
            </span>
          )}
        </motion.div>
      )}
    </>
  );
};

export default GlobalSensoryUX;
