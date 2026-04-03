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
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import type { AcademicYearsType } from '@/types'
import { updateAcademicYear } from '@/api/AcademicYearAPI'

interface Props {
  data: AcademicYearsType
}

const formatDateForInput = (dateString: string | undefined) => {
  if (!dateString) return ''
  return dateString.split('T')[0]
}

const SessionTimeUpdate = ({ data }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AcademicYearsType>({
    defaultValues: {
      name: data.name,
      startDate: formatDateForInput(data.startDate),
      endDate: formatDateForInput(data.endDate),
    },
  })

  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: (formData: AcademicYearsType) =>
      updateAcademicYear(Number(data.id), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic_years'] })
      toast.success('កែប្រែជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error('កែប្រែមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: AcademicYearsType) => {
    mutation.mutate(formData)
  }

  useEffect(() => {
    if (open) {
      reset({
        name: data.name,
        startDate: formatDateForInput(data.startDate),
        endDate: formatDateForInput(data.endDate),
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
        <Dialog.Title>កែប្រែឆ្នាំសិក្សា</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
            {/* Name */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ឆ្នាំសិក្សា
              </Text>
              <TextField.Root
                {...register('name', {
                  required: 'ត្រូវបញ្ចូលឈ្មោះឆ្នាំសិក្សា',
                })}
                placeholder="បញ្ចូលឈ្មោះឆ្នាំសិក្សា"
              />
              {errors.name && (
                <Text size="2" color="red">
                  {errors.name.message}
                </Text>
              )}
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ថ្ងៃចាប់ផ្ដើម
              </Text>
              <TextField.Root
                {...register('startDate')}
                type="date"
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ថ្ងៃបញ្ចប់
              </Text>
              <TextField.Root
                {...register('endDate')}
                type="date"
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                ចាកចេញ
              </Button>
            </Dialog.Close>

            <Button type="submit" loading={mutation.isPending}>
              រក្សាទុក
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default SessionTimeUpdate