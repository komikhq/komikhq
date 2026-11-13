import { useState, useEffect } from "react"
import { useRouteLoaderData } from "react-router"
import { toast } from "sonner"
import {
  authClient,
  useSession,
  sendVerificationEmail,
} from "@/lib/auth-client"

export interface UseAuthReturn {
  user: any
  session: any
  isPending: boolean
  isAuthenticated: boolean
  isLoading: boolean
  authError: string | null
  setAuthError: (err: string | null) => void
  handleSignInEmail: (email: string, password: string) => Promise<boolean>
  handleSignInGoogle: () => Promise<void>
  handleSignUpEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>
  handleSendVerificationEmail: (email: string) => Promise<boolean>
  handleSignOut: () => Promise<void>
  refetch: () => Promise<any>
}

export function useAuth(): UseAuthReturn {
  const rootData = useRouteLoaderData<{ user?: any; session?: any }>("root")
  const { data: sessionData, isPending: clientPending, refetch } = useSession()
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const user = sessionData?.user ?? rootData?.user ?? null
  const session = sessionData?.session ?? rootData?.session ?? null
  const isAuthenticated = Boolean(user)
  const isPending = clientPending && !rootData?.user

  const handleSignInEmail = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true)
    setAuthError(null)
    try {
      const { error: err } = await authClient.signIn.email({
        email,
        password,
      })

      if (err) {
        const msg =
          err.message || "Login failed. Check your email and password."
        setAuthError(msg)
        toast.error(msg)
        return false
      }

      toast.success("Login success!")
      await refetch()
      return true
    } catch (e: any) {
      const msg = e.message || "Login failed."
      setAuthError(msg)
      toast.error(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInGoogle = async () => {
    setIsLoading(true)
    setAuthError(null)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/account",
        newUserCallbackURL: window.location.origin + "/account",
        authParams: {
          prompt: "select_account consent",
        },
      } as any)
    } catch (e: any) {
      const msg = e.message || "Login with Google failed."
      setAuthError(msg)
      toast.error(msg)
      setIsLoading(false)
    }
  }

  const handleSignUpEmail = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true)
    setAuthError(null)
    try {
      const { error: err } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: window.location.origin + "/verify-email?verified=true",
      })

      if (err) {
        const msg = err.message || "Failed to create new account."
        setAuthError(msg)
        toast.error(msg)
        return false
      }

      toast.success("Register success!")
      await refetch()
      return true
    } catch (e: any) {
      const msg = e.message || "Failed to register."
      setAuthError(msg)
      toast.error(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendVerificationEmail = async (
    emailToVerify: string
  ): Promise<boolean> => {
    setIsLoading(true)
    setAuthError(null)
    try {
      const { error: err } = await sendVerificationEmail({
        email: emailToVerify,
        callbackURL: window.location.origin + "/verify-email?verified=true",
      })

      if (err) {
        const msg = err.message || "Failed to send verification email."
        setAuthError(msg)
        toast.error(msg)
        return false
      }

      toast.success(`Email verification has been sent to ${emailToVerify}`)
      return true
    } catch (e: any) {
      const msg =
        e.message || "Failed to send verification email."
      setAuthError(msg)
      toast.error(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authClient.signOut()
      await refetch()
      toast.success("Logout success!")
      window.location.href = "/login"
    } catch (e: any) {
      const msg = e.message || "Logout failed."
      setAuthError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    session,
    isPending,
    isAuthenticated,
    isLoading,
    authError,
    setAuthError,
    handleSignInEmail,
    handleSignInGoogle,
    handleSignUpEmail,
    handleSendVerificationEmail,
    handleSignOut,
    refetch,
  }
}
