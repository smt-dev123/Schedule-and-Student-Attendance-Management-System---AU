import { getMajors } from '@/api/MajorAPI'
import { MajorTable } from '@/features/major/MajorTable'
import { useTitle } from '@/hooks/useTitle'
import { Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/major/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Major Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['majors'],
    queryFn: getMajors,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading students.</Text>
  return (
    <>
      <MajorTable data={data} />
    </>
  )
}
