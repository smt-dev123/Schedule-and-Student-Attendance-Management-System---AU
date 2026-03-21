import { getStudents } from '@/api/StudentAPI'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { IoSearch, IoFilter } from 'react-icons/io5'
import { useState, useMemo } from 'react'
import { StudentTable } from '@/features/student/StudentTable'

export const Route = createFileRoute('/admin/student/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Student Management')

  const [searchDraft, setSearchDraft] = useState('')
  const [degreeDraft, setDegreeDraft] = useState('all')
  const [facultyDraft, setFacultyDraft] = useState('all')
  const [majorDraft, setMajorDraft] = useState('all')

  // Filter Button Update
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    degree: 'all',
    faculty: 'all',
    major: 'all'
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })

  // Apply Filter 
  const handleApplyFilter = () => {
    setAppliedFilters({
      search: searchDraft,
      degree: degreeDraft,
      faculty: facultyDraft,
      major: majorDraft
    })
  }

  // Logic Filter
  const filteredData = useMemo(() => {
    if (!data) return []
    return data.filter((student: any) => {
      const matchesSearch = student.name?.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        student.id?.toString().includes(appliedFilters.search)
      const matchesDegree = appliedFilters.degree === 'all' || student.degree === appliedFilters.degree
      const matchesFaculty = appliedFilters.faculty === 'all' || student.faculty === appliedFilters.faculty
      const matchesMajor = appliedFilters.major === 'all' || student.major === appliedFilters.major

      return matchesSearch && matchesDegree && matchesFaculty && matchesMajor
    })
  }, [data, appliedFilters])

  const handleClearFilter = () => {
    setSearchDraft('')
    setDegreeDraft('all')
    setFacultyDraft('all')
    setMajorDraft('all')

    setAppliedFilters({
      search: '',
      degree: 'all',
      faculty: 'all',
      major: 'all'
    })
  }

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading students.</Text>

  return (
    <>
      <Flex direction="column" gap="4" mb="4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <Text size="5" weight="bold" className="tracking-tight">
            តារាងនិស្សិត
          </Text>
          <Flex gap="2">
            <Button variant="outline" color="gray" className="cursor-pointer">
              Export Excel
            </Button>
            <Button variant="outline" color="gray" className="cursor-pointer">
              បោះពុម្ភ
            </Button>
            <Button variant="solid" className="cursor-pointer">
              បន្ថែមនិស្សិត
            </Button>
          </Flex>
        </div>

        {/* Filter Controls Card */}
        <div className="flex justify-between gap-4">

          {/* Search */}
          <div className="flex flex-col gap-1.5 md:col-span-4">
            <TextField.Root
              size="2"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="ស្វែងរកឈ្មោះ ឬអត្តលេខ..."
            >
              <TextField.Slot>
                <IoSearch />
              </TextField.Slot>
            </TextField.Root>
          </div>

          {/* Filter */}
          <div className="flex gap-3 items-end">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Select.Root value={degreeDraft} onValueChange={setDegreeDraft}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">កម្រិតថ្នាក់ទាំងអស់</Select.Item>
                  <Select.Item value="បរិញ្ញាបត្ររង">បរិញ្ញាបត្ររង</Select.Item>
                  <Select.Item value="បរិញ្ញាបត្រ">បរិញ្ញាបត្រ</Select.Item>
                  <Select.Item value="បរិញ្ញាបត្រជាន់ខ្ពស់">បរិញ្ញាបត្រជាន់ខ្ពស់</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Select.Root value={facultyDraft} onValueChange={setFacultyDraft}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">មហាវិទ្យាល័យទាំងអស់</Select.Item>
                  <Select.Item value="មវប">មវប</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Select.Root value={majorDraft} onValueChange={setMajorDraft}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">មុខជំនាញទាំងអស់</Select.Item>
                  <Select.Item value="វិទ្យាសាស្រ្ដកុំព្យូទ័រ">វិទ្យាសាស្រ្ដកុំព្យូទ័រ</Select.Item>
                  <Select.Item value="ព័ត៌មានវិទ្យា">ព័ត៌មានវិទ្យា</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 md:col-span-2">
              <Button
                color="indigo"
                variant="solid"
                onClick={handleApplyFilter}
                className="flex-1 cursor-pointer"
              >
                <IoFilter /> ស្វែងរក
              </Button>

              <Button
                color="gray"
                variant="soft"
                onClick={handleClearFilter}
                className="cursor-pointer"
              >
                សម្អាត
              </Button>
            </div>
          </div>
        </div>
      </Flex>

      {/* Table Section */}
      <StudentTable data={filteredData} />
    </>
  )
}