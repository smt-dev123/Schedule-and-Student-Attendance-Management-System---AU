import { useState, useEffect, useMemo } from 'react'
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
  Grid,
} from '@radix-ui/themes'
import { Controller, useForm, useFieldArray, useWatch } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaPlus, FaTrash, FaRegCalendarAlt, FaBook } from 'react-icons/fa'

// API Imports (រក្សានៅដដែល)
import { createSchedule } from '@/api/SchedulesAPI'
import { getFaculties } from '@/api/FacultyAPI'
import { getDepartments } from '@/api/DepartmentAPI'
import { getAcademicLevels } from '@/api/AcademicLevelAPI'
import { getAcademicYear } from '@/api/AcademicYearAPI'
import { getRoom } from '@/api/RoomAPI'
import { getTeachers } from '@/api/TeacherAPI'
import { getSessionTime } from '@/api/SessionTime'

const ScheduleCreate = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      schedule: {
        studyShift: 'morning',
        semester: 1,
        year: 1,
        generation: 1,
        semesterStart: new Date().toISOString().split('T')[0],
        semesterEnd: new Date().toISOString().split('T')[0],
        facultyId: '',
        departmentId: '',
        academicLevelId: '',
        academicYearId: '',
        classroomId: '',
        sessionTimeId: '',
      },
      courses: [
        {
          name: '',
          code: '',
          credits: 3,
          hours: '45',
          day: 'Monday',
          teacherId: '',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'courses' })
  const selectedFacultyId = watch('schedule.facultyId')

  // Data Fetching
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
  const { data: allDeps = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  })

  // Memoized Filtered Departments
  const departments = useMemo(() => {
    return (allDeps as any[]).filter(
      (d) => String(d.facultyId) === String(selectedFacultyId),
    )
  }, [allDeps, selectedFacultyId])

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const mutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      toast.success('បង្កើតកាលវិភាគជោគជ័យ')
      setOpen(false)
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'ប្រតិបត្តិការបរាជ័យ'),
  })

  const onSubmit = (data: any) => {
    const payload = {
      schedule: {
        ...data.schedule,
        facultyId: Number(data.schedule.facultyId),
        departmentId: Number(data.schedule.departmentId),
        academicLevelId: Number(data.schedule.academicLevelId),
        academicYearId: Number(data.schedule.academicYearId),
        classroomId: Number(data.schedule.classroomId),
        sessionTimeId: Number(data.schedule.sessionTimeId),
        semesterStart: new Date(data.schedule.semesterStart),
        semesterEnd: new Date(data.schedule.semesterEnd),
      },
      courses: data.courses.map((c: any) => ({
        ...c,
        credits: Number(c.credits),
        hours: String(c.hours),
      })),
    }
    mutation.mutate(payload)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          size="2"
          variant="solid"
          className="cursor-pointer shadow-sm hover:scale-105 transition-transform"
        >
          <FaPlus /> បង្កើតកាលវិភាគ
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="1000px" className="rounded-3xl">
        <Dialog.Title>
          <Flex align="center" gap="2">
            <FaRegCalendarAlt className="text-blue-600" />{' '}
            បង្កើតកាលវិភាគសិក្សាថ្មី
          </Flex>
        </Dialog.Title>
        <Dialog.Description size="2" mb="4" className="text-slate-500">
          សូមបំពេញព័ត៌មានផ្នែករដ្ឋបាល និងរៀបចំមុខវិជ្ជាសម្រាប់ឆមាសនេះ។
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex
            direction="column"
            gap="5"
            className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
          >
            {/* Section 1: Metadata */}
            <Box className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200">
              <Text
                weight="bold"
                size="3"
                mb="4"
                as="div"
                className="flex align-center gap-2 text-blue-700"
              >
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[12px]">
                  ១
                </span>
                ព័ត៌មានទូទៅ
              </Text>

              <Grid columns={{ initial: '1', md: '3' }} gap="4">
                <FormSelect
                  label="មហាវិទ្យាល័យ"
                  name="schedule.facultyId"
                  control={control}
                  options={faculties}
                  placeholder="រើសមហាវិទ្យាល័យ"
                  style={{ width: '100%' }}
                />
                <FormSelect
                  label="ដេប៉ាតឺម៉ង់"
                  name="schedule.departmentId"
                  control={control}
                  options={departments}
                  disabled={!selectedFacultyId}
                  placeholder="រើសដេប៉ាតឺម៉ង់"
                />
                <FormSelect
                  label="ឆ្នាំសិក្សា"
                  name="schedule.academicYearId"
                  control={control}
                  options={academicYears}
                  placeholder="រើសឆ្នាំសិក្សា"
                />
                <FormSelect
                  label="កម្រិតសិក្សា"
                  name="schedule.academicLevelId"
                  control={control}
                  options={levels}
                  placeholder="កម្រិត"
                />

                <Grid columns="2" gap="2">
                  <FormInput
                    label="ជំនាន់ទី"
                    name="schedule.generation"
                    register={register}
                    type="number"
                  />
                  <FormInput
                    label="ឆ្នាំទី"
                    name="schedule.year"
                    register={register}
                    type="number"
                  />
                </Grid>

                <Grid columns="2" gap="2">
                  <FormInput
                    label="ឆមាស"
                    name="schedule.semester"
                    register={register}
                    type="number"
                  />
                  <FormSelect
                    label="វេនសិក្សា"
                    name="schedule.studyShift"
                    control={control}
                    options={[
                      { id: 'morning', name: 'ព្រឹក' },
                      { id: 'evening', name: 'ល្ងាច' },
                      { id: 'night', name: 'យប់' },
                    ]}
                  />
                </Grid>

                <FormSelect
                  label="បន្ទប់សិក្សា"
                  name="schedule.classroomId"
                  control={control}
                  options={rooms.map((r: any) => ({
                    id: r.id,
                    name: `${r.name} (${r.building?.name})`,
                  }))}
                />
                <FormInput
                  label="ចាប់ផ្ដើមឆមាស"
                  name="schedule.semesterStart"
                  register={register}
                  type="date"
                />
                <FormInput
                  label="បញ្ចប់ឆមាស"
                  name="schedule.semesterEnd"
                  register={register}
                  type="date"
                />
                <FormSelect
                  label="ម៉ោងសិក្សា (Session)"
                  name="schedule.sessionTimeId"
                  control={control}
                  options={sessions.map((s: any) => ({
                    id: s.id,
                    name: `${s.shift.toUpperCase()}: ${s.firstSessionStartTime} - ${s.secondSessionEndTime}`,
                  }))}
                />
              </Grid>
            </Box>

            {/* Section 2: Courses */}
            <Box>
              <Flex justify="between" align="center" mb="3">
                <Text
                  weight="bold"
                  size="3"
                  className="flex align-center gap-2 text-blue-700"
                >
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[12px]">
                    ២
                  </span>
                  បញ្ជីមុខវិជ្ជា
                </Text>
                <Button
                  variant="soft"
                  size="2"
                  type="button"
                  onClick={() =>
                    append({
                      name: '',
                      code: '',
                      credits: 3,
                      hours: '45',
                      day: 'Monday',
                      teacherId: '',
                    })
                  }
                  className="cursor-pointer"
                >
                  <FaPlus /> បន្ថែមមុខវិជ្ជា
                </Button>
              </Flex>

              <Flex direction="column" gap="3">
                {fields.map((field, index) => (
                  <CourseItem
                    key={field.id}
                    index={index}
                    register={register}
                    control={control}
                    remove={remove}
                    teachers={teachers}
                    sessions={sessions}
                    isDisableRemove={fields.length === 1}
                  />
                ))}
              </Flex>
            </Box>
          </Flex>

          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                size="2"
                className="cursor-pointer"
              >
                បោះបង់
              </Button>
            </Dialog.Close>
            <Button
              type="submit"
              size="2"
              loading={mutation.isPending}
              className="cursor-pointer px-8"
            >
              រក្សាទុកកាលវិភាគ
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const FormInput = ({ label, name, register, type = 'text' }: any) => (
  <Box>
    <Text as="div" size="1" mb="1" weight="bold" className="text-slate-600">
      {label}
    </Text>
    <TextField.Root
      type={type}
      {...register(name, { valueAsNumber: type === 'number' })}
      className="rounded-lg"
    />
  </Box>
)

const FormSelect = ({
  label,
  name,
  control,
  options,
  placeholder,
  disabled,
  disabledOptions = [],
  labelKey = 'name',
}: any) => (
  <Box>
    <Text as="div" size="1" mb="1" weight="bold" className="text-slate-600">
      {label}
    </Text>
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <Select.Root
          disabled={disabled}
          value={field.value ? String(field.value) : undefined}
          onValueChange={field.onChange}
        >
          <Select.Trigger
            placeholder={placeholder}
            className="w-full rounded-lg"
            style={{ width: '100%' }}
          />
          <Select.Content>
            {options.map((opt: any) => {
              const isOptionDisabled =
                disabledOptions.includes(String(opt.id)) &&
                String(field.value) !== String(opt.id)

              return (
                <Select.Item
                  key={opt.id}
                  value={String(opt.id)}
                  disabled={isOptionDisabled}
                >
                  {opt[labelKey]}
                </Select.Item>
              )
            })}
          </Select.Content>
        </Select.Root>
      )}
    />
  </Box>
)

