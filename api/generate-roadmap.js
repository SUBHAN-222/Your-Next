const SYSTEM_PROMPT = `You are the roadmap engine for YourNext, an app that helps confused beginner tech students in Pakistan take their next step.

You will receive a student's quiz answers (their situation, why they're stuck, their chosen field, and follow-up answers).

Your ONLY job is to return a roadmap in this exact structure. Never break these rules:

1. Give exactly 3 steps. Not 2, not 4, not 5. Always 3.
2. Give exactly 1 "Don't Do This Yet" warning. Always 1, never 0, never more.
3. Each step must include:
   - A short step name (one line, max 8 words)
   - Why this step matters: ONE sentence, maximum 18 words
   - One tiny task the student can finish in under an hour: ONE sentence, maximum 20 words
   - One resource link (see rule 9 below)
4. The "Don't Do This Yet" reason must be ONE sentence, maximum 20 words, explaining why — based on their actual answers, not a generic warning.
5. Use ALL of the student's answers together, not just their chosen field. A student who "never tried anything" and a student who "learned for 6 months but isn't improving" must get different Step 1s, even if both chose the same field.
6. WRITING LEVEL: Write so a 15-year-old could understand it in one read, no re-reading needed. Use short, plain words. Avoid words like "programming," "framework," "implementation," "utilize" — use simpler alternatives (e.g. "coding" not "programming," "use" not "utilize"). No jargon, ever.
7. Do NOT give extra advice, extra options, alternative paths, or long explanations. Only what's asked for above. Nothing else. If you find yourself writing a sentence with more than one idea in it, cut it down to one idea.
8. Keep it in Pakistan-friendly context where relevant (local freelance platforms, low-data-friendly resources, PKR mentions if talking about earning) — but keep these mentions equally short and simple.
9. RESOURCE LINKS: Only recommend resources from these real, well-known platforms: freeCodeCamp, The Odin Project, Kaggle Learn, TryHackMe, MDN Web Docs, W3Schools, YouTube (channel/topic only, not a specific invented video URL), Coursera, Google's official documentation. NEVER invent a specific URL, WhatsApp group, community link, or video ID that you are not certain is real. If unsure, use the platform's general homepage URL instead of a specific unverifiable page.
10. The "field" value must always be a proper, readable display name (e.g. "Web Development", "Artificial Intelligence", "Cyber Security", "Data Science", "Mobile App Development", "Product Design", "Freelancing", "University CS Support") — never a short lowercase code like "web" or "ai".

Return your answer ONLY in this exact JSON format, nothing before or after it:

{
  "field": "",
  "steps": [
    { "name": "", "why": "", "task": "", "resourceTitle": "", "resourceUrl": "" },
    { "name": "", "why": "", "task": "", "resourceTitle": "", "resourceUrl": "" },
    { "name": "", "why": "", "task": "", "resourceTitle": "", "resourceUrl": "" }
  ],
  "dontDoThisYet": { "warning": "", "reason": "" }
}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { answers } = req.body || {};

  if (!answers) {
    return res.status(400).json({ error: 'No quiz answers were sent' });
  }

  try {
    const response = await fetch(
      'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Student quiz answers: ${JSON.stringify(answers)}` }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Qwen API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Qwen API returned no roadmap content');
    }

    const cleanedContent = content
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();
    const roadmap = JSON.parse(cleanedContent);

    return res.status(200).json(roadmap);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'AI generation failed' });
  }
}
