import type { BuildingType, RoomType } from '@/types'
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
import { getBuilding } from '@/api/BuildingAPI'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { updateRoom } from '@/api/RoomAPI'

interface Props {
  data: RoomType
}

const RoomUpdate = ({ data }: Props) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomType>({
    defaultValues: data,
  })

  const { data: buildings } = useQuery<BuildingType[]>({
    queryKey: ['buildings'],
    queryFn: () => getBuilding('all'),
  })

  // Update Mutation
  const mutation = useMutation({
    mutationFn: (formData: RoomType) => updateRoom(Number(data.id), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('កែប្រែជោគជ័យ')
      setOpen(false)
    },
    onError: () => {
      toast.error('កែប្រែមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: RoomType) => {
    mutation.mutate(formData)
  }

  // Reset form when dialog opens or data changes
  useEffect(() => {
    if (open) {
      reset(data)
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
        <Dialog.Title>កែប្រែព័ត៌មានបន្ទប់</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
            {/* Room name */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                បន្ទប់សិក្សា
              </Text>
              <TextField.Root
                {...register('name', {
                  required: 'សូមបញ្ចូលបន្ទប់សិក្សា',
                  minLength: { value: 3, message: 'យ៉ាងហោចណាស់ ៣ខ្ទង់' },
                })}
                placeholder="សូមបញ្ចូលឈ្មោះបន្ទប់"
              />
              {errors.name && (
                <Text size="2" color="red">
                  {errors.name.message}
                </Text>
              )}
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ជាន់បន្ទប់សិក្សា
              </Text>
              <TextField.Root
                {...register('floor', {
                  valueAsNumber: true,
                  required: 'សូមបញ្ចូលលេខជាន់',
                })}
                placeholder="សូមបញ្ចូលលេខជាន់"
                type="number"
              />
              {errors.floor && (
                <Text size="2" color="red">
                  {errors.floor.message}
                </Text>
              )}
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                លេខបន្ទប់សិក្សា
              </Text>
              <TextField.Root
                {...register('classroomNumber', {
                  valueAsNumber: true,
                  required: 'សូមបញ្ចូលលេខបន្ទប់សិក្សា',
                })}
                placeholder="សូមបញ្ចូលលេខបន្ទប់សិក្សា"
                type="number"
              />
              {errors.classroomNumber && (
                <Text size="2" color="red">
                  {errors.classroomNumber.message}
                </Text>
              )}
            </label>

            {/* Building Select */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                អាគារសិក្សា
              </Text>

              <Controller
                name="buildingId"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value?.toString() ?? ''}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger
                      placeholder="ជ្រើសរើសអាគារ"
                      style={{ width: '100%' }}
                    />
                    <Select.Content>
                      {buildings?.map((building) => (
                        <Select.Item
                          value={String(building.id)}
                          key={building.id}
                        >
                          {building.name}
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

export default RoomUpdate
