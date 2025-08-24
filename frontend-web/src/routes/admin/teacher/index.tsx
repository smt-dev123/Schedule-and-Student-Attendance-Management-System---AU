import { createFileRoute } from '@tanstack/react-router'
import { HiArrowDown, HiArrowsUpDown, HiArrowUp } from 'react-icons/hi2'
import { useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Select,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes'
import { IoSearch } from 'react-icons/io5'
import { useTeacherStore } from '@/stores/Teachers'
import type { TeacherType } from '@/types/teachersType'
import { FaRegEdit } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import { Pagination } from '@/components/Pagination'
import AddTeacher from '@/routes/admin/teacher/-modal/AddTeacher'
import ViewTeacher from './-modal/ViewTeacher'
import DeleteTeacher from './-modal/DeleteTeacher'
import { useTitle } from '@/hooks/useTitle'

export const Route = createFileRoute('/admin/teacher/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Teacher Management')
  const { teachers, loading, error, fetchTeachers } = useTeacherStore()
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState<TeacherType[]>([])

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  useEffect(() => {
    setData(teachers)
  }, [teachers])

  if (error) return <div>Error: {error.join(', ')}</div>

  const handleUpdate = (id: number) => {
    toast.success(`Updated row id ${id}`)
  }

  const columns: ColumnDef<TeacherType>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'ឈ្មោះ' },
    { accessorKey: 'gender', header: 'ភេទ' },
    // { accessorKey: 'marital_status', header: 'ស្ថានភាពគ្រួសារ' },
    // { accessorKey: 'education_level', header: 'កម្រិតវប្បធម៌' },
    { accessorKey: 'email', header: 'អ៊ីម៉ែល' },
    { accessorKey: 'phone', header: 'លេខទូរស័ព្ទ' },
    {
      id: 'actions',
      header: 'សកម្មភាព',
      enableSorting: false,
      cell: ({ row }) => (
        <Flex gap="2">
          <ViewTeacher teachers={row.original} />
          <IconButton
            size="1"
            color="cyan"
            variant="surface"
            style={{ cursor: 'pointer' }}
            onClick={() => handleUpdate(row.original.id)}
          >
            <FaRegEdit />
          </IconButton>
          <DeleteTeacher teachers={row.original} />
        </Flex>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // if (loading) return <div>Loading...</div>

  return (
    <div>
      <Flex direction="column" gap="4">
        <Flex direction="column">
          {/*  */}
          <Flex justify="between" mb="4">
            <Text size="5" className="font-bold">
              គ្រូបង្រៀន
            </Text>
            <Flex gap="2">
              {/* Export */}
              <Button variant="outline" style={{ cursor: 'pointer' }}>
                Export Excel
              </Button>

              <Button variant="outline" style={{ cursor: 'pointer' }}>
                បោះពុម្ភ
              </Button>

              <AddTeacher />
            </Flex>
          </Flex>
          {/* Header */}
          <Flex justify="between">
            {/* Search */}
            <Box width="250px" maxWidth="250px">
              <TextField.Root
                placeholder="ស្វែងរក..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              >
                <TextField.Slot>
                  <IoSearch height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </Box>

            {/* Sort by */}
            <Flex gap="2">
              <Select.Root size="2" defaultValue="ជ្រើសរើសកម្រិតថ្នាក់">
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="ជ្រើសរើសកម្រិតថ្នាក់" disabled>
                    ជ្រើសរើសកម្រិតថ្នាក់
                  </Select.Item>
                  <Select.Item value="កម្រិតថ្នាក់ទាំងអស់">
                    កម្រិតថ្នាក់ទាំងអស់
                  </Select.Item>
                  <Select.Item value="បរិញ្ញាបត្ររង">បរិញ្ញាបត្ររង</Select.Item>
                  <Select.Item value="បរិញ្ញាបត្រ">បរិញ្ញាបត្រ</Select.Item>
                  <Select.Item value="បរិញ្ញាបត្រជាន់ខ្ពស់">
                    បរិញ្ញាបត្រជាន់ខ្ពស់
                  </Select.Item>
                </Select.Content>
              </Select.Root>
              <Select.Root size="2" defaultValue="ជ្រើសរើសមហាវិទ្យាល័យ">
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="ជ្រើសរើសមហាវិទ្យាល័យ" disabled>
                    ជ្រើសរើសមហាវិទ្យាល័យ
                  </Select.Item>
                  <Select.Item value="មហាវិទ្យាល័យទាំងអស់">
                    មហាវិទ្យាល័យទាំងអស់
                  </Select.Item>
                  <Select.Item value="មវប">មវប</Select.Item>
                </Select.Content>
              </Select.Root>
              <Select.Root size="2" defaultValue="ជ្រើសរើសមុខជំនាញ">
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="ជ្រើសរើសមុខជំនាញ" disabled>
                    ជ្រើសរើសមុខជំនាញ
                  </Select.Item>
                  <Select.Item value="មុខជំនាញទាំងអស់">
                    មុខជំនាញទាំងអស់
                  </Select.Item>
                  <Select.Item value="វិទ្យាសាស្រ្ដកុំព្យូទ័រ">
                    វិទ្យាសាស្រ្ដកុំព្យូទ័រ
                  </Select.Item>
                  <Select.Item value="ព័ត៌មានវិទ្យា">ព័ត៌មានវិទ្យា</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
        </Flex>

        {/* Table */}
        <Table.Root variant="surface">
          <Table.Header>
            {table.getHeaderGroups().map((hg) => (
              <Table.Row key={hg.id}>
                {hg.headers.map((header) => (
                  <Table.ColumnHeaderCell key={header.id}>
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanSort() &&
                        ({
                          asc: <HiArrowUp />,
                          desc: <HiArrowDown />,
                        }[header.column.getIsSorted() as string] ?? (
                          <HiArrowsUpDown />
                        ))}
                    </div>
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id} className="hover:bg-gray-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Pagination */}
        <Flex gap="2" justify="end" align="center">
          <Pagination table={table} />
        </Flex>
        <ToastContainer />
      </Flex>
    </div>
  )
}
