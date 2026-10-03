import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles, BriefcaseBusiness, Users, Ban } from "lucide-react";
import { Card, Section } from "@/components/site/Page";

export const Route = createFileRoute("/staff")({
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
      { title: "Active Roster — Air Astana Virtual" },
      {
        name: "description",
        content: "Meet the dedicated staff members currently leading Air Astana Virtual.",
      },
    ],
  }),
  component: Staff,
});

const staffRoster = [
  {
    callsign: "#1",
    name: "Gurnoor1",
    role: "CEO & FOUNDER",
    dept: "Executive Management",
    bio: "Founder and Chief Executive Officer of Air Astana Virtual. IFATC Specialist. Previous experience as staff in Oman Air Virtual and Aeroflot Virtual, having worked as Events Manager, Chief Marketing Officer, and CEO.",
    avatarUrl:
      "https://sea1.discourse-cdn.com/infiniteflight/user_avatar/community.infiniteflight.com/gurnoor1/144/1653960_2.png",
    ifcUrl: "https://community.infiniteflight.com/u/gurnoor1/summary",
    stats: {
      grade: "Grade 3",
      flightTime: "1,380+ hrs",
      onlineFlights: "850+",
      landings: "450+",
      atcOps: "3700+",
    },
  },
];

function Staff() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className="font-jakarta min-h-screen bg-background text-foreground antialiased selection:bg-[#b89358]/20 selection:text-[#b89358]">
        {/* ACTIVE ROSTER HEADER */}
        <section className="pt-12 pb-6 sm:pt-20 sm:pb-8">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Active Roster
            </h1>
            <p className="mt-3 text-sm font-medium text-muted-foreground sm:text-base">
              Meet the dedicated staff members currently leading{" "}
              <span className="font-bold text-[#b89358]">Air Astana Virtual</span>.
            </p>
          </div>
        </section>

        {/* STAFF CARDS SECTION */}
        <section className="pb-16 sm:pb-24">
          <div className="mx-auto max-w-4xl space-y-8 px-5 sm:px-8">
            {staffRoster.map((member) => (
              <div
                key={member.name}
                className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card p-6 shadow-sm sm:p-10"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                  {/* Circular Avatar */}
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-border shadow-inner bg-muted sm:size-24">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                          {member.name}
                        </h2>
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#b89358]">
                          {member.role}
                        </span>
                      </div>
                      <span className="rounded-full bg-muted/60 px-3 py-1 font-mono text-xs font-bold text-muted-foreground">
                        {member.callsign}
                      </span>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground sm:text-sm sm:leading-6">
                      {member.bio}
                    </p>

                    {/* Stats Strip */}
                    <div className="mt-7 grid grid-cols-2 gap-3 border-y border-border/60 py-4 sm:grid-cols-5 sm:gap-4">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          IF Grade
                        </div>
                        <div className="mt-1 text-xs font-black text-foreground sm:text-sm">
                          {member.stats.grade}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Flight Time
                        </div>
                        <div className="mt-1 text-xs font-black text-[#b89358] sm:text-sm">
                          {member.stats.flightTime}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Online Flights
                        </div>
                        <div className="mt-1 text-xs font-black text-foreground sm:text-sm">
                          {member.stats.onlineFlights}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Landings
                        </div>
                        <div className="mt-1 text-xs font-black text-foreground sm:text-sm">
                          {member.stats.landings}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          ATC Ops
                        </div>
                        <div className="mt-1 text-xs font-black text-foreground sm:text-sm">
                          {member.stats.atcOps}
                        </div>
                      </div>
                    </div>

                    {/* IFC Link Button */}
                    <div className="mt-6 flex items-center">
                      <a
                        href={member.ifcUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-2 text-xs font-bold text-muted-foreground transition hover:border-[#b89358]/50 hover:bg-[#b89358]/5 hover:text-[#b89358]"
                      >
                        <span>INFINITE FLIGHT PROFILE</span>
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* FUTURE STAFF RECRUITMENT NOTICE */}
            <div className="pt-8">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#b89358]">
                Future Staff Recruitment
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                Staff Positions
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                We are preparing exciting leadership and operational roles to shape the future of{" "}
                <span className="font-semibold text-foreground">Air Astana Virtual</span>.
              </p>

              {/* No Positions Card */}
              <div className="mt-8 flex flex-col items-center justify-center rounded-[2rem] border border-border/80 bg-card/60 px-6 py-16 text-center shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
                  <Ban className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-extrabold tracking-tight text-foreground sm:text-lg">
                  No Open Positions Currently
                </h3>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Our staff team is currently complete. Follow our IFC announcements and Discord
                  server for upcoming recruitment drives and leadership opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DEPARTMENTS OVERVIEW */}
        <Section eyebrow="Departments" title="Different roles, one crew.">
          <div className="mx-auto max-w-4xl grid gap-4 sm:grid-cols-2">
            <Card className="rounded-[1.75rem] p-6 shadow-sm">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#b89358]/10 text-[#b89358]">
                <Users className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-foreground">
                Community &amp; Events
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Group flights and events give pilots a chance to meet, fly together and explore more of the network.
              </p>
            </Card>

            <Card className="rounded-[1.75rem] p-6 shadow-sm">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#b89358]/10 text-[#b89358]">
                <BriefcaseBusiness className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-foreground">
                Operations &amp; Training
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Network planning, pilot progression and training help keep our operations clear and consistent.
              </p>
            </Card>
          </div>
        </Section>
      </div>
    </>
  );
}
