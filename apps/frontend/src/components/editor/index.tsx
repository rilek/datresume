import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import clsx from "clsx";
import { diffWords } from "diff";
import { type CSSProperties, useEffect, useState } from "react";
import { useAppStore } from "@/stores/app";
import { getPersistedLocalContent } from "@/utils/editor";
import BubbleMenu from "./bubble-menu";
import FloatingMenu from "./floating-menu";

const extensions = [
  StarterKit.configure({
    link: {
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer",
      },
    },
    trailingNode: false,
  }),
  Typography,
  Highlight.configure({ multicolor: true }),
];

export const editorClassName =
  "editor py-[calc(1.5_*_var(--cm))] px-[calc(2_*_var(--cm))] w-[calc(21_*_var(--cm))] aspect-[0.709] font-serif prose prose-sm max-w-none ";

export const Editor = ({ initialContent: content }: { initialContent: string }) => {
  const loadContent = useAppStore((state) => state.loadContent);
  const setContent = useAppStore((state) => state.setContent);
  const setEditor = useAppStore((state) => state.setEditor);
  const loading = useAppStore((state) => state.loading);
  const showDiff = useAppStore((state) => state.showDiff);
  const [tempContent, setTempContent] = useState<string | null>(null);

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => setContent(e.getHTML()),
    // onCreate: ({ editor: e }) => setContent(e.getHTML()),
    onFocus: () => window.umami?.track("editor_focus"),
  });

  useEffect(() => {
    if (editor) {
      if (showDiff) {
        const diff = diffWords(getPersistedLocalContent() || "", editor.getHTML() || "");

        const newContent = diff.reduce((acc, { value, added, removed }) => {
          if (added) return `${acc}<mark data-color="#d8fa99">${value}</mark>`;
          if (removed) return `${acc}<s><mark data-color="#ffc9c9">${value}</mark></s>`;
          return acc + value;
        }, "");

        setTempContent(editor.getHTML() || "");
        editor.commands.setContent(newContent);
        editor.setEditable(false);
      } else {
        editor.commands.setContent(tempContent || "");
        editor.setEditable(true);
      }
    }
  }, [editor, showDiff]);

  useEffect(() => {
    setEditor(editor);
    loadContent();
  }, [loadContent, setEditor, editor]);

  if (!editor) return null;

  return (
    <div
      style={{ "--cm": "52px" } as CSSProperties}
      className={clsx(editorClassName, {
        "opacity-50 pointer-events-none": loading,
      })}
    >
      <EditorContent editor={editor} data-umami-event />
      <FloatingMenu editor={editor} />
      <BubbleMenu editor={editor} />
    </div>
  );
};
