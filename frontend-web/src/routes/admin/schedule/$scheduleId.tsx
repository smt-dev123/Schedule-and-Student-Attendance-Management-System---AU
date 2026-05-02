import {
  BodyTable,
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import { useAcademicStore } from '@/stores/useAcademicStore'
import { getScheduleById } from '@/api/SchedulesAPI'
import UpcomingOverrides from './-actions/UpcomingOverrides'
import OverrideCreate from './-actions/OverrideCreate'
import { Button, Flex, Text, Spinner, Badge, Box, Card } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  FaArrowLeft,
  FaFileExport,
  FaPrint,
  FaChalkboardTeacher,
  FaDoorOpen,
} from 'react-icons/fa'

export const Route = createFileRoute('/admin/schedule/$scheduleId')({
  component: RouteComponent,
})

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'ចន្ទ' },
  { key: 'tuesday', label: 'អង្គារ' },
  { key: 'wednesday', label: 'ពុធ' },
  { key: 'thursday', label: 'ព្រហស្បតិ៍' },
  { key: 'friday', label: 'សុក្រ' },
  { key: 'saturday', label: 'សៅរ៍' },
  { key: 'sunday', label: 'អាទិត្យ' },
]

function RouteComponent() {
  const router = useRouter()
  const { scheduleId } = Route.useParams()
  const { selectedYearName } = useAcademicStore()

  const {
    data: res,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['schedule', scheduleId],
    queryFn: () => getScheduleById(Number(scheduleId)),
  })

  const schedule = res || null

  if (isLoading)
    return (
      <Flex justify="center" align="center" className="h-[60vh]">
        <Spinner size="3" />
        <Text ml="3" color="gray">
          កំពុងទាញយកកាលវិភាគ...
        </Text>
      </Flex>
    )

  if (error || !schedule)
    return (
      <Flex justify="center" p="9">
        <Text color="red" weight="bold" size="5">
          មិនអាចរកឃើញកាលវិភាគនេះទេ!
        </Text>
      </Flex>
    )

  const coursesByDay =
    schedule.courses?.reduce((acc: any, course: any) => {
      const dayKey = course.day.toLowerCase()
      if (!acc[dayKey]) acc[dayKey] = []
      acc[dayKey].push(course)
      return acc
    }, {}) || {}

  return (
    <div className="space-y-6 print:p-0">
      <Flex
        direction={{ initial: 'column', sm: 'row' }}
        justify="between"
        align={{ initial: 'start', sm: 'center' }}
        gap="4"
        className="print:hidden"
      >
        <Flex gap="3" align="center">
          <button
            onClick={() => router.history.back()}
            className="cursor-pointer hover:bg-gray-200 transition-colors p-2.5 bg-gray-100 rounded-full"
          >
            <FaArrowLeft size={14} />
          </button>
          <Box>
            <Text size="5" weight="bold">
              កាលវិភាគសិក្សា
            </Text>
          </Box>
        </Flex>
        <Flex gap="2" wrap="wrap">
          <Button variant="soft" color="gray">
            <FaFileExport />{' '}
            <span className="hidden md:inline">Export Excel</span>
          </Button>
          <Button variant="soft" onClick={() => window.print()}>
            <FaPrint /> <span className="hidden md:inline">បោះពុម្ភ</span>
          </Button>

          <OverrideCreate scheduleId={Number(scheduleId)} />
        </Flex>
      </Flex>

      {/* Schedule Info Card */}
      <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-800 dark:to-indigo-900 p-6 md:p-8 rounded-3xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
          <FaChalkboardTeacher size={120} />
        </div>
        <Flex direction="column" gap="2" className="relative z-10">
          <Badge variant="surface" color="blue" size="2" className="w-fit mb-2">
            {selectedYearName}
          </Badge>
          <Text
            size={{ initial: '5', md: '7' }}
            weight="bold"
            className="tracking-tight"
          >
            កាលវិភាគសិក្សា {schedule.academicLevel?.level || 'បរិញ្ញាបត្រ'}
          </Text>
          <Flex
            gap="4"
            align="center"
            wrap="wrap"
            className="text-blue-100 text-sm"
          >
            <Text weight="medium">ជំនាន់ទី {schedule.generation}</Text>
            <Text className="hidden sm:inline">•</Text>
            <Text>
              ឆ្នាំទី {schedule.year} ឆមាស {schedule.semester}
            </Text>
            <Text className="hidden sm:inline">•</Text>
            <Badge
              color="blue"
              variant="surface"
              className="uppercase font-bold"
            >
              {schedule.studyShift === 'morning' ? 'វេនព្រឹក' : 'វេនយប់'}
            </Badge>
          </Flex>
          <Flex
            gap="4"
            mt="4"
            wrap="wrap"
            className="bg-white/10 p-3 rounded-xl w-fit border border-white/20"
          >
            <Flex align="center" gap="2" className="text-sm">
              <FaDoorOpen size={14} /> បន្ទប់៖{' '}
              {schedule.classroom?.name || 'TBA'}
            </Flex>
            <Flex align="center" gap="2" className="text-sm">
              📍 អាគារ៖ {schedule.classroom?.building?.name || 'AU'}
            </Flex>
          </Flex>
        </Flex>
      </Card>

      <UpcomingOverrides scheduleId={Number(scheduleId)} />

      {/* Timetable Table Grid with Responsive Scroll */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <div className="min-w-[1000px]">
          <RootTable>
            <HeaderTable>
              <RowTable isHeader>
                <CellTable
                  isHeader
                  className="w-32 bg-gray-50 text-center py-4 border-b"
                >
                  <Text size="2" weight="bold" color="indigo">
                    ម៉ោងសិក្សា
                  </Text>
                </CellTable>
                {DAYS_OF_WEEK.map((day) => (
                  <CellTable
                    key={day.key}
                    isHeader
                    className="text-center bg-gray-50 border-l border-b border-gray-200/50 py-4"
                  >
                    <Text size="2" weight="bold" color="indigo">
                      {day.label}
                    </Text>
                    <Text
                      size="1"
                      className="block text-gray-400 uppercase font-mono tracking-tighter"
                    >
                      {day.key}
                    </Text>
                  </CellTable>
                ))}
              </RowTable>
            </HeaderTable>

            <BodyTable>
              <RowTable>
                {/* Session Time Column */}
                <CellTable className="bg-gray-50/30 text-center border-r border-gray-100">
                  <Box py="4">
                    <Flex direction="column" gap="1">
                      <Text
                        size="2"
                        color="indigo"
                        weight="bold"
                        className="font-mono"
                      >
                        {schedule.sessionTime?.firstSessionStartTime} -{' '}
                        {schedule.sessionTime?.firstSessionEndTime}
                      </Text>
                      <div className="h-px bg-gray-200 w-8 mx-auto my-1" />
                      <Text
                        size="2"
                        color="indigo"
                        weight="bold"
                        className="font-mono"
                      >
                        {schedule.sessionTime?.secondSessionStartTime} -{' '}
                        {schedule.sessionTime?.secondSessionEndTime}
                      </Text>
                    </Flex>
                  </Box>
                </CellTable>

                {/* Courses Columns */}
                {DAYS_OF_WEEK.map((day) => {
                  const dayCourses = coursesByDay?.[day.key] || []
                  const course = dayCourses[0]

                  return (
                    <CellTable
                      key={day.key}
                      className="p-4 align-top border-l border-gray-100 group transition-colors hover:bg-blue-50/30 min-h-[140px]"
                    >
                      {course ? (
                        <Flex
                          direction="column"
                          justify="between"
                          className="h-full min-h-[100px]"
                        >
                          <Box>
                            <Text
                              weight="bold"
                              size="3"
                              className="text-slate-800 leading-snug block mb-1 group-hover:text-blue-600 dark:text-slate-200 transition-colors"
                            >
                              {course.name}
                            </Text>
                            <Badge
                              size="1"
                              color="indigo"
                              variant="surface"
                              className="font-mono"
                            >
                              {course.code}
                            </Badge>
                          </Box>

                          <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                            <Text
                              size="2"
                              className="font-semibold text-slate-600 block"
                            >
                              {course.teacher?.name || 'គ្រូឧទ្ទេស'}
                            </Text>
                            {course.teacher?.phone && (
                              <Text
                                size="1"
                                className="text-gray-500 font-mono italic"
                              >
                                {course.teacher.phone}
                              </Text>
                            )}
                          </div>
                        </Flex>
                      ) : (
                        <Flex
                          align="center"
                          justify="center"
                          className="h-full opacity-50 italic"
                        >
                          <Text size="1">គ្មានម៉ោង</Text>
                        </Flex>
                      )}
                    </CellTable>
                  )
                })}
              </RowTable>
            </BodyTable>
          </RootTable>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <Flex
        justify="center"
        p="4"
        className="text-gray-400 text-[11px] uppercase tracking-widest"
      >
        <Text>
          Updated:{' '}
          {schedule.updatedAt
            ? new Date(schedule.updatedAt).toLocaleDateString('kh-KH')
            : 'N/A'}
        </Text>
      </Flex>
    </div>
  )
}
