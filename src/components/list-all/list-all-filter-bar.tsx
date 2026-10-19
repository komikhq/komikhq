import React, { useState } from "react"
import { ListBullets } from "@phosphor-icons/react"
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
  onLetterSelect?: (letter: string) => void
}

export function ListAllFilterBar({ onLetterSelect }: ListAllFilterBarProps) {
  const [activeLetter, setActiveLetter] = useState("ALL")

  const handleSelect = (letter: string) => {
    setActiveLetter(letter)
    if (onLetterSelect) onLetterSelect(letter)

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (letter === "ALL") {
        params.delete("letter")
      } else {
        params.set("letter", letter)
      }
      const queryString = params.toString()
      const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname
      window.history.replaceState(null, "", newUrl)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <ListBullets className="h-5 w-5 text-primary" />
          <span>Daftar Lengkap Komik (A-Z)</span>
        </CardTitle>
        <CardDescription>
          Temukan judul komik favorit Anda berdasarkan abjad judul awal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {ALPHABET.map((char) => {
            const isSpecial = char.length > 1
            return (
              <Button
                key={char}
                variant={activeLetter === char ? "default" : "outline"}
                size="sm"
                className={`h-8 shrink-0 text-xs font-semibold ${
                  isSpecial
                    ? "px-3"
                    : "flex w-8 items-center justify-center p-0"
                }`}
                onClick={() => handleSelect(char)}
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
