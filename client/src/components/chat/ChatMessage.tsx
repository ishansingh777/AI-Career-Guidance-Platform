import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export type ChatRole = "user" | "assistant";

export type ChatMessageModel = {
  id: string;
  role: ChatRole;
  content: string;
};

function CodeBlock({ inline, className, children }: any) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match?.[1] ?? undefined;
  const value = String(children ?? "").replace(/\n$/, "");

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-[0.95em]">
        {children}
      </code>
    );
  }

  return (
    <SyntaxHighlighter
      style={oneDark}
      language={language}
      PreTag="div"
      className="!rounded-xl !overflow-hidden !text-sm"
    >
      {value}
    </SyntaxHighlighter>
  );
}

export const ChatMessage = memo(function ChatMessage({
  message,
}: {
  message: ChatMessageModel;
}) {
  const isUser = message.role === "user";

  const wrapperClass = useMemo(() => {
    if (isUser) return "justify-end";
    return "justify-start";
  }, [isUser]);

  const bubbleClass = useMemo(() => {
    if (isUser)
      return "bg-blue-500 text-white border-blue-500/30";
    return "bg-white/70 dark:bg-white/5 border-white/70 dark:border-white/10";
  }, [isUser]);

  return (
    <motion.div
      className={`w-full flex ${wrapperClass}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className={`max-w-[85%] sm:max-w-[78%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border shadow-sm ${bubbleClass}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
            a: ({ node, ...props }) => (
              <a
                {...props}
                className="text-blue-700 dark:text-blue-300 underline underline-offset-2"
                target={"_blank"}
                rel={"noreferrer"}
              />
            ),
          }}
          className={isUser ? "prose prose-invert" : "prose dark:prose-invert prose-sm sm:prose-base"}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
});

