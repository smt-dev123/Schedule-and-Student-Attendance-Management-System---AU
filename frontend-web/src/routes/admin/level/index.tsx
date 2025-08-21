import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/level/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Level Management')
  return <div>Hello "/admin/level/"!</div>
}
