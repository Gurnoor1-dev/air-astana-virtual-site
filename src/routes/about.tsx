import { createFileRoute } from "@tanstack/react-router";
import { Compass, Heart, Radio, Sparkles, Users } from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Air Astana Virtual" },
      {
        name: "description",
        content:
          "Learn more about Air Astana Virtual, an independent Infinite Flight virtual airline built for pilots who enjoy structured operations, community flying and exploring the Eurasian network.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Air Astana Virtual"
        title="More than an airline. A community built to fly."
        subtitle="Air Astana Virtual is an independent Infinite Flight virtual airline created for pilots who enjoy organised operations, realistic flying and the freedom to explore a growing Eurasian network."
      />

      <Section>
        <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <div className="relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#1c2b4f] p-8 text-white sm:p-12">
            <div className="absolute right-[-12%] top-[-10%] size-96 rounded-full border border-white/10" />
            <div className="absolute right-[5%] top-[10%] size-64 rounded-full border border-white/10" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="kicker !text-white/60">
                  <Sparkles className="size-3" /> Who we are
                </div>
                <h2 className="mt-7 max-w-2xl text-5xl font-black leading-[.95] tracking-[-.045em] sm:text-6xl">
                  Built for pilots.
                  <br />
                  <span className="text-primary">Ready for departure.</span>
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/65">
                Air Astana Virtual brings the feel of an airline operation into
                Infinite Flight. From our Kazakhstan hubs, pilots can fly
                published KC sectors, operate across Europe and Asia, record
                their flights and progress through a simple rank structure.
                Whether you enjoy a quiet solo flight or flying with the crew,
                there is always another sector to explore.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <Card>
              <Compass className="size-5 text-primary" />
              <h3 className="mt-8 text-2xl font-extrabold">Our network</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Almaty and Astana form the centre of our network, connecting
                pilots with destinations across Central Asia, the Caucasus,
                Europe and Asia.
              </p>
            </Card>
            <Card>
              <Users className="size-5 text-primary" />
              <h3 className="mt-8 text-2xl font-extrabold">Our community</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                We are here to give Infinite Flight pilots a place to meet,
                fly, take part in group operations and enjoy the simulator
                together without making every flight feel like a chore.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="What we offer"
        title="Everything you need to enjoy the network."
        description="The goal is simple: make it easy to find a flight, know how to operate it and have a reason to come back for the next one."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <Radio className="size-5 text-primary" />
            <h3 className="mt-6 font-extrabold">Organised operations</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Published routes, hubs, aircraft and callsigns give pilots a
              clear framework for every flight while keeping the experience
              flexible.
            </p>
          </Card>
          <Card>
            <Heart className="size-5 text-primary" />
            <h3 className="mt-6 font-extrabold">A friendly crew</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Meet other pilots, take part in group flights and events, and
              become part of a community that enjoys aviation as much as you do.
            </p>
          </Card>
          <Card>
            <Compass className="size-5 text-primary" />
            <h3 className="mt-6 font-extrabold">Room to progress</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Log your flights, build experience and move through the rank
              structure as you become more familiar with the airline.
            </p>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Our approach" title="Professional enough to feel like an airline.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-extrabold">Realistic, not restrictive</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We value proper routes, procedures and callsigns, while keeping
              Infinite Flight enjoyable for pilots with different experience
              levels.
            </p>
          </Card>
          <Card>
            <h3 className="font-extrabold">Community over numbers</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Flight hours and statistics matter, but the people behind every
              callsign are what make a virtual airline worth joining.
            </p>
          </Card>
          <Card>
            <h3 className="font-extrabold">Always another destination</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Our network is centred in Eurasia, giving pilots plenty of
              opportunities to discover new airports, routes and flying
              experiences.
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
            Air Astana Virtual is an independent virtual airline made
            exclusively for the Infinite Flight platform. We are not owned by,
            operated by, sponsored by, endorsed by, or affiliated with Air
            Astana, its subsidiaries, or any other real-world airline or
            organisation. Air Astana names, logos and trademarks remain the
            property of their respective owners.
          </p>
        </div>
      </section>
    </>
  );
}
