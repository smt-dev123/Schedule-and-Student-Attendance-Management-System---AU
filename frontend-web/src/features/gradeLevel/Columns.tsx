import GradeLevleDelete from '@/routes/admin/grade_level/-actions/Delete'
import GradeLevleUpdate from '@/routes/admin/grade_level/-actions/Update'
import type { GradeLevelType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from 'react-icons/fa'

export const GradeLevelColumns: ColumnDef<GradeLevelType>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'level', header: 'កម្រិតថ្នាក់' },
  { accessorKey: 'description', header: 'ការពិពណ៌នា' },
  {
    id: 'grade_level-actions',
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

        <GradeLevleUpdate data={row.original} />
        <GradeLevleDelete data={row.original} />
      </Flex>
    ),
  },
]
