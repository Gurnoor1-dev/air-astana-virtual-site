create extension if not exists pgcrypto;

create table if not exists public.routes_access_codes (
  id bigint generated always as identity primary key,
  code_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.routes_access_sessions (
  id bigint generated always as identity primary key,
  session_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.routes_access_codes enable row level security;
alter table public.routes_access_sessions enable row level security;
revoke all on public.routes_access_codes from anon, authenticated;
revoke all on public.routes_access_sessions from anon, authenticated;

create or replace function public.redeem_routes_access_code(p_code_hash text, p_session_hash text, p_expires_at timestamptz)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id bigint; v_token text := encode(gen_random_bytes(32), 'hex');
begin
  update public.routes_access_codes
  set used_at = now()
  where code_hash = p_code_hash and used_at is null and expires_at > now()
  returning id into v_id;
  if v_id is null then return null; end if;
  insert into public.routes_access_sessions(session_hash, expires_at)
  values (encode(digest(v_token, 'sha256'), 'hex'), p_expires_at);
  return jsonb_build_object('session_token', v_token);
end; $$;

create or replace function public.validate_routes_access_session(p_session_hash text)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.routes_access_sessions where session_hash = p_session_hash and expires_at > now());
$$;
revoke all on function public.redeem_routes_access_code(text,text,timestamptz) from public, anon, authenticated;
revoke all on function public.validate_routes_access_session(text) from public, anon, authenticated;
grant execute on function public.redeem_routes_access_code(text,text,timestamptz) to service_role;
grant execute on function public.validate_routes_access_session(text) to service_role;
