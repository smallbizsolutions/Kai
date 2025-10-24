import express from "express";
import { supabase } from "../supabase.js";
import pdf from "pdf-parse";
import fs from "fs";
import OpenAI from "openai";
import { createEmbedding } from "../utils/embedder.js";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// simple text extraction for PDFs
const extractTextFromBuffer = async (buffer) => {
  const data = await pdf(buffer);
  return data.text;
};

router.post("/", async (req, res) => {
  try {
    const { fileBuffer, fileName } = req.body; // you'll convert to base64 from frontend
    const buffer = Buffer.from(fileBuffer, "base64");
    const text = await extractTextFromBuffer(buffer);

    // store file metadata
    const { data: doc, error } = await supabase
      .from("documents")
      .insert([{ title: fileName, text }])
      .select();

    if (error) throw error;

    // embed chunks
    await createEmbedding(doc[0].id, text);

    res.json({ success: true, message: "File processed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

