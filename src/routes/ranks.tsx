import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, Section, Card } from "@/components/site/Page";

export const Route = createFileRoute("/ranks")({
  head: () => ({
    meta: [
      { title: "Ranks — Air Arabia Virtual" },
      {
        name: "description",
        content:
          "Rank structure at Air Arabia Virtual: hours required, aircraft unlocked and privileges from Cadet to Fleet Captain.",
      },
      { property: "og:title", content: "Ranks — Air Arabia Virtual" },
      {
        property: "og:description",
        content: "How pilots progress from Cadet to Fleet Captain on our network.",
      },
    ],
  }),
  component: Ranks,
});

const ranks = [
  { rank: "Cadet", hours: "0 – 10", aircraft: "A320", note: "Hub sectors under 2 hours." },
  { rank: "Second Officer", hours: "10 – 30", aircraft: "A320", note: "All A320 routes unlocked." },
  { rank: "First Officer", hours: "30 – 75", aircraft: "A320 / A320neo", note: "Neo fleet access." },
  {
    rank: "Senior First Officer",
    hours: "75 – 150",
    aircraft: "A320 / A320neo",
    note: "May lead group flights.",
  },
  {
    rank: "Captain",
    hours: "150 – 300",
    aircraft: "Full fleet",
    note: "A321neo LR long sectors unlocked.",
  },
  {
    rank: "Senior Captain",
    hours: "300 – 500",
    aircraft: "Full fleet",
    note: "Can mentor new pilots.",
  },
  {
    rank: "Fleet Captain",
    hours: "500+",
    aircraft: "Full fleet",
    note: "Eligible for staff and training roles.",
  },
];

function Ranks() {
  return (
    <>
      <PageHeader
        eyebrow="Ranks"
        title="Progression at Air Arabia Virtual"
        subtitle="Hours are logged from filed flight reports. Ranks unlock aircraft and privileges — nothing is ever taken away for inactivity."
      />
      <Section>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-soft">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Aircraft</th>
                <th className="px-4 py-3">Privileges</th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((r) => (
                <tr key={r.rank} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">{r.rank}</td>
                  <td className="px-4 py-3 text-primary">{r.hours}</td>
                  <td className="px-4 py-3">{r.aircraft}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Rank upgrades">
        <Card>
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>Upgrades are reviewed weekly — you do not need to request one.</li>
            <li>
              Captain and above requires one checkride with the training department (a normal
              scheduled flight, observed).
            </li>
            <li>Transferred hours from another virtual airline count up to 50 hours.</li>
          </ul>
        </Card>
      </Section>
    </>
  );
}
