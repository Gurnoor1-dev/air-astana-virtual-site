import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Quote, Sparkles, HeartHandshake, Compass, Plane, ArrowDownRight } from "lucide-react";
import { Section } from "@/components/site/Page";
import heroBg from "@/assets/site/home-hero.jpg";

export const Route = createFileRoute("/ceo-message")({
  head: () => ({
    meta: [
      { title: "Message from the CEO — Air Astana Virtual" },
      { name: "description", content: "A message from Gurnoor1, CEO and Founder of Air Astana Virtual." },
    ],
  }),
  component: CEOMessage,
});

const avatarUrl = "https://sea1.discourse-cdn.com/infiniteflight/user_avatar/community.infiniteflight.com/gurnoor1/144/1653960_2.png";

function CEOMessage() {
  const quoteRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = quoteRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.78;
      const end = window.innerHeight * 0.24;
      const distance = rect.height + start - end;
      setScrollProgress(Math.min(Math.max((start - rect.top) / distance, 0), 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative isolate overflow-hidden bg-background pb-16 text-foreground sm:pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[660px] overflow-hidden bg-[#e8f5f6]">
        <img src={heroBg} alt="" aria-hidden="true" className="h-full w-full object-cover object-center opacity-25 mix-blend-multiply"/>
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f5f6]/50 via-[#e8f5f6]/80 to-background"/>
        <div className="absolute -right-24 -top-36 size-[34rem] rounded-full border border-white/80"/>
        <div className="absolute -right-4 -top-16 size-[25rem] rounded-full border border-white/70"/>
        <div className="absolute -left-24 top-56 size-72 rounded-full bg-[#00a6a6]/10 blur-[90px]"/>
      </div>

      <Section>
        <div className="mx-auto max-w-6xl px-4 pt-28 sm:px-8 sm:pt-36">
          <div className="grid items-end gap-10 pb-12 md:grid-cols-[1fr_auto] md:pb-16">
            <div className="max-w-4xl">
              <div className="kicker"><span className="kicker-dot"/> A note from leadership</div>
              <h1 className="mt-6 max-w-4xl font-display text-[clamp(3.4rem,8vw,7.5rem)] leading-[.96] tracking-[-.065em] text-[#173943]">A shared passion.<br/><span className="italic text-[#008f96]">A wider horizon.</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#496a73] sm:text-lg">Why Air Astana Virtual exists, what we are building together, and the standard of virtual aviation we strive to deliver.</p>
            </div>
            <div className="hidden shrink-0 flex-col items-center gap-3 pb-2 text-[#4f7981] md:flex"><div className="grid size-14 place-items-center rounded-full border border-[#9bcfd1]/70 bg-white/60 backdrop-blur"><ArrowDownRight className="size-5"/></div><span className="text-[10px] font-bold uppercase tracking-[.16em]">The message</span></div>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-12">
            <article className="relative overflow-hidden rounded-[2rem] border border-[#dce9ec] bg-white/90 p-6 shadow-[0_30px_90px_-55px_#17465355] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-10 lg:p-12">
              <div className="absolute right-6 top-5 text-[#00a6a6]/10 sm:right-10 sm:top-8"><Quote className="size-20 sm:size-28"/></div>
              <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-[#e1edef] pb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#e4f5f4] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#087f88]"><span className="size-1.5 rounded-full bg-[#00a6a6]"/> Executive message</div>
                <div className="text-[10px] font-bold uppercase tracking-[.14em] text-[#7b969d]">Air Astana Virtual</div>
              </div>
              <div ref={quoteRef} className="relative mt-8 pl-5 sm:mt-10 sm:pl-8">
                <div className="absolute bottom-0 left-0 top-0 w-px rounded-full bg-[#dce9ec]"/>
                <div className="absolute left-0 top-0 w-[2px] rounded-full bg-gradient-to-b from-[#00a6a6] to-[#83d5d2] shadow-[0_0_12px_#00a6a655] transition-[height] duration-150" style={{height:`${scrollProgress*100}%`}}/>
                <div className="space-y-6 text-[15px] leading-[1.95] text-[#385d66] sm:space-y-7 sm:text-base sm:leading-[2]">
                  <p className="font-semibold text-[#214b57]">Air Astana Virtual started with a straightforward ambition: to build a virtual home for Air Astana inside Infinite Flight and give pilots a reason to return to the network. We want our operations to feel recognisable and considered, while leaving enough room for community flights, events and the spontaneous moments that make virtual aviation enjoyable.</p>
                  <p>For me, a VA is never just a collection of schedules, aircraft and flight records. It is a group of people sharing the same interest. That is why we want Air Astana Virtual to be welcoming to new pilots, respectful toward experienced members and active enough that there is always something worth taking part in. Professional standards matter to us, but so do friendship, curiosity and having fun in the simulator.</p>
                  <p>As we grow, our focus will remain on building a community that is proud of the airline it represents. Every route we publish, every event we organise and every pilot who joins should add something to that bigger picture. The goal is not simply to make flights look realistic; it is to create an experience that people genuinely enjoy being part of.</p>
                </div>
              </div>
              <div className="mt-9 grid gap-3 border-t border-[#e1edef] pt-7 sm:mt-11 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl bg-[#f0f8f8] p-3.5"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[#008f96]"><Sparkles className="size-4"/></span><span className="text-xs font-bold text-[#28545f]">Thoughtful operations</span></div>
                <div className="flex items-center gap-3 rounded-2xl bg-[#f0f8f8] p-3.5"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[#008f96]"><HeartHandshake className="size-4"/></span><span className="text-xs font-bold text-[#28545f]">A welcoming crew</span></div>
                <div className="flex items-center gap-3 rounded-2xl bg-[#f0f8f8] p-3.5"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[#008f96]"><Compass className="size-4"/></span><span className="text-xs font-bold text-[#28545f]">Eurasian spirit</span></div>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-[#e1edef] pt-7 sm:mt-10 sm:pt-8">
                <div className="flex min-w-0 items-center gap-4">
                  <a href="https://community.infiniteflight.com/u/gurnoor1/summary" target="_blank" rel="noreferrer noopener" aria-label="Open Gurnoor1's Infinite Flight Community profile" className="relative size-14 shrink-0 rounded-full bg-gradient-to-br from-[#00a6a6] to-[#bce9e7] p-[2px] transition-transform duration-300 hover:scale-105"><img src={avatarUrl} alt="Gurnoor1" className="size-full rounded-full border-2 border-white object-cover"/></a>
                  <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-display text-2xl text-[#173943]">Gurnoor1</span><span className="rounded-full bg-[#e4f5f4] px-2.5 py-1 text-[10px] font-bold text-[#087f88]">KC001</span></div><div className="mt-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#66828a]">CEO &amp; Founder</div></div>
                </div>
                <a href="https://community.infiniteflight.com/u/gurnoor1/summary" target="_blank" rel="noreferrer noopener" className="group inline-flex items-center gap-2 rounded-full border border-[#dce9ec] bg-white px-4 py-3 text-xs font-bold text-[#28545f] transition hover:border-[#83d5d2] hover:text-[#007f88]">View IFC profile <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></a>
              </div>
            </article>

            <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0a6570] to-[#173943] p-6 text-white shadow-[0_24px_60px_-42px_#17465388] sm:p-7"><div className="absolute -right-12 -top-14 size-40 rounded-full border border-white/15"/><div className="relative"><div className="grid size-11 place-items-center rounded-full bg-white/10 text-[#bce9e7]"><Plane className="size-5"/></div><div className="mt-8 text-[10px] font-bold uppercase tracking-[.17em] text-[#bce9e7]">Our purpose</div><h2 className="mt-3 font-display text-3xl leading-tight">A community that takes flight.</h2><p className="mt-3 text-sm leading-7 text-white/70">A place to fly together, learn together and celebrate the journey.</p></div></div>
              <div className="rounded-[2rem] border border-[#dce9ec] bg-white/85 p-6 sm:p-7"><div className="text-[10px] font-bold uppercase tracking-[.17em] text-[#7b969d]">What guides us</div><div className="mt-5 space-y-4">{[["01","Consistency","Care in every detail."],["02","Community","Every pilot belongs."],["03","Curiosity","Always a new horizon."]].map(([n,title,desc])=><div key={n} className="flex gap-3"><span className="pt-0.5 font-display text-lg italic text-[#00a6a6]">{n}</span><div><div className="text-sm font-bold text-[#214b57]">{title}</div><div className="mt-1 text-xs leading-5 text-[#6b858c]">{desc}</div></div></div>)}</div></div>
            </aside>
          </div>
        </div>
      </Section>
    </main>
  );
}
