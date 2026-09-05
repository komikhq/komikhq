import React from "react";
import { Info, Users } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";
import { useRealtimeViewers } from "@/hooks/use-realtime-viewers";

export function HomeHeroCard() {
  const { onlineCount } = useRealtimeViewers();

  return (
    <Card className="bg-gradient-to-r from-card to-muted/40">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
          <Info className="h-5 w-5" />
          <span>About {SITE_NAME}</span>
        </CardTitle>
        <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-xs font-semibold">
          <Users className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
          <span>{onlineCount} Pembaca Online</span>
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {SITE_DESCRIPTION}
        </p>
      </CardContent>
    </Card>
  );
}
