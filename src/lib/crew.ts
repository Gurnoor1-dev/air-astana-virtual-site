import { createContext,useContext,useEffect,useMemo,useState,createElement,type ReactNode } from "react";
export const CREW_API="https://huqvffdiwqilbpxepfpo.supabase.co/functions/v1/crew-center";
type State={member:any;loading:boolean;request:(a:string,b?:Record<string,unknown>)=>Promise<any>;login:()=>void;logout:()=>void};
const C=createContext<State|null>(null),KEY="aav_crew_session";
export function CrewProvider({children}:{children:ReactNode}){const[member,setMember]=useState<any>(null),[loading,setLoading]=useState(true);
const request=async(a:string,b:Record<string,unknown>={})=>{const s=sessionStorage.getItem(KEY);if(!s)throw Error("Crew authentication required.");const r=await fetch(CREW_API+"?action="+encodeURIComponent(a),{method:"POST",headers:{Authorization:"Bearer "+s,"Content-Type":"application/json"},body:JSON.stringify(b)});const d=await r.json();if(!r.ok||d.ok===false)throw Error(d.error||"Crew request failed.");return d};
useEffect(()=>{const q=new URLSearchParams(location.search),s=q.get("crew_session");if(s){sessionStorage.setItem(KEY,s);history.replaceState({},document.title,location.pathname)}const saved=sessionStorage.getItem(KEY);if(!saved){setLoading(false);return}request("session").then(x=>setMember(x.member)).catch(()=>{sessionStorage.removeItem(KEY)}).finally(()=>setLoading(false))},[]);
const login=()=>{location.href="/crew-login"},logout=()=>{sessionStorage.removeItem(KEY);location.href="/crew-center"};const value=useMemo(()=>({member,loading,request,login,logout}),[member,loading]);return createElement(C.Provider,{value},children)}
export function useCrew(){const v=useContext(C);if(!v)throw Error("Crew context missing");return v}
