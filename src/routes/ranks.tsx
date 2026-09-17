import { createFileRoute } from "@tanstack/react-router";
import { Award, ChevronRight, Clock3, Compass, ShieldCheck } from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/ranks")({
  head: () => ({
    meta: [
      { title: "Ranks — Air Arabia Virtual" },
      {
        name: "description",
        content: "Explore the Air Arabia Virtual pilot rank and progression structure.",
      },
    ],
  }),
  component: Ranks,
});

const ranks = [
  {
    rank: "Cadet",
    hours: "0–10",
    perk: "Middle East Only",
    note: "Access to regional Middle Eastern routes only.",
  },
  {
    rank: "Second Officer",
    hours: "10–30",
    perk: "Indian Subcontinent",
    note: "Unlocks flight operations to and from the Indian Subcontinent.",
  },
  {
    rank: "First Officer",
    hours: "30–75",
    perk: "Europe & Short-Haul Codeshare",
    note: "Unlocks flights into European destinations and short-haul codeshare partners.",
  },
  {
    rank: "Senior First Officer",
    hours: "75–150",
    perk: "Long-Haul Codeshare",
    note: "Unlocks long-haul codeshare routes across the global partner network.",
  },
  {
    rank: "Captain",
    hours: "150–300",
    perk: "Custom Callsign (21–99)",
    note: "One-time chance to claim and reserve a special custom callsign between 21 and 99.",
  },
  {
    rank: "Senior Captain",
    hours: "300–500",
    perk: "1.25x Flight Multiplier",
    note: "Enjoy an active 1.25x hour multiplier credited to every sector logged.",
  },
  {
    rank: "Fleet Captain",
    hours: "500+",
    perk: "Partial Staff & Arabian Club",
    note: "Advisory role for ROTWs/events, partial staff permissions, and an exclusive invitation to the Arabian Club.",
  },
];

function Ranks() {
  return (
    <>
      <PageHeader
        eyebrow="Pilot progression"
        title="Every flight moves you forward."
        subtitle="A clear rank ladder turns hours in the air into a long-term pilot journey. Start as a cadet and build your way to Fleet Captain."
      />
      <Section>
        <div className="relative">
          <div className="absolute left-6 top-8 bottom-8 hidden w-px bg-gradient-to-b from-primary via-primary/30 to-border sm:block" />
          {ranks.map((r, i) => (
            <div
              key={r.rank}
              className="relative grid gap-5 pb-5 sm:grid-cols-[72px_1fr] sm:gap-7"
            >
              <div className="relative z-10 flex size-12 items-center justify-center rounded-2xl brand-gradient text-sm font-black text-white shadow-brand">
                {String(i + 1).padStart(2, "0")}
              </div>
              <Card className={`sm:p-7 ${i === 0 ? "border-primary/20" : ""}`}>
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div className="max-w-xl">
                    <div className="kicker">{r.hours} hours</div>
                    <h3 className="mt-2 text-2xl font-black">{r.rank}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {r.note}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:min-w-[280px]">
                    <div className="rounded-xl bg-muted p-3">
                      <Clock3 className="size-4 text-primary" />
                      <div className="mt-2 text-xs font-bold">{r.hours}</div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                        Hours
                      </div>
                    </div>
                    <div className="rounded-xl bg-muted p-3">
                      <Compass className="size-4 text-primary" />
                      <div className="mt-2 text-xs font-bold line-clamp-1" title={r.perk}>
                        {r.perk}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                        Unlocked Perk
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Section>
      <Section eyebrow="How it works" title="A progression system built around flying.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <ShieldCheck className="size-5 text-primary" />
            <h3 className="mt-5 font-extrabold">Log sectors</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Complete your flights and build the hours that drive progression.
            </p>
          </Card>
          <Card>
            <Award className="size-5 text-primary" />
            <h3 className="mt-5 font-extrabold">Earn rank</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Hit each threshold and unlock new destinations, bonuses, and fleet privileges.
            </p>
          </Card>
          <Card>
            <ChevronRight className="size-5 text-primary" />
            <h3 className="mt-5 font-extrabold">Take responsibility</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Higher ranks open custom callsigns, flight multipliers, and advisory status in the Arabian Club.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
