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
import { FaArrowLeft, FaInfoCircle, FaSave, FaFileAlt } from 'react-icons/fa'

export const Route = createFileRoute('/admin/course/$courseId/')({
  component: RouteComponent,
})

type Student = {
  id: number
  code: string
  name: string
  gender: string
  status: string
}

// ទិន្នន័យសាកល្បង
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

const STATUS_OPTIONS = [
  { label: 'មករៀន', value: 'present', color: 'green' },
  { label: 'យឺត', value: 'late', color: 'yellow' },
  { label: 'ច្បាប់', value: 'excused', color: 'blue' },
  { label: 'អវត្តមាន', value: 'absent', color: 'red' },
]

function RouteComponent() {
  useTitle('គ្រប់គ្រងវត្តមាន')
  const router = useRouter()
  const { attendanceId }: any = Route.useParams()

  // កំណត់ Default ជា 'absent' សម្រាប់អ្នកកំពុងសិក្សាទាំងអស់
  const [selected, setSelected] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {}
    students.forEach(s => {
      if (s.status === 'កំពុងសិក្សា') initial[s.id] = 'absent'
    })
    return initial
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeStudents = students.filter((s) => s.status === 'កំពុងសិក្សា')

  // ប្តូរ Status ម្នាក់ៗ
  const handleSelect = (studentId: number, status: string) => {
    setSelected((prev) => ({ ...prev, [studentId]: status }))
  }

  // ជ្រើសរើសទាំងអស់ (Select All)
  const handleSelectAll = (status: string) => {
    const newSelection = { ...selected }
    activeStudents.forEach((s) => {
      newSelection[s.id] = status
    })
    setSelected(newSelection)
  }

  const handleSubmit = async () => {
    // ឆែកមើលថាគ្រប់គ្នាមាន Status ឬនៅ (ការពារករណី null)
    const markedCount = Object.keys(selected).length
    if (markedCount < activeStudents.length) {
      toast.error("សូមបញ្ចូលវត្តមានឱ្យបានគ្រប់សិស្ស!")
      return
    }

    const payload = {
      courseId: Number(attendanceId),
      date: new Date().toISOString().split('T')[0],
      session: 1, // ឬតាម dynamic session
      marks: activeStudents.map(s => ({
        studentId: s.id.toString(),
        status: selected[s.id],
        notes: ""
      }))
    }

    try {
      setIsSubmitting(true)
      console.log("Payload to Backend:", payload)
      
      // កន្លែងនេះដាក់ API Call របស់អ្នក
      // await api.post('/attendance', payload)
      
      await new Promise(res => setTimeout(res, 1000)) // បន្លំការរង់ចាំ
      toast.success("រក្សាទុកវត្តមានបានជោគជ័យ!")
    } catch (error: any) {
      toast.error(error.message || "មានបញ្ហាបច្ចេកទេស")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto p-2 md:p-6 space-y-6">
      {/* Header Section */}
      <Flex justify="between" align="center" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Flex gap="4" align="center">
          <button
            onClick={() => router.history.back()}
            className="p-2.5 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <Flex direction="column">
            <Text size="5" weight="bold" className="text-slate-800">សម្រង់វត្តមាននិស្សិត</Text>
            <Text size="2" color="gray">ID ថ្នាក់រៀន: {attendanceId}</Text>
          </Flex>
        </Flex>
        
        <Flex gap="3">
          <Button variant="soft" color="gray" asChild>
            <Link to="/admin/classes/attendance/report/$attendanceReportId" params={{ attendanceReportId: '1' }}>
              <FaFileAlt /> របាយការណ៍
            </Link>
          </Button>
          <Button
            size="3"
            color="green"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            <FaSave /> រក្សាទុកទិន្នន័យ
          </Button>
        </Flex>
      </Flex>

      {/* Class Info Card */}
      <Flex direction="column" gap="1" className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <Text size="4" weight="bold" className="text-blue-900">ថ្នាក់បរិញ្ញាបត្រ វិទ្យាសាស្រ្ដកុំព្យូទ័រ</Text>
        <Flex gap="4" justify="center" className="text-blue-700/80 text-sm italic">
          <Text>ជំនាន់ទី១៩ ឆ្នាំទី៤ ឆមាស១</Text>
          <Text>|</Text>
          <Text>វេន៖ ពេលយប់</Text>
          <Text>|</Text>
          <Text>កាលបរិច្ឆេទ៖ {new Date().toLocaleDateString('kh-KH')}</Text>
        </Flex>
      </Flex>

      {/* Table Section */}
        <RootTable>
          <HeaderTable>
            <RowTable isHeader>
              <CellTable className="w-12 bg-gray-50" isHeader rowSpan={2}>ល.រ</CellTable>
              <CellTable className="w-28 bg-gray-50" isHeader rowSpan={2}>អត្តលេខ</CellTable>
              <CellTable className="bg-gray-50" isHeader rowSpan={2}>គោត្តនាម - នាម</CellTable>
              <CellTable className="w-16 bg-gray-50" isHeader rowSpan={2}>ភេទ</CellTable>
              <CellTable className="w-28 bg-gray-50" isHeader rowSpan={2}>ស្ថានភាព</CellTable>
              <CellTable isHeader columSpan={4} noRightBorder className="bg-blue-600 text-white border-blue-600">
                ម៉ោងសិក្សា (6:00 PM - 7:30 PM)
              </CellTable>
            </RowTable>

            <RowTable isHeader>
              {STATUS_OPTIONS.map((opt, index) => (
                <CellTable
                  key={opt.value}
                  className="w-24 text-xs bg-blue-50 text-blue-800"
                  isHeader
                  noRightBorder={index === 3}
                >
                  <Flex direction="column" align="center" gap="1">
                    {opt.label}
                    <Checkbox 
                      size="1"
                      onCheckedChange={() => handleSelectAll(opt.value)}
                      checked={activeStudents.length > 0 && activeStudents.every(s => selected[s.id] === opt.value)}
                    />
                  </Flex>
                </CellTable>
              ))}
            </RowTable>
          </HeaderTable>

          <Table.Body>
            {students.map((student, idx) => {
              const isInactive = student.status !== 'កំពុងសិក្សា'
              return (
                <Table.Row key={student.id} className={`${isInactive ? 'bg-gray-50/50' : 'hover:bg-blue-50/30 transition-colors'}`}>
                  <CellTable className="text-center">{idx + 1}</CellTable>
                  <CellTable className="font-mono text-xs">{student.code}</CellTable>
                  <CellTable className={`text-left font-medium ${isInactive ? 'text-gray-400' : 'text-slate-700'}`}>
                    {student.name}
                  </CellTable>
                  <CellTable className="text-center">{student.gender}</CellTable>
                  <CellTable className="text-center">
                    <Badge variant="soft" color={student.status === 'កំពុងសិក្សា' ? 'blue' : 'red'}>
                      {student.status}
                    </Badge>
                  </CellTable>

                  {STATUS_OPTIONS.map((opt, index) => (
                    <CellTable key={opt.value} className="text-center" noRightBorder={index === 3}>
                      <Checkbox
                        disabled={isInactive}
                        checked={selected[student.id] === opt.value}
                        onCheckedChange={() => handleSelect(student.id, opt.value)}
                        color={opt.color as any}
                      />
                    </CellTable>
                  ))}
                </Table.Row>
              )
            })}
          </Table.Body>
        </RootTable>

      {activeStudents.length === 0 && (
        <Callout.Root color="orange" variant="soft">
          <Callout.Icon><FaInfoCircle /></Callout.Icon>
          <Callout.Text>មិនមាននិស្សិតដែលមានសិទ្ធិស្រង់វត្តមានក្នុងបញ្ជីនេះទេ។</Callout.Text>
        </Callout.Root>
      )}
    </div>
  )
}