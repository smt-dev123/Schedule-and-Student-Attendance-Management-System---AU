import {
  Button,
  Dialog,
  Flex,
  Grid,
  IconButton,
  Select,
  Text,
  TextField,
} from '@radix-ui/themes'
import { FaRegEdit } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import type { SessionTimeType } from '@/types'
import { updateSessionTime } from '@/api/SessionTime'

interface Props {
  data: SessionTimeType
}

const formatDateForInput = (dateString: string | undefined) => {
  if (!dateString) return ''
  return dateString.split('T')[0]
}

const SessionTimeUpdate = ({ data }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<SessionTimeType>({
    defaultValues: {
      shift: data.shift,
      firstSessionStartTime: formatDateForInput(data.firstSessionStartTime),
      firstSessionEndTime: formatDateForInput(data.firstSessionEndTime),
      secondSessionStartTime: formatDateForInput(data.secondSessionStartTime),
      secondSessionEndTime: formatDateForInput(data.secondSessionEndTime),
      description: data.description,
      isActive: data.isActive,
    },
  })

  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const toMinutes = (timeStr: string | undefined) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

  const mutation = useMutation({
    mutationFn: (formData: SessionTimeType) =>
      updateSessionTime(Number(data.id), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session_times'] })
      toast.success('កែប្រែជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error('កែប្រែមិនជោគជ័យ')
    },
  })

  const onSubmit = (formData: SessionTimeType) => {
    mutation.mutate(formData)
  }

  useEffect(() => {
    if (open) {
      reset({
        shift: data.shift,
        firstSessionStartTime: formatDateForInput(data.firstSessionStartTime),
        firstSessionEndTime: formatDateForInput(data.firstSessionEndTime),
        secondSessionStartTime: formatDateForInput(data.secondSessionStartTime),
        secondSessionEndTime: formatDateForInput(data.secondSessionEndTime),
        description: data.description,
        isActive: data.isActive,
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
          <Flex direction="column" gap="4">

            {/* 1. Shift Selection (Enum) */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">វេនសិក្សា (Shift)</Text>
              <Controller
                control={control}
                name="shift"
                rules={{ required: 'សូមជ្រើសរើសវេនសិក្សា' }}
                render={({ field }) => (
                  <Select.Root onValueChange={field.onChange} value={field.value}>
                    <Select.Trigger placeholder="ជ្រើសរើសវេន..." style={{ width: '100%' }} />
                    <Select.Content>
                      <Select.Item value="morning">Morning (ព្រឹក)</Select.Item>
                      <Select.Item value="evening">Evening (រសៀល)</Select.Item>
                      <Select.Item value="night">Night (យប់)</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.shift && <Text size="1" color="red">{errors.shift.message}</Text>}
            </label>

            {/* 2. Session 1 Times with Validation */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <Text size="2" weight="bold" mb="2" color="blue">ម៉ោងសិក្សាទី ១</Text>
              <Grid columns="2" gap="3">
                <label>
                  <Text as="div" size="1" mb="1">ម៉ោងចាប់ផ្ដើម</Text>
                  <TextField.Root
                    type="time"
                    {...register('firstSessionStartTime', { required: 'តម្រូវឱ្យបញ្ចូល' })}
                  />
                  {errors.firstSessionStartTime && <Text size="1" color="red">{errors.firstSessionStartTime.message}</Text>}
                </label>
                <label>
                  <Text as="div" size="1" mb="1">ម៉ោងបញ្ចប់</Text>
                  <TextField.Root
                    type="time"
                    {...register('firstSessionEndTime', {
                      required: 'តម្រូវឱ្យបញ្ចូល',
                      validate: (val) => toMinutes(val) > toMinutes(getValues('firstSessionStartTime')) || 'ម៉ោងបញ្ចប់ត្រូវតែធំជាងម៉ោងចាប់ផ្ដើម'
                    })}
                  />
                  {errors.firstSessionEndTime && <Text size="1" color="red">{errors.firstSessionEndTime.message}</Text>}
                </label>
              </Grid>
            </fieldset>

            {/* 3. Session 2 Times with Validation */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <Text size="2" weight="bold" mb="2" color="blue">ម៉ោងសិក្សាទី ២</Text>
              <Grid columns="2" gap="3">
                <label>
                  <Text as="div" size="1" mb="1">ម៉ោងចាប់ផ្ដើម</Text>
                  <TextField.Root
                    type="time"
                    {...register('secondSessionStartTime', {
                      required: 'តម្រូវឱ្យបញ្ចូល',
                      validate: (val) => toMinutes(val) > toMinutes(getValues('firstSessionEndTime')) || 'ត្រូវចាប់ផ្ដើមក្រោយវេនទី ១ បញ្ចប់'
                    })}
                  />
                  {errors.secondSessionStartTime && <Text size="1" color="red">{errors.secondSessionStartTime.message}</Text>}
                </label>
                <label>
                  <Text as="div" size="1" mb="1">ម៉ោងបញ្ចប់</Text>
                  <TextField.Root
                    type="time"
                    {...register('secondSessionEndTime', {
                      required: 'តម្រូវឱ្យបញ្ចូល',
                      validate: (val) => toMinutes(val) > toMinutes(getValues('secondSessionStartTime')) || 'ម៉ោងបញ្ចប់ត្រូវតែធំជាងម៉ោងចាប់ផ្ដើម'
                    })}
                  />
                  {errors.secondSessionEndTime && <Text size="1" color="red">{errors.secondSessionEndTime.message}</Text>}
                </label>
              </Grid>
            </fieldset>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">ការពិពណ៌នា</Text>
              <TextField.Root {...register('description')} placeholder="ផ្សេងៗ..." />
            </label>
          </Flex>

          <Flex gap="3" mt="5" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">ចាកចេញ</Button>
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