import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { DiffIcon, FileDownIcon, RotateCcwIcon, SaveIcon, SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/stores/app";
import { getPersistedLocalContent, persistLocalContent } from "@/utils/editor";
import { Button } from "../ui/button";

export const EditorOptions = () => {
  const showChat = useAppStore((state) => state.showChat);
  const content = useAppStore((state) => state.content);
  const toggleChat = useAppStore((state) => state.toggleChat);
  const showDiff = useAppStore((state) => state.showDiff);
  const setShowDiff = useAppStore((state) => state.setShowDiff);
  const downloadPdf = useAppStore((state) => state.downloadPdf);

  const [persistedContent, setPersistedContent] = useState<string | null>(null);

  useEffect(() => {
    setPersistedContent(getPersistedLocalContent());
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-lg"
            onClick={toggleChat}
            data-umami-event="toggle_chat"
            data-umami-event-value={useAppStore.getState().showChat ? "opening" : "closing"}
            className={clsx({ "bg-indigo-200": showChat })}
          >
            <SparklesIcon className="text-indigo-700" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Toggle AI chat</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"outline"}
            size="icon-lg"
            disabled={showDiff}
            onClick={() => {
              persistLocalContent(useAppStore.getState().content || "");
              toast("Saved sucessfully");
            }}
            className="relative"
            data-umami-event="persist_content"
          >
            {
              <span
                className={clsx(
                  "absolute top-0 right-0 w-2 h-2 bg-rose-700 opacity-0 transition-opacity rounded-full",
                  { "opacity-100": persistedContent !== content },
                )}
              />
            }
            <SaveIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Save to local storage</TooltipContent>
      </Tooltip>
      {/*
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-lg"
            onClick={resetContent}
            disabled={showDiff}
            data-umami-event="reset_content"
          >
            <RotateCcwIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Reset to last saved state</TooltipContent>
      </Tooltip>*/}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-lg"
            onClick={() => setShowDiff(!showDiff)}
            data-umami-event="reload_editor"
            className={clsx({ "bg-indigo-200": showDiff })}
          >
            <DiffIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Show diff with last saved state</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-lg" onClick={() => downloadPdf()} data-umami-event="download_resume">
            <FileDownIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Download as PDF</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
