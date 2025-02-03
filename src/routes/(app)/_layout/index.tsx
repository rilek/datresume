import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/stores/app";
import { DetailedHTMLProps, InputHTMLAttributes, useEffect } from "react";
import { Editor, EditorOptions } from "@/components/editor";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/ui/form";

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
  // const apiKey = useChatStore(store => store.apiKey);
  const disabled = false //!apiKey;

  return (<ChatMessageForm inputProps={{
    disabled,
    placeholder: disabled ? "Provide API Key before using the chat" : "Paste job offer URL or write a command",
    autoFocus: true
  }} />)
}

// const ApiKeyForm = () => {
//   const apiKey = useChatStore(store => store.apiKey);
//   const setApiKey = useChatStore(store => store.setApiKey);
//   const form = useForm({
//     defaultValues: {
//       apiKey: apiKey || ""
//     }
//   });

//   const [showTooltip, setShowTooltip] = useState(false);

//   return (
//     <>
//       <div>
//         <h5>OpenAI Key</h5>
//         <form onSubmit={form.handleSubmit(({ apiKey }) => {
//           setApiKey(apiKey)
//           setShowTooltip(true);
//         })}>
//           <div className="flex gap-2">
//             <Input type="password" placeholder="API Key" {...form.register("apiKey")} />

//             <TooltipProvider>
//               <Tooltip open={showTooltip} onOpenChange={() => setTimeout(() => setShowTooltip(false), 3000)}>
//                 <TooltipTrigger asChild>
//                   <Button type="submit">Set</Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Done!</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//         </form>
//         <p className="text-sm text-slate-500 leading-4 mt-2">To use AI chat feature you need to provide your own API key. No worries - it will persist only within this session and will not be used elsewhere.</p>
//         {apiKey && (
//           <p className="text-sm text-green-500 leading-4 mt-2">API Key is set. You can use AI chat now.</p>
//         )}
//       </div>

//     </>
//   );
// };

function Index() {
  const loadContent = useAppStore((state) => state.loadContent);
  const loading = useAppStore((state) => state.loading);
  const fetched = useAppStore((state) => state.fetched);
  const showChat = useAppStore((state) => state.showChat);
  const chatMessages = useChatStore((state) => state.messages);
  const editorAreaId = "editor-area";

  useEffect(() => {
    loadContent();
  }, []);

  if (loading && !fetched) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="p-4 print:hidden">
        <h1 className="font-serif text-xl font-extrabold">Datresume</h1>
      </header>

      <div className="max-w-6xl py-24 mx-auto print:hidden">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-serif font-bold tracking-tight mb-10">
            Match your resume to your perfect job
          </h2>
          <p className="mt-8 text-xl text-black/70 leading-8">
            Use GenAI models to adjust your resume to any job offer in
            seconds. Just use the editor, paste the job offer, or its URL, and
            let the magic happen.
          </p>
          <div className="mt-8">
            <Button onClick={() => scrollToEditor(editorAreaId)} size={"lg"} className="text-lg">Use it for free</Button>
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

        <div className="flex items-start mb-12 mx-4 print:m-0 gap-4 max-w-screen overflow-clip">
          <div className="max-w-6xl mx-auto flex-1">
            <div className="bg-white border shadow-lg p-10 print:p-0 print:border-none print:shadow-none">
              <Editor />
            </div>
          </div>
          <div className={clsx("animate-in slide-in-from-right transition-all border-gray-200 sticky top-4 print:hidden", {
            "w-lg": showChat,
            "w-0 overflow-hidden opacity-0": !showChat
          })}>
            <div className="w-full overflow-hidden">
              <header className="mb-4">
                <h2 className="text-lg tracking-tight font-bold">Chat with AI</h2>
              </header>

              {/* <div>
                <ApiKeyForm />
              </div> */}

              <div className="flex flex-col gap-2 mt-8">
                {chatMessages.length === 0
                  ? <FirstMessage />
                  : (
                    <>
                      {chatMessages.map(({ id, message, timestamp, role }) =>
                        <div key={id} className={clsx("flex flex-col", { "items-end": role === "user" })}>
                          <div className={clsx("py-2", { "bg-slate-200 rounded-lg px-4": role === "user" })}>
                            {message}
                          </div>
                          <small className="text-xs text-slate-500">{dateFormatter.format(Date.parse(timestamp))}</small>
                        </div>)}
                      <div className="mt-8">
                        <ChatMessageForm inputProps={{ placeholder: "New command..." }} />
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
