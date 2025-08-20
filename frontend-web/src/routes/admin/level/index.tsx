import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/level/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/level/"!</div>
}
