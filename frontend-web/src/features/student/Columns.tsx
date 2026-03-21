import type { StudentsType } from '@/types'
import { Badge, Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEdit } from 'react-icons/fa'

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
  { accessorKey: 'id', header: 'ល.រ' },
  { accessorKey: 'name', header: 'ឈ្មោះ' },
  { accessorKey: 'gender', header: 'ភេទ' },
  { accessorKey: 'dob', header: 'ថ្ងៃ ខែ ឆ្នាំកំណើត' },
  { accessorKey: 'pob', header: 'ទីកន្លែងកំណើត' },

  {
    accessorKey: 'status',
    header: 'ស្ថានភាព',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge color={getStatusColor(status)} variant="soft">
          {status}
        </Badge>
      )
    },
  },

  { accessorKey: 'email', header: 'អ៊ីម៉ែល' },
  { accessorKey: 'phone', header: 'លេខទូរស័ព្ទ' },

  {
    id: 'student-actions',
    header: 'សកម្មភាព',
    enableSorting: false,
    cell: ({ row }) => (
      <Flex gap="2">
        <IconButton
          size="1"
          color="cyan"
          variant="surface"
          style={{ cursor: 'pointer' }}
          onClick={() => console.log('Edit student:', row.original.id)}
        >
          <FaRegEdit />
        </IconButton>
      </Flex>
    ),
  },
]
