import { useState, useEffect } from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyTheme = (targetTheme: Theme) => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const isDark = targetTheme === "dark" || (targetTheme === "system" && getSystemTheme() === "dark");

    if (isDark) {
      root.classList.add("dark");
      setResolvedTheme("dark");
    } else {
      root.classList.remove("dark");
      setResolvedTheme("light");
    }
  };

  useEffect(() => {
    setMounted(true);
    const storedTheme = (localStorage.getItem("theme") as Theme) || "system";
    setThemeState(storedTheme);
    applyTheme(storedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      const currentStored = (localStorage.getItem("theme") as Theme) || "system";
      if (currentStored === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    const handleCustomThemeChange = (e: CustomEvent<Theme>) => {
      setThemeState(e.detail);
      applyTheme(e.detail);
    };

    window.addEventListener("theme-change" as any, handleCustomThemeChange as EventListener);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("theme-change" as any, handleCustomThemeChange as EventListener);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (newTheme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", newTheme);
    }
    applyTheme(newTheme);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
  };

  return {
    theme,
    resolvedTheme: mounted ? resolvedTheme : "dark",
    setTheme,
    mounted,
  };
}
