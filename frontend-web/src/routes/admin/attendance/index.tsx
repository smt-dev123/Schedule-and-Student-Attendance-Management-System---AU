import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/attendance/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Attendance Management')
  return <div>Hello "/admin/attendance/"!</div>
}
