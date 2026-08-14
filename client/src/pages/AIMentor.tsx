import { useEffect, useRef, useState } from "react";
import { Brain, Mic, Send } from "lucide-react";
import { cn } from "../utils/cn";
import { chatWithAI, ChatMessage } from "../services/chat";
import { useNavigate, useLocation } from "react-router-dom";

const suggestedPrompts = [
  "What skills should I focus on next?",
  "Show me my career roadmap",
  "How do I prepare for interviews?",
  "What's trending in my field?",
];

export default function AIMentor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "Hey! 👋 I'm your AI career mentor. Ask me anything about your career journey!", time: "Now" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text: string = input) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: "user", text, time: "Now" };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    
    try {
      const response = await chatWithAI(text);
      setMessages(m => [...m, { role: "ai", text: response.reply || "No response.", time: "Now" }]);
    } catch (err: any) {
      setMessages(m => [...m, { role: "ai", text: "Sorry, I couldn't process that request right now.", time: "Now" }]);
    } finally {
      setTyping(false);
    }
  }

  function renderText(text: string) {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
      return <p key={i} className={line.startsWith("#") ? "font-bold" : ""} dangerouslySetInnerHTML={{ __html: bold }} />;
    });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16 flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 px-4">
        {/* Header */}
        <div className="py-6 flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>PathAI Mentor</h2>
            <p className="text-sm text-emerald-600 font-medium">Online · Powered by OpenAI</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-4 min-h-[400px] max-h-[70vh]">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={cn("max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed space-y-1",
                msg.role === "ai"
                  ? "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                  : "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-tr-sm shadow-md shadow-blue-500/20"
              )}>
                {renderText(msg.text)}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map(j => (
                    <div key={j} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts */}
        <div className="flex gap-2 flex-wrap mb-4">
          {suggestedPrompts.map(p => (
            <button key={p} onClick={() => send(p)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:border-blue-300 hover:text-blue-600 transition-all hover:shadow-sm">
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="pb-8">
          <div className="flex gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm focus-within:border-blue-400 focus-within:shadow-md transition-all">
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask me anything about your career..."
              className="flex-1 bg-transparent text-slate-700 text-sm outline-none placeholder-slate-400"
            />
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <Mic className="w-5 h-5 text-slate-400" />
            </button>
            <button onClick={() => send()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/30 hover:scale-105 transition-all">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
