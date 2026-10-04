import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Quote, Sparkles, ShieldCheck, HeartHandshake, Compass } from "lucide-react";
import { Section } from "@/components/site/Page";
import heroBg from "@/assets/site/home-hero.jpg";

export const Route = createFileRoute("/ceo-message")({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap",
      },
    ],
    meta: [
      { title: "Message from the CEO — Air Astana Virtual" },
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className="font-jakarta relative min-h-screen w-full overflow-hidden bg-background text-foreground antialiased selection:bg-[#b89358]/20 selection:text-[#b89358]">
        {/* CINEMATIC HERO LAYER */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-[center_top_20%] bg-no-repeat opacity-40 mix-blend-luminosity filter transition-all duration-1000 sm:opacity-55"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />

        {/* ATMOSPHERIC GLOWS */}
        <div className="pointer-events-none fixed -left-36 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#b89358]/15 blur-[160px] animate-pulse" />
        <div className="pointer-events-none fixed -right-36 top-2/3 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[150px]" />
        <div className="pointer-events-none fixed left-1/2 bottom-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-[#b89358]/10 blur-[140px]" />

        {/* MAIN SHOWCASE CONTAINER */}
        <div className="relative z-10 py-16 sm:py-24">
          <Section>
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              
              {/* GLASS EDITORIAL CONTAINER */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-[#b89358]/25 bg-card/75 p-7 shadow-2xl shadow-black/5 backdrop-blur-2xl transition-all duration-500 hover:border-[#b89358]/40 sm:p-14 dark:shadow-none">
                
                {/* Decorative Subtle Ambient Border Light */}
                <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-[#b89358]/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full bg-primary/10 blur-3xl" />

                {/* Floating Stylized Watermark Quote Icon */}
                <Quote className="pointer-events-none absolute right-8 top-8 size-28 -rotate-12 text-[#b89358]/10 select-none sm:size-40" />

                {/* Top Badge Strip */}
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-[#b89358]/30 bg-background/80 px-4 py-1.5 shadow-sm backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b89358] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b89358]" />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b89358]">
                      Executive Address
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                    <ShieldCheck className="size-4 text-[#b89358]" />
                    <span>Official Air Astana Virtual Charter</span>
                  </div>
                </div>

                {/* Main Heading */}
                <div className="relative mt-8">
                  <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl sm:leading-[1.12]">
                    A message from our{" "}
                    <span className="bg-gradient-to-r from-[#b89358] via-amber-600 to-primary bg-clip-text text-transparent">
                      CEO.
                    </span>
                  </h1>
                  <p className="mt-3 max-w-2xl text-xs font-medium text-muted-foreground sm:text-sm">
                    Why Air Astana Virtual exists, what we are building together, and the standard of virtual aviation we strive to deliver.
                  </p>
                </div>

                {/* Editorial Quote Body with Golden Gutter */}
                <div className="relative mt-10 border-l-2 border-[#b89358]/60 pl-6 sm:pl-10">
                  <div className="space-y-6 text-base font-normal leading-relaxed text-muted-foreground sm:text-lg sm:leading-loose">
                    <p className="relative font-medium text-foreground/90">
                      Air Astana Virtual started with a straightforward ambition: to build a virtual home for Air Astana inside Infinite Flight and give pilots a reason to return to the network. We want our operations to feel recognisable and considered, while leaving enough room for community flights, events and the spontaneous moments that make virtual aviation enjoyable.
                    </p>
                    <p>
                      For me, a VA is never just a collection of schedules, aircraft and flight records. It is a group of people sharing the same interest. That is why we want Air Astana Virtual to be welcoming to new pilots, respectful toward experienced members and active enough that there is always something worth taking part in. Professional standards matter to us, but so do friendship, curiosity and having fun in the simulator.
                    </p>
                    <p>
                      As we grow, our focus will remain on building a community that is proud of the airline it represents. Every route we publish, every event we organise and every pilot who joins should add something to that bigger picture. The goal is not simply to make flights look realistic; it is to create an experience that people genuinely enjoy being part of.
                    </p>
                  </div>

                  {/* Core Pillars Strip */}
                  <div className="mt-8 grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-xl bg-background/50 p-2.5 text-xs font-bold text-foreground/85 border border-border/50">
                      <Sparkles className="size-4 text-[#b89358]" />
                      <span>Realistic Airline Ops</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-background/50 p-2.5 text-xs font-bold text-foreground/85 border border-border/50">
                      <HeartHandshake className="size-4 text-[#b89358]" />
                      <span>Welcoming Community</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-background/50 p-2.5 text-xs font-bold text-foreground/85 border border-border/50">
                      <Compass className="size-4 text-[#b89358]" />
                      <span>Eurasian Skyway</span>
                    </div>
                  </div>
                </div>

                {/* SIGNATURE & PROFILE FOOTER */}
                <div className="relative mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-border/70 pt-8 sm:mt-14">
                  {/* CEO Identity */}
                  <div className="flex items-center gap-4">
                    <a
                      href="https://community.infiniteflight.com/u/gurnoor1/summary"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group relative size-14 shrink-0 overflow-hidden rounded-full p-0.5 transition-transform duration-300 hover:scale-105"
                    >
                      {/* Gradient border ring */}
                      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#b89358] via-primary to-amber-300" />
                      <div className="relative size-full overflow-hidden rounded-full bg-background p-0.5">
                        <img
                          src={avatarUrl}
                          alt="Gurnoor1"
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                    </a>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                          Gurnoor1
                        </span>
                        <span className="rounded-full bg-[#b89358]/15 px-2 py-0.5 font-mono text-[10px] font-extrabold text-[#b89358]">
                          #1
                        </span>
                      </div>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#b89358]">
                        CEO &amp; Founder
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <a
                    href="https://community.infiniteflight.com/u/gurnoor1/summary"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-background/80 px-5 py-2.5 text-xs font-extrabold text-foreground shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#b89358] hover:bg-[#b89358]/5 hover:text-[#b89358] hover:shadow-lg hover:shadow-[#b89358]/10"
                  >
                    <span>View IFC Profile</span>
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>

              </div>

            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
