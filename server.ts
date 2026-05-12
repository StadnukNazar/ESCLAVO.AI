import express from "express";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

let aiClient: OpenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const cleanKey = (key?: string) => {
      if (!key) return "";
      return key.trim().replace(/^["']+|["']+$/g, "").replace(/[\u200B-\u200D\uFEFF]/g, "");
    };
    const groqKey = cleanKey(process.env.GROQ_API_KEY);
    const openaiKey = cleanKey(process.env.OPENAI_API_KEY);
    const geminiKey = cleanKey(process.env.GEMINI_API_KEY);
    const isPlaceholder = (key?: string) => !key || key.includes("MY_") || key === "";

    let apiKey = "";
    let baseURL = undefined;
    if (!isPlaceholder(groqKey)) {
      apiKey = groqKey!; baseURL = "https://api.groq.com/openai/v1";
      console.log("✅ Using GROQ API");
    } else if (!isPlaceholder(openaiKey)) {
      apiKey = openaiKey!; console.log("✅ Using OpenAI API");
    } else if (!isPlaceholder(geminiKey)) {
      apiKey = geminiKey!; console.log("✅ Using Gemini API");
    }
    if (!apiKey) throw new Error("🚨 API Key is missing! Please set GROQ_API_KEY in .env file.");
    aiClient = new OpenAI({ apiKey, baseURL, timeout: 30_000, maxRetries: 3 });
  }
  return aiClient;
}

app.use(express.json());

const DIFFICULTY_GUIDE: Record<string, string> = {
  EASY: "EASY — Single word or one-liner answers. Beginner level. Example: 'What keyword declares a constant?' → 'const'. The question must be trivially simple.",
  NORMAL: "NORMAL — Requires understanding a concept. Intermediate level. Example: 'Write a debounce function' or 'Explain event bubbling'. Answer is 3-8 lines or a clear explanation.",
  HARDCORE: "HARDCORE — Complex real-world problem. Advanced level. Example: 'Implement Promise.all from scratch' or 'Write a deep clone handling circular refs'. Answer requires 10+ lines and deep expertise."
};

const SYSTEM_PROMPT = `You are "ESCLAVE.AI", a premium JavaScript & TypeScript training system. You build engineers, not just answer questions.

PERSONALITY: Technical, precise, motivating. Use engineering metaphors. Brief yet deep.

FORMAT: End lessons with: [TASK: DIFFICULTY | Question | Answer]
The word TASK must always be in English. Everything else in the user's language.

IF USER MAKES A MISTAKE: Give a hint first, then explain the flaw.

LANGUAGE: Use ONLY the user's specified language. Never Chinese. Tags stay in English.

TOPIC: JavaScript, TypeScript, Node.js, Web APIs, Architecture only. Tone: Senior Lead Developer.`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], isDebug, language = 'Ukrainian', settings, isForPractice = false } = req.body;
    const client = getAIClient();

    const challengesEnabled = settings?.challengesEnabled !== false;
    const rawDiff = (settings?.difficulty || 'normal').toLowerCase();
    // Map 'hard' → 'HARDCORE', 'easy' → 'EASY', anything else → 'NORMAL'
    const difficulty = rawDiff === 'hard' ? 'HARDCORE' : rawDiff === 'easy' ? 'EASY' : 'NORMAL';
    const autoTasks = settings?.autoTasks !== false;
    const diffGuide = DIFFICULTY_GUIDE[difficulty];

    let dynamicInstructions = "";

    if (isForPractice) {
      dynamicInstructions = `
CRITICAL: User clicked the "${difficulty}" button. Generate ONLY a [TASK: ${difficulty} | question | answer] tag. No text before it.
Difficulty rules:
${diffGuide}
The question MUST match exactly the ${difficulty} complexity. Not easier. Not harder.`;

    } else if (!challengesEnabled) {
      dynamicInstructions = `
Challenges are DISABLED by the user.
- Do NOT generate [TASK:...] tags at all.
- At the end of every response, add one short friendly sentence in ${language} suggesting they enable tasks in settings to get practice.
  Vary the wording each time. Examples:
  Ukrainian: "💡 Увімкніть завдання в налаштуваннях — і я одразу дам вам практику!"
  English: "💡 Enable challenges in settings to get hands-on practice tasks!"
  Keep it to one sentence, casual and motivating.`;

    } else {
      dynamicInstructions = `
Current difficulty setting: ${difficulty}
Difficulty rules to follow strictly:
${diffGuide}
ALWAYS use [TASK: ${difficulty} | question | answer] — never a different difficulty level.
${autoTasks ? "Include a task in almost every response." : "Include a task only at the end of major explanations or when asked."}`;
    }

    const historyArray = Array.isArray(history) ? history : [];
    const messages = [
      { role: "system", content: `${SYSTEM_PROMPT}\n\n${dynamicInstructions}\n\nRespond in ${language} only.` },
      ...historyArray.slice(-8),
      { role: "user", content: isDebug ? `Verify this code in ${language}:\n${message}` : message }
    ];

    const model = process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o";
    const response = await client.chat.completions.create({ model, messages: messages as any, temperature: 0.7 });
    res.json({ text: response.choices[0].message.content });

  } catch (error: any) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch from AI provider" });
  }
});

app.post("/api/verify", async (req, res) => {
  try {
    const { question, correctAnswer, userAnswer, difficulty, language = 'Ukrainian' } = req.body;
    const client = getAIClient();

    const verifyPrompt = `You are verifying a JavaScript task answer. Language: ${language}. Difficulty: ${difficulty || 'NORMAL'}.

TASK: ${question}
CORRECT ANSWER: ${correctAnswer}
USER ANSWER: ${userAnswer}

Accept semantically correct answers even if phrasing differs. Accept functionally equivalent code.

Respond ONLY with JSON:
{
  "isCorrect": true or false,
  "feedback": "1-2 sentences in ${language}. Praise if correct, explain mistake if wrong.",
  "xpAwarded": 0 if wrong. If correct: EASY=50, NORMAL=120, HARDCORE=280
}`;

    const model = process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o";
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: `Strict but fair JS mentor. JSON only. Language: ${language}.` },
        { role: "user", content: verifyPrompt }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: "Failed to verify answer" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
