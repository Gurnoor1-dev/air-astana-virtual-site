create table if not exists public.dispatch_participants (
  dispatch_id uuid not null references public.dispatches(id) on delete cascade,
  crew_member_id uuid not null references public.crew_members(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (dispatch_id, crew_member_id)
);

create index if not exists dispatch_participants_crew_member_id_idx
  on public.dispatch_participants(crew_member_id);

alter table public.dispatch_participants enable row level security;

revoke all on table public.dispatch_participants from anon, authenticated;
grant select, insert, update, delete on table public.dispatch_participants to service_role;
