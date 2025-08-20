import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/faculty/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/faculty/"!</div>
}
