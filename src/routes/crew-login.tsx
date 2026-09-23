import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, LockKeyhole, Plane, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo.png";
import { CREW_API } from "@/lib/crew";

export const Route=createFileRoute("/crew-login")({component:CrewLogin});

function CrewLogin(){
  const signIn=()=>{window.location.href=CREW_API+"?action=start"};
  return <main className="min-h-[calc(100vh-72px)] overflow-hidden bg-[#07111f] text-white">
    <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
      <div className="absolute -left-24 top-20 size-72 rounded-full bg-[#d9bd7b]/10 blur-3xl"/>
      <div className="absolute -right-24 bottom-10 size-96 rounded-full bg-cyan-400/10 blur-3xl"/>
      <section className="relative">
        <img src={logo} alt="Air Astana Virtual" className="h-11 w-auto"/>
        <div className="mt-14 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[.18em] text-[#d9bd7b]">
          <span className="size-2 rounded-full bg-emerald-400"/> Secure crew access
        </div>
        <h1 className="mt-6 max-w-2xl text-5xl font-black tracking-[-.07em] sm:text-7xl">Welcome back to your <span className="text-[#d9bd7b]">flight deck.</span></h1>
        <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base">Sign in with Discord to access dispatch, ACARS verification, PIREP filing, rank progress and your Air Astana Virtual crew operations.</p>
        <button onClick={signIn} className="mt-9 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#101a2d] shadow-2xl transition hover:-translate-y-0.5">
          Continue with Discord <ArrowRight className="size-4"/>
        </button>
        <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
          {[["Discord identity","Verified server-side"],["Crew membership","Approved pilots only"],["Infinite Flight","Linked to your profile"]].map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-xs font-black">{a}</div><div className="mt-1 text-[10px] leading-5 text-white/40">{b}</div></div>)}
        </div>
      </section>
      <section className="relative rounded-[2.25rem] border border-white/10 bg-white/[.045] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="rounded-[1.75rem] bg-gradient-to-br from-[#17243b] to-[#0b1526] p-6 sm:p-8">
          <div className="flex items-center justify-between"><div className="grid size-12 place-items-center rounded-2xl bg-[#d9bd7b]/10 text-[#d9bd7b]"><Plane className="size-6"/></div><div className="text-[9px] font-black uppercase tracking-[.2em] text-white/35">Crew Center</div></div>
          <h2 className="mt-8 text-3xl font-black tracking-[-.04em]">One sign-in.<br/>One operational identity.</h2>
          <div className="mt-7 grid gap-3">
            {[["Discord OAuth","Your Discord account is the access key."],["Crew verification","Only an approved crew profile can continue."],["Secure session","A short-lived hand-off creates your Crew Center session."]].map(([a,b],i)=><div key={a} className="flex gap-3 rounded-2xl border border-white/8 bg-black/10 p-4"><div className="mt-0.5">{i===0?<ShieldCheck className="size-4 text-[#d9bd7b]"/>:i===1?<CheckCircle2 className="size-4 text-emerald-400"/>:<LockKeyhole className="size-4 text-cyan-300"/>}</div><div><div className="text-xs font-black">{a}</div><div className="mt-1 text-[10px] leading-5 text-white/40">{b}</div></div></div>)}
          </div>
          <div className="mt-7 rounded-2xl border border-[#d9bd7b]/15 bg-[#d9bd7b]/5 p-4 text-[10px] leading-5 text-white/45">This login is for approved Air Astana Virtual crew members. New applicants should use the public Join the crew application.</div>
        </div>
      </section>
    </div>
  </main>;
}
