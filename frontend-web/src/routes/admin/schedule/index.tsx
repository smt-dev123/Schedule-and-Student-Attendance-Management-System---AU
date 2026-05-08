import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Box, Flex, Text, Select, Button, TextField } from '@radix-ui/themes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSchedules, deleteSchedule, getMySchedule } from '@/api/SchedulesAPI'
import { useAcademicStore } from '@/stores/useAcademicStore'
import FetchData from '@/components/FetchData'
import { ScheduleTable } from '@/features/schedule/ScheduleTable'
import toast from 'react-hot-toast'
import ScheduleCreate from './-actions/Create'
import ScheduleUpdate from './-actions/Update'
import { useSessionContext } from '@/providers/AuthProvider'
import { useState, useEffect, useMemo } from 'react'
import { getFaculties } from '@/api/FacultyAPI'
import { getDepartments } from '@/api/DepartmentAPI'
import { getAcademicLevels } from '@/api/AcademicLevelAPI'
import { IoFilter, IoSearch } from 'react-icons/io5'

type ScheduleSearch = {
  name?: string
  facultyId?: string
  departmentId?: string
  academicLevelId?: string
}

export const Route = createFileRoute('/admin/schedule/')({
  validateSearch: (search: Record<string, unknown>): ScheduleSearch => {
    return {
      name: (search.name as string) || '',
      facultyId: (search.facultyId as string) || 'all',
      departmentId: (search.departmentId as string) || 'all',
      academicLevelId: (search.academicLevelId as string) || 'all',
    }
  },
  component: ScheduleListComponent,
})

function ScheduleListComponent() {
  const { data: session } = useSessionContext()
  const role = (session?.user as any)?.role
  const { selectedYearId } = useAcademicStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate({ from: Route.fullPath })
  const { name, facultyId, departmentId, academicLevelId } = Route.useSearch()

  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(
    null,
  )
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  const [draft, setDraft] = useState<ScheduleSearch>({
    name,
    facultyId,
    departmentId,
    academicLevelId,
  })

  useEffect(() => {
    setDraft({ name, facultyId, departmentId, academicLevelId })
  }, [name, facultyId, departmentId, academicLevelId])

  const { data: faculties = [] } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  })
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  })
  const { data: academicLevels = [] } = useQuery({
    queryKey: ['academicLevels'],
    queryFn: getAcademicLevels,
  })

  const {
    data: schedulesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'schedules',
      selectedYearId,
      role,
      name,
      facultyId,
      departmentId,
      academicLevelId,
    ],
    queryFn: () => {
      if (role === 'student') {
        return getMySchedule()
      }
      return getSchedules({
        name,
        academicYearId: selectedYearId!,
        facultyId: facultyId === 'all' ? undefined : Number(facultyId),
        departmentId: departmentId === 'all' ? undefined : Number(departmentId),
        academicLevelId:
          academicLevelId === 'all' ? undefined : Number(academicLevelId),
      })
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

  const handleApplyFilter = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...draft,
      }),
    })
  }

  const handleClearFilter = () => {
    const reset = {
      name: '',
      facultyId: 'all',
      departmentId: 'all',
      academicLevelId: 'all',
    }
    setDraft(reset)
    navigate({ search: reset })
  }

  const filteredDepartments = useMemo(() => {
    if (draft.facultyId === 'all') return []
    return departments.filter(
      (d: any) => String(d.facultyId) === draft.facultyId,
    )
  }, [departments, draft.facultyId])

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
          {role === 'student'
            ? 'កាលវិភាគសិក្សារបស់ខ្ញុំ'
            : 'គ្រប់គ្រងកាលវិភាគសិក្សា'}
        </Text>
        <Flex gap="3">
          {['admin', 'manager', 'staff'].includes(role) && <ScheduleCreate />}
        </Flex>
      </Flex>

      {role !== 'student' && (
        <Flex justify="between" align="center" mb="4">
          <Box flexGrow="1" maxWidth="300px">
            <Text as="div" size="2" mb="1" weight="bold">
              ស្វែងរក
            </Text>
            <TextField.Root
              placeholder="ស្វែងរក..."
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
            >
              <TextField.Slot>
                <IoSearch />
              </TextField.Slot>
            </TextField.Root>
          </Box>

          <Flex gap="2" wrap="wrap" align="end">
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                កម្រិតសិក្សា
              </Text>
              <Select.Root
                value={draft.academicLevelId}
                onValueChange={(val) =>
                  setDraft({ ...draft, academicLevelId: val })
                }
              >
                <Select.Trigger style={{ minWidth: '150px' }} />
                <Select.Content>
                  <Select.Item value="all">ទាំងអស់</Select.Item>
                  {academicLevels.map((level: any) => (
                    <Select.Item key={level.id} value={String(level.id)}>
                      {level.level}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                មហាវិទ្យាល័យ
              </Text>
              <Select.Root
                value={draft.facultyId}
                onValueChange={(val) => {
                  setDraft({ ...draft, facultyId: val, departmentId: 'all' })
                }}
              >
                <Select.Trigger style={{ minWidth: '150px' }} />
                <Select.Content>
                  <Select.Item value="all">ទាំងអស់</Select.Item>
                  {faculties.map((f: any) => (
                    <Select.Item key={f.id} value={String(f.id)}>
                      {f.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                ដេប៉ាតឺម៉ង់
              </Text>
              <Select.Root
                value={draft.departmentId}
                onValueChange={(val) =>
                  setDraft({ ...draft, departmentId: val })
                }
                disabled={draft.facultyId === 'all'}
              >
                <Select.Trigger style={{ minWidth: '150px' }} />
                <Select.Content>
                  <Select.Item value="all">ទាំងអស់</Select.Item>
                  {filteredDepartments.map((d: any) => (
                    <Select.Item key={d.id} value={String(d.id)}>
                      {d.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Button
              onClick={handleApplyFilter}
              color="indigo"
              style={{ cursor: 'pointer' }}
            >
              <IoFilter /> ស្វែងរក
            </Button>
            <Button
              variant="soft"
              color="gray"
              onClick={handleClearFilter}
              style={{ cursor: 'pointer' }}
            >
              សម្អាត
            </Button>
          </Flex>
        </Flex>
      )}

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
