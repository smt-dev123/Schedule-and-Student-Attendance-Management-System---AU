import { getDepartments } from '@/api/DepartmentAPI'
import { DepartmentTable } from '@/features/department/DepartmentTable'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import DepartmentCreate from './-actions/Create'

export const Route = createFileRoute('/admin/department/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Department Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
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

            <DepartmentCreate />
          </Flex>
        </div>
      </Flex>
      <DepartmentTable data={data} />
    </>
  )
}
