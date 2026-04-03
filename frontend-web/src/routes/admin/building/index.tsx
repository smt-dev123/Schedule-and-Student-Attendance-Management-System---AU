import { getBuilding } from '@/api/BuildingAPI'
import { BuildingTable } from '@/features/building/BuildingTable'
import { useTitle } from '@/hooks/useTitle'
import { Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import BuildingCreate from './-actions/Create'
import ExportExcel from './-exports/ExportExcel'
import ExportPDF from './-exports/ExportPDF'
import { useState } from 'react'
import FetchData from '@/components/FetchData'
import BuildingCard from '@/components/ui/Card'

export const Route = createFileRoute('/admin/building/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Building Management')

  const [name, setName] = useState("all");
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ['buildings', name, search],
    queryFn: () => getBuilding(name, search),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  })

  if (isLoading || error) {
    return <FetchData isLoading={isLoading} error={error} data={data} />
  }

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
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          data.map((building: any) => (
            <BuildingCard key={building.id} building={building} onEdit={() => { }} onDelete={() => { }} onView={() => { }} />
          ))
        }
      </div> */}
    </>
  )
}