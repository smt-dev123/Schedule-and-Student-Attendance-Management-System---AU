import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Spinner, Text, TextField } from '@radix-ui/themes'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/auth/register')({
  component: Register,
})

function Register() {
  const [loading, setLoading] = useState(false)
  useTitle('Register')

  return (
    <>
      <Flex justify="center" align="center" mb="4">
        <Text size="6" weight="bold" color="indigo">
          Register
        </Text>
      </Flex>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Name
          </Text>
          <TextField.Root placeholder="Enter your full name" />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Email
          </Text>
          <TextField.Root placeholder="Enter your email" />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Password
          </Text>
          <TextField.Root type="password" placeholder="Enter your password" />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Confirm Password
          </Text>
          <TextField.Root type="password" placeholder="Enter your password" />
        </label>

        {/* Button Register */}
        {loading ? (
          <Button disabled variant="solid">
            <Spinner loading />
            Register
          </Button>
        ) : (
          <Button color="indigo" variant="solid" style={{ cursor: 'pointer' }}>
            Register
          </Button>
        )}
      </Flex>

      <Flex justify="center" align="center" mt="4" gap="2">
        <Text size="2">Already have an account?</Text>
        <Link
          className="text-indigo-600"
          style={{ fontSize: '14px' }}
          to="/auth/login"
        >
          Signin
        </Link>
      </Flex>
    </>
  )
}
