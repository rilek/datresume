import { Auth } from "@/components/login/auth";
import { useMutation } from "@/hooks/useMutation";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { loginFn } from "./_authed";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/app" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const loginMutation = useMutation({
    fn: loginFn,
    onSuccess: async (ctx) => {
      if (!ctx.data?.error) {
        await router.invalidate();
        router.navigate({ to: "/app" });
        return;
      }
    },
  });

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Auth
          title="Login to Datresume"
          postTitle={
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          }
          actionText="Login"
          status={loginMutation.status}
          onSubmit={(e) => {
            const formData = new FormData(e.target as HTMLFormElement);

            loginMutation.mutate({
              data: {
                email: formData.get("email") as string,
                password: formData.get("password") as string,
              },
            });
          }}
          afterSubmit={loginMutation.data ? <div className="text-red-400">{loginMutation.data.message}</div> : null}
        />
      </div>
    </div>
  );
}
