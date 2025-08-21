import CalendarSchedule from '@/components/CalendarSchedule'
import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/student/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Student Management')
  return (
    <>
      <CalendarSchedule />
    </>
  )
}
