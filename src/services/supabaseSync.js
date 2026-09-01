import { supabase } from '@lib/supabaseClient'
import { totalWeeksForDuration } from '@services/dailyTaskEngine'
import { randomCheckThreshold, scoreQuiz, weaknessDeltaForTopic, weaknessDeltaForFeedback } from '@services/levelCheckEngine'

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
 * Marks a task done (with the user's "how did it go?" self-report),
 * bumps the roadmap's tasks_since_check counter, and returns the updated
 * count + threshold so the caller can decide whether to trigger a level
 * check right now.
 */
export async function markTaskComplete(stepId, roadmapId, feedback) {
  if (!stepId) return null

  const { error: stepErr } = await supabase
    .from('roadmap_steps')
    .update({
      status: 'done',
      completed_at: new Date().toISOString(),
      user_feedback: feedback || null,
    })
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

/** Nudges a topic's weak_score by the given delta (shared by quiz + self-report). */
async function bumpWeaknessForTopic(userId, topic, delta) {
  if (!topic) return

  const { data: existing } = await supabase
    .from('weakness_profile')
    .select('weak_score')
    .eq('user_id', userId)
    .eq('topic', topic)
    .maybeSingle()

  const newScore = Math.max(0, (existing?.weak_score || 0) + delta)

  await supabase.from('weakness_profile').upsert({
    user_id: userId,
    topic,
    weak_score: newScore,
    last_checked_at: new Date().toISOString(),
  })
}

/**
 * A task's "How did it go?" self-report also nudges the weakness profile —
 * "stuck" or "couldn't start" flags the topic for extra practice, same as
 * getting a level-check question wrong.
 */
export async function recordTaskFeedback(topic, feedback) {
  const user = await ensureAuthSession()
  if (!user || !topic) return
  await bumpWeaknessForTopic(user.id, topic, weaknessDeltaForFeedback(feedback))
}

/**
 * Records a full answered 10-question quiz: inserts one level_checks row
 * per question, updates weakness_profile once per distinct topic (net
 * correct vs wrong), and resets the roadmap's check counter.
 */
export async function recordLevelCheckQuiz(roadmapId, stepId, answeredQuestions) {
  const user = await ensureAuthSession()
  if (!user || !answeredQuestions?.length) return null

  const rows = answeredQuestions.map((q) => ({
    user_id: user.id,
    triggered_after_step_id: stepId,
    topic: q.topic,
    question: q.question,
    user_answer: q.selected,
    was_correct: q.wasCorrect,
  }))
  await supabase.from('level_checks').insert(rows)

  const { topicResults, weakTopics, scoreCount, total } = scoreQuiz(answeredQuestions)

  await Promise.all(
    Object.entries(topicResults).map(([topic, result]) =>
      bumpWeaknessForTopic(user.id, topic, weaknessDeltaForTopic(result))
    )
  )

  if (roadmapId) {
    await supabase
      .from('roadmaps')
      .update({ tasks_since_check: 0, next_check_threshold: randomCheckThreshold() })
      .eq('id', roadmapId)
  }

  return { weakTopics, scoreCount, total }
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

/**
 * Aggregate stats for the progress dashboard: overall quiz accuracy
 * across all level checks so far, and how many topics are currently
 * flagged as weak.
 */
export async function getProgressStats() {
  const user = await ensureAuthSession()
  if (!user) return { avgScore: null, weakTopicsCount: 0 }

  const { data: checks } = await supabase
    .from('level_checks')
    .select('was_correct')
    .eq('user_id', user.id)

  const total = checks?.length || 0
  const correct = checks?.filter((c) => c.was_correct).length || 0
  const avgScore = total > 0 ? Math.round((correct / total) * 100) : null

  const { count: weakCount } = await supabase
    .from('weakness_profile')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gt('weak_score', 0)

  return { avgScore, weakTopicsCount: weakCount || 0 }
}
