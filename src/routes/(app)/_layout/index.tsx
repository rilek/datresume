import { createFileRoute } from '@tanstack/react-router'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { BriefcaseIcon, CircleHelpIcon, FileDownIcon, RotateCcwIcon, SaveIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useAppStore } from '@/stores/app'
import { forwardRef, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PopoverClose } from '@radix-ui/react-popover'
import clsx from 'clsx'

export const Route = createFileRoute('/(app)/_layout/')({
  component: Index,
})

const extensions = [StarterKit, Typography, Link, Highlight]

const AdjustmentButton = forwardRef<HTMLButtonElement>((props, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild ref={ref} {...props}>
        <Button variant="outline" size="icon-lg"><BriefcaseIcon /></Button>
      </TooltipTrigger>
      <TooltipContent side='left'>
        Adjust to job offer
      </TooltipContent>
    </Tooltip>
  )
})

const HelpButton = forwardRef<HTMLButtonElement>((props, ref) => (
  <Tooltip>
    <TooltipTrigger asChild ref={ref} {...props}>
      <Button variant="outline" size="icon-lg"><CircleHelpIcon /></Button>
    </TooltipTrigger>
    <TooltipContent side='left'>
      Help!
    </TooltipContent>
  </Tooltip>
));

const AISettingsForm = () => {
  const { toast } = useToast();
  const regenerateResume = useAppStore(state => state.regenerate);
  const openaiKey = useAppStore(state => state.openaiKey);
  const content = useAppStore(state => state.content);

  const form = useForm({
    defaultValues: {
      openaiKey: openaiKey || "",
      jobUrl: "",
    }
  });

  const onSubmit = ({ jobUrl, openaiKey }: { jobUrl: string, openaiKey: string }) => {
    regenerateResume(toast, jobUrl, openaiKey, content);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name="openaiKey"
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>OpenAI API Key</FormLabel>
                <FormControl>
                  <Input placeholder="Place your API key here..." {...field} />
                </FormControl>
                <FormDescription className='!mt-0'>We won't save it anywhere</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="jobUrl"
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job offer URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/whatever" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-end mt-8'>

          <PopoverClose asChild>
            <Button type="submit">Submit</Button>
          </PopoverClose>
        </div>
      </form>
    </Form>
  )
};

const SaveButton = forwardRef<HTMLButtonElement>((props, ref) => {
  const { toast } = useToast();
  const saveContentHandler = useAppStore(state => state.saveContent);
  const saveContent = () => saveContentHandler(toast);
  const storedContent = localStorage.getItem("content");
  const content = useAppStore(state => state.content);


  return (
    <Button variant={"outline"} size="icon-lg" onClick={saveContent} className='relative' ref={ref} {...props}>
      {<span className={clsx('absolute top-0 right-0 w-2 h-2 bg-rose-700 opacity-0 transition-opacity rounded-full',
        { "opacity-100": storedContent != content }
      )} />}
      <SaveIcon />
    </Button>
  );
})

const EditorOptions = () => {

  const editor = useAppStore(state => state.editor);
  const storedContent = localStorage.getItem("content")!;
  const setContent = useAppStore(state => state.setContent);
  const resetContent = () => {
    setContent(storedContent);
    editor?.commands.setContent(storedContent || "")
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SaveButton />
        </TooltipTrigger>
        <TooltipContent side='left'>
          Save to local storage
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-lg" onClick={resetContent}><RotateCcwIcon /></Button>
        </TooltipTrigger>
        <TooltipContent side='left'>
          Reset to last saved state
        </TooltipContent>
      </Tooltip>

      <Popover>
        <PopoverTrigger asChild>
          <AdjustmentButton />
        </PopoverTrigger>
        <PopoverContent className='text-sm [&>p+p]:mt-2' side='left' align="start">
          <AISettingsForm />
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-lg" onClick={() => window.print()}><FileDownIcon /></Button>
        </TooltipTrigger>
        <TooltipContent side='left'>
          Download as PDF
        </TooltipContent>
      </Tooltip>

      <hr />

      <Popover>
        <PopoverTrigger asChild>
          <HelpButton />
        </PopoverTrigger>
        <PopoverContent className='text-sm [&>p+p]:mt-2' side='left' align="start">
          <p>Resumes are written using Markdown syntax. Checkout details <a href="https://github.com/adam-p/markdown-here/wiki/markdown-cheatsheet" target="_blank">here</a>.</p>
          <p>In case of any problems place an issue using <a href="https://github.com/rilek/datresume/issues" target='_blank'>Github issues</a>.</p>

          <p>Links are not handled. I'm working on it.</p>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

const Editor = () => {
  const content = useAppStore(state => state.content);
  const setContent = useAppStore(state => state.setContent);
  const setEditor = useAppStore(state => state.setEditor);
  const loading = useAppStore(state => state.loading);

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor: e }) => setContent(e.getHTML()),
    onCreate: ({ editor: e }) => setContent(e.getHTML()),
  });

  useEffect(() => {
    setEditor(editor);
  }, [editor]);

  return (
    <div className={clsx("w-full min-h-screen transition-opacity", { 'opacity-50 pointer-events-none': loading })}>
      <div className='h-full max-w-4xl min-h-screen py-24 mx-auto print:py-0'>
        <div className='font-serif prose print:prose-xs print:prose-li:my-0 max-w-none'>
          <EditorContent editor={editor} className="editor" />
          {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
        <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
        </div>
      </div>
    </div>
  );
};

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

      <div className='max-w-4xl py-24 mx-auto text-center print:hidden'>
        <div className=''>
          <h1 className='mb-24 font-serif text-4xl font-bold transition-opacity opacity-25 hover:opacity-100'>Datresume</h1>
        </div>
        <h2 className='text-6xl font-light tracking-normal'>Adjust your resume to any job offer in seconds</h2>
        <p className='mt-8 text-lg'>
          Use AI to adjust your resume to any job offer in seconds. Just write your resume in editor below, paste the job offer URL and your OpenAI API key and let the magic happen.
        </p>
      </div>

      <div className='relative'>
        <div className='absolute top-0 bottom-0 right-2 print:hidden'>
          <div className='sticky inline-flex flex-col gap-2 top-2'>
            <EditorOptions />
          </div>
        </div>

        <Editor />
      </div>
    </>
  )
}
