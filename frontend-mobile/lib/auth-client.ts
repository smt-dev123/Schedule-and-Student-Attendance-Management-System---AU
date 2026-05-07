import { createAuthClient } from "better-auth/react";

const baseURL = process.env.VITE_API_BASE_URL
  ? process.env.EXPO_PUBLIC_API_URL + "/auth"
  : "http://localhost:3000/api/auth";

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signUp, useSession, signOut } = authClient;
