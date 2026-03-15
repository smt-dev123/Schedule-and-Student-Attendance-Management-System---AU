import {
  BodyTable,
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import api from '@/lib/axios'
import { Button, Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { FaArrowLeft } from 'react-icons/fa'

export const Route = createFileRoute('/admin/classes/schedule/$scheduleId/')({
  component: RouteComponent,
})

type Course = {
  id: number
  name: string
  code: string
  day: string
  teacher: { name: string }
  firstSessionNote: string
  secondSessionNote: string
}

type ScheduleData = {
  id: string
  classroom: { name: string }
  sessionTime: {
    firstSessionStartTime: string
    firstSessionEndTime: string
    secondSessionStartTime: string
    secondSessionEndTime: string
  }
  courses: Course[]
}

function RouteComponent() {
  const router = useRouter()

  const { data, isLoading, error } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await api.get('http://localhost:5000/schedules')
      return res.data as ScheduleData[]
    },
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text color="red">Failed to load schedule</Text>

  const schedule = data?.[0]
  if (!schedule) return <Text>No schedule found</Text>

  // Map courses by day for easier lookup
  const coursesByDay = schedule.courses.reduce<Record<string, Course>>(
    (acc, course) => {
      acc[course.day.toLowerCase()] = course
      return acc
    },
    {},
  )

  const sessions = [
    {
      id: 1,
      time: `${schedule.sessionTime.firstSessionStartTime} - ${schedule.sessionTime.firstSessionEndTime}`,
      note: 'Session 1',
    },
    {
      id: 2,
      time: `${schedule.sessionTime.secondSessionStartTime} - ${schedule.sessionTime.secondSessionEndTime}`,
      note: 'Session 2',
    },
  ]

  return (
    <div className="mx-auto">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex direction="row" justify="between">
          <Flex gap="2" align="center">
            <button
              onClick={() => router.history.back()}
              className="cursor-pointer hover:text-xl transition-all"
            >
              <FaArrowLeft />
            </button>
            <Text size="5" className="font-bold">
              កាលវិភាគសិក្សា
            </Text>
          </Flex>
          <Flex gap="2">
            <Button variant="outline">Export Excel</Button>
            <Button variant="outline">បោះពុម្ភ</Button>

            <Button variant="solid" asChild>
              <Link
                to="/admin/classes/schedule/$scheduleId/edit"
                params={Number(schedule.id)}
              >
                កែប្រែកាលវិភាគ
              </Link>
            </Button>
          </Flex>
        </Flex>

        {/* Schedule Info */}
        <Flex direction="column" gap="2" className="text-center mb-4 font-bold">
          <Text>កាលវិភាគសិក្សាថ្នាក់បរិញ្ញាបត្រ</Text>
          <Text>ជំនាន់ទី១៩ ឆ្នាំទី៤ ឆមាស១ ឆ្នាំសិក្សា២០២៥-២០២៦</Text>
          <Text>មុខជំនាញ៖ វិទ្យាសាស្រ្ដកុំព្យូទ័រ</Text>
          <Text>
            ចាប់ផ្ដើមពីថ្ងៃទី២១ ខែកក្ដដា ឆ្នាំ២០២៥ បញ្ចប់ត្រឹម ថ្ងៃទី២៩
            ខែវិច្ឆិកា ឆ្នាំ២០២៥
          </Text>
          <Text>
            វេនសិក្សា៖ ពេល
            {schedule.sessionTime?.shift?.toLowerCase() === 'morning'
              ? 'ព្រឹក'
              : 'យប់'}{' '}
            បន្ទប់៖ {schedule.classroom?.name}
          </Text>
        </Flex>
      </Flex>

      {/* Schedule Table */}
      <RootTable>
        <HeaderTable>
          <RowTable isHeader>
            <CellTable isHeader>ពេលវេលា / Sessions</CellTable>
            <CellTable isHeader>ចន្ទ</CellTable>
            <CellTable isHeader>អង្គារ</CellTable>
            <CellTable isHeader>ពុធ</CellTable>
            <CellTable isHeader>ព្រហស្បតិ៍</CellTable>
            <CellTable isHeader>សុក្រ</CellTable>
            <CellTable isHeader noRightBorder>
              សៅរ៍
            </CellTable>
          </RowTable>
        </HeaderTable>

        <BodyTable>
          {sessions.map((session) => (
            <RowTable key={session.id}>
              <CellTable>
                <div className="font-bold">{session.note}</div>
                <div>{session.time}</div>
              </CellTable>

              {[
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
              ].map((day) => {
                const course = coursesByDay[day]
                return (
                  <CellTable key={day}>
                    {course ? (
                      <div className="text-sm">
                        <div className="font-bold">{course.name}</div>
                        <div>{course.teacher?.name}</div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </CellTable>
                )
              })}
            </RowTable>
          ))}
        </BodyTable>
      </RootTable>
    </div>
  )
}
