import {
  CellTable,
  HeaderTable,
  RootTable,
  RowTable,
} from '@/components/ui/tables/table'
import { useTitle } from '@/hooks/useTitle'
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  Table,
  Text,
  Callout,
} from '@radix-ui/themes'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useEffect, useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaInfoCircle, FaSave, FaFileAlt } from 'react-icons/fa'

import { getCourseStudents, getCourseById } from '@/api/CourseAPI'
import { getCourseAttendance, markBulkAttendance } from '@/api/AttendanceAPI'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSessionContext } from '@/providers/AuthProvider'
import { formatDate } from '@/hooks/useDate'

export const Route = createFileRoute('/admin/course/attendance/$attendanceId')({
  component: RouteComponent,
})

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
  const courseId = Number(attendanceId)
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const queryClient = useQueryClient()
  const { data: session } = useSessionContext()
  const user = session?.user
  const role = (user as any)?.role || ''
  const canChangeDate = role === 'admin' || role === 'manager'

  const [selectedDate, setSelectedDate] = useState(today)

  // Fetch Students for the course
  const { data: studentsData, isLoading: isLoadStudents } = useQuery({
    queryKey: ['course_students', courseId],
    queryFn: () => getCourseStudents(courseId),
  })

  const formattedStudentsData = studentsData?.map((student: any) => ({
    ...student,
    dob: formatDate(student.dob).display(),
  }))

  const students = formattedStudentsData || []

  // Fetch Course Details
  const { data: course, isLoading: isLoadCourse } = useQuery({
    queryKey: ['course_detail', courseId],
    queryFn: () => getCourseById(courseId),
  })

  // Fetch existing attendance for the selected date
  const { data: existingRecordsData, isLoading: isLoadAttendance } = useQuery({
    queryKey: ['course_attendance', courseId, selectedDate],
    queryFn: () => getCourseAttendance(courseId, selectedDate),
  })
  const existingRecords = existingRecordsData || []

  const [selected, setSelected] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)

  // Prepopulate selections
  useEffect(() => {
    if (isLoadStudents || isLoadAttendance || isLoadCourse) return
    const initialSelected: Record<string, string> = {}
    const initialNotes: Record<string, string> = {}

    // If existing records found, prepopulate with them
    if (existingRecords && existingRecords.length > 0) {
      existingRecords.forEach((record: any) => {
        initialSelected[record.studentId] = record.status
        initialNotes[record.studentId] = record.notes || ''
      })
      // Fill the rest with absent
      students.forEach((s: any) => {
        if (
          !initialSelected[s.id] &&
          s.isActive &&
          s.educationalStatus === 'enrolled'
        ) {
          initialSelected[s.id] = 'absent'
          initialNotes[s.id] = ''
        }
      })
      setIsEditing(false)
    } else {
      // Default all enrolled to absent
      students.forEach((s: any) => {
        if (s.isActive && s.educationalStatus === 'enrolled') {
          initialSelected[s.id] = 'absent'
          initialNotes[s.id] = ''
        }
      })
      setIsEditing(true)
    }

    setSelected(initialSelected)
    setNotes(initialNotes)
  }, [studentsData, existingRecordsData, isLoadStudents, isLoadAttendance])

  const mutation = useMutation({
    mutationFn: markBulkAttendance,
    onSuccess: () => {
      toast.success('រក្សាទុកវត្តមានបានជោគជ័យ!')
      queryClient.invalidateQueries({
        queryKey: ['course_attendance', courseId, selectedDate],
      })
      setIsEditing(false)
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || error.message || 'មានបញ្ហាបច្ចេកទេស',
      )
    },
  })

  // activeStudents
  const activeStudents = useMemo(
    () =>
      students.filter(
        (s: any) => s.isActive && s.educationalStatus === 'enrolled',
      ),
    [students],
  )

  // ប្តូរ Status ម្នាក់ៗ
  const handleSelect = (studentId: string, status: string) => {
    setSelected((prev) => ({ ...prev, [studentId]: status }))
  }

  // ជ្រើសរើសទាំងអស់ (Select All)
  const handleSelectAll = (status: string) => {
    const newSelection = { ...selected }
    activeStudents.forEach((s: any) => {
      newSelection[s.id] = status
    })
    setSelected(newSelection)
  }

  const handleNoteChange = (studentId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [studentId]: note }))
  }

  const handleSubmit = async () => {
    const markedCount = Object.keys(selected).length
    if (markedCount < activeStudents.length) {
      toast.error('សូមបញ្ចូលវត្តមានឱ្យបានគ្រប់សិស្ស!')
      return
    }

    const payload = {
      courseId: courseId,
      date: selectedDate,
      session:
        course?.schedule?.sessionTime?.shift === 'morning'
          ? 1
          : course?.schedule?.sessionTime?.shift === 'evening'
            ? 2
            : 3,
      academicYearId: course?.academicYearId,
      facultyId: course?.schedule?.faculty?.id,
      departmentId: course?.schedule?.department?.id,
      mark: activeStudents.map((s: any) => ({
        studentId: s.id,
        status: selected[s.id],
        notes: notes[s.id] || '',
      })),
    }

    mutation.mutate(payload)
  }

  return (
    <div className="mx-auto space-y-4">
      {/* Header Section */}
      <Flex
        justify="between"
        align="center"
        className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <Flex gap="4" align="center">
          <button
            onClick={() => router.history.back()}
            className="p-2.5 bg-gray-50 dark:bg-gray-800  hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600 dark:text-white" />
          </button>
          <Flex direction="column">
            <Text
              size="5"
              weight="bold"
              className="text-slate-800 dark:text-white"
            >
              សម្រង់វត្តមាននិស្សិត
            </Text>
          </Flex>
        </Flex>

        <Flex gap="3" align="center">
          {(role === 'admin' || role === 'manager') && (
            <Flex align="center" gap="3">
              <Text size="2" weight="bold">
                កាលបរិច្ឆេទ៖
              </Text>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={!canChangeDate}
                className={`p-1 border rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 ${!canChangeDate ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-white cursor-pointer'}`}
              />
              {!canChangeDate && (
                <Badge color="yellow" variant="soft" size="1">
                  ស្វ័យប្រវត្តិ
                </Badge>
              )}
            </Flex>
          )}
          {(role === 'admin' || role === 'manager') && (
            <Button
              variant="surface"
              color={isEditing ? 'red' : 'blue'}
              onClick={() => setIsEditing(!isEditing)}
              style={{ cursor: 'pointer' }}
            >
              {isEditing ? 'បោះបង់ការកែប្រែ' : 'កែប្រែវត្តមាន'}
            </Button>
          )}
          <Button variant="soft" color="gray" asChild>
            <Link
              to="/admin/course/attendance/report/$attendanceReportId"
              params={{ attendanceReportId: courseId.toString() }}
            >
              <FaFileAlt /> របាយការណ៍
            </Link>
          </Button>

          <Button
            size="2"
            color="blue"
            onClick={handleSubmit}
            loading={mutation.isPending}
            disabled={!isEditing}
            style={{ cursor: isEditing ? 'pointer' : 'not-allowed' }}
          >
            <FaSave /> រក្សាទុកទិន្នន័យ
          </Button>
        </Flex>
      </Flex>

      {/* Class Info Card */}
      <Flex
        direction="column"
        gap="1"
        className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700"
      >
        <Text size="4" weight="bold" className="text-slate-800 dark:text-white">
          {course?.schedule?.academicLevel?.level === 'Bachelor'
            ? 'ថ្នាក់បរិញ្ញាបត្រ'
            : course?.schedule?.academicLevel?.level === 'Associate'
              ? 'ថ្នាក់បរិញ្ញាបត្ររង'
              : course?.schedule?.academicLevel?.level === 'Master'
                ? 'ថ្នាក់បរិញ្ញាបត្រជាន់ខ្ពស់'
                : course?.schedule?.academicLevel?.level === 'PhD'
                  ? 'ថ្នាក់បណ្ឌិត'
                  : ''}{' '}
          {course?.schedule?.faculty?.name || '...'}
        </Text>
        <Flex
          gap="4"
          justify="center"
          className="text-blue-700/80 text-sm italic"
        >
          <Text>
            ជំនាន់ទី{course?.schedule?.generation || '--'} ឆ្នាំទី
            {course?.schedule?.year || '--'} ឆមាស
            {course?.schedule?.semester || '--'}
          </Text>
          <Text>|</Text>
          <Text>
            វេន៖{' '}
            {course?.schedule?.studyShift === 'morning'
              ? 'ព្រឹក'
              : course?.schedule?.studyShift === 'evening'
                ? 'ល្ងាច'
                : 'យប់'}
          </Text>
          <Text>|</Text>
          <Text>កាលបរិច្ឆេទ៖ {new Date().toLocaleDateString('kh-KH')}</Text>
        </Flex>
      </Flex>

      {/* Table Section */}
      <RootTable>
        <HeaderTable>
          <RowTable isHeader>
            <CellTable className="w-12 bg-gray-50" isHeader rowSpan={2}>
              ល.រ
            </CellTable>
            <CellTable className="w-28 bg-gray-50" isHeader rowSpan={2}>
              អត្តលេខ
            </CellTable>
            <CellTable className="bg-gray-50" isHeader rowSpan={2}>
              គោត្តនាម - នាម
            </CellTable>
            <CellTable className="bg-gray-50" isHeader rowSpan={2}>
              ឈ្មោះជាភាសាអង់គ្លេស
            </CellTable>
            <CellTable className="bg-gray-50" isHeader rowSpan={2}>
              ថ្ងៃខែឆ្នាំកំណើត
            </CellTable>
            <CellTable className="w-16 bg-gray-50" isHeader rowSpan={2}>
              ភេទ
            </CellTable>
            <CellTable className="w-28 bg-gray-50" isHeader rowSpan={2}>
              ស្ថានភាព
            </CellTable>
            <CellTable
              isHeader
              columSpan={5}
              noRightBorder
              className="bg-blue-600 border-blue-600"
            >
              ម៉ោងសិក្សា (
              {course?.schedule?.sessionTime?.firstSessionStartTime || 'TBA'} -{' '}
              {course?.schedule?.sessionTime?.secondSessionEndTime || 'TBA'})
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
                    checked={
                      activeStudents.length > 0 &&
                      activeStudents.every(
                        (s: any) => selected[s.id] === opt.value,
                      )
                    }
                  />
                </Flex>
              </CellTable>
            ))}
            <CellTable
              className="w-48 text-xs bg-blue-50 text-blue-800"
              isHeader
              noRightBorder
            >
              សម្គាល់
            </CellTable>
          </RowTable>
        </HeaderTable>

        <Table.Body>
          {students.map((student: any, idx: number) => {
            const isInactive =
              !student.isActive || student.educationalStatus !== 'enrolled'
            return (
              <Table.Row
                key={student.id}
                className={`${isInactive ? 'bg-gray-50/50' : 'hover:bg-blue-50/30 transition-colors'}`}
              >
                <CellTable className="text-center">{idx + 1}</CellTable>
                <CellTable className="font-mono text-xs">
                  {student.studentCode}
                </CellTable>
                <CellTable
                  className={`text-left font-medium dark:text-white ${isInactive ? 'text-gray-400' : 'text-slate-700'}`}
                >
                  {student.name}
                </CellTable>
                <CellTable
                  className={`text-left font-medium dark:text-white ${isInactive ? 'text-gray-400' : 'text-slate-700'}`}
                >
                  {student.nameEn}
                </CellTable>
                <CellTable className="text-center">{student.dob}</CellTable>
                <CellTable className="text-center">
                  {student.gender === 'male'
                    ? 'ប្រុស'
                    : student.gender === 'female'
                      ? 'ស្រី'
                      : student.gender}
                </CellTable>
                <CellTable className="text-center">
                  <Badge variant="soft" color={!isInactive ? 'blue' : 'red'}>
                    {!isInactive ? 'កំពុងសិក្សា' : student.educationalStatus}
                  </Badge>
                </CellTable>

                {STATUS_OPTIONS.map((opt, index) => (
                  <CellTable
                    key={opt.value}
                    className="text-center"
                    noRightBorder={index === 3}
                  >
                    <Checkbox
                      disabled={isInactive || !isEditing}
                      checked={selected[student.id] === opt.value}
                      onCheckedChange={() =>
                        handleSelect(student.id, opt.value)
                      }
                      color={opt.color as any}
                    />
                  </CellTable>
                ))}
                <CellTable className="text-center" noRightBorder>
                  <input
                    type="text"
                    value={notes[student.id] || ''}
                    onChange={(e) =>
                      handleNoteChange(student.id, e.target.value)
                    }
                    disabled={isInactive || !isEditing}
                    placeholder="..."
                    className={`w-full p-1 text-xs border rounded transition-all ${!isEditing ? 'bg-gray-50 border-transparent text-gray-500' : 'bg-white border-gray-200 focus:border-blue-500'}`}
                  />
                </CellTable>
              </Table.Row>
            )
          })}
        </Table.Body>
      </RootTable>

      {activeStudents.length > 0 && (
        <Callout.Root color="red" variant="soft">
          <Callout.Icon>
            <FaInfoCircle />
          </Callout.Icon>
          <Callout.Text>
            ចំណាំ៖ លោកគ្រូ/អ្នកគ្រូ
            មិនអាចស្រង់វត្តមាននិស្សិតក្រៅពីម៉ោងសិក្សាជាផ្លូវការ
            ឬក្រោយម៉ោងសិក្សាជាផ្លូវការ ១៥នាទីបានទេ។
          </Callout.Text>
        </Callout.Root>
      )}

      {activeStudents.length === 0 && (
        <Callout.Root color="red" variant="soft">
          <Callout.Icon>
            <FaInfoCircle />
          </Callout.Icon>
          <Callout.Text>
            មិនមាននិស្សិតដែលមានសិទ្ធិស្រង់វត្តមានក្នុងបញ្ជីនេះទេ។
          </Callout.Text>
        </Callout.Root>
      )}
    </div>
  )
}
