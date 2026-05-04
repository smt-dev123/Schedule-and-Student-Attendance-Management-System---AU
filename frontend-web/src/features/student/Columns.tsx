import StudentDelete from '@/routes/admin/student/-actions/Delete'
import StudentPromote from '@/routes/admin/student/-actions/StudentPromote'
import StudentUpdate from '@/routes/admin/student/-actions/Update'
import type { StudentsType } from '@/types'
import { Avatar, Badge, Flex, IconButton, Text } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'
import { useSession } from '@/lib/auth-client'



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

const handleViewImage = (imageUrl: string) => {
  window.open(imageUrl, '_blank')
}

export const StudentColumns: ColumnDef<StudentsType>[] = [
  {
    accessorKey: 'no',
    header: 'ល.រ',
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>
    },
  },
  {
    accessorKey: 'image',
    header: 'រូបភាព',
    cell: ({ row }) => {
      const imageUrl =
        `${import.meta.env.VITE_API_BASE_URL}${row.original.image}`.replace(
          '/api',
          '',
        )
      return (
        <Avatar
          size="3"
          src={imageUrl}
          fallback={row.original.name?.charAt(0) || 'S'}
          radius="full"
          onClick={() => handleViewImage(imageUrl)}
          style={{ cursor: 'pointer' }}
        />
      )
    },
  },
  { accessorKey: 'studentCode', header: 'លេខសម្គាល់' },
  { accessorKey: 'name', header: 'ឈ្មោះ' },
  { accessorKey: 'nameEn', header: 'ឈ្មោះអង់គ្លេស' },
  { accessorKey: 'gender', header: 'ភេទ' },
  {
    id: 'grade',
    header: 'ថ្នាក់សិក្សា',
    cell: ({ row }) => (
      <Text size="2">
        ឆ្នាំទី {row.original.year} ឆមាស {row.original.semester}
      </Text>
    ),
  },
  { accessorKey: 'phone', header: 'លេខទូរស័ព្ទ' },
  { accessorKey: 'address', header: 'អាស័យដ្ឋាន' },
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
    cell: ({ row }) => <StudentActions row={row} />,
  },
]

function StudentActions({ row }: { row: any }) {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role

  return (
    <Flex gap="2">
      {['manager', 'staff'].includes(role) && (
        <StudentPromote student={row.original} />
      )}
      <IconButton
        size="1"
        color="cyan"
        variant="surface"
        style={{ cursor: 'pointer' }}
        onClick={() => console.log('Edit student:', row.original.id)}
      >
        <FaRegEye />
      </IconButton>
      {['manager', 'staff'].includes(role) && (
        <StudentUpdate data={row.original} />
      )}
      {['manager', 'staff'].includes(role) && (
        <StudentDelete data={row.original} />
      )}
    </Flex>
  )
}
