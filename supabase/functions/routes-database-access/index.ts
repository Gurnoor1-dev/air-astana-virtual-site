import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "https://air-astana-virtual.vercel.app", "Access-Control-Allow-Headers": "content-type, x-bot-secret", "Access-Control-Allow-Methods": "POST, OPTIONS", "Content-Type": "application/json" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });
const hex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
async function digest(value: string) { return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))); }
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const botSecret = Deno.env.get("BOT_API_SECRET");
  const db = createClient(url, serviceKey, { auth: { persistSession: false } });
  try {
    const body = await req.json();
    if (body.action === "issue") {
      if (!botSecret || req.headers.get("x-bot-secret") !== botSecret) return json({ error: "Unauthorized" }, 401);
      const code = Array.from(crypto.getRandomValues(new Uint8Array(9)), b => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");
      const codeHash = await digest(code);
      const { error } = await db.from("routes_access_codes").insert({ code_hash: codeHash, expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() });
      if (error) throw error;
      return json({ code, expiresInSeconds: 600 });
    }
    if (body.action === "redeem") {
      const code = String(body.code || "").trim().toUpperCase();
      if (!/^[A-HJ-NP-Z2-9]{9}$/.test(code)) return json({ error: "Invalid or expired code." }, 400);
      const { data, error } = await db.rpc("redeem_routes_access_code", { p_code_hash: await digest(code), p_session_hash: await digest(crypto.randomUUID()), p_expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() });
      if (error) throw error;
      if (!data?.session_token) return json({ error: "Invalid, expired, or already-used code." }, 401);
      return json({ sessionToken: data.session_token, expiresInSeconds: 3600 });
    }
    if (body.action === "validate") {
      const token = String(body.sessionToken || "");
      if (!token) return json({ valid: false }, 401);
      const { data, error } = await db.rpc("validate_routes_access_session", { p_session_hash: await digest(token) });
      if (error) throw error;
      return json({ valid: Boolean(data) });
    }
    return json({ error: "Unknown action." }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: "Request failed." }, 500);
  }
});