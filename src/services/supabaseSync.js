import { supabase } from '@lib/supabaseClient'
import { totalWeeksForDuration } from '@services/dailyTaskEngine'
import { randomCheckThreshold, weaknessDelta } from '@services/levelCheckEngine'

/**
 * Ensures the browser has a Supabase session, even without a login form.
 * Uses Supabase's anonymous auth so every device gets a stable, private
 * user id — data is saved and RLS-protected without building a signup
 * screen first. (Anonymous Sign-ins must be enabled in the Supabase
 * dashboard: Authentication -> Providers -> Anonymous Sign-ins.)
 */
export async function ensureAuthSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) return session.user

    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) throw error
    return data?.user ?? null
  } catch (err) {
    console.warn('[Supabase] Could not start a session:', err.message)
    return null
  }
}

/**
 * Saves the quiz answers + chosen career field to the user's profile row.
 * Safe to call even if Supabase isn't configured yet — fails quietly.
 */
export async function saveQuizAnswers(answers, careerField) {
  const user = await ensureAuthSession()
  if (!user) return null

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    quiz_answers: answers,
    career_field: careerField,
    updated_at: new Date().toISOString(),
  })

  if (error) console.warn('[Supabase] saveQuizAnswers failed:', error.message)
  return user.id
}

/**
 * Creates a duration-based roadmap and inserts the first week's daily
 * tasks (day 1 unlocked as 'current', everything else 'locked').
 * `days` is the output of dailyTaskEngine.generateWeekBatch for week 1.
 */
export async function createDailyRoadmapInSupabase(field, durationMonths, days) {
  const user = await ensureAuthSession()
  if (!user || !days?.length) return null

  try {
    await supabase.from('roadmaps').update({ is_active: false }).eq('user_id', user.id)

    const { data: roadmap, error: roadmapErr } = await supabase
      .from('roadmaps')
      .insert({
        user_id: user.id,
        field,
        is_active: true,
        duration_months: durationMonths,
        tasks_since_check: 0,
        next_check_threshold: randomCheckThreshold(),
      })
      .select()
      .single()

    if (roadmapErr) throw roadmapErr

    const stepRows = []
    let globalIndex = 0
    days.forEach((day) => {
      day.tasks.forEach((task) => {
        stepRows.push({
          roadmap_id: roadmap.id,
          step_index: globalIndex,
          day_number: day.dayNumber,
          name: task.name,
          why: task.why,
          time_estimate: task.time,
          resource_url: task.resourceUrl,
          topic: task.topic,
          is_booster: !!task.isBooster,
          status: globalIndex === 0 ? 'current' : 'locked',
        })
        globalIndex++
      })
    })

    const { data: steps, error: stepsErr } = await supabase
      .from('roadmap_steps')
      .insert(stepRows)
      .select()

    if (stepsErr) throw stepsErr

    return {
      roadmapId: roadmap.id,
      totalWeeks: totalWeeksForDuration(durationMonths),
      steps: steps.sort((a, b) => a.step_index - b.step_index),
    }
  } catch (err) {
    console.warn('[Supabase] createDailyRoadmapInSupabase failed:', err.message)
    return null
  }
}

/** Appends another week's worth of daily tasks to an existing roadmap. */
export async function appendWeekBatch(roadmapId, days, startIndex) {
  if (!roadmapId || !days?.length) return null

  try {
    const stepRows = []
    let globalIndex = startIndex
    days.forEach((day) => {
      day.tasks.forEach((task) => {
        stepRows.push({
          roadmap_id: roadmapId,
          step_index: globalIndex,
          day_number: day.dayNumber,
          name: task.name,
          why: task.why,
          time_estimate: task.time,
          resource_url: task.resourceUrl,
          topic: task.topic,
          is_booster: !!task.isBooster,
          status: 'locked',
        })
        globalIndex++
      })
    })

    const { data: steps, error } = await supabase
      .from('roadmap_steps')
      .insert(stepRows)
      .select()

    if (error) throw error
    return steps.sort((a, b) => a.step_index - b.step_index)
  } catch (err) {
    console.warn('[Supabase] appendWeekBatch failed:', err.message)
    return null
  }
}

/**
 * Marks a task done, bumps the roadmap's tasks_since_check counter, and
 * returns the updated count + threshold so the caller can decide whether
 * to trigger a level check right now.
 */
export async function markTaskComplete(stepId, roadmapId) {
  if (!stepId) return null

  const { error: stepErr } = await supabase
    .from('roadmap_steps')
    .update({ status: 'done', completed_at: new Date().toISOString() })
    .eq('id', stepId)
  if (stepErr) console.warn('[Supabase] markTaskComplete failed:', stepErr.message)

  if (!roadmapId) return null

  const { data: roadmap, error: fetchErr } = await supabase
    .from('roadmaps')
    .select('tasks_since_check, next_check_threshold')
    .eq('id', roadmapId)
    .single()
  if (fetchErr) return null

  const tasksSinceCheck = (roadmap.tasks_since_check || 0) + 1
  await supabase
    .from('roadmaps')
    .update({ tasks_since_check: tasksSinceCheck })
    .eq('id', roadmapId)

  return { tasksSinceCheck, threshold: roadmap.next_check_threshold }
}

/** Records a level-check result and updates the per-topic weakness score. */
export async function recordLevelCheck(roadmapId, stepId, topic, question, userAnswer, wasCorrect) {
  const user = await ensureAuthSession()
  if (!user) return

  await supabase.from('level_checks').insert({
    user_id: user.id,
    triggered_after_step_id: stepId,
    topic,
    question,
    user_answer: userAnswer,
    was_correct: wasCorrect,
  })

  const { data: existing } = await supabase
    .from('weakness_profile')
    .select('weak_score')
    .eq('user_id', user.id)
    .eq('topic', topic)
    .maybeSingle()

  const newScore = Math.max(0, (existing?.weak_score || 0) + weaknessDelta(wasCorrect))

  await supabase.from('weakness_profile').upsert({
    user_id: user.id,
    topic,
    weak_score: newScore,
    last_checked_at: new Date().toISOString(),
  })

  // Reset the roadmap's check counter and randomize the next threshold.
  if (roadmapId) {
    await supabase
      .from('roadmaps')
      .update({ tasks_since_check: 0, next_check_threshold: randomCheckThreshold() })
      .eq('id', roadmapId)
  }
}

/** Returns topic names with the highest weak_score (used to bias the next week's tasks). */
export async function getTopWeakTopics(limit = 2) {
  const user = await ensureAuthSession()
  if (!user) return []

  const { data, error } = await supabase
    .from('weakness_profile')
    .select('topic, weak_score')
    .eq('user_id', user.id)
    .gt('weak_score', 0)
    .order('weak_score', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data || []).map((row) => row.topic)
}
