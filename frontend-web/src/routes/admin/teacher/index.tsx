import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Box, Button, Flex, Select, Text, TextField } from '@radix-ui/themes'
import { IoSearch, IoFilter } from 'react-icons/io5'
import { useTitle } from '@/hooks/useTitle'
import { useQuery } from '@tanstack/react-query'
import { getTeachers } from '@/api/TeacherAPI'
import { getFaculties } from '@/api/FacultyAPI' // នាំចូល API 
import { getAcademicLevels } from '@/api/AcademicLevelAPI' // នាំចូល API
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

  // --- ១. ទាញយកទិន្នន័យពី API សម្រាប់ Dropdowns ---
  const { data: teachersData, isLoading, error } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  })

  const { data: faculties = [] } = useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  })

  const { data: academicLevels = [] } = useQuery({
    queryKey: ['academicLevels'],
    queryFn: getAcademicLevels,
  })

  useEffect(() => {
    setSearchDraft(search)
    setDegreeDraft(degree)
    setFacultyDraft(faculty)
    setMajorDraft(major)
  }, [search, degree, faculty, major])

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
    setSearchDraft('')
    setDegreeDraft('all')
    setFacultyDraft('all')
    setMajorDraft('all')
    navigate({ 
        search: { search: '', degree: 'all', faculty: 'all', major: 'all' } 
    })
  }

  const filteredData = useMemo(() => {
    if (!teachersData) return [];
    
    // ចាប់យក Array តាមរយៈ res.data?.data ដែលអ្នកបានកំណត់ក្នុង getTeachers
    const rawList = Array.isArray(teachersData) ? teachersData : (teachersData as any)?.data || [];

    return rawList.filter((teacher: any) => {
      const matchesSearch = !search ||
        teacher.name?.toLowerCase().includes(search.toLowerCase()) ||
        teacher.id?.toString().includes(search);

      // បើប្រើ ID ពី API ត្រូវធៀបជា String ឬ Number ឱ្យត្រូវគ្នា
      const matchesDegree = degree === 'all' || String(teacher.academicLevelId) === degree;
      const matchesFaculty = faculty === 'all' || String(teacher.facultyId) === faculty;
      
      return matchesSearch && matchesDegree && matchesFaculty;
    });
  }, [teachersData, search, degree, faculty]);

  return (
    <div>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center" mb="2">
          <Text size="5" weight="bold">គ្រូបង្រៀន</Text>
          <Flex gap="2">
            <Button variant="outline" className="cursor-pointer">Export Excel</Button>
            <TeacherCreate />
          </Flex>
        </Flex>

        <Flex justify="between" gap="3" wrap="wrap">
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

          <Flex gap="2" wrap="wrap" align="center">
            {/* --- Select កម្រិតវប្បធម៌ ពី API --- */}
            <Select.Root value={degreeDraft} onValueChange={setDegreeDraft}>
              <Select.Trigger placeholder="កម្រិតវប្បធម៌" />
              <Select.Content>
                <Select.Item value="all">កម្រិតថ្នាក់ទាំងអស់</Select.Item>
                {academicLevels.map((level: any) => (
                  <Select.Item key={level.id} value={String(level.id)}>
                    {level.level}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            {/* --- Select មហាវិទ្យាល័យ ពី API --- */}
            <Select.Root value={facultyDraft} onValueChange={setFacultyDraft}>
              <Select.Trigger placeholder="មហាវិទ្យាល័យ" />
              <Select.Content>
                <Select.Item value="all">មហាវិទ្យាល័យទាំងអស់</Select.Item>
                {faculties.map((f: any) => (
                  <Select.Item key={f.id} value={String(f.id)}>
                    {f.name}
                  </Select.Item>
                ))}
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

        <FetchData isLoading={isLoading} error={error} data={teachersData}>
            <TeacherTable data={filteredData} />
        </FetchData>
      </Flex>
    </div>
  )
}