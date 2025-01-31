import { createFileRoute } from "@tanstack/react-router";
import { useAppStore } from "@/stores/app";
import { useEffect } from "react";
import { Editor, EditorOptions } from "@/components/editor";
import clsx from "clsx";

export const Route = createFileRoute("/(app)/_layout/")({
  component: Index,
});

function Index() {
  const loadContent = useAppStore((state) => state.loadContent);
  const loading = useAppStore((state) => state.loading);
  const fetched = useAppStore((state) => state.fetched);
  const showChat = useAppStore((state) => state.showChat);

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
        </div>
      </div>

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

      <div className="flex mb-12 mx-4 gap-4">
        <div className="order-last  mt-6 print:hidden">
          <div className="sticky top-4 inline-flex flex-col gap-2">
            <EditorOptions />
          </div>
        </div>

        <div className="max-w-6xl mx-auto flex-1">
          <div className="bg-white border shadow-lg p-10 print:border-none print:shadow-none">
            <Editor />
          </div>
        </div>
        <div className={clsx("animate-in slide-in-from-right transition-all border-gray-200 overflow-hidden print:hidden", {
          "w-md": showChat,
          "w-0": !showChat
        })}>
          <header>
            <h2 className="text-lg tracking-tight font-bold">Chat with AI</h2>
          </header>

          <div className="flex flex-col gap-2 mt-8">
            <input type="text" placeholder="Paste job offer URL or write a command" autoFocus className="ring-0 outline-none" />
          </div>
        </div>
      </div>
    </>
  );
}
