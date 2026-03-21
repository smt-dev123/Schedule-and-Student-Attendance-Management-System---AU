import { getRoom } from '@/api/RoomAPI'
import { RoomTable } from '@/features/room/RoomTable'
import { Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import RoomCreate from './-actions/Create'
import ExportExcel from './-exports/ExportExcel'
import ExportPDF from './-exports/ExportPDF'
import { useTitle } from '@/hooks/useTitle'

export const Route = createFileRoute('/admin/room/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Room Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRoom,
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
            តារាងបន្ទប់សិក្សា
          </Text>
          <Flex gap="2">
            <ExportExcel data={data} />
            <ExportPDF data={data} />
            <RoomCreate />
          </Flex>
        </div>
      </Flex>

      <RoomTable data={data} />
    </>
  )
}
