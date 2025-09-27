import { useTitle } from '@/hooks/useTitle'
import { Box, Flex, IconButton, Table, Text, TextField } from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'
import AddUser from './-(modal)/AddUser'

export const Route = createFileRoute('/admin/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('User Management')

  return (
    <div>
      <Flex direction="column" gap="4">
        <Flex direction="column">
          {/*  */}
          <Flex justify="between" mb="4">
            <Text size="5" className="font-bold">
              អ្នកប្រើប្រាស់
            </Text>
            {/* បង្កើតអ្នកប្រើប្រាស់ */}
            <AddUser />
          </Flex>
          {/* Header */}
          <Flex justify="between">
            {/* Search */}
            <Box width="250px" maxWidth="250px">
              <TextField.Root placeholder="ស្វែងរក...">
                <TextField.Slot>
                  <IoSearch height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
          </Flex>
        </Flex>
        {/* Table */}
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                ឈ្មោះអ្នកប្រើប្រាស់
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>អ៊ីម៉ែល</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>មុខតំណែង</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="w-36">
                សកម្មភាព
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell>1</Table.RowHeaderCell>
              <Table.Cell>លុយ សុមាត្រា</Table.Cell>
              <Table.Cell>smt@gmail.com</Table.Cell>
              <Table.Cell>Admin</Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <IconButton
                    color="indigo"
                    variant="surface"
                    size="1"
                    style={{ cursor: 'pointer' }}
                  >
                    <FaRegEye />
                  </IconButton>
                  <IconButton
                    color="cyan"
                    variant="surface"
                    size="1"
                    style={{ cursor: 'pointer' }}
                  >
                    <FaRegEdit />
                  </IconButton>
                  <IconButton
                    color="crimson"
                    variant="surface"
                    size="1"
                    style={{ cursor: 'pointer' }}
                  >
                    <FaRegTrashAlt />
                  </IconButton>
                </Flex>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Flex>
    </div>
  )
}
