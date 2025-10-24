import OpenAI from "openai";
import { supabase } from "../supabase.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createEmbedding(documentId, text) {
  const chunks = text.match(/[\s\S]{1,1000}/g) || [];

  for (const chunk of chunks) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk
    });

    await supabase.from("embeddings").insert([
      {
        document_id: documentId,
        content: chunk,
        embedding: embedding.data[0].embedding
      }
    ]);
  }
}

