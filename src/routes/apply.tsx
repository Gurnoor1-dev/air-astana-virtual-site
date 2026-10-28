import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  ExternalLink,
  Loader2,
  LockKeyhole,
  Plane,
  ShieldCheck,
  UserCheck,
  Award,
  Calendar,
  Radio,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply — Air Astana Virtual" },
      {
        name: "description",
        content:
          "Apply to Air Astana Virtual with Infinite Flight verification and Discord onboarding.",
      },
    ],
  }),
  component: Apply,
});

type Verify = {
  ifcUsername: string;
  eligible: boolean;
  currentGrade: number;
  expectedGrade: number;
  ifatc: boolean;
  checkRideRequired: boolean;
};

type FormState = {
  name: string;
  age: string;
  timezone: string;
  experience: string;
  favouriteAircraft: string;
  motivation: string;
  agreed: boolean;
  callsign: string;
};

const API =
  "https://huqvffdiwqilbpxepfpo.supabase.co/functions/v1/recruitment";
const steps = ["Infinite Flight", "Discord", "Profile", "Callsign"];
const initial: FormState = {
  name: "",
  age: "",
  timezone: "",
  experience: "",
  favouriteAircraft: "",
  motivation: "",
  agreed: false,
  callsign: "",
};

function Apply() {
  const [step, setStep] = useState(0);
  const [ifcUsername, setIfcUsername] = useState("");
  const [verify, setVerify] = useState<Verify | null>(null);
  const [discordTicket, setDiscordTicket] = useState("");
  const [discordLinked, setDiscordLinked] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState<{
    callsign: string;
    ifatc: boolean;
  } | null>(null);
  const [form, setForm] = useState(initial);

  const callsigns = useMemo(
    () => Array.from({ length: 900 }, (_, i) => `KC-${i + 100}`),
    []
  );

  useEffect(() => {
    const p = new URLSearchParams(window.location.search),
      ticket = p.get("discord_ticket"),
      oauthError = p.get("discord_error");

    if (oauthError) {
      setError("Discord authorization was not completed. Please try again.");
      return;
    }
    if (!ticket) return;

    try {
      const body = ticket
        .split(".")[0]
        .replaceAll("-", "+")
        .replaceAll("_", "/"),
        decoded = JSON.parse(
          atob(body + "=".repeat((4 - (body.length % 4)) % 4))
        );

      if (decoded.ifcUsername === "__CREW_LOGIN__") {
        window.location.replace("https://crew-center-air-astana-virtual.vercel.app/");
        return;
      }
    } catch {}

    setDiscordTicket(ticket);
    setLoading(true);
    fetch(`${API}?action=discord-resume&ticket=${encodeURIComponent(ticket)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok || !d.ok)
          throw new Error(d.error || "Discord hand-off expired.");
        setIfcUsername(d.ifcUsername);
        setDiscordLinked(d.discordUsername || "Discord user");

        const vr = await fetch(`${API}?action=verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: d.ifcUsername }),
        });
        const v = await vr.json();
        if (!vr.ok || !v.ok)
          throw new Error(
            v.error || "Infinite Flight verification failed."
          );
        setVerify(v);
        setStep(v.eligible ? 2 : 0);
      })
      .catch((e) =>
        setError(
          e instanceof Error
            ? e.message
            : "Discord hand-off expired. Please start again."
        )
      )
      .finally(() => setLoading(false));

    window.history.replaceState({}, "", "/apply");
  }, []);

  const update = (key: keyof FormState, value: string | boolean) =>
    setForm((v) => ({ ...v, [key]: value }));

  async function verifyAccount(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API}?action=verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: ifcUsername }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "Verification failed.");
      setVerify(d);
      if (d.eligible) setStep(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  function linkDiscord() {
    if (verify?.eligible)
      window.location.href = `${API}?action=discord-start&ifcUsername=${encodeURIComponent(
        verify.ifcUsername
      )}`;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!discordTicket || !verify?.eligible) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API}?action=complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discordTicket,
          ifcUsername: verify.ifcUsername,
          applicantName: form.name,
          age: form.age,
          timezone: form.timezone,
          experience: form.experience,
          favouriteAircraft: form.favouriteAircraft,
          motivation: form.motivation,
          agreed: form.agreed,
          callsign: form.callsign,
        }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok)
        throw new Error(d.error || "Could not finish onboarding.");
      setComplete(d);
      setStep(4);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not finish onboarding."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Recruitment · Discord based"
        title="Your KC callsign starts here."
        subtitle="A guided Air Astana Virtual application built around Infinite Flight verification, Discord identity linking and crew onboarding."
      />
      <Section>
        <div className="mx-auto max-w-5xl">
          {/* Enhanced Beautiful Requirements Section */}
          <div className="mb-8 rounded-[2.5rem] border border-primary/15 bg-gradient-to-b from-primary/[0.04] to-transparent p-6 sm:p-10 shadow-soft">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="kicker">
                  <ShieldCheck className="size-3.5 text-primary" /> Application
                  Criteria
                </div>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  Pilot Requirements & Exemption Rules
                </h2>
              </div>
              <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary">
                Verify Before Applying
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Review our onboarding requirements below. IFATC controllers enjoy a streamlined entry directly into operational status.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <RequirementCard
                icon={<Calendar className="size-5 text-primary" />}
                title="Minimum Age"
                description="Must be 13 years of age or older at the time of application."
              />
              <RequirementCard
                icon={<Award className="size-5 text-primary" />}
                title="Infinite Flight Grade"
                description="Grade 3 or higher on Infinite Flight required."
              />
              <RequirementCard
                icon={<UserCheck className="size-5 text-primary" />}
                title="Active Subscriptions"
                description="Valid Infinite Flight subscription and Discord access."
              />
              <RequirementCard
                icon={<ShieldAlert className="size-5 text-primary" />}
                title="IFC Standing"
                description="Account in good standing and not on the IFVARB blacklist."
              />
              <RequirementCard
                icon={<Clock className="size-5 text-primary" />}
                title="Flight Activity"
                description="Minimum activity requirement of at least 1 flight per month."
              />
              <RequirementCard
                icon={<Radio className="size-5 text-amber-500" />}
                title="IFATC CheckRide Exemption"
                badge="Exemption"
                description="You will be exempted from Essential Pilot CheckRide and Written Exam."
                footerText="Please enter your Infinite Flight Community Username, so we can verify your IFATC Status."
                highlight
              />
            </div>
          </div>

          {/* Form Wizard */}
          <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-[0_20px_70px_rgba(16,18,22,.06)]">
            <div className="grid grid-cols-4 border-b border-border">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={`px-2 py-4 text-center text-[10px] font-extrabold uppercase tracking-[.11em] sm:px-5 ${
                    i <= step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`mr-1.5 inline-flex size-6 items-center justify-center rounded-full text-[10px] ${
                      i < step
                        ? "bg-primary text-white"
                        : i === step
                        ? "bg-foreground text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? <Check className="size-3" /> : i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>

            <div className="p-6 sm:p-10">
              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {step === 0 && (
                <form
                  onSubmit={verifyAccount}
                  className="grid gap-8 lg:grid-cols-[1fr_.7fr]"
                >
                  <div>
                    <div className="kicker">
                      <ShieldCheck className="size-3" /> Secure verification
                    </div>
                    <h2 className="mt-4 text-4xl font-black tracking-[-.05em]">
                      Start with your{" "}
                      <span className="text-primary">IFC username.</span>
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                      We verify your account server-side against the Infinite
                      Flight Live API. Live verification data is used for the
                      active onboarding flow.
                    </p>
                    <label className="mt-8 block">
                      <span className="mb-2 block text-sm font-bold">
                        Infinite Flight / IFC Username
                      </span>
                      <input
                        required
                        value={ifcUsername}
                        onChange={(e) => setIfcUsername(e.target.value)}
                        className="form-input"
                        placeholder="e.g. Gurnoor1"
                      />
                    </label>
                    <button
                      disabled={loading}
                      className="mt-5 inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-4 text-sm font-extrabold text-white shadow-brand disabled:opacity-60"
                    >
                      {loading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="size-4" />
                      )}{" "}
                      Verify account <ArrowRight className="size-4" />
                    </button>
                  </div>
                  <Info
                    title="What happens next"
                    items={[
                      "Check Grade 3 eligibility",
                      "Check IFATC status",
                      "Link Discord",
                      "Choose a KC callsign",
                    ]}
                  />
                </form>
              )}

              {verify && step === 0 && (
                <div
                  className={`mt-8 rounded-3xl border p-6 ${
                    verify.eligible
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="rounded-full bg-white p-2 shadow-sm">
                      {verify.eligible ? (
                        <Check className="size-5 text-emerald-600" />
                      ) : (
                        <LockKeyhole className="size-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black">
                        {verify.eligible
                          ? `Grade ${verify.currentGrade} verified.`
                          : `Grade ${verify.currentGrade} — Grade ${verify.expectedGrade} is required.`}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {verify.eligible
                          ? verify.ifatc
                            ? "IFATC detected. You are exempt from the Air Astana Virtual Check Ride."
                            : "You are not IFATC. A Check Ride will be required during recruitment."
                          : "Your application stops here until your Infinite Flight grade reaches Grade 3."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-8 lg:grid-cols-[1fr_.7fr]">
                  <div>
                    <div className="kicker">
                      <ExternalLink className="size-3" /> Discord identity
                    </div>
                    <h2 className="mt-4 text-4xl font-black tracking-[-.05em]">
                      Connect the account you’ll{" "}
                      <span className="text-primary">use with the crew.</span>
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      Authorize Discord so the server-side bot can link your
                      identity, add you to the VA server and apply the correct
                      onboarding role.
                    </p>
                    <div className="mt-7 rounded-2xl bg-muted p-5">
                      <div className="text-xs font-extrabold uppercase tracking-[.16em] text-muted-foreground">
                        Verified IFC
                      </div>
                      <div className="mt-2 text-lg font-black">
                        {verify?.ifcUsername}
                      </div>
                    </div>
                    <button
                      onClick={linkDiscord}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-6 py-4 text-sm font-extrabold text-white shadow-lg"
                    >
                      Continue with Discord <ArrowRight className="size-4" />
                    </button>
                  </div>
                  <Info
                    title="Discord workflow"
                    items={[
                      "Identity is linked with OAuth2",
                      "Bot joins you to the VA server",
                      "Roles are assigned server-side",
                      "Non-IFATC applications go to recruitment",
                    ]}
                  />
                </div>
              )}

              {step === 2 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(3);
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="kicker">
                        <ClipboardCheck className="size-3" /> Pilot information
                      </div>
                      <h2 className="mt-3 text-3xl font-black">
                        Complete your crew profile.
                      </h2>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-extrabold text-emerald-700">
                      <Check className="mr-1 inline size-3" /> Discord linked
                      as {discordLinked || "Discord user"}
                    </div>
                  </div>
                  <div className="mt-7 grid gap-4 rounded-3xl border border-border bg-muted/60 p-5 sm:grid-cols-3">
                    <ReadOnly
                      label="Infinite Flight / IFC Username"
                      value={verify?.ifcUsername || ifcUsername}
                    />
                    <ReadOnly
                      label="Grade"
                      value={`Grade ${verify?.currentGrade ?? "—"}`}
                    />
                    <ReadOnly
                      label="ATC status"
                      value={
                        verify?.ifatc
                          ? "IFATC · Check Ride exempt"
                          : "Check Ride required"
                      }
                    />
                  </div>
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" required>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="form-input"
                      />
                    </Field>
                    <Field label="Age" required>
                      <input
                        required
                        type="number"
                        min="13"
                        value={form.age}
                        onChange={(e) => update("age", e.target.value)}
                        className="form-input"
                      />
                    </Field>
                    <Field label="Timezone" required>
                      <input
                        required
                        value={form.timezone}
                        onChange={(e) => update("timezone", e.target.value)}
                        className="form-input"
                        placeholder="UTC+5:30"
                      />
                    </Field>
                    <Field label="Infinite Flight experience" required>
                      <select
                        required
                        value={form.experience}
                        onChange={(e) =>
                          update("experience", e.target.value)
                        }
                        className="form-input"
                      >
                        <option value="">Select experience</option>
                        <option>New to Infinite Flight</option>
                        <option>Less than 50 hours</option>
                        <option>50–250 hours</option>
                        <option>250+ hours</option>
                      </select>
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="Favourite aircraft">
                      <input
                        value={form.favouriteAircraft}
                        onChange={(e) =>
                          update("favouriteAircraft", e.target.value)
                        }
                        className="form-input"
                        placeholder="A321neo LR"
                      />
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="Why do you want to join?" required>
                      <textarea
                        required
                        minLength={20}
                        rows={5}
                        value={form.motivation}
                        onChange={(e) => update("motivation", e.target.value)}
                        className="form-input resize-y"
                        placeholder="Tell the recruitment team what you want from the VA experience…"
                      />
                    </Field>
                  </div>
                  <label className="mt-5 flex gap-3 rounded-2xl bg-muted p-4 text-sm leading-6">
                    <input
                      required
                      type="checkbox"
                      checked={form.agreed}
                      onChange={(e) => update("agreed", e.target.checked)}
                      className="mt-1 size-4 accent-[var(--primary)]"
                    />
                    <span>
                      I confirm the information is accurate and agree to
                      follow Air Astana Virtual community rules and operating
                      procedures.
                    </span>
                  </label>
                  <div className="mt-8 flex justify-end">
                    <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-extrabold text-white">
                      Continue to callsign <ArrowRight className="size-4" />
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={submit}>
                  <div className="max-w-2xl">
                    <div className="kicker">
                      <Plane className="size-3" /> Callsign allocation
                    </div>
                    <h2 className="mt-4 text-4xl font-black tracking-[-.05em]">
                      Choose your <span className="text-primary">KC number.</span>
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      Choose KC-100 through KC-999. The backend performs the
                      final atomic reservation so a claimed number cannot be
                      assigned twice.
                    </p>
                    <label className="mt-8 block">
                      <span className="mb-2 block text-sm font-bold">
                        Preferred callsign
                      </span>
                      <select
                        required
                        value={form.callsign}
                        onChange={(e) => update("callsign", e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select a callsign</option>
                        {callsigns.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <div className="mt-5 rounded-2xl bg-muted p-5 text-sm leading-6 text-muted-foreground">
                      <b className="text-foreground">Discord nickname:</b>{" "}
                      {discordLinked || "Your Discord username"} (
                      {form.callsign || "KC-000"})
                    </div>
                    <button
                      disabled={loading}
                      className="mt-7 inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-4 text-sm font-extrabold text-white shadow-brand disabled:opacity-60"
                    >
                      {loading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}{" "}
                      Finish application
                    </button>
                  </div>
                </form>
              )}

              {step === 4 && complete && (
                <div className="mx-auto max-w-2xl py-8 text-center">
                  <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check className="size-9" />
                  </div>
                  <div className="kicker mt-7 justify-center">
                    Onboarding complete
                  </div>
                  <h2 className="mt-3 text-4xl font-black tracking-[-.05em]">
                    Welcome aboard,{" "}
                    <span className="text-primary">{complete.callsign}.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                    Discord is linked and your nickname has been updated.{" "}
                    {complete.ifatc
                      ? "You are on the IFATC onboarding path and are exempt from the Check Ride."
                      : "You are in the trainee workflow; recruitment will coordinate the Check Ride and review in Discord."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
            Infinite Flight Live API responses are used only for active
            verification and are not persisted as historical statistics.
          </p>
        </div>
      </Section>
    </>
  );
}

function RequirementCard({
  icon,
  title,
  description,
  badge,
  footerText,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  footerText?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all hover:shadow-md ${
        highlight
          ? "border-amber-300/80 bg-amber-50/40"
          : "border-border bg-white"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted/80">
            {icon}
          </div>
          {badge && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-800">
              {badge}
            </span>
          )}
        </div>
        <h3 className="mt-4 font-bold text-foreground">{title}</h3>
        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      {footerText && (
        <div className="mt-4 border-t border-amber-200/60 pt-3 text-[11px] font-medium leading-4 text-amber-900/80">
          {footerText}
        </div>
      )}
    </div>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl bg-muted p-6">
      <div className="text-xs font-extrabold uppercase tracking-[.16em] text-muted-foreground">
        {title}
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((x, i) => (
          <div key={x} className="flex gap-3 text-sm font-semibold">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-black">
              {i + 1}
            </span>
            {x}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold">
        {value}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">
        {label}
        {required && " *"}
      </span>
      {children}
    </label>
  );
}
