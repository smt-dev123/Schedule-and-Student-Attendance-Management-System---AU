import {
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import { useTitle } from '@/hooks/useTitle'
import { Badge, Button, Checkbox, Flex, Table, Text, Callout } from '@radix-ui/themes'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa'

export const Route = createFileRoute('/admin/classes/attendance/$attendanceId')({
  component: RouteComponent,
})

type Student = {
  id: number
  code: string
  name: string
  gender: string
  status: string
}

const students: Student[] = [
  { id: 1, code: '0001', name: 'លុយ សុមាត្រា', gender: 'ប្រុស', status: 'កំពុងសិក្សា' },
  { id: 2, code: '0002', name: 'ស្រៀង លីហួរ', gender: 'ស្រី', status: 'កំពុងសិក្សា' },
  { id: 3, code: '0003', name: 'ធឿន ឡង់ឌី', gender: 'ប្រុស', status: 'កំពុងសិក្សា' },
  { id: 4, code: '0004', name: 'ទូច វិទូ', gender: 'ប្រុស', status: 'កំពុងសិក្សា' },
  { id: 5, code: '0005', name: 'សិទ្ធ ធារ៉ា', gender: 'ប្រុស', status: 'កំពុងសិក្សា' },
  { id: 6, code: '0006', name: 'សិទ្ធ ស្រីនិច', gender: 'ស្រី', status: 'កំពុងសិក្សា' },
  { id: 7, code: '0007', name: 'រិទ្ធ ប៊ុនរ៉ាក់', gender: 'ប្រុស', status: 'ឈប់រៀន' },
  { id: 8, code: '0008', name: 'គឹម ម៉ាលី', gender: 'ស្រី', status: 'ផ្ទេរកាសិក្សា' },
]

// ម៉ូដែល Status ដែល Backend ទទួលស្គាល់
const STATUS_OPTIONS = [
  { label: 'មករៀន', value: 'present' },
  { label: 'យឺត', value: 'late' },
  { label: 'ច្បាប់', value: 'excused' }, // Backend ប្រើ excused ជំនួស permission
  { label: 'អវត្តមាន', value: 'absent' },
]

function RouteComponent() {
  useTitle('Attendance Management')
  const router = useRouter()
  const { attendanceId } = Route.useParams() // យក courseId/attendanceId ពី URL

  const [selected, setSelected] = useState<Record<number, string | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ប្តូរ Row state សម្រាប់សិស្សម្នាក់ៗ
  const handleSelect = (studentId: number, status: string) => {
    setSelected((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status,
    }))
  }

  // ជ្រើសរើសទាំងអស់តាម Status
  const handleSelectAll = (status: string) => {
    const activeStudents = students.filter((s) => s.status === 'កំពុងសិក្សា')
    const isAllSelected = activeStudents.every((s) => selected[s.id] === status)

    const newSelection = { ...selected }
    activeStudents.forEach((s) => {
      newSelection[s.id] = isAllSelected ? null : status
    })
    setSelected(newSelection)
  }

  // បញ្ជូនទិន្នន័យទៅ Backend
  const handleSubmit = async () => {
    const activeStudents = students.filter((s) => s.status === 'កំពុងសិក្សា')

    // ឆែកមើលថាបានគ្រីគ្រប់សិស្សឬនៅ
    const unMarked = activeStudents.filter(s => !selected[s.id])
    if (unMarked.length > 0) {
      toast.error(`សូមបញ្ចូលវត្តមានឱ្យបានគ្រប់គ្រាន់ (នៅសល់ ${unMarked.length} នាក់)`)
      return
    }

    const payload = {
      courseId: Number(attendanceId),
      date: new Date().toISOString().split('T')[0], // format: YYYY-MM-DD
      session: "6:00 PM - 7:30 PM",
      mark: activeStudents.map(s => ({
        studentId: s.id.toString(),
        status: selected[s.id],
        notes: ""
      }))
    }

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/attendance/bulk', { // កែតម្រូវ endpoint តាមជាក់ស្តែង
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "រក្សាទុកមិនបានជោគជ័យ")
      }

      toast.success("រក្សាទុកវត្តមានបានជោគជ័យ!")
      // ប្រហែលជាចង់ Navigate ទៅកាន់ទំព័រផ្សេង
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto p-4">
      <Flex direction="column" gap="4">
        <Flex direction="row" justify="between" align="center">
          <Flex gap="3" align="center">
            <button
              onClick={() => router.history.back()}
              className="cursor-pointer hover:scale-110 transition-transform p-2 bg-gray-100 rounded-full"
            >
              <FaArrowLeft />
            </button>
            <Text size="5" weight="bold">សម្រង់វត្តមាននិស្សិត</Text>
          </Flex>
          <Flex gap="2">
            <Button
              color="green"
              variant="solid"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              រក្សាទុកវត្តមាន
            </Button>
            <Button variant="soft" asChild>
              <Link to="/admin/classes/attendance/report/$attendanceReportId" params={{ attendanceReportId: '1' }}>
                របាយការណ៍
              </Link>
            </Button>
          </Flex>
        </Flex>

        <Flex direction="column" gap="1" className="text-center mb-4 bg-blue-50 p-4 rounded-lg">
          <Text weight="bold">សម្រង់វត្តមាននិស្សិតថ្នាក់បរិញ្ញាបត្រ</Text>
          <Text size="2">ជំនាន់ទី១៩ ឆ្នាំទី៤ ឆមាស១ | ជំនាញ៖ វិទ្យាសាស្រ្ដកុំព្យូទ័រ</Text>
          <Text size="2">វេន៖ ពេលយប់ | បន្ទប់៖ ស្រុកកងមាស | កាលបរិច្ឆេទ៖ {new Date().toLocaleDateString('kh-KH')}</Text>
        </Flex>

        <RootTable>
          <HeaderTable>
            <RowTable isHeader>
              <CellTable className="w-12" isHeader rowSpan={2}>ល.រ</CellTable>
              <CellTable className="w-28" isHeader rowSpan={2}>អត្តលេខ</CellTable>
              <CellTable isHeader rowSpan={2}>គោត្តនាម - នាម</CellTable>
              <CellTable className="w-16" isHeader rowSpan={2}>ភេទ</CellTable>
              <CellTable className="w-28" isHeader rowSpan={2}>ស្ថានភាព</CellTable>
              <CellTable isHeader columSpan={4} noRightBorder className="bg-gray-50">
                6:00 PM - 7:30 PM
              </CellTable>
            </RowTable>

            <RowTable isHeader>
              {STATUS_OPTIONS.map((opt, index) => (
                <CellTable
                  key={opt.value}
                  className="w-20 text-xs"
                  isHeader
                  noRightBorder={index === 3}
                >
                  {opt.label}
                </CellTable>
              ))}
            </RowTable>
          </HeaderTable>

          <Table.Body>
            {/* ជួរដេក Select All */}
            <Table.Row className="bg-gray-100/50">
              <CellTable columSpan={5} className="font-bold text-blue-600">
                ជ្រើសរើសទាំងអស់ (អ្នកកំពុងសិក្សា)
              </CellTable>
              {STATUS_OPTIONS.map((opt, index) => (
                <CellTable key={opt.value} noRightBorder={index === 3}>
                  <Checkbox
                    checked={students.filter(s => s.status === 'កំពុងសិក្សា').every(s => selected[s.id] === opt.value)}
                    onCheckedChange={() => handleSelectAll(opt.value)}
                  />
                </CellTable>
              ))}
            </Table.Row>

            {/* បញ្ជីឈ្មោះសិស្ស */}
            {students.map((student, idx) => (
              <Table.Row key={student.id} className={student.status !== 'កំពុងសិក្សា' ? 'opacity-50 bg-gray-50' : ''}>
                <CellTable>{idx + 1}</CellTable>
                <CellTable>{student.code}</CellTable>
                <CellTable className="text-left font-medium">{student.name}</CellTable>
                <CellTable>{student.gender}</CellTable>
                <CellTable>
                  <Badge color={student.status === 'កំពុងសិក្សា' ? 'blue' : student.status === 'ឈប់រៀន' ? 'red' : 'orange'}>
                    {student.status}
                  </Badge>
                </CellTable>

                {STATUS_OPTIONS.map((opt, index) => (
                  <CellTable key={opt.value} noRightBorder={index === 3}>
                    <Checkbox
                      disabled={student.status !== 'កំពុងសិក្សា'}
                      checked={selected[student.id] === opt.value}
                      onCheckedChange={() => handleSelect(student.id, opt.value)}
                    />
                  </CellTable>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </RootTable>

        {students.filter(s => s.status === 'កំពុងសិក្សា').length === 0 && (
          <Callout.Root color="orange">
            <Callout.Icon><FaInfoCircle /></Callout.Icon>
            <Callout.Text>មិនមាននិស្សិតកំពុងសិក្សាក្នុងបញ្ជីនេះទេ។</Callout.Text>
          </Callout.Root>
        )}
      </Flex>
    </div>
  )
}