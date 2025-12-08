import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import z from "zod";
import { defaultContent, getPersistedLocalContent } from "@/utils/editor";
import { Auth } from "../components/login/auth";
import { useMutation } from "../hooks/useMutation";
import { createSupabaseServerClient } from "../utils/supabase/server";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  initialResume: z.string(),
  redirectUrl: z.string().optional(),
});

export const signupFn = createServerFn({ method: "POST" })
  .inputValidator((data) => {
    const parsed = signupSchema.safeParse(data);
    if (parsed.success) return parsed.data;
    else {
      setResponseStatus(400);
      throw { error: true, message: parsed.error.errors.at(0)?.message };
    }
  })
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setResponseStatus(400);
      throw { error: true, message: error.message };
    }

    // Create initial resume for the user
    await supabase.from("resumes").insert({
      name: "My first resume",
      content: { html: data.initialResume },
      is_default: true,
    });

    // Redirect to the prev page stored in the "redirect" search param
    throw redirect({ href: data.redirectUrl || "/app" });
  });

export const Route = createFileRoute("/signup")({
  component: SignupComp,
});

function SignupComp() {
  const signupMutation = useMutation({
    fn: useServerFn(signupFn),
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.target as HTMLFormElement);

    const r = await signupMutation.mutate({
      data: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        initialResume: getPersistedLocalContent() || defaultContent,
      },
    });
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Auth
          title={"Welcome to Datresume!"}
          postTitle={
            <div className="text-center text-sm">
              Have an account already?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          }
          actionText="Sign Up"
          status={signupMutation.status}
          onSubmit={onSubmit}
          afterSubmit={signupMutation.error ? <div className="text-red-400">{signupMutation.error.message}</div> : null}
        />
      </div>
    </div>
  );
}
