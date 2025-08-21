import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('User Management')
  return <div>Hello "/admin/user/"!</div>
}
