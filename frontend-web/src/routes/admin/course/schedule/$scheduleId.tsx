import {
  BodyTable,
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import { useAcademicStore } from '@/stores/useAcademicStore'
import { getScheduleById } from '@/api/SchedulesAPI'
import UpcomingOverrides from '../../schedule/-actions/UpcomingOverrides'
import {
  Button,
  Flex,
  Text,
  Spinner,
  Badge,
  Box,
  Card,
  Separator,
} from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  FaArrowLeft,
  FaEdit,
  FaFileExport,
  FaPrint,
  FaChalkboardTeacher,
  FaDoorOpen,
} from 'react-icons/fa'

export const Route = createFileRoute('/admin/course/schedule/$scheduleId')({
  component: RouteComponent,
})

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

  // រៀបចំ Grouping courses by day
  const coursesByDay = schedule.courses?.reduce((acc: any, course: any) => {
    const dayKey = course.day.toLowerCase()
    if (!acc[dayKey]) acc[dayKey] = []
    acc[dayKey].push(course)
    return acc
  }, {})

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6 print:p-0">
      {/* Header Actions - លាក់នៅពេល Print */}
      <Flex justify="between" align="center" className="print:hidden">
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
            {/* <Text
              size="1"
              color="gray"
              className="block uppercase tracking-widest font-mono"
            >
              ID: {scheduleId}
            </Text> */}
          </Box>
        </Flex>
        <Flex gap="2">
          <Button variant="soft" color="gray">
            <FaFileExport /> Export Excel
          </Button>
          <Button variant="soft" onClick={() => window.print()}>
            <FaPrint /> បោះពុម្ភ
          </Button>
        </Flex>
      </Flex>

      {/* Schedule Info Card */}
      <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-3xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <FaChalkboardTeacher size={120} />
        </div>

        <Flex direction="column" gap="2" className="relative z-10">
          <Badge variant="surface" color="blue" size="2" className="w-fit mb-2">
            {selectedYearName}
          </Badge>
          <Text size="7" weight="bold" className="tracking-tight">
            កាលវិភាគសិក្សា {schedule.academicLevel?.level || 'បរិញ្ញាបត្រ'}
          </Text>
          <Flex gap="4" align="center" className="text-blue-100 text-sm">
            <Text weight="medium">ជំនាន់ទី {schedule.generation}</Text>
            <Text>•</Text>
            <Text>
              ឆ្នាំទី {schedule.year} ឆមាស {schedule.semester}
            </Text>
            <Text>•</Text>
            <Badge
              color="blue"
              variant="surface"
              className="uppercase font-bold tracking-tighter"
            >
              {schedule.studyShift === 'morning' ? 'វេនព្រឹក' : 'វេនយប់'}
            </Badge>
          </Flex>
          <Flex
            gap="5"
            mt="4"
            className="bg-white/10 p-3 rounded-xl w-fit border border-white/20"
          >
            <Flex align="center" gap="2">
              <FaDoorOpen size={14} /> បន្ទប់៖{' '}
              {schedule.classroom?.name || 'TBA'}
            </Flex>
            <Flex align="center" gap="2">
              📍 អាគារ៖ {schedule.classroom?.building?.name || 'AU'}
            </Flex>
          </Flex>
        </Flex>
      </Card>

      <UpcomingOverrides scheduleId={Number(scheduleId)} />

      {/* Timetable Table Grid */}
      <RootTable>
        <HeaderTable>
          <RowTable isHeader>
            <CellTable
              isHeader
              className="w-32 bg-gray-50 text-center font-bold text-gray-500 uppercase text-[10px] tracking-widest"
            >
              ម៉ោងសិក្សា
            </CellTable>
            {DAYS_OF_WEEK.map((day) => (
              <CellTable
                key={day.key}
                isHeader
                className="min-w-[180px] text-center bg-gray-50 border-l border-gray-200/50 py-4"
              >
                <Text size="3" weight="bold" color="indigo">
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
          {/* បង្ហាញ Session តាមរយៈ Map មុខវិជ្ជា */}
          <RowTable>
            <CellTable className="bg-gray-50/50 text-center border-r border-gray-100">
              <Box py="4">
                <Text
                  weight="bold"
                  color="blue"
                  size="2"
                  className="block uppercase tracking-wider"
                >
                  ម៉ោងទី ១
                </Text>
                <Text size="1" color="gray" className="font-mono">
                  {schedule.courses?.[0]?.sessionTime?.firstSessionStartTime ||
                    '06:00 PM'}
                </Text>
                <Separator size="1" my="2" className="mx-auto w-8" />
                <Text size="1" color="gray" className="font-mono">
                  {schedule.courses?.[0]?.sessionTime?.firstSessionEndTime ||
                    '07:30 PM'}
                </Text>
              </Box>
            </CellTable>

            {DAYS_OF_WEEK.map((day) => {
              const dayCourses = coursesByDay?.[day.key] || []
              const course = dayCourses[0] // យកមុខវិជ្ជាទី១ ក្នុងថ្ងៃនោះ

              return (
                <CellTable
                  key={day.key}
                  className="p-4 align-top border-l border-gray-100 group transition-colors hover:bg-blue-50/30"
                >
                  {course ? (
                    <Flex direction="column" gap="3" className="h-full">
                      <Box>
                        <Text
                          weight="bold"
                          size="3"
                          className="text-slate-800 leading-tight block mb-1 group-hover:text-blue-600 transition-colors"
                        >
                          {course.name}
                        </Text>
                        <Badge
                          size="1"
                          color="blue"
                          variant="surface"
                          className="font-mono opacity-100"
                        >
                          {course.phone}
                        </Badge>
                      </Box>

                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <Flex
                          align="center"
                          gap="2"
                          className="text-[11px] text-gray-500"
                        >
                          <Box className="p-1 bg-blue-100 text-blue-600 rounded-md">
                            <FaChalkboardTeacher size={10} />
                          </Box>
                          <span className="text-[14px] font-semibold text-slate-600">
                            {course.teacher?.name || 'គ្រូឧទ្ទេស'}
                          </span>
                        </Flex>
                      </div>
                    </Flex>
                  ) : (
                    <Flex
                      align="center"
                      justify="center"
                      className="h-32 opacity-20 italic"
                    >
                      <Text size="1">-</Text>
                    </Flex>
                  )}
                </CellTable>
              )
            })}
          </RowTable>
        </BodyTable>
      </RootTable>

      {/* Footer Disclaimer */}
      <Flex justify="center" p="4" className="text-gray-400 text-[10px]">
        <Text>
          បញ្ជាក់៖ កាលវិភាគនេះត្រូវបានធ្វើបច្ចុប្បន្នភាពចុងក្រោយនៅថ្ងៃទី{' '}
          {schedule.updatedAt
            ? new Date(schedule.updatedAt).toLocaleDateString('kh-KH')
            : 'N/A'}
        </Text>
      </Flex>
    </div>
  )
}
