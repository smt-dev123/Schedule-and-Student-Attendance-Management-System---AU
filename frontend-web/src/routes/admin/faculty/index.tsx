import { getFaculties } from '@/api/FacultyAPI'
import { FacultiesTable } from '@/features/faculties/FacultyTable'
import { useTitle } from '@/hooks/useTitle'
import { Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import FacultyCreate from './-actions/Create'
import ExportExcel from './-exports/ExportExcel'
import ExportPDF from './-exports/ExportPDF'

export const Route = createFileRoute('/admin/faculty/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Faculty Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
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
            <ExportExcel data={data} />
            <ExportPDF data={data} />

            <FacultyCreate />
          </Flex>
        </div>
      </Flex>
      <FacultiesTable data={data} />
    </>
  )
}
