import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Button, Flex, Select, Text, TextField } from '@radix-ui/themes'
import toast from 'react-hot-toast'
import { FaArrowLeft } from 'react-icons/fa'
import React from 'react'

export const Route = createFileRoute(
  '/admin/classes/schedule/$scheduleId/edit',
)({
  component: EditSchedulePage,
})

type Teacher = {
  id: number
  name: string
}

type Course = {
  id: number
  name: string
  day: string
  teacherId: number
}

type Schedule = {
  id: string
  classroomId: number
  sessionTimeId: number
  studyShift: string
  courses: Course[]
}

function EditSchedulePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { scheduleId } = Route.useParams()

  // Fetch schedule data
  const { data, isLoading } = useQuery({
    queryKey: ['schedule', scheduleId],
    queryFn: async () => {
      const res = await api.get(`http://localhost:5000/schedules/${scheduleId}`)
      return res.data as Schedule
    },
  })

  // Fetch all teachers
  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await api.get('http://localhost:5000/teachers')
      return res.data as Teacher[]
    },
  })

  const { control, handleSubmit, reset } = useForm<Schedule>({
    defaultValues: {
      studyShift: '',
      courses: [],
    },
  })

  // Set default form values when data is fetched
  React.useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  // Update mutation
  const mutation = useMutation({
    mutationFn: async (updated: Schedule) => {
      return api.put(`http://localhost:5000/schedules/${scheduleId}`, updated)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      toast.success('កែប្រែកាលវិភាគជោគជ័យ!')
      router.history.back()
    },
    onError: () => {
      toast.error('កែប្រែកាលវិភាគបរាជ័យ!')
    },
  })

  const onSubmit = (formData: Schedule) => {
    mutation.mutate(formData)
  }

  if (isLoading) return <Text>Loading...</Text>

  return (
    <div className="mx-auto max-w-4xl">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex align="center" justify="between">
          <Flex gap="2" align="center">
            <button
              onClick={() => router.history.back()}
              className="cursor-pointer hover:text-xl transition-all"
            >
              <FaArrowLeft />
            </button>
            <Text size="5" className="font-bold">
              កែប្រែកាលវិភាគ
            </Text>
          </Flex>
        </Flex>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <Flex gap="2">
              <Controller
                name="studyShift"
                control={control}
                render={({ field }) => (
                  <Flex direction="column" gap="1" className="w-full">
                    <Text>វេនសិក្សា</Text>
                    <Select.Root
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger placeholder="ជ្រើសរើសវេនសិក្សា" />
                      <Select.Content>
                        <Select.Item value="MORNING">ពេលព្រឹក</Select.Item>
                        <Select.Item value="EVENING">ពេលល្ងាច</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                )}
              />
            </Flex>

            <Flex direction="column" gap="3">
              <Text className="font-bold">មុខវិជ្ជា / ថ្ងៃសិក្សា</Text>
              <Controller
                name="courses"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    {field.value.map((course, index) => (
                      <Flex
                        key={index}
                        gap="3"
                        align="center"
                        className="border p-2 rounded-lg"
                      >
                        <TextField.Root
                          value={course.name}
                          onChange={(e) =>
                            field.onChange(
                              field.value.map((c, i) =>
                                i === index
                                  ? { ...c, name: e.target.value }
                                  : c,
                              ),
                            )
                          }
                          placeholder="ឈ្មោះមុខវិជ្ជា"
                        />
                        <Select.Root
                          value={course.day}
                          onValueChange={(val) =>
                            field.onChange(
                              field.value.map((c, i) =>
                                i === index ? { ...c, day: val } : c,
                              ),
                            )
                          }
                        >
                          <Select.Trigger placeholder="ថ្ងៃសិក្សា" />
                          <Select.Content>
                            <Select.Item value="MONDAY">ចន្ទ</Select.Item>
                            <Select.Item value="TUESDAY">អង្គារ</Select.Item>
                            <Select.Item value="WEDNESDAY">ពុធ</Select.Item>
                            <Select.Item value="THURSDAY">
                              ព្រហស្បតិ៍
                            </Select.Item>
                            <Select.Item value="FRIDAY">សុក្រ</Select.Item>
                            <Select.Item value="SATURDAY">សៅរ៍</Select.Item>
                          </Select.Content>
                        </Select.Root>

                        <Select.Root
                          value={String(course.teacherId)}
                          onValueChange={(val) =>
                            field.onChange(
                              field.value.map((c, i) =>
                                i === index
                                  ? { ...c, teacherId: Number(val) }
                                  : c,
                              ),
                            )
                          }
                        >
                          <Select.Trigger placeholder="គ្រូបង្រៀន" />
                          <Select.Content>
                            {teachers?.map((t) => (
                              <Select.Item key={t.id} value={String(t.id)}>
                                {t.name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </Flex>
                    ))}
                  </div>
                )}
              />
            </Flex>

            <Flex justify="end" gap="2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.history.back()}
              >
                បោះបង់
              </Button>
              <Button type="submit" variant="solid">
                រក្សាទុក
              </Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </div>
  )
}
