import { useRouter } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: AdminRedirect,
})

function AdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.navigate({ to: '/auth/login' })
  }, [router])

  return null
}
