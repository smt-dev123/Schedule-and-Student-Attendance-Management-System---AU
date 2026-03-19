import RoomDelete from '@/routes/admin/room/-actions/Delete'
import RoomUpdate from '@/routes/admin/room/-actions/Update'
import type { RoomType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from 'react-icons/fa'

export const RoomColumns: ColumnDef<RoomType>[] = [
  { accessorKey: 'id', header: 'ល.រ' },
  { accessorKey: 'name', header: 'បន្ទប់សិក្សា' },
  { accessorKey: 'number', header: 'ជាន់បន្ទប់សិក្សា' },
  { accessorKey: 'building.name', header: 'អាគារសិក្សា' },
  {
    id: 'room-actions',
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

        <RoomUpdate data={row.original} />
        <RoomDelete data={row.original} />
      </Flex>
    ),
  },
]
