import { getBuilding } from '@/api/BuildingAPI'
import { BuildingTable } from '@/features/building/BuildingTable'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import BuildingCreate from './-actions/Create'

export const Route = createFileRoute('/admin/building/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Building Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['buildings'],
    queryFn: getBuilding,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading students.</Text>
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

            <BuildingCreate />
          </Flex>
        </div>
      </Flex>

      <BuildingTable data={data} />
    </>
  )
}
