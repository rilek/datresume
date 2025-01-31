import { createFileRoute } from '@tanstack/react-router'
import { useAppStore } from '@/stores/app'
import { useEffect } from 'react'
import { Editor, EditorOptions } from '@/components/editor';

export const Route = createFileRoute('/(app)/_layout/')({
  component: Index,
})


function Index() {
  const loadContent = useAppStore(state => state.loadContent);
  const loading = useAppStore(state => state.loading);
  const fetched = useAppStore(state => state.fetched);

  useEffect(() => {
    loadContent();
  }, []);

  if (loading && !fetched) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className='p-4 print:hidden'>
        <h1 className='font-serif text-xl font-extrabold'>Datresume</h1>
      </header>

      <div className=''>
        <div className='max-w-6xl py-24 mx-auto print:hidden'>
          <div className='max-w-2xl'>
            <h2 className='text-5xl font-serif font-bold tracking-tight mb-10'>Match your resume to your perfect job</h2>
            <p className='mt-8 text-xl text-black/70 leading-8'>
              Use GenAI models to adjust your resume to any job offer in seconds. Just use the editor, paste the job offer, or its URL, and let the magic happen.
            </p>
          </div>
        </div>
      </div>

      <div className='relative'>
        <div className='absolute top-0 bottom-0 right-2 print:hidden'>
          <div className='sticky inline-flex flex-col gap-2 top-2'>
            <EditorOptions />
          </div>
        </div>

        <div className='max-w-6xl mx-auto'>
          <div className='text-center text-slate-700 text-sm mb-2 font-bold print:hidden'>
            Edit content below using <a href="https://www.markdownguide.org/cheat-sheet/" target='_blank' className='text-sky-700'>Markdown</a>
          </div>
          <div className='bg-white border shadow-lg mb-12 print:border-none print:shadow-none'>
            <Editor />
          </div>
        </div>
      </div>
    </>
  )
}
