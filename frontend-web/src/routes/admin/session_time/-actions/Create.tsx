import { useState } from 'react'
import { Button, Dialog, Flex, Text, TextField, Grid, Select } from '@radix-ui/themes'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { SessionTimeType } from '@/types'
import { createSessionTime } from '@/api/SessionTime'

// Helper function សម្រាប់បំប្លែងម៉ោងទៅជាលេខនាទីដើម្បីប្រៀបធៀប
const toMinutes = (timeStr: string | undefined) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const SessionTimeCreate = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<SessionTimeType>()

  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: (formData: SessionTimeType) => createSessionTime(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session_times'] })
      toast.success('បង្កើតជោគជ័យ')
      setOpen(false)
      reset()
    },
    onError: (error: any) => {
      const serverMsg = error.response?.data?.message || 'បង្កើតមិនជោគជ័យ';
      toast.error(serverMsg);
    },
  })

  // const onSubmit = (formData: SessionTimeType) => {
  //   // បន្ថែម :00 ប្រសិនបើ Backend តម្រូវការ format HH:mm:ss
  //   const payload = {
  //     ...formData,
  //     firstSessionStartTime: `${formData.firstSessionStartTime}:00`,
  //     firstSessionEndTime: `${formData.firstSessionEndTime}:00`,
  //     secondSessionStartTime: `${formData.secondSessionStartTime}:00`,
  //     secondSessionEndTime: `${formData.secondSessionEndTime}:00`,
  //   };
  //   mutation.mutate(payload)
  // }

  const onSubmit = (formData: SessionTimeType) => {
    // បង្កើត Object ថ្មីដោយបំប្លែងម៉ោងឲ្យមានវិនាទី (:00) ដើម្បីតម្រូវតាម Backend
    const payload = {
      ...formData,
      // ប្រសិនបើ formData មានវិនាទីហើយ វានឹងមិនបូកថែមទេ (ការពារ error ជាន់គ្នា)
      firstSessionStartTime: formData.firstSessionStartTime.includes(':') && formData.firstSessionStartTime.split(':').length === 2
        ? `${formData.firstSessionStartTime}:00`
        : formData.firstSessionStartTime,

      firstSessionEndTime: formData.firstSessionEndTime.includes(':') && formData.firstSessionEndTime.split(':').length === 2
        ? `${formData.firstSessionEndTime}:00`
        : formData.firstSessionEndTime,

      secondSessionStartTime: formData.secondSessionStartTime.includes(':') && formData.secondSessionStartTime.split(':').length === 2
        ? `${formData.secondSessionStartTime}:00`
        : formData.secondSessionStartTime,

      secondSessionEndTime: formData.secondSessionEndTime.includes(':') && formData.secondSessionEndTime.split(':').length === 2
        ? `${formData.secondSessionEndTime}:00`
        : formData.secondSessionEndTime,
    };

    console.log("Payload to Server:", payload); // ពិនិត្យមើល Payload មុនផ្ញើ
    mutation.mutate(payload);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="solid" style={{ cursor: 'pointer' }}>
          បន្ថែមម៉ោងសិក្សា
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="500px">
        <Dialog.Title>បន្ថែមម៉ោងសិក្សា</Dialog.Title>

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

export default SessionTimeCreate