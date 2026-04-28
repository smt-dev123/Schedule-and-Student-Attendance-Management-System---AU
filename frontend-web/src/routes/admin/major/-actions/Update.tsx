import type { FacultiesType, MajorsType } from '@/types'
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
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { updateMajors } from '@/api/MajorAPI'
import { getFaculties } from '@/api/FacultyAPI'

interface Props {
  data: MajorsType
}

const MajorUpdate = ({ data }: Props) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MajorsType>({
    defaultValues: {
      name: data.name,
      description: data.description || '',
      facultyId: data.facultyId,
    },
  })

  const { data: faculties } = useQuery<FacultiesType[]>({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  })

  const mutation = useMutation({
    mutationFn: (formData: MajorsType) =>
      updateMajors(Number(data.id), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] })
      toast.success('កែប្រែជោគជ័យ')
      setOpen(false)
    },
    onError: () => {
      toast.error('កែប្រែមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: MajorsType) => {
    mutation.mutate(formData)
  }

  useEffect(() => {
    if (open) {
      reset({
        name: data.name,
        description: data.description || '',
        facultyId: data.facultyId,
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

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>កែប្រែមុខជំនាញ</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                មុខជំនាញ
              </Text>
              <TextField.Root
                {...register('name', { required: 'សូមបំពេញឈ្មោះមុខជំនាញ' })}
                placeholder="សូមបំពេញឈ្មោះមុខជំនាញ"
              />
              {errors.name && (
                <Text size="2" color="red">
                  {errors.name.message}
                </Text>
              )}
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ដេប៉ាតេម៉ង់
              </Text>

              <Controller
                name="facultyId"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    defaultValue={field.value?.toString() ?? ''}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger
                      placeholder="ដេប៉ាតេម៉ង់"
                      style={{ width: '100%' }}
                    />
                    <Select.Content>
                      {faculties?.map((faculty) => (
                        <Select.Item
                          value={String(faculty.id)}
                          key={faculty.id}
                        >
                          {faculty.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                ចាកចេញ
              </Button>
            </Dialog.Close>
            <Button type="submit">រក្សាទុក</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default MajorUpdate
