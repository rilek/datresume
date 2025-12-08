import { createFileRoute } from "@tanstack/react-router";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const Route = createFileRoute("/public/resume/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabase = createSupabaseServerClient();

        return new Response(JSON.stringify({ result: "Resume generated successfully" }), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
    },
  },
});
