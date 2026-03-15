import { getRoom } from '@/api/RoomAPI'
import { RoomTable } from '@/features/room/RoomTable'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import RoomCreate from './-actions/Create'
import { getBuilding } from '@/api/BuildingAPI'

export const Route = createFileRoute('/admin/room/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Room Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRoom,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading students.</Text>
  return (
    <>
      <Flex direction="column" gap="2" mb="4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Text size="5" className="font-bold">
            តារាងបន្ទប់សិក្សា
          </Text>
          <Flex gap="2">
            {/* Export */}
            <Button variant="outline" style={{ cursor: 'pointer' }}>
              Export Excel
            </Button>

            <Button variant="outline" style={{ cursor: 'pointer' }}>
              បោះពុម្ភ
            </Button>

            <RoomCreate />
          </Flex>
        </div>
      </Flex>

      <RoomTable data={data} />
    </>
  )
}
