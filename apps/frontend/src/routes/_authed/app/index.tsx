import { Resumes } from '@/components/resumes'
import { getSupabaseServerClient } from '@/utils/supabase/server'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const fetchResumes = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('resumes').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data;

})

export const Route = createFileRoute('/_authed/app/')({
  loader: async () => {
    return { resumes: await fetchResumes() }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { resumes } = Route.useLoaderData();

  return <div className='max-w-7xl w-full mx-auto my-4'>
    <Resumes resumes={resumes} />
  </div>
}
