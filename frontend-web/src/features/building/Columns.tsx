import BuildingDelete from '@/routes/admin/building/-actions/Delete'
import BuildingUpdate from '@/routes/admin/building/-actions/Update'
import type { BuildingType } from '@/types'
import { Badge, Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const BuildingColumns: ColumnDef<BuildingType>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'អាគារសិក្សា' },
  { accessorKey: 'description', header: 'ការពិពណ៌នា' },
  {
    id: 'actions',
    header: 'សកម្មភាព',
    cell: ({ row }) => (
      <Badge
      color={row.original.isActive ? 'blue' : 'red'}
      >{row.original.isActive ? 'បង្ហាញ' : 'មិនបង្ហាញ'}</Badge>
    ),
  },
  {
    id: 'actions',
    header: 'សកម្មភាព',
    enableSorting: false,
    cell: ({ row }) => (
      <Flex gap="2">
        <IconButton
          size="1"
          color="violet"
          variant="surface"
          style={{ cursor: 'pointer' }}
        >
          <FaRegEye />
        </IconButton>

        <BuildingUpdate data={row.original} />
        <BuildingDelete data={row.original} />
      </Flex>
    ),
  },
]
