import { getGeneration } from '@/api/GenerationAPI'
import { GenerationTable } from '@/features/generation/GenerationTable'
import { useTitle } from '@/hooks/useTitle'
import { Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/generation/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Generation Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['generations'],
    queryFn: getGeneration,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading students.</Text>
  return (
    <>
      <GenerationTable data={data} />
    </>
  )
}
