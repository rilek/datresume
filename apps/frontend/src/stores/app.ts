import type { Editor } from "@tiptap/react";
import { create } from "zustand";
import type { LocalResume, Resume } from "@/types/supabase/entities";
import { defaultContent, getPersistedLocalContent } from "@/utils/editor";

interface AppStore {
  resumes: Record<string, Resume | LocalResume>;
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
  loadLocalResume: () => void;
  toggleChat: () => void;
  downloadPdf: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  resumes: {},
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
  loadLocalResume: async () => {
    const storedResumeContent = getPersistedLocalContent();
    set({ resumes: { local: { content: { html: storedResumeContent || defaultContent } } as LocalResume } });
  },
  loadContent: () => {
    const storedContent = getPersistedLocalContent();
    const newContent = storedContent ?? defaultContent;

    get().editor?.commands.setContent(newContent);
    set({ content: newContent });
  },
  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
  downloadPdf: async () => {
    const result = await fetch("/api/resumes/download", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/pdf" },
      body: JSON.stringify({ content: get().content, filename: "resume" }),
    });
    const blob = await result.blob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  },
}));
