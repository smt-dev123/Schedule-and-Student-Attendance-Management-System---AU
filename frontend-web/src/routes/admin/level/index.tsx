import { getGradeLevel } from '@/api/GradeLevelAPI'
import { GradeLevelTable } from '@/features/gradeLevel/GradeLevelTable'
import { useTitle } from '@/hooks/useTitle'
import { Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/admin/level/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Level Management')

  const [globalFilter, setGlobalFilter] = useState('')
  const { data, isLoading, error } = useQuery({
    queryKey: ['gradeLevel'],
    queryFn: getGradeLevel,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading students.</Text>
  return (
    <>
      <GradeLevelTable data={data} />
    </>
  )
}
