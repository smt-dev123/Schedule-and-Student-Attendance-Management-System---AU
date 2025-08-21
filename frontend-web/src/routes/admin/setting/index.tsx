import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/setting/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Settings')
  return <div>Hello "/admin/setting/"!</div>
}
