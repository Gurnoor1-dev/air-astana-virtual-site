import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
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
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap",
      },
    ],
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className="font-jakarta relative min-h-screen w-full overflow-hidden bg-background text-foreground antialiased selection:bg-[#b89358]/20 selection:text-[#b89358]">
        {/* Hero Background with Vignette */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-[center_top_20%] bg-no-repeat opacity-40 sm:opacity-50"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/25 to-background" />

        {/* Ambient Glow Orbs */}
        <div className="pointer-events-none fixed -left-36 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[140px] animate-pulse" />
        <div className="pointer-events-none fixed -right-36 bottom-20 h-96 w-96 rounded-full bg-[#b89358]/10 blur-[140px]" />

        {/* Content Container */}
        <div className="relative z-10">
          <Section className="py-16 sm:py-24">
            <div className="mx-auto max-w-3xl px-6 sm:px-8">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#b89358]">
                <span className="size-2 rounded-full bg-[#b89358]" />
                Leadership
              </div>

              {/* Title */}
              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
                Message from the CEO.
              </h1>

              {/* Minimalist Editorial Quote Section with Gold Border */}
              <div className="mt-8 border-l-2 border-[#b89358] pl-6 sm:pl-8">
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

              {/* Author Details & IFC Button */}
              <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-8 pl-6 sm:pl-8">
                <a
                  href="https://community.infiniteflight.com/u/gurnoor1/summary"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-3.5"
                >
                  <div className="size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#b89358]/30 transition-transform duration-200 group-hover:scale-105">
                    <img
                      src={avatarUrl}
                      alt="Gurnoor1"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-black tracking-tight text-foreground transition group-hover:text-primary sm:text-lg">
                      Gurnoor1
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#b89358]">
                      CEO &amp; Founder
                    </span>
                  </div>
                </a>

                <a
                  href="https://community.infiniteflight.com/u/gurnoor1/summary"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs font-bold text-muted-foreground shadow-sm transition hover:border-[#b89358]/50 hover:bg-[#b89358]/5 hover:text-[#b89358]"
                >
                  <span className="hidden sm:inline">IFC Profile</span>
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
