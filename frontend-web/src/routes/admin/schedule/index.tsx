import { createFileRoute } from '@tanstack/react-router'
import { Box, Flex, Text } from '@radix-ui/themes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSchedules, deleteSchedule, getMySchedule } from '@/api/SchedulesAPI'
import { useAcademicStore } from '@/stores/useAcademicStore'
import FetchData from '@/components/FetchData'
import { ScheduleTable } from '@/features/schedule/ScheduleTable'
import toast from 'react-hot-toast'
import ScheduleCreate from './-actions/Create'
import ScheduleUpdate from './-actions/Update'
import { useSession } from '@/lib/auth-client'
import { useState } from 'react'

export const Route = createFileRoute('/admin/schedule/')({
  component: ScheduleListComponent,
})

function ScheduleListComponent() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
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
    queryKey: ['schedules', selectedYearId, role],
    queryFn: () => {
      if (role === 'student') {
        return getMySchedule()
      }
      return getSchedules({ academicYearId: selectedYearId! })
    },
    enabled: role === 'student' ? true : !!selectedYearId,
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
          {role === 'student' ? 'កាលវិភាគសិក្សារបស់ខ្ញុំ' : 'គ្រប់គ្រងកាលវិភាគសិក្សា'}
        </Text>
        <Flex gap="3">
          {['manager', 'staff'].includes(role) && <ScheduleCreate />}
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