const CourseItem = ({
  index,
  register,
  control,
  remove,
  teachers,
  isDisableRemove,
}: any) => {
  const allCourses = useWatch({
    control,
    name: 'courses',
  })

  const selectedDays = allCourses
    ?.map((c: any) => c?.day)
    .filter((day: any) => day !== undefined && day !== null)

  const selectedTeachers = allCourses
    ?.map((c: any) => String(c?.teacherId))
    .filter((id: any) => id !== 'undefined' && id !== 'null')

  return (
    <Box className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm hover:border-blue-400 transition-all group">
      <Grid columns={{ initial: '1', md: '5' }} gap="3" align="end">
        <Box className="md:col-span-1">
          <FormInput
            label="មុខវិជ្ជា"
            name={`courses.${index}.name`}
            register={register}
          />
        </Box>

        <Box>
          <FormInput
            label="កូដ"
            name={`courses.${index}.code`}
            register={register}
          />
        </Box>

        <Box>
          <FormSelect
            label="ថ្ងៃ"
            name={`courses.${index}.day`}
            control={control}
            disabledOptions={selectedDays}
            options={[
              { id: 'Monday', name: 'ច័ន្ទ' },
              { id: 'Tuesday', name: 'អង្គារ' },
              { id: 'Wednesday', name: 'ពុធ' },
              { id: 'Thursday', name: 'ព្រហស្បតិ៍' },
              { id: 'Friday', name: 'សុក្រ' },
              { id: 'Saturday', name: 'សៅរ៍' },
              { id: 'Sunday', name: 'អាទិត្យ' },
            ]}
          />
        </Box>

        <Box>
          <FormSelect
            label="គ្រូបង្រៀន"
            name={`courses.${index}.teacherId`}
            control={control}
            disabledOptions={selectedTeachers}
            options={teachers}
          />
        </Box>
        <Box>
          <FormInput
            label="ចំនួនម៉ោង"
            name={`courses.${index}.hours`}
            register={register}
          />
        </Box>
        <Box>
          <IconButton
            variant="soft"
            color="red"
            type="button"
            onClick={() => remove(index)}
            disabled={isDisableRemove}
            className="cursor-pointer mb-[2px]"
          >
            <FaTrash />
          </IconButton>
        </Box>
      </Grid>
    </Box>
  )
}

export default ScheduleCreate
