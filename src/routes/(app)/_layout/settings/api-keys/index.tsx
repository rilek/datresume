import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_layout/settings/api-keys/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/_layout/settings/api-keys/"!</div>
}
