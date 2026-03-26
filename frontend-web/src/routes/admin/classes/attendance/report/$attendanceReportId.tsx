import {
  BodyTable,
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import { Button, Flex, Text, Spinner, Badge } from '@radix-ui/themes'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { FaArrowLeft } from 'react-icons/fa'
import { useEffect, useState } from 'react'

export const Route = createFileRoute(
  '/admin/classes/attendance/report/$attendanceReportId',
)({
  component: RouteComponent,
})

// រៀបចំ Helper សម្រាប់បង្ហាញ Icon តាម Status
const renderStatus = (status: string) => {
  switch (status) {
    case 'present': return '⎷';
    case 'late': return 'L';
    case 'excused': return 'P'; // P = Permission (ច្បាប់)
    case 'absent': return 'A'; // A = Absent (អវត្តមាន)
    default: return '-';
  }
}

function RouteComponent() {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ១. ទាញយកទិន្នន័យ (ឧបមាថាទាញយកទិន្នន័យរួមសម្រាប់ថ្នាក់)
  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        setLoading(true)
        // កែតម្រូវ Endpoint ឱ្យត្រូវតាម API របស់អ្នក (ឧទាហរណ៍ ទាញយកតាម Course ID)
        const response = await fetch(`/api/attendance/course/1`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllAttendance()
  }, [])

  // ២. រៀបចំបញ្ជីកាលបរិច្ឆេទប្លែកៗគ្នា (Unique Dates) ដើម្បីធ្វើជាក្បាលតារាង (Columns)
  const uniqueDates = Array.from(new Set(data.map(item => item.date))).sort()

  // ៣. គ្រុបសិស្ស (Group by Student)
  const studentsMap = data.reduce((acc: any, curr: any) => {
    const studentId = curr.studentId
    if (!acc[studentId]) {
      acc[studentId] = {
        name: curr.student?.name || 'Unknown',
        gender: curr.student?.gender || '-',
        attendances: {}
      }
    }
    acc[studentId].attendances[curr.date] = curr.status
    return acc
  }, {})

  return (
    <>
      <Flex direction="column" gap="4" className="mb-6">
        <Flex direction="row" justify="between" align="center">
          <Flex gap="2" align="center">
            <button onClick={() => router.history.back()} className="cursor-pointer">
              <FaArrowLeft />
            </button>
            <Text size="5" weight="bold">របាយការណ៍វត្តមានប្រចាំខែ</Text>
          </Flex>
          <Button variant="solid" onClick={() => window.print()}>ព្រីនរបាយការណ៍</Button>
        </Flex>

        <Flex direction="column" gap="1" className="text-center font-bold">
          <Text>សម្រង់វត្តមាននិស្សិត - Web Development</Text>
          <Text size="2" color="gray">ជំនាន់ទី១៩ ឆ្នាំទី៤ ឆមាស១</Text>
        </Flex>
      </Flex>

      <div className="overflow-x-auto">
        <RootTable>
          <HeaderTable>
            <RowTable isHeader>
              <CellTable className="w-12" isHeader>ល.រ</CellTable>
              <CellTable className="min-w-[150px]" isHeader>ឈ្មោះនិស្សិត</CellTable>
              <CellTable className="w-14" isHeader>ភេទ</CellTable>

              {/* បង្ហាញថ្ងៃទី ១, ២, ៣... តាមចំនួនកាលបរិច្ឆេទដែលមាន */}
              {uniqueDates.map((_, index) => (
                <CellTable key={index} className="w-10 text-[10px]" isHeader>
                  {index + 1}
                </CellTable>
              ))}

              <CellTable className="w-16" isHeader>ច្បាប់</CellTable>
              <CellTable className="w-16" isHeader>អវត្តមាន</CellTable>
              <CellTable className="w-16" isHeader noRightBorder>ភាគរយ</CellTable>
            </RowTable>
          </HeaderTable>

          <BodyTable>
            {loading ? (
              <RowTable><CellTable columSpan={uniqueDates.length + 6}><Spinner /></CellTable></RowTable>
            ) : Object.keys(studentsMap).map((studentId, idx) => {
              const student = studentsMap[studentId];
              const atts = student.attendances;

              // គណនាសរុប
              const totalDays = uniqueDates.length;
              const excusedCount = Object.values(atts).filter(v => v === 'excused').length;
              const absentCount = Object.values(atts).filter(v => v === 'absent').length;
              const percentage = ((absentCount + excusedCount) / totalDays) * 100;

              return (
                <RowTable key={studentId}>
                  <CellTable>{idx + 1}</CellTable>
                  <CellTable className="text-left font-medium">{student.name}</CellTable>
                  <CellTable>{student.gender}</CellTable>

                  {/* លូបបង្ហាញវត្តមានតាមថ្ងៃនីមួយៗ */}
                  {uniqueDates.map(date => (
                    <CellTable key={date} className="text-[12px]">
                      {renderStatus(atts[date] || '')}
                    </CellTable>
                  ))}

                  <CellTable>{excusedCount}</CellTable>
                  <CellTable>{absentCount}</CellTable>
                  <CellTable noRightBorder>
                    {percentage.toFixed(0)}%
                  </CellTable>
                </RowTable>
              )
            })}
          </BodyTable>
        </RootTable>
      </div>

      <Flex gap="4" mt="4" className="text-[12px] text-gray-600">
        <Text>បញ្ជាក់៖ ⎷: វត្តមាន | L: យឺត | P: ច្បាប់ | A: អវត្តមាន</Text>
      </Flex>
    </>
  )
}