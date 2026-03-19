import {
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import { useTitle } from '@/hooks/useTitle'
import { Badge, Button, Checkbox, Flex, Table, Text } from '@radix-ui/themes'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'

export const Route = createFileRoute('/admin/classes/attendance/$attendanceId')(
  {
    component: RouteComponent,
  },
)

type Student = {
  id: number
  code: string
  name: string
  gender: string
  status: string
}

const students: Student[] = [
  {
    id: 1,
    code: '0001',
    name: 'លុយ សុមាត្រា',
    gender: 'ប្រុស',
    status: 'កំពុងសិក្សា',
  },
  {
    id: 2,
    code: '0002',
    name: 'ស្រៀង លីហួរ',
    gender: 'ស្រី',
    status: 'កំពុងសិក្សា',
  },
  {
    id: 3,
    code: '0003',
    name: 'ធឿន ឡង់ឌី',
    gender: 'ប្រុស',
    status: 'កំពុងសិក្សា',
  },
  {
    id: 4,
    code: '0004',
    name: 'ទូច វិទូ',
    gender: 'ប្រុស',
    status: 'កំពុងសិក្សា',
  },
  {
    id: 5,
    code: '0005',
    name: 'សិទ្ធ ធារ៉ា',
    gender: 'ប្រុស',
    status: 'កំពុងសិក្សា',
  },
  {
    id: 6,
    code: '0006',
    name: 'សិទ្ធ ស្រីនិច',
    gender: 'ស្រី',
    status: 'កំពុងសិក្សា',
  },
  {
    id: 7,
    code: '0007',
    name: 'រិទ្ធ ប៊ុនរ៉ាក់',
    gender: 'ប្រុស',
    status: 'ឈប់រៀន',
  },
  {
    id: 8,
    code: '0008',
    name: 'គឹម ម៉ាលី',
    gender: 'ស្រី',
    status: 'ផ្ទេរកាសិក្សា',
  },
]

function RouteComponent() {
  useTitle('Attendance Management')
  const router = useRouter()
  const [selected, setSelected] = useState<Record<number, string | null>>({})

  const handleSelect = (studentId: number, status: string) => {
    setSelected((prev) => ({
      ...prev,
      [studentId]: status, // override row state
    }))
  }

  const handleSelectAll = (status: string) => {
    const activeStudents = students.filter((s) => s.status === 'កំពុងសិក្សា')

    // ឆែកមើលថា តើសិស្សដែលកំពុងសិក្សាទាំងអស់ សុទ្ធតែមាន status ហ្នឹងហើយឬនៅ?
    const isAllSelected = activeStudents.every(
      (student) => selected[student.id] === status
    )

    const newSelection = { ...selected }

    activeStudents.forEach((student) => {
      if (isAllSelected) {
        // បើជ្រើសរើសរួចអស់ហើយ ពេលចុចម្ដងទៀត គឺដោះវិញ (set ទៅ null)
        newSelection[student.id] = null
      } else {
        // បើមិនទាន់គ្រប់ទេ គឺកំណត់ឲ្យទៅជា status ហ្នឹងទាំងអស់
        newSelection[student.id] = status
      }
    })

    setSelected(newSelection)
  }

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
              សម្រង់វត្តមាននិស្សិត
            </Text>
          </Flex>
          <Flex gap="2">
            {/* Export */}
            <Button variant="solid" style={{ cursor: 'pointer' }} asChild>
              <Link
                to="/admin/classes/attendance/report/$attendanceReportId"
                params={{ attendanceReportId: '1' }}
              >
                របាយការណ៍
              </Link>
            </Button>
          </Flex>
        </Flex>
        <Flex direction="column" gap="2" className="text-center mb-4 font-bold">
          <Text>សម្រង់វត្តមាននិស្សិតថ្នាក់បរិញ្ញាបត្រ</Text>
          <Text>
            ជំនាន់ទី១៩ ឆ្នាំទី៤ ឆមាស១ មុខជំនាញ៖ វិទ្យាសាស្រ្ដកុំព្យូទ័រ
          </Text>
          <Text>
            វេនសិក្សា៖ ពេលយប់ បន្ទប់៖ ស្រុកកងមាស (អគារ អ្នកឧកញ៉ា បណ្ឌិត សៀង ណាំ
            ជាន់ទី១)
          </Text>
          <Text>
            កាលបរិច្ឆេទ៖ ថ្ងៃទី២១ ខែកក្ដដា ឆ្នាំ២០២៥ មុខវិជ្ជា៖ Web Development
          </Text>
        </Flex>
      </Flex>
      <RootTable>
        <HeaderTable>
          {/* First header row */}
          <RowTable isHeader>
            <CellTable className="w-16" isHeader rowSpan={2}>
              ល.រ
            </CellTable>
            <CellTable className="w-28" isHeader rowSpan={2}>
              អត្តលេខនិស្សិត
            </CellTable>
            <CellTable isHeader rowSpan={2}>
              គោត្តនាម - នាម
            </CellTable>
            <CellTable className="w-20" isHeader rowSpan={2}>
              ភេទ
            </CellTable>
            <CellTable className="w-28" isHeader rowSpan={2}>
              ស្ថានភាព
            </CellTable>
            {/* Parent header spanning 4 columns */}
            <CellTable isHeader columSpan={4} noRightBorder>
              6:00 PM - 7:30 PM
            </CellTable>
          </RowTable>

          {/* Second header row (sub-columns under 6:00-7:30) */}
          <RowTable isHeader>
            <CellTable className="w-20" isHeader>
              មករៀន
            </CellTable>
            <CellTable className="w-20" isHeader>
              យឺត
            </CellTable>
            <CellTable className="w-20" isHeader>
              ច្បាប់
            </CellTable>
            <CellTable className="w-20" isHeader noRightBorder>
              អវត្តមាន
            </CellTable>
          </RowTable>
        </HeaderTable>

        <Table.Body>

          {/* ជ្រើសរើសទាំងអស់ */}
          <Table.Row style={{ backgroundColor: 'var(--gray-3)' }}>
            <CellTable columSpan={5} className="font-bold">
              ជ្រើសរើសទាំងអស់ (សម្រាប់អ្នកកំពុងសិក្សា)
            </CellTable>

            {['present', 'late', 'permission', 'absent'].map((status, index) => {
              const activeStudents = students.filter(s => s.status === 'កំពុងសិក្សា');
              const isChecked = activeStudents.length > 0 &&
                activeStudents.every(s => selected[s.id] === status);

              return (
                <CellTable key={status} noRightBorder={index === 3}>
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleSelectAll(status)}
                  />
                </CellTable>
              );
            })}
          </Table.Row>
          {students.map((student) => (
            <Table.Row key={student.id}>
              <CellTable>{student.id}</CellTable>
              <CellTable>{student.code}</CellTable>
              <CellTable className="text-left">{student.name}</CellTable>
              <CellTable>{student.gender}</CellTable>
              <CellTable>
                <Badge color={student.status === 'កំពុងសិក្សា' ? 'blue' : student.status === 'ឈប់រៀន' ? 'red' : 'orange'}>
                  {student.status}
                </Badge>
              </CellTable>

              {/* Checkboxes សម្រាប់សិស្សម្នាក់ៗ */}
              {['present', 'late', 'permission', 'absent'].map((status, index) => (
                <CellTable key={status} noRightBorder={index === 3}>
                  <Checkbox
                    disabled={student.status !== 'កំពុងសិក្សា'}
                    checked={selected[student.id] === status}
                    onCheckedChange={() => handleSelect(student.id, status)}
                  />
                </CellTable>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </RootTable>
    </div>
  )
}
