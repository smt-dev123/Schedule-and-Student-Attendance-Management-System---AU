import type { RoomType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from 'react-icons/fa'

export const RoomColumns: ColumnDef<RoomType>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'បន្ទប់សិក្សា' },
  { accessorKey: 'floor', header: 'ជាន់បន្ទប់សិក្សា' },
  { accessorKey: 'building.name', header: 'អាគារសិក្សា' },
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

        <IconButton
          size="1"
          color="cyan"
          variant="surface"
          style={{ cursor: 'pointer' }}
          // onClick={() => handleUpdate(row.original.id)}
        >
          <FaRegEdit />
        </IconButton>

        <IconButton
          size="1"
          color="red"
          variant="surface"
          style={{ cursor: 'pointer' }}
        >
          <FaRegTrashAlt />
        </IconButton>
      </Flex>
    ),
  },
]
