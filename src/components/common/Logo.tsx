import React from "react";
import { useTheme } from "@/hooks/use-theme";

const LOGO_SIZES = {
  header: {
    mark: { width: 28, height: 28 },
    wordmark: { width: 96, height: 48 },
    gap: "gap-2",
  },
  compact: {
    mark: { width: 24, height: 24 },
    wordmark: { width: 84, height: 42 },
    gap: "gap-1.5",
  },
  large: {
    mark: { width: 40, height: 40 },
    wordmark: { width: 136, height: 68 },
    gap: "gap-2.5",
  },
} as const;

type LogoProps = {
  size?: keyof typeof LOGO_SIZES;
};

export function Logo({ size = "header" }: LogoProps) {
  const { resolvedTheme, mounted } = useTheme();
  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const dimensions = LOGO_SIZES[size];

  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center ${dimensions.gap}`}>
      <img
        src={`/logo-mark-${theme}.svg`}
        alt=""
        width={dimensions.mark.width}
        height={dimensions.mark.height}
        className="block"
      />
      <img
        src={`/logo-wordmark-${theme}.svg`}
        alt=""
        width={dimensions.wordmark.width}
        height={dimensions.wordmark.height}
        className="hidden md:block"
      />
    </span>
  );
}
