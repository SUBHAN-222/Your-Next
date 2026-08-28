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
  ],
  "dontLearnYet": ["mistake 1", "mistake 2", "mistake 3", "mistake 4"]
}

Rules: EXACTLY 5 steps. No more, no less. This is critical. dontLearnYet: 3-4 specific things this exact student should NOT do yet based on where they are. Make them feel understood — like you know exactly where beginners go wrong. Free resources only (YouTube, freeCodeCamp, Odin Project, Kaggle, TryHackMe). Start from where the student actually is. Be encouraging and specific.`

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
    dontLearnYet: Array.isArray(raw.dontLearnYet) ? raw.dontLearnYet : [],
    steps: raw.steps.map((step) => ({
      name: step.name || 'Next step',
      why: step.why || '',
      whyMatters: step.whyMatters || step.why || '',
      time: step.time || '⏱️ 30 mins',
      resourceTitle: step.resourceTitle || step.resource || 'Free resource',
      resourceUrl: step.resourceUrl || '',
      task: step.task || 'Complete one small action today.',
    })).slice(0, 5),
  }
}

// Qwen via Alibaba Cloud Model Studio, OpenAI-compatible endpoint.
// The exact base URL is workspace/region-specific — if the default below
// doesn't work for your account, copy the correct base_url shown in your
// Model Studio console (API-KEY / Endpoints page) into VITE_AI_BASE_URL
// in your .env file, and set VITE_AI_MODEL if you want a different model.
const AI_BASE_URL =
  import.meta.env.VITE_AI_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'qwen-plus'

/**
 * Generate roadmap via Qwen (Alibaba Cloud Model Studio); falls back to
 * generateRoadmapData on any failure (missing key, network error, bad
 * response shape) so the app never breaks even if the AI call fails.
 */
export async function generateAIRoadmap(answers) {
  const apiKey = import.meta.env.VITE_AI_API_KEY

  if (!apiKey) {
    console.warn('[aiRoadmap] VITE_AI_API_KEY not set — using static fallback content.')
    return generateRoadmapData(answers)
  }

  try {
    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserMessage(answers) },
        ],
      }),
    })

    if (!response.ok) throw new Error(`API ${response.status}`)

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content
    if (!text) throw new Error('Empty response')

    return normalizePlan(extractJson(text))
  } catch (err) {
    console.warn('[aiRoadmap] AI call failed, using static fallback:', err.message)
    return generateRoadmapData(answers)
  }
}
