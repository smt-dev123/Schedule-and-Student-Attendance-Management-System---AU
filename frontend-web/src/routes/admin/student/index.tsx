import { getStudents } from '@/api/StudentAPI'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Select, Text, TextField, Box } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { IoSearch, IoFilter } from 'react-icons/io5'
import { useState, useEffect } from 'react'
import { StudentTable } from '@/features/student/StudentTable'
import FetchData from '@/components/FetchData'
import StudentCreate from './-actions/Create'

type StudentSearch = {
  name?: string
  faculty?: string
  department?: string
  academicLevel?: string
  page?: number
}

export const Route = createFileRoute('/admin/student/')({
  validateSearch: (search: Record<string, unknown>): StudentSearch => {
    return {
      name: (search.name as string) || 'student',
      faculty: (search.faculty as string) || '',
      department: (search.department as string) || '',
      academicLevel: (search.academicLevel as string) || '',
      page: Number(search.page) || 1,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('គ្រប់គ្រងនិស្សិត')

  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const [draft, setDraft] = useState<StudentSearch>(searchParams)

  useEffect(() => {
    setDraft(searchParams)
  }, [searchParams])

  const { data, isLoading, error } = useQuery({
    queryKey: ['students', searchParams],
    queryFn: () =>
      getStudents(
        searchParams.name,
        searchParams.faculty === 'all' ? '' : searchParams.faculty,
        searchParams.department === 'all' ? '' : searchParams.department,
        searchParams.academicLevel === 'all' ? '' : searchParams.academicLevel,
        searchParams.page,
        10
      ),
  })

  const handleApplyFilter = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...draft,
        page: 1,
        name: draft.name || undefined,
        faculty: draft.faculty === 'all' ? undefined : draft.faculty,
        department: draft.department === 'all' ? undefined : draft.department,
        academicLevel: draft.academicLevel === 'all' ? undefined : draft.academicLevel,
      }),
    })
  }

  const handleClearFilter = () => {
    const resetValues = { name: '', faculty: 'all', department: 'all', academicLevel: 'all' }
    setDraft(resetValues)
    navigate({ search: { page: 1 } })
  }

  const students = Array.isArray(data) ? data : (data as any)?.students || []

  return (
    <Flex direction="column" gap="4">
      {/* --- Header Section --- */}
      <Flex justify="between" align="center" mb="2">
        <Text size="5" weight="bold">និស្សិត</Text>
        <Flex gap="2">
          <Button variant="outline" className="cursor-pointer">Export Excel</Button>
          <Button variant="outline" className="cursor-pointer">បោះពុម្ភ</Button>
          <StudentCreate />
        </Flex>
      </Flex>

      {/* --- Filter Section --- */}
      <Flex justify="between" gap="3" wrap="wrap">
        {/* Search Field */}
        <Box flexGrow="1" maxWidth="300px">
          <TextField.Root
            placeholder="ស្វែងរក..."
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
          >
            <TextField.Slot><IoSearch /></TextField.Slot>
          </TextField.Root>
        </Box>

        {/* Select Options */}
        <Flex gap="2" wrap="wrap" align="center">
          <Select.Root value={draft.academicLevel || 'all'} onValueChange={(val) => setDraft({ ...draft, academicLevel: val })}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">កម្រិតថ្នាក់ទាំងអស់</Select.Item>
              <Select.Item value="បរិញ្ញាបត្ររង">បរិញ្ញាបត្ររង</Select.Item>
              <Select.Item value="បរិញ្ញាបត្រ">បរិញ្ញាបត្រ</Select.Item>
              <Select.Item value="បរិញ្ញាបត្រជាន់ខ្ពស់">បរិញ្ញាបត្រជាន់ខ្ពស់</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root value={draft.faculty || 'all'} onValueChange={(val) => setDraft({ ...draft, faculty: val })}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">មហាវិទ្យាល័យទាំងអស់</Select.Item>
              <Select.Item value="មវប">មវប</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root value={draft.department || 'all'} onValueChange={(val) => setDraft({ ...draft, department: val })}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">មុខជំនាញទាំងអស់</Select.Item>
              <Select.Item value="វិទ្យាសាស្រ្ដកុំព្យូទ័រ">វិទ្យាសាស្រ្ដកុំព្យូទ័រ</Select.Item>
              <Select.Item value="ព័ត៌មានវិទ្យា">ព័ត៌មានវិទ្យា</Select.Item>
            </Select.Content>
          </Select.Root>

          <Button onClick={handleApplyFilter} color="indigo" className="cursor-pointer">
            <IoFilter /> ស្វែងរក
          </Button>
          <Button variant="soft" color="gray" onClick={handleClearFilter} className="cursor-pointer">
            សម្អាត
          </Button>
        </Flex>
      </Flex>


      {/* --- Table Section --- */}
      <FetchData isLoading={isLoading} error={error} data={data}>
        <StudentTable data={students} />
      </FetchData>
    </Flex>
  )
}