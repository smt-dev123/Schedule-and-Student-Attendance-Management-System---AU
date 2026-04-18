import { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
  Box,
  Separator,
  IconButton,
} from '@radix-ui/themes'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getScheduleById, updateSchedule } from '@/api/SchedulesAPI'
import { getFaculties } from '@/api/FacultyAPI'
import { getDepartments } from '@/api/DepartmentAPI'
import { getAcademicLevels } from '@/api/AcademicLevelAPI'
import { getAcademicYear } from '@/api/AcademicYearAPI'
import { getRoom } from '@/api/RoomAPI'
import { getTeachers } from '@/api/TeacherAPI'
import { getSessionTime } from '@/api/SessionTime'
import { FaPlus, FaTrash } from 'react-icons/fa'

interface Props {
  scheduleId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ScheduleUpdate = ({ scheduleId, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient()

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      schedule: {
        studyShift: 'morning',
        semester: 1,
        year: 1,
        generation: 1,
      },
      courses: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'courses',
  })

  const selectedFacultyId = watch('schedule.facultyId')

  // Fetch Dropdown Data
  const { data: faculties = [] } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  })
  const { data: levels = [] } = useQuery({
    queryKey: ['academicLevels'],
    queryFn: getAcademicLevels,
  })
  const { data: academicYears = [] } = useQuery({
    queryKey: ['academicYears'],
    queryFn: getAcademicYear,
  })
  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getRoom('all'),
  })
  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  })
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessionTimes'],
    queryFn: getSessionTime,
  })

  // Filter departments by faculty
  const { data: allDepartments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  })
  const departments = (allDepartments as any[]).filter(
    (d) => String(d.facultyId) === String(selectedFacultyId),
  )

  // Fetch Existing Schedule Data
  const { data: existingData, isLoading: isLoadingData } = useQuery({
    queryKey: ['schedule', scheduleId],
    queryFn: () => getScheduleById(scheduleId!),
    enabled: !!scheduleId && open,
  })

  useEffect(() => {
    if (existingData) {
      reset({
        schedule: {
          ...existingData,
          facultyId: String(existingData.facultyId),
          departmentId: String(existingData.departmentId),
          academicLevelId: String(existingData.academicLevelId),
          academicYearId: String(existingData.academicYearId),
          classroomId: String(existingData.classroomId),
          semesterStart: existingData.semesterStart ? new Date(existingData.semesterStart).toISOString().split('T')[0] : '',
          semesterEnd: existingData.semesterEnd ? new Date(existingData.semesterEnd).toISOString().split('T')[0] : '',
        },
        courses: existingData.courses?.map((c: any) => ({
          ...c,
          teacherId: String(c.teacherId),
          sessionTimeId: String(c.sessionTimeId),
        })) || [],
      })
    }
  }, [existingData, reset])

  const mutation = useMutation({
    mutationFn: (data: any) => updateSchedule(scheduleId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      queryClient.invalidateQueries({ queryKey: ['schedule', scheduleId] })
      toast.success('កែប្រែជោគជ័យ')
      onOpenChange(false)
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || 'កែប្រែមិនជោគជ័យ')
    },
  })

  const onSubmit = (data: any) => {
    const payload = {
      schedule: {
        facultyId: Number(data.schedule.facultyId),
        departmentId: Number(data.schedule.departmentId),
        academicLevelId: Number(data.schedule.academicLevelId),
        academicYearId: Number(data.schedule.academicYearId),
        classroomId: Number(data.schedule.classroomId),
        year: Number(data.schedule.year),
        generation: Number(data.schedule.generation),
        semester: Number(data.schedule.semester),
        studyShift: data.schedule.studyShift,
        semesterStart: new Date(data.schedule.semesterStart),
        semesterEnd: new Date(data.schedule.semesterEnd),
      },
      courses: data.courses.map((c: any) => ({
        id: c.id ? Number(c.id) : undefined,
        name: c.name,
        code: c.code,
        credits: Number(c.credits),
        day: c.day,
        teacherId: String(c.teacherId),
        sessionTimeId: Number(c.sessionTimeId),
      })),
    }
    mutation.mutate(payload as any)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="900px">
        <Dialog.Title>កែប្រែកាលវិភាគសិក្សា</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          ធ្វើការផ្លាស់ប្ដូរព័ត៌មានកាលវិភាគ ឬមុខវិជ្ជាចំណុះឆ្នាំសិក្សានេះ។
        </Dialog.Description>

        {isLoadingData ? (
          <Flex justify="center" p="5">
             <Text>កំពុងទាញយកទិន្នន័យ...</Text>
          </Flex>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex
              direction="column"
              gap="4"
              style={{
                maxHeight: '70vh',
                overflowY: 'auto',
                paddingRight: '10px',
              }}
            >
              {/* --- Schedule Metadata Section --- */}
              <Box className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <Text weight="bold" mb="3" as="div" color="blue">
                  ១. ព័ត៌មានគោល
                </Text>
                <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Faculty */}
                  <Box>
                    <Text as="div" size="1" mb="1" weight="bold">
                      មហាវិទ្យាល័យ
                    </Text>
                    <Controller
                      name="schedule.facultyId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select.Root
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger
                            placeholder="រើសមហាវិទ្យាល័យ"
                            className="w-full"
                          />
                          <Select.Content>
                            {(faculties as any[]).map((f: any) => (
                              <Select.Item key={f.id} value={String(f.id)}>
                                {f.name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      )}
                    />
                  </Box>

                  {/* Department */}
                  <Box>
                    <Text as="div" size="1" mb="1" weight="bold">
                      ដេប៉ាតឺម៉ង់
                    </Text>
                    <Controller
                      name="schedule.departmentId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select.Root
                          disabled={!selectedFacultyId}
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger
                            placeholder="រើសដេប៉ាតឺម៉ង់"
                            className="w-full"
                          />
                          <Select.Content>
                            {departments.map((d: any) => (
                              <Select.Item key={d.id} value={String(d.id)}>
                                {d.name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      )}
                    />
                  </Box>

                  {/* Academic Year */}
                  <Box>
                    <Text as="div" size="1" mb="1" weight="bold">
                      ឆ្នាំសិក្សា
                    </Text>
                    <Controller
                      name="schedule.academicYearId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select.Root
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger
                            placeholder="រើសឆ្នាំសិក្សា"
                            className="w-full"
                          />
                          <Select.Content>
                            {(academicYears as any[]).map((ay: any) => (
                              <Select.Item key={ay.id} value={String(ay.id)}>
                                {ay.name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      )}
                    />
                  </Box>

                  {/* Level / Generation / Year / Semester */}
                  <Box>
                    <Text as="div" size="1" mb="1" weight="bold">
                      កម្រិតសិក្សា
                    </Text>
                    <Controller
                      name="schedule.academicLevelId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select.Root
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger
                            placeholder="កម្រិត"
                            className="w-full"
                          />
                          <Select.Content>
                            {(levels as any[]).map((l: any) => (
                              <Select.Item key={l.id} value={String(l.id)}>
                                {l.level}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      )}
                    />
                  </Box>

                  <Box className="grid grid-cols-2 gap-2">
                    <Box>
                      <Text as="div" size="1" mb="1" weight="bold">
                        ជំនាន់ទី
                      </Text>
                      <TextField.Root
                        type="number"
                        {...register('schedule.generation', {
                          valueAsNumber: true,
                        })}
                      />
                    </Box>
                    <Box>
                      <Text as="div" size="1" mb="1" weight="bold">
                        ឆ្នាំទី
                      </Text>
                      <TextField.Root
                        type="number"
                        {...register('schedule.year', { valueAsNumber: true })}
                      />
                    </Box>
                  </Box>

                  <Box className="grid grid-cols-2 gap-2">
                    <Box>
                      <Text as="div" size="1" mb="1" weight="bold">
                        ឆមាស
                      </Text>
                      <TextField.Root
                        type="number"
                        {...register('schedule.semester', {
                          valueAsNumber: true,
                        })}
                      />
                    </Box>
                    <Box>
                      <Text as="div" size="1" mb="1" weight="bold">
                        វេន
                      </Text>
                      <Controller
                        name="schedule.studyShift"
                        control={control}
                        render={({ field }) => (
                          <Select.Root
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <Select.Trigger className="w-full" />
                            <Select.Content>
                              <Select.Item value="morning">ព្រឹក</Select.Item>
                              <Select.Item value="evening">ល្ងាច</Select.Item>
                              <Select.Item value="night">យប់</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        )}
                      />
                    </Box>
                  </Box>

                  {/* Room */}
                  <Box>
                    <Text as="div" size="1" mb="1" weight="bold">
                      បន្ទប់សិក្សា
                    </Text>
                    <Controller
                      name="schedule.classroomId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select.Root
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger
                            placeholder="រើសបន្ទប់"
                            className="w-full"
                          />
                          <Select.Content>
                            {(rooms as any[]).map((r: any) => (
                              <Select.Item key={r.id} value={String(r.id)}>
                                {r.name} ({r.building?.name})
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      )}
                    />
                  </Box>

                  {/* Dates */}
                  <Box>
                    <Text as="div" size="1" mb="1" weight="bold">
                      ចាប់ផ្ដើមឆមាស
                    </Text>
                    <TextField.Root
                      type="date"
                      {...register('schedule.semesterStart')}
                    />
                  </Box>
                  <Box>
                    <Text as="div" size="1" mb="1" weight="bold">
                      បញ្ចប់ឆមាស
                    </Text>
                    <TextField.Root
                      type="date"
                      {...register('schedule.semesterEnd')}
                    />
                  </Box>
                </Box>
              </Box>

              <Separator size="4" />

              {/* --- Courses Section --- */}
              <Box>
                <Flex justify="between" align="center" mb="3">
                  <Text weight="bold" color="blue">
                    ២. មុខវិជ្ជានៅក្នុងកាលវិភាគ
                  </Text>
                  <Button
                    variant="soft"
                    size="1"
                    type="button"
                    onClick={() =>
                      append({ name: '', code: '', credits: 3, day: 'Monday' })
                    }
                  >
                    <FaPlus /> បន្ថែមមុខវិជ្ជា
                  </Button>
                </Flex>

                <Flex direction="column" gap="2">
                  {fields.map((field, index) => (
                    <Box
                      key={field.id}
                      className="p-3 border border-slate-200 rounded-xl relative hover:border-blue-300 transition-colors"
                    >
                      <Flex gap="3" align="end" wrap="wrap">
                        <Box className="flex-1 min-w-[150px]">
                          <Text as="div" size="1" mb="1">
                            ឈ្មោះមុខវិជ្ជា
                          </Text>
                          <TextField.Root
                            {...register(`courses.${index}.name` as const)}
                            placeholder="Programming..."
                          />
                        </Box>
                        <Box className="w-24">
                          <Text as="div" size="1" mb="1">
                            កូដ
                          </Text>
                          <TextField.Root
                            {...register(`courses.${index}.code` as const)}
                          />
                        </Box>
                        <Box className="w-24">
                          <Text as="div" size="1" mb="1">
                            ថ្ងៃ
                          </Text>
                          <Controller
                            name={`courses.${index}.day` as const}
                            control={control}
                            render={({ field }) => (
                              <Select.Root
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <Select.Trigger />
                                <Select.Content>
                                  <Select.Item value="Monday">ច័ន្ទ</Select.Item>
                                  <Select.Item value="Tuesday">
                                    អង្គារ
                                  </Select.Item>
                                  <Select.Item value="Wednesday">ពុធ</Select.Item>
                                  <Select.Item value="Thursday">
                                    ព្រហស្បតិ៍
                                  </Select.Item>
                                  <Select.Item value="Friday">សុក្រ</Select.Item>
                                  <Select.Item value="Saturday">សៅរ៍</Select.Item>
                                </Select.Content>
                              </Select.Root>
                            )}
                          />
                        </Box>
                        <Box className="flex-1 min-w-[150px]">
                          <Text as="div" size="1" mb="1">
                            គ្រូបង្រៀន
                          </Text>
                          <Controller
                            name={`courses.${index}.teacherId` as const}
                            control={control}
                            render={({ field }) => (
                              <Select.Root
                                value={
                                  field.value ? String(field.value) : undefined
                                }
                                onValueChange={field.onChange}
                              >
                                <Select.Trigger className="w-full" />
                                <Select.Content>
                                  {(teachers as any[]).map((t: any) => (
                                    <Select.Item key={t.id} value={String(t.id)}>
                                      {t.name}
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Root>
                            )}
                          />
                        </Box>
                        <Box className="flex-1 min-w-[150px]">
                          <Text as="div" size="1" mb="1">
                            ម៉ោងសិក្សា
                          </Text>
                          <Controller
                            name={`courses.${index}.sessionTimeId` as const}
                            control={control}
                            render={({ field }) => (
                              <Select.Root
                                value={
                                  field.value ? String(field.value) : undefined
                                }
                                onValueChange={field.onChange}
                              >
                                <Select.Trigger className="w-full" />
                                <Select.Content>
                                  {(sessions as any[]).map((s: any) => (
                                    <Select.Item key={s.id} value={String(s.id)}>
                                      {s.firstSessionStartTime} -{' '}
                                      {s.secondSessionEndTime}
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Root>
                            )}
                          />
                        </Box>
                        <IconButton
                          variant="soft"
                          color="red"
                          type="button"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <FaTrash />
                        </IconButton>
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Flex>

            <Flex gap="3" mt="6" justify="end">
              <Button
                variant="soft"
                color="gray"
                type="button"
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                ចាកចេញ
              </Button>
              <Button
                type="submit"
                loading={mutation.isPending}
                className="cursor-pointer"
              >
                រក្សាទុកការកែប្រែ
              </Button>
            </Flex>
          </form>
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default ScheduleUpdate
