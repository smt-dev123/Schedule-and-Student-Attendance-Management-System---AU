import SessionTimeDelete from '@/routes/admin/session_time/-actions/Delete'
import SessionTimeUpdate from '@/routes/admin/session_time/-actions/Update'
import type { SessionTimeType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

export const SessionTimeColumns: ColumnDef<SessionTimeType>[] = [
  { accessorKey: 'id', header: 'ល.រ' },
  { accessorKey: 'shift', header: 'ពេលសិក្សា' },
  { accessorKey: 'firstSessionStartTime', header: 'ម៉ោងចូលរៀនវគ្គទី១' },
  { accessorKey: 'firstSessionEndTime', header: 'ម៉ោងចេញរៀនវគ្គទី១' },
  { accessorKey: 'secondSessionStartTime', header: 'ម៉ោងចូលរៀនវគ្គទី២' },
  { accessorKey: 'secondSessionEndTime', header: 'ម៉ោងចេញរៀនវគ្គទី២' },
  { accessorKey: 'description', header: 'បរិយាយ' },
  { accessorKey: 'isActive', header: 'ស្ថានភាព' },
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
