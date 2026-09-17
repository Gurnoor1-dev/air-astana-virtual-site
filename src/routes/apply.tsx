import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Check, ClipboardCheck, ExternalLink, Loader2, LockKeyhole, Plane, ShieldCheck } from "lucide-react";
import { PageHeader, Section } from "@/components/site/Page";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply — Air Arabia Virtual" },
      { name: "description", content: "Apply to Air Arabia Virtual with Infinite Flight verification and Discord onboarding." },
    ],
  }),
  component: Apply,
});

type Verify = { ifcUsername: string; eligible: boolean; currentGrade: number; expectedGrade: number; ifatc: boolean; checkRideRequired: boolean };
const API = "https://huqvffdiwqilbpxepfpo.supabase.co/functions/v1/recruitment";
const steps = ["Infinite Flight", "Discord", "Profile", "Callsign"];

function Apply() {
  const [step, setStep] = useState(0);
  const [ifcUsername, setIfcUsername] = useState("");
  const [verify, setVerify] = useState<Verify | null>(null);
  const [discordTicket, setDiscordTicket] = useState("");
  const [discordLinked, setDiscordLinked] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState<{ callsign: string; ifatc: boolean; checkRideRequired: boolean } | null>(null);
  const [form, setForm] = useState({ name: "", age: "", timezone: "", experience: "", favouriteAircraft: "", motivation: "", agreed: false, callsign: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ticket = params.get("discord_ticket");
    const err = params.get("discord_error");
    if (ticket) {
      setDiscordTicket(ticket);
      try {
        const body = JSON.parse(atob(ticket.split(".")[0].replaceAll("-", "+").replaceAll("_", "/") + "==="));
        setIfcUsername(String(body.ifcUsername || ""));
        setDiscordLinked({ username: String(body.discordUsername || "Discord user") });
        setStep(2);
      } catch { setError("Discord linked, but the secure hand-off could not be read. Please start the Discord step again."); }
      window.history.replaceState({}, "", "/apply");
    } else if (err) {
      setError("Discord authorization was not completed. Please try the Discord step again.");
      window.history.replaceState({}, "", "/apply");
    }
  }, []);

  const update = (key: keyof typeof form, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  async function verifyAccount(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch(`${API}?action=verify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: ifcUsername }) });
      const data = await response.json(); if (!response.ok || !data.ok) throw new Error(data.error || "Verification failed.");
      setVerify(data); if (data.eligible) setStep(1);
    } catch (e) { setError(e instanceof Error ? e.message : "Verification failed."); }
    finally { setLoading(false); }
  }

  function linkDiscord() {
    if (!verify?.eligible) return;
    window.location.href = `${API}?action=discord-start&ifcUsername=${encodeURIComponent(verify.ifcUsername)}`;
  }

  async function submitApplication(event: FormEvent) {
    event.preventDefault(); if (!discordTicket || !verify?.eligible) return;
    setLoading(true); setError("");
    try {
      const response = await fetch(`${API}?action=complete`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ discordTicket, ifcUsername: verify.ifcUsername, applicantName: form.name, age: form.age, timezone: form.timezone, experience: form.experience, favouriteAircraft: form.favouriteAircraft, motivation: form.motivation, agreed: form.agreed, callsign: form.callsign }) });
      const data = await response.json(); if (!response.ok || !data.ok) throw new Error(data.error || "Could not finish onboarding.");
      setComplete(data); setStep(4);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not finish onboarding."); }
    finally { setLoading(false); }
  }

  const callsigns = useMemo(() => Array.from({ length: 900 }, (_, index) => `G9-${String(index + 100)}`), []);

  return <>
    <PageHeader eyebrow="Recruitment · Discord based" title="Your callsign starts here." subtitle="A guided application built around Infinite Flight verification, Discord identity linking and automatic crew onboarding." />
    <Section>
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 overflow-hidden rounded-[2rem] border border-border bg-white shadow-[0_20px_70px_rgba(16,18,22,.06)]">
          <div className="grid grid-cols-4 border-b border-border">{steps.map((item, index) => <div key={item} className={`relative px-4 py-4 text-center text-[11px] font-extrabold uppercase tracking-[.16em] sm:px-6 ${index <= step ? "text-foreground" : "text-muted-foreground"}`}><span className={`mr-2 inline-flex size-6 items-center justify-center rounded-full text-[10px] ${index < step ? "bg-primary text-white" : index === step ? "bg-foreground text-white" : "bg-muted text-muted-foreground"}`}>{index < step ? <Check className="size-3" /> : index + 1}</span>{item}{index < steps.length - 1 && <span className="absolute right-0 top-1/2 hidden h-px w-8 -translate-y-1/2 bg-border sm:block" />}</div>)}</div>
          <div className="p-6 sm:p-10">
            {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">{error}</div>}
            {step === 0 && <form onSubmit={verifyAccount} className="grid gap-8 lg:grid-cols-[1fr_.72fr]"><div><div className="kicker"><ShieldCheck className="size-3" /> Secure verification</div><h2 className="mt-4 text-4xl font-black tracking-[-.05em]">Start with your <span className="text-primary">IFC username.</span></h2><p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">We verify the account server-side against the Infinite Flight Live API. Your API result is used for this application flow and is not stored as a permanent statistics record.</p><label className="mt-8 block"><span className="mb-2 block text-sm font-bold">Infinite Flight username</span><input autoFocus required value={ifcUsername} onChange={(e) => setIfcUsername(e.target.value)} className="form-input" placeholder="e.g. Gurnoor1" /></label><button disabled={loading} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full brand-gradient px-6 py-4 text-sm font-extrabold text-white shadow-brand disabled:opacity-60 sm:w-auto">{loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Verify account <ArrowRight className="size-4" /></button></div><InfoPanel title="What happens next" items={["Check Grade 3 eligibility", "Read your IFATC status", "Link your Discord account", "Choose your G9 callsign"]} /></form>}
            {step === 0 && verify && <div className={`mt-8 rounded-3xl border p-6 ${verify.eligible ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><div className="flex items-start gap-4"><div className="mt-1 rounded-full bg-white p-2 shadow-sm">{verify.eligible ? <Check className="size-5 text-emerald-600" /> : <LockKeyhole className="size-5 text-amber-600" />}</div><div><h3 className="font-black">{verify.eligible ? `Grade ${verify.currentGrade} verified — you can continue.` : `Grade ${verify.currentGrade} — Grade ${verify.expectedGrade} is required.`}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{verify.eligible ? verify.ifatc ? "IFATC status detected. You are exempt from the Air Arabia Virtual Check Ride." : "You are not IFATC at this time. A Check Ride will be required during recruitment." : "Your application stops here until your Infinite Flight grade reaches Grade 3."}</p></div></div></div>}
            {step === 1 && <div className="grid gap-8 lg:grid-cols-[1fr_.72fr]"><div><div className="kicker"><ExternalLink className="size-3" /> Discord identity</div><h2 className="mt-4 text-4xl font-black tracking-[-.05em]">Connect the account you’ll <span className="text-primary">use with the crew.</span></h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Discord authorization links your Discord identity to this application and lets the bot place you in the Air Arabia Virtual server. We request only the identity and server-join scopes needed for onboarding.</p><div className="mt-7 rounded-2xl bg-muted p-5"><div className="text-xs font-extrabold uppercase tracking-[.16em] text-muted-foreground">Verified IFC</div><div className="mt-2 text-lg font-black">{verify?.ifcUsername}</div></div><button onClick={linkDiscord} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5865F2] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 sm:w-auto">Continue with Discord <ArrowRight className="size-4" /></button></div><InfoPanel title="Why Discord?" items={["All crew conversations live there", "Announcements and onboarding are centralized", "The bot handles server roles", "Recruiters review non-IFATC applications there"]} /></div>}
            {step === 2 && <form onSubmit={(event) => { event.preventDefault(); setStep(3); }}><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="kicker"><ClipboardCheck className="size-3" /> Pilot information</div><h2 className="mt-3 text-3xl font-black">Complete your crew profile.</h2></div><div className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-extrabold text-emerald-700"><Check className="mr-1 inline size-3" /> Discord linked as {discordLinked?.username || "Discord user"}</div></div><div className="mt-7 grid gap-4 rounded-3xl border border-border bg-muted/60 p-5 sm:grid-cols-3"><ReadOnly label="Infinite Flight" value={verify?.ifcUsername || ifcUsername} /><ReadOnly label="Grade" value={`Grade ${verify?.currentGrade ?? "—"}`} /><ReadOnly label="ATC status" value={verify?.ifatc ? "IFATC · Check Ride exempt" : "Check Ride required"} /></div>{!verify?.ifatc && <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800"><b>Check Ride required.</b> You can continue the application; the recruitment team will use Discord to coordinate the Check Ride.</div>}{verify?.ifatc && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-6 text-emerald-800"><b>IFATC exemption.</b> Your current IFATC status means the Air Arabia Virtual Check Ride is skipped.</div>}<div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Full name" required><input required value={form.name} onChange={(e) => update("name", e.target.value)} className="form-input" placeholder="Your name" /></Field><Field label="Age" required><input required type="number" min="13" max="120" value={form.age} onChange={(e) => update("age", e.target.value)} className="form-input" placeholder="13+" /></Field><Field label="Timezone" required><input required value={form.timezone} onChange={(e) => update("timezone", e.target.value)} className="form-input" placeholder="UTC+5:30" /></Field><Field label="Infinite Flight experience" required><select required value={form.experience} onChange={(e) => update("experience", e.target.value)} className="form-input"><option value="">Select experience</option><option>New to Infinite Flight</option><option>Less than 50 hours</option><option>50–250 hours</option><option>250+ hours</option></select></Field></div><div className="mt-5"><Field label="Favourite aircraft"><input value={form.favouriteAircraft} onChange={(e) => update("favouriteAircraft", e.target.value)} className="form-input" placeholder="A320neo" /></Field></div><div className="mt-5"><Field label="Why do you want to join?" required><textarea required minLength={20} rows={5} value={form.motivation} onChange={(e) => update("motivation", e.target.value)} className="form-input resize-y" placeholder="Tell the recruitment team what you want from the VA experience…" /></Field></div><label className="mt-5 flex gap-3 rounded-2xl bg-muted p-4 text-sm leading-6"><input required type="checkbox" checked={form.agreed} onChange={(e) => update("agreed", e.target.checked)} className="mt-1 size-4 accent-[var(--primary)]" /><span>I confirm the information is accurate and I agree to follow Air Arabia Virtual community rules and operating procedures.</span></label><div className="mt-8 flex justify-end"><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-extrabold text-white">Continue to callsign <ArrowRight className="size-4" /></button></div></form>}
            {step === 3 && <form onSubmit={submitApplication}><div className="max-w-2xl"><div className="kicker"><Plane className="size-3" /> Callsign allocation</div><h2 className="mt-4 text-4xl font-black tracking-[-.05em]">Choose your <span className="text-primary">G9 number.</span></h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Pick a number from G9-100 through G9-999. The backend reserves it atomically, so a number cannot be assigned twice or override an admin reservation.</p><label className="mt-8 block"><span className="mb-2 block text-sm font-bold">Preferred callsign</span><select required value={form.callsign} onChange={(e) => update("callsign", e.target.value)} className="form-input"><option value="">Select a callsign</option>{callsigns.map((callsign) => <option key={callsign}>{callsign}</option>)}</select></label><div className="mt-5 rounded-2xl bg-muted p-5 text-sm leading-6 text-muted-foreground"><b className="text-foreground">Discord nickname:</b> {discordLinked?.username || "Your Discord username"} ({form.callsign || "G9-000"})</div><button disabled={loading} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full brand-gradient px-6 py-4 text-sm font-extrabold text-white shadow-brand disabled:opacity-60 sm:w-auto">{loading ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Finish application</button></div></form>}
            {step === 4 && complete && <div className="mx-auto max-w-2xl py-8 text-center"><div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check className="size-9" /></div><div className="kicker mt-7 justify-center">Onboarding complete</div><h2 className="mt-3 text-4xl font-black tracking-[-.05em]">Welcome aboard, <span className="text-primary">{complete.callsign}.</span></h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Your Discord account has been linked and your nickname has been updated. {complete.ifatc ? "Because you are IFATC, the Check Ride is exempted and your crew access has been assigned." : "You have been placed into the trainee workflow. Recruitment will handle the Check Ride and application review in Discord."}</p><div className="mt-7 rounded-3xl bg-[#111319] p-7 text-left text-white"><div className="text-xs font-extrabold uppercase tracking-[.16em] text-white/40">Next steps</div><ul className="mt-4 space-y-3 text-sm leading-6 text-white/70"><li>• Join the Air Arabia Virtual Discord channels you have been assigned.</li><li>• Keep your nickname as {discordLinked?.username} ({complete.callsign}).</li><li>• {complete.ifatc ? "Start with the crew and announcements." : "Watch Discord for the Check Ride and recruiter review."}</li></ul></div></div>}
          </div>
        </div>
        <p className="text-center text-xs leading-5 text-muted-foreground">Infinite Flight API data is used only for the live verification step and is not stored as a historical statistics record. Discord authorization is handled server-side.</p>
      </div>
    </Section>
  </>;
}
function InfoPanel({ title, items }: { title: string; items: string[] }) { return <div className="rounded-3xl bg-[#111319] p-7 text-white"><div className="text-xs font-extrabold uppercase tracking-[.16em] text-white/40">{title}</div><div className="mt-5 space-y-4">{items.map((item, index) => <div key={item} className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-black">0{index + 1}</span><span className="text-sm font-bold text-white/75">{item}</span></div>)}</div></div>; }
function ReadOnly({ label, value }: { label: string; value: string }) { return <div><div className="mb-2 text-[10px] font-extrabold uppercase tracking-[.15em] text-muted-foreground">{label}</div><div className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-foreground/70 shadow-sm">{value}</div></div>; }
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <label className="block space-y-2"><span className="text-sm font-bold">{label}{required ? " *" : ""}</span>{children}</label>; }
