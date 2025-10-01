import { useTitle } from '@/hooks/useTitle'
import { Box, Flex, Text, TextField } from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'
import { IoSearch } from 'react-icons/io5'
import AddUser from './-(modal)/AddUser'
import { UserTable } from '@/features/user/UserTable'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/api/UserAPI'

export const Route = createFileRoute('/admin/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('User Management')

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
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
              អ្នកប្រើប្រាស់
            </Text>
            {/* បង្កើតអ្នកប្រើប្រាស់ */}
            <AddUser />
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
          </Flex>
        </Flex>

        {/* Table */}
        <UserTable data={data} />
      </Flex>
    </div>
  )
}
