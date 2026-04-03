import GenerationDelete from '@/routes/admin/generation/-actions/Delete'
import GenerationUpdate from '@/routes/admin/generation/-actions/Update'
import type { AcademicLevelType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const GenerationColumns: ColumnDef<AcademicLevelType>[] = [
  { accessorKey: 'id', header: 'ល.រ' },
  { accessorKey: 'level', header: 'កម្រិតថ្នាក់' },
  {
    id: 'generation-actions',
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

        <GenerationUpdate data={row.original} />
        <GenerationDelete data={row.original} />
      </Flex>
    ),
  },
]
