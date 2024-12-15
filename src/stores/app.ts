import { useToast } from "@/hooks/use-toast";
import supabase from "@/utils/supabase";
import { Editor } from "@tiptap/react";
import { create } from "zustand";

interface AppStore {
  id?: string;
  content?: string;
  loading: boolean;
  fetched: boolean;
  editor?: Editor | null;
  setEditor: (editor: Editor | null) => void;
  setContent: (content: string) => void;
  regenerate: (toast: ReturnType<typeof useToast>["toast"], jobUrl: string) => Promise<void>;
  saveContent: (toast: ReturnType<typeof useToast>["toast"]) => Promise<void>;
  loadContent: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  id: undefined,
  content: undefined,
  loading: false,
  fetched: false,
  editor: undefined,
  setEditor: (editor) => set({ editor }),
  setContent: (content: string) => set({ content }),
  regenerate: async (toast, jobUrl) => {
    const { data, error } = await supabase.functions.invoke("regenerate-resume", { body: { jobUrl } });

    get().editor?.commands.setContent(data.choices[0].message.content);

    if (error) console.error(error);

    toast({ title: "Regenerated successfully" });
    set({ content: data });
  },
  saveContent: async (toast) => {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;
    const { status } = await supabase
      .from("resumes")
      .upsert({ id: get().id, content: get().content })
      .eq("user_id", userId);

    if (status >= 200) toast({ title: "Saved sucessfully" });
    else console.error("Failed to save content");
  },
  loadContent: async () => {
    set({ loading: true });

    const userId = (await supabase.auth.getSession()).data.session?.user.id;
    const { data, error } = await supabase.from("resumes").select("id,content").eq("user_id", userId).single();

    if (error) {
      console.error(error);
    } else {
      set({ content: data?.content, id: data?.id });
    }

    set({ fetched: true, loading: false });
  }
}));