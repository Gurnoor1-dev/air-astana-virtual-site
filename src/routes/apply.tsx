import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";

import { Card, PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply — Air Arabia Virtual" },
      {
        name: "description",
        content:
          "Apply to fly for Air Arabia Virtual in Infinite Flight. Review the requirements and submit your pilot application.",
      },
      { property: "og:title", content: "Apply — Air Arabia Virtual" },
      {
        property: "og:description",
        content: "Join Air Arabia Virtual and start flying the Air Arabia network in Infinite Flight.",
      },
    ],
  }),
  component: Apply,
});

type FormData = {
  name: string;
  infiniteFlightId: string;
  age: string;
  timezone: string;
  experience: string;
  favouriteAircraft: string;
  motivation: string;
  agree: boolean;
};

const initialForm: FormData = {
  name: "",
  infiniteFlightId: "",
  age: "",
  timezone: "",
  experience: "",
  favouriteAircraft: "",
  motivation: "",
  agree: false,
};

function Apply() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <>
        <PageHeader
          eyebrow="Application received"
          title="You're on the list."
          subtitle="Your application has been captured in this browser. The next step is for the Air Arabia Virtual staff team to review it through the community's chosen application workflow."
        />
        <Section>
          <Card className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl font-bold text-primary">✓</div>
            <h2 className="mt-5 text-2xl font-bold">Thanks, {form.name || "pilot"}.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Keep your Infinite Flight account details ready. If the VA later connects this form to a backend or application inbox, the same fields can be sent there without changing the page structure.
            </p>
            <button type="button" onClick={() => { setForm(initialForm); setSubmitted(false); }} className="mt-7 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-dark">Submit another application</button>
          </Card>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Join the crew"
        title="Apply to Air Arabia Virtual"
        subtitle="Tell us a little about yourself, your Infinite Flight experience and why you want to fly with us. There are no real-world aviation qualifications required to join a virtual airline."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-4">
            <Card>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Before you apply</p>
              <h2 className="mt-3 text-xl font-bold">What we look for</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li><span className="font-semibold text-foreground">Active on Infinite Flight.</span> We want pilots who enjoy actually flying and participating.</li>
                <li><span className="font-semibold text-foreground">Respectful communication.</span> Treat other pilots and staff members professionally.</li>
                <li><span className="font-semibold text-foreground">Reliable operations.</span> Follow the VA's published procedures and keep your flight records accurate.</li>
                <li><span className="font-semibold text-foreground">Community spirit.</span> Events, group flights and helping other members are part of the experience.</li>
              </ul>
            </Card>
            <Card className="bg-primary text-primary-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/75">Simple process</p>
              <div className="mt-5 space-y-5">
                {["Complete the application", "Staff review your details", "Receive your onboarding instructions"].map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold">{index + 1}</span>
                    <p className="pt-1 text-sm font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-5 sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Pilot application</h2>
                <p className="mt-1 text-sm text-muted-foreground">All fields marked with * are required.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" required><input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" className="form-input" /></Field>
                <Field label="Infinite Flight username / ID" required><input required value={form.infiniteFlightId} onChange={(e) => update("infiniteFlightId", e.target.value)} placeholder="Your Infinite Flight account" className="form-input" /></Field>
                <Field label="Age" required><input required min="13" max="120" type="number" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="13+" className="form-input" /></Field>
                <Field label="Timezone" required><input required value={form.timezone} onChange={(e) => update("timezone", e.target.value)} placeholder="e.g. UTC+5:30" className="form-input" /></Field>
              </div>
              <Field label="Infinite Flight experience" required>
                <select required value={form.experience} onChange={(e) => update("experience", e.target.value)} className="form-input">
                  <option value="">Select one</option><option value="new">New to Infinite Flight</option><option value="beginner">Less than 50 hours</option><option value="experienced">50–250 hours</option><option value="veteran">250+ hours</option>
                </select>
              </Field>
              <Field label="Favourite aircraft"><input value={form.favouriteAircraft} onChange={(e) => update("favouriteAircraft", e.target.value)} placeholder="e.g. A320neo" className="form-input" /></Field>
              <Field label="Why do you want to join Air Arabia Virtual?" required><textarea required minLength={20} value={form.motivation} onChange={(e) => update("motivation", e.target.value)} placeholder="Tell us what you want to get from the VA experience…" rows={5} className="form-input resize-y" /></Field>
              <label className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed">
                <input required type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--color-primary)]" />
                <span>I confirm that the information above is accurate and I agree to follow the Air Arabia Virtual community rules and operating procedures.</span>
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Submit application</button>
            </form>
          </Card>
        </div>
      </Section>
    </>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">{label}{required ? " *" : ""}</span>
      {children}
    </label>
  );
}
