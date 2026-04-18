import {
  BodyTable,
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import { Button, Flex, Text, Box, Heading } from '@radix-ui/themes'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { FaArrowLeft, FaPrint, FaFileExcel } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import AttendancePDF from './-exports/ExportPDF'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useQuery } from '@tanstack/react-query'
import { getCourseAttendanceReport } from '@/api/AttendanceAPI'

export const Route = createFileRoute(
  '/admin/course/attendance/report/$attendanceReportId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { attendanceReportId } = Route.useParams()
  const courseId = Number(attendanceReportId)

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['course_attendance_report', courseId],
    queryFn: () => getCourseAttendanceReport(courseId),
  })

  return (
    <Box className="p-4 md:p-10 max-w-[1300px] mx-auto rounded bg-white min-h-screen">
      {/* Action Buttons */}
      <Flex justify="between" align="center" mb="6" className="print:hidden">
        <Button
          variant="ghost"
          color="gray"
          onClick={() => router.history.back()}
          className="cursor-pointer"
        >
          <FaArrowLeft /> ត្រឡប់ក្រោយ
        </Button>
        <Flex gap="2">
          <Button variant="soft" color="green">
            <FaFileExcel /> Export Excel
          </Button>
          {isClient ? (
            <PDFDownloadLink
              document={<AttendancePDF students={students} />}
              fileName="attendance-report.pdf"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {({ loading }) => (loading ? 'កំពុងរៀបចំ...' : 'ទាញយកជា PDF')}
            </PDFDownloadLink>
          ) : (
            <Button
              disabled
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-not-allowed opacity-70"
            >
              កំពុងរៀបចំ...
            </Button>
          )}
          {/* <Button
            variant="solid"
            onClick={() => window.print()}
            className="cursor-pointer"
          >
            <FaPrint /> បោះពុម្ភរបាយការណ៍
          </Button> */}
        </Flex>
      </Flex>

      {/* Official Header */}
      <Box className="text-center space-y-2 mb-10">
        {/* <Heading size="4">ព្រះរាជាណាចក្រកម្ពុជា</Heading>
        <Heading size="3">ជាតិ សាសនា ព្រះមហាក្សត្រ</Heading> */}
        <Box className="py-4">
          <Text
            as="div"
            size="6"
            weight="bold"
            className="underline underline-offset-8 uppercase"
          >
            របាយការណ៍វត្តមាន និងពិន្ទុប្រចាំឆមាស
          </Text>
        </Box>
        <Box className="text-sm space-y-1 text-slate-600">
          <Text as="div">
            ឆ្នាំទី ៤ ឆមាស ១ | ជំនាញ៖ វិទ្យាសាស្រ្ដកុំព្យូទ័រ
          </Text>
          <Text as="div">
            មុខវិជ្ជា៖{' '}
            <span className="font-bold text-slate-900">Web Development</span>
          </Text>
        </Box>
      </Box>

      {/* Student Table */}
      <RootTable>
        <HeaderTable>
          <RowTable isHeader className="bg-slate-50 text-center">
            <CellTable className="w-12" isHeader>
              ល.រ
            </CellTable>
            <CellTable isHeader className="text-left min-w-[180px]">
              ឈ្មោះនិស្សិត
            </CellTable>
            <CellTable className="w-20" isHeader>
              ភេទ
            </CellTable>
            <CellTable className="w-40" isHeader>
              លេខទូរស័ព្ទ
            </CellTable>
            <CellTable className="w-24" isHeader>
              ស្ថានភាព
            </CellTable>
            <CellTable className="w-16" isHeader>
              ច្បាប់
            </CellTable>
            <CellTable className="w-16" isHeader>
              អវត្តមាន
            </CellTable>
            <CellTable className="w-16" isHeader>
              សរុប
            </CellTable>
            <CellTable className="w-20" isHeader>
              ភាគរយ
            </CellTable>
            <CellTable
              className="w-24 bg-blue-50 text-blue-700"
              isHeader
              noRightBorder
            >
              ពិន្ទុវត្តមាន
            </CellTable>
          </RowTable>
        </HeaderTable>

        <BodyTable>
          {isLoading ? (
            <RowTable>
              <CellTable columSpan={10} className="text-center py-10 text-gray-500">
                កំពុងទាញយកទិន្នន័យ...
              </CellTable>
            </RowTable>
          ) : students.length === 0 ? (
            <RowTable>
              <CellTable columSpan={10} className="text-center py-10 text-gray-500">
                មិនមានទិន្នន័យនិស្សិត
              </CellTable>
            </RowTable>
          ) : (
            students.map((student: any, index: number) => {
              const totalAbsent = student.leave + student.absent
              const attendanceRate =
                student.status === 'Dropped out'
                  ? '0%'
                  : `${Math.max(0, 100 - totalAbsent * 5)}%`

            return (
              <RowTable
                key={index}
                className={`text-center ${student.status === 'Dropped out' ? 'bg-red-50/30' : ''}`}
              >
                <CellTable>{index + 1}</CellTable>
                <CellTable className="text-left font-medium uppercase text-[13px]">
                  {student.name}
                </CellTable>
                <CellTable>{student.gender}</CellTable>
                <CellTable className="font-mono text-[12px]">
                  {student.phone}
                </CellTable>
                <CellTable>
                  <Text
                    size="1"
                    color={student.status === 'Enrolled' ? 'green' : 'red'}
                  >
                    {student.status}
                  </Text>
                </CellTable>
                <CellTable className="text-orange-600">
                  {student.leave}
                </CellTable>
                <CellTable className="text-red-600">{student.absent}</CellTable>
                <CellTable className="font-bold">{totalAbsent}</CellTable>
                <CellTable>{attendanceRate}</CellTable>
                <CellTable
                  className="bg-blue-50/20 font-bold text-blue-700"
                  noRightBorder
                >
                  {student.score}
                </CellTable>
              </RowTable>
            )
            })
          )}
        </BodyTable>
      </RootTable>

      {/* Note Section */}
      <Box mt="6" className="grid grid-cols-2 gap-8 items-start">
        <Box className="border border-slate-200 p-4 rounded-lg bg-slate-50/50">
          <Text as="div" size="2" weight="bold" mb="2" className="underline">
            សម្គាល់៖
          </Text>
          <ul className="list-disc list-inside text-[12px] text-slate-600 space-y-1">
            <li>
              ពិន្ទុវត្តមាន (Score) ត្រូវបានផ្អែកលើការមកសិក្សាទៀងទាត់
              និងសកម្មភាពក្នុងថ្នាក់។
            </li>
            <li>
              និស្សិតដែលបោះបង់ការសិក្សា (Dropped out) នឹងមិនមានពិន្ទុវត្តមានឡើយ។
            </li>
            <li>រាល់ការឈប់ដោយមានច្បាប់ត្រូវផ្ដល់ដំណឹងជាមុនដល់សាស្ត្រាចារ្យ។</li>
          </ul>
        </Box>

        {/* Signature Area */}
        <Flex justify="end" className="text-center pr-10 pt-4">
          <Box>
            <Text as="div" size="2" mb="1">
              ធ្វើនៅសៀមរាប, ថ្ងៃទី........ ខែ........ ឆ្នាំ ២០២...
            </Text>
            <Text as="div" size="3" weight="bold">
              សាស្ត្រាចារ្យទទួលបន្ទុក
            </Text>
            <Box mt="8" className="h-20" /> {/* Space for signature */}
            <Text as="div" size="3" weight="bold" className="underline">
              ល. សេង ស៊ង់
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
