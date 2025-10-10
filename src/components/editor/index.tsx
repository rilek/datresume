import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { Button } from '@/components/ui/button'
import { DiffIcon, FileDownIcon, RotateCcwIcon, SaveIcon, SparklesIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useAppStore } from '@/stores/app'
import { CSSProperties, useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { PopoverClose } from '@radix-ui/react-popover'
import clsx from 'clsx'
import FloatingMenu from './floating-menu'
import BubbleMenu from './bubble-menu'
import { diffWords } from "diff";

const extensions = [StarterKit.configure({
  link: {
    HTMLAttributes: {
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  },
  trailingNode: false
}), Typography, Highlight.configure({ multicolor: true })]

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
  const persistContent = useAppStore(state => state.persistContent);
  const showChat = useAppStore(state => state.showChat);
  const getPersistedContent = useAppStore(state => state.getPersistedContent);
  const persistedContent = getPersistedContent();
  const content = useAppStore(state => state.content);
  const toggleChat = useAppStore(state => state.toggleChat);
  const resetContent = useAppStore(state => state.loadContent);
  const showDiff = useAppStore(state => state.showDiff);
  const setShowDiff = useAppStore(state => state.setShowDiff);
  const downloadPdf = useAppStore(state => state.downloadPdf);


  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-lg" onClick={toggleChat} data-umami-event="toggle_chat" data-umami-event-value={useAppStore.getState().showChat ? "opening" : "closing"} className={clsx({ "bg-indigo-200": showChat })}>
            <SparklesIcon className='text-indigo-700' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='left'>
          Toggle AI chat
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"outline"} size="icon-lg" disabled={showDiff} onClick={() => persistContent()} className='relative' data-umami-event="persist_content">
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
          <Button variant="outline" size="icon-lg" onClick={resetContent} disabled={showDiff} data-umami-event="reset_content"><RotateCcwIcon /></Button>
        </TooltipTrigger>
        <TooltipContent side='left'>
          Reset to last saved state
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-lg" onClick={() => setShowDiff(!showDiff)} data-umami-event="reload_editor" className={clsx({ "bg-indigo-200": showDiff })}><DiffIcon /></Button>
        </TooltipTrigger>
        <TooltipContent side='left'>
          Show diff with last saved state
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-lg" onClick={() => downloadPdf()} data-umami-event="download_resume"><FileDownIcon /></Button>
        </TooltipTrigger>
        <TooltipContent side='left'>
          Download as PDF
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const Editor = ({ initialContent: content }: { initialContent: string }) => {
  const loadContent = useAppStore(state => state.loadContent);
  const setContent = useAppStore(state => state.setContent);
  const setEditor = useAppStore(state => state.setEditor);
  const loading = useAppStore(state => state.loading);
  const showDiff = useAppStore(state => state.showDiff);
  const getPersistedContent = useAppStore(state => state.getPersistedContent);
  const [tempContent, setTempContent] = useState<string | null>(null);

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => setContent(e.getHTML()),
    // onCreate: ({ editor: e }) => setContent(e.getHTML()),
    onFocus: () => window.umami?.track('editor_focus'),
  });

  useEffect(() => {
    if (showDiff) {
      const diff = diffWords(getPersistedContent() || "", editor?.getHTML() || "");

      const newContent = diff.reduce((acc, { value, added, removed }) => {
        if (added) return acc + `<mark data-color="#d8fa99">${value}</mark>`;
        if (removed) return acc + `<s><mark data-color="#ffc9c9">${value}</mark></s>`;
        return acc + value;
      }, "");

      setTempContent(editor?.getHTML() || "");
      editor?.commands.setContent(newContent);
      editor?.setEditable(false);
    } else {
      editor?.commands.setContent(tempContent || "");
      editor?.setEditable(true);
    }
  }, [showDiff])

  useEffect(() => {
    setEditor(editor);
    loadContent()
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      style={{ "--cm": "52px" } as CSSProperties}
      className={clsx('editor py-[calc(1.5_*_var(--cm))] px-[calc(2_*_var(--cm))] w-[calc(21_*_var(--cm))] aspect-[0.709] font-serif prose prose-sm print:prose-xs max-w-none ', { 'opacity-50 pointer-events-none': loading })}>
      <EditorContent editor={editor} data-umami-event />
      <FloatingMenu editor={editor} />
      <BubbleMenu editor={editor} />
    </div>
  );
};
