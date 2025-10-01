import { getBuilding } from '@/api/BuildingAPI'
import { BuildingTable } from '@/features/building/BuildingTable'
import { useTitle } from '@/hooks/useTitle'
import { Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

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
      <BuildingTable data={data} />
    </>
  )
}
