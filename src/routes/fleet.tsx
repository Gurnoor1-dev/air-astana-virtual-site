import { createFileRoute } from "@tanstack/react-router";

import { Card, PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet — Air Arabia Virtual" },
      {
        name: "description",
        content:
          "The Air Arabia Virtual fleet: Airbus A320, A320neo and A321neo LR, with seating, range and typical use on the network.",
      },
      { property: "og:title", content: "Fleet — Air Arabia Virtual" },
      {
        property: "og:description",
        content: "Our single-type Airbus A320 family fleet in Infinite Flight.",
      },
    ],
  }),
  component: Fleet,
});

const fleet = [
  {
    type: "Airbus A320-200",
    count: "38 aircraft",
    seats: "174 economy",
    range: "5,700 km",
    use: "The backbone of the network — Gulf, Indian subcontinent and North African sectors.",
  },
  {
    type: "Airbus A320neo",
    count: "12 aircraft",
    seats: "174 economy",
    range: "6,300 km",
    use: "Used on longer thin routes such as Riyadh, Yerevan and Central Asia.",
  },
  {
    type: "Airbus A321neo LR",
    count: "6 aircraft",
    seats: "215 economy",
    range: "7,400 km",
    use: "Our longest sectors: Moscow, Kuala Lumpur style trunk routes and high-demand days.",
  },
];

function Fleet() {
  return (
    <>
      <PageHeader
        eyebrow="Fleet"
        title="One family, three variants"
        subtitle="A single-type fleet keeps procedures simple. If you can fly the A320 in Infinite Flight, you can fly every route we publish."
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {fleet.map((a) => (
            <Card key={a.type}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {a.count}
              </div>
              <h3 className="mt-2 text-xl font-bold">{a.type}</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Seating</dt>
                  <dd className="font-medium">{a.seats}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Range</dt>
                  <dd className="font-medium">{a.range}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{a.use}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Cabin and callsign notes">
        <Card>
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>Use the Air Arabia livery in Infinite Flight where available.</li>
            <li>
              Callsign format: <span className="font-medium text-foreground">Arabia [flight no]</span>{" "}
              — for example Arabia 501.
            </li>
            <li>All aircraft are single-class economy; no first or business class service.</li>
            <li>Typical cruise: FL350–FL390 depending on sector length and weight.</li>
          </ul>
        </Card>
      </Section>
    </>
  );
}
