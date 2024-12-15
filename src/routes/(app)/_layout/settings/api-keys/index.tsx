import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_layout/settings/api-keys/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="container py-12 mx-auto">
    <h1 className='text-3xl font-bold'>API Keys</h1>
  </div>
}
