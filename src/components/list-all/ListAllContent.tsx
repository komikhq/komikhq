import React from "react";
import { ListBullets } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";

export function ListAllContent() {
  return (
    <div className="space-y-6 pb-20 pt-4 px-4 max-w-screen-2xl mx-auto">
      <div className="flex items-center gap-2">
        <ListBullets className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Complete Comic Directory</h1>
      </div>
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Alphabetical directory ready for backend data binding.
        </p>
      </Card>
    </div>
  );
}
