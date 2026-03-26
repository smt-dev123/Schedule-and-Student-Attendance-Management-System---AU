import type { BuildingType } from '@/types'
import { Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBuilding } from '@/api/BuildingAPI'
import { useState } from 'react'
import toast from 'react-hot-toast'

const BuildingCreate = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuildingType>()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: (formData: BuildingType) => createBuilding(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
      toast.success('បង្កើតជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error('បង្កើតមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: BuildingType) => {
    mutation.mutate(formData)
  }

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button variant="solid" style={{ cursor: 'pointer' }}>
            បន្ថែមអាគារសិក្សា
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>បន្ថែមអាគារសិក្សា</Dialog.Title>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                អាគារសិក្សា
              </Text>
              <TextField.Root
                {...register('name', { required: 'សូមបំពេញឈ្មោះអាគារសិក្សា' })}
                placeholder="សូមបំពេញឈ្មោះអាគារសិក្សា"
                required
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
                placeholder="សូមបំពេញការពិពណ៌នា"
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

export default BuildingCreate
