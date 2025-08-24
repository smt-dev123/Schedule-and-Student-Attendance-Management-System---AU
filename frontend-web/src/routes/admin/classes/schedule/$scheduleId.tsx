import {
  BodyTable,
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import { Button, Flex, Table, Text } from '@radix-ui/themes'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { FaArrowLeft } from 'react-icons/fa'

export const Route = createFileRoute('/admin/classes/schedule/$scheduleId')({
  component: RouteComponent,
})

type Schedule = {
  id: string
  subject_id: string
  teacher: string
  sessionId?: string
  time?: string
  day?: string
}

function RouteComponent() {
  const router = useRouter()
  const data: Schedule[] = [
    {
      id: '1',
      subject_id: 'Web Design (HTML and CSS)',
      teacher: 'ល. សឿង លីម 061 227 933',
      sessionId: '1',
      time: '6:00pm - 7:30pm',
      day: 'monday',
    },
    {
      id: '2',
      subject_id: 'Foundation in IT',
      teacher: 'ល. ចាន់សែន សំណាង 086 70 80 90',
      sessionId: '1',
      time: '6:00pm - 7:30pm',
      day: 'tuesday',
    },
    {
      id: '3',
      subject_id: 'Web Design (HTML and CSS)',
      teacher: 'ល. សឿង លីម 061 227 933',
      sessionId: '1',
      time: '6:00pm - 7:30pm',
      day: 'wednesday',
    },
    {
      id: '4',
      subject_id: 'Foundation in IT',
      teacher: 'ល. ចាន់សែន សំណាង 086 70 80 90',
      sessionId: '1',
      time: '6:00pm - 7:30pm',
      day: 'thursday',
    },
    {
      id: '5',
      subject_id: 'Foundation in IT',
      teacher: 'ល. ចាន់សែន សំណាង 086 70 80 90',
      sessionId: '1',
      time: '6:00pm - 7:30pm',
      day: 'friday',
    },
    {
      id: '1',
      subject_id: 'Web Design (HTML and CSS)',
      teacher: 'ល. សឿង លីម 061 227 933',
      sessionId: '2',
      time: '7:45pm - 9:15pm',
      day: 'monday',
    },
    {
      id: '2',
      subject_id: 'Foundation in IT',
      teacher: 'ល. ចាន់សែន សំណាង 086 70 80 90',
      sessionId: '2',
      time: '7:45pm - 9:15pm',
      day: 'tuesday',
    },
    {
      id: '3',
      subject_id: 'Web Design (HTML and CSS)',
      teacher: 'ល. សឿង លីម 061 227 933',
      sessionId: '2',
      time: '7:45pm - 9:15pm',
      day: 'wednesday',
    },
    {
      id: '4',
      subject_id: 'Foundation in IT',
      teacher: 'ល. ចាន់សែន សំណាង 086 70 80 90',
      sessionId: '2',
      time: '7:45pm - 9:15pm',
      day: 'thursday',
    },
    {
      id: '5',
      subject_id: 'Foundation in IT',
      teacher: 'ល. ចាន់សែន សំណាង 086 70 80 90',
      sessionId: '2',
      time: '7:45pm - 9:15pm',
      day: 'friday',
    },
  ]

  // Group data by sessionId and time for easier rendering
  const sessions = Array.from(
    new Set(data.map((item) => `${item.sessionId}|${item.time}`)),
  ).map((session) => {
    const [sessionId, time] = session.split('|')
    return { sessionId, time, days: {} as Record<string, Schedule | undefined> }
  })

  data.forEach((item) => {
    const session = sessions.find(
      (s) => s.sessionId === item.sessionId && s.time === item.time,
    )
    if (session && item.day) {
      session.days[item.day.toLowerCase()] = item
    }
  })

  return (
    <div className="mx-auto">
      <Flex direction="column" gap="4">
        {/*  */}
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
            {/* Export */}
            <Button variant="outline" style={{ cursor: 'pointer' }}>
              Export Excel
            </Button>
            <Button variant="outline" style={{ cursor: 'pointer' }}>
              បោះពុម្ភ
            </Button>

            <Button variant="solid" style={{ cursor: 'pointer' }}>
              កែប្រែកាលវិភាគ
            </Button>
          </Flex>
        </Flex>
        <Flex direction="column" gap="2" className="text-center mb-4 font-bold">
          <Text>កាលវិភាគសិក្សាថ្នាក់បរិញ្ញាបត្រ</Text>
          <Text>ជំនាន់ទី១៩ ឆ្នាំទី៤ ឆមាស១ ឆ្នាំសិក្សា២០២៥-២០២៦</Text>
          <Text>មុខជំនាញ៖ វិទ្យាសាស្រ្ដកុំព្យូទ័រ</Text>
          <Text>
            ចាប់ផ្ដើមពីថ្ងៃទី២១ ខែកក្ដដា ឆ្នាំ២០២៥ បញ្ចប់ត្រឹម ថ្ងៃទី២៩
            ខែវិច្ឆិកា ឆ្នាំ២០២៥
          </Text>
          <Text>
            វេនសិក្សា៖ ពេលយប់ បន្ទប់៖ ស្រុកកងមាស (អគារ អ្នកឧកញ៉ា បណ្ឌិត សៀង ណាំ
            ជាន់ទី១)
          </Text>
        </Flex>
      </Flex>
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
          {sessions.map((session, idx) => (
            <Table.Row key={idx}>
              <CellTable>
                {session.sessionId} <br /> {session.time}
              </CellTable>
              {[
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
              ].map((day) => (
                <CellTable key={day}>
                  {session.days[day] ? (
                    <div className="text-sm">
                      <div className="font-bold">
                        {session.days[day]?.subject_id}
                      </div>
                      <div>{session.days[day]?.teacher}</div>
                    </div>
                  ) : (
                    '-'
                  )}
                </CellTable>
              ))}
            </Table.Row>
          ))}
        </BodyTable>
      </RootTable>
    </div>
  )
}
