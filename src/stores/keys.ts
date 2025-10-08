
import supabase from "@/utils/supabase";
import { toast } from "sonner";
import { create } from "zustand";

interface KeyStore {
  id?: string;
  key?: string;
  loading: boolean;
  fetched: boolean;
  saveKey: (key: string) => Promise<void>;
  loadKey: () => Promise<void>;
}

export const useApiKeys = create<KeyStore>((set) => ({
  key: undefined,
  loading: false,
  fetched: false,
  saveKey: async (key) => {
    const { data, error } = await supabase.functions.invoke("save-api-key", { body: { key } });

    if (data.status === "ok") toast("Saved sucessfully");
    else console.error("Failed to save content", error);
  },
  loadKey: async () => {
    set({ loading: true });

    const { data, error } = await supabase.functions.invoke("load-api-key");

    if (error) {
      console.error(error);
    } else {
      set({ key: data });
    }

    set({ fetched: true, loading: false });
  }
}));