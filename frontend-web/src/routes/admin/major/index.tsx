import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/major/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Major Management')
  return <div>Hello "/admin/major/"!</div>
}
