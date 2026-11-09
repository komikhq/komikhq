import { SunIcon as Sun, MoonIcon as Moon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { resolvedTheme, setTheme, mounted } = useTheme()

  const isDark = mounted && resolvedTheme === "dark"

  const handleThemeToggle = () => {
    const nextTheme = isDark ? "light" : "dark"
    setTheme(nextTheme)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 border-input bg-background hover:bg-muted hover:text-foreground active:bg-muted/80"
          onClick={handleThemeToggle}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400 group-hover/button:text-amber-300 transition-colors" />
          ) : (
            <Moon className="h-4 w-4 text-foreground/80 group-hover/button:text-foreground transition-colors" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isDark ? "Switch to light theme" : "Switch to dark theme"}
      </TooltipContent>
    </Tooltip>
  )
}
