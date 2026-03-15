import { getAcademicYear } from '@/api/AcademicYearAPI'
import { AcademicYearTable } from '@/features/academic_year/GenerationTable'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import AcademicYearCreate from './-actions/Create'

export const Route = createFileRoute('/admin/academic_year/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Generation Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['academic_years'],
    queryFn: getAcademicYear,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>មានកំហុងក្នុងការទាញយកទិន្នន័យ</Text>
  return (
    <>
      <Flex direction="column" gap="2" mb="4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Text size="5" className="font-bold">
            តារាងអាគារសិក្សា
          </Text>
          <Flex gap="2">
            {/* Export */}
            <Button variant="outline" style={{ cursor: 'pointer' }}>
              Export Excel
            </Button>

            <Button variant="outline" style={{ cursor: 'pointer' }}>
              បោះពុម្ភ
            </Button>

            <AcademicYearCreate />
          </Flex>
        </div>
      </Flex>
      <AcademicYearTable data={data} />
    </>
  )
}
