import StudentDelete from '@/routes/admin/student/-actions/Delete'
import StudentPromote from '@/routes/admin/student/-actions/StudentPromote'
import StudentUpdate from '@/routes/admin/student/-actions/Update'
import type { StudentsType } from '@/types'
import { Badge, Flex, IconButton, Text } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const STUDENT_STATUS = {
  ACTIVE: 'សកម្ម',
  INACTIVE: 'អសកម្ម',
  REST: 'សម្រាក',
  DROPPED: 'បោះបង់',
} as const

const getStatusColor = (status: string) => {
  switch (status) {
    case STUDENT_STATUS.ACTIVE:
      return 'blue'
    case STUDENT_STATUS.INACTIVE:
      return 'green'
    case STUDENT_STATUS.REST:
      return 'yellow'
    case STUDENT_STATUS.DROPPED:
      return 'red'
    default:
      return 'gray'
  }
}

export const StudentColumns: ColumnDef<StudentsType>[] = [
  {
    accessorKey: 'no',
    header: 'ល.រ',
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>
    },
  },
  { accessorKey: 'name', header: 'ឈ្មោះ' },
  { accessorKey: 'gender', header: 'ភេទ' },
  { accessorKey: 'dob', header: 'ថ្ងៃ ខែ ឆ្នាំកំណើត' },
  { accessorKey: 'pob', header: 'ទីកន្លែងកំណើត' },
  {
    id: 'grade',
    header: 'ថ្នាក់សិក្សា',
    cell: ({ row }) => (
      <Text size="2">
        ឆ្នាំទី {row.original.year} ឆមាស {row.original.semester}
      </Text>
    ),
  },
  { accessorKey: 'email', header: 'អ៊ីម៉ែល' },
  { accessorKey: 'phone', header: 'លេខទូរស័ព្ទ' },
  {
    accessorKey: 'status',
    header: 'ស្ថានភាព',
    cell: ({ row }) => {
      const status = row.original.educationalStatus || 'ENROLLED'
      return (
        <Badge color={getStatusColor(status as string)} variant="surface">
          {status}
        </Badge>
      )
    },
  },
  {
    id: 'student-actions',
    header: 'សកម្មភាព',
    enableSorting: false,
    cell: ({ row }) => (
      <Flex gap="2">
        <StudentPromote student={row.original} />
        <IconButton
          size="1"
          color="cyan"
          variant="surface"
          style={{ cursor: 'pointer' }}
          onClick={() => console.log('Edit student:', row.original.id)}
        >
          <FaRegEye />
        </IconButton>
        <StudentUpdate data={row.original} />
        <StudentDelete data={row.original} />
      </Flex>
    ),
  },
]
