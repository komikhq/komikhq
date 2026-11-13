import { useEffect } from "react"
import { useSearchParams } from "react-router"
import { toast } from "sonner"
import { AccountProfileCard } from "./account-profile-card"
import { AccountIdentityCard } from "./account-identity-card"

export function AccountProfileView() {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Welcome! Your email has been verified successfully.")
      const newParams = new URLSearchParams(searchParams)
      newParams.delete("verified")
      setSearchParams(newParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  return (
    <div className="flex w-full flex-col gap-6">
      <AccountProfileCard />
      <AccountIdentityCard />
    </div>
  )
}
