import { createFileRoute } from '@tanstack/react-router'
import { Box, Flex, Text } from '@radix-ui/themes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSchedules, deleteSchedule } from '@/api/SchedulesAPI'
import { useAcademicStore } from '@/stores/useAcademicStore'
import FetchData from '@/components/FetchData'
import { ScheduleTable } from '@/features/schedule/ScheduleTable'
import toast from 'react-hot-toast'
import ScheduleCreate from './-actions/Create'
import ScheduleUpdate from './-actions/Update'
import { useState } from 'react'

export const Route = createFileRoute('/admin/schedule/')({
  component: ScheduleListComponent,
})

function ScheduleListComponent() {
  const { selectedYearId } = useAcademicStore()
  const queryClient = useQueryClient()
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(
    null,
  )
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  const {
    data: schedulesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['schedules', selectedYearId],
    queryFn: () => getSchedules({ academicYearId: selectedYearId! }),
    enabled: !!selectedYearId,
  })

  const schedules = schedulesResponse || []

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSchedule(id),
    onSuccess: () => {
      toast.success('លុបកាលវិភាគជោគជ័យ')
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
    },
    onError: () => toast.error('មិនអាចលុបបានទេ'),
  })

  const enrichedSchedules = schedules.map((s: any) => ({
    ...s,
    onDelete: (id: number) => deleteMutation.mutate(id),
    onEdit: (id: number) => {
      setEditingScheduleId(id)
      setIsUpdateOpen(true)
    },
  }))

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Text size="5" weight="bold">
          គ្រប់គ្រងកាលវិភាគសិក្សា
        </Text>
        <Flex gap="3">
          <ScheduleCreate />
        </Flex>
      </Flex>

      <FetchData isLoading={isLoading} error={error} data={schedules}>
        <ScheduleTable data={enrichedSchedules} />
      </FetchData>

      <ScheduleUpdate
        scheduleId={editingScheduleId}
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
      />
    </Box>
  )
}
