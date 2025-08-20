import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/generation/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/generation/"!</div>
}
