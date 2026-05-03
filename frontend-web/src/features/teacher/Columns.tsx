import TeacherDelete from '@/routes/admin/teacher/-actions/Delete'
import TeacherUpdate from '@/routes/admin/teacher/-actions/Update'
import type { TeachersType } from '@/types'
import { Avatar, Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

const handleViewImage = (imageUrl: string) => {
  window.open(imageUrl, '_blank')
}

export const TeachaerColumns: ColumnDef<TeachersType>[] = [
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
  { accessorKey: 'teacherCode', header: 'លេខសម្គាល់គ្រូ' },
  { accessorKey: 'name', header: 'គោត្តនាម-នាម' },
  { accessorKey: 'gender', header: 'ភេទ' },
  { accessorKey: 'faculty.name', header: 'មហាវិទ្យាល័យ' },
  { accessorKey: 'email', header: 'អ៊ីម៉ែល' },
  { accessorKey: 'phone', header: 'លេខទូរស័ព្ទ' },
  { accessorKey: 'address', header: 'អាសយដ្ឋាន' },
  {
    id: 'teacher-actions',
    header: 'សកម្មភាព',
    enableSorting: false,
    cell: ({ row }) => (
      <Flex gap="2">
        <IconButton
          size="1"
          color="blue"
          variant="surface"
          style={{ cursor: 'pointer' }}
        >
          <FaRegEye />
        </IconButton>

        <TeacherUpdate data={row.original} />
        <TeacherDelete data={row.original} />
      </Flex>
    ),
  },
]
