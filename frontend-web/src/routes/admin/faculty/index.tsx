import { getFaculties } from '@/api/FacultyAPI'
import { FacultiesTable } from '@/features/faculties/FacultyTable'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import FacultyCreate from './-actions/Create'

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
      <Flex direction="column" gap="2" mb="4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Text size="5" className="font-bold">
            តារាងមហាវិទ្យាល័យ
          </Text>
          <Flex gap="2">
            {/* Export */}
            <Button variant="outline" style={{ cursor: 'pointer' }}>
              Export Excel
            </Button>

            <Button variant="outline" style={{ cursor: 'pointer' }}>
              បោះពុម្ភ
            </Button>

            <FacultyCreate />
          </Flex>
        </div>
      </Flex>
      <FacultiesTable data={data} />
    </>
  )
}
