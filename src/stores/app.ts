import { Editor } from "@tiptap/react";
import { create } from "zustand";
import { defaultContent } from "@/utils/editor";
import { toast } from "sonner";

interface AppStore {
  id?: string;
  content?: string;
  loading: boolean;
  fetched: boolean;
  showChat: boolean;
  editor?: Editor | null;
  openaiKey?: string;
  showDiff: boolean;
  setShowDiff: (showDiff: boolean) => void;
  setEditor: (editor: Editor | null) => void;
  setContent: (content: string) => void;
  getPersistedContent: () => string | null;
  persistContent: () => void;
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
  showDiff: false,
  setShowDiff: (showDiff) => set({ showDiff }),
  setEditor: (editor) => set({ editor }),
  setContent: (content: string) => set({ content }),
  persistContent: () => {
    localStorage.setItem("content", get().content || "");
    toast("Saved sucessfully");
  },
  loadContent: () => {
    const storedContent = get().getPersistedContent();
    get().editor?.commands.setContent(storedContent ?? defaultContent);
    set({ content: storedContent ?? defaultContent });
  },
  getPersistedContent: () => localStorage.getItem("content"),
  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
}));