import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X, Plane, LogIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/about", label: "About" }, { to: "/ceo-message", label: "CEO Message" },
  { to: "/staff", label: "Crew" }, { to: "/fleet", label: "Fleet" },
  { to: "/routes", label: "Routes" }, { to: "/hubs", label: "Hubs" }, { to: "/ranks", label: "Ranks" }
] as const;
const SESSION_KEY = "aav_crew_session";

export function Navbar() {
  const [open, setOpen] = useState(false), [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const sync = () => setLoggedIn(Boolean(sessionStorage.getItem(SESSION_KEY)));
    sync(); window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const crewPath = loggedIn ? "/crew-center" : "/crew-login";
  return (
    <header className="absolute inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav className="mx-auto flex h-[68px] max-w-6xl items-center gap-3 rounded-2xl border border-border/80 bg-white/95 px-3 shadow-[0_12px_35px_-25px_rgba(23,33,58,.45)] backdrop-blur-xl sm:px-4">
        <Link to="/" onClick={() => setOpen(false)} className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl px-2 py-1.5">
          <img src={logo} alt="Air Astana Virtual" className="h-8 w-auto transition duration-500 group-hover:scale-[1.02] group-hover:opacity-85 sm:h-9" width={288} height={144} />
        </Link>
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex">
          {links.map(link => (
            <Link key={link.to} to={link.to} className="relative rounded-xl px-3 py-2.5 text-[11px] font-extrabold tracking-wide text-muted-foreground transition-all duration-300 hover:bg-slate-100 hover:text-foreground" activeProps={{className:"relative rounded-xl bg-[#17213a] px-3 py-2.5 text-[11px] font-extrabold tracking-wide text-white shadow-lg shadow-[#17213a]/15"}}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link to={crewPath} className="hidden shrink-0 items-center gap-2 rounded-xl bg-[#17213a] px-4 py-2.5 text-[11px] font-extrabold text-white shadow-[0_10px_25px_-12px_#17213a] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#223458] md:inline-flex">
          <LogIn className="size-3.5"/>{loggedIn?"Crew Center":"Crew Login"}<ArrowRight className="size-3.5"/>
        </Link>
        <motion.button type="button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(v => !v)} whileTap={{ scale: 0.92 }} className="ml-auto rounded-xl border border-border bg-white p-2.5 shadow-sm transition-colors hover:bg-slate-50 md:hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={open ? "close" : "menu"} className="block" initial={{opacity:0,rotate:-45,scale:.65}} animate={{opacity:1,rotate:0,scale:1}} exit={{opacity:0,rotate:45,scale:.65}} transition={{duration:.18,ease:[.4,0,.2,1]}}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-8,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-6,scale:.98}} transition={{duration:.22,ease:[.16,1,.3,1]}} className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-border/80 bg-white/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">
            <motion.div className="grid gap-1" initial="hidden" animate="show" variants={{hidden:{},show:{transition:{staggerChildren:.035}}}}>
              {links.map(link => <motion.div key={link.to} variants={{hidden:{opacity:0,y:-5},show:{opacity:1,y:0}}}><Link to={link.to} onClick={()=>setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted" activeProps={{className:"block rounded-xl bg-[#17213a] px-4 py-3 text-sm font-bold text-white"}}>{link.label}</Link></motion.div>)}
            </motion.div>
            <div className="mt-2 grid gap-2">
              <Link to={crewPath} onClick={()=>setOpen(false)} className="flex items-center justify-center gap-2 rounded-xl brand-gradient px-4 py-3 text-sm font-extrabold text-white"><LogIn className="size-4"/>{loggedIn?"Crew Center":"Crew Login"}</Link>
              {!loggedIn&&<Link to="/apply" onClick={()=>setOpen(false)} className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-extrabold"><Plane className="size-4"/>Join the crew</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}