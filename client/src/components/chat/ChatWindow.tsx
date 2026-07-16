import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/axios";
import { useLocation } from "react-router-dom";
import { ChatMessage, type ChatMessageModel } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { useAuthContext } from "../../context/AuthContext";

type ChatApiResponse = {
  reply: string;
  citations: any[];
  careerSlug?: string;
  timestamp: string;
  usage?: { promptTokens: number; completionTokens: number };
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export const ChatWindow = memo(function ChatWindow() {
  useAuthContext();
  const query = useQuery();
  const careerSlugFromQuery = query.get("careerSlug");

  const [selectedCareerSlug, setSelectedCareerSlug] = useState<string | null>(careerSlugFromQuery);

  useEffect(() => {
    setSelectedCareerSlug(careerSlugFromQuery);
  }, [careerSlugFromQuery]);

  const [messages, setMessages] = useState<ChatMessageModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRetryMessage, setPendingRetryMessage] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  async function send(message: string, opts?: { isRetry?: boolean }) {
    setError(null);
    setLoading(true);

    const userMsg: ChatMessageModel = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };
    setMessages((prev) => [...prev, userMsg]);

    const careerSlug = selectedCareerSlug || undefined;

    try {
      const res = await api.post<ChatApiResponse>("/chat", {
        message,
        ...(careerSlug ? { careerSlug } : {}),
      });

      const aiText = res.data?.reply ?? "";
      const aiMsg: ChatMessageModel = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiText,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setPendingRetryMessage(null);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 404) setError("No career found for that selection. Try another career." );
      else if (status === 401) setError("Session expired. Please log in again." );
      else setError("Something went wrong while generating the answer. Please try again." );

      // keep last user message for retry
      if (!opts?.isRetry) setPendingRetryMessage(message);
    } finally {
      setLoading(false);
    }
  }

  const onRetry = useCallback(() => {
    if (!pendingRetryMessage) return;
    void send(pendingRetryMessage, { isRetry: true });
  }, [pendingRetryMessage]);

  return (
    <div className="space-y-4">
      <motion.div
        className="h-[60vh] sm:h-[62vh] overflow-auto rounded-2xl border border-white/70 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-inner p-4"
        ref={listRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-10 px-2">
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-50">Start a conversation</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 max-w-md">
              Ask a question or pick a suggested prompt. You can optionally focus on a career using the career selection.
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Tip: Press <span className="font-semibold">Enter</span> to send, <span className="font-semibold">Shift+Enter</span> for a newline.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {loading ? (
              <div className="w-full flex justify-start">
                <div className="max-w-[85%] px-3 py-2">
                  <TypingIndicator />
                </div>
              </div>
            ) : null}
          </div>
        )}
      </motion.div>

      <ChatInput
        onSend={(m) => void send(m)}
        onRetry={onRetry}
        loading={loading}
        error={error}
        selectedCareerSlug={selectedCareerSlug}
        onPickPrompt={(m) => void send(m)}
      />
    </div>
  );
});

