import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"loading" | "revealing">("loading");

  // 1. Faster counter logic
  useEffect(() => {
    const duration = 1200; // SPED UP: Takes 1.2 seconds instead of 2
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.floor((currentStep / steps) * 100);
      setProgress(newProgress > 100 ? 100 : newProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        // SPED UP: Only pause for 200ms at 100% before snapping open
        setTimeout(() => setStage("revealing"), 200);
      }
    }, intervalTime);

    // Clean up the interval if the component unmounts early to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  const premiumEase = [0.76, 0, 0.24, 1];

  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">
      {/* ---------------- LEFT PANEL ---------------- */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: stage === "revealing" ? "-100%" : 0 }}
        transition={{ duration: 0.8, ease: premiumEase }} // SPED UP: 0.8s duration
        className="w-1/2 h-full bg-[#E5E5E5] relative"
        // BUG FIX: This guarantees the loader won't get stuck.
        // It tells the parent app to remove the loader the exact moment this panel finishes moving.
        onAnimationComplete={() => {
          if (stage === "revealing") {
            onComplete();
          }
        }}
      />

      {/* ---------------- RIGHT PANEL ---------------- */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: stage === "revealing" ? "100%" : 0 }}
        transition={{ duration: 0.8, ease: premiumEase }} // SPED UP: 0.8s duration
        className="w-1/2 h-full bg-[#E5E5E5] relative"
      />

      {/* ---------------- CENTER CONTENT (Lines & Text) ---------------- */}
      <motion.div
        animate={{ opacity: stage === "revealing" ? 0 : 1 }}
        transition={{ duration: 0.2 }} // SPED UP fade out
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${progress / 2}%` }}
          className="w-[1px] bg-black absolute top-0"
          transition={{ ease: "linear", duration: 0.1 }}
        />

        <div className="bg-[#E5E5E5] px-4 py-2 z-10 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-black">
          {progress}%
        </div>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${progress / 2}%` }}
          className="w-[1px] bg-black absolute bottom-0"
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </motion.div>
    </div>
  );
};

export default Preloader;
