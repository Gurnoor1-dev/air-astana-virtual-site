import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/site/Page";

export const Route = createFileRoute("/ceo-message")({
  head: () => ({
    meta: [
      { title: "Message of the CEO — Air Astana Virtual" },
      {
        name: "description",
        content: "A message from Gurnoor1, CEO and Founder of Air Astana Virtual.",
      },
    ],
  }),
  component: CEOMessage,
});

const avatarUrl =
  "https://sea1.discourse-cdn.com/infiniteflight/user_avatar/community.infiniteflight.com/gurnoor1/144/1653960_2.png";

function CEOMessage() {
  return (
    <Section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Message from the CEO.
        </h1>

        {/* Quote content with minimal accent border */}
        <div className="mt-8 border-l-2 border-primary/70 pl-6 sm:pl-8">
          <div className="space-y-6 text-base font-normal leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
            <p>
              &ldquo;Air Astana Virtual started with a straightforward ambition: to build a virtual home for Air Astana inside Infinite Flight and give pilots a reason to return to the network. We want our operations to feel recognisable and considered, while leaving enough room for community flights, events and the spontaneous moments that make virtual aviation enjoyable.&rdquo;
            </p>
            <p>
              &ldquo;For me, a VA is never just a collection of schedules, aircraft and flight records. It is a group of people sharing the same interest. That is why we want Air Astana Virtual to be welcoming to new pilots, respectful toward experienced members and active enough that there is always something worth taking part in. Professional standards matter to us, but so do friendship, curiosity and having fun in the simulator.&rdquo;
            </p>
            <p>
              &ldquo;As we grow, our focus will remain on building a community that is proud of the airline it represents. Every route we publish, every event we organise and every pilot who joins should add something to that bigger picture. The goal is not simply to make flights look realistic; it is to create an experience that people genuinely enjoy being part of.&rdquo;
            </p>
          </div>
        </div>

        {/* Minimal author layout */}
        <div className="mt-10 flex items-center justify-between pl-6 sm:pl-8">
          <a
            href="https://community.infiniteflight.com/u/gurnoor1/summary"
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-center gap-3.5"
          >
            <div className="size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 transition-transform group-hover:scale-105">
              <img
                src={avatarUrl}
                alt="Gurnoor1"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground transition group-hover:text-primary sm:text-lg">
                Gurnoor1
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                CEO &amp; Founder
              </span>
            </div>
          </a>

          <a
            href="https://community.infiniteflight.com/u/gurnoor1/summary"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition hover:text-primary"
          >
            <span className="hidden sm:inline">IFC Profile</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </Section>
  );
}
