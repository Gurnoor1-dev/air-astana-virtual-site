import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Globe2,
  Users2,
  PlaneTakeoff,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Section } from "@/components/site/Page";
import heroBg from "@/assets/site/home-hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
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

/* Smooth Scroll Reveal Hook & Container */
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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        visible
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-10 opacity-0 blur-[3px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function About() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* HERO SECTION MATCHING SCREENSHOT */}
      <section className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28">
        {/* Background Image: visible, centered with subtle contrast */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-[center_top_20%] bg-no-repeat opacity-45 sm:opacity-55"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        {/* Vertical gradient wash fading to the background color at the bottom */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-background/15 to-background" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            {/* Dot + Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.2em] text-[#b89358]">
              <span className="size-2 rounded-full bg-[#b89358]" />
              About Air Astana Virtual
            </div>

            {/* Main Title */}
            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl">
              A virtual airline shaped by the people who fly it.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base font-normal leading-relaxed text-muted-foreground sm:text-xl sm:leading-8">
              An independent Infinite Flight community inspired by Air Astana,
              built around realistic operations, shared flying and a distinctly
              Eurasian network.
            </p>
          </div>
        </div>
      </section>

      {/* AMBIENT GLOW ORBS */}
      <div className="pointer-events-none fixed -left-36 top-1/3 h-96 w-96 rounded-full bg-primary/15 blur-[140px] animate-pulse" />
      <div className="pointer-events-none fixed -right-36 bottom-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="relative z-10">
        {/* SECTION 1: STORY */}
        <Section eyebrow="Our Story" title="Welcome to Air Astana Virtual.">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div className="space-y-8">
              <RevealBox delay={0}>
                <div className="rounded-3xl border border-border/80 bg-white/70 p-7 shadow-xl shadow-primary/5 backdrop-blur-md dark:bg-card/70 sm:p-10">
                  <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-9">
                    Air Astana Virtual is a{" "}
                    <span className="font-bold text-foreground">
                      community-driven virtual airline
                    </span>{" "}
                    created for Infinite Flight pilots who want more than simply
                    completing a flight. We bring the identity, routes and
                    atmosphere of Air Astana into the simulator while building a
                    place where pilots from different backgrounds can fly
                    together, learn from one another and enjoy the hobby at their
                    own pace.
                  </p>
                </div>
              </RevealBox>

              <RevealBox delay={120}>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                  The idea behind the VA is simple: give Air Astana a dedicated
                  presence in the virtual skies while creating an experience that
                  feels organised without becoming difficult to enjoy. Our
                  network begins in Kazakhstan and stretches across Europe, Asia
                  and the wider Eurasian region, giving every pilot room to
                  discover a new route, aircraft or destination.
                </p>
              </RevealBox>

              <RevealBox delay={220}>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                  Whether you are opening Infinite Flight for the first time or
                  already have hundreds of sectors behind you, you can find your
                  own place here. Some pilots come for structured airline
                  operations, others for group flights and community events, and
                  many simply enjoy having a reason to explore the network. Air
                  Astana Virtual is designed to make all of those reasons fit
                  together.
                </p>
              </RevealBox>
            </div>

            {/* Visual Value Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <RevealBox delay={150}>
                <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-white/90 to-primary/5 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:from-card/80 dark:to-primary/10">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Globe2 className="size-6" />
                  </div>
                  <h4 className="mt-4 text-lg font-black tracking-tight text-foreground">
                    Eurasian Network
                  </h4>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                    Connecting Central Asia to key hubs across Europe, the
                    Caucasus, the Middle East, and Asia.
                  </p>
                </div>
              </RevealBox>

              <RevealBox delay={250}>
                <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-white/90 to-cyan-500/5 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg dark:from-card/80 dark:to-cyan-500/10">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 transition-transform duration-300 group-hover:scale-110 dark:text-cyan-400">
                    <Users2 className="size-6" />
                  </div>
                  <h4 className="mt-4 text-lg font-black tracking-tight text-foreground">
                    Inclusive Community
                  </h4>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                    A welcoming environment for novice fliers and veteran
                    captains alike.
                  </p>
                </div>
              </RevealBox>

              <RevealBox delay={350}>
                <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-white/90 to-amber-500/5 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg dark:from-card/80 dark:to-amber-500/10">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 transition-transform duration-300 group-hover:scale-110 dark:text-amber-400">
                    <PlaneTakeoff className="size-6" />
                  </div>
                  <h4 className="mt-4 text-lg font-black tracking-tight text-foreground">
                    Realistic Operations
                  </h4>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                    Authentic scheduling, modern airframes, and progressive
                    pilot progression.
                  </p>
                </div>
              </RevealBox>
            </div>
          </div>
        </Section>

        {/* SECTION 2: WHY WE EXIST */}
        <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-gradient-to-br from-white/80 via-background/60 to-primary/5 p-8 shadow-2xl backdrop-blur-md sm:p-14 dark:bg-card/40">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
              <RevealBox>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="size-3.5" />
                  Why we exist
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-5xl sm:leading-[1.15]">
                  Connecting pilots through the world of{" "}
                  <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                    Air Astana.
                  </span>
                </h2>
              </RevealBox>

              <div className="space-y-6">
                <RevealBox delay={100}>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                    Our aim is to represent Kazakhstan and its aviation story in
                    a way that feels natural inside Infinite Flight. That means
                    published sectors, recognisable hubs, a growing fleet and a
                    community that can turn individual flights into shared
                    experiences.
                  </p>
                </RevealBox>

                <RevealBox delay={200}>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                    We care about realism, but we also care about people. Rules
                    and procedures should give a flight structure, not take away
                    the enjoyment of it. The result we are working toward is a
                    VA that feels professional when you want an airline-style
                    operation and welcoming when you simply want to fly with
                    friends.
                  </p>
                </RevealBox>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: IDENTITY & CEO LINK */}
        <section className="mx-auto mb-24 max-w-7xl px-4 sm:px-6">
          <RevealBox>
            <div className="rounded-[2rem] border border-border/80 bg-white/60 p-8 shadow-sm backdrop-blur-sm sm:p-12 dark:bg-card/50">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b89358]">
                <ShieldCheck className="size-4" />
                Our identity &amp; disclaimer
              </div>
              <h2 className="mt-4 max-w-3xl text-2xl font-black tracking-tight text-foreground sm:text-4xl">
                Built around aviation, community and the freedom to keep
                exploring.
              </h2>
              <p className="mt-5 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm sm:leading-7">
                Air Astana Virtual is an independent virtual airline made
                exclusively for the Infinite Flight platform. We are not owned
                by, operated by, sponsored by, endorsed by, or affiliated with
                Air Astana, its subsidiaries, or any other real-world airline or
                organisation. Air Astana names, logos and trademarks remain the
                property of their respective owners.
              </p>

              <div className="mt-8 border-t border-border/60 pt-6">
                <a
                  href="/ceo-message"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
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
  );
}
