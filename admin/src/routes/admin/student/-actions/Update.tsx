import { useState, useEffect, type ChangeEvent } from 'react'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  IconButton,
  Text,
} from '@radix-ui/themes'
import { FaRegEdit } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { StudentsType } from '@/types'
import { updateStudent } from '@/api/StudentAPI'
import { getFaculties } from '@/api/FacultyAPI'
import { getDepartments } from '@/api/DepartmentAPI'
import { getAcademicLevels } from '@/api/AcademicLevelAPI'
import { getAcademicYear } from '@/api/AcademicYearAPI'
import { getMajors } from '@/api/MajorAPI'
import { FormInput, FormSelect } from '@/components/ui/forms/Input'
import { FormCheckbox } from '@/components/ui/forms/Checkbox'

interface Props {
  data: StudentsType
}

const StudentUpdate = ({ data }: Props) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<StudentsType>()

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
  const { data: academicYears = [] } = useQuery({
    queryKey: ['academicYears'],
    queryFn: getAcademicYear,
  })

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
    if (open && data) {
      reset({
        ...data,
        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
        gender: data.gender || 'male',
        educationalStatus: data.educationalStatus || 'enrolled',
        skillId: data.skillId,
        facultyId: data.facultyId,
        departmentId: data.departmentId,
        academicLevelId: data.academicLevelId,
        academicYearId: data.academicYearId,
        year: data.year,
        semester: data.semester,
        generation: data.generation,
        isActive: data.isActive,
      })
      if (data.image || (data as any).image) {
        setPreviewUrl(
          data.image
            ? `http://localhost:3000/api/uploads/${data.image}`
            : `http://localhost:3000/api/uploads/${(data as any).image}`,
        )
      } else {
        setPreviewUrl(null)
      }
      setImageFile(null)
    }
  }, [open, data, reset])

  useEffect(() => {
    if (facultyId && facultyId !== data.facultyId) {
      setValue('departmentId', 0)
      setValue('skillId', 0)
    }
  }, [facultyId, data.facultyId, setValue])

  const mutation = useMutation({
    mutationFn: (formData: any) => updateStudent(data.id!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('កែប្រែនិស្សិតជោគជ័យ')
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
        if (
          data?.error?.name === 'ZodError' &&
          typeof data?.error?.message === 'string'
        ) {
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

      toast.error(data?.message || 'កែប្រែមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: StudentsType) => {
    const payload = new FormData()
    payload.append('name', formData.name)
    payload.append('email', formData.email)
    payload.append('phone', formData.phone)
    payload.append('studentCode', formData.studentCode)
    payload.append('gender', formData.gender)
    payload.append('educationalStatus', formData.educationalStatus)
    payload.append('facultyId', String(formData.facultyId))
    payload.append('departmentId', String(formData.departmentId))
    payload.append('academicLevelId', String(formData.academicLevelId))
    payload.append('academicYearId', String(formData.academicYearId))
    payload.append('skillId', String(formData.skillId))
    if (formData.nameEn) payload.append('nameEn', formData.nameEn)
    if (formData.dob) {
      const dobDate =
        typeof formData.dob === 'string'
          ? formData.dob
          : (formData.dob as Date).toISOString()
      payload.append('dob', dobDate)
    }
    if (formData.address) payload.append('address', formData.address)

    if (formData.year) payload.append('year', String(formData.year))
    if (formData.semester) payload.append('semester', String(formData.semester))
    if (formData.generation)
      payload.append('generation', String(formData.generation))
    if (formData.password) payload.append('password', formData.password)
    payload.append('isActive', String(formData.isActive))
    if (imageFile) payload.append('image', imageFile)
    mutation.mutate(payload)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <IconButton
          size="1"
          color="blue"
          variant="surface"
          style={{ cursor: 'pointer' }}
        >
          <FaRegEdit />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content
        maxWidth="650px"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Dialog.Title>កែប្រែព័ត៌មាននិស្សិត</Dialog.Title>

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
                min={9}
                max={12}
                rules={{
                  required: 'ត្រូវបញ្ចូលលេខទូរស័ព្ទ',
                  pattern: {
                    value: /^[0-9+ ]+$/,
                    message: 'លេខទូរស័ព្ទត្រូវមានតែលេខ 0-9 និង ដកឃ្លា',
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
              <FormSelect
                label="ស្ថានភាពសិក្សា"
                name="educationalStatus"
                control={control}
                register={register}
                error={errors.educationalStatus}
                placeholder="សូមជ្រើសរើសស្ថានភាពសិក្សា"
                isRequired
                options={[
                  { id: 'enrolled', name: 'សកម្ម' },
                  { id: 'suspended', name: 'ព្យួរ' },
                  { id: 'graduated', name: 'បញ្ចប់ការសិក្សា' },
                  { id: 'dropped_out', name: 'បោះបង់ការសិក្សា' },
                  { id: 'transferred', name: 'ផ្ទេរចេញ' },
                ]}
                rules={{
                  required: 'ត្រូវជ្រើសរើសស្ថានភាពសិក្សា',
                }}
                labelKey="name"
                valueKey="id"
              />

              <Box mt="2">
                <FormCheckbox
                  control={control}
                  label="ស្ថានភាព"
                  placeholder="សកម្ម (Active)"
                  name="isActive"
                  error={errors.isActive}
                />
              </Box>
            </Grid>

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

export default StudentUpdate
