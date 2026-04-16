import { useState, useEffect } from 'react'
import { Button, Dialog, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { TeachersType } from '@/types'
import { createTeachers } from '@/api/TeacherAPI'
import { getAcademicLevels } from '@/api/AcademicLevelAPI'
import { getFaculties } from '@/api/FacultyAPI'

const TeacherCreate = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeachersType>({
    defaultValues: {
      gender: 'male',
      academicLevelId: undefined,
      facultyId: undefined,
    },
  })

  // Fetch Data
  const { data: academicLevels = [] } = useQuery({
    queryKey: ['academicLevels'],
    queryFn: getAcademicLevels,
  })

  const { data: faculties = [] } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const mutation = useMutation({
    mutationFn: (formData: TeachersType) => createTeachers(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('បង្កើតជោគជ័យ')
      setOpen(false)
    },
    onError: () => {
      toast.error('បង្កើតមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: TeachersType) => {
    mutation.mutate({
      ...formData,
      // Ensure IDs are numbers if your backend expects them as such
      academicLevelId: Number(formData.academicLevelId),
      facultyId: Number(formData.facultyId),
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="solid" style={{ cursor: 'pointer' }}>
          បន្ថែមគ្រូ
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>បន្ថែមគ្រូថ្មី</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex
            direction="column"
            gap="3"
            style={{
              maxHeight: '60vh',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {/* Teacher ID */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                អត្តលេខគ្រូ (ID)
              </Text>
              <TextField.Root
                {...register('id', { required: 'ត្រូវបញ្ចូលអត្តលេខគ្រូ' })}
                placeholder="ឧ. T-001"
              />
              {errors.id && (
                <Text size="2" color="red">
                  {errors.id.message}
                </Text>
              )}
            </Box>

            {/* Name */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                គោត្តនាម-នាម
              </Text>
              <TextField.Root
                {...register('name', { required: 'ត្រូវបញ្ចូលឈ្មោះ' })}
                placeholder="បញ្ចូលឈ្មោះ"
              />
              {errors.name && (
                <Text size="2" color="red">
                  {errors.name.message}
                </Text>
              )}
            </Box>

            {/* Gender */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                ភេទ
              </Text>
              <Controller
                name="gender"
                control={control}
                rules={{ required: 'ត្រូវជ្រើសរើសភេទ' }}
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger
                      placeholder="ជ្រើសរើសភេទ"
                      style={{ width: '100%' }}
                    />
                    <Select.Content>
                      <Select.Item value="male">ប្រុស</Select.Item>
                      <Select.Item value="female">ស្រី</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.gender && (
                <Text size="2" color="red">
                  {errors.gender.message}
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
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger
                      placeholder="ជ្រើសរើសកម្រិតវប្បធម៌"
                      style={{ width: '100%' }}
                    />
                    <Select.Content>
                      {academicLevels.map((level: any) => (
                        <Select.Item key={level.id} value={String(level.id)}>
                          {level.level}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.academicLevelId && (
                <Text size="2" color="red">
                  {errors.academicLevelId.message}
                </Text>
              )}
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
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger
                      placeholder="ជ្រើសរើសមហាវិទ្យាល័យ"
                      style={{ width: '100%' }}
                    />
                    <Select.Content>
                      {faculties.map((faculty: any) => (
                        <Select.Item
                          key={faculty.id}
                          value={String(faculty.id)}
                        >
                          {faculty.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.facultyId && (
                <Text size="2" color="red">
                  {errors.facultyId.message}
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
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'អ៊ីម៉ែលមិនត្រឹមត្រូវ',
                  },
                })}
                placeholder="example@mail.com"
              />
              {errors.email && (
                <Text size="2" color="red">
                  {errors.email.message}
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
                  minLength: { value: 10, message: 'យ៉ាងហោចណាស់ 10 ខ្ទង់' },
                })}
                placeholder="012345678"
              />
              {errors.phone && (
                <Text size="2" color="red">
                  {errors.phone.message}
                </Text>
              )}
            </Box>

            {/* Password */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                ពាក្យសម្ងាត់
              </Text>
              <TextField.Root
                {...register('password', {
                  required: 'ត្រូវបញ្ចូលពាក្យសម្ងាត់ យ៉ាងហោចណាស់ 8 ខ្ទង់',
                })}
                placeholder="********"
                type="password"
              />
              {errors.password && (
                <Text size="2" color="red">
                  {errors.password.message}
                </Text>
              )}
            </Box>
          </Flex>

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
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

// Helper component to keep the list clean
const Box = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: '4px' }}>{children}</div>
)

export default TeacherCreate
