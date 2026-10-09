import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const SESSION_KEY = "aav_brand_intro_seen";

export function BrandIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    const timer = window.setTimeout(() => setVisible(false), 3100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[999] overflow-hidden bg-[#06101d]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          {/* Ambient Radial Background & Light Orbs */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.8, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(226,184,90,0.22), transparent 30%), radial-gradient(circle at 50% 50%, rgba(51,106,159,0.25), transparent 50%), #06101d",
            }}
          />

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:64px_64px]" />

          {/* Rotating Celestial / Radar Rings */}
          <motion.div
            className="absolute left-1/2 top-1/2 size-[min(70vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            transition={{
              scale: { duration: 1.4, ease: "easeOut" },
              opacity: { duration: 1 },
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 size-[min(52vw,500px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: -360 }}
            transition={{
              scale: { delay: 0.2, duration: 1.4, ease: "easeOut" },
              opacity: { delay: 0.2, duration: 1 },
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 size-[min(38vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e2b85a]/30"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.5, ease: "easeOut" }}
          />

          {/* Horizontal Flare Line */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-px w-[85vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#e2b85a] to-transparent shadow-[0_0_12px_#e2b85a]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.6] }}
            transition={{ delay: 0.35, duration: 1.6, ease: "easeOut" }}
          />

          {/* Center Brand Group */}
          <div className="relative flex h-full w-full items-center justify-center px-6">
            <motion.div
              className="relative flex w-full max-w-md flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Backlight Ambient Glow */}
              <motion.div
                className="absolute -inset-20 rounded-full bg-white/10 blur-3xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.8, 0.5], scale: [0.5, 1.2, 1] }}
                transition={{ delay: 0.5, duration: 1.8 }}
              />

              {/* ALL WHITE LOGO (brightness-0 invert makes any image pure white) */}
              <motion.img
                src={logo}
                alt="Air Astana Virtual"
                className="relative h-24 w-auto max-w-[82vw] object-contain brightness-0 invert drop-shadow-[0_0_25px_rgba(255,255,255,0.7)] sm:h-30"
                width={288}
                height={144}
                initial={{ filter: "brightness(0) invert(1) drop-shadow(0 0 0px rgba(255,255,255,0))" }}
                animate={{ filter: "brightness(0) invert(1) drop-shadow(0 0 25px rgba(255,255,255,0.75))" }}
                transition={{ delay: 0.6, duration: 1 }}
              />

              {/* Divider Line */}
              <motion.div
                className="mt-7 h-px w-48 bg-gradient-to-r from-transparent via-[#e2b85a] to-transparent shadow-[0_0_8px_#e2b85a]"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />

              {/* Tagline */}
              <motion.p
                className="mt-5 w-full text-center text-[10px] font-extrabold uppercase tracking-[0.45em] text-white/80 sm:text-xs drop-shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.7 }}
              >
                From the heart of Eurasia
              </motion.p>
            </motion.div>
          </div>

          {/* Sub-footer label */}
          <motion.div
            className="absolute bottom-8 left-1/2 w-full -translate-x-1/2 px-4 text-center text-[9px] font-bold uppercase tracking-[0.32em] text-white/40 sm:tracking-[0.4em]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            Infinite Flight Virtual Airline
          </motion.div>

          {/* Cinematic Light Sweep / Flare Pass */}
          <motion.div
            className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] pointer-events-none"
            initial={{ x: "-30vw", opacity: 0 }}
            animate={{ x: "350vw", opacity: [0, 1, 0] }}
            transition={{ delay: 1.0, duration: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
