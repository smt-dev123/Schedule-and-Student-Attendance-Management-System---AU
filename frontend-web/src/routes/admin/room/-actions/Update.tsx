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
      number: data.number,
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

  // បច្ចុប្បន្នភាព Form រាល់ពេល Dialog បើក ឬ data ផ្លាស់ប្តូរ
  useEffect(() => {
    if (open) {
      reset({
        name: data.name,
        number: data.number,
        buildingId: data.buildingId,
      })
    }
  }, [open, data, reset])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <IconButton size="1" color="blue" variant="surface" style={{ cursor: 'pointer' }}>
          <FaRegEdit />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>កែប្រែ</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
            {/* Room Name */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">បន្ទប់សិក្សា</Text>
              <TextField.Root
                {...register('name', { 
                  required: 'សូមបញ្ចូលឈ្មោះបន្ទប់',
                  minLength: { value: 3, message: 'ឈ្មោះត្រូវមានយ៉ាងតិច ៣ តួ' } 
                })}
                placeholder="Enter room name"
              />
              {errors.name && <Text size="2" color="red">{errors.name.message}</Text>}
            </label>

            {/* Room Number */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">លេខបន្ទប់ / ជាន់</Text>
              <TextField.Root
                {...register('number', {
                  valueAsNumber: true,
                  required: 'សូមបញ្ចូលលេខបន្ទប់'
                })}
                type="number"
                placeholder="Enter room number"
              />
              {errors.number && <Text size="2" color="red">{errors.number.message}</Text>}
            </label>

            {/* Building Select - កែចំណុច value */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">អាគារសិក្សា</Text>
              <Controller
                name="buildingId"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    // ត្រូវប្រើ field.value (ID) មិនមែន data.building.name ទេ
                    value={String(field.value)} 
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger style={{ width: '100%' }} />
                    <Select.Content>
                      {buildings?.map((building) => (
                        <Select.Item value={String(building.id)} key={building.id}>
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
              <Button variant="soft" color="gray">ចាកចេញ</Button>
            </Dialog.Close>
            <Button type="submit" loading={mutation.isPending}>រក្សាទុក</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
export default RoomUpdate
