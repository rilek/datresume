import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "../ui/field";
import { ReactNode } from "react";

export function Auth({
  title,
  postTitle,
  actionText,
  onSubmit,
  status,
  afterSubmit,
}: {
  title: string;
  postTitle?: ReactNode;
  actionText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: "pending" | "idle" | "success" | "error";
  afterSubmit?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-6")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">{title}</h1>
            {postTitle}
          </div>
          <FieldGroup>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="your@example.com" required />
            </Field>
            <Field>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </Field>
          </FieldGroup>
          <div>
            <Button type="submit" className="w-full">
              {status === "pending" ? "..." : actionText}
            </Button>
          </div>
          {afterSubmit ? afterSubmit : null}
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
