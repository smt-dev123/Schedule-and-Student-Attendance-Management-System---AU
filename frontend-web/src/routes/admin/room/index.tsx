import { getRoom } from '@/api/RoomAPI'
import { RoomTable } from '@/features/room/RoomTable'
import { Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import RoomCreate from './-actions/Create'
import { useTitle } from '@/hooks/useTitle'
import FetchData from '@/components/FetchData'
import { useState } from 'react'

export const Route = createFileRoute('/admin/room/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Room Management')

  const [name, setName] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms', name, page, limit],
    queryFn: () => getRoom(name, page, limit),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  })

  if (isLoading || error) {
    return <FetchData isLoading={isLoading} error={error} data={data} />
  }
  return (
    <>
      <Flex direction="column" gap="2" mb="4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Flex gap="2">
            <Text size="5" className="font-bold">
              តារាងបន្ទប់សិក្សា
            </Text>
          </Flex>
          <RoomCreate />
        </div>
      </Flex>

      <RoomTable data={data} />
    </>
  )
}
