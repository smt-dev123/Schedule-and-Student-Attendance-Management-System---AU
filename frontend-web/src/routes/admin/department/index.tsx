import { getDepartments } from '@/api/DepartmentAPI'
import { DepartmentTable } from '@/features/department/DepartmentTable'
import { useTitle } from '@/hooks/useTitle'
import { Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import DepartmentCreate from './-actions/Create'
import ExportExcel from './-exports/ExportExcel'
import ExportPDF from './-exports/ExportPDF'

export const Route = createFileRoute('/admin/department/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Department Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
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
            តារាងតេប៉ាតឺម៉ង់
          </Text>
          <Flex gap="2">
            <ExportExcel data={data} />
            <ExportPDF data={data} />

            <DepartmentCreate />
          </Flex>
        </div>
      </Flex>
      <DepartmentTable data={data} />
    </>
  )
}
