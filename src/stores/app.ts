import { useToast } from "@/hooks/use-toast";
import supabase from "@/utils/supabase";
import { create } from "zustand";

interface AppStore {
  id?: string;
  content?: string;
  loading: boolean;
  fetched: boolean;
  setContent: (content: string) => void;
  saveContent: (toast: ReturnType<typeof useToast>["toast"]) => Promise<void>;
  loadContent: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  id: undefined,
  content: undefined,
  loading: false,
  fetched: false,
  setContent: (content: string) => set({ content }),
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