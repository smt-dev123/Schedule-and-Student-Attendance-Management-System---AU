import { useState, useEffect } from 'react'
import { Button, Dialog, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { CoursesType } from '@/types'
import { createCourse } from '@/api/CourseAPI'
import { getTeachers } from '@/api/TeacherAPI'
import { getSchedules } from '@/api/SchedulesAPI'
import { getSessionTime } from '@/api/SessionTime'
import { useAcademicStore } from '@/stores/useAcademicStore'

const CourseCreate = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { selectedYearId } = useAcademicStore()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CoursesType>({
    defaultValues: {
      day: 'Monday',
      isActive: true,
      credits: 3,
    },
  })

  // Fetch Data
  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  })

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules', selectedYearId],
    queryFn: () => getSchedules({ academicYearId: selectedYearId }),
  })

  const { data: sessionTimes = [] } = useQuery({
    queryKey: ['sessionTimes'],
    queryFn: getSessionTime,
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const mutation = useMutation({
    mutationFn: (formData: CoursesType) => createCourse(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('បង្កើតជោគជ័យ')
      setOpen(false)
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || 'បង្កើតមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: CoursesType) => {
    mutation.mutate({
      ...formData,
      credits: Number(formData.credits),
      scheduleId: Number(formData.scheduleId),
      sessionTimeId: Number(formData.sessionTimeId),
    })
  }

  // Ensure schedules and sessionTimes are arrays according to their endpoint implementations
  const scheduleList = Array.isArray(schedules) ? schedules : schedules.data || []
  const sessionList = Array.isArray(sessionTimes) ? sessionTimes : sessionTimes.data || []
  const teacherList = Array.isArray(teachers) ? teachers : (teachers as any).data || []

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="solid" style={{ cursor: 'pointer' }}>
          បង្កើតថ្នាក់រៀន
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="500px">
        <Dialog.Title>បង្កើតថ្នាក់រៀនថ្មី</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex
            direction="column"
            gap="3"
            style={{
              maxHeight: '65vh',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {/* Course Code */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">កូដមុខវិជ្ជា</Text>
              <TextField.Root
                {...register('code', { required: 'ត្រូវបញ្ចូលកូដ' })}
                placeholder="ឧ. CS101"
              />
              {errors.code && <Text size="2" color="red">{errors.code.message}</Text>}
            </Box>

            {/* Course Name */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">ឈ្មោះមុខវិជ្ជា</Text>
              <TextField.Root
                {...register('name', { required: 'ត្រូវបញ្ចូលឈ្មោះ' })}
                placeholder="ឧ. Database Management"
              />
              {errors.name && <Text size="2" color="red">{errors.name.message}</Text>}
            </Box>

            {/* Credits */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">ក្រេឌីត</Text>
              <TextField.Root
                type="number"
                {...register('credits', { required: 'ត្រូវបញ្ចូលក្រេឌីត', valueAsNumber: true })}
                placeholder="3"
              />
              {errors.credits && <Text size="2" color="red">{errors.credits.message}</Text>}
            </Box>

            {/* Day */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">ថ្ងៃបង្រៀន</Text>
              <Controller
                name="day"
                control={control}
                rules={{ required: 'ត្រូវជ្រើសរើសថ្ងៃ' }}
                render={({ field }) => (
                  <Select.Root value={field.value as string} onValueChange={field.onChange}>
                    <Select.Trigger placeholder="ជ្រើសរើសថ្ងៃ" style={{ width: '100%' }} />
                    <Select.Content>
                      <Select.Item value="Monday">ច័ន្ទ</Select.Item>
                      <Select.Item value="Tuesday">អង្គារ</Select.Item>
                      <Select.Item value="Wednesday">ពុធ</Select.Item>
                      <Select.Item value="Thursday">ព្រហស្បតិ៍</Select.Item>
                      <Select.Item value="Friday">សុក្រ</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.day && <Text size="2" color="red">{errors.day.message}</Text>}
            </Box>

            {/* Teacher */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">គ្រូបង្រៀន</Text>
              <Controller
                name="teacherId"
                control={control}
                rules={{ required: 'ត្រូវជ្រើសរើសគ្រូ' }}
                render={({ field }) => (
                  <Select.Root
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger placeholder="ជ្រើសរើសគ្រូ" style={{ width: '100%' }} />
                    <Select.Content>
                      {teacherList.map((t: any) => (
                        <Select.Item key={t.id} value={String(t.id)}>
                          {t.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.teacherId && <Text size="2" color="red">{errors.teacherId.message}</Text>}
            </Box>

            {/* Schedule */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">កាលវិភាគយោង (Schedule)</Text>
              <Controller
                name="scheduleId"
                control={control}
                rules={{ required: 'ត្រូវជ្រើសរើសកាលវិភាគ' }}
                render={({ field }) => (
                  <Select.Root
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger placeholder="ជ្រើសរើសកាលវិភាគ" style={{ width: '100%' }} />
                    <Select.Content>
                      {scheduleList.map((s: any) => (
                        <Select.Item key={s.id} value={String(s.id)}>
                          {s.department?.name || 'ដេប៉ាតឺម៉ង់'} - ជំនាន់ {s.generation} (ឆ្នាំទី {s.year} ឆមាស {s.semester}) - {s.studyShift === 'morning' ? 'ព្រឹក' : s.studyShift === 'evening' ? 'ល្ងាច' : 'យប់'}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.scheduleId && <Text size="2" color="red">{errors.scheduleId.message}</Text>}
            </Box>

            {/* Session Time */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">ម៉ោងសិក្សា (Session Time)</Text>
              <Controller
                name="sessionTimeId"
                control={control}
                rules={{ required: 'ត្រូវជ្រើសរើសម៉ោង' }}
                render={({ field }) => (
                  <Select.Root
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger placeholder="ជ្រើសរើសម៉ោង" style={{ width: '100%' }} />
                    <Select.Content>
                      {sessionList.map((s: any) => (
                        <Select.Item key={s.id} value={String(s.id)}>
                          {s.firstSessionStartTime} - {s.secondSessionEndTime} ({s.shift})
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.sessionTimeId && <Text size="2" color="red">{errors.sessionTimeId.message}</Text>}
            </Box>

          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" type="button" style={{ cursor: 'pointer' }}>ចាកចេញ</Button>
            </Dialog.Close>
            <Button type="submit" loading={mutation.isPending} style={{ cursor: 'pointer' }}>រក្សាទុក</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const Box = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: '8px' }}>{children}</div>
)

export default CourseCreate
