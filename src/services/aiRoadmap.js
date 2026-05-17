import { generateRoadmapData } from '@data/roadmaps'

const SYSTEM_PROMPT = `You are YourNext, a tech education advisor for confused university students.
Return ONLY a raw JSON object. No markdown, no backticks, no explanation.

JSON structure:
{
  "field": "e.g. Web Development",
  "futurePath": ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"],
  "steps": [
    {
      "name": "Action-oriented step title (max 60 chars)",
      "why": "One sentence why this step matters for them specifically",
      "whyMatters": "2-3 sentences about deeper impact",
      "time": "⏱️ X mins",
      "resourceTitle": "Free resource name",
      "resourceUrl": "https://...",
      "task": "One tiny concrete task they can do right now"
    }
  ]
}

Rules: 4-6 steps only. Free resources only (YouTube, freeCodeCamp, Odin Project, Kaggle, TryHackMe). Start from where the student actually is. Be encouraging and specific.`

function buildUserMessage(answers) {
  const get = (i) => answers[i]?.val ?? 'unknown'
  return `Student profile:
- Main struggle: ${get(0)}
- Secondary context: ${get(1)}
- Interested in: ${get(2)}
- Specific focus: ${get(3)}
- Sub-preference: ${get(4)}
- Learning style: ${get(5)}

Generate a roadmap specifically for this student.`
}

function extractJson(text) {
  const trimmed = text.trim()
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON in response')
  return JSON.parse(trimmed.slice(start, end + 1))
}

function normalizePlan(raw) {
  if (!raw?.field || !Array.isArray(raw.steps) || raw.steps.length === 0) {
    throw new Error('Invalid plan shape')
  }

  return {
    field: raw.field,
    futurePath: Array.isArray(raw.futurePath) ? raw.futurePath : [],
    steps: raw.steps.map((step) => ({
      name: step.name || 'Next step',
      why: step.why || '',
      whyMatters: step.whyMatters || step.why || '',
      time: step.time || '⏱️ 30 mins',
      resourceTitle: step.resourceTitle || step.resource || 'Free resource',
      resourceUrl: step.resourceUrl || '',
      task: step.task || 'Complete one small action today.',
    })),
  }
}

/**
 * Generate roadmap via Anthropic API; falls back to generateRoadmapData on any failure.
 */
export async function generateAIRoadmap(answers) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserMessage(answers) }],
      }),
    })

    if (!response.ok) throw new Error(`API ${response.status}`)

    const data = await response.json()
    const text = data.content?.find((c) => c.type === 'text')?.text
    if (!text) throw new Error('Empty response')

    return normalizePlan(extractJson(text))
  } catch {
    return generateRoadmapData(answers)
  }
}
