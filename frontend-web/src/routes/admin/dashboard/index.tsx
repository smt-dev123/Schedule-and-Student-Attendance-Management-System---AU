import { useTitle } from '@/hooks/useTitle'
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Separator,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'
import { IoSearch, IoPeople, IoSchool, IoPerson, IoExit, IoTrendingUp } from 'react-icons/io5'
import {
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  AreaChart,
  Area,
} from 'recharts'

export const Route = createFileRoute('/admin/dashboard/')({
  component: RouteComponent,
})

// --- Data សម្រាប់ប៊ូតុងស្ថិតិខាងលើ ---
const headerCards = [
  { title: 'បុគ្គលិក', count: 12, icon: <IoPeople size="22" />, color: 'blue' },
  { title: 'គ្រូបង្រៀន', count: 45, icon: <IoSchool size="22" />, color: 'green' },
  { title: 'និស្សិត', count: 1250, icon: <IoPerson size="22" />, color: 'indigo' },
  { title: 'បោះបង់', count: 5, icon: <IoExit size="22" />, color: 'red' },
]

// --- Data សម្រាប់ក្រាបសសរ (និស្សិតតាមជំនាញ) ---
const barData = [
  { name: 'ព័ត៌មានវិទ្យា', value: 650, color: '#3b82f6' },
  { name: 'វិទ្យាសាស្រ្ដ', value: 400, color: '#10b981' },
  { name: 'គ្រប់គ្រង', value: 300, color: '#8b5cf6' },
  { name: 'ភាសា', value: 200, color: '#f59e0b' },
]

// --- Data សម្រាប់ក្រាបខ្សែ (និន្នាការវត្តមានប្រចាំសប្តាហ៍) ---
const trendData = [
  { day: 'ចន្ទ', count: 950 },
  { day: 'អង្គារ', count: 1100 },
  { day: 'ពុធ', count: 1050 },
  { day: 'ព្រហ', count: 1200 },
  { day: 'សុក្រ', count: 1150 },
  { day: 'សៅរ៍', count: 800 },
]

const topAtts = [
  { name: 'សិទ្ធ ធារ៉ា', gender: 'ប្រុស', department: 'វិទ្យាសាស្រ្ដកុំព្យូទ័រ' },
  { name: 'សិទ្ធ ស្រីនិច', gender: 'ស្រី', department: 'វិទ្យាសាស្រ្ដកុំព្យូទ័រ' },
  { name: 'បាន វណ្ណេង', gender: 'ប្រុស', department: 'ព័ត៌មានវិទ្យា' },
  { name: 'តុញ ណារី', gender: 'ស្រី', department: 'ឌីជីថលម៉ាឃីតធីង' },
]

// 1. Component ក្រាបសសរ
function StudentBarChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
          {barData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// 2. Component ក្រាបខ្សែ (Area Chart)
function AttendanceTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={trendData}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
        <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function RouteComponent() {
  useTitle('Dashboard')

  return (
    <Flex direction="column" gap="4">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {headerCards.map((card, index) => (
          <Card key={index}>
            <Flex align="center" gap="3">
              <Box className={`p-2 rounded-md`} style={{ backgroundColor: `var(--${card.color}-3)`, color: `var(--${card.color}-9)` }}>
                {card.icon}
              </Box>
              <Flex direction="column">
                <Text size="1" color="gray">{card.title}</Text>
                <Text size="5" weight="bold">{card.count}</Text>
              </Flex>
            </Flex>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Heading size="3" mb="3">ស្ថិតិនីស្សិតតាមជំនាញ</Heading>
          <StudentBarChart />
        </Card>
        <Card>
          <Flex align="center" gap="2" mb="3">
            <Heading size="3">និន្នាការវត្តមានប្រចាំសប្តាហ៍</Heading>
            <Badge color="green" variant="soft"><IoTrendingUp /> +12%</Badge>
          </Flex>
          <AttendanceTrendChart />
        </Card>
      </div>

      {/* Table Row */}
      <Card>
        <Flex justify="between" align="center" mb="4">
          <Heading size="3">និស្សិតវត្តមានច្រើនជាងគេ</Heading>
          <Box width="200px">
            <TextField.Root size="2" placeholder="ស្វែងរក...">
              <TextField.Slot><IoSearch /></TextField.Slot>
            </TextField.Root>
          </Box>
        </Flex>
        <Table.Root variant="ghost" size="1">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>គោត្តនាម-នាម</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>ភេទ</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>មុខជំនាញ</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">សកម្មភាព</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {topAtts.map((att, index) => (
              <Table.Row key={index} align="center">
                <Table.RowHeaderCell><Text weight="bold">{att.name}</Text></Table.RowHeaderCell>
                <Table.Cell>
                  <Badge color={att.gender === 'ស្រី' ? 'pink' : 'blue'} variant="soft">{att.gender}</Badge>
                </Table.Cell>
                <Table.Cell>{att.department}</Table.Cell>
                <Table.Cell align="right">
                  <Button variant="ghost" size="1">បង្ហាញ</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Flex>
  )
}