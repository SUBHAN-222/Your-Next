# YourNext — FINAL Setup Guide

This is the complete, final project. Follow these steps exactly, in order.

## 1. Install dependencies
npm install

## 2. Create your .env file
Copy .env.example to .env, then fill in your Supabase keys:
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
(Get these from Supabase Dashboard -> Project Settings -> API,
or ask your teammate for the same keys used on Vercel)

## 3. Set up the database (Supabase SQL Editor, run BOTH, in order)
1. supabase/schema.sql
2. supabase/migration_002_duration_daily_tasks.sql

Also enable: Authentication -> Sign In / Providers -> Anonymous Sign-Ins (toggle ON)

## 4. Test locally
npm run dev
Open the localhost link -> complete the quiz -> pick a duration ->
you should see "Day 1 - Week 1 of X" with daily tasks.

## 5. Push to GitHub
git checkout -b feature/daily-roadmap-supabase
git add .
git commit -m "add supabase sync, duration-based daily tasks, surprise level checks"
git push origin feature/daily-roadmap-supabase
Then open a Pull Request on GitHub into main, and merge.
Vercel will auto-deploy once merged (env keys are already there).
