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
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { StudentsType } from '@/types'
import { createStudent } from '@/api/StudentAPI'
import { getFaculties } from '@/api/FacultyAPI'
import { getDepartments } from '@/api/DepartmentAPI'
import { getAcademicLevels } from '@/api/AcademicLevelAPI'
import { getAcademicYear } from '@/api/AcademicYearAPI'
import { getMajors } from '@/api/MajorAPI'
import { FormInput, FormSelect } from '@/components/ui/Input'

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
    setError,
    watch,
    formState: { errors },
  } = useForm<StudentsType>({
    defaultValues: {
      name: '',
      nameEn: '',
      email: '',
      password: '',
      phone: '',
      address: '',
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
      const data = error?.response?.data
      if (data?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
        setError('email', {
          type: 'manual',
          message:
            'អ៊ីម៉ែលនេះមានអ្នកប្រើប្រាស់រួចហើយ សូមប្រើប្រាស់អ៊ីម៉ែលផ្សេង',
        })
        return
      }

      let issues: any[] = []
      try {
        if (data?.error?.name === 'ZodError' && typeof data?.error?.message === 'string') {
          issues = JSON.parse(data.error.message)
        } else {
          issues = data?.error?.issues || data?.errors || []
        }
      } catch (e) {
        issues = []
      }

      if (Array.isArray(issues) && issues.length > 0) {
        issues.forEach((issue: any) => {
          const field = issue.path?.[0] || issue.field
          if (field) {
            setError(field as any, {
              type: 'server',
              message: issue.message,
            })
          }
        })
        toast.error('សូមពិនិត្យមើលព័ត៌មានដែលបានបញ្ចូលឡើងវិញ')
        return
      }

      toast.error(data?.message || 'ការចុះឈ្មោះមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: StudentsType) => {
    const data = new FormData()

    if (imageFile) {
      data.append('image', imageFile)
    }

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

      <Dialog.Content
        maxWidth="750px"
        size="3"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Dialog.Title>ចុះឈ្មោះនិស្សិតថ្មី</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          សូមបំពេញព័ត៌មាននិស្សិតឱ្យបានត្រឹមត្រូវតាមទម្រង់ខាងក្រោម។
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
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
              <FormInput
                label="លេខសម្គាល់"
                name="studentCode"
                placeholder="សូមបំពេញលេខសម្គាល់"
                control={control}
                register={register}
                error={errors.studentCode}
                rules={{
                  required: 'ត្រូវបញ្ចូលលេខសម្គាល់',
                }}
                isRequired
              />

              <FormInput
                label="ឈ្មោះនិស្សិត"
                name="name"
                placeholder="ឧ. លុយ សុមាត្រា"
                control={control}
                register={register}
                error={errors.name}
                rules={{
                  required: 'ត្រូវបញ្ចូលឈ្មោះនិស្សិត',
                }}
                isRequired
              />

              <FormInput
                label="ឈ្មោះអង់គ្លេស"
                placeholder="LUY Somatra"
                name="nameEn"
                control={control}
                register={register}
                error={errors.nameEn}
                rules={{
                  required: 'ត្រូវបញ្ចូលឈ្មោះអង់គ្លេស',
                }}
                isRequired
              />
              <FormSelect
                label="ភេទ"
                name="gender"
                control={control}
                register={register}
                error={errors.gender}
                isRequired
                rules={{
                  required: 'ត្រូវជ្រើសរើសភេទ',
                }}
                options={[
                  { id: 'male', name: 'ប្រុស' },
                  { id: 'female', name: 'ស្រី' },
                ]}
              />

              <FormInput
                label="អ៊ីម៉ែល"
                placeholder="student@example.com"
                name="email"
                control={control}
                register={register}
                error={errors.email}
                rules={{
                  required: 'ត្រូវបញ្ចូលអ៊ីម៉ែល',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'អ៊ីម៉ែលមិនត្រឹមត្រូវ',
                  },
                }}
                isRequired
              />

              <FormInput
                label="លេខទូរស័ព្ទ"
                placeholder="012 345 678"
                name="phone"
                control={control}
                register={register}
                error={errors.phone}
                type="tel"
                minLength={8}
                maxLength={15}
                rules={{
                  required: 'ត្រូវបញ្ចូលលេខទូរស័ព្ទ',
                  pattern: {
                    value: 15,
                    message: 'លេខទូរស័ព្ទត្រូវមានយ៉ាងតិច 15 តួអក្សរ',
                  },
                }}
                isRequired
              />

              <FormInput
                label="ថ្ងៃខែឆ្នាំកំណើត"
                placeholder="សូមជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត"
                name="dob"
                control={control}
                register={register}
                rules={{
                  required: 'ត្រូវជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត',
                }}
                type="date"
                error={errors.dob}
                isRequired
              />

              <FormInput
                label="អាស័យដ្ឋាន"
                placeholder="សូមជ្រើសរើសអាស័យដ្ឋាន"
                name="address"
                control={control}
                register={register}
                error={errors.address}
              />

              <FormSelect
                label="ឆ្នាំសិក្សា"
                placeholder="សូមជ្រើសរើសឆ្នាំសិក្សា"
                name="academicYearId"
                control={control}
                register={register}
                error={errors.academicYearId}
                isRequired
                options={academicYears ?? []}
                rules={{
                  required: 'ត្រូវជ្រើសរើសឆ្នាំសិក្សា',
                }}
                valueAsNumber
                labelKey="name"
                valueKey="id"
              />

              <FormSelect
                label="កម្រិតសិក្សា"
                placeholder="សូមជ្រើសរើសកម្រិតសិក្សា"
                name="academicLevelId"
                control={control}
                register={register}
                error={errors.academicLevelId}
                isRequired
                options={academicLevels ?? []}
                rules={{
                  required: 'ត្រូវជ្រើសរើសកម្រិតសិក្សា',
                }}
                valueAsNumber
                labelKey="level"
                valueKey="id"
              />

              <FormSelect
                label="មហាវិទ្យាល័យ"
                placeholder="សូមជ្រើសរើសមហាវិទ្យាល័យ"
                name="facultyId"
                control={control}
                register={register}
                error={errors.facultyId}
                isRequired
                options={faculties ?? []}
                rules={{
                  required: 'ត្រូវជ្រើសរើសមហាវិទ្យាល័យ',
                }}
                valueAsNumber
                labelKey="name"
                valueKey="id"
              />

              <FormSelect
                label="ជំនាញ"
                name="skillId"
                control={control}
                register={register}
                error={errors.skillId}
                placeholder={
                  facultyId ? 'ជ្រើសរើសជំនាញ' : 'សូមជ្រើសរើសមហាវិទ្យាល័យជាមុន'
                }
                isRequired
                options={majors
                  .filter(
                    (m: any) =>
                      m.facultyId?.toString() === facultyId?.toString(),
                  )
                  .map((m: any) => ({
                    id: m.id,
                    name: m.name,
                  }))}
                rules={{
                  required: 'ត្រូវជ្រើសរើសជំនាញ',
                }}
                valueAsNumber
                labelKey="name"
                valueKey="id"
              />

              <FormSelect
                label="តេប៉ាតឺម៉ង់"
                name="departmentId"
                control={control}
                register={register}
                error={errors.departmentId}
                isRequired
                placeholder={
                  facultyId
                    ? 'ជ្រើសរើសតេប៉ាតឺម៉ង់'
                    : 'សូមជ្រើសរើសមហាវិទ្យាល័យជាមុន'
                }
                options={departments
                  .filter(
                    (d: any) =>
                      d.facultyId?.toString() === facultyId?.toString(),
                  )
                  .map((d: any) => ({
                    id: d.id,
                    name: d.name,
                  }))}
                rules={{
                  required: 'ត្រូវជ្រើសរើសតេប៉ាតឺម៉ង់',
                }}
                valueAsNumber
                labelKey="name"
                valueKey="id"
              />

              <FormInput
                label="ឆ្នាំទី"
                name="year"
                control={control}
                register={register}
                type="number"
                error={errors.year}
                min={1}
                max={5}
                rules={{
                  pattern: {
                    value: 5,
                    message: 'ឆ្នាំទីមិនត្រឹមត្រូវ',
                  },
                }}
                placeholder="សូមជ្រើសរើសឆ្នាំទី"
                isRequired
              />

              <FormInput
                label="ឆមាស"
                name="semester"
                control={control}
                register={register}
                type="number"
                error={errors.semester}
                min={1}
                max={2}
                rules={{
                  pattern: {
                    value: 2,
                    message: 'ឆមាសមិនត្រឹមត្រូវ',
                  },
                }}
                placeholder="សូមជ្រើសរើសឆមាស"
                isRequired
              />

              <FormInput
                label="ជំនាន់"
                name="generation"
                control={control}
                register={register}
                type="number"
                error={errors.generation}
                min={1}
                placeholder="សូមជ្រើសរើសជំនាន់"
                rules={{
                  required: 'ត្រូវជ្រើសរើសជំនាន់',
                }}
                isRequired
              />

              <FormInput
                label="លេខសម្ងាត់"
                name="password"
                control={control}
                register={register}
                type="password"
                error={errors.password}
                min={8}
                rules={{
                  required: 'ត្រូវបញ្ចូលលេខសម្ងាត់',
                  pattern: {
                    value: 8,
                    message: 'លេខសម្ងាត់ត្រូវមានយ៉ាងតិច 8 តួអក្សរ',
                  },
                }}
                placeholder="សូមបំពេញលេខសម្ងាត់"
                isRequired
              />
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
