import { ListBulletsIcon as ListBullets } from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ALPHABET = [
  "ALL",
  "#",
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
]

interface ListAllFilterBarProps {
  activeLetter: string
  onLetterSelect: (letter: string) => void
  availableLetters: Set<string>
  totalCount: number
}

export function ListAllFilterBar({
  activeLetter,
  onLetterSelect,
  availableLetters,
  totalCount,
}: ListAllFilterBarProps) {
  return (
    <Card className="sticky top-16 z-20 border shadow-sm backdrop-blur-md bg-card/95 transition-all">
      <CardHeader className="pb-2 pt-3 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold">
            <ListBullets className="h-5 w-5 text-primary shrink-0" />
            <span>Comic Dictionary Index (A-Z)</span>
          </CardTitle>
          {totalCount > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              {totalCount} comics indexed
            </span>
          )}
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Quick alphabetical dictionary navigation. Click any letter to jump directly to its anchor section.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-1 sm:px-6">
        {/* Horizontal scrollable or wrapping thumb index bar */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-1">
          {ALPHABET.map((char) => {
            const isSpecial = char.length > 1
            const isActive = activeLetter === char
            const hasEntries = char === "ALL" || availableLetters.has(char)

            return (
              <Button
                key={char}
                variant={isActive ? "default" : "outline"}
                size="sm"
                disabled={!hasEntries}
                title={
                  !hasEntries
                    ? `No comics starting with "${char}"`
                    : `Jump to letter ${char}`
                }
                className={`h-7 sm:h-8 shrink-0 text-xs font-semibold transition-all ${
                  isSpecial ? "px-2.5 sm:px-3" : "w-7 sm:w-8 p-0"
                } ${
                  !hasEntries
                    ? "opacity-30 cursor-not-allowed border-dashed"
                    : "hover:border-primary/50"
                } ${isActive ? "shadow-sm ring-1 ring-primary/40" : ""}`}
                onClick={() => onLetterSelect(char)}
              >
                {char}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
