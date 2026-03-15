import MajorDelete from '@/routes/admin/major/-actions/Delete'
import MajorUpdate from '@/routes/admin/major/-actions/Update'
import type { MajorsType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const MajorColumns: ColumnDef<MajorsType>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'មុខជំនាញ' },
  { accessorKey: 'faculty.name', header: 'មហាវិទ្យាល័យ' },
  { accessorKey: 'description', header: 'ការពិពណ៌នា', enableSorting: false },
  {
    id: 'actions',
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

        <MajorUpdate data={row.original} />
        <MajorDelete data={row.original} />
      </Flex>
    ),
  },
]
