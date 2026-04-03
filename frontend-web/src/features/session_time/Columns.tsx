import SessionTimeDelete from '@/routes/admin/session_time/-actions/Delete'
import SessionTimeUpdate from '@/routes/admin/session_time/-actions/Update'
import type { AcademicYearsType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const AcademicYearColumns: ColumnDef<AcademicYearsType>[] = [
  { accessorKey: 'id', header: 'ល.រ' },
  { accessorKey: 'shift', header: 'ពេលសិក្សា' },
  { accessorKey: 'first_session_start_time', header: 'ម៉ោងចូលរៀនវគ្គទី១' },
  { accessorKey: 'first_session_end_time', header: 'ម៉ោងចេញរៀនវគ្គទី១' },
  { accessorKey: 'second_session_start_time', header: 'ម៉ោងចូលរៀនវគ្គទី២' },
  { accessorKey: 'second_session_end_time', header: 'ម៉ោងចេញរៀនវគ្គទី២' },
  { accessorKey: 'description', header: 'បរិយាយ' },
  { accessorKey: 'is_active', header: 'ស្ថានភាព' },
  {
    id: 'session-time-actions',
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

        <SessionTimeUpdate data={row.original} />
        <SessionTimeDelete data={row.original} />
      </Flex>
    ),
  },
]
