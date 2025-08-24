import { useTitle } from '@/hooks/useTitle'
import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Select,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'

export const Route = createFileRoute('/admin/student/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Student Management')
  return (
    <>
      <Flex direction="column" mb="4">
        {/*  */}
        <Flex justify="between" mb="4">
          <Text size="5" className="font-bold">
            តារាងនិស្សិត
          </Text>
          <Flex gap="2">
            {/* Export */}
            <Button variant="outline" style={{ cursor: 'pointer' }}>
              Export Excel
            </Button>

            <Button variant="outline" style={{ cursor: 'pointer' }}>
              បោះពុម្ភ
            </Button>

            <Button variant="solid" style={{ cursor: 'pointer' }}>
              បន្ថែមនិស្សិត
            </Button>
          </Flex>
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
          <Table.Row>
            <Table.ColumnHeaderCell>ល.រ</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>លេខកាត</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>គោត្តនាម-នាម</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ភេទ</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>មុខជំនាញ</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ថ្ងៃ ខែ ឆ្នាំកំណើត</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>លេខទូរស័ព្ទ</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>អ៊ីម៉ែល</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ស្ថានភាព</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="w-36">
              សកម្មភាព
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>1</Table.RowHeaderCell>
            <Table.Cell>0001</Table.Cell>
            <Table.Cell>លុយ សុមាត្រា</Table.Cell>
            <Table.Cell>ប្រុស</Table.Cell>
            <Table.Cell>វិទ្យាសាស្រ្ដកុំព្យូទ័រ</Table.Cell>
            <Table.Cell>1/2/2003</Table.Cell>
            <Table.Cell>061 873 789</Table.Cell>
            <Table.Cell>smt@gmail.com</Table.Cell>
            <Table.Cell>
              <Badge> កំពុងសិក្សា</Badge>
            </Table.Cell>
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
    </>
  )
}
