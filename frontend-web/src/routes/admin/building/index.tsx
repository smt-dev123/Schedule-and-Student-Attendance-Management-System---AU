import { getBuilding } from '@/api/BuildingAPI'
import { BuildingTable } from '@/features/building/BuildingTable'
import { useTitle } from '@/hooks/useTitle'
import { Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import BuildingCreate from './-actions/Create'
import ExportExcel from './-exports/ExportExcel'
import ExportPDF from './-exports/ExportPDF'

export const Route = createFileRoute('/admin/building/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Building Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['buildings'],
    queryFn: getBuilding,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading data.</Text>

  return (
    <>
      <Flex direction="column" gap="2" mb="4">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Text size="5" className="font-bold">
            តារាងអាគារសិក្សា
          </Text>
          <Flex gap="2">
            <ExportExcel data={data} />
            <ExportPDF data={data} />
            <BuildingCreate />
          </Flex>
        </div>
      </Flex>

      <BuildingTable data={data} />
    </>
  )
}