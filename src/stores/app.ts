import { useToast } from "@/hooks/use-toast";
import supabase from "@/utils/supabase";
import { Editor } from "@tiptap/react";
import { create } from "zustand";
import { useAuthStore } from "./auth";
import { defaultContent } from "@/utils/editor";

interface AppStore {
  id?: string;
  content?: string;
  loading: boolean;
  fetched: boolean;
  showChat: boolean;
  editor?: Editor | null;
  openaiKey?: string;
  setEditor: (editor: Editor | null) => void;
  setContent: (content: string) => void;
  getPersistedContent: () => string | null;
  persistContent: (toast: ReturnType<typeof useToast>["toast"]) => void;
  loadContent: () => void;
  toggleChat: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  id: undefined,
  content: undefined,
  loading: false,
  fetched: false,
  showChat: false,
  editor: undefined,
  openaiKey: undefined,
  setEditor: (editor) => set({ editor }),
  setContent: (content: string) => set({ content }),
  persistContent: (toast) => {
    localStorage.setItem("content", get().content || "");
    toast({ title: "Saved sucessfully" });
  },
  loadContent: () => {
    const storedContent = get().getPersistedContent();
    get().editor?.commands.setContent(storedContent ?? defaultContent);
    set({ content: storedContent ?? defaultContent });
  },
  getPersistedContent: () => localStorage.getItem("content"),
  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
}));