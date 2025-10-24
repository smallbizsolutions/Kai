import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const handleSend = async () => {
    if (!message) return;
    setChat([...chat, { role: "user", text: message }]);
    const res = await axios.post("/api/chat", { message });
    setChat((prev) => [...prev, { role: "assistant", text: res.data.reply }]);
    setMessage("");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="border p-2 h-96 overflow-y-auto mb-3 rounded">
        {chat.map((c, i) => (
          <div key={i} className={c.role === "user" ? "text-right" : "text-left"}>
            <p
              className={
                c.role === "user" ? "bg-blue-500 text-white p-2 rounded-lg inline-block" : "bg-gray-200 p-2 rounded-lg inline-block"
              }
            >
              {c.text}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border p-2 flex-grow rounded"
          placeholder="Ask a question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

