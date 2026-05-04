import AcademicYearDelete from '@/routes/admin/academic_year/-actions/Delete'
import AcademicYearUpdate from '@/routes/admin/academic_year/-actions/Update'
import type { AcademicYearsType } from '@/types'
import { Flex } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'

export const AcademicYearColumns: ColumnDef<AcademicYearsType>[] = [
  { accessorKey: 'id', header: 'ល.រ' },
  { accessorKey: 'name', header: 'ឆ្នាំសិក្សា' },
  { accessorKey: 'startDate', header: 'ថ្ងៃចាប់ផ្ដើម' },
  { accessorKey: 'endDate', header: 'ថ្ងៃបញ្ចប់' },
  { accessorKey: 'is_current', header: 'ស្ថានភាព' },
  {
    id: 'academic-year-actions',
    header: 'សកម្មភាព',
    enableSorting: false,
    cell: ({ row }) => (
      <Flex gap="2">
        <AcademicYearUpdate data={row.original} />
        <AcademicYearDelete data={row.original} />
      </Flex>
    ),
  },
]
