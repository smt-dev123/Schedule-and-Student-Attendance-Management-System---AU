import type { ScheduleType } from '@/types'
import { Badge, Flex, IconButton } from '@radix-ui/themes'
import type { ColumnDef } from '@tanstack/react-table'
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from 'react-icons/fa'
import { Link } from '@tanstack/react-router'

export const ScheduleColumns: ColumnDef<ScheduleType>[] = [
  { accessorKey: 'id', header: 'ល.រ' },
  { 
    header: 'មហាវិទ្យាល័យ/ដេប៉ាតឺម៉ង់',
    cell: ({ row }) => {
      const s = row.original;
      return `${s.faculty?.name || ''} / ${s.department?.name || ''}`;
    }
  },
  { 
    header: 'ជំនាន់/ឆ្នាំ/ឆមាស',
    cell: ({ row }) => {
      const s = row.original;
      return `ជំនាន់ទី ${s.generation} (ឆ្នាំទី ${s.year} ឆមាស ${s.semester})`;
    }
  },
  { 
    accessorKey: 'studyShift', 
    header: 'វេនសិក្សា',
    cell: ({ row }) => (
      <Badge color={row.original.studyShift === 'morning' ? 'blue' : 'orange'}>
        {row.original.studyShift === 'morning' ? 'ព្រឹក' : row.original.studyShift === 'evening' ? 'ល្ងាច' : 'យប់'}
      </Badge>
    )
  },
  {
    header: 'បន្ទប់/អគារ',
    cell: ({ row }) => {
      const s = row.original;
      return `${s.classroom?.name || ''} (${s.classroom?.building?.name || ''})`;
    }
  },
  {
    id: 'actions',
    header: 'សកម្មភាព',
    enableSorting: false,
    cell: ({ row }) => {
       const s = row.original as any;
       return (
          <Flex gap="2">
            <IconButton
              size="1"
              color="blue"
              variant="surface"
              style={{ cursor: 'pointer' }}
              asChild
            >
              <Link 
                to="/admin/course/schedule/$scheduleId" 
                params={{ scheduleId: String(row.original.id) }}
              >
                <FaRegEye />
              </Link>
            </IconButton>

            <IconButton
              size="1"
              color="orange"
              variant="surface"
              style={{ cursor: 'pointer' }}
              onClick={() => s.onEdit?.(s.id)}
            >
              <FaRegEdit />
            </IconButton>

            <IconButton
              size="1"
              color="red"
              variant="surface"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (window.confirm('តើអ្នកពិតជាចង់លុបកាលវិភាគនេះមែនទេ?')) {
                  s.onDelete?.(s.id)
                }
              }}
            >
              <FaRegTrashAlt />
            </IconButton>
          </Flex>
       )
    },
  },
]
