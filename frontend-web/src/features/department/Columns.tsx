import DepartmentDelete from '@/routes/admin/department/-actions/Delete'
import DepartmentUpdate from '@/routes/admin/department/-actions/Update'
import type { DepartmentsType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const DepartmentColumns: ColumnDef<DepartmentsType>[] = [
  { accessorKey: 'id', header: 'ល.រ' },
  { accessorKey: 'name', header: 'តេប៉ាតឺម៉ង់' },
  { accessorKey: 'faculty.name', header: 'មហាវិទ្យាល័យ' },
  {
    id: 'department-actions',
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

        <DepartmentUpdate data={row.original} />
        <DepartmentDelete data={row.original} />
      </Flex>
    ),
  },
]
