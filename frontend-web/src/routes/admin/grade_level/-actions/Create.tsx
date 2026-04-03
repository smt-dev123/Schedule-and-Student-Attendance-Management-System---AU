import { useState } from 'react'
import { Button, Dialog, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { GradeLevelType } from '@/types'
import { createGradeLevel } from '@/api/GradeLevelAPI'

const GradeLevleCreate = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeLevelType>()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: (formData: GradeLevelType) => createGradeLevel(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradeLevels'] })
      toast.success('បង្កើតជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error('បង្កើតមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: GradeLevelType) => {
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
            {/* Level Field - Now a Select Dropdown */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">កម្រិតសិក្សា</Text>
              <Controller
                control={control}
                name="level"
                rules={{ required: 'សូមជ្រើសរើសកម្រិតសិក្សា' }}
                render={({ field }) => (
                  <Select.Root
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <Select.Trigger placeholder="ជ្រើសរើសកម្រិត..." style={{ width: '100%' }} />
                    <Select.Content>
                      <Select.Item value="Associate">Associate</Select.Item>
                      <Select.Item value="Bachelor">Bachelor</Select.Item>
                      <Select.Item value="Master">Master</Select.Item>
                      <Select.Item value="PhD">PhD</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.level && (
                <Text size="2" color="red">{errors.level.message}</Text>
              )}
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">ការពិពណ៌នា</Text>
              <TextField.Root
                {...register('description')}
                placeholder="បញ្ចូលការពិពណ៌នា"
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

export default GradeLevleCreate
