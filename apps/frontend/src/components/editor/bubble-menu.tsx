import { PopoverTrigger } from "@radix-ui/react-popover";
import { type BubbleMenuProps, BubbleMenu as TipTapBubbleMenu } from "@tiptap/react/menus";
import clsx from "clsx";
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
} from "lucide-react";
import { forwardRef } from "react";
import { Button, type ButtonProps } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent } from "../ui/popover";

type MenuButtonProps = ButtonProps & { active?: boolean };

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(({ active, ...props }, ref) => (
  <Button
    size="xs"
    variant={"ghost"}
    {...props}
    className={clsx("", { "bg-primary text-primary-foreground hover:bg-primary/70": active }, props.className)}
    ref={ref}
  />
));

export default function FloatingMenu(props: Omit<BubbleMenuProps, "children">) {
  const editor = props.editor!;

  return (
    <TipTapBubbleMenu {...props}>
      <div className="flex gap-0.5 p-1 rounded bg-background border shadow-xl">
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1Icon />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2Icon />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          <Heading3Icon />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          active={editor.isActive("heading", { level: 4 })}
        >
          <Heading4Icon />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          active={editor.isActive("heading", { level: 5 })}
        >
          <Heading5Icon />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <ListIcon />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrderedIcon />
        </MenuButton>
        <div className="w-px bg-primary-foreground"></div>
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <BoldIcon />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <ItalicIcon />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
          <StrikethroughIcon />
        </MenuButton>
        <div className="w-px bg-primary-foreground"></div>

        <Popover>
          <PopoverTrigger asChild>
            <MenuButton active={editor.isActive("link")}>
              <Link2Icon />
            </MenuButton>
          </PopoverTrigger>

          <PopoverContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newValue = ((e.target as HTMLFormElement).elements[0] as HTMLInputElement).value;
                if (newValue) editor.chain().focus().setLink({ href: newValue, target: "_blank" }).run();
                else editor.chain().focus().unsetLink().run();
              }}
            >
              <Input placeholder="https://example.com" defaultValue={editor.getAttributes("link").href} />
              <Button type="submit" variant="default">
                Apply
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </TipTapBubbleMenu>
  );
}
