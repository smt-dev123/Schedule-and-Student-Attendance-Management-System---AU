import type { StudentsType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEdit } from 'react-icons/fa'

export const StudentColumns: ColumnDef<StudentsType>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'ឈ្មោះ' },
  { accessorKey: 'gender', header: 'ភេទ' },
  { accessorKey: 'dob', header: 'ថ្ងៃ ខែ ឆ្នាំកំណើត' },
  { accessorKey: 'email', header: 'អ៊ីម៉ែល' },
  { accessorKey: 'phone', header: 'លេខទូរស័ព្ទ' },
  {
    id: 'actions',
    header: 'សកម្មភាព',
    enableSorting: false,
    cell: ({ row }) => (
      <Flex gap="2">
        {/* <ViewTeacher teachers={row.original} /> */}
        <IconButton
          size="1"
          color="cyan"
          variant="surface"
          style={{ cursor: 'pointer' }}
          // onClick={() => handleUpdate(row.original.id)}
        >
          <FaRegEdit />
        </IconButton>
        {/* <DeleteTeacher teachers={row.original} /> */}
      </Flex>
    ),
  },
]
