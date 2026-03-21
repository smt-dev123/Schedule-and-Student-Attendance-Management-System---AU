import { createFileRoute } from '@tanstack/react-router'
import { Box, Button, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { IoSearch } from 'react-icons/io5'
import { useTitle } from '@/hooks/useTitle'
import { useQuery } from '@tanstack/react-query'
import { getTeachers } from '@/api/TeacherAPI'
import { TeacherTable } from '@/features/teacher/GenerationTable'
import TeacherCreate from './-actions/Create'

export const Route = createFileRoute('/admin/teacher/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Teacher Management')
  const { data, isLoading, error } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading students.</Text>

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

              <TeacherCreate />
            </Flex>
          </Flex>
          {/* Header */}
          <Flex justify="between" gap="2">
            {/* Search */}
            <Box width="250px" maxWidth="250px">
              <TextField.Root placeholder="ស្វែងរក...">
                <TextField.Slot>
                  <IoSearch height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </Box>

            {/* Sort by */}
            <div className="flex flex-wrap gap-2">
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
            </div>
          </Flex>
        </Flex>

        {/* Table */}
        <TeacherTable data={data} />
      </Flex>
    </div>
  )
}
