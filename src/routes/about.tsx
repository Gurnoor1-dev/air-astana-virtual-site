import { createFileRoute } from "@tanstack/react-router";
import { useEffect,useRef,useState,type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader,Section } from "@/components/site/Page";

export const Route=createFileRoute("/about")({head:()=>({meta:[{title:"About Us — Air Astana Virtual"},{name:"description",content:"Discover the story, purpose and community behind Air Astana Virtual."}]}),component:About});

function RevealParagraph({children,delay=0}:{children:ReactNode;delay?:number}) {
 const ref=useRef<HTMLParagraphElement>(null); const [visible,setVisible]=useState(false);
 useEffect(()=>{const el=ref.current;if(!el)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect()}},{threshold:.16,rootMargin:"0px 0px -8% 0px"});observer.observe(el);return()=>observer.disconnect()},[]);
 return <p ref={ref} style={{transitionDelay:visible?delay+"ms":"0ms"}} className={"max-w-4xl text-base leading-8 text-muted-foreground transition-all duration-700 sm:text-lg sm:leading-9 "+(visible?"translate-y-0 opacity-100":"translate-y-8 opacity-0")}>{children}</p>;
}

function About(){return <>
 <PageHeader eyebrow="About Air Astana Virtual" title="A virtual airline shaped by the people who fly it." subtitle="An independent Infinite Flight community inspired by Air Astana, built around realistic operations, shared flying and a distinctly Eurasian network."/>
 <Section eyebrow="Our story" title="Welcome to Air Astana Virtual."><div className="max-w-5xl space-y-10">
  <RevealParagraph>Air Astana Virtual is a community-driven virtual airline created for Infinite Flight pilots who want more than simply completing a flight. We bring the identity, routes and atmosphere of Air Astana into the simulator while building a place where pilots from different backgrounds can fly together, learn from one another and enjoy the hobby at their own pace.</RevealParagraph>
  <RevealParagraph delay={100}>The idea behind the VA is simple: give Air Astana a dedicated presence in the virtual skies while creating an experience that feels organised without becoming difficult to enjoy. Our network begins in Kazakhstan and stretches across Europe, Asia and the wider Eurasian region, giving every pilot room to discover a new route, aircraft or destination.</RevealParagraph>
  <RevealParagraph delay={150}>Whether you are opening Infinite Flight for the first time or already have hundreds of sectors behind you, you can find your own place here. Some pilots come for structured airline operations, others for group flights and community events, and many simply enjoy having a reason to explore the network. Air Astana Virtual is designed to make all of those reasons fit together.</RevealParagraph>
 </div></Section>
 <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6"><div className="grid gap-10 border-y border-border py-12 lg:grid-cols-[.7fr_1.3fr] lg:items-start lg:gap-20">
  <div><div className="kicker">Why we exist</div><h2 className="mt-4 max-w-md text-4xl font-black tracking-[-.05em] sm:text-5xl">Connecting pilots through the world of Air Astana.</h2></div>
  <div className="space-y-8"><RevealParagraph>Our aim is to represent Kazakhstan and its aviation story in a way that feels natural inside Infinite Flight. That means published sectors, recognisable hubs, a growing fleet and a community that can turn individual flights into shared experiences.</RevealParagraph><RevealParagraph delay={100}>We care about realism, but we also care about people. Rules and procedures should give a flight structure, not take away the enjoyment of it. The result we are working toward is a VA that feels professional when you want an airline-style operation and welcoming when you simply want to fly with friends.</RevealParagraph></div>
 </div></section>
 <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6"><div className="border-t border-border pt-10"><div className="kicker">Our identity</div><h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-.04em] sm:text-4xl">Built around aviation, community and the freedom to keep exploring.</h2><p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">Air Astana Virtual is an independent virtual airline made exclusively for the Infinite Flight platform. We are not owned by, operated by, sponsored by, endorsed by, or affiliated with Air Astana, its subsidiaries, or any other real-world airline or organisation. Air Astana names, logos and trademarks remain the property of their respective owners.</p><a href="/ceo-message" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary">Read the CEO's message <ArrowRight className="size-4"/></a></div></section>
 </>}