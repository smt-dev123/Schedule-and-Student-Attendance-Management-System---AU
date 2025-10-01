import { getFaculties } from '@/api/FacultyAPI'
import { FacultiesTable } from '@/features/faculties/FacultyTable'
import { useTitle } from '@/hooks/useTitle'
import { Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/faculty/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Faculty Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading students.</Text>
  return (
    <>
      <FacultiesTable data={data} />
    </>
  )
}
