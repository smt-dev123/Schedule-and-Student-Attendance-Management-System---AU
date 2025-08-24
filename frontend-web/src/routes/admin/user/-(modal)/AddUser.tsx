import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from '@radix-ui/themes'
import { useState } from 'react'
import { toast } from 'react-toastify'

const AddUser = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [open, setOpen] = useState(false)

  const handleCreate = () => {
    // Simple validation
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error('Valid email is required')
      return
    }
    toast.success('Created successfully.')
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button style={{ cursor: 'pointer' }}>បង្កើតអ្នកប្រើប្រាស់</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>បង្កើតអ្នកប្រើប្រាស់</Dialog.Title>

        <Box pt="3">
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ឈ្មោះអ្នកប្រើប្រាស់
              </Text>
              <TextField.Root
                placeholder="សូមបញ្ចូលឈ្មោះ"
                value={name}
                required
                onChange={(e: any) => setName(e.target.value)}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                អ៊ីម៉ែល
              </Text>
              <TextField.Root
                type="email"
                placeholder="សូមបញ្ចូលអ៊ីម៉ែល"
                value={email}
                required
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ពាក្យសម្ងាត់
              </Text>
              <TextField.Root
                type="password"
                placeholder="សូមបញ្ចូលពាក្យសម្ងាត់"
                value={email}
                required
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                បញ្ជាក់ពាក្យសម្ងាត់
              </Text>
              <TextField.Root
                type="password"
                placeholder="សូមបញ្ចូលពាក្យសម្ងាត់"
                value={email}
                required
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </label>

            <Text as="div" size="2" mb="1" weight="bold">
              ជ្រើសរើសមុខតំណែង
            </Text>
            <Select.Root defaultValue="student">
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>និស្សិត</Select.Label>
                  <Select.Item value="staff">បុគ្គលិក</Select.Item>
                  <Select.Item value="teacher">គ្រូបង្រៀន</Select.Item>
                  <Select.Item value="student">និស្សិត</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>

            <table>
              <tr className="mb-4">
                <th>
                  <Text>បញ្ចូលកាលវិភាគ</Text>
                </th>
                <th>
                  <Text>ស្រង់វត្តមាន</Text>
                </th>
                <th>
                  <Text>បន្ថែមគ្រូបង្រៀន</Text>
                </th>
                <th>
                  <Text>បន្ថែមនិស្សិត</Text>
                </th>
                <th>
                  <Text>ស្រង់វត្តមាន</Text>
                </th>
              </tr>
              <tr className="text-center ">
                <td>
                  <Checkbox />
                </td>
                <td>
                  <Checkbox />
                </td>
                <td>
                  <Checkbox />
                </td>
                <td>
                  <Checkbox />
                </td>
                <td>
                  <Checkbox />
                </td>
              </tr>
            </table>
          </Flex>
        </Box>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>

          <Button onClick={handleCreate}>Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default AddUser
