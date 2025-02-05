import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { Button } from '@/components/ui/button'
import { FileDownIcon, RotateCcwIcon, SaveIcon, SparklesIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useAppStore } from '@/stores/app'
import { forwardRef, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
// import { useForm } from 'react-hook-form'
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { PopoverClose } from '@radix-ui/react-popover'
import clsx from 'clsx'

const extensions = [StarterKit, Typography, Highlight, Link.configure({
  HTMLAttributes: {
    target: '_blank',
    rel: 'noopener noreferrer',
  },
})]

// const AdjustmentButton = forwardRef<HTMLButtonElement>((props, ref) => {
//   return (
//     <Tooltip>
//       <TooltipTrigger asChild ref={ref} {...props}>
//         <Button variant="outline" size="icon-lg"><BriefcaseIcon /></Button>
//       </TooltipTrigger>
//       <TooltipContent side='left'>
//         Adjust to job offer
//       </TooltipContent>
//     </Tooltip>
//   )
// })

// const HelpButton = forwardRef<HTMLButtonElement>((props, ref) => (
//   <Tooltip>
//     <TooltipTrigger asChild ref={ref} {...props}>
//       <Button variant="outline" size="icon-lg"><CircleHelpIcon /></Button>
//     </TooltipTrigger>
//     <TooltipContent side='left'>
//       Help!
//     </TooltipContent>
//   </Tooltip>
// ));

export const EditorOptions = () => {
  const { toast } = useToast();
  const persistContent = useAppStore(state => state.persistContent);
  const getPersistedContent = useAppStore(state => state.getPersistedContent);
  const persistedContent = getPersistedContent();
  const content = useAppStore(state => state.content);
  const toggleChat = useAppStore(state => state.toggleChat);
  const resetContent = useAppStore(state => state.loadContent);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"outline"} size="icon-lg" onClick={() => persistContent(toast)} className='relative'>
            {<span className={clsx('absolute top-0 right-0 w-2 h-2 bg-rose-700 opacity-0 transition-opacity rounded-full',
              { "opacity-100": persistedContent != content }
            )} />}
            <SaveIcon />
          </Button>
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

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-lg" onClick={toggleChat}><SparklesIcon className='text-indigo-700' /></Button>
        </TooltipTrigger>
        <TooltipContent side='left'>
          Toggle AI chat
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-lg" onClick={() => window.print()}><FileDownIcon /></Button>
        </TooltipTrigger>
        <TooltipContent side='left'>
          Download as PDF
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const Editor = () => {
  const content = useAppStore(state => state.content);
  const setContent = useAppStore(state => state.setContent);
  const setEditor = useAppStore(state => state.setEditor);
  const loading = useAppStore(state => state.loading);
  const loadContent = useAppStore(state => state.loadContent);

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor: e }) => setContent(e.getHTML()),
    onCreate: ({ editor: e }) => setContent(e.getHTML()),
  });

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    setEditor(editor);
  }, [editor]);

  return (
    <div className={clsx("w-full min-h-screen transition-opacity", { 'opacity-50 pointer-events-none': loading })}>
      <div className='max-w-4xl mx-auto w-full'>
        <div className='font-serif prose print:prose-xs print:prose-li:my-0 max-w-none'>
          <EditorContent editor={editor} className="editor" />
          {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
        <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
        </div>
      </div>
    </div>
  );
};
