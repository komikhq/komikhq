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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <ListBullets className="h-5 w-5 text-primary" />
            <span>All Comics Directory (A-Z)</span>
          </CardTitle>
          {totalCount > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              {totalCount} comics indexed
            </span>
          )}
        </div>
        <CardDescription>
          Quick alphabetical dictionary navigation. Click any letter to jump directly to its anchor section.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 pt-1">
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
                className={`h-8 shrink-0 text-xs font-semibold ${
                  isSpecial
                    ? "px-3"
                    : "flex w-8 items-center justify-center p-0"
                } ${!hasEntries ? "opacity-30 cursor-not-allowed" : ""}`}
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
