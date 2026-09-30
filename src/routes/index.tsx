import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Globe2, Plane, Radio, ShieldCheck, Users, X, Newspaper, Navigation, BarChart3, Calendar } from "lucide-react";
import { Section, Stat } from "@/components/site/Page";
import homeHero from '@/assets/site/home-hero.jpg'

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Air Astana Virtual — Infinite Flight" },
      { name: "description", content: "Air Astana Virtual — a community-driven Infinite Flight virtual airline inspired by Kazakhstan's flag carrier and its Eurasian network." }
    ]
  }),
  component: Home
});

const stats = [
  { value: "2", label: "Primary hubs" },
  { value: "37", label: "Destinations" },
  { value: "74", label: "Published sectors" },
  { value: "5", label: "Aircraft types" }
];

function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("https://huqvffdiwqilbpxepfpo.supabase.co/rest/v1/crew_admin_settings?key=eq.public_site_news&select=value&limit=1", {
      headers: {
        apikey: "sb_publishable_kf4z7fjeqrd0yrh_jGmWDg_JhWl3J8j",
        Authorization: "Bearer sb_publishable_kf4z7fjeqrd0yrh_jGmWDg_JhWl3J8j"
      }
    })
      .then(r => r.ok ? r.json() : [])
      .then(rows => {
        const v = rows?.[0]?.value;
        setNews(Array.isArray(v) ? v.filter((x: any) => x?.active !== false) : []);
      })
      .catch(() => {});
  }, []);

  if (!news.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-2 sm:px-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="kicker"><Newspaper className="size-3"/> Latest news</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight">From the flight deck.</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {news.map((n: any) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setSelected(n)}
            className="group overflow-hidden rounded-[2rem] border border-border bg-white text-left shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="aspect-[16/7] overflow-hidden bg-muted">
              <img src={homeHero} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-black tracking-[-.03em]">{n.headline}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{n.subtext}</p>
              <div className="mt-5 text-[10px] font-black uppercase tracking-[.16em] text-primary">Click to view more information</div>
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-[#07101f]/70 p-4 backdrop-blur-md" onClick={() => setSelected(null)}>
          <article className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.image_url || selected.imageUrl} alt="" className="h-56 w-full object-cover sm:h-72"/>
              <button type="button" aria-label="Close news" onClick={() => setSelected(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur-md">
                <X className="size-5"/>
              </button>
            </div>
            <div className="max-h-[calc(90vh-18rem)] overflow-y-auto p-7 sm:p-9">
              <h2 className="text-3xl font-black tracking-[-.04em] sm:text-4xl">{selected.headline}</h2>
              <p className="mt-3 text-base font-semibold leading-7 text-muted-foreground">{selected.subtext}</p>
              <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-foreground/80">{selected.content}</div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-white">
        {/* Background Image Layer - Opacity increased to 80% */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src={homeHero} 
            alt="Hero background" 
            className="h-full w-full object-cover opacity-80"
          />
          {/* Subtle Left-to-Right Fade for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,#a4865615,transparent_27%),radial-gradient(circle_at_10%_90%,#1c2b4f10,transparent_24%)]" />
        </div>

        {/* Foreground Content Container */}
        <div className="relative z-10 mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div className="max-w-3xl">
            <div className="kicker"><span className="kicker-dot"/> Infinite Flight Virtual Airline</div>
            <h1 className="mt-5 display-xl">From the heart of <span className="text-primary">Eurasia.</span></h1>
            
            <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-foreground/80 sm:text-lg">
              Fly with Air Astana Virtual in Infinite Flight and use the same network our crew works from every day. Pick a published KC sector, choose the aircraft that fits the route, plan your flight, and log the hours with the rest of the crew. From short Kazakhstan sectors to long-haul flights into Europe and Asia, there is always another route to try.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/apply" className="inline-flex items-center gap-2 rounded-lg brand-gradient px-5 py-3 text-sm font-extrabold text-white shadow-brand transition hover:-translate-y-0.5">
                Join the crew <ArrowRight className="size-4"/>
              </Link>
              <Link to="/routes" className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-5 py-3 text-sm font-extrabold transition hover:bg-muted">
                Explore routes <ArrowRight className="size-4"/>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500"/> Network ready · Built for Infinite Flight
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[#1c2b4f]/90 backdrop-blur-sm p-6 text-white shadow-[0_28px_80px_-35px_rgba(28,43,79,.55)] sm:p-8">
            <div className="absolute inset-0 opacity-35" style={{backgroundImage:"radial-gradient(circle at 75% 20%,#a4865655,transparent 32%),linear-gradient(90deg,transparent 49.8%,#ffffff12 50%,transparent 50.2%),linear-gradient(0deg,transparent 49.8%,#ffffff12 50%,transparent 50.2%)",backgroundSize:"auto,56px 56px,56px 56px"}}/>
            <div className="relative flex h-full min-h-[308px] flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-[.2em] text-white/75">Air Astana Virtual</div>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/85">Operational</span>
              </div>
              <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-white/55">Route network</div>
                  <div className="mt-2 text-4xl font-black tracking-[-.06em]">74 sectors</div>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/70">From two Kazakhstan hubs across Central Asia, Europe and Asia.</p>
                  <Link to="/routes" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-extrabold text-[#17213a] shadow-lg">Browse the network <ArrowRight className="size-3.5"/></Link>
                </div>
                <div className="hidden size-36 items-center justify-center rounded-full border border-white/15 bg-white/5 sm:flex">
                  <div className="flex size-24 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                    <Plane className="size-12 rotate-[-12deg] text-white" strokeWidth={1.2}/>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                <div>
                  <div className="text-xl font-black">ALA</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/55">Almaty hub</div>
                </div>
                <div>
                  <div className="text-xl font-black">NQZ</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/55">Astana hub</div>
                </div>
                <div>
                  <div className="text-xl font-black">KC</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/55">IATA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-y border-border bg-[#fafafa]/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 overflow-hidden px-4 py-5 sm:px-6">
            <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-[.18em] text-muted-foreground">Our hubs</span>
            <div className="flex gap-8">
              <span className="text-xs font-black tracking-[.2em] text-foreground/70">ALA · ALMATY</span>
              <span className="text-xs font-black tracking-[.2em] text-foreground/70">NQZ · ASTANA</span>
            </div>
          </div>
        </div>
      </section>

      <Section className="!py-10 sm:!py-14">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-white md:grid-cols-4">
          {stats.map(stat => (
            <div key={stat.label} className="border-b border-border p-6 last:border-0 md:border-b-0 md:border-r md:last:border-0 sm:p-8">
              <Stat {...stat}/>
            </div>
          ))}
        </div>
      </Section>

      <NewsSection/>

      {/* Operational details section attracting pilots */}
      <Section eyebrow="Why Fly With Us" title="Built for dedicated virtual aviators." description="Designed to offer Infinite Flight pilots a structured, engaging, and rewarding environment.">
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <Navigation className="size-5" />
            </div>
            <h3 className="text-lg font-extrabold text-foreground">Realistic Dispatch & Operations</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Fly accurate Air Astana routes with real-world sector times, waypoints, and custom flight planning tailored to Infinite Flight.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <BarChart3 className="size-5" />
            </div>
            <h3 className="text-lg font-extrabold text-foreground">Automated PIREP System</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Seamlessly log your flight hours and statistics. Track your progression and climb through our rank structure effortlessly.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <Calendar className="size-5" />
            </div>
            <h3 className="text-lg font-extrabold text-foreground">Community & Group Events</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Join regular crew fly-ins, IFATC partner events, hub takeovers, and group flights across Europe and Asia.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="The experience" title="A crew centre for Eurasian flying." description="Everything you need to explore the Air Astana Virtual network, aircraft and pilot community.">
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/routes" className="group premium-card md:col-span-2 min-h-[250px] border-[#1c2b4f]/20 bg-[linear-gradient(145deg,#ffffff_0%,#f6f8fb_62%,#eef2f6_100%)] shadow-[0_18px_50px_-28px_rgba(28,43,79,.42)] transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_24px_60px_-32px_rgba(28,43,79,.55)]">
            <div className="absolute right-[-4rem] top-[-5rem] size-44 rounded-full bg-[#1c2b4f]/[0.035]"/>
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[#1c2b4f] text-white shadow-sm">
                    <Radio className="size-5"/>
                  </span>
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">74 sectors</span>
                </div>
                <h3 className="mt-8 text-3xl font-extrabold text-[#17213a]">Explore the network.</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#5f6b7d]">Follow published sectors from Almaty and Astana into Central Asia, the Caucasus, Europe and Asia.</p>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-[.14em] text-[#5f6b7d]">A320-200 · A321-200 · A321neo · 787-9 · 757-200</span>
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary">View routes <ArrowRight className="size-4 transition-transform group-hover:translate-x-1"/></span>
              </div>
            </div>
          </Link>
          
          <div className="premium-card">
            <Globe2 className="size-5 text-primary"/>
            <h3 className="mt-8 text-2xl font-extrabold">Two main hubs.</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Almaty and Astana anchor a network at the centre of Eurasia.</p>
            <Link to="/hubs" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary">View hubs <ArrowRight className="size-4"/></Link>
          </div>

          <div className="premium-card">
            <Plane className="size-5 text-primary"/>
            <h3 className="mt-8 text-2xl font-extrabold">Five-aircraft fleet.</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">A320-200, A321-200, A321neo, 787-9 and 757-200 cover the published network.</p>
            <Link to="/fleet" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary">Explore fleet <ArrowRight className="size-4"/></Link>
          </div>

          <div className="premium-card">
            <Users className="size-5 text-primary"/>
            <h3 className="mt-8 text-2xl font-extrabold">Fly with a crew.</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Meet the team, join events and build your pilot career one sector at a time.</p>
            <Link to="/staff" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary">Meet the crew <ArrowRight className="size-4"/></Link>
          </div>

          <div className="premium-card">
            <ShieldCheck className="size-5 text-primary"/>
            <h3 className="mt-8 text-2xl font-extrabold">Progress with purpose.</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">A clear rank structure turns every logged flight into part of a longer journey.</p>
            <Link to="/ranks" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary">View ranks <ArrowRight className="size-4"/></Link>
          </div>
        </div>
      </Section>

      <section className="mx-auto mb-16 max-w-7xl px-4 sm:px-6 sm:mb-20">
        <div className="overflow-hidden rounded-[2rem] brand-gradient text-white">
          <div className="relative px-7 py-12 sm:px-12 sm:py-16">
            <div className="absolute right-[-6rem] top-[-9rem] size-80 rounded-full border border-white/15"/>
            <div className="relative max-w-2xl">
              <div className="text-[10px] font-extrabold uppercase tracking-[.2em] text-white/70">Ready for departure?</div>
              <h2 className="mt-4 text-4xl font-extrabold leading-none tracking-[-.06em] sm:text-5xl">Your Eurasian journey starts here.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">Join Air Astana Virtual and make every Infinite Flight sector part of the network.</p>
              <Link to="/apply" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-extrabold text-[#17213a]">
                Apply now <ArrowRight className="size-4"/>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
