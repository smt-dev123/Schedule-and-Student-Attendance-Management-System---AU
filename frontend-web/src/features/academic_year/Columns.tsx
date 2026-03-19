import AcademicYearDelete from '@/routes/admin/academic_year/-actions/Delete'
import AcademicYearUpdate from '@/routes/admin/academic_year/-actions/Update'
import type { AcademicYearsType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const AcademicYearColumns: ColumnDef<AcademicYearsType>[] = [
  { accessorKey: 'id', header: 'ល.រ' },
  { accessorKey: 'name', header: 'ឆ្នាំសិក្សា' },
  { accessorKey: 'description', header: 'ការពិពណ៌នា' },
  {
    id: 'academic-year-actions',
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

        <AcademicYearUpdate data={row.original} />
        <AcademicYearDelete data={row.original} />
      </Flex>
    ),
  },
]
