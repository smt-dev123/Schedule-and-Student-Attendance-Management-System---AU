import {
  BodyTable,
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import api from '@/lib/axios'
import { Button, Flex, Text, Spinner, Badge } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { FaArrowLeft, FaEdit, FaFileExport, FaPrint } from 'react-icons/fa'

export const Route = createFileRoute('/admin/classes/schedule/$scheduleId/')({
  component: RouteComponent,
})

// Definition នៃ Days
const DAYS_OF_WEEK = [
  { key: 'monday', label: 'ចន្ទ' },
  { key: 'tuesday', label: 'អង្គារ' },
  { key: 'wednesday', label: 'ពុធ' },
  { key: 'thursday', label: 'ព្រហស្បតិ៍' },
  { key: 'friday', label: 'សុក្រ' },
  { key: 'saturday', label: 'សៅរ៍' },
]

function RouteComponent() {
  const router = useRouter()
  const { scheduleId } = Route.useParams() // ទាញ ID ពី URL

  // ទាញទិន្នន័យពី Backend
  const { data: schedule, isLoading, error } = useQuery({
    queryKey: ['schedule', scheduleId],
    queryFn: async () => {
      // កែ URL ឱ្យត្រូវនឹង Backend របស់អ្នក (ឧទាហរណ៍: /schedules/1)
      const res = await api.get(`/schedules/${scheduleId}`)
      return res.data
    },
  })

  if (isLoading) return (
    <Flex justify="center" align="center" py="9">
      <Spinner size="3" /> <Text ml="2">កំពុងទាញយកទិន្នន័យ...</Text>
    </Flex>
  )

  if (error || !schedule) return (
    <Flex justify="center" p="5">
      <Text color="red">មិនអាចទាញយកកាលវិភាគបានទេ ឬមិនមានទិន្នន័យ</Text>
    </Flex>
  )

  // រៀបចំមុខវិជ្ជាតាមថ្ងៃ (Group courses by day)
  const coursesByDay = schedule.courses?.reduce((acc: any, course: any) => {
    acc[course.day.toLowerCase()] = course
    return acc
  }, {})

  // រៀបចំ Sessions តាមទិន្នន័យពី Backend
  const sessions = [
    {
      label: 'Session 1',
      time: `${schedule.firstSessionStartTime || '00:00'} - ${schedule.firstSessionEndTime || '00:00'}`,
    },
    {
      label: 'Session 2',
      time: `${schedule.secondSessionStartTime || '00:00'} - ${schedule.secondSessionEndTime || '00:00'}`,
    },
  ]

  return (
    <div className="mx-auto p-4">
      <Flex direction="column" gap="4">
        {/* Header Actions */}
        <Flex direction="row" justify="between" align="center">
          <Flex gap="3" align="center">
            <button
              onClick={() => router.history.back()}
              className="cursor-pointer hover:scale-110 transition-transform p-2 bg-gray-100 rounded-full"
            >
              <FaArrowLeft />
            </button>
            <Text size="5" weight="bold">កាលវិភាគសិក្សា</Text>
          </Flex>
          <Flex gap="2">
            <Button variant="outline" color="gray"><FaFileExport /> Export</Button>
            <Button variant="outline" onClick={() => window.print()}><FaPrint /> បោះពុម្ភ</Button>
            <Button variant="solid" asChild>
              <Link to="/admin/classes/schedule/$scheduleId/edit" params={{ scheduleId: schedule.id }}>
                <FaEdit /> កែប្រែ
              </Link>
            </Button>
          </Flex>
        </Flex>

        {/* Schedule Info Card */}
        <Flex direction="column" gap="1" className="text-center mb-4 bg-blue-50 p-6 rounded-lg border-2 border-dashed border-blue-200">
          <Text size="5" weight="bold" color="indigo">កាលវិភាគសិក្សាថ្នាក់បរិញ្ញាបត្រ</Text>
          <Text weight="medium">
            ជំនាន់ទី{schedule.generation} ឆ្នាំទី{schedule.year} ឆមាស{schedule.semester} ឆ្នាំសិក្សា២០២៥-២០២៦
          </Text>
          <Text color="gray">វេនសិក្សា៖
            <Badge variant="soft" color="blue" ml="2">
              {schedule.studyShift === 'morning' ? 'ពេលព្រឹក' : 'ពេលយប់'}
            </Badge>
          </Text>
          <Text size="2">បន្ទប់៖ <span className="font-bold">{schedule.classroom?.name || 'មិនទាន់កំណត់'}</span></Text>
        </Flex>

        {/* Schedule Grid Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm border">
          <RootTable>
            <HeaderTable>
              <RowTable isHeader>
                <CellTable isHeader className="w-40 bg-gray-50">Sessions</CellTable>
                {DAYS_OF_WEEK.map((day) => (
                  <CellTable key={day.key} isHeader className="min-w-[150px]">
                    {day.label}
                  </CellTable>
                ))}
              </RowTable>
            </HeaderTable>

            <BodyTable>
              {sessions.map((session, sIdx) => (
                <RowTable key={sIdx}>
                  <CellTable className="bg-gray-50/50">
                    <Text weight="bold" size="2">{session.label}</Text>
                    <div className="text-[10px] text-gray-500">{session.time}</div>
                  </CellTable>

                  {DAYS_OF_WEEK.map((day) => {
                    const course = coursesByDay?.[day.key]
                    return (
                      <CellTable key={day.key} className="h-24 align-top">
                        {course ? (
                          <Flex direction="column" gap="1" align="start">
                            <Text weight="bold" size="2" className="text-blue-700 leading-tight">
                              {course.name}
                            </Text>
                            <Text size="1" color="gray">
                              ID: {course.code}
                            </Text>
                            <div className="mt-2 py-1 px-2 bg-blue-50 rounded text-[10px] w-full text-left">
                              👨‍🏫 {course.teacher?.name || 'TBA'}
                            </div>
                          </Flex>
                        ) : (
                          <Text color="gray" size="1" align="center">-</Text>
                        )}
                      </CellTable>
                    )
                  })}
                </RowTable>
              ))}
            </BodyTable>
          </RootTable>
        </div>
      </Flex>
    </div>
  )
}