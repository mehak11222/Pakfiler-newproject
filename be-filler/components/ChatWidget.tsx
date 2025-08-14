"use client";
import { useRef, useState, useEffect } from "react";

interface Message {
  sender: "User" | "Accountant";
  text: string;
  timestamp: number;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    sender: "Accountant",
    text: "Hello! How can I help you today?",
    timestamp: Date.now(),
  }]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "User", text: input, timestamp: Date.now() }]);
    setInput("");
    // Simulate accountant reply (demo)
    setTimeout(() => {
      setMessages(msgs => [...msgs, { sender: "Accountant", text: "Thank you for your message. We'll get back to you soon!", timestamp: Date.now() }]);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
      >
        💬
      </button>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[95vw] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 animate-in fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-green-600 rounded-t-xl">
            <span className="font-bold text-white">Chat with Accountant</span>
            <button className="text-white text-xl" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2 h-64 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-lg px-3 py-2 max-w-[75%] text-sm ${msg.sender === "User" ? "bg-green-100 text-green-900" : "bg-gray-200 text-gray-800"}`}>
                  <div className="font-semibold mb-1">{msg.sender}</div>
                  <div>{msg.text}</div>
                  <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="flex items-center border-t px-2 py-2 bg-white rounded-b-xl">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 font-semibold"
              onClick={sendMessage}
              disabled={!input.trim()}
            >Send</button>
          </div>
        </div>
      )}
    </>
  );
} 