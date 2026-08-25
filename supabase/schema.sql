-- ============================================================
-- YourNext — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- ============================================================

-- Supabase already gives us `auth.users` for login/signup.
-- We extend it with a `profiles` table for app-specific data.

-- ------------------------------------------------------------
-- 1. PROFILES — one row per user, holds quiz answers + current level
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  quiz_answers jsonb,              -- raw answers from onboarding quiz
  career_field text,               -- e.g. 'web', 'ai', 'data' (matches CAREER_PATHS keys)
  current_level text default 'beginner',   -- 'beginner' | 'intermediate' | 'advanced'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 2. ROADMAPS — one active roadmap per user (regenerated as level changes)
-- ------------------------------------------------------------
create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  field text not null,             -- career path
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 3. ROADMAP STEPS — individual tasks within a roadmap, strictly ordered
--    Only ONE step per roadmap should be 'current' at a time — this is
--    what enforces the "one task at a time" rule at the data layer.
-- ------------------------------------------------------------
create table if not exists public.roadmap_steps (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid references public.roadmaps(id) on delete cascade not null,
  step_index int not null,
  name text not null,
  why text,
  time_estimate text,
  resource_url text,
  status text default 'locked' check (status in ('locked', 'current', 'done')),
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique (roadmap_id, step_index)
);

-- ------------------------------------------------------------
-- 4. LEVEL CHECKS — the "surprise test" events (random interval, not fixed)
--    Stores the question shown, the user's answer, and whether it
--    revealed a strength or a weakness on a given topic.
-- ------------------------------------------------------------
create table if not exists public.level_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  triggered_after_step_id uuid references public.roadmap_steps(id),
  topic text not null,             -- which skill/concept this test targeted
  question text not null,
  user_answer text,
  was_correct boolean,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 5. WEAKNESS PROFILE — running per-topic score, updated after each level check.
--    This is what the AI reads before generating the NEXT task, so weak
--    topics get revisited instead of moving straight ahead.
-- ------------------------------------------------------------
create table if not exists public.weakness_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  topic text not null,
  weak_score numeric default 0,    -- higher = weaker; nudged up/down after each level check
  last_checked_at timestamptz default now(),
  unique (user_id, topic)
);

-- ------------------------------------------------------------
-- 6. PUSH SUBSCRIPTIONS — for daily browser push reminders
-- ------------------------------------------------------------
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  endpoint text not null unique,
  keys jsonb not null,             -- { p256dh, auth } from the browser's PushSubscription
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY — each user can only see/edit their own data.
-- Without this, anyone with the anon key could read everyone's data.
-- ============================================================

alter table public.profiles enable row level security;
alter table public.roadmaps enable row level security;
alter table public.roadmap_steps enable row level security;
alter table public.level_checks enable row level security;
alter table public.weakness_profile enable row level security;
alter table public.push_subscriptions enable row level security;

-- profiles: user can read/update only their own row
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- roadmaps: user can access only their own roadmaps
drop policy if exists "roadmaps_all_own" on public.roadmaps;
create policy "roadmaps_all_own" on public.roadmaps for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- roadmap_steps: user can access steps belonging to their own roadmap
drop policy if exists "roadmap_steps_all_own" on public.roadmap_steps;
create policy "roadmap_steps_all_own" on public.roadmap_steps for all
  using (
    exists (select 1 from public.roadmaps r where r.id = roadmap_id and r.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.roadmaps r where r.id = roadmap_id and r.user_id = auth.uid())
  );

-- level_checks: user can access only their own test history
drop policy if exists "level_checks_all_own" on public.level_checks;
create policy "level_checks_all_own" on public.level_checks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- weakness_profile: user can access only their own weakness scores
drop policy if exists "weakness_profile_all_own" on public.weakness_profile;
create policy "weakness_profile_all_own" on public.weakness_profile for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- push_subscriptions: user can access only their own subscription
drop policy if exists "push_subscriptions_all_own" on public.push_subscriptions;
create policy "push_subscriptions_all_own" on public.push_subscriptions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Helper: keep only one 'current' step per roadmap.
-- When a step is marked 'done', automatically unlock the next one.
-- ============================================================
create or replace function public.advance_roadmap_step()
returns trigger as $$
begin
  if new.status = 'done' and old.status <> 'done' then
    update public.roadmap_steps
    set status = 'current'
    where roadmap_id = new.roadmap_id
      and step_index = new.step_index + 1
      and status = 'locked';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_advance_roadmap_step on public.roadmap_steps;
create trigger trg_advance_roadmap_step
  after update on public.roadmap_steps
  for each row execute function public.advance_roadmap_step();
