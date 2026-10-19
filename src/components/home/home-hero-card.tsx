import React from "react"
import { Info, Users } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants"
import { useRealtimeViewers } from "@/hooks/use-realtime-viewers"

export function HomeHeroCard() {
  const { onlineCount } = useRealtimeViewers()

  return (
    <Card className="bg-gradient-to-r from-card to-muted/40">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary">
          <Info className="h-5 w-5" />
          <span>About {SITE_NAME}</span>
        </CardTitle>
        <Badge
          variant="outline"
          className="gap-1.5 px-2.5 py-1 text-xs font-semibold"
        >
          <Users className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
          <span>{onlineCount} Pembaca Online</span>
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {SITE_DESCRIPTION}
        </p>
      </CardContent>
    </Card>
  )
}
