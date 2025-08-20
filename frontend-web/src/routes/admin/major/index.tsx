import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/major/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/major/"!</div>
}
