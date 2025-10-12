import { FloatingMenu as TipTapFloatingMenu, FloatingMenuProps } from "@tiptap/react/menus";
import { Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon, Heading5Icon, ListIcon, ListOrderedIcon } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";
import { forwardRef } from "react";
import clsx from "clsx";


type MenuButtonProps = ButtonProps & { active?: boolean };

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(({ active, ...props }, ref) =>
  <Button size="xs" variant={"ghost"} {...props} className={clsx("[&>svg]:w-4", { "bg-primary text-primary-foreground": active }, props.className)} ref={ref} />);

export default function FloatingMenu(props: Omit<FloatingMenuProps, "children">) {

  const editor = props.editor!;

  return <TipTapFloatingMenu {...props}>
    <div className="flex gap-0.5 rounded border">
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}><Heading1Icon /></MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2Icon /></MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3Icon /></MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive("heading", { level: 4 })}><Heading4Icon /></MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} active={editor.isActive("heading", { level: 5 })}><Heading5Icon /></MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><ListIcon /></MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrderedIcon /></MenuButton>
    </div>
  </TipTapFloatingMenu>;
}