import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, LockKeyhole, Plane, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo.png";
import { CREW_API } from "@/lib/crew";

export const Route=createFileRoute("/crew-login")({component:CrewLogin});

function CrewLogin(){
  const signIn=()=>{window.location.href=CREW_API+"?action=start"};
  return <main className="overflow-hidden bg-gradient-to-b from-background via-white to-[#f5f7fb] text-foreground">
    <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
      <div className="absolute -left-24 top-20 size-72 rounded-full bg-[#d9bd7b]/15 blur-3xl"/>
      <div className="absolute -right-24 bottom-10 size-96 rounded-full bg-primary/5 blur-3xl"/>
      <section className="relative">
        <img src={logo} alt="Air Astana Virtual" className="h-11 w-auto"/>
        <div className="mt-14 inline-flex items-center gap-2 rounded-full border border-[#b89358]/25 bg-[#b89358]/8 px-3 py-2 text-[10px] font-black uppercase tracking-[.18em] text-[#8f6e3f]">
          <span className="size-2 rounded-full bg-emerald-400"/> Secure crew access
        </div>
        <h1 className="mt-6 max-w-2xl text-5xl font-black tracking-[-.07em] sm:text-7xl">Welcome back to your <span className="text-[#d9bd7b]">flight deck.</span></h1>
        <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">Sign in with Discord to access dispatch, ACARS verification, PIREP filing, rank progress and your Air Astana Virtual crew operations.</p>
        <button onClick={signIn} className="mt-9 inline-flex items-center gap-3 rounded-2xl bg-[#1c2b4f] px-6 py-4 text-sm font-black text-white shadow-xl shadow-[#1c2b4f]/15 transition hover:-translate-y-0.5">
          Continue with Discord <ArrowRight className="size-4"/>
        </button>
        <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
          {[["Discord identity","Verified server-side"],["Crew membership","Approved pilots only"],["Infinite Flight","Linked to your profile"]].map(([a,b])=><div key={a} className="rounded-2xl border border-border bg-white p-4 shadow-sm"><div className="text-xs font-black">{a}</div><div className="mt-1 text-[10px] leading-5 text-muted-foreground">{b}</div></div>)}
        </div>
      </section>
      <section className="relative rounded-[2.25rem] border border-border bg-white p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl sm:p-8">
        <div className="rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-white to-[#f5f7fb] p-6 sm:p-8">
          <div className="flex items-center justify-between"><div className="grid size-12 place-items-center rounded-2xl bg-[#d9bd7b]/10 text-[#d9bd7b]"><Plane className="size-6"/></div><div className="text-[9px] font-black uppercase tracking-[.2em] text-muted-foreground">Crew Center</div></div>
          <h2 className="mt-8 text-3xl font-black tracking-[-.04em] text-foreground">One sign-in.<br/>One operational identity.</h2>
          <div className="mt-7 grid gap-3">
            {[["Discord OAuth","Your Discord account is the access key."],["Crew verification","Only an approved crew profile can continue."],["Secure session","A short-lived hand-off creates your Crew Center session."]].map(([a,b],i)=><div key={a} className="flex gap-3 rounded-2xl border border-border/70 bg-white p-4 shadow-sm"><div className="mt-0.5">{i===0?<ShieldCheck className="size-4 text-[#b89358]"/>:i===1?<CheckCircle2 className="size-4 text-emerald-400"/>:<LockKeyhole className="size-4 text-primary"/>}</div><div><div className="text-xs font-black">{a}</div><div className="mt-1 text-[10px] leading-5 text-muted-foreground">{b}</div></div></div>)}
          </div>
          <div className="mt-7 rounded-2xl border border-[#b89358]/20 bg-[#b89358]/8 p-4 text-[10px] leading-5 text-muted-foreground">This login is for approved Air Astana Virtual crew members. New applicants should use the public Join the crew application.</div>
        </div>
      </section>
    </div>
  </main>;
}
