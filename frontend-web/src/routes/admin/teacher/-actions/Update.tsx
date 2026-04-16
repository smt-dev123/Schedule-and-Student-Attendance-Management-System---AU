import { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
  Grid,
  Box,
  IconButton,
} from '@radix-ui/themes'
import { FaRegEdit } from 'react-icons/fa'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { TeachersType } from '@/types'
import { getFaculties } from '@/api/FacultyAPI'
import { getAcademicLevels } from '@/api/AcademicLevelAPI'
import { updateTeachers } from '@/api/TeacherAPI'

interface Props {
  data: TeachersType
}

const TeacherUpdate = ({ data }: Props) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TeachersType>()

  // Fetch Options
  const { data: faculties = [] } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  })
  const { data: academicLevels = [] } = useQuery({
    queryKey: ['academicLevels'],
    queryFn: getAcademicLevels,
  })

  // Sync data to form when Dialog opens
  useEffect(() => {
    if (open && data) {
      reset({
        ...data,
        gender: data.gender || '',
        academicLevelId: data.academicLevelId,
        facultyId: data.facultyId,
      })
    }
  }, [open, data, reset])

  const mutation = useMutation({
    mutationFn: (formData: TeachersType) => updateTeachers(data.id!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('កែប្រែជោគជ័យ')
      setOpen(false)
    },
    onError: () => toast.error('កែប្រែមិនជោគជ័យ'),
  })

  const onSubmit = (formData: TeachersType) => {
    const payload = {
      ...formData,
      facultyId: Number(formData.facultyId),
      academicLevelId: Number(formData.academicLevelId),
    }
    mutation.mutate(payload)
  }

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

      <Dialog.Content maxWidth="600px">
        <Dialog.Title>កែប្រែព័ត៌មានគ្រូបង្រៀន</Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid columns="2" gap="4" mb="4">
            {/* ID */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                អត្តលេខគ្រូ (ID)
              </Text>
              <TextField.Root {...register('id')} disabled />
            </Box>

            {/* Name */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                គោត្តនាម-នាម
              </Text>
              <TextField.Root
                {...register('name', { required: 'ត្រូវបញ្ចូលឈ្មោះ' })}
              />
              {errors.name && (
                <Text size="2" color="red">
                  {errors.name.message}
                </Text>
              )}
            </Box>

            {/* Gender */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                ភេទ
              </Text>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger style={{ width: '100%' }} />
                    <Select.Content>
                      <Select.Item value="male">ប្រុស</Select.Item>
                      <Select.Item value="female">ស្រី</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </Box>

            {/* Email */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                អ៊ីម៉ែល
              </Text>
              <TextField.Root
                {...register('email', { required: 'ត្រូវបញ្ចូលអ៊ីម៉ែល' })}
              />
            </Box>

            {/* Phone */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                លេខទូរស័ព្ទ
              </Text>
              <TextField.Root {...register('phone')} />
            </Box>

            {/* Academic Level */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                កម្រិតសិក្សា
              </Text>
              <Controller
                name="academicLevelId"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger style={{ width: '100%' }} />
                    <Select.Content>
                      {academicLevels.map((level: any) => (
                        <Select.Item key={level.id} value={level.id.toString()}>
                          {level.level}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </Box>

            {/* Faculty */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                មហាវិទ្យាល័យ
              </Text>
              <Controller
                name="facultyId"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <Select.Trigger style={{ width: '100%' }} />
                    <Select.Content>
                      {faculties.map((f: any) => (
                        <Select.Item key={f.id} value={f.id.toString()}>
                          {f.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </Box>

            {/* Address */}
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">
                អាសយដ្ឋាន
              </Text>
              <TextField.Root {...register('address')} />
            </Box>
          </Grid>

          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                type="button"
                style={{ cursor: 'pointer' }}
              >
                ចាកចេញ
              </Button>
            </Dialog.Close>
            <Button
              type="submit"
              loading={mutation.isPending}
              style={{ cursor: 'pointer' }}
            >
              រក្សាទុកការផ្លាស់ប្តូរ
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default TeacherUpdate
