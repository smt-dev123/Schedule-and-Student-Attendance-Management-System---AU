import {
  Box,
  Button,
  Dialog,
  Flex,
  Tabs,
  Text,
  TextField,
} from '@radix-ui/themes'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const AddTeacher = () => {
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
        <Button style={{ cursor: 'pointer' }}>បន្ថែមគ្រូបង្រៀន</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>បន្ថែមគ្រូបង្រៀន</Dialog.Title>

        <Tabs.Root defaultValue="km">
          <Tabs.List>
            <Tabs.Trigger value="km">អក្សរខ្មែរ</Tabs.Trigger>
            <Tabs.Trigger value="en">English</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="km">
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    គោត្តនាម - នាម
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
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="en">
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Name
                  </Text>
                  <TextField.Root
                    placeholder="Enter your full name"
                    value={name}
                    required
                    onChange={(e: any) => setName(e.target.value)}
                  />
                </label>

                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Email
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    required
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                </label>
              </Flex>
            </Tabs.Content>
          </Box>
        </Tabs.Root>

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

export default AddTeacher
