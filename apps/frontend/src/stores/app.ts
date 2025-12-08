import type { Editor } from "@tiptap/react";
import { toast } from "sonner";
import { create } from "zustand";
import { defaultContent, getPersistedLocalContent } from "@/utils/editor";

interface AppStore {
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
  loadContent: () => void;
  toggleChat: () => void;
  downloadPdf: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
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
  loadContent: () => {
    const storedContent = getPersistedLocalContent();
    const newContent = storedContent ?? defaultContent;

    get().editor?.commands.setContent(newContent);
    set({ content: newContent });
  },
  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
  downloadPdf: async () => {
    try {
      const result = await fetch("/api/resumes/download", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/pdf" },
        body: JSON.stringify({ content: get().content, filename: "resume" }),
      });
      const blob = await result.blob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch {
      toast.error("Failed to download PDF. Please try again.");
    }
  },
}));
