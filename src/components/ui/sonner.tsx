import React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CheckCircle, Info, Warning, XCircle, Spinner } from "@phosphor-icons/react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      icons={{
        success: <CheckCircle className="size-4 text-emerald-500" />,
        info: <Info className="size-4 text-blue-500" />,
        warning: <Warning className="size-4 text-amber-500" />,
        error: <XCircle className="size-4 text-destructive" />,
        loading: <Spinner className="size-4 animate-spin text-primary" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
