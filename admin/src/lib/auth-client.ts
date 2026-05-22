import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL + "/auth" : "http://localhost:4000/api/auth",
  plugins: [adminClient()]
})

export const { signIn, signUp, useSession, signOut, admin } = authClient