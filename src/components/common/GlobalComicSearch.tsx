import React, { useEffect, useRef, useState } from "react"
import {
  BookOpen,
  CircleNotch,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react"
import { API_ROUTES } from "@/constants"
import { apiFetch } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const MIN_QUERY_LENGTH = 2
const MAX_SUGGESTIONS = 6
const SEARCH_DEBOUNCE_MS = 250

interface ComicSearchSuggestion {
  uuid: string
  slug: string
  title: string
  matchedTitle: string
  coverUrl: string | null
  type: string | null
  status: string | null
}

interface ComicSearchResponse {
  query: string
  suggestions: ComicSearchSuggestion[]
}

export function GlobalComicSearch() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<ComicSearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDesktopOpen, setIsDesktopOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const desktopContainerRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const normalizedQuery = query.trim()

  // Debounced API fetch for search suggestions
  useEffect(() => {
    if (normalizedQuery.length < MIN_QUERY_LENGTH) {
      setSuggestions([])
      setIsLoading(false)
      setHasSearched(false)
      setHasError(false)
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      setSuggestions([])
      setIsLoading(true)
      setHasSearched(false)
      setHasError(false)

      apiFetch<ComicSearchResponse>(
        API_ROUTES.SEARCH.SUGGESTIONS(normalizedQuery, MAX_SUGGESTIONS),
        { signal: controller.signal }
      )
        .then((response) => {
          setSuggestions(
            Array.isArray(response.suggestions) ? response.suggestions : []
          )
          setHasSearched(true)
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setHasError(true)
            setHasSearched(true)
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false)
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [normalizedQuery, retryCount])

  // Click-outside listener for the desktop dropdown
  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (
        desktopContainerRef.current &&
        !desktopContainerRef.current.contains(event.target as Node)
      ) {
        setIsDesktopOpen(false)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
    }
  }, [])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setActiveIndex(0)
    setSuggestions([])
    setHasSearched(false)
    setHasError(false)

    const trimmed = value.trim()
    if (trimmed.length >= MIN_QUERY_LENGTH) {
      setIsLoading(true)
      setIsDesktopOpen(true)
    } else {
      setIsLoading(false)
    }
  }

  const handleDesktopKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      event.preventDefault()
      setIsDesktopOpen(false)
      return
    }

    if (!suggestions.length) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % suggestions.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex(
        (current) => (current - 1 + suggestions.length) % suggestions.length
      )
    } else if (event.key === "Enter") {
      event.preventDefault()
      window.location.href = `/komik/${suggestions[activeIndex].slug}`
    }
  }

  const handleMobileKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!suggestions.length) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % suggestions.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex(
        (current) => (current - 1 + suggestions.length) % suggestions.length
      )
    } else if (event.key === "Enter") {
      event.preventDefault()
      window.location.href = `/komik/${suggestions[activeIndex].slug}`
    }
  }

  const showDesktopDropdown =
    isDesktopOpen && normalizedQuery.length >= MIN_QUERY_LENGTH

  const renderSearchResults = (idPrefix: string) => (
    <SearchSuggestionList
      idPrefix={idPrefix}
      query={normalizedQuery}
      suggestions={suggestions}
      isLoading={isLoading}
      hasSearched={hasSearched}
      hasError={hasError}
      activeIndex={activeIndex}
      onActiveIndexChange={setActiveIndex}
      onRetry={() => setRetryCount((count) => count + 1)}
      onSelect={() => {
        setIsDesktopOpen(false)
        setIsMobileOpen(false)
      }}
    />
  )

  return (
    <>
      {/* ── Desktop: Custom Dropdown (no Radix Popover) ── */}
      <div
        ref={desktopContainerRef}
        className="relative hidden w-60 md:block lg:w-64"
      >
        <form
          onSubmit={(event) => event.preventDefault()}
          className="relative"
        >
          <MagnifyingGlass className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            type="search"
            role="combobox"
            aria-label="Search comics"
            aria-autocomplete="list"
            aria-expanded={showDesktopDropdown}
            aria-controls="desktop-comic-search-results"
            aria-activedescendant={
              suggestions[activeIndex]
                ? `desktop-comic-search-option-${activeIndex}`
                : undefined
            }
            autoComplete="off"
            maxLength={80}
            placeholder="Search comics..."
            className="h-9 w-full pl-9 text-sm"
            value={query}
            onFocus={() => setIsDesktopOpen(true)}
            onChange={(event) => handleQueryChange(event.target.value)}
            onKeyDown={handleDesktopKeyDown}
          />
        </form>

        {showDesktopDropdown && (
          <div
            className="absolute top-full right-0 z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border bg-popover p-2 text-popover-foreground shadow-xl ring-1 ring-foreground/5 dark:ring-foreground/10"
            onMouseDown={(event) => {
              // Prevent input blur when clicking inside dropdown
              // (links handle their own navigation via href)
              if ((event.target as HTMLElement).closest("a")) return
              event.preventDefault()
            }}
          >
            {renderSearchResults("desktop")}
          </div>
        )}
      </div>

      {/* ── Mobile: Full-screen Dialog (retained, no dismiss conflict) ── */}
      <Dialog open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label="Search comics"
          onClick={() => setIsMobileOpen(true)}
        >
          <MagnifyingGlass />
        </Button>
        <DialogContent
          className="!top-0 !left-0 !h-dvh !w-screen !max-w-none !translate-x-0 !translate-y-0 gap-4 overflow-hidden rounded-none p-4 md:hidden"
          showCloseButton={false}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            mobileInputRef.current?.focus()
          }}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search comics</DialogTitle>
            <DialogDescription>
              Enter a comic title to see search suggestions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <form
              onSubmit={(event) => event.preventDefault()}
              className="relative min-w-0 flex-1"
            >
              <MagnifyingGlass className="absolute top-3 left-3 size-4 text-muted-foreground" />
              <Input
                ref={mobileInputRef}
                type="search"
                role="combobox"
                aria-label="Search comics"
                aria-autocomplete="list"
                aria-expanded={isMobileOpen}
                aria-controls="mobile-comic-search-results"
                aria-activedescendant={
                  suggestions[activeIndex]
                    ? `mobile-comic-search-option-${activeIndex}`
                    : undefined
                }
                autoComplete="off"
                maxLength={80}
                placeholder="Search comics..."
                className="h-10 w-full pl-9"
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                onKeyDown={handleMobileKeyDown}
              />
            </form>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close search"
              onClick={() => setIsMobileOpen(false)}
            >
              <X />
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {renderSearchResults("mobile")}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Sub-components (unchanged logic, kept in same file) ─────────────────────

interface SearchSuggestionListProps {
  idPrefix: string
  query: string
  suggestions: ComicSearchSuggestion[]
  isLoading: boolean
  hasSearched: boolean
  hasError: boolean
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  onRetry: () => void
  onSelect: () => void
}

function SearchSuggestionList({
  idPrefix,
  query,
  suggestions,
  isLoading,
  hasSearched,
  hasError,
  activeIndex,
  onActiveIndexChange,
  onRetry,
  onSelect,
}: SearchSuggestionListProps) {
  if (query.length < MIN_QUERY_LENGTH) {
    return (
      <p className="px-3 py-5 text-center text-sm text-muted-foreground">
        Enter at least 2 characters to search.
      </p>
    )
  }

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground"
      >
        <CircleNotch className="size-4 animate-spin" />
        <span>Searching comics...</span>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center gap-3 px-3 py-5 text-center">
        <p className="text-sm text-muted-foreground">
          Search is temporarily unavailable.
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }

  if (hasSearched && suggestions.length === 0) {
    return (
      <p className="px-3 py-5 text-center text-sm text-muted-foreground">
        No comics found.
      </p>
    )
  }

  if (!suggestions.length) {
    return (
      <p className="px-3 py-5 text-center text-sm text-muted-foreground">
        Enter at least 2 characters to search.
      </p>
    )
  }

  return (
    <div id={`${idPrefix}-comic-search-results`}>
      <p className="px-3 pt-1 pb-2 text-xs font-medium text-muted-foreground">
        Suggestions
      </p>
      <div
        role="listbox"
        aria-label="Comic suggestions"
        className="flex flex-col gap-1"
      >
        {suggestions.map((suggestion, index) => (
          <SearchSuggestionRow
            key={suggestion.uuid}
            idPrefix={idPrefix}
            suggestion={suggestion}
            index={index}
            activeIndex={activeIndex}
            onActiveIndexChange={onActiveIndexChange}
            onSelect={onSelect}
          />
        ))}
      </div>
      <p className="hidden px-3 pt-2 pb-1 text-xs text-muted-foreground sm:block">
        Use ↑ ↓ to navigate, then Enter to open.
      </p>
    </div>
  )
}

interface SearchSuggestionRowProps {
  idPrefix: string
  suggestion: ComicSearchSuggestion
  index: number
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  onSelect: () => void
}

function SearchSuggestionRow({
  idPrefix,
  suggestion,
  index,
  activeIndex,
  onActiveIndexChange,
  onSelect,
}: SearchSuggestionRowProps) {
  const [coverFailed, setCoverFailed] = useState(false)
  const isActive = index === activeIndex
  const hasAliasMatch =
    suggestion.matchedTitle.toLocaleLowerCase() !==
    suggestion.title.toLocaleLowerCase()

  return (
    <a
      id={`${idPrefix}-comic-search-option-${index}`}
      role="option"
      aria-selected={isActive}
      tabIndex={-1}
      href={`/komik/${suggestion.slug}`}
      className={`flex min-w-0 items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-accent focus-visible:bg-accent ${isActive ? "bg-accent" : ""}`}
      onMouseEnter={() => onActiveIndexChange(index)}
      onClick={onSelect}
    >
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {suggestion.coverUrl && !coverFailed ? (
          <img
            src={suggestion.coverUrl}
            alt=""
            className="size-full object-cover"
            loading="lazy"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <BookOpen className="size-5 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{suggestion.title}</p>
        {hasAliasMatch && (
          <p className="truncate text-xs text-muted-foreground">
            Matched: {suggestion.matchedTitle}
          </p>
        )}
        <div className="mt-1 flex min-w-0 items-center gap-1.5">
          {suggestion.type && (
            <Badge
              variant="secondary"
              className="max-w-24 truncate text-[10px]"
            >
              {suggestion.type}
            </Badge>
          )}
          {suggestion.status && (
            <span className="truncate text-xs text-muted-foreground">
              {suggestion.status}
            </span>
          )}
        </div>
      </div>
    </a>
  )
}
