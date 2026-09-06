import React, { useState } from "react";
import { MagnifyingGlass, House, ArrowClockwise, Copy, Check, Bug, ShieldWarning } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface ErrorViewCardProps {
  code: 403 | 404 | 418 | 500 | 503;
  title?: string;
  description?: string;
  error?: Error | unknown;
  errorId?: string;
}

const ERROR_CONFIG = {
  403: {
    image: "/images/errors/403.png",
    defaultTitle: "Akses Dibatasi!",
    defaultDescription: "Kamu tidak memiliki izin untuk membuka halaman ini.",
    badgeVariant: "outline" as const,
    badgeClass: "border-amber-500/50 text-amber-500 bg-amber-500/10",
  },
  404: {
    image: "/images/errors/404.png",
    defaultTitle: "Panel Komik Hilang!",
    defaultDescription: "Halaman atau komik yang kamu cari tidak ditemukan atau telah dipindahkan.",
    badgeVariant: "outline" as const,
    badgeClass: "border-indigo-500/50 text-indigo-500 bg-indigo-500/10",
  },
  418: {
    image: "/images/errors/418.png",
    defaultTitle: "I'm a Teapot!",
    defaultDescription: "Server menolak seduh kopi karena server ini adalah teko teh.",
    badgeVariant: "outline" as const,
    badgeClass: "border-emerald-500/50 text-emerald-500 bg-emerald-500/10",
  },
  500: {
    image: "/images/errors/500.png",
    defaultTitle: "Server Mengalami Emosi / Overheat!",
    defaultDescription: "Terjadi kesalahan internal pada server KomikHQ saat memuat data.",
    badgeVariant: "outline" as const,
    badgeClass: "border-rose-500/50 text-rose-500 bg-rose-500/10",
  },
  503: {
    image: "/images/errors/503.png",
    defaultTitle: "Layanan Sedang Pemeliharaan!",
    defaultDescription: "Server KomikHQ sedang dalam perbaikan sementara. Mohon balik lagi nanti.",
    badgeVariant: "outline" as const,
    badgeClass: "border-amber-500/50 text-amber-500 bg-amber-500/10",
  },
};

export function ErrorViewCard({
  code,
  title,
  description,
  error,
  errorId: providedErrorId,
}: ErrorViewCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const config = ERROR_CONFIG[code] || ERROR_CONFIG[500];
  const displayTitle = title || config.defaultTitle;
  const displayDescription = description || config.defaultDescription;

  // Generate fallback unique error ID
  const errorId =
    providedErrorId ||
    `ERR-${code}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : JSON.stringify(error || "Unknown Error");

  const errorStack = error instanceof Error ? error.stack : null;

  const handleCopyLog = async () => {
    const diagnosticPayload = {
      errorId,
      code,
      path: typeof window !== "undefined" ? window.location.pathname : "N/A",
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "N/A",
      message: errorMessage,
      stack: errorStack,
    };

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(diagnosticPayload, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy diagnostic log");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto w-full border-border/60 bg-card/70 backdrop-blur-md shadow-xl my-8">
      <CardHeader className="flex flex-col items-center pt-8 pb-4 text-center">
        {/* Sawaratsuki Sticker Illustration */}
        <div className="relative group cursor-pointer mb-6 transition-transform duration-300 hover:scale-105">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />
          <img
            src={config.image}
            alt={`Error ${code} Sticker - Sawaratsuki`}
            className="relative h-44 md:h-52 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Badge & Title */}
        <Badge className={`mb-3 py-1 px-3 text-xs font-bold tracking-wider ${config.badgeClass}`}>
          ERROR CODE {code}
        </Badge>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          {displayTitle}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-md leading-relaxed">
          {displayDescription}
        </p>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-8">
        {/* Search Bar for 404 & general errors */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari judul komik / manga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/80"
            />
          </div>
          <Button type="submit" variant="default" className="font-semibold">
            Cari
          </Button>
        </form>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="default"
            onClick={() => (window.location.href = "/")}
            className="gap-2 font-medium"
          >
            <House className="h-4 w-4" />
            Ke Beranda
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2 font-medium"
          >
            <ArrowClockwise className="h-4 w-4" />
            Coba Lagi
          </Button>

          <Button
            variant="secondary"
            onClick={handleCopyLog}
            className="gap-2 font-medium"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                Tercopy!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Salin Log Error
              </>
            )}
          </Button>
        </div>

        {/* Diagnostic Accordion / Details */}
        <div className="border-t border-border/40 pt-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldWarning className="h-4 w-4" />
              <span>Reference Code: <strong className="font-mono text-foreground">{errorId}</strong></span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-muted-foreground hover:text-foreground gap-1 h-7 px-2"
            >
              <Bug className="h-3.5 w-3.5" />
              {showDetails ? "Sembunyikan Log" : "Detail Diagnosa"}
            </Button>
          </div>

          {showDetails && (
            <div className="mt-3 p-3 rounded-md bg-muted/60 text-xs font-mono border border-border/50 space-y-2 overflow-x-auto">
              <div>
                <span className="text-muted-foreground">Error ID:</span> {errorId}
              </div>
              <div>
                <span className="text-muted-foreground">Status Code:</span> {code}
              </div>
              <div>
                <span className="text-muted-foreground">Timestamp:</span> {new Date().toLocaleString("id-ID")}
              </div>
              {errorMessage && (
                <div>
                  <span className="text-muted-foreground">Message:</span>{" "}
                  <span className="text-rose-500 dark:text-rose-400">{errorMessage}</span>
                </div>
              )}
              {errorStack && (
                <div className="pt-2 border-t border-border/30">
                  <div className="text-muted-foreground mb-1">Stack Trace:</div>
                  <pre className="text-[10px] leading-normal text-muted-foreground whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {errorStack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
