-- Membership schema for Supabase. Run this in the Supabase SQL editor.

-- 1) profiles table stores 1 row per auth user, including membership dates
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  membership_start timestamptz,
  membership_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep email in sync when possible
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- 2) RLS: users can read their own profile, but cannot write membership dates.
alter table public.profiles enable row level security;

drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- Note: the service role key bypasses RLS automatically; no explicit policy needed.

-- Optional: allow users to upsert their own email only (not membership dates)
-- Uncomment if you want users to write their email field themselves.
-- create policy "Update own email"
--   on public.profiles for update
--   to authenticated
--   using (auth.uid() = id)
--   with check (auth.uid() = id and (membership_start is null and membership_end is null));

-- 3) Helpful view (optional) for active status
create or replace view public.v_profiles_membership as
select
  p.id,
  p.email,
  p.membership_start,
  p.membership_end,
  (p.membership_end is not null and p.membership_end > now()) as is_active
from public.profiles p;

comment on table public.profiles is 'User profile and membership window tied to auth.users';
comment on view public.v_profiles_membership is 'Convenience view with an is_active flag';
