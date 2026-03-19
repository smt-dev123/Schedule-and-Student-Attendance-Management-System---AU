import { useTitle } from '@/hooks/useTitle'
import { useAuth } from '@/stores/auth'
import { Button, Flex, Spinner, Text, TextField } from '@radix-ui/themes'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/auth/login')({
  component: Login,
})

function Login() {
  const { login } = useAuth()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    // ទប់ស្កាត់បើមិនទាន់បញ្ចូលទិន្នន័យ
    if (!email || !password) {
      toast.success('សូមបញ្ចូល Email និង Password!')
      alert('សូមបញ្ចូល Email និង Password!')
      return
    }

    setLoading(true)

    // បង្កើតការរង់ចាំក្លែងក្លាយ 800ms
    setTimeout(() => {
      // const success = login(email, password)
      
      // if (success) {
        toast.success('ចូលប្រើប្រាស់ជោគជ័យ')
        router.navigate({ to: '/admin/dashboard' })
      // } else {
      //   alert('Username & Password មិនត្រឹមត្រូវ')
      //   setLoading(false)
      // }
    }, 800)
  }

  useTitle('Login')

  return (
    <>
      <Flex direction="column" align="center" justify="center" mb="5" gap="2">
        <img 
          src="https://academics-bucket-sj19asxm-prod.s3.ap-southeast-1.amazonaws.com/884dc87f-2613-47fc-83b3-b138abc386df/884dc87f-2613-47fc-83b3-b138abc386df.png" 
          alt="App Logo" 
          style={{ 
            height: '110px',
            width: 'auto',
            objectFit: 'contain' 
          }} 
        />
        
        <Text size="6" weight="bold" color="indigo">
          Login
        </Text>
      </Flex>

      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Email
          </Text>
          <TextField.Root 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Password
          </Text>
          <TextField.Root 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {/* Remember Me & Forgot Password */}
        <Flex justify="between" align="center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-blue-500"
            />
            <Text size="2" color="gray">
              Remember me
            </Text>
          </label>
          <Text
            size="2"
            className="text-blue-600 hover:underline cursor-pointer transition-colors"
          >
            Forgot password?
          </Text>
        </Flex>

        {/* Button Login */}
        <Button
          onClick={handleLogin}
          disabled={loading}
          color="indigo"
          variant="solid"
          size="3"
          style={{ cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}
        >
          {loading && <Spinner size="2" />}
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Flex>

      <Flex justify="center" align="center" mt="4" gap="2">
        <Text size="2">Don't have an account?</Text>
        <Link
          className="text-indigo-600 font-medium hover:underline"
          style={{ fontSize: '14px' }}
          to="/auth/register"
        >
          Signup
        </Link>
      </Flex>
    </>
  )
}