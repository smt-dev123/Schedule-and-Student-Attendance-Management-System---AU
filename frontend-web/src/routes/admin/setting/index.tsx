import { useTitle } from '@/hooks/useTitle'
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Section,
  Select,
  Separator,
  Switch,
  Tabs,
  Text,
  TextField,
} from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/setting/')({
  component: RouteComponent,
})

function RouteComponent() {
  useTitle('Settings')

  return (
    <Card size="3">
      {/* Header Section */}
      <Flex justify="between" align="center" mb="5">
        <Box>
          <Text as="div" size="6" weight="bold">
            ការកំណត់ (Settings)
          </Text>
          <Text as="div" size="2" color="gray">
            គ្រប់គ្រងគណនី និងការកំណត់ប្រព័ន្ធរបស់អ្នកនៅទីនេះ
          </Text>
        </Box>
        <Button size="3" variant="solid">
          រក្សាទុកការផ្លាស់ប្តូរ
        </Button>
      </Flex>

      <Tabs.Root defaultValue="account">
        <Tabs.List size="2">
          <Tabs.Trigger value="account">គណនី (Account)</Tabs.Trigger>
          <Tabs.Trigger value="security">សុវត្ថិភាព (Security)</Tabs.Trigger>
          <Tabs.Trigger value="backup">ការចម្លងទុក (Backup)</Tabs.Trigger>
        </Tabs.List>

        <Box pt="4">
          {/* --- TAB: ACCOUNT --- */}
          <Tabs.Content value="account">
            <Flex direction="column" gap="4">
              {/* Profile Picture Card */}
              <Card variant="surface">
                <Flex justify="between" align="center" wrap="wrap" gap="3">
                  <Flex gap="4" align="center">
                    <Avatar
                      size="6"
                      src="https://avatars.githubusercontent.com/u/162150380?v=4"
                      radius="full"
                      fallback="T"
                    />
                    <Box>
                      <Text as="div" size="3" weight="bold">
                        រូបភាពកម្រងព័ត៌មាន
                      </Text>
                      <Text as="div" size="2" color="gray">
                        JPG, PNG ទំហំអតិបរមា 10MB
                      </Text>
                    </Box>
                  </Flex>
                  <Flex gap="2">
                    <Button variant="soft" color="blue">
                      ប្តូររូបភាព
                    </Button>
                    <Button variant="soft" color="red">
                      លុប
                    </Button>
                  </Flex>
                </Flex>
              </Card>

              {/* Personal Information */}
              <Box>
                <Text size="4" weight="bold">ព័ត៌មានផ្ទាល់ខ្លួន</Text>
                <Separator size="4" my="3" />
                <Flex gap="4" direction={{ initial: 'column', sm: 'row' }} mb="4">
                  <label className="grow">
                    <Text as="div" size="2" mb="1" weight="bold">នាមត្រកូល</Text>
                    <TextField.Root placeholder="បញ្ចូលនាមត្រកូល" />
                  </label>
                  <label className="grow">
                    <Text as="div" size="2" mb="1" weight="bold">នាមខ្លួន</Text>
                    <TextField.Root placeholder="បញ្ចូលនាមខ្លួន" />
                  </label>
                </Flex>

                <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
                  <label className="grow">
                    <Text as="div" size="2" mb="1" weight="bold">អ៊ីមែល</Text>
                    <TextField.Root type="email" placeholder="example@mail.com" />
                  </label>
                  <label className="grow">
                    <Text as="div" size="2" mb="1" weight="bold">លេខទូរស័ព្ទ</Text>
                    <TextField.Root type="tel" placeholder="012 345 678" />
                  </label>
                </Flex>
              </Box>

              <Box mt="2">
                <Text size="4" weight="bold">ការកំណត់ប្រព័ន្ធ</Text>
                <Separator size="4" my="3" />
                <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
                  <Box className="grow">
                    <Text as="div" size="2" mb="1" weight="bold">
                      ឆ្នាំសិក្សាបច្ចុប្បន្ន (Academic Year)
                    </Text>
                    <Select.Root defaultValue="2024-2025">
                      <Select.Trigger className="w-full" placeholder="ជ្រើសរើសឆ្នាំសិក្សា" />
                      <Select.Content position="popper">
                        <Select.Item value="2023-2024">២០២៣ - ២០២៤</Select.Item>
                        <Select.Item value="2024-2025">២០២៤ - ២០២៥</Select.Item>
                        <Select.Item value="2025-2026">២០២៥ - ២០២៦</Select.Item>
                      </Select.Content>
                    </Select.Root>
                    <Text as="div" size="1" color="gray" mt="1">
                      * រាល់ទិន្នន័យរបាយការណ៍នឹងត្រូវបានបង្ហាញផ្អែកលើឆ្នាំសិក្សានេះ
                    </Text>
                  </Box>
                  <Box className="grow" />
                </Flex>
              </Box>
            </Flex>
          </Tabs.Content>

          {/* --- TAB: SECURITY --- */}
          <Tabs.Content value="security">
            <Flex direction="column" gap="4">
              <Text size="4" weight="bold">ប្តូរលេខសម្ងាត់</Text>
              <Separator size="4" my="1" />

              <Box maxWidth="400px">
                <Flex direction="column" gap="3">
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">លេខសម្ងាត់ចាស់</Text>
                    <TextField.Root type="password" placeholder="••••••••" />
                  </label>
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">លេខសម្ងាត់ថ្មី</Text>
                    <TextField.Root type="password" placeholder="••••••••" />
                  </label>
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">បញ្ជាក់លេខសម្ងាត់ថ្មី</Text>
                    <TextField.Root type="password" placeholder="••••••••" />
                  </label>
                  <Button mt="2" variant="outline" style={{ width: 'fit-content' }}>
                    ធ្វើបច្ចុប្បន្នភាពលេខសម្ងាត់
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </Tabs.Content>

          {/* --- TAB: BACKUP --- */}
          <Tabs.Content value="backup">
            <Flex direction="column" gap="5">
              <Box>
                <Text size="4" weight="bold">ការចម្លងទុកទិន្នន័យ (Backup & Restore)</Text>
                <Text size="2" color="gray">គ្រប់គ្រងសុវត្ថិភាពទិន្នន័យប្រព័ន្ធរបស់អ្នក</Text>
              </Box>

              <Card variant="surface">
                <Flex justify="between" align="center">
                  <Box>
                    <Text as="div" size="3" weight="bold">Auto Backup</Text>
                    <Text as="div" size="2" color="gray">
                      ដំណើរការការចម្លងទុកដោយស្វ័យប្រវត្តិទៅកាន់ Cloud Storage
                    </Text>
                  </Box>
                  <Switch defaultChecked size="3" color="green" />
                </Flex>
              </Card>

              <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
                <Box className="grow">
                  <Text as="div" size="2" mb="1" weight="bold">ភាពញឹកញាប់ (Frequency)</Text>
                  <Select.Root defaultValue="daily">
                    <Select.Trigger className="w-full" />
                    <Select.Content>
                      <Select.Item value="hourly">រាល់ម៉ោង</Select.Item>
                      <Select.Item value="daily">រៀងរាល់ថ្ងៃ</Select.Item>
                      <Select.Item value="weekly">រៀងរាល់សប្តាហ៍</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>

                <Box className="grow">
                  <Text as="div" size="2" mb="1" weight="bold">រក្សាទុកក្នុងរយៈពេល (Retention)</Text>
                  <Select.Root defaultValue="30">
                    <Select.Trigger className="w-full" />
                    <Select.Content>
                      <Select.Item value="7">៧ ថ្ងៃ</Select.Item>
                      <Select.Item value="30">៣០ ថ្ងៃ</Select.Item>
                      <Select.Item value="always">រហូតដល់លុបដោយផ្ទាល់</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
              </Flex>

              <Separator size="4" />

              <Box>
                <Text size="3" weight="bold" mb="2" as="div">សកម្មភាពបន្ទាប់បន្សំ</Text>
                <Flex gap="3">
                  <Button variant="soft" color="gray">
                    ទាញយក Database ឥឡូវនេះ (.sql)
                  </Button>
                  <Button variant="soft" color="orange">
                    ផ្ទេរទិន្នន័យទៅ Google Drive
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Card>
  )
}