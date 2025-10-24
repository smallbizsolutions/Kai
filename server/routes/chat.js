import express from "express";
import OpenAI from "openai";
import { supabase } from "../supabase.js";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    // search similar chunks
    const { data: chunks, error } = await supabase.rpc("match_documents", {
      query_text: message,
      match_count: 5
    });

    if (error) throw error;

    const context = chunks.map((c) => c.content).join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful kitchen assistant." },
        {
          role: "user",
          content: `Use the following context to answer:\n\n${context}\n\nQuestion: ${message}`
        }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

