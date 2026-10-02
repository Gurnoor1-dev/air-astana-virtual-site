import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Quote } from "lucide-react";
import { PageHeader, Section } from "@/components/site/Page";

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
    <>
      <PageHeader
        eyebrow="Leadership"
        title="A message from our CEO."
        subtitle="Why Air Astana Virtual exists, what we are building together and the kind of community we want every pilot to experience."
      />
      <Section>
        <div className="mx-auto max-w-4xl px-4 sm:px-0">
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-white/95 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl sm:p-14 dark:bg-card dark:shadow-none">
            {/* Elegant brand accent border */}
            <div className="absolute left-0 top-0 h-full w-2 brand-gradient" />
            
            {/* Ambient background watermark quote */}
            <Quote className="pointer-events-none absolute right-8 top-8 size-28 text-muted/30 rotate-180 select-none" />

            <div className="relative pl-3 sm:pl-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                From the founder
              </div>

              <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-loose">
                <p>
                  Air Astana Virtual started with a straightforward ambition: to build a virtual home for Air Astana inside Infinite Flight and give pilots a reason to return to the network. We want our operations to feel recognisable and considered, while leaving enough room for community flights, events and the spontaneous moments that make virtual aviation enjoyable.
                </p>
                <p>
                  For me, a VA is never just a collection of schedules, aircraft and flight records. It is a group of people sharing the same interest. That is why we want Air Astana Virtual to be welcoming to new pilots, respectful toward experienced members and active enough that there is always something worth taking part in. Professional standards matter to us, but so do friendship, curiosity and having fun in the simulator.
                </p>
                <p>
                  As we grow, our focus will remain on building a community that is proud of the airline it represents. Every route we publish, every event we organise and every pilot who joins should add something to that bigger picture. The goal is not simply to make flights look realistic; it is to create an experience that people genuinely enjoy being part of.
                </p>
              </div>

              {/* CEO profile matching reference design */}
              <div className="mt-12 flex items-center justify-between border-t border-border/60 pt-8">
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <a
                    href="https://community.infiniteflight.com/u/gurnoor1/summary"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 ring-offset-2 transition-transform duration-200 hover:scale-105"
                  >
                    <img
                      src={avatarUrl}
                      alt="Gurnoor1"
                      className="h-full w-full object-cover"
                    />
                  </a>

                  <div className="flex flex-col">
                    <span className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                      Gurnoor1
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
                      CEO &amp; Founder
                    </span>
                  </div>
                </div>

                <a
                  href="https://community.infiniteflight.com/u/gurnoor1/summary"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background/50 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <span className="hidden sm:inline">IFC Profile</span>
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
