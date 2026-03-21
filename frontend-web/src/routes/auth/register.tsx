import { useTitle } from '@/hooks/useTitle'
import { Button, Flex, Spinner, Text, TextField } from '@radix-ui/themes'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/auth/register')({
  component: Register,
})

function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useTitle('Register')

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData

    if (!name || !email || !password) {
      alert('សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់')
      return
    }

    if (password !== confirmPassword) {
      alert('Password ទាំងពីរមិនដូចគ្នាទេ!')
      return
    }

    setLoading(true)

    // Simulate ការផ្ញើទិន្នន័យទៅ Server
    setTimeout(() => {
      console.log('Register Data:', formData)
      alert('ចុះឈ្មោះបានជោគជ័យ!')
      setLoading(false)
      router.navigate({ to: '/auth/login' })
    }, 1000)
  }

  // Function សម្រាប់ Handle ការវាយអក្សរចូល Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <>
      {/* ផ្នែក Logo និង ចំណងជើង */}
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
          Register
        </Text>
      </Flex>

      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">Name</Text>
          <TextField.Root 
            placeholder="Enter your full name" 
            value={formData.name}
            onChange={(e) => handleChange(e, 'name')}
          />
        </label>

        <label>
          <Text as="div" size="2" mb="1" weight="bold">Email</Text>
          <TextField.Root 
            placeholder="Enter your email" 
            value={formData.email}
            onChange={(e) => handleChange(e, 'email')}
          />
        </label>

        <label>
          <Text as="div" size="2" mb="1" weight="bold">Password</Text>
          <TextField.Root 
            type="password" 
            placeholder="Enter your password" 
            value={formData.password}
            onChange={(e) => handleChange(e, 'password')}
          />
        </label>

        <label>
          <Text as="div" size="2" mb="1" weight="bold">Confirm Password</Text>
          <TextField.Root 
            type="password" 
            placeholder="Confirm your password" 
            value={formData.confirmPassword}
            onChange={(e) => handleChange(e, 'confirmPassword')}
          />
        </label>

        {/* Button Register */}
        <Button 
          onClick={handleRegister}
          disabled={loading}
          color="indigo" 
          variant="solid" 
          size="3"
          style={{ cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}
        >
          {loading && <Spinner size="2" />}
          {loading ? 'Creating account...' : 'Register'}
        </Button>
      </Flex>

      <Flex justify="center" align="center" mt="4" gap="2">
        <Text size="2">Already have an account?</Text>
        <Link
          className="text-indigo-600 font-medium hover:underline"
          style={{ fontSize: '14px' }}
          to="/auth/login"
        >
          Signin
        </Link>
      </Flex>
    </>
  )
}