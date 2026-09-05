import React from "react";
import { Sun, Moon, Desktop } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme, type Theme } from "@/hooks/use-theme";

export function AccountThemeCard() {
  const { theme, setTheme, mounted } = useTheme();

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Terang", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Gelap", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "Sistem", icon: <Desktop className="h-4 w-4" /> },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Preferensi Tampilan (Tema)</CardTitle>
        <CardDescription>Pilih preferensi tema antarmuka aplikasi KomikHQ.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 max-w-md">
          {themeOptions.map((opt) => {
            const isActive = mounted && theme === opt.value;
            return (
              <Button
                key={opt.value}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="flex items-center justify-center gap-2 w-full"
                onClick={() => setTheme(opt.value)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
