import { createFileRoute } from "@tanstack/react-router";
import { Compass, Heart, Radio, Sparkles } from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Air Astana Virtual" },
      {
        name: "description",
        content:
          "Learn about Air Astana Virtual, an independent Infinite Flight virtual airline focused on structured Eurasian operations, community flying and pilot progression.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="The airline"
        title="A virtual airline built around flying."
        subtitle="Air Astana Virtual is an independent, community-run Infinite Flight virtual airline focused on structured Eurasian operations, practical route flying and a clear progression path for pilots."
      />

      <Section>
        <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[#1c2b4f] p-8 text-white sm:p-12">
            <div className="absolute right-[-12%] top-[-10%] size-96 rounded-full border border-white/10" />
            <div className="absolute right-[5%] top-[10%] size-64 rounded-full border border-white/10" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="kicker !text-white/60">
                  <Sparkles className="size-3" /> Our story
                </div>
                <h2 className="mt-7 max-w-2xl text-5xl font-black leading-[.95] tracking-[-.045em] sm:text-6xl">
                  Fly the network.
                  <br />
                  <span className="text-primary">Build the crew.</span>
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-white/60">
                Air Astana Virtual was built to give Infinite Flight pilots a
                structured place to fly without turning the hobby into a
                chore. Our network connects Kazakhstan with destinations
                across Europe and Asia, while shared flights, events and pilot
                progression give members reasons to keep exploring.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <Card>
              <Compass className="size-5 text-primary" />
              <h3 className="mt-8 text-2xl font-extrabold">Explore</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Choose from published KC sectors, plan your flight and explore
                a growing Eurasian network from our primary hubs in Almaty and
                Astana.
              </p>
            </Card>
            <Card>
              <Heart className="size-5 text-primary" />
              <h3 className="mt-8 text-2xl font-extrabold">Belong</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Fly alongside other members, join group operations and events,
                and become part of a crew that values both good flying and a
                welcoming community.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="What to expect"
        title="A simple place to keep flying."
        description="New pilots can join the network, choose an aircraft and published sector, log their flights and work through the rank system as they gain experience."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <Radio className="size-5 text-primary" />
            <h3 className="mt-6 font-extrabold">Structured operations</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Published routes, hubs, aircraft and callsigns give each flight
              a clear purpose while leaving room to enjoy the simulator.
            </p>
          </Card>
          <Card>
            <Heart className="size-5 text-primary" />
            <h3 className="mt-6 font-extrabold">Community first</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The VA is built around pilots, not just flight hours. Group
              flying, events and crew interaction are part of the experience.
            </p>
          </Card>
          <Card>
            <Compass className="size-5 text-primary" />
            <h3 className="mt-6 font-extrabold">Progress with purpose</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The rank system gives pilots a clear path to learn the network,
              stay active and take on more responsibility over time.
            </p>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Our principles" title="The way we want to fly.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <Radio className="size-5 text-primary" />
            <h3 className="mt-6 font-extrabold">Realism without pressure</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use appropriate routes, callsigns and procedures while keeping
              the experience welcoming and enjoyable.
            </p>
          </Card>
          <Card>
            <Heart className="size-5 text-primary" />
            <h3 className="mt-6 font-extrabold">People first</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The pilots you fly with are as important as the hours in your
              logbook.
            </p>
          </Card>
          <Card>
            <Compass className="size-5 text-primary" />
            <h3 className="mt-6 font-extrabold">Always exploring</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Our Central Asian focus makes every direction an opportunity to
              discover another destination in the Infinite Flight network.
            </p>
          </Card>
        </div>
      </Section>

      <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-primary/15 bg-primary/5 p-8 sm:p-12">
          <div className="kicker">Important</div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-[-.025em] sm:text-3xl">
            Independent Infinite Flight virtual airline
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">
            Air Astana Virtual is a virtual airline exclusively for the
            Infinite Flight platform. We have no connection or affiliation
            with Air Astana or any other real-world airlines, organizations,
            or subsidiaries. All logos and trademarks remain the property of
            Air Astana.
          </p>
        </div>
      </section>
    </>
  );
}
