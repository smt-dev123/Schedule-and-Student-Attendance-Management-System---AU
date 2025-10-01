import type { BuildingType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from 'react-icons/fa'

export const BuildingColumns: ColumnDef<BuildingType>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'អាគារសិក្សា' },
  { accessorKey: 'description', header: 'ការពិពណ៌នា' },
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
