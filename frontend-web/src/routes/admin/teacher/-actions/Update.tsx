import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Select,
  Text,
  TextField,
} from '@radix-ui/themes'
import { FaRegEdit } from 'react-icons/fa'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import type { TeachersType } from '@/types'
import { updateTeachers } from '@/api/TeacherAPI'

interface Props {
  data: TeachersType
}

const TeacherUpdate = ({ data }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TeachersType>({
    defaultValues: {
      name: data.name,
      gender: data.gender,
      education_level: data.education_level,
      email: data.email,
      phone: data.phone,
      address: data.address,
      profile: data.profile,
    },
  })

  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: (formData: TeachersType) =>
      updateTeachers(Number(data.id), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('កែប្រែជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error('កែប្រែមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: TeachersType) => {
    mutation.mutate(formData)
  }

  useEffect(() => {
    if (open) {
      reset({
        name: data.name,
        gender: data.gender,
        education_level: data.education_level,
        email: data.email,
        phone: data.phone,
        address: data.address,
        profile: data.profile,
      })
    }
  }, [open, data, reset])

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

      <Dialog.Content maxWidth="480px">
        <Dialog.Title>កែប្រែព័ត៌មានគ្រូ</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
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
                render={({ field }) => (
                  <Select.Root
                    value={field.value ?? ''}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <Select.Trigger
                      placeholder="ជ្រើសរើសភេទ"
                      style={{ width: '100%' }}
                    />
                    <Select.Content className="w-[var(--radix-select-trigger-width)]">
                      <Select.Item value="ប្រុស">ប្រុស</Select.Item>
                      <Select.Item value="ស្រី">ស្រី</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </label>

            {/* Education Level */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                កម្រិតវប្បធម៌
              </Text>
              <Controller
                name="education_level"
                control={control}
                rules={{ required: 'ត្រូវជ្រើសរើសកម្រិតវប្បធម៌' }}
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
                      <Select.Item value="បរិញ្ញាបត្រ">បរិញ្ញាបត្រ</Select.Item>
                      <Select.Item value="បរិញ្ញាបត្រជាន់ខ្ពស់">
                        បរិញ្ញាបត្រជាន់ខ្ពស់
                      </Select.Item>
                      <Select.Item value="បណ្ឌិត">បណ្ឌិត</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </label>

            {/* Email */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                អ៊ីម៉ែល
              </Text>
              <TextField.Root
                {...register('email')}
                placeholder="បញ្ចូលអ៊ីម៉ែល"
              />
            </label>

            {/* Phone */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                លេខទូរស័ព្ទ
              </Text>
              <TextField.Root
                {...register('phone')}
                placeholder="បញ្ចូលលេខទូរស័ព្ទ"
              />
            </label>

            {/* Address */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                អាសយដ្ឋាន
              </Text>
              <TextField.Root
                {...register('address')}
                placeholder="បញ្ចូលអាសយដ្ឋាន"
              />
            </label>

            {/* Profile */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                រូបភាព
              </Text>
              <TextField.Root
                {...register('profile')}
                placeholder="បញ្ចូល URL រូបភាព"
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
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

export default TeacherUpdate
