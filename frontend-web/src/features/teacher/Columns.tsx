import TeacherDelete from '@/routes/admin/teacher/-actions/Delete'
import TeacherUpdate from '@/routes/admin/teacher/-actions/Update'
import type { TeachersType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const TeachaerColumns: ColumnDef<TeachersType>[] = [
  {
    accessorKey: 'no',
    header: 'ល.រ',
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>
    }
  },
  { accessorKey: 'name', header: 'គោត្តនាម-នាម' },
  { accessorKey: 'gender', header: 'ភេទ' },
  // { accessorKey: 'name', header: 'អាយុ' },
  { accessorKey: 'education_level.name', header: 'កម្រិតវប្បធម៍' },
  { accessorKey: 'department.name', header: 'តេប៉ាតឺម៉ង់' },
  { accessorKey: 'faculty.name', header: 'មហាវិទ្យាល័យ' },
  { accessorKey: 'email', header: 'អ៊ីម៉ែល' },
  { accessorKey: 'phone', header: 'លេខទូរស័ព្ទ' },
  { accessorKey: 'address', header: 'អាសយដ្ឋាន' },
  // { accessorKey: 'profile', header: 'រូបភាព' },
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
