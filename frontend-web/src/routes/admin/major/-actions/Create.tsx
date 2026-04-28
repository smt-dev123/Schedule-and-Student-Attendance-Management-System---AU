import { useState } from 'react'
import { Button, Dialog, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { FacultiesType, MajorsType } from '@/types'
import { createMajors } from '@/api/MajorAPI'
import { getFaculties } from '@/api/FacultyAPI'

const MajorCreate = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MajorsType>()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: faculties } = useQuery<FacultiesType[]>({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  })

  const mutation = useMutation({
    mutationFn: (formData: MajorsType) => createMajors(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] })
      toast.success('បង្កើតជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error('បង្កើតមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: MajorsType) => {
    mutation.mutate(formData)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="solid" style={{ cursor: 'pointer' }}>
          បន្ថែមជំនាញសិក្សា
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>បន្ថែមជំនាញសិក្សា</Dialog.Title>

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

export default MajorCreate
