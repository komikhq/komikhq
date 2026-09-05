import React from "react";
import { Sun, Moon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, mounted } = useTheme();

  const isDark = mounted && resolvedTheme === "dark";

  const handleThemeToggle = () => {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 border-input bg-background hover:bg-accent hover:text-accent-foreground"
          onClick={handleThemeToggle}
          aria-label={isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      </TooltipContent>
    </Tooltip>
  );
}
