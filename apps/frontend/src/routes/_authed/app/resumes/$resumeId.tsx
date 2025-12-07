import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/app/resumes/$resumeId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authed/app/resume/$resumeId"!</div>;
}
