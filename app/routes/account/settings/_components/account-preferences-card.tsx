import {
  GlobeIcon as Globe,
  BellIcon as Bell,
  ShieldIcon as Shield,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function AccountPreferencesCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">App Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h4 className="text-sm font-semibold">Content Language</h4>
              <p className="text-xs text-muted-foreground">
                Primary interface and catalog language.
              </p>
            </div>
          </div>
          <Badge variant="outline">English</Badge>
        </div>

        <Separator />

        <div className="flex items-center justify-between py-2">
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h4 className="text-sm font-semibold">New Chapter Notifications</h4>
              <p className="text-xs text-muted-foreground">
                Alerts when favorite comic chapters are released.
              </p>
            </div>
          </div>
          <Badge variant="secondary">Active</Badge>
        </div>

        <Separator />

        <div className="flex items-center justify-between py-2">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h4 className="text-sm font-semibold">Data Privacy</h4>
              <p className="text-xs text-muted-foreground">
                Secure synchronization of reading history and bookmarks.
              </p>
            </div>
          </div>
          <Badge variant="outline">Active</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
