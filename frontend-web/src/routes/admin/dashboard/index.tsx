import { useTitle } from '@/hooks/useTitle'
import {
  Box,
  Card,
  Flex,
  Grid,
  Separator,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes'
import { createFileRoute, Link } from '@tanstack/react-router'
import { IoSearch } from 'react-icons/io5'

export const Route = createFileRoute('/admin/dashboard/')({
  component: RouteComponent,
})

const headerCards = [
  {
    title: 'បុគ្គលិក',
    count: 10,
  },
  {
    title: 'គ្រូបង្រៀន',
    count: 10,
  },
  {
    title: 'និស្សិត',
    count: 10,
  },
  {
    title: 'បោះបង់ការសិក្សា',
    count: 10,
  },
]
const topAtts = [
  {
    name: 'សិទ្ធ ធារ៉ា',
    gender: 'ប្រុស',
    department: 'វិទ្យាសាស្រ្ដកុំព្យូទ័រ',
  },
  {
    name: 'សិទ្ធ ស្រីនិច',
    gender: 'ស្រី',
    department: 'វិទ្យាសាស្រ្ដកុំព្យូទ័រ',
  },
  {
    name: 'សិទ្ធ ធារ៉ា',
    gender: 'ប្រុស',
    department: 'វិទ្យាសាស្រ្ដកុំព្យូទ័រ',
  },
  {
    name: 'សិទ្ធ ស្រីនិច',
    gender: 'ស្រី',
    department: 'វិទ្យាសាស្រ្ដកុំព្យូទ័រ',
  },
  {
    name: 'សិទ្ធ ស្រីនិច',
    gender: 'ស្រី',
    department: 'វិទ្យាសាស្រ្ដកុំព្យូទ័រ',
  },
]

function RouteComponent() {
  useTitle('Dashboard')

  return (
    <>
      <Flex direction="column" gap="4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {headerCards.map((card, index) => (
            <Card key={index}>
              <Flex direction="column" width="100%">
                <Text weight="bold">{card.title}</Text>
                <Text className="text-2xl font-black">{card.count}</Text>
              </Flex>
            </Card>
          ))}
        </div>

        {/*  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <Flex
              className="px-2"
              direction="row"
              justify="between"
              width="100%"
            >
              <Text weight="bold">និស្សិតវត្តមានច្រើន</Text>

              <Box width="200px" maxWidth="220px">
                <TextField.Root size="1" placeholder="ស្វែងរក...">
                  <TextField.Slot>
                    <IoSearch height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </Box>
            </Flex>
            <Separator my="3" size="4" />
            {/* Table */}
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>គោត្តនាម-នាម</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>ភេទ</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>មុខជំនាញ</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>សកម្មភាព</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {topAtts.map((att, index) => (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>{att.name}</Table.RowHeaderCell>
                    <Table.Cell>{att.gender}</Table.Cell>
                    <Table.Cell>{att.department}</Table.Cell>
                    <Table.Cell>
                      <Link to="/admin/dashboard" className="text-blue-500">
                        បង្ហាញ
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>

          <Card>
            <Flex direction="column" width="100%">
              <Text weight="bold">ក្រាប</Text>
              <Separator my="3" size="4" />
            </Flex>
          </Card>
        </div>
      </Flex>
    </>
  )
}
