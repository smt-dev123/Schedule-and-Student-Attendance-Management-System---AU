import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/student/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/student/"!</div>
}
