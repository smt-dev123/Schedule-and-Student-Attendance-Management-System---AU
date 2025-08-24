import {
  Box,
  Button,
  Flex,
  Select,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AiOutlineSchedule } from 'react-icons/ai'
import { IoSearch } from 'react-icons/io5'
import { MdOutlineDateRange } from 'react-icons/md'

export const Route = createFileRoute('/admin/classes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Flex direction="column" gap="4">
        <Flex direction="column">
          {/*  */}
          <Flex justify="between" mb="4">
            <Text size="5" className="font-bold">
              ថ្នាក់រៀន
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
                បង្កើតថ្នាក់រៀន
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
              <Select.Root size="2" defaultValue="ជ្រើសរើសជំនាន់">
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="ជ្រើសរើសជំនាន់" disabled>
                    ជ្រើសរើសជំនាន់
                  </Select.Item>
                  <Select.Item value="ជំនាន់ទាំងអស់">ជំនាន់ទាំងអស់</Select.Item>
                </Select.Content>
              </Select.Root>

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
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>មុខជំនាញ</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>កម្រិតថ្នាក់</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ជំនាន់</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>អគារ</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>បន្ទប់</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="w-56">
                សកម្មភាព
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell>1</Table.RowHeaderCell>
              <Table.Cell>វិទ្យាសាស្រ្ដកុំព្យូទ័រ</Table.Cell>
              <Table.Cell>បរិញ្ញាបត្រ</Table.Cell>
              <Table.Cell>១៩</Table.Cell>
              <Table.Cell>បណ្ឌិត សៀង ណាំ</Table.Cell>
              <Table.Cell>ស្រុកកងមាស</Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Button asChild color="indigo" variant="surface" size="1">
                    <Link
                      to="/admin/classes/schedule/$scheduleId"
                      params={{ scheduleId: '1' }}
                    >
                      <AiOutlineSchedule />
                      មើលកាលវិភាគ
                    </Link>
                  </Button>
                  <Button asChild color="cyan" variant="surface" size="1">
                    <Link
                      to="/admin/classes/attendance/$attendanceId"
                      params={{ attendanceId: '1' }}
                    >
                      <MdOutlineDateRange />
                      វត្តមាននិស្សិត
                    </Link>
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Flex>
    </div>
  )
}
