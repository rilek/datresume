import { create } from "zustand";

interface ChatMessage {
  id: string;
  timestamp: string;
  message: string;
  type: "llm" | "user";
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

    if (!apiKey) {
      set({ loading: false });
      throw Error("Missing API Key!");
    }

    const newUserMessage: ChatMessage = {
      id: generateRandomId(),
      message,
      timestamp: (new Date()).toUTCString(),
      type: "user"
    };

    set(({ messages }) => ({
      messages: [...messages, newUserMessage]
    }));


    // TOOD: Handle openAPI request
    const response: string = await new Promise((res) => setTimeout(() => res("Server response"), 1000));

    const responseMessage: ChatMessage = {
      id: generateRandomId(),
      message: response,
      timestamp: (new Date()).toUTCString(),
      type: "llm"
    };

    set(({ messages }) => ({
      loading: false,
      messages: [...messages, responseMessage]
    }));
  }
}));