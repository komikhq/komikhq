import { createAuthClient } from "better-auth/react"
import { BASE_PATH } from "@/lib/sdk-client"

export const authClient = createAuthClient({
  baseURL: BASE_PATH,
  basePath: "/auth",
  fetchOptions: {
    credentials: "include",
  },
})

export const { useSession, signIn, signOut, signUp, sendVerificationEmail } =
  authClient
