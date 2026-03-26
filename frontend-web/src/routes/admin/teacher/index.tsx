import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Box, Button, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { IoSearch, IoFilter } from 'react-icons/io5'
import { useTitle } from '@/hooks/useTitle'
import { useQuery } from '@tanstack/react-query'
import { getTeachers } from '@/api/TeacherAPI'
import { TeacherTable } from '@/features/teacher/GenerationTable'
import TeacherCreate from './-actions/Create'
import { useState, useMemo, useEffect } from 'react'
import FetchData from '@/components/FetchData'

type TeacherSearch = {
  search?: string
  degree?: string
  faculty?: string
  major?: string
}

export const Route = createFileRoute('/admin/teacher/')({
  validateSearch: (search: Record<string, unknown>): TeacherSearch => {
    return {
      search: (search.search as string) || '',
      degree: (search.degree as string) || 'all',
      faculty: (search.faculty as string) || 'all',
      major: (search.major as string) || 'all',
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Teacher Management')

  const { search, degree, faculty, major } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const [searchDraft, setSearchDraft] = useState(search)
  const [degreeDraft, setDegreeDraft] = useState(degree)
  const [facultyDraft, setFacultyDraft] = useState(faculty)
  const [majorDraft, setMajorDraft] = useState(major)

  useEffect(() => {
    setSearchDraft(search)
    setDegreeDraft(degree)
    setFacultyDraft(faculty)
    setMajorDraft(major)
  }, [search, degree, faculty, major])

  const { data, isLoading, error } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
    staleTime: 1000 * 60 * 60,
  })

  const handleApplyFilter = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: searchDraft || undefined,
        degree: degreeDraft,
        faculty: facultyDraft,
        major: majorDraft,
      }),
    })
  }

  const handleClearFilter = () => {
    const reset = { search: '', degree: 'all', faculty: 'all', major: 'all' }
    setSearchDraft('')
    setDegreeDraft('all')
    setFacultyDraft('all')
    setMajorDraft('all')
    navigate({ search: reset })
  }

  const filteredData = useMemo(() => {
    const rawList = Array.isArray(data) ? data : (data as any)?.data || (data as any)?.teachers || []

    return rawList.filter((teacher: any) => {
      const matchesSearch = !search ||
        teacher.name?.toLowerCase().includes(search.toLowerCase()) ||
        teacher.id?.toString().includes(search)

      const matchesDegree = degree === 'all' || teacher.degree === degree
      const matchesFaculty = faculty === 'all' || teacher.faculty === faculty
      const matchesMajor = major === 'all' || teacher.major === major

      return matchesSearch && matchesDegree && matchesFaculty && matchesMajor
    })
  }, [data, search, degree, faculty, major])

  if (isLoading || error) {
    return <FetchData isLoading={isLoading} error={error} data={data} />
  }

  return (
    <div>
      <Flex direction="column" gap="4">
        {/* Top Header */}
        <Flex justify="between" align="center" mb="2">
          <Text size="5" weight="bold">គ្រូបង្រៀន</Text>
          <Flex gap="2">
            <Button variant="outline" className="cursor-pointer">Export Excel</Button>
            <Button variant="outline" className="cursor-pointer">បោះពុម្ភ</Button>
            <TeacherCreate />
          </Flex>
        </Flex>

        {/* Filter Bar */}
        <Flex justify="between" gap="3" wrap="wrap">
          {/* Search Field */}
          <Box flexGrow="1" maxWidth="300px">
            <TextField.Root
              placeholder="ស្វែងរក..."
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
            >
              <TextField.Slot><IoSearch /></TextField.Slot>
            </TextField.Root>
          </Box>

          {/* Select Options */}
          <Flex gap="2" wrap="wrap" align="center">
            <Select.Root value={degreeDraft} onValueChange={setDegreeDraft}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="all">កម្រិតថ្នាក់ទាំងអស់</Select.Item>
                <Select.Item value="បរិញ្ញាបត្ររង">បរិញ្ញាបត្ររង</Select.Item>
                <Select.Item value="បរិញ្ញាបត្រ">បរិញ្ញាបត្រ</Select.Item>
                <Select.Item value="បរិញ្ញាបត្រជាន់ខ្ពស់">បរិញ្ញាបត្រជាន់ខ្ពស់</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root value={facultyDraft} onValueChange={setFacultyDraft}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="all">មហាវិទ្យាល័យទាំងអស់</Select.Item>
                <Select.Item value="មវប">មវប</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root value={majorDraft} onValueChange={setMajorDraft}>
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

        {/* Table Section */}
        <TeacherTable data={filteredData} />
      </Flex>
    </div>
  )
}