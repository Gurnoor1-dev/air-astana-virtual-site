import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Globe2,
  Users2,
  PlaneTakeoff,
  Sparkles,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import { Section } from "@/components/site/Page";
import heroBg from "@/assets/site/home-hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap",
      },
    ],
    meta: [
      { title: "About Us — Air Astana Virtual" },
      {
        name: "description",
        content:
          "Discover the story, purpose and community behind Air Astana Virtual.",
      },
    ],
  }),
  component: About,
});

/* Interactive Scroll Reveal Hook */
function RevealBox({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 cubic-bezier(0.16,1,0.3,1) ${
        visible
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-12 opacity-0 blur-[4px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function About() {
  return (
    <>
      {/* Self-contained Font Import Fallback */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className="font-jakarta relative min-h-screen overflow-hidden bg-background antialiased selection:bg-[#b89358]/20 selection:text-[#b89358]">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-36">
          {/* Background Hero Banner */}
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-[center_top_22%] bg-no-repeat opacity-50 contrast-105 filter transition-all duration-700 sm:opacity-60"
            style={{ backgroundImage: `url(${heroBg})` }}
          />

          {/* Multi-layered Vignette & Soft Gradient Masks */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/50" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

          <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-3xl">
              {/* Pill Eyebrow */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#b89358]/30 bg-background/80 px-4 py-1.5 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b89358] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b89358]" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b89358]">
                  About Air Astana Virtual
                </span>
              </div>

              {/* Display Title with Fluid Kerning */}
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.06] tracking-[-0.035em] text-foreground sm:text-6xl md:text-7xl">
                A virtual airline shaped by the{" "}
                <span className="bg-gradient-to-r from-primary via-[#b89358] to-cyan-500 bg-clip-text text-transparent">
                  people who fly it.
                </span>
              </h1>

              {/* Clean Subtitle */}
              <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-muted-foreground/90 sm:text-xl sm:leading-8">
                An independent Infinite Flight community inspired by Air Astana,
                built around realistic operations, shared flying, and a distinctly
                Eurasian network.
              </p>

              {/* Quick Stat Highlights */}
              <div className="mt-10 flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-4 py-2 text-xs font-semibold text-foreground/80 shadow-sm backdrop-blur-md">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Infinite Flight Community</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-4 py-2 text-xs font-semibold text-foreground/80 shadow-sm backdrop-blur-md">
                  <Navigation className="size-4 text-[#b89358]" />
                  <span>Central Asia &amp; Europe</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AMBIENT GLOW BACKDROPS */}
        <div className="pointer-events-none fixed -left-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-primary/15 blur-[160px] animate-pulse" />
        <div className="pointer-events-none fixed -right-40 top-2/3 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="pointer-events-none fixed left-1/2 bottom-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#b89358]/10 blur-[140px]" />

        <div className="relative z-10">
          {/* SECTION 1: STORY & INTERACTIVE PILLARS */}
          <Section eyebrow="Our Story" title="Welcome to Air Astana Virtual.">
            <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-start">
              {/* Story Paragraphs */}
              <div className="space-y-6">
                <RevealBox delay={0}>
                  <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card/90 via-card/70 to-primary/5 p-7 shadow-xl shadow-primary/[0.03] backdrop-blur-md sm:p-10">
                    <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl" />
                    <p className="text-lg font-medium leading-relaxed text-foreground sm:text-xl sm:leading-9">
                      Air Astana Virtual is a{" "}
                      <span className="font-extrabold text-[#b89358]">
                        community-driven virtual airline
                      </span>{" "}
                      created for Infinite Flight pilots who want more than simply
                      completing a flight. We bring the identity, routes, and
                      atmosphere of Air Astana into the simulator while building a
                      place where pilots from different backgrounds can fly
                      together, learn from one another, and enjoy the hobby at
                      their own pace.
                    </p>
                  </div>
                </RevealBox>

                <RevealBox delay={120}>
                  <div className="rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border sm:p-8">
                    <p className="text-base font-normal leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                      The idea behind the VA is simple: give Air Astana a
                      dedicated presence in the virtual skies while creating an
                      experience that feels organised without becoming difficult
                      to enjoy. Our network begins in Kazakhstan and stretches
                      across Europe, Asia, and the wider Eurasian region, giving
                      every pilot room to discover a new route, aircraft, or
                      destination.
                    </p>
                  </div>
                </RevealBox>

                <RevealBox delay={220}>
                  <div className="rounded-3xl border border-border/70 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border sm:p-8">
                    <p className="text-base font-normal leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                      Whether you are opening Infinite Flight for the first time
                      or already have hundreds of sectors behind you, you can
                      find your own place here. Some pilots come for structured
                      airline operations, others for group flights and community
                      events, and many simply enjoy having a reason to explore the
                      network. Air Astana Virtual is designed to make all of those
                      reasons fit together seamlessly.
                    </p>
                  </div>
                </RevealBox>
              </div>

              {/* Featured Cards */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <RevealBox delay={150}>
                  <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#b89358]/50 hover:shadow-xl hover:shadow-[#b89358]/5">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#b89358]/10 text-[#b89358] transition-transform duration-300 group-hover:scale-110">
                      <Globe2 className="size-6" />
                    </div>
                    <h4 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                      Eurasian Network
                    </h4>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                      Connecting Central Asia to key international hubs across
                      Europe, the Caucasus, and Asia.
                    </p>
                  </div>
                </RevealBox>

                <RevealBox delay={250}>
                  <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 transition-transform duration-300 group-hover:scale-110 dark:text-cyan-400">
                      <Users2 className="size-6" />
                    </div>
                    <h4 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                      Inclusive Community
                    </h4>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                      A welcoming environment for novice aviators and veteran line
                      captains alike.
                    </p>
                  </div>
                </RevealBox>

                <RevealBox delay={350}>
                  <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                      <PlaneTakeoff className="size-6" />
                    </div>
                    <h4 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                      Realistic Operations
                    </h4>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                      Authentic scheduling, modern airframes, and a transparent
                      pilot progression ladder.
                    </p>
                  </div>
                </RevealBox>
              </div>
            </div>
          </Section>

          {/* SECTION 2: WHY WE EXIST */}
          <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-gradient-to-br from-card/80 via-card/50 to-primary/5 p-8 shadow-2xl backdrop-blur-md sm:p-14">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
                <RevealBox>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#b89358]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b89358]">
                    <Sparkles className="size-3.5" />
                    Why we exist
                  </div>
                  <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl sm:leading-[1.12]">
                    Connecting pilots through the world of{" "}
                    <span className="bg-gradient-to-r from-primary via-[#b89358] to-cyan-500 bg-clip-text text-transparent">
                      Air Astana.
                    </span>
                  </h2>
                </RevealBox>

                <div className="space-y-6">
                  <RevealBox delay={100}>
                    <p className="text-base font-normal leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                      Our aim is to represent Kazakhstan and its aviation story
                      in a way that feels natural inside Infinite Flight. That
                      means published sectors, recognisable hubs, a growing fleet,
                      and a community that can turn individual flights into
                      shared experiences.
                    </p>
                  </RevealBox>

                  <RevealBox delay={200}>
                    <p className="text-base font-normal leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                      We care about realism, but we also care about people. Rules
                      and procedures should give a flight structure, not take
                      away the enjoyment of it. The result we are working toward
                      is a VA that feels professional when you want an
                      airline-style operation and welcoming when you simply want
                      to fly with friends.
                    </p>
                  </RevealBox>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: IDENTITY & CEO CALLOUT */}
          <section className="mx-auto mb-24 max-w-7xl px-4 sm:px-6">
            <RevealBox>
              <div className="relative overflow-hidden rounded-[2.25rem] border border-border/80 bg-card/60 p-8 shadow-lg backdrop-blur-md sm:p-12">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#b89358]">
                  <ShieldCheck className="size-4" />
                  Our identity &amp; disclaimer
                </div>
                <h2 className="mt-4 max-w-3xl text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Built around aviation, community, and the freedom to keep
                  exploring.
                </h2>
                <p className="mt-5 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm sm:leading-7">
                  Air Astana Virtual is an independent virtual airline made
                  exclusively for the Infinite Flight platform. We are not owned
                  by, operated by, sponsored by, endorsed by, or affiliated with
                  Air Astana, its subsidiaries, or any other real-world airline or
                  organisation. Air Astana names, logos, and trademarks remain the
                  property of their respective owners.
                </p>

                <div className="mt-8 border-t border-border/50 pt-6">
                  <a
                    href="/ceo-message"
                    className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary/90 px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30"
                  >
                    <span>Read the CEO&apos;s message</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </RevealBox>
          </section>
        </div>
      </div>
    </>
  );
}
