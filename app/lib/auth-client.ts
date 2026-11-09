import { createAuthClient } from "better-auth/react"
import { BASE_PATH } from "@komikhq/komikhq-typescript"

export const authClient = createAuthClient({
  baseURL: BASE_PATH,
  basePath: "/v1/auth",
  fetchOptions: {
    credentials: "include",
  },
})

export const { useSession, signIn, signOut, signUp, sendVerificationEmail } =
  authClient
