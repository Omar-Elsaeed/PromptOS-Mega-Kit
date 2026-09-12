import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Shared Gemini instance initialized lazily
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // AI Generation API Endpoint
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      let { prompt, systemInstruction, model = "gemini-3.8-flash", temperature = 0.7 } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt parameter" });
      }

      // Map any older aliases to supported models
      if (model === "gemini-3.7-flash" || !model) {
        model = "gemini-3.8-flash";
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback simulation note
        return res.json({
          text: "",
          fallback: true,
          message: "No GEMINI_API_KEY found in server environment. Using intelligent local synthesis engine."
        });
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: typeof temperature === "number" ? temperature : 0.7,
        },
      });

      return res.json({
        text: response.text || "",
        model: model,
        fallback: false,
      });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate AI response",
        fallback: true,
      });
    }
  });

  // Streaming endpoint for Playground or Long tasks
  app.post("/api/gemini/stream", async (req, res) => {
    try {
      let { prompt, systemInstruction, model = "gemini-3.8-flash", temperature = 0.7 } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      if (model === "gemini-3.7-flash" || !model) {
        model = "gemini-3.8-flash";
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(200).json({
          fallback: true,
          message: "No GEMINI_API_KEY found. Stream using local fallback."
        });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const responseStream = await ai.models.generateContentStream({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: typeof temperature === "number" ? temperature : 0.7,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }

      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (err: any) {
      console.error("Gemini Stream Error:", err);
      if (!res.headersSent) {
        return res.status(500).json({ error: err.message });
      }
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  });

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PromptOS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
