import type { DepartmentsType, MajorsType } from '@/types'
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
import { getDepartments } from '@/api/DepartmentAPI'

interface Props {
  data: MajorsType
}

const MajorUpdate = ({ data }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MajorsType>({
    defaultValues: {
      name: data.name,
      description: data?.description,
      department: data.department,
    },
  })
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: departments } = useQuery<DepartmentsType[]>({
    queryKey: ['departments'],
    queryFn: getDepartments,
  })

  const mutation = useMutation({
    mutationFn: (formData: MajorsType) =>
      updateMajors(Number(data.id), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] })
      setOpen(false)
      toast.success('កែប្រែជោគជ័យ')
      setOpen(false)
      reset()
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
        description: data.description,
        departmentId: data.departmentId,
      })
    }
  }, [open, data, reset])

  return (
    <>
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
          <Dialog.Title>កែប្រែ</Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  មុខជំនាញ
                </Text>
                <TextField.Root
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Enter room name"
                />
                {errors.name && (
                  <Text size="2" color="red">
                    {errors.name.message}
                  </Text>
                )}
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  ការពិពណ៌នា
                </Text>
                <TextField.Root
                  {...register('description')}
                  placeholder="Enter description"
                />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  ដេប៉ាតេម៉ង់
                </Text>

                <Controller
                  name="departmentId"
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      value={data.department?.name}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <Select.Trigger
                        placeholder="ជ្រើសរើសអាគារ"
                        style={{ width: '100%' }}
                      />
                      <Select.Content>
                        {departments?.map((department) => (
                          <Select.Item
                            value={String(department.id)}
                            key={department.id}
                          >
                            {department.name}
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
    </>
  )
}

export default MajorUpdate
