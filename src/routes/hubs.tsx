import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Card, PageHeader, Section } from "@/components/site/Page";
import { fetchAirports, type AirportRecord } from "@/lib/csv";

export const Route = createFileRoute("/hubs")({
  head: () => ({
    meta: [
      { title: "Hubs — Air Arabia Virtual" },
      {
        name: "description",
        content:
          "Air Arabia Virtual operates from Sharjah, Casablanca and Cairo, plus a full list of destinations across the network.",
      },
      { property: "og:title", content: "Hubs — Air Arabia Virtual" },
      {
        property: "og:description",
        content: "Our operating hubs and every destination on the network.",
      },
    ],
  }),
  component: Hubs,
});

const hubs = [
  {
    icao: "OMSJ",
    name: "Sharjah International",
    country: "United Arab Emirates",
    body: "Our main base. Expect quick turns to the Gulf, Pakistan, India and the Caucasus, with the largest aircraft allocation of the network.",
  },
  {
    icao: "GMMN",
    name: "Mohammed V, Casablanca",
    country: "Morocco",
    body: "North African base for European and domestic Moroccan flying, operated under our Maroc division.",
  },
  {
    icao: "HECA",
    name: "Cairo International",
    country: "Egypt",
    body: "Egyptian base linking the Mediterranean with the Gulf, ideal for evening sectors.",
  },
];

function Hubs() {
  const [airports, setAirports] = useState<AirportRecord[]>([]);

  useEffect(() => {
    fetchAirports()
      .then(setAirports)
      .catch((e) => console.error(e));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Hubs"
        title="Three bases, one network"
        subtitle="Pick the hub that fits your timezone. You can fly from any of them at any time — there is no need to request a base transfer."
      />

      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {hubs.map((h) => (
            <Card key={h.icao}>
              <div className="flex items-baseline gap-2">
                <span className="rounded-md bg-accent px-2 py-1 text-sm font-bold text-accent-foreground">
                  {h.icao}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {h.country}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{h.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Stations we serve"
        description="Pulled from the same airport file that powers the route map."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {airports.map((a) => (
            <div
              key={a.icao}
              className="rounded-lg border border-border bg-surface p-4 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{a.icao}</span>
                <span className="text-xs text-muted-foreground">{a.flights} departures</span>
              </div>
              <div className="mt-1 text-sm font-medium">{a.name}</div>
              {a.moreToKnow && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{a.moreToKnow}</p>
              )}
            </div>
          ))}
          {airports.length === 0 && (
            <p className="text-sm text-muted-foreground">Loading stations…</p>
          )}
        </div>
      </Section>
    </>
  );
}
