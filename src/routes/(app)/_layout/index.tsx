import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_layout/')({
  component: Index,
})

function Index() {
  return (
    <div className="w-full min-h-screen">
      INDEX
    </div>
  )
}
