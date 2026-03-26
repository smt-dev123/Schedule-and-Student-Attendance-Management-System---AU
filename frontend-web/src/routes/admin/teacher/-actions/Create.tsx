import { useState } from 'react'
import { Button, Dialog, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { TeachersType } from '@/types'
import { createTeachers } from '@/api/TeacherAPI'
import { getAcademicLevels } from '@/api/AcademicLevelAPI'
import { getFaculties } from '@/api/FacultyAPI'

const TeacherCreate = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeachersType>()

  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: academicLevels } = useQuery({
    queryKey: ['academicLevels'],
    queryFn: getAcademicLevels,
  })

  const { data: faculties } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  })

  const mutation = useMutation({
    mutationFn: (formData: TeachersType) => createTeachers(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('បង្កើតជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error('បង្កើតមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: TeachersType) => {
    mutation.mutate({
      ...formData,
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

      <Dialog.Content maxWidth="450px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <Dialog.Title>បន្ថែមគ្រូថ្មី</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
            {/* ID */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                អត្តលេខគ្រូ (ID)
              </Text>
              <TextField.Root
                {...register('id', { required: 'ត្រូវបញ្ចូលអត្តលេខគ្រូ' })}
                placeholder="បញ្ចូលអត្តលេខគ្រូ (ឧ. T-001)"
              />
              {errors.id && (
                <Text size="2" color="red">
                  {errors.id.message}
                </Text>
              )}
            </label>

            {/* Name */}
            <label>
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
            </label>

            {/* Gender */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ភេទ
              </Text>
              <Controller
                name="gender"
                control={control}
                rules={{ required: 'ត្រូវជ្រើសរើសភេទ' }}
                render={({ field }) => (
                  <Select.Root
                    value={field.value || ''}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <Select.Trigger
                      placeholder="ជ្រើសរើសភេទ"
                      style={{ width: '100%' }}
                    />
                    <Select.Content className="w-[var(--radix-select-trigger-width)]">
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
            </label>

            {/* Academic Level */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                កម្រិតវប្បធម៌
              </Text>
              <Controller
                name="academicLevelId"
                control={control}
                rules={{ required: 'ត្រូវជ្រើសរើសកម្រិតវប្បធម៌' }}
                render={({ field }) => (
                  <Select.Root
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger
                      placeholder="ជ្រើសរើសកម្រិតវប្បធម៌"
                      style={{ width: '100%' }}
                    />
                    <Select.Content className="w-[var(--radix-select-trigger-width)]">
                      {academicLevels?.map((level: { id: number; level: string }) => (
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
            </label>

            {/* Faculty */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                មហាវិទ្យាល័យ
              </Text>
              <Controller
                name="facultyId"
                control={control}
                rules={{ required: 'ត្រូវជ្រើសរើសមហាវិទ្យាល័យ' }}
                render={({ field }) => (
                  <Select.Root
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger
                      placeholder="ជ្រើសរើសមហាវិទ្យាល័យ"
                      style={{ width: '100%' }}
                    />
                    <Select.Content className="w-[var(--radix-select-trigger-width)]">
                      {faculties?.map((faculty: { id: number; name: string }) => (
                        <Select.Item key={faculty.id} value={String(faculty.id)}>
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
            </label>

            {/* Email */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                អ៊ីម៉ែល
              </Text>
              <TextField.Root
                {...register('email', { 
                  required: 'ត្រូវបញ្ចូលអ៊ីម៉ែល',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "អ៊ីម៉ែលមិនត្រឹមត្រូវ"
                  }
                })}
                placeholder="បញ្ចូលអ៊ីម៉ែល"
              />
               {errors.email && (
                <Text size="2" color="red">
                  {errors.email.message}
                </Text>
              )}
            </label>

            {/* Phone */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                លេខទូរស័ព្ទ
              </Text>
              <TextField.Root
                {...register('phone', { 
                  required: 'ត្រូវបញ្ចូលលេខទូរស័ព្ទ',
                  minLength: { value: 10, message: 'យ៉ាងហោចណាស់ ១០ ខ្ទង់' },
                  maxLength: { value: 15, message: 'មិនលើសពី ១៥ ខ្ទង់' }
                })}
                placeholder="បញ្ចូលលេខទូរស័ព្ទ"
              />
               {errors.phone && (
                <Text size="2" color="red">
                  {errors.phone.message}
                </Text>
              )}
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" type="button">
                ចាកចេញ
              </Button>
            </Dialog.Close>
            <Button type="submit" loading={mutation.isPending}>
              រក្សាទុក
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default TeacherCreate
