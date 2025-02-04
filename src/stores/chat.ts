import supabase from "@/utils/supabase";
import { create } from "zustand";
import { useAppStore } from "./app";

interface ChatMessage {
  id: string;
  timestamp: string;
  message: string;
  role: "assistant" | "user";
}

interface ChatStore {
  apiKey?: string;
  loading: boolean;
  messages: ChatMessage[];
  setApiKey: (apiKey: string) => void;
  sendMessage: (message: string) => Promise<void>;
}

const generateRandomId = () => Math.random().toString();

export const useChatStore = create<ChatStore>((set, get) => ({
  apiKey: "",
  loading: true,
  messages: [],
  setApiKey: (apiKey) => set({ apiKey }),
  sendMessage: async (message) => {
    const apiKey = get().apiKey;

    set({ loading: true });

    // if (!apiKey) {
    //   set({ loading: false });
    //   throw Error("Missing API Key!");
    // }

    const newUserMessage: ChatMessage = {
      id: generateRandomId(),
      message,
      timestamp: (new Date()).toUTCString(),
      role: "user"
    };

    set(({ messages }) => ({
      messages: [...messages, newUserMessage]
    }));


    // TOOD: Handle openAPI request
    // const response: string = await new Promise((res) => setTimeout(() => res("Server response"), 1000));
    const { data } = await supabase.functions.invoke("chat", {
      body: {
        apiKey,
        messages: get().messages.map(({ message: content, role }) => ({ role, content })),
        content: useAppStore.getState().editor?.getHTML()
      }
    });

    const responseMessage: ChatMessage = {
      id: generateRandomId(),
      message: data.text,
      timestamp: (new Date()).toUTCString(),
      role: "assistant"
    };

    useAppStore.getState().editor?.commands.setContent(data.html);

    set(({ messages }) => ({
      loading: false,
      messages: [...messages, responseMessage]
    }));
  }
}));