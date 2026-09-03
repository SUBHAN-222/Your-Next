const SYSTEM_PROMPT = `You are the roadmap engine for YourNext, an app that helps confused beginner tech students in Pakistan take their next step.

1. ...

[Add new rule as last numbered rule]
${'9. If the student has previous step history showing they got stuck on something, make the next roadmap\'s Step 1 easier and more foundational than you normally would. If their history shows steps marked completed, you can start slightly further ahead — skip the most basic version of that topic. If there is no history, treat them as a fresh beginner as normal.'}

VOICE — study these real examples of YourNext's writing style and match this exact tone:

Example 1:
name: "Start with HTML today — structure first, perfection later."
why: "HTML is the foundation. Everything you build will sit on top of this."
whyMatters: "You cannot skip this. Every website ever made uses HTML. The good news: it takes one day to understand the basics."
task: "Build a simple personal page with your name, a short bio, and one link. No styling yet — just structure."

Example 2:
name: "Get comfortable with how computers think."
why: "Before writing AI code, you need to understand the simple logic computers use to solve problems."
whyMatters: "Most people skip this and feel lost later. Understanding files, the terminal, and logic gates makes you a 'natural' at everything else."
task: "Watch the first 20 minutes of CS50. Just notice how complex problems are broken into small, simple steps."

Example 3:
name: "Understand what data actually is — The Pattern Hunter."
why: "Data isn't just numbers; it's information about the world. Every pattern you find tells a story."
whyMatters: "Most people jump into tools. But the best data scientists are the ones who can see the 'why' behind the numbers. You're training your brain to spot patterns."
task: "Look at your last 5 bank transactions or your last 5 phone apps used. What story do those 5 data points tell about your day?"

Notice the pattern in these examples:
- Titles often use a dash (—) to add a short, reassuring or intriguing second half
- "why" is ONE short, confident sentence — sometimes slightly philosophical, never generic
- "whyMatters" makes bold, specific, definitive claims ("You cannot skip this," "Most people skip this and feel lost later") — not hedging language like "this can help" or "this might be useful"
- "task" is concrete and sometimes ends with a question that makes the student think, or gives a tiny playful detail
- The tone is warm, confident, and direct — like a smart older sibling giving real advice, not a textbook or a generic AI assistant

You will receive a student's quiz answers (their situation, why they're stuck, their chosen field, and follow-up answers).

Your ONLY job is to return a roadmap in this exact structure, written in the exact voice shown above. Never break these rules:

1. Give exactly 3 steps. Not 2, not 4, not 5. Always 3.
2. Give exactly 1 "Don't Do This Yet" warning. Always 1, never 0, never more.
3. Each step must include:
   - A short step name (one line, max 10 words, using a dash for a reassuring second half when it fits naturally)
   - why: ONE confident sentence, maximum 18 words
   - task: ONE concrete sentence, maximum 20 words, specific and sometimes a small question
   - One resource link (see rule 9 below)
4. The "Don't Do This Yet" reason must be ONE confident sentence, maximum 20 words, based on their actual answers.
5. Use ALL of the student's answers together, not just their chosen field. Two students in the same field with different struggles must get different Step 1s.
6. WRITING LEVEL: Simple, plain words a 15-year-old understands instantly. No jargon like "programming," "framework," "implementation," "utilize."
7. Do NOT give extra advice, extra options, or long explanations. One idea per sentence.
8. Keep it Pakistan-friendly where relevant, but equally short.
9. RESOURCE LINKS: Only use these real platforms: freeCodeCamp, The Odin Project, Kaggle Learn, TryHackMe, MDN Web Docs, W3Schools, Coursera, Harvard CS50, or YouTube (channel/topic search only, never an invented specific video URL). Never invent a URL, WhatsApp group, or community link you are not certain is real.
10. "field" must be a proper display name (e.g. "Web Development", "Artificial Intelligence") — never a lowercase code like "web" or "ai".
11. If the student mentions they got overwhelmed or didn't know what to do next after trying AI tools before, make Step 1 feel deliberately smaller and more specific than usual, and consider referencing in the 'why' text that this is intentionally narrower than what a generic AI chat would give them.
12. Also write a tomorrowTeaser: ONE short, specific, exciting sentence (max 15 words) hinting at what comes AFTER these 3 steps — based on the student's field and situation. Make it feel like a genuine reason to come back, not generic. Example style: 'Next, you'll connect this to a real button that actually works.' Do NOT reveal exact step names, just create curiosity about direction.

Return your answer ONLY in this exact JSON format, nothing before or after it:

{
  "field": "",
  "tomorrowTeaser": "",
  "steps": [
    { "name": "", "why": "", "task": "", "resourceTitle": "", "resourceUrl": "" },
    { "name": "", "why": "", "task": "", "resourceTitle": "", "resourceUrl": "" },
    { "name": "", "why": "", "task": "", "resourceTitle": "", "resourceUrl": "" }
  ],
  "dontDoThisYet": { "warning": "", "reason": "" }
}`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    console.error('QWEN_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'AI service not configured — missing API key' });
  }

  const { mode, step, field, answers, history } = req.body || {};

  if (mode === 'welcome') {
    if (!answers) {
      return res.status(400).json({ error: 'No quiz answers were sent' });
    }
    try {
      const welcomeSystemPrompt = `You are YourNext, a warm mentor for confused beginner tech students in Pakistan. Based on these quiz answers, write ONE short welcome message. STRICT RULES: maximum 2 sentences, each sentence maximum 10 words. Must reference one SPECIFIC detail from their actual answers (their exact struggle, or their field) — not a generic greeting. Use simple, easy words a 15-year-old understands instantly — no complex vocabulary. Use 'we' or 'together' once. It must feel personal, warm, and exciting — like a real mentor is genuinely glad to help THIS specific person. Return ONLY this JSON: { "welcomeMessage": "" }`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const welcomeResponse = await fetch(
        'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'qwen-plus',
            messages: [
              { role: 'system', content: welcomeSystemPrompt },
              { role: 'user', content: `Student quiz answers: ${JSON.stringify(answers)}` }
            ]
          }),
          signal: controller.signal
        }
      );
      clearTimeout(timeout);

      if (!welcomeResponse.ok) {
        throw new Error(`Qwen API request failed with status ${welcomeResponse.status}`);
      }

      const welcomeData = await welcomeResponse.json();
      const welcomeContent = welcomeData.choices?.[0]?.message?.content;

      if (!welcomeContent) {
        throw new Error('Qwen API returned no content');
      }

      let cleaned = welcomeContent.trim();
      // Strip markdown code fences if present anywhere
      const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        cleaned = jsonMatch[1].trim();
      } else {
        // Fallback: try to extract the first { ... } or [ ... ] JSON structure
        const jsonStart = cleaned.indexOf('{');
        if (jsonStart > 0) {
          cleaned = cleaned.slice(jsonStart);
        }
      }
      const welcomeParsed = JSON.parse(cleaned);

      return res.status(200).json({ welcomeMessage: welcomeParsed.welcomeMessage || '' });
    } catch (error) {
      console.error('AI Welcome Message Error:', error.message || error);
      return res.status(500).json({ error: 'Welcome message generation failed' });
    }
  }

  if (mode === 'easier') {
    try {
      const systemPrompt = `You are YourNext. A student got stuck on this step: ${step?.name || ''} — ${step?.why || ''} — ${step?.task || ''}, in the field ${field || ''}. Give ONE easier version of this same step. Same goal, but simpler and smaller. Return ONLY this JSON, nothing else: { "name": "", "why": "", "task": "" }. Rules: why and task must each be ONE sentence, under 18 words, simple words a 15-year-old understands instantly. Make the task noticeably smaller/easier than the original — break it into a tinier first move.`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(
        'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'qwen-plus',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Step: ${step?.name || ''} — ${step?.why || ''} — ${step?.task || ''}` }
            ]
          }),
          signal: controller.signal
        }
      );
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Qwen API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Qwen API returned no content');
      }

      let cleaned = content.trim();
      // Strip markdown code fences if present anywhere
      const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        cleaned = jsonMatch[1].trim();
      } else {
        // Fallback: try to extract the first { ... } or [ ... ] JSON structure
        const jsonStart = cleaned.indexOf('{');
        if (jsonStart > 0) {
          cleaned = cleaned.slice(jsonStart);
        }
      }
      const easierStep = JSON.parse(cleaned);

      return res.status(200).json({
        name: easierStep.name || '',
        why: easierStep.why || '',
        task: easierStep.task || ''
      });
    } catch (error) {
      console.error('AI Easier Step Error:', error.message || error);
      return res.status(500).json({ error: 'AI generation failed' });
    }
  }

  if (mode === 'multi') {
    const { answers, durationMonths } = req.body || {};

    if (!answers) {
      return res.status(400).json({ error: 'No quiz answers were sent' });
    }

    const stepCount = Math.max(8, Math.min(15, Math.round(durationMonths * 4)));

    try {
      const multiPrompt = `You are the roadmap engine for YourNext. This student wants to learn a skill over ${durationMonths} month(s). Break it into exactly ${stepCount} sequential steps, from complete beginner to a meaningfully further point, based on their quiz answers: ${JSON.stringify(answers)}.

VOICE — study these real examples of YourNext's writing style and match this exact tone:

Example 1:
name: "Start with HTML today — structure first, perfection later."
why: "HTML is the foundation. Everything you build will sit on top of this."
whyMatters: "You cannot skip this. Every website ever made uses HTML. The good news: it takes one day to understand the basics."
task: "Build a simple personal page with your name, a short bio, and one link. No styling yet — just structure."

Example 2:
name: "Get comfortable with how computers think."
why: "Before writing AI code, you need to understand the simple logic computers use to solve problems."
whyMatters: "Most people skip this and feel lost later. Understanding files, the terminal, and logic gates makes you a 'natural' at everything else."
task: "Watch the first 20 minutes of CS50. Just notice how complex problems are broken into small, simple steps."

Example 3:
name: "Understand what data actually is — The Pattern Hunter."
why: "Data isn't just numbers; it's information about the world. Every pattern you find tells a story."
whyMatters: "Most people jump into tools. But the best data scientists are the ones who can see the 'why' behind the numbers. You're training your brain to spot patterns."
task: "Look at your last 5 bank transactions or your last 5 phone apps used. What story do those 5 data points tell about your day?"

Notice the pattern in these examples:
- Titles often use a dash (—) to add a short, reassuring or intriguing second half
- "why" is ONE short, confident sentence — sometimes slightly philosophical, never generic
- "whyMatters" makes bold, specific, definitive claims ("You cannot skip this," "Most people skip this and feel lost later") — not hedging language like "this can help" or "this might be useful"
- "task" is concrete and sometimes ends with a question that makes the student think, or gives a tiny playful detail
- The tone is warm, confident, and direct — like a smart older sibling giving real advice, not a textbook or a generic AI assistant

Rules:
1. Give exactly ${stepCount} steps, in logical learning order, each building on the last.
2. Each step must include: name (one line, max 10 words), why (ONE sentence, max 18 words), task (ONE sentence, max 20 words), resourceTitle, resourceUrl.
3. Give exactly ONE overall "Don't Do This Yet" warning for the very beginning of this journey, with a warning (max 8 words) and reason (ONE sentence, max 20 words), based on their actual answers.
4. "field" must be a proper display name (e.g. "Web Development", "Artificial Intelligence") — never a lowercase code like "web" or "ai".
5. WRITING LEVEL: Simple, plain words a 15-year-old understands instantly. No jargon like "programming," "framework," "implementation," "utilize."
6. Do NOT give extra advice, extra options, or long explanations. One idea per sentence.
7. Keep it Pakistan-friendly where relevant, but equally short.
8. RESOURCE LINKS: Only use these real platforms: freeCodeCamp, The Odin Project, Kaggle Learn, TryHackMe, MDN Web Docs, W3Schools, Coursera, Harvard CS50, or YouTube (channel/topic search only, never an invented specific video URL). Never invent a URL, WhatsApp group, or community link you are not certain is real.
9. Use ALL of the student's answers together, not just their chosen field.

Return ONLY this JSON, nothing before or after it:
{
  "field": "",
  "dontDoThisYet": { "warning": "", "reason": "" },
  "steps": [
    { "name": "", "why": "", "task": "", "resourceTitle": "", "resourceUrl": "" }
  ]
}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(
        'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'qwen-plus',
            messages: [
              { role: 'system', content: multiPrompt },
              { role: 'user', content: `Student quiz answers: ${JSON.stringify(answers)}\nDuration: ${durationMonths} month(s)` }
            ]
          }),
          signal: controller.signal
        }
      );
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Qwen API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Qwen API returned no content');
      }

      let cleaned = content.trim();
      // Strip markdown code fences if present anywhere
      const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        cleaned = jsonMatch[1].trim();
      } else {
        // Fallback: try to extract the first { ... } or [ ... ] JSON structure
        const jsonStart = cleaned.indexOf('{');
        if (jsonStart > 0) {
          cleaned = cleaned.slice(jsonStart);
        }
      }
      const multiRoadmap = JSON.parse(cleaned);

      if (Array.isArray(multiRoadmap.steps)) {
        if (multiRoadmap.steps.length < 8 || multiRoadmap.steps.length > 15) {
          console.warn(`AI Multi-Step Roadmap step count mismatch: expected 8-15, received ${multiRoadmap.steps.length}`);
        }
        if (multiRoadmap.steps.length > 15) {
          multiRoadmap.steps = multiRoadmap.steps.slice(0, 15);
        }
      }

      return res.status(200).json(multiRoadmap);
    } catch (error) {
      console.error('AI Multi-Step Roadmap Error:', error.message || error);
      return res.status(500).json({ error: 'AI generation failed' });
    }
  }

  if (!answers) {
    return res.status(400).json({ error: 'No quiz answers were sent' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(
      'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: (() => {
              const aiUseMap = {
                ai_overwhelmed: 'got overwhelmed by too many options',
                ai_no_action: 'didn\'t know what to actually do next',
                ai_helped_some: 'found it somewhat helpful',
                ai_not_tried: 'hasn\'t tried AI tools yet'
              };
              const aiVal = Object.values(answers).map(v => v?.val).find(v => aiUseMap[v]);
              const aiLine = aiVal ? `\nThis student already tried AI tools before: ${aiUseMap[aiVal]}.` : '';
              return `Student quiz answers: ${JSON.stringify(answers)}\n\nHere is what happened with their previous steps (if any):\n${Array.isArray(history) && history.length > 0 ? history.map(entry => `Step '${entry.stepName || entry.name}' — ${entry.status || entry.stuck ? 'stuck' : 'completed'}`).join('\n') : 'No previous history — this is their first roadmap.'}${aiLine}`;
            })() }
          ]
        }),
        signal: controller.signal
      }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Qwen API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Qwen API returned no roadmap content');
    }

    let cleaned = content.trim();
    // Strip markdown code fences if present anywhere
    const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      cleaned = jsonMatch[1].trim();
    } else {
      // Fallback: try to extract the first { ... } or [ ... ] JSON structure
      const jsonStart = cleaned.indexOf('{');
      if (jsonStart > 0) {
        cleaned = cleaned.slice(jsonStart);
      }
    }
    const roadmap = JSON.parse(cleaned);

    return res.status(200).json(roadmap);
  } catch (error) {
    console.error('AI Roadmap Generation Error:', error.message || error);
    return res.status(500).json({ error: 'AI generation failed' });
  }
}
