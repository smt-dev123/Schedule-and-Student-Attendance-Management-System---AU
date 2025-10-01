import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/building/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/building/"!</div>
}
