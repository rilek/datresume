import supabase from "@/utils/supabase";
import { create } from "zustand";
import { useAppStore } from "./app";

type BaseMessage = {
  id: string;
  createdAt: string;
}
type UserMessage = BaseMessage & {
  role: "user";
  content: string;
}
type AssistantMessage = BaseMessage & {
  role: "assistant";
  content: {
    text: string;
    html: string;
  };
}
type ChatMessage = UserMessage | AssistantMessage;
type TemporalChatMessage = Partial<UserMessage> & { content: string, role: "user" };

interface Chat {
  threadId?: string;
  messages: (ChatMessage | TemporalChatMessage)[];
}

interface ChatResponse {
  threadId: string;
  question: {
    id: string;
    createdAt: string;
    content: string;
  };
  answer: {
    id: string;
    createdAt: string;
    content: {
      text: string;
      html: string;
    };
  }
}

interface ChatStore {
  loading: boolean;
  chat: Chat;
  resetChat: () => void;
  sendMessage: (message: string) => Promise<void>;
}


export const useChatStore = create<ChatStore>((set, get) => ({
  loading: true,
  chat: {
    threadId: undefined,
    messages: []
  },
  resetChat: () => set({ chat: { threadId: undefined, messages: [] } }),
  sendMessage: async (message) => {
    const chat = get().chat;

    set({
      loading: true,
      chat: {
        threadId: chat?.threadId,
        messages: [...chat?.messages, { content: message, role: "user" }]
      }
    });

    const { data } = await supabase.functions.invoke("chat", {
      body: {
        content: useAppStore.getState().editor?.getHTML(),
        message,
        threadId: chat?.threadId
      }
    });

    const { threadId, question, answer } = data as ChatResponse;

    useAppStore.getState().editor?.commands.setContent(answer.content.html);

    set(({ chat }) => ({
      loading: false,
      chat: {
        threadId,
        messages: [
          ...chat.messages.slice(0, chat.messages.length - 1),
          { ...question, role: "user" },
          { ...answer, role: "assistant" }
        ]
      }
    }));
  }
}));