import clsx from "clsx";
import { CopyIcon, PlusCircleIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Card } from "../ui/card";
import { H3 } from "../ui/typography";

const Action = ({ children, ...props }: ComponentProps<"div">) => (
  <div
    {...props}
    className={clsx(
      "flex flex-col gap-2 items-center justify-center  cursor-pointer hover:bg-secondary/80 transition-colors",
      props.className,
    )}
  >
    {children}
  </div>
);

export const NewResumeButton = () => {
  return (
    <Card className="grid grid-rows-2 py-0 gap-0">
      <Action className="border-b">
        <PlusCircleIcon size={48} className="text-accent-foreground/20" />
        <H3>Create empty resume</H3>
      </Action>
      <Action>
        <CopyIcon size={48} className="text-accent-foreground/20" />
        <H3>Close existing resume</H3>
      </Action>
    </Card>
  );
};
