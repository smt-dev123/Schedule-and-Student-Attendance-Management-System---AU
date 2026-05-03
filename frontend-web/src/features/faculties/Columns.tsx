import FacultyDelete from '@/routes/admin/faculty/-actions/Delete'
import FacultyUpdate from '@/routes/admin/faculty/-actions/Update'
import type { FacultiesType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const FacultiesColumns: ColumnDef<FacultiesType>[] = [
  { accessorKey: 'id', header: 'ល.រ' },
  { accessorKey: 'name', header: 'មហាវិទ្យាល័យ' },
  {
    id: 'faculty-actions',
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

        <FacultyUpdate data={row.original} />
        <FacultyDelete data={row.original} />
      </Flex>
    ),
  },
]
