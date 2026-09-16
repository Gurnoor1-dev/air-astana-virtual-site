import { createFileRoute } from "@tanstack/react-router";

import { Card, PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Our Staff — Air Arabia Virtual" },
      {
        name: "description",
        content:
          "Meet the staff team running Air Arabia Virtual: management, operations, events, training and recruitment.",
      },
      { property: "og:title", content: "Our Staff — Air Arabia Virtual" },
      {
        property: "og:description",
        content: "The team behind Air Arabia Virtual and what each department handles.",
      },
    ],
  }),
  component: Staff,
});

const staff = [
  {
    name: "Add your CEO here",
    role: "Chief Executive Officer",
    dept: "Management",
    about: "Sets the direction of the airline and has the final say on network and policy changes.",
  },
  {
    name: "Add your COO here",
    role: "Chief Operating Officer",
    dept: "Operations",
    about: "Owns the route network, schedules and the CSV files that power the route map.",
  },
  {
    name: "Add your name here",
    role: "Head of Recruitment",
    dept: "Recruitment",
    about: "Reviews applications and gets new pilots onto the roster within 48 hours.",
  },
  {
    name: "Add your name here",
    role: "Head of Training",
    dept: "Training",
    about: "Runs checkrides for rank upgrades and helps new pilots with A320 procedures.",
  },
  {
    name: "Add your name here",
    role: "Events Manager",
    dept: "Events",
    about: "Plans group flights, fly-ins and hub takeovers across the week.",
  },
  {
    name: "Add your name here",
    role: "Media Manager",
    dept: "Media",
    about: "Handles screenshots, liveries and everything you see on this site.",
  },
];

function Staff() {
  return (
    <>
      <PageHeader
        eyebrow="Our Staff"
        title="The people keeping the airline flying"
        subtitle="Every department is run by volunteer Infinite Flight pilots. Replace these placeholders with your real team names and IFC handles."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => (
            <Card key={s.role}>
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full brand-gradient text-sm font-bold text-primary-foreground">
                  {s.dept.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs uppercase tracking-wider text-primary">{s.role}</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.about}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
