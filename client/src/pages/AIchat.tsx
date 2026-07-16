import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { ChatWindow } from "../components/chat/ChatWindow";
import { ChatHeader } from "../components/chat/ChatHeader";

export default function AIChat() {
  // Auth is handled by ProtectedRoute; this keeps the page self-contained.
  useAuthContext();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <ChatHeader />
        </div>
        <ChatWindow />
      </div>
    </div>
  );
}

