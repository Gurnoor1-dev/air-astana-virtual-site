import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/0gsj85hdn")({
  head: () => ({
    meta: [
      { title: "Air Astana Virtual — Operations" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: HiddenOperationsPage,
});

function HiddenOperationsPage() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const script = document.createElement("script");
    script.src = "/0gsj85hdn/hero.js";
    script.async = false;
    document.body.appendChild(script);

    return () => {
      script.remove();
      delete (window as any).AMV;
      delete (window as any).AMV_DATA;
      delete (window as any).AMV_CREW;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#07101f] text-white">
      <section data-hero className="relative min-h-[620px] overflow-hidden">
        <div className="sky__air absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_18%,#f3c96a55,transparent_18%),linear-gradient(180deg,#8fb9d9_0%,#b8d3e1_34%,#f4c98a_67%,#27445e_100%)]" />
          <div className="absolute inset-x-[-10%] bottom-[16%] h-32 rotate-[-3deg] bg-white/25 blur-3xl" />
          <div className="absolute inset-x-[-10%] bottom-[8%] h-20 rotate-[2deg] bg-[#17213a]/35 blur-2xl" />
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(105deg,transparent_0%,transparent_43%,rgba(255,255,255,.55)_43.4%,transparent_44%),linear-gradient(75deg,transparent_0%,transparent_58%,rgba(255,255,255,.35)_58.4%,transparent_59%)]" />
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-[18%] bg-[linear-gradient(105deg,transparent_0%,transparent_76%,#fff8_77%,transparent_79%)]" />
          <div className="absolute inset-y-0 right-0 w-[18%] bg-[linear-gradient(255deg,transparent_0%,transparent_76%,#fff8_77%,transparent_79%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-6xl flex-col items-center justify-center px-6 text-center">
          <div className="text-[10px] font-black uppercase tracking-[.38em] text-white/75">
            Air Astana Virtual · Flight Operations
          </div>
          <div className="mt-7 h-px w-40 bg-white/55" />
          <h1 className="mt-7 text-5xl font-black tracking-[-.07em] sm:text-7xl">
            AIR ASTANA
          </h1>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[.42em] text-white/75">
            Eurasian skies
          </p>
        </div>
      </section>

      <section
        data-hero-log
        hidden
        className="border-y border-white/10 bg-[#f7f8fa] px-4 py-8 text-[#17213a] sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-[10px] font-black uppercase tracking-[.2em] text-[#17213a]/45">
            Flying today
          </div>
          <ul data-hero-legs className="mt-4 grid gap-3 md:grid-cols-3" />
        </div>
      </section>
    </div>
  );
}
