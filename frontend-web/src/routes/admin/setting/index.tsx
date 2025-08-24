import { useTitle } from '@/hooks/useTitle'
import {
  Avatar,
  Button,
  Card,
  Flex,
  Separator,
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
    <>
      <Flex justify="between" align="center">
        <Text className="text-2xl font-bold">Account</Text>
        <Button>រក្សាទុក</Button>
      </Flex>
      <p>real time information and activities of your property</p>

      {/*  */}
      <Separator my="3" size="4" />
      <Flex direction="column" gap="4">
        <Card>
          <Flex justify="between">
            <Flex gap="3" align="center">
              <Avatar
                size="5"
                src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                radius="full"
                fallback="T"
              />
              <Flex direction="column" gap="2">
                <Text as="div" size="2" weight="bold">
                  Profile Picture
                </Text>
                <Text as="div" size="2" color="gray">
                  JPG, JPGE, PNG under 10MB
                </Text>
              </Flex>
            </Flex>
            <Flex align="center" gap="2">
              <Button color="green">Upload new picture</Button>
              <Button color="red">Delete</Button>
            </Flex>
          </Flex>
        </Card>
        <Text className="text-xl font-bold">Informations</Text>
        <Flex gap="4">
          <label className="w-full">
            <Text as="div" size="2" mb="1" weight="bold">
              First Name
            </Text>
            <TextField.Root placeholder="Enter your first name" />
          </label>

          <label className="w-full">
            <Text as="div" size="2" mb="1" weight="bold">
              Last Name
            </Text>
            <TextField.Root placeholder="Enter your last name" />
          </label>
        </Flex>
        {/* Email & Phone */}
        <Flex gap="4">
          <label className="w-full">
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root type="email" placeholder="Enter your email" />
          </label>

          <label className="w-full">
            <Text as="div" size="2" mb="1" weight="bold">
              Phone
            </Text>
            <TextField.Root type="tel" placeholder="Enter your phone" />
          </label>
        </Flex>

        <Separator my="3" size="4" />
        <Text className="text-xl font-bold">Password</Text>
        <Flex gap="4">
          <label className="w-full">
            <Text as="div" size="2" mb="1" weight="bold">
              Current Password
            </Text>
            <TextField.Root
              type="password"
              placeholder="Enter your old password"
            />
          </label>

          <label className="w-full">
            <Text as="div" size="2" mb="1" weight="bold">
              New Password
            </Text>
            <TextField.Root
              type="password"
              placeholder="Enter your new password"
            />
          </label>
        </Flex>
      </Flex>
    </>
  )
}
