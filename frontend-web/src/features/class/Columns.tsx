import type { ClassesType } from '@/types'
import { Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from 'react-icons/fa'

export const ClassColumns: ColumnDef<ClassesType>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'faculty.name', header: 'មហាវិទ្យាល័យ' },
  { accessorKey: 'gradeLevel.name', header: 'កម្រិតថ្នាក់' },
  { accessorKey: 'generation.name', header: 'មុខជំនាញ' },
  { accessorKey: 'room.name', header: 'បន្ទប់' },
  {
    id: 'actions',
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

        <IconButton
          size="1"
          color="cyan"
          variant="surface"
          style={{ cursor: 'pointer' }}
          // onClick={() => handleUpdate(row.original.id)}
        >
          <FaRegEdit />
        </IconButton>

        <IconButton
          size="1"
          color="red"
          variant="surface"
          style={{ cursor: 'pointer' }}
        >
          <FaRegTrashAlt />
        </IconButton>
      </Flex>
    ),
  },
]
