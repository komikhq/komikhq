import { Link } from "react-router"
import { CheckCircleIcon as CheckCircle } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function VerifyEmailCard() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-[440px] text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Email verified successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Thank you for verifying your email address. Your KomikHQ account is now fully active.
          </p>
          <div className="pt-2">
            <Link to="/login">
              <Button className="w-full">Sign in to your account</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
