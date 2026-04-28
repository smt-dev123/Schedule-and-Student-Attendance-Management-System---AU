import { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
  Grid,
  Box,
} from '@radix-ui/themes'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { StudentsType } from '@/types'
import { createStudent } from '@/api/StudentAPI'
import { getFaculties } from '@/api/FacultyAPI'
import { getDepartments } from '@/api/DepartmentAPI'
import { getAcademicLevels } from '@/api/AcademicLevelAPI'
import { getAcademicYear } from '@/api/AcademicYearAPI'
import { getMajors } from '@/api/MajorAPI'

const StudentCreate = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentsType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      gender: 'male',
      educationalStatus: 'enrolled',
      academicYearId: 1,
    },
  })
  const facultyId = watch('facultyId')

  const { data: faculties = [] } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  })

  const { data: majors = [] } = useQuery({
    queryKey: ['majors', facultyId],
    queryFn: () => getMajors(),
  })

  const { data: departments = [] } = useQuery({
    queryKey: ['departments', facultyId],
    queryFn: () => getDepartments(),
  })

  const { data: academicLevels = [] } = useQuery({
    queryKey: ['academicLevels'],
    queryFn: getAcademicLevels,
  })

  const { data: academicYearsRes } = useQuery({
    queryKey: ['academicYears'],
    queryFn: getAcademicYear,
  })

  const academicYears = academicYearsRes || []

  useEffect(() => {
    if (open) {
      reset()

      if (open && academicYears.length > 0) {
        // ១. រកឆ្នាំសិក្សាដែលជា "បច្ចុប្បន្ន"
        const currentYear = academicYears.find((ay: any) => ay.isCurrent)

        // ២. បើគ្មាន 'isCurrent' ទេ យកឆ្នាំដែលបង្កើតក្រោយគេបង្អស់ (ID ធំបំផុត)
        const latestYear =
          currentYear || [...academicYears].sort((a, b) => b.id - a.id)[0]

        if (latestYear) {
          setValue('academicYearId', latestYear.id.toString())
          // អ្នកអាចកំណត់ Year = 1 និង Semester = 1 ជា default សម្រាប់សិស្សថ្មីផងដែរ
          setValue('year', 1)
          setValue('semester', 1)
        }
      }
    }
  }, [open, reset, academicYears, setValue])

  useEffect(() => {
    if (facultyId) {
      setValue('departmentId', 0)
      setValue('skillId', 0)
    }
  }, [facultyId, setValue])

  const mutation = useMutation({
    mutationFn: (formData: any) => createStudent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('ចុះឈ្មោះនិស្សិតបានជោគជ័យ')
      setOpen(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'ការចុះឈ្មោះមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: StudentsType) => {
    const data = new FormData()

    // Required strings
    data.append('name', formData.name)
    data.append('email', formData.email)
    data.append('password', formData.password)
    data.append('phone', formData.phone)
    data.append('studentCode', formData.studentCode)
    data.append('gender', formData.gender)
    data.append('educationalStatus', formData.educationalStatus)

    // Required numbers (coerced by backend)
    data.append('facultyId', String(formData.facultyId))
    data.append('departmentId', String(formData.departmentId))
    data.append('academicLevelId', String(formData.academicLevelId))
    data.append('academicYearId', String(formData.academicYearId))
    data.append('skillId', String(formData.skillId))

    // Optional numbers
    if (formData.year) data.append('year', String(formData.year))
    if (formData.semester) data.append('semester', String(formData.semester))
    if (formData.generation)
      data.append('generation', String(formData.generation))

    mutation.mutate(data)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="solid" color="indigo" style={{ cursor: 'pointer' }}>
          + បន្ថែមនិស្សិតថ្មី
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="700px" size="3">
        <Dialog.Title>ចុះឈ្មោះនិស្សិតថ្មី</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          សូមបំពេញព័ត៌មាននិស្សិតឱ្យបានត្រឹមត្រូវតាមទម្រង់ខាងក្រោម។
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <Grid columns={{ initial: '1', md: '2' }} gap="4">
              {/* លេខសម្គាល់ */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  លេខសម្គាល់ <span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  {...register('studentCode', {
                    required: 'សូមបញ្ចូលលេខសម្គាល់',
                  })}
                  placeholder="CS001"
                />
                {errors.studentCode && (
                  <Text size="1" color="red">
                    {errors.studentCode.message}
                  </Text>
                )}
              </Box>

              {/* ឈ្មោះនិស្សិត */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  ឈ្មោះនិស្សិត <span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  {...register('name', { required: 'សូមបញ្ចូលឈ្មោះ' })}
                  placeholder="ឧ. លុយ សុមាត្រា"
                />
                {errors.name && (
                  <Text size="1" color="red">
                    {errors.name.message}
                  </Text>
                )}
              </Box>

              {/* ភេទ */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  ភេទ <span className="text-red-500">*</span>
                </Text>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: 'សូមជ្រើសរើសភេទ' }}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        style={{ width: '100%' }}
                        placeholder="ជ្រើសរើសភេទ"
                      />
                      <Select.Content>
                        <Select.Item value="male">ប្រុស (Male)</Select.Item>
                        <Select.Item value="female">ស្រី (Female)</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  )}
                />
                {errors.gender && (
                  <Text size="1" color="red">
                    {errors.gender.message}
                  </Text>
                )}
              </Box>

              {/* អ៊ីម៉ែល */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  អ៊ីម៉ែល <span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  {...register('email', { required: 'សូមបញ្ចូលអ៊ីម៉ែល' })}
                  placeholder="student@example.com"
                />
                {errors.email && (
                  <Text size="1" color="red">
                    {errors.email.message}
                  </Text>
                )}
              </Box>

              {/* លេខទូរស័ព្ទ */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  លេខទូរស័ព្ទ <span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  {...register('phone', { required: 'សូមបញ្ចូលលេខទូរស័ព្ទ' })}
                  placeholder="012 345 678"
                />
                {errors.phone && (
                  <Text size="1" color="red">
                    {errors.phone.message}
                  </Text>
                )}
              </Box>

              {/* ឆ្នាំសិក្សា (Academic Year) */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  ឆ្នាំសិក្សា <span className="text-red-500">*</span>
                </Text>
                <Controller
                  name="academicYearId"
                  control={control}
                  rules={{ required: 'សូមជ្រើសរើសឆ្នាំសិក្សា' }}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        style={{ width: '100%' }}
                        placeholder="ជ្រើសរើសឆ្នាំសិក្សា"
                      />
                      <Select.Content>
                        {academicYears.map((ay: any) => (
                          <Select.Item key={ay.id} value={ay.id.toString()}>
                            {ay.name} {ay.isCurrent && ' (បច្ចុប្បន្ន)'}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
                {errors.academicYearId && (
                  <Text size="1" color="red">
                    {errors.academicYearId.message}
                  </Text>
                )}
              </Box>

              {/* កម្រិតសិក្សា */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  កម្រិតសិក្សា <span className="text-red-500">*</span>
                </Text>
                <Controller
                  name="academicLevelId"
                  control={control}
                  rules={{ required: 'សូមជ្រើសរើសកម្រិតសិក្សា' }}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        style={{ width: '100%' }}
                        placeholder="ជ្រើសរើសកម្រិតសិក្សា"
                      />
                      <Select.Content>
                        {academicLevels.map((al: any) => (
                          <Select.Item key={al.id} value={al.id.toString()}>
                            {al.level}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
              </Box>

              {/* មហាវិទ្យាល័យ */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  មហាវិទ្យាល័យ <span className="text-red-500">*</span>
                </Text>
                <Controller
                  name="facultyId"
                  control={control}
                  rules={{ required: 'សូមជ្រើសរើសមហាវិទ្យាល័យ' }}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        style={{ width: '100%' }}
                        placeholder="ជ្រើសរើសមហាវិទ្យាល័យ"
                      />
                      <Select.Content>
                        {faculties.map((f: any) => (
                          <Select.Item key={f.id} value={f.id.toString()}>
                            {f.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
              </Box>

              {/* ដេប៉ាតឺម៉ង់ */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  ដេប៉ាតឺម៉ង់ <span className="text-red-500">*</span>
                </Text>
                <Controller
                  name="departmentId"
                  control={control}
                  rules={{ required: 'សូមជ្រើសរើសដេប៉ាតឺម៉ង់' }}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        style={{ width: '100%' }}
                        placeholder="ជ្រើសរើសដេប៉ាតឺម៉ង់"
                      />
                      <Select.Content>
                        {departments.map((d: any) => (
                          <Select.Item key={d.id} value={d.id.toString()}>
                            {d.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
              </Box>

              {/* ជំនាញ */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  ជំនាញ <span className="text-red-500">*</span>
                </Text>
                <Controller
                  name="skillId"
                  control={control}
                  rules={{ required: 'សូមជ្រើសរើសជំនាញ' }}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        style={{ width: '100%' }}
                        placeholder="ជ្រើសរើសជំនាញ"
                      />
                      <Select.Content>
                        {majors.map((m: any) => (
                          <Select.Item key={m.id} value={m.id.toString()}>
                            {m.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
              </Box>

              {/* ឆ្នាំទី និង ឆមាស */}
              <Grid columns="2" gap="3">
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">
                    ឆ្នាំទី
                  </Text>
                  <TextField.Root
                    type="number"
                    min={1}
                    max={5}
                    {...register('year')}
                    placeholder="ឧ. 1"
                  />
                </Box>
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">
                    ឆមាស
                  </Text>
                  <TextField.Root
                    type="number"
                    min={1}
                    max={3}
                    {...register('semester')}
                    placeholder="ឧ. 1"
                  />
                </Box>
              </Grid>

              {/* ជំនាន់ */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  ជំនាន់
                </Text>
                <TextField.Root
                  type="number"
                  min={1}
                  {...register('generation')}
                  placeholder="ឧ. 19"
                />
              </Box>
            </Grid>

            {/* លេខសម្ងាត់ */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                លេខសម្ងាត់សម្រាប់ចូលប្រើប្រាស់{' '}
                <span className="text-red-500">*</span>
              </Text>
              <TextField.Root
                type="password"
                {...register('password', {
                  required: 'សូមបញ្ចូលលេខសម្ងាត់',
                  minLength: {
                    value: 6,
                    message: 'លេខសម្ងាត់ត្រូវមានយ៉ាងតិច 6 ខ្ទង់',
                  },
                })}
                placeholder="******"
              />
              {errors.password && (
                <Text as="div" size="2" color="red">
                  {errors.password.message}
                </Text>
              )}
            </Box>

            {/* ប៊ូតុងសកម្មភាព */}
            <Flex gap="3" mt="6" justify="end">
              <Dialog.Close>
                <Button
                  variant="soft"
                  color="gray"
                  type="button"
                  style={{ cursor: 'pointer' }}
                >
                  បោះបង់
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                loading={mutation.isPending}
                style={{ cursor: 'pointer' }}
              >
                ចុះឈ្មោះនិស្សិត
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default StudentCreate
