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
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomType>({
    defaultValues: {
      name: data.name,
      floor: data?.floor,
      buildingId: data.buildingId,
    },
  })
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: buildings } = useQuery<BuildingType[]>({
    queryKey: ['buildings'],
    queryFn: getBuilding,
  })

  const mutation = useMutation({
    mutationFn: (formData: RoomType) => updateRoom(Number(data.id), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      setOpen(false)
      toast.success('កែប្រែជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error('កែប្រែមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: RoomType) => {
    mutation.mutate(formData)
  }

  useEffect(() => {
    if (open) {
      reset({
        name: data.name,
        floor: data.floor,
        buildingId: data.buildingId,
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
                  បន្ទប់សិក្សា
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
                  ជាន់បន្ទប់សិក្សា
                </Text>
                <TextField.Root
                  {...register('floor')}
                  placeholder="Enter floor number"
                  type="number"
                />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  អាគារសិក្សា
                </Text>

                <Controller
                  name="buildingId"
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      value={data.building.name}
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
    </>
  )
}

export default RoomUpdate
