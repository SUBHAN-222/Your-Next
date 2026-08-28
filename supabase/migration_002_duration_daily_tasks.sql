-- ============================================================
-- YourNext — Migration 002: Duration + Daily Tasks + Level Checks
-- Run AFTER schema.sql. Supabase Dashboard -> SQL Editor -> New Query -> Run.
-- ============================================================

-- Roadmaps now track a chosen duration + how many tasks until the next
-- random "surprise" level check.
alter table public.roadmaps
  add column if not exists duration_months int default 6,
  add column if not exists tasks_since_check int default 0,
  add column if not exists next_check_threshold int default 6;

-- Steps now represent single daily tasks (2-3 per day) instead of 5 big
-- milestones. day_number groups tasks belonging to the same day.
alter table public.roadmap_steps
  add column if not exists day_number int default 1,
  add column if not exists topic text,
  add column if not exists is_booster boolean default false;

-- Speeds up "give me this roadmap's steps in order" queries as the list grows.
create index if not exists idx_roadmap_steps_roadmap_order
  on public.roadmap_steps (roadmap_id, step_index);
