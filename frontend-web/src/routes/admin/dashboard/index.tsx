import { useTitle } from '@/hooks/useTitle'
import { Box, Card, CheckboxCards, Flex, Grid, Text } from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Dashboard')

  return (
    <>
      <Flex direction="column" gap="4">
        <Grid columns="4" gap="4" width="auto">
          <Card>
            <Flex direction="column" width="100%">
              <Text weight="bold">បុគ្គលិក</Text>
              <Text>១០</Text>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" width="100%">
              <Text weight="bold">គ្រូបង្រៀន</Text>
              <Text>១០</Text>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" width="100%">
              <Text weight="bold">និស្សិត</Text>
              <Text>១០</Text>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" width="100%">
              <Text weight="bold">បោះបង់ការសិក្សា</Text>
              <Text>១</Text>
            </Flex>
          </Card>
        </Grid>

        <Grid columns="2" gap="4" width="auto">
          <Card>
            <Flex direction="column" width="100%">
              <Text weight="bold">ក្រាប១</Text>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" width="100%">
              <Text weight="bold">ក្រាប២</Text>
            </Flex>
          </Card>
        </Grid>
      </Flex>
    </>
  )
}
