import { useState } from 'react'
import { Button, Dialog, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { BuildingType, RoomType } from '@/types'
import { createRoom } from '@/api/RoomAPI'
import { getBuilding } from '@/api/BuildingAPI'

const RoomCreate = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomType>()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: buildings } = useQuery<BuildingType[]>({
    queryKey: ['buildings'],
    queryFn: getBuilding,
  })

  const mutation = useMutation({
    mutationFn: (formData: RoomType) => createRoom(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('បង្កើតជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error('បង្កើតមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: RoomType) => {
    mutation.mutate(formData)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="solid" style={{ cursor: 'pointer' }}>
          បន្ថែមបន្ទប់សិក្សា
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>បន្ថែមបន្ទប់សិក្សា</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
            {/* Room name */}
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

            {/* Floor */}
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

export default RoomCreate
