import { Button, Flex, Spinner, Text, TextField } from '@radix-ui/themes'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/auth/login')({
  component: Login,
})

function Login() {
  const [loading, setLoading] = useState(false)
  return (
    <>
      <Flex justify="center" align="center" mb="4">
        <Text size="6" weight="bold" color="indigo">
          Login
        </Text>
      </Flex>
      <Flex direction="column" gap="3">
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

        {/* Remember Me & Forgot Password */}
        <Flex justify="between" align="center" className="text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Text size="2" className="text-gray-600">
              Remember me
            </Text>
          </label>
          <Text
            size="2"
            className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
          >
            Forgot password?
          </Text>
        </Flex>

        {/* Button Login */}
        {loading ? (
          <Button disabled variant="solid">
            <Spinner loading />
            Login
          </Button>
        ) : (
          <Link to="/admin/dashboard" className="w-full">
            <Button
              color="indigo"
              variant="solid"
              style={{ cursor: 'pointer', width: '100%' }}
            >
              Login
            </Button>
          </Link>
        )}
      </Flex>
      <Flex justify="center" align="center" mt="4" gap="2">
        <Text size="2">Don't have an account?</Text>
        <Link
          className="text-indigo-600"
          style={{ fontSize: '14px' }}
          to="/auth/register"
        >
          Signup
        </Link>
      </Flex>
    </>
  )
}
