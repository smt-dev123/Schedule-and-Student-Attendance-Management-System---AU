import GradeLevleDelete from '@/routes/admin/grade_level/-actions/Delete'
import GradeLevleUpdate from '@/routes/admin/grade_level/-actions/Update'
import type { AcademicLevelType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const AcademicLevelColumns: ColumnDef<AcademicLevelType>[] = [
  { accessorKey: 'id', header: 'ល.រ' },
  { accessorKey: 'level', header: 'កម្រិតថ្នាក់' },
  {
    id: 'academic_level-actions',
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
