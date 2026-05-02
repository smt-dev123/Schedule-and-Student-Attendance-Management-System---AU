import { useState, useEffect, type ChangeEvent } from 'react'
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
  Grid,
  Box,
  Avatar,
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
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

  // ទាញយកទិន្នន័យពី API
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024)

      if (fileSizeInMB > 1) {
        toast.error('រូបភាពមិនអាចធំជាង 1MB ឡើយ!')
        e.target.value = ''
        setImageFile(null)
        setPreviewUrl(null)
        return
      }

      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // Reset form និងរូបភាពពេលបើក/បិទ Dialog
  useEffect(() => {
    if (open) {
      reset()
      setImageFile(null)
      setPreviewUrl(null)
      if (academicYears.length > 0) {
        const currentYear = academicYears.find((ay: any) => ay.isCurrent)
        const latestYear =
          currentYear || [...academicYears].sort((a, b) => b.id - a.id)[0]
        if (latestYear) {
          setValue('academicYearId', latestYear.id.toString())
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
      setValue('departmentId', 0)
    }
  }, [facultyId, setValue])

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createStudent(formData),
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

    // បន្ថែមរូបភាព (បើមាន)
    if (imageFile) {
      data.append('image', imageFile)
    }

    // បន្ថែមទិន្នន័យអត្ថបទ និងលេខទាំងអស់ចូលទៅក្នុង FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, String(value))
      }
    })

    mutation.mutate(data)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="solid" color="indigo" style={{ cursor: 'pointer' }}>
          + បន្ថែមនិស្សិតថ្មី
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="750px" size="3">
        <Dialog.Title>ចុះឈ្មោះនិស្សិតថ្មី</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          សូមបំពេញព័ត៌មាននិស្សិតឱ្យបានត្រឹមត្រូវតាមទម្រង់ខាងក្រោម។
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            {/* ផ្នែក Upload រូបភាព និង Preview */}
            <Flex
              align="center"
              gap="4"
              p="3"
              style={{
                border: '1px dashed var(--gray-6)',
                borderRadius: '8px',
              }}
            >
              <Avatar
                size="6"
                src={previewUrl || ''}
                fallback={watch('name')?.charAt(0) || 'S'}
                radius="full"
              />
              <Box>
                <Text as="div" size="2" mb="2" weight="bold">
                  រូបថតនិស្សិត (Profile Picture)
                </Text>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </Box>
            </Flex>

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
              </Box>

              {/* ឆ្នាំសិក្សា */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  ឆ្នាំសិក្សា <span className="text-red-500">*</span>
                </Text>
                <Controller
                  name="academicYearId"
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger style={{ width: '100%' }} />
                      <Select.Content>
                        {academicYears.map((ay: any) => (
                          <Select.Item key={ay.id} value={ay.id.toString()}>
                            {ay.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
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
                  render={({ field }) => (
                    <Select.Root
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger style={{ width: '100%' }} />
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
                      disabled={!facultyId}
                    >
                      <Select.Trigger
                        style={{ width: '100%' }}
                        placeholder={
                          facultyId
                            ? 'ជ្រើសរើសជំនាញ'
                            : 'សូមជ្រើសរើសមហាវិទ្យាល័យជាមុន'
                        }
                      />
                      <Select.Content>
                        {majors
                          .filter(
                            (m: any) =>
                              m.facultyId?.toString() === facultyId?.toString(),
                          )
                          .map((m: any) => (
                            <Select.Item key={m.id} value={m.id.toString()}>
                              {m.name}
                            </Select.Item>
                          ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
                {errors.skillId && (
                  <Text size="1" color="red">
                    {errors.skillId.message}
                  </Text>
                )}
              </Box>

              {/* តេប៉ាតឺម៉ង់ */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  តេប៉ាតឺម៉ង់ <span className="text-red-500">*</span>
                </Text>
                <Controller
                  name="departmentId"
                  control={control}
                  rules={{ required: 'សូមជ្រើសរើសតេប៉ាតឺម៉ង់' }}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                      disabled={!facultyId}
                    >
                      <Select.Trigger
                        style={{ width: '100%' }}
                        placeholder={
                          facultyId
                            ? 'ជ្រើសរើសតេប៉ាតឺម៉ង់'
                            : 'សូមជ្រើសរើសមហាវិទ្យាល័យជាមុន'
                        }
                      />
                      <Select.Content>
                        {departments
                          .filter(
                            (d: any) =>
                              d.facultyId?.toString() === facultyId?.toString(),
                          )
                          .map((d: any) => (
                            <Select.Item key={d.id} value={d.id.toString()}>
                              {d.name}
                            </Select.Item>
                          ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
                {errors.departmentId && (
                  <Text size="1" color="red">
                    {errors.departmentId.message}
                  </Text>
                )}
              </Box>

              {/* ឆ្នាំទី និង ឆមាស */}
              <Grid columns="2" gap="3">
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">
                    ឆ្នាំទី
                  </Text>
                  <TextField.Root
                    type="number"
                    {...register('year')}
                    placeholder="1"
                  />
                </Box>
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">
                    ឆមាស
                  </Text>
                  <TextField.Root
                    type="number"
                    {...register('semester')}
                    placeholder="1"
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

              {/* លេខសម្ងាត់ */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  លេខសម្ងាត់ <span className="text-red-500">*</span>
                </Text>
                <TextField.Root
                  type="password"
                  {...register('password', { required: true, minLength: 6 })}
                  placeholder="******"
                />
              </Box>
            </Grid>

            <Flex gap="3" mt="4" justify="end">
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
