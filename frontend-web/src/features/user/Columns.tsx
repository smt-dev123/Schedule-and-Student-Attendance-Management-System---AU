import type { UsersType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEye } from 'react-icons/fa'

import UserUpdate from '@/routes/admin/user/-actions/Update'
import UserDelete from '@/routes/admin/user/-actions/Delete'

export const UserColumns: ColumnDef<UsersType>[] = [
  {
    accessorKey: 'no',
    header: 'ល.រ',
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>
    },
  },
  { accessorKey: 'name', header: 'ឈ្មោះ' },
  { accessorKey: 'email', header: 'អ៊ីមែល' },
  { accessorKey: 'role', header: 'តួនាទី' },
  {
    id: 'user-actions',
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

        <UserUpdate user={row.original} />

        <UserDelete userId={row.original.id} userName={row.original.name} />
      </Flex>
    ),
  },
]
