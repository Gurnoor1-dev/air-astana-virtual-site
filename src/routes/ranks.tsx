import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Award,
  ChevronRight,
  Clock3,
  Compass,
  ShieldCheck,
  Plane,
} from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/ranks")({
  head: () => ({
    meta: [
      { title: "Ranks — Air Astana Virtual" },
      {
        name: "description",
        content: "Explore the Air Astana Virtual pilot rank and progression structure.",
      },
    ],
  }),
  component: Ranks,
});

const ranks = [
  {
    rank: "Cadet",
    hours: "0–10",
    minHours: "0h",
    stripes: 0,
    perk: "Domestic network",
    note: "Build your first hours across Kazakhstan and learn the virtual airline standards.",
    requirements: "Complete 0–10 logged flight hours and follow the VA operating basics.",
  },
  {
    rank: "Second Officer",
    hours: "10–30",
    minHours: "10h",
    stripes: 1,
    perk: "Central Asia",
    note: "Unlock regional flying across Central Asia and nearby hubs.",
    requirements: "Reach 10 logged hours and maintain normal activity and operating standards.",
  },
  {
    rank: "First Officer",
    hours: "30–75",
    minHours: "30h",
    stripes: 2,
    perk: "Caucasus & Europe",
    note: "Open the wider western network, including the Caucasus and European sectors.",
    requirements: "Reach 30 logged hours with a consistent flight record.",
  },
  {
    rank: "Senior First Officer",
    hours: "75–150",
    minHours: "75h",
    stripes: 3,
    perk: "Asia network",
    note: "Unlock longer international sectors across India, China and Southeast Asia.",
    requirements: "Reach 75 logged hours and continue meeting VA operating standards.",
  },
  {
    rank: "Captain",
    hours: "150–300",
    minHours: "150h",
    stripes: 4,
    perk: "Long-range operations",
    note: "Qualify for the extended-range network and advanced group-flight responsibilities.",
    requirements: "Reach 150 logged hours; higher-range operations are opened from this point.",
  },
  {
    rank: "Senior Captain",
    hours: "300–500",
    minHours: "300h",
    stripes: 4,
    isSenior: true,
    perk: "Mentor privileges",
    note: "Support newer pilots, lead events and help maintain operational standards.",
    requirements: "Reach 300 logged hours and demonstrate reliable community participation.",
  },
  {
    rank: "Fleet Captain",
    hours: "500+",
    minHours: "500h",
    stripes: 4,
    isElite: true,
    perk: "Leadership track",
    note: "A senior community rank for experienced pilots who contribute to operations and training.",
    requirements: "Reach 500+ logged hours and continue contributing to the VA.",
  },
];

function Ranks() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Tracks scroll progress through the rank list container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 80%"],
  });

  // Smooth out raw scroll movements
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <PageHeader
        eyebrow="Pilot progression"
        title="Build your pilot career."
        subtitle="A clear rank ladder turns hours in the air into a long-term Air Astana Virtual pilot journey."
      />

      <Section>
        <div ref={containerRef} className="relative mx-auto max-w-4xl">
          {/* Static background track */}
          <div className="absolute left-[31px] sm:left-[39px] top-6 bottom-16 w-1 rounded-full bg-muted/60 dark:bg-muted/30" />

          {/* Animated fill line */}
          <motion.div
            style={{ scaleY }}
            className="absolute left-[31px] sm:left-[39px] top-6 bottom-16 w-1 origin-top rounded-full bg-gradient-to-b from-primary via-primary to-primary/80 shadow-[0_0_12px_rgba(var(--primary),0.5)]"
          />

          <div className="space-y-10 sm:space-y-12">
            {ranks.map((r, i) => (
              <div
                key={r.rank}
                className="group relative flex items-start gap-4 sm:gap-8"
              >
                {/* Milestone Node */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex h-11 w-16 sm:h-12 sm:w-20 items-center justify-center rounded-2xl border-2 border-primary/20 bg-background/95 text-xs sm:text-sm font-black text-primary shadow-md backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-primary/20">
                    {r.minHours}
                  </div>
                </div>

                {/* Progressive Rank Card */}
                <div className="w-full flex-1">
                  <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-white/95 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl sm:p-8 dark:bg-card">
                    {/* Top pill bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                          Rank
                        </span>
                        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-extrabold text-primary">
                          {r.hours} hrs
                        </span>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Level {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_210px] lg:items-center">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                          {r.rank}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {r.note}
                        </p>

                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/50 px-3.5 py-2.5 text-xs font-medium text-foreground/80">
                          <Plane className="size-3.5 shrink-0 text-primary" />
                          <span>
                            <strong className="font-bold text-foreground">
                              Requirement:{" "}
                            </strong>
                            {r.requirements}
                          </span>
                        </div>
                      </div>

                      {/* Progressive Epaulette / Pilot Badge Representation */}
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-gradient-to-br from-muted/60 to-muted/20 p-5">
                        <div
                          className={`relative flex h-14 w-full max-w-[170px] items-center justify-end gap-1.5 rounded-2xl px-4 shadow-inner ${
                            r.isElite
                              ? "bg-gradient-to-r from-amber-600 via-primary to-emerald-600"
                              : r.isSenior
                              ? "bg-gradient-to-r from-primary/90 to-primary"
                              : "bg-gradient-to-r from-primary/80 to-primary"
                          }`}
                        >
                          {r.stripes === 0 ? (
                            <span className="w-full text-center text-[10px] font-bold tracking-widest text-white/80 uppercase">
                              Cadet
                            </span>
                          ) : (
                            Array.from({ length: r.stripes }).map((_, idx) => (
                              <div
                                key={idx}
                                className="h-9 w-2 rounded-full bg-white shadow-sm"
                              />
                            ))
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-1.5 text-center text-xs font-semibold text-muted-foreground">
                          <Compass className="size-3.5 text-primary" />
                          <span className="truncate max-w-[150px]">{r.perk}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick highlights bottom grid */}
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/40 pt-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Clock3 className="size-3.5 text-primary" />
                        <span>Logging {r.hours} flight hours</span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-primary">
                        <span>{r.perk}</span>
                        <ChevronRight className="size-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="How it works" title="Progress through the ranks.">
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="rounded-[1.75rem] p-6 shadow-sm transition hover:shadow-md">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-black">Log sectors</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Complete flights and build the hours that drive progression.
            </p>
          </Card>

          <Card className="rounded-[1.75rem] p-6 shadow-sm transition hover:shadow-md">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Award className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-black">Earn rank</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Reach each threshold and unlock more of the Air Astana Virtual
              network.
            </p>
          </Card>

          <Card className="rounded-[1.75rem] p-6 shadow-sm transition hover:shadow-md">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ChevronRight className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-black">Take responsibility</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Higher ranks open mentoring, event and leadership opportunities.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
