import { ClientOnly, createFileRoute, Link, redirect, useRouteContext } from "@tanstack/react-router";
import { useAppStore } from "@/stores/app";
import { CSSProperties, DetailedHTMLProps, InputHTMLAttributes, useEffect, useRef } from "react";
import { Editor, EditorOptions } from "@/components/editor";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { ListXIcon, Loader2Icon } from "lucide-react";
import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PageHeader from "@/components/layout/header";
import PageFooter from "@/components/layout/footer";
import { HelpUsImprove } from "@/components/help-us-improve";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/app' })
    }
  },
  component: Index,
});

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
      window.umami?.track("send_chat_message");
    })}>
      <FormField
        control={form.control}
        name="message"
        rules={{ required: 'This field is required' }}
        render={({ field }) => (
          <textarea
            className="w-full ring-0 bg-white border rounded-lg p-2 outline-none disabled:opacity-50"
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

const EditorWrapper = () => {
  const content = useAppStore(state => state.content);

  return (
    <Editor initialContent={content || ""} />
  )
};

const GoToAppButton = () => {
  return (
    <Link to="/app">
      <Button size="sm" variant="outline">Open app</Button>
    </Link>
  )
}

const HeaderLinks = () => {
  return (
    <>
      {/* <a href="https://www.producthunt.com/posts/datresume?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-datresume" target="_blank">
          <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=855558&theme=light&t=1738915308541" alt="Datresume - Perfect&#0032;resume&#0032;for&#0032;perfect&#0032;job&#0032;&#0045;&#0032;no&#0032;sign&#0032;up&#0032;required&#0033; | Product Hunt" style={{ width: 148, height: 32 }} width="148" height="32" />
        </a> */}
      <HelpUsImprove />
      <GoToAppButton />
    </>
  )
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
  const showDiff = useAppStore((state) => state.showDiff);

  useEffect(() => {
    loadContent();
  }, []);

  if (loading && !fetched) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader links={<HeaderLinks />} />
      <div className="max-w-6xl py-24 mx-auto px-4">
        <div className="max-w-2xl mx-auto flex flex-col justify-center">
          <div className="bg-amber-300 text-amber-800 font-bold -mt-8 mb-8 rounded block sm:hidden p-4 text-center">
            Experience from using this app on mobile devices is not perfect. We suggest using desktop instead.
          </div>
          <h2 className="text-5xl mx-auto font-serif text-center font-bold tracking-tight mb-10">
            Make perfect resume <br />
            for your next perfect job
          </h2>
          <p className="mt-8 mx-auto text-xl text-black/70 leading-8">
            Adjust your resume to any job offer in seconds with AI Chat. Just write or paste resume in the editor, send job URL or text to chat and
            let the magic happen.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap items-baseline">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg" data-umami-event="cta_click" data-umami-event-value="show_demo">
                  Show demo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-none w-auto rounded-2xl">
                <DialogTitle className="text-center mb-4">Datresume in action</DialogTitle>
                <div className="relative box-content mx-auto max-h-[80vh] w-5xl aspect-[2.18]">
                  <iframe
                    src="https://app.supademo.com/embed/cm6tutz160670oeplu8v1r78t?embed_v=2"
                    loading="lazy"
                    title="Datresume demo"
                    allow="clipboard-write"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
            <span className="whitespace-nowrap">It's free and no sign in required to try!</span>
          </div>
        </div>
      </div>

      <div id={editorAreaId}>
        <div className="flex items-start mb-12 mx-4 gap-4 max-w-screen">
          <div className="flex justify-center flex-1">
            <div className="inline-block bg-white border shadow-lg">
              <EditorWrapper />
            </div>
          </div>
          <div className={clsx("animate-in text-sm slide-in-from-right transition-all border-gray-200 sticky top-4 xl:w-md w-xs", {
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
                          <div className={clsx("py-2", { "bg-indigo-200 rounded-lg px-4": role === "user" })}>
                            {role === "user" ? content : content["text"] || <i>No answer provided</i>}
                          </div>
                          {createdAt
                            ? <small className="text-xs opacity-50">{dateFormatter.format(Date.parse(createdAt))}</small>
                            : <div className="animate-spin"><Loader2Icon size={16} /></div>}
                        </div>)}
                      <div className="mt-8">
                        <ChatMessageForm inputProps={{ placeholder: "New command...", disabled: chatLoading || showDiff, }} />
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>

          <div className="sticky top-4 inline-flex flex-col gap-2">
            <EditorOptions />
          </div>
        </div>
      </div>
      <PageFooter />
    </>
  );
}
