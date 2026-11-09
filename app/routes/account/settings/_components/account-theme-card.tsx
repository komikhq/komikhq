import React from "react"
import { toast } from "sonner"
import {
  SunIcon as Sun,
  MoonIcon as Moon,
  DesktopIcon as Desktop,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme, type Theme } from "@/hooks/use-theme"

export function AccountThemeCard() {
  const { theme, setTheme, mounted } = useTheme()

  const handleSelectTheme = (newTheme: Theme, label: string) => {
    setTheme(newTheme)
    toast.info(`Application theme changed to: ${label}`)
  }

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] =
    [
      { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
      { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
      {
        value: "system",
        label: "System",
        icon: <Desktop className="h-4 w-4" />,
      },
    ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">
          Theme Preferences
        </CardTitle>
        <CardDescription>
          Choose your preferred KomikHQ interface theme.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid max-w-md grid-cols-3 gap-2">
          {themeOptions.map((opt) => {
            const isActive = mounted && theme === opt.value
            return (
              <Button
                key={opt.value}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="flex w-full items-center justify-center gap-2"
                onClick={() => handleSelectTheme(opt.value, opt.label)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
