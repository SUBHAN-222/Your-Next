-- ============================================================
-- YourNext — Migration 003: Task self-report feedback
-- Run AFTER schema.sql and migration_002. Supabase Dashboard -> SQL Editor.
-- ============================================================

alter table public.roadmap_steps
  add column if not exists user_feedback text
  check (user_feedback in ('completed', 'stuck', 'not_started'));
