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

const StudentCreate = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StudentsType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      gender: '',
      educationalStatus: 'enrolled',
    },
  })

  // Fetch Data for Select Options
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

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) reset()
  }, [open, reset])

  const mutation = useMutation({
    mutationFn: (formData: StudentsType) => createStudent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('បង្កើតនិស្សិតជោគជ័យ')
      setOpen(false)
    },
    onError: () => toast.error('បង្កើតមិនជោគជ័យ'),
  })

  const onSubmit = (formData: StudentsType) => {
    const payload = {
      ...formData,
      facultyId: Number(formData.facultyId),
      departmentId: Number(formData.departmentId),
      academicLevelId: Number(formData.academicLevelId),
      year: formData.year ? Number(formData.year) : null,
      semester: formData.semester ? Number(formData.semester) : null,
      generation: formData.generation ? Number(formData.generation) : null,
    }
    mutation.mutate(payload)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="solid" style={{ cursor: 'pointer' }}>
          បន្ថែមនិស្សិត
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="650px">
        <Dialog.Title>ចុះឈ្មោះនិស្សិតថ្មី</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <Grid columns="2" gap="4">
              {/* Name */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  ឈ្មោះនិស្សិត
                </Text>
                <TextField.Root
                  {...register('name', { required: 'ត្រូវបញ្ចូលឈ្មោះ' })}
                  placeholder="ឧ. សុខ សំណាង"
                />
                {errors.name && (
                  <Text size="1" color="red">
                    {errors.name.message}
                  </Text>
                )}
              </Box>

              {/* Email */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  អ៊ីម៉ែល
                </Text>
                <TextField.Root
                  {...register('email', {
                    required: 'ត្រូវបញ្ចូលអ៊ីម៉ែល',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'ទម្រង់អ៊ីម៉ែលមិនត្រឹមត្រូវ',
                    },
                  })}
                  placeholder="example@mail.com"
                />
                {errors.email && (
                  <Text size="1" color="red">
                    {errors.email.message}
                  </Text>
                )}
              </Box>

              {/* Password */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  លេខសម្ងាត់
                </Text>
                <TextField.Root
                  type="password"
                  {...register('password', {
                    required: 'ត្រូវកំណត់លេខសម្ងាត់',
                  })}
                  placeholder="******"
                />
                {errors.password && (
                  <Text size="1" color="red">
                    {errors.password.message}
                  </Text>
                )}
              </Box>

              {/* Phone */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  លេខទូរស័ព្ទ
                </Text>
                <TextField.Root
                  {...register('phone', {
                    required: 'ត្រូវបញ្ចូលលេខទូរស័ព្ទ',
                    maxLength: {
                      value: 15,
                      message: 'លេខទូរស័ព្ទមិនអាចលើសពី ១៥ខ្ទង់',
                    },
                  })}
                  placeholder="012345678"
                />
                {errors.phone && (
                  <Text size="1" color="red">
                    {errors.phone.message}
                  </Text>
                )}
              </Box>

              {/* Gender */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">ភេទ</Text>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: 'ត្រូវជ្រើសរើសភេទ' }}
                  render={({ field }) => (
                    <Select.Root value={field.value || ''} onValueChange={field.onChange}>
                      <Select.Trigger style={{ width: '100%' }} />
                      <Select.Content>
                        <Select.Item value="male">ប្រុស (Male)</Select.Item>
                        <Select.Item value="female">ស្រី (Female)</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  )}
                />
              </Box>
              {/* Educational Status */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">ស្ថានភាពសិក្សា</Text>
                <Controller
                  name="educationalStatus"
                  control={control}
                  render={({ field }) => (
                    <Select.Root value={field.value || 'enrolled'} onValueChange={field.onChange}>
                      <Select.Trigger style={{ width: '100%' }} />
                      <Select.Content>
                        <Select.Item value="enrolled">កំពុងរៀន (Enrolled)</Select.Item>
                        <Select.Item value="graduated">បញ្ចប់ការសិក្សា (Graduated)</Select.Item>
                        <Select.Item value="dropped out">បោះបង់ (Dropped Out)</Select.Item>
                        <Select.Item value="transferred">ផ្លាស់ប្តូរ (Transferred)</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  )}
                />
              </Box>

              {/* Faculty */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  មហាវិទ្យាល័យ
                </Text>
                <Controller
                  name="facultyId"
                  control={control}
                  rules={{ required: 'ត្រូវជ្រើសរើសមហាវិទ្យាល័យ' }}
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
                {errors.facultyId && (
                  <Text size="1" color="red">
                    {errors.facultyId.message}
                  </Text>
                )}
              </Box>

              {/* Department */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  ដេប៉ាតឺម៉ង់
                </Text>
                <Controller
                  name="departmentId"
                  control={control}
                  rules={{ required: 'ត្រូវជ្រើសរើសដេប៉ាតឺម៉ង់' }}
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
                {errors.departmentId && (
                  <Text size="1" color="red">
                    {errors.departmentId.message}
                  </Text>
                )}
              </Box>

              {/* Academic Level */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  កម្រិតសិក្សា
                </Text>
                <Controller
                  name="academicLevelId"
                  control={control}
                  rules={{ required: 'ត្រូវជ្រើសរើសកម្រិតសិក្សា' }}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        style={{ width: '100%' }}
                        placeholder="ជ្រើសរើសកម្រិត"
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
                {errors.academicLevelId && (
                  <Text size="1" color="red">
                    {errors.academicLevelId.message}
                  </Text>
                )}
              </Box>

              {/* Year & Semester */}
              <Flex gap="3">
                <Box flexGrow="1">
                  <Text as="div" size="2" mb="1" weight="bold">
                    ឆ្នាំទី
                  </Text>
                  <TextField.Root
                    type="number"
                    {...register('year')}
                    placeholder="1"
                  />
                </Box>
                <Box flexGrow="1">
                  <Text as="div" size="2" mb="1" weight="bold">
                    ឆមាស
                  </Text>
                  <TextField.Root
                    type="number"
                    {...register('semester')}
                    placeholder="1"
                  />
                </Box>
              </Flex>

              {/* Generation */}
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  ជំនាន់
                </Text>
                <TextField.Root
                  type="number"
                  {...register('generation')}
                  placeholder="ឧ. 10"
                />
              </Box>
            </Grid>

            {/* Form Actions */}
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button
                  variant="soft"
                  color="gray"
                  type="button"
                  style={{ cursor: 'pointer' }}
                >
                  ចាកចេញ
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                loading={mutation.isPending}
                style={{ cursor: 'pointer' }}
              >
                រក្សាទុក
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default StudentCreate
