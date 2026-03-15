import type { BuildingType } from '@/types'
import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Text,
  TextField,
} from '@radix-ui/themes'
import { FaRegEdit } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBuilding } from '@/api/BuildingAPI'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'

interface Props {
  data: BuildingType
}

const BuildingUpdate = ({ data }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuildingType>({
    defaultValues: {
      name: data.name,
      description: data?.description,
    },
  })
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: (formData: BuildingType) =>
      updateBuilding(Number(data.id), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
      setOpen(false)
      toast.success('កែប្រែជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error('កែប្រែមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: BuildingType) => {
    mutation.mutate(formData)
  }

  useEffect(() => {
    if (open) {
      reset({
        name: data.name,
        description: data.description,
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

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                អាគារសិក្សា
              </Text>
              <TextField.Root
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter your full name"
              />
              {errors.name && <span>{errors.name.message}</span>}
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ការពិពណ៌នា
              </Text>
              <TextField.Root
                {...register('description')}
                placeholder="Enter your description"
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                ចាកចេញ
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={handleSubmit(onSubmit)}>រក្សាទុក</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

export default BuildingUpdate
