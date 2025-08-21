import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/generation/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Generation Management')
  return <div>Hello "/admin/generation/"!</div>
}
