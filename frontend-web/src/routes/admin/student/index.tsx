import { getStudents } from '@/api/StudentAPI'
import { getFaculties } from '@/api/FacultyAPI'
import { getDepartments } from '@/api/DepartmentAPI'
import { getAcademicLevels } from '@/api/AcademicLevelAPI'
import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Select, Text, TextField, Box } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { IoSearch, IoFilter } from 'react-icons/io5'
import { useState, useEffect, useMemo } from 'react'
import { StudentTable } from '@/features/student/StudentTable'
import FetchData from '@/components/FetchData'
import StudentCreate from './-actions/Create'

type StudentSearch = {
  name?: string
  facultyId?: string
  departmentId?: string
  academicLevelId?: string
  page?: number
}

export const Route = createFileRoute('/admin/student/')({
  validateSearch: (search: Record<string, unknown>): StudentSearch => {
    return {
      name: (search.name as string) || '',
      facultyId: (search.facultyId as string) || 'all',
      departmentId: (search.departmentId as string) || 'all',
      academicLevelId: (search.academicLevelId as string) || 'all',
      page: Number(search.page) || 1,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('គ្រប់គ្រងនិស្សិត')

  const { name, facultyId, departmentId, academicLevelId, page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  // បង្កើត Draft State សម្រាប់ទុកតម្លៃបណ្ដោះអាសន្នពេល User កំពុងរើស Filter
  const [draft, setDraft] = useState<StudentSearch>({ name, facultyId, departmentId, academicLevelId })

  useEffect(() => {
    setDraft({ name, facultyId, departmentId, academicLevelId })
  }, [name, facultyId, departmentId, academicLevelId])

  // --- ១. ទាញយកទិន្នន័យសម្រាប់ Dropdowns ពី API ---
  const { data: faculties = [] } = useQuery({ queryKey: ['faculties'], queryFn: getFaculties })
  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: getDepartments })
  const { data: academicLevels = [] } = useQuery({ queryKey: ['academicLevels'], queryFn: getAcademicLevels })

  // --- ២. ទាញយកទិន្នន័យនិស្សិត ---
  const { data, isLoading, error } = useQuery({
    queryKey: ['students', name, facultyId, departmentId, academicLevelId, page],
    queryFn: () =>
      getStudents(
        name,
        facultyId === 'all' ? '' : facultyId,
        departmentId === 'all' ? '' : departmentId,
        academicLevelId === 'all' ? '' : academicLevelId,
        page,
        10
      ),
  })

  const handleApplyFilter = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...draft,
        page: 1, // រាល់ពេលស្វែងរកថ្មី ត្រូវទៅទំព័រទី១ វិញ
      }),
    })
  }

  const handleClearFilter = () => {
    const reset = { name: '', facultyId: 'all', departmentId: 'all', academicLevelId: 'all', page: 1 }
    setDraft(reset)
    navigate({ search: reset })
  }

  // ចាប់យក Array និស្សិតចេញពី Response (អាស្រ័យលើ Structure របស់ API អ្នក)
  const students = useMemo(() => {
    if (!data) return []
    return Array.isArray(data) ? data : (data as any)?.data || (data as any)?.students || []
  }, [data])

  return (
    <Flex direction="column" gap="4">
      {/* --- Header Section --- */}
      <Flex justify="between" align="center" mb="2">
        <Text size="5" weight="bold">បញ្ជីរាយនាមនិស្សិត</Text>
        <Flex gap="2">
          <Button variant="outline" style={{ cursor: 'pointer' }}>Export Excel</Button>
          <StudentCreate />
        </Flex>
      </Flex>

      {/* --- Filter Section --- */}
      <Flex justify="between" gap="3" wrap="wrap" align="end">
        {/* Search Field */}
        <Box flexGrow="1" maxWidth="300px">
          <Text as="div" size="2" mb="1" weight="bold">ស្វែងរក</Text>
          <TextField.Root
            placeholder="ឈ្មោះ ឬ អត្តលេខ..."
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
          >
            <TextField.Slot><IoSearch /></TextField.Slot>
          </TextField.Root>
        </Box>

        <Flex gap="2" wrap="wrap" align="end">
          {/* កម្រិតវប្បធម៌ */}
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">កម្រិតវប្បធម៌</Text>
            <Select.Root 
              value={draft.academicLevelId} 
              onValueChange={(val) => setDraft({ ...draft, academicLevelId: val })}
            >
              <Select.Trigger style={{ minWidth: '150px' }} />
              <Select.Content>
                <Select.Item value="all">ទាំងអស់</Select.Item>
                {academicLevels.map((level: any) => (
                  <Select.Item key={level.id} value={String(level.id)}>
                    {level.level}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>

          {/* មហាវិទ្យាល័យ */}
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">មហាវិទ្យាល័យ</Text>
            <Select.Root 
              value={draft.facultyId} 
              onValueChange={(val) => setDraft({ ...draft, facultyId: val })}
            >
              <Select.Trigger style={{ minWidth: '150px' }} />
              <Select.Content>
                <Select.Item value="all">ទាំងអស់</Select.Item>
                {faculties.map((f: any) => (
                  <Select.Item key={f.id} value={String(f.id)}>
                    {f.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>

          {/* ដេប៉ាតឺម៉ង់ */}
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">ដេប៉ាតឺម៉ង់</Text>
            <Select.Root 
              value={draft.departmentId} 
              onValueChange={(val) => setDraft({ ...draft, departmentId: val })}
            >
              <Select.Trigger style={{ minWidth: '150px' }} />
              <Select.Content>
                <Select.Item value="all">ទាំងអស់</Select.Item>
                {departments.map((d: any) => (
                  <Select.Item key={d.id} value={String(d.id)}>
                    {d.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>

          <Button onClick={handleApplyFilter} color="indigo" style={{ cursor: 'pointer' }}>
            <IoFilter /> ស្វែងរក
          </Button>
          <Button variant="soft" color="gray" onClick={handleClearFilter} style={{ cursor: 'pointer' }}>
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