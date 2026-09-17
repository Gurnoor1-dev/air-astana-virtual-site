import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BriefcaseBusiness, Users } from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Our Staff — Air Arabia Virtual" },
      { name: "description", content: "Meet the team behind Air Arabia Virtual." },
    ],
  }),
  component: Staff,
});

// Update the CEO details and image URL here
const ceo = {
  name: "Gurnoor1",
  role: "Chief Executive Officer",
  dept: "Executive Management",
  about: "Sets the direction of the virtual airline and oversees the virtual operation across all hubs and flight departments.",
  avatarUrl: "https://sea1.discourse-cdn.com/infiniteflight/user_avatar/community.infiniteflight.com/gurnoor1/144/1653960_2.png", // Replace with your direct image URL
};

function Staff() {
  return (
    <>
      <PageHeader
        eyebrow="Crew directory"
        title="Leadership behind the scenes."
        subtitle="A virtual airline is its people. Meet the leadership keeping Air Arabia Virtual organized, active, and moving."
      />

      <Section>
        {/* Centered single card display for CEO */}
        <div className="mx-auto max-w-md">
          <Card className="relative overflow-hidden border border-border/80 bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              {/* Profile Avatar from direct URL */}
              <div className="relative size-16 overflow-hidden rounded-2xl border border-border shadow-inner bg-muted">
                <img
                  src={ceo.avatarUrl}
                  alt={ceo.name}
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    // Graceful fallback if URL fails to load
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              <div className="rounded-full border border-border/60 bg-muted/40 p-2 text-muted-foreground">
                <ArrowUpRight className="size-4" />
              </div>
            </div>

            <div className="mt-6">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                {ceo.dept}
              </span>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-foreground">
                {ceo.name}
              </h3>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {ceo.role}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {ceo.about}
              </p>
            </div>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Departments" title="One crew, different responsibilities.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <Users className="size-5 text-primary" />
            <h3 className="mt-5 text-xl font-extrabold text-foreground">Community & events</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Group flights, events and community engagement give pilots reasons to fly together.
            </p>
          </Card>
          <Card className="p-6">
            <BriefcaseBusiness className="size-5 text-primary" />
            <h3 className="mt-5 text-xl font-extrabold text-foreground">Operations & training</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Network, standards, progression and training keep the airline experience structured.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
