import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const SESSION_KEY = "aav_brand_intro_seen";

export function BrandIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "1");
    const timer = window.setTimeout(() => setVisible(false), 3100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="fixed inset-0 z-[999] overflow-hidden bg-[#06101d]" initial={{opacity:1}} exit={{opacity:0,scale:1.015}} transition={{duration:.75,ease:[.4,0,.2,1]}} aria-hidden="true">
          <motion.div className="absolute inset-0" initial={{scale:1.06,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:2.8,ease:"easeOut"}} style={{background:"radial-gradient(circle at 50% 44%, rgba(226,184,90,.16), transparent 22%), radial-gradient(circle at 50% 55%, rgba(51,106,159,.18), transparent 38%), #06101d"}} />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:64px_64px]" />
          <motion.div className="absolute left-1/2 top-1/2 h-px w-[72vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#e2b85a]/70 to-transparent" initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:[0,1,.45]}} transition={{delay:.35,duration:1.7,ease:"easeOut"}} />
          <motion.div className="absolute left-1/2 top-1/2 size-[min(58vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" initial={{scale:.55,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.2,duration:1.4,ease:"easeOut"}} />
          <motion.div className="absolute left-1/2 top-1/2 size-[min(42vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e2b85a]/20" initial={{scale:.7,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.45,duration:1.5,ease:"easeOut"}} />
          <div className="relative flex h-full w-full items-center justify-center px-6">
            <motion.div className="relative flex w-full max-w-md flex-col items-center text-center" initial={{opacity:0,scale:.62,y:14}} animate={{opacity:1,scale:1,y:0}} transition={{delay:.35,duration:1.05,ease:[.16,1,.3,1]}}>
              <motion.div className="absolute -inset-16 rounded-full bg-[#e2b85a]/10 blur-3xl" initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1.15}} transition={{delay:.65,duration:1.2}} />
              <img src={logo} alt="Air Astana Virtual" className="relative h-24 w-auto max-w-[82vw] object-contain drop-shadow-[0_0_40px_rgba(226,184,90,.22)] sm:h-30" width={288} height={144} />
              <motion.div className="mt-7 h-px w-44 bg-gradient-to-r from-transparent via-[#e2b85a] to-transparent" initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:1}} transition={{delay:1.05,duration:.7}} />
              <motion.p className="mt-5 w-full text-center text-[10px] font-extrabold uppercase tracking-[.42em] text-white/65 sm:text-xs" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:1.15,duration:.65}}>From the heart of Eurasia</motion.p>
            </motion.div>
          </div>
          <motion.div className="absolute bottom-8 left-1/2 w-full -translate-x-1/2 px-4 text-center text-[9px] font-bold uppercase tracking-[.28em] text-white/30 sm:tracking-[.35em]" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{delay:1.45,duration:.5}}>Infinite Flight Virtual Airline</motion.div>
          <motion.div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-18deg]" initial={{x:"-20vw",opacity:0}} animate={{x:"420vw",opacity:[0,1,0]}} transition={{delay:1.15,duration:1.1,ease:"easeInOut"}} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}