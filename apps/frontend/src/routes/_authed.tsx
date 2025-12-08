import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import PageHeader from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "../utils/supabase/server";

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  });

const HeaderLinks = () => {
  return (
    <Link to="/logout">
      <Button size="sm" variant="outline">
        Logout
      </Button>
    </Link>
  );
};

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: "/login", search: { redirectTo: location.publicHref } });
    }
  },
  component: () => {
    return (
      <>
        <PageHeader links={<HeaderLinks />} />
        <Outlet />
      </>
    );
  },
});
