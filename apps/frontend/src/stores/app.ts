import type { Editor } from "@tiptap/react";
import { toast } from "sonner";
import { create } from "zustand";
import type { LocalResume, Resume } from "@/types/supabase/entities";
import { defaultContent, getPersistedLocalContent } from "@/utils/editor";
import { supabase } from "@/utils/supabase/client";

interface AppStore {
  resumes: Record<string, Resume | LocalResume>;
  editorContents: Record<string, string>;
  loading: boolean;
  fetched: boolean;
  showChat: boolean;
  openaiKey?: string;
  showDiff: boolean;

  setShowDiff: (showDiff: boolean) => void;
  setEditor: (editor: Editor | null) => void;
  setContent: (id: string) => (content: string) => void;
  fetchResumes: () => void;
  fetchLocalResume: () => void;
  toggleChat: () => void;
  downloadPdf: (id: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  resumes: {},
  editorContents: {},
  loading: false,
  fetched: false,
  showChat: false,
  openaiKey: undefined,
  showDiff: false,
  setShowDiff: (showDiff) => set({ showDiff }),
  setEditor: (editor) => set({ editor }),
  setContent: (id: string) => (content: string) =>
    set((state) => ({ editorContents: { ...state.editorContents, [id]: content } })),
  fetchLocalResume: async () => {
    const storedResumeContent = getPersistedLocalContent();
    set((state) => ({
      resumes: {
        ...state.resumes,
        local: { content: { html: storedResumeContent || defaultContent } } as LocalResume,
      },
    }));
  },
  fetchResumes: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.from("resumes").select("*");

      if (error) throw new Error(error.message);

      set((state) => ({
        resumes: {
          ...state.resumes,
          ...Object.fromEntries((data as Resume[]).map((resume) => [resume.id, resume])),
        },
      }));
    } catch {
      toast.error("Failed to fetch resumes. Please try again.");
    } finally {
      set({ loading: false, fetched: true });
    }
  },
  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
  downloadPdf: async (id: string) => {
    try {
      const resume = get().resumes[id];

      if (!resume) throw new Error("Resume not found download");

      const content = resume.content.html;

      const result = await fetch("/api/resumes/download", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/pdf" },
        body: JSON.stringify({ content, filename: "resume" }),
      });

      const blob = await result.blob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      toast.error((error as any).message || "Failed to download PDF. Please try again.");
    }
  },
}));
