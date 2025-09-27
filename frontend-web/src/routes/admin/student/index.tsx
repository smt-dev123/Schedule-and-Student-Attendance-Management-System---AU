import { getStudents } from '@/api/StudentAPI'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { IoSearch } from 'react-icons/io5'
import { useState } from 'react'
import { StudentTable } from '@/features/student/StudentTable'

export const Route = createFileRoute('/admin/student/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Student Management')
  const [globalFilter, setGlobalFilter] = useState('')
  const { data, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  })

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading students.</Text>
  return (
    <>
      <Flex direction="column" gap="2" mb="4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-2">
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
        </div>
        {/* SortBy */}
        <div className="flex flex-col md:flex-row justify-between gap-2">
          {/* Search */}
          <div className="min-w-80">
            <TextField.Root
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="ស្វែងរក..."
            >
              <TextField.Slot>
                <IoSearch height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </div>

          {/* Sort by */}
          <div className="flex flex-col md:flex-row gap-2">
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
        </div>
      </Flex>

      {/* Table */}
      <StudentTable data={data} />
    </>
  )
}
