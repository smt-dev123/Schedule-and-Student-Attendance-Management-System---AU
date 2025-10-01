import { getRoom } from '@/api/RoomAPI'
import { RoomTable } from '@/features/room/RoomTable'
import { useTitle } from '@/hooks/useTitle'
import { Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

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
      <RoomTable data={data} />
    </>
  )
}
