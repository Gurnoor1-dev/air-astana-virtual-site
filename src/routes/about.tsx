import { createFileRoute } from "@tanstack/react-router";

import { Card, PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Air Arabia Virtual" },
      {
        name: "description",
        content:
          "Learn how Air Arabia Virtual operates as an Infinite Flight virtual airline, our values and how the airline is run.",
      },
      { property: "og:title", content: "About Air Arabia Virtual" },
      {
        property: "og:description",
        content: "Who we are and how we fly the Air Arabia network in Infinite Flight.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="A low-cost airline, flown for fun"
        subtitle="Air Arabia Virtual recreates the Air Arabia operation inside Infinite Flight — the same hubs, the same A320 family fleet and the same quick-turn style of flying."
      />

      <Section title="Our story">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold">How we started</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A small group of Infinite Flight pilots wanted a virtual airline that felt like real
              low-cost flying: short sectors, high utilisation and no complicated paperwork. Air
              Arabia Virtual grew out of those weekend group flights out of Sharjah.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold">How we operate</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Pilots pick any published route, fly it in Infinite Flight and file a report. Hours
              count towards your rank. There are no minimum monthly hours — we would rather you fly
              when you actually want to.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="What we care about">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Realism without stress",
              body: "Correct callsigns, routes and flight levels — but no punishment for a bumpy landing.",
            },
            {
              title: "Respect on frequency",
              body: "Follow ATC instructions, stay polite and keep the airspace tidy for everyone.",
            },
            {
              title: "Community first",
              body: "Events, group flights and shared screenshots matter as much as logbook numbers.",
            },
          ].map((v) => (
            <Card key={v.title}>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Card className="border-primary/30">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Air Arabia Virtual is a fan-run, non-commercial virtual airline for the Infinite Flight
            simulator. It is not affiliated with, endorsed by or connected to Air Arabia PJSC.
          </p>
        </Card>
      </Section>
    </>
  );
}
