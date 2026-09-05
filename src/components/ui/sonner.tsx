import "sonner/dist/styles.css";
import { useTheme } from "@/hooks/use-theme";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, SpinnerIcon } from "@phosphor-icons/react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:flex group-[.toaster]:items-center group-[.toaster]:gap-3 group-[.toaster]:text-sm font-sans",
          title: "group-[.toast]:font-semibold group-[.toast]:text-foreground",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium",
        },
      }}
      icons={{
        success: <CheckCircleIcon className="size-4 text-emerald-500 shrink-0" />,
        info: <InfoIcon className="size-4 text-sky-500 shrink-0" />,
        warning: <WarningIcon className="size-4 text-amber-500 shrink-0" />,
        error: <XCircleIcon className="size-4 text-destructive shrink-0" />,
        loading: <SpinnerIcon className="size-4 animate-spin text-primary shrink-0" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
