import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Resumes } from "@/components/resumes";
import { H1 } from "@/components/ui/typography";
import type { Resume } from "@/types/supabase/entities";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const fetchResumes = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("resumes").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as Resume[];
});

export const Route = createFileRoute("/_authed/app/")({
  loader: async () => {
    return { resumes: await fetchResumes() };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { resumes } = Route.useLoaderData();

  return (
    <div className="max-w-7xl w-full mx-auto my-4">
      <div className="flex flex-col gap-10">
        <H1>Resumes</H1>
        <Resumes resumes={resumes} />
      </div>
    </div>
  );
}
