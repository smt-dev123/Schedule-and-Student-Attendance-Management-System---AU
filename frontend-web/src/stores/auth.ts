import { useSession, signOut as betterSignOut } from '@/lib/auth-client'

export const useAuth = () => {
  const { data, isPending } = useSession()
  return {
    user: data?.user || null,
    isPending,
    logout: async () => {
      await betterSignOut()
      window.location.href = '/auth/login'
    }
  }
}
