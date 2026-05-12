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

// Initialize OpenAI/Groq client
let aiClient: OpenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const cleanKey = (key?: string) => {
      if (!key) return "";
      // Strip potential quotes and invisible characters
      return key.trim().replace(/^["']+|["']+$/g, "").replace(/[\u200B-\u200D\uFEFF]/g, "");
    };

    const groqKey = cleanKey(process.env.GROQ_API_KEY);
    const openaiKey = cleanKey(process.env.OPENAI_API_KEY);
    const geminiKey = cleanKey(process.env.GEMINI_API_KEY);

    // Ignore placeholder values from .env.example
    const isPlaceholder = (key?: string) => !key || key.includes("MY_") || key === "";

    let apiKey = "";
    let baseURL = undefined;

    if (!isPlaceholder(groqKey)) {
      apiKey = groqKey!;
      baseURL = "https://api.groq.com/openai/v1";
      console.log("✅ Using GROQ API");
    } else if (!isPlaceholder(openaiKey)) {
      apiKey = openaiKey!;
      console.log("✅ Using OpenAI API");
    } else if (!isPlaceholder(geminiKey)) {
      apiKey = geminiKey!;
      console.log("✅ Using Gemini API (OpenAI compatibility)");
    }

    if (!apiKey) {
      throw new Error("🚨 API Key is missing! Please set GROQ_API_KEY in Secrets or .env file.");
    }
    
    aiClient = new OpenAI({ 
      apiKey,
      baseURL
    });
  }
  return aiClient;
}

app.use(express.json());

const SYSTEM_PROMPT = `You are "ESCLAVE.AI", a premium, futuristic JavaScript & TypeScript training system. 
You don't just answer questions; you build engineers.

PERSONALITY:
- Technical, precise, highly motivating.
- Use engineering metaphors (e.g., "Memory allocation is like...", "The Event Loop is a high-speed conveyor belt...").
- Always brief yet deep. Avoid generic filler.

LEARNING ARCHITECTURE:
1. **Conceptual Bridge**: Briefly explain the "Why" before the "What".
2. **Code Implementation**: Provide high-performance, modern ES6+ examples.
3. **The Challenge**: Every lesson MUST end with a practical task.
   You MUST use the EXACT format: [TASK: Difficulty | Question | Correct Answer Snippet]
   Difficulties: EASY, NORMAL, HARDCORE.
   Example: [TASK: EASY | What is the keyword to declare a constant in ES6? | const]
   IMPORTANT: If the user specifically asks for a task or clicks a difficulty button, start your response with the [TASK:...] tag before any other text.
   If the user's request for a task is too vague (e.g., "Give me a task"), ask what topic they want to practice before providing the [TASK:...] tag.
   The tag "TASK" must ALWAYS be in English.

IF USER MAKES A MISTAKE:
Don't just give the answer. Provide a hint first, then analyze the logic flaw.

LANGUAGE RESTRAINT:
- Strictly follow the user's selected language for all conversational content. 
- NEVER translate to Chinese, Japanese, or any language other than the one specified by the user.
- If the requested language is Ukrainian, use Ukrainian ONLY.
- Default to English if the language is unknown, but NEVER use Chinese.
- DO NOT use Chinese characters under any circumstances.
- TECHNICAL TAGS like [TASK:...], [SUGGESTIONS:...] MUST stay in English regardless of the output language.
- Ensure all technical terms are explained in the user's current language.

RESTRICTIONS:
- Topic: JavaScript, TypeScript, Node.js, Web APIs, Architecture.
- Tone: Senior Lead Developer.`;

// API Route for AI Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], isDebug, language = 'Ukrainian', settings } = req.body;
    const client = getAIClient();

    const challengesEnabled = settings?.challengesEnabled !== false;
    const difficulty = (settings?.difficulty || 'NORMAL').toUpperCase();
    const autoTasks = settings?.autoTasks !== false;

    let dynamicInstructions = "";
    if (!challengesEnabled) {
      dynamicInstructions = "\n- IMPORTANT: The user has DISABLED challenges. Do NOT generate [TASK:...] tags unless the user EXPLICITLY asks for a new task.";
    } else {
      dynamicInstructions = `\n- The user has ENABLED challenges. Generate tasks with [TASK:${difficulty} | ... | ...] format.`;
      if (autoTasks) {
        dynamicInstructions += "\n- Proactively include a task in almost every response to keep the user engaged.";
      } else {
        dynamicInstructions += "\n- Only include a task if the user asks for one or if it's the end of a major explanation.";
      }
    }

    const historyArray = Array.isArray(history) ? history : [];
    const messages = [
      { role: "system", content: `${SYSTEM_PROMPT}${dynamicInstructions}\n\nIMPORTANT: Use ${language} for ALL responses. Do NOT use any other language.` },
      ...historyArray.slice(-8),
      { role: "user", content: isDebug ? `Verify this code and explain in ${language}:\n${message}` : message }
    ];

    const model = process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o";

    const response = await client.chat.completions.create({
      model: model,
      messages: messages as any,
      temperature: 0.7,
    });

    res.json({ text: response.choices[0].message.content });
  } catch (error: any) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch from AI provider" });
  }
});

// API Route for Task Verification
app.post("/api/verify", async (req, res) => {
  try {
    const { question, correctAnswer, userAnswer, difficulty, language = 'Ukrainian' } = req.body;
    const client = getAIClient();

    const verifyPrompt = `
    You are an AI JavaScript Mentor. Your task is to verify the user's solution.
    Language of feedback, question, and answer MUST BE: ${language}.
    Task difficulty level: ${difficulty || 'NORMAL'}.
    
    TASK TO EVALUATE: ${question}
    REFERENCE ANSWER: ${correctAnswer}
    USER ANSWER: ${userAnswer}

    RESPONSE REQUIREMENTS (JSON ONLY):
    {
      "isCorrect": true/false, 
      "feedback": "Your comment here in ${language} (praise or explain the error).", 
      "xpAwarded": amount of XP (0 to 300. STRICT REWARD SCALE:
        - EASY: 40-60 XP
        - NORMAL: 100-150 XP
        - HARDCORE: 250-300 XP
        - Return 0 if the answer is incorrect)
    }
    `;

    const model = process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o";

    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: `You are a technical mentor. You must respond ONLY in JSON in the requested language: ${language}.` },
        { role: "user", content: verifyPrompt }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: "Failed to verify answer" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
