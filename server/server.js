import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRouter from "./routes/upload.js";
import chatRouter from "./routes/chat.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/upload", uploadRouter);
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

