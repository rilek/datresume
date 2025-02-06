import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/stores/app";
import { DetailedHTMLProps, InputHTMLAttributes, useEffect } from "react";
import { Editor, EditorOptions } from "@/components/editor";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { ListXIcon, Loader2Icon } from "lucide-react";
import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

export const Route = createFileRoute("/(app)/_layout/")({
  component: Index,
});

const scrollToEditor = (id: string) => {
  const editor = document.getElementById(id);
  editor?.scrollIntoView({ behavior: "smooth", inline: "start" });
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short',
  timeStyle: 'short'
});

const ChatMessageForm = ({ inputProps }: {
  inputProps?: DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
}) => {
  const form = useForm({
    defaultValues: {
      message: ""
    }
  });
  const send = useChatStore(store => store.sendMessage);

  return (
    <form onSubmit={form.handleSubmit(({ message }) => {
      form.reset();
      send(message);
      window.umami.track("send_chat_message");
    })}>
      <FormField
        control={form.control}
        name="message"
        rules={{ required: 'This field is required' }}
        render={({ field }) => (
          <textarea
            className="w-full ring-0 bg-slate-100 rounded-lg p-2 outline-none"
            onKeyUp={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                (e.target as HTMLTextAreaElement).form!.requestSubmit();
                form.reset();
              }
            }}
            {...field}
            {...inputProps} />
        )} />
    </form>
  );
};

const FirstMessage = () => {
  return (<ChatMessageForm inputProps={{
    placeholder: "Paste job offer URL or write a command",
    autoFocus: true
  }} />)
}

function Index() {
  const loadContent = useAppStore((state) => state.loadContent);
  const loading = useAppStore((state) => state.loading);
  const fetched = useAppStore((state) => state.fetched);
  const showChat = useAppStore((state) => state.showChat);
  const chatMessages = useChatStore((state) => state.chat.messages);
  const resetChat = useChatStore((state) => state.resetChat);
  const editorAreaId = "editor-area";
  const chatLoading = useChatStore((state) => state.loading);

  useEffect(() => {
    loadContent();
  }, []);

  if (loading && !fetched) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="max-w-6xl py-24 mx-auto print:hidden">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-serif font-bold tracking-tight mb-10">
            Make your resume perfect<br />
            for your perfect job
          </h2>
          <p className="mt-8 text-xl text-black/70 leading-8">
            Use GenAI models to adjust your resume to any job offer in
            seconds. Just use the editor, paste the job offer, or its URL, and
            let the magic happen.
          </p>
          <div className="mt-8">
            <Button onClick={() => scrollToEditor(editorAreaId)} size="lg" className="text-lg" data-umami-event="cta_click" data-umami-event-value="try_it_now">
              Try it now
            </Button>
            <span className="ml-2">It's free and no sign in required!</span>
          </div>
        </div>
      </div>

      <div id={editorAreaId}>
        <div className="text-center text-slate-500 text-sm my-2 font-bold print:hidden">
          Edit content below using{" "}
          <a
            href="https://www.markdownguide.org/cheat-sheet/"
            target="_blank"
            className="text-sky-700"
          >
            Markdown
          </a>
        </div>

        <div className="flex items-start mb-12 mx-4 print:m-0 gap-4 max-w-screen">
          <div className="max-w-6xl mx-auto flex-1">
            <div className="bg-white border shadow-lg p-10 print:p-0 print:border-none print:shadow-none">
              <Editor />
            </div>
          </div>
          <div className={clsx("animate-in text-sm slide-in-from-right transition-all border-gray-200 sticky top-4 xl:w-md w-xs print:hidden", {
            "w-0! overflow-hidden opacity-0": !showChat
          })}>
            <div className="w-full max-h-screen overflow-y-auto overflow-hidden p-1 pt-0">
              <header className="pb-4 sticky top-0 bg-white flex justify-between items-center">
                <h2 className="text-lg tracking-tight font-bold">Chat with AI</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={resetChat} size="icon-sm" variant={"ghost"}><ListXIcon /></Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={8}>Clear chat</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </header>

              <div className="flex flex-col gap-2 mt-8">
                {chatMessages.length === 0
                  ? <FirstMessage />
                  : (
                    <>
                      {chatMessages.map(({ id, content, createdAt, role }) =>
                        <div key={id || "temp message"} className={clsx("flex flex-col", { "items-end": role === "user", "animate-pulse": !createdAt })}>
                          <div className={clsx("py-2", { "bg-slate-200 rounded-lg px-4": role === "user" })}>
                            {role === "user" ? content : content["text"] || <i>No answer provided</i>}
                          </div>
                          {createdAt
                            ? <small className="text-xs text-slate-500">{dateFormatter.format(Date.parse(createdAt))}</small>
                            : <div className="animate-spin"><Loader2Icon size={16} /></div>}
                        </div>)}
                      <div className="mt-8">
                        <ChatMessageForm inputProps={{ placeholder: "New command...", disabled: chatLoading }} />
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>

          <div className="sticky top-4 inline-flex flex-col gap-2 print:hidden">
            <EditorOptions />
          </div>
        </div>
      </div>
    </>
  );
}
