import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL + "/auth" : "http://localhost:4000/api/auth",
})

export const { signIn, signUp, useSession, signOut } = authClient