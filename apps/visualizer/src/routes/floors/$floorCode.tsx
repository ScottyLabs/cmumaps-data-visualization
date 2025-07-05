import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/floors/$floorCode")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/$floorCode"!</div>;
}
