import { redirect, createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useMutation } from "../hooks/useMutation";
import { Auth } from "../components/login/auth";
import { createSupabaseServerClient } from "../utils/supabase/server";
import { defaultContent, getPersistedLocalContent } from "@/utils/editor";

export const signupFn = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string; initialResume: string; redirectUrl?: string }) => d)
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }

    // Create initial resume for the user
    const result = await supabase.from("resumes").insert({
      name: "My first resume",
      content: { html: data.initialResume },
      is_default: true,
    });

    // Redirect to the prev page stored in the "redirect" search param
    throw redirect({
      href: data.redirectUrl || "/app",
    });
  });

export const Route = createFileRoute("/signup")({
  component: SignupComp,
});

function SignupComp() {
  const signupMutation = useMutation({
    fn: useServerFn(signupFn),
  });

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
          onSubmit={(e) => {
            const formData = new FormData(e.target as HTMLFormElement);

            signupMutation.mutate({
              data: {
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                initialResume: getPersistedLocalContent() || defaultContent,
              },
            });
          }}
          afterSubmit={
            signupMutation.data?.error ? (
              <>
                <div className="text-red-400">{signupMutation.data.message}</div>
              </>
            ) : null
          }
        />
      </div>
    </div>
  );
}
