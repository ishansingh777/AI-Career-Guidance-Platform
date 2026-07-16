import React, { memo, useEffect, useMemo, useState } from "react";
import { Send, RefreshCcw } from "lucide-react";
import { GlassCard } from "../common/GlassCard";
import { SuggestedPrompts } from "./SuggestedPrompts";

export const ChatInput = memo(function ChatInput({
  onSend,
  onRetry,
  loading,
  error,
  selectedCareerSlug,
  onPickPrompt,
}: {
  onSend: (message: string) => void;
  onRetry: () => void;
  loading: boolean;
  error: string | null;
  selectedCareerSlug: string | null;
  onPickPrompt: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // keep draft; but if career slug changes we can keep the message.
  }, [selectedCareerSlug]);

  const sendDisabled = useMemo(() => loading || message.trim().length === 0, [loading, message]);

  function submit() {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessage("");
    onSend(trimmed);
  }

  return (
    <GlassCard className="p-4 sm:p-5">
      <div className="space-y-3">
        <SuggestedPrompts onPick={(m) => onPickPrompt(m)} />

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="sr-only" htmlFor="chat-input">
              Message
            </label>
            <textarea
              id="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!sendDisabled) submit();
                }
              }}
              placeholder={selectedCareerSlug ? "Ask about your selected career..." : "Ask your mentor..."}
              className="w-full resize-none bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 rounded-2xl px-4 py-3 text-sm sm:text-base text-gray-900 dark:text-gray-50 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 min-h-[52px]"
              disabled={loading}
              aria-disabled={loading}
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={sendDisabled}
            className="shrink-0 h-[52px] px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 disabled:hover:bg-blue-600/40 text-white border border-blue-500/30 transition flex items-center gap-2"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {error ? (
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            <button
              type="button"
              onClick={onRetry}
              className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 hover:bg-white/75 dark:hover:bg-white/10 transition"
              disabled={loading}
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : null}
      </div>
    </GlassCard>
  );
});

