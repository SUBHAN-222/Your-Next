# YourNext — FINAL Setup Guide

## Setup (same as before — no new SQL migration this round)
1. npm install
2. Copy .env.example to .env, fill in Supabase + Qwen keys
3. Run these 3 SQL files in Supabase SQL Editor, in order (skip any
   already run):
   schema.sql -> migration_002_duration_daily_tasks.sql -> migration_003_task_feedback.sql
4. Enable Authentication -> Sign In / Providers -> Anonymous Sign-Ins
5. npm run dev

## New this round: Progress Dashboard
- Progress bar: % through the roadmap (tasks done / total planned tasks
  for the chosen duration)
- 4 stat cards: Tasks Done, Day Streak, Quiz Avg (across all surprise
  check-ins so far), Weak Topics count
- Shown in the sidebar next to "Full Roadmap" — always visible on
  desktop (900px+), collapses behind the "View Full Roadmap" toggle on
  mobile alongside the flashcards
- No new database columns needed — it reads from the level_checks and
  weakness_profile tables that already exist

## Push
git checkout -b feature/progress-dashboard
git add .
git commit -m "add progress dashboard: progress bar + stats cards"
git push origin feature/progress-dashboard
Then open a Pull Request into main and merge.
