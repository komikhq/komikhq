import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import type { Route } from "./+types/route"
import { ListAllFilterBar } from "./_components/list-all-filter-bar"
import { ListAllComicTable } from "./_components/list-all-comic-table"
import { useListAllComics } from "@/hooks/use-list-all-comics"
import { SITE_NAME } from "@/constants"

export function meta(): Route.MetaDescriptors {
  return [
    { title: `All Comics A-Z | ${SITE_NAME}` },
    {
      name: "description",
      content:
        "Browse the complete alphabetical A to Z catalog of comics, manga, manhwa, and manhua on KomikHQ.",
    },
    { property: "og:title", content: `All Comics A-Z | ${SITE_NAME}` },
    {
      property: "og:description",
      content:
        "Browse the complete alphabetical A to Z catalog of comics, manga, manhwa, and manhua on KomikHQ.",
    },
  ]
}

export default function ListAllRoute() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { sortedComics, groupedComics, availableLetters, isLoading } =
    useListAllComics()

  // Track currently active letter from URL search params or fallback to "ALL"
  const [activeLetter, setActiveLetter] = useState<string>(() => {
    return searchParams.get("letter") || "ALL"
  })

  // Synchronize active letter when search params change
  useEffect(() => {
    const paramLetter = searchParams.get("letter") || "ALL"
    setActiveLetter(paramLetter)

    if (paramLetter !== "ALL" && !isLoading) {
      const targetElement = document.getElementById(`letter-${paramLetter}`)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [searchParams, isLoading])

  // Handle letter button selection and smooth anchor scrolling
  const handleLetterSelect = (letter: string) => {
    setActiveLetter(letter)

    if (letter === "ALL") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.delete("letter")
          return next
        },
        { replace: true }
      )
    } else {
      const targetElement = document.getElementById(`letter-${letter}`)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" })
      }
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set("letter", letter)
          return next
        },
        { replace: true }
      )
    }
  }

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 pt-4 pb-20">
      <div id="top" className="sr-only" />
      <ListAllFilterBar
        activeLetter={activeLetter}
        onLetterSelect={handleLetterSelect}
        availableLetters={availableLetters}
        totalCount={sortedComics.length}
      />
      <ListAllComicTable
        groupedComics={groupedComics}
        activeLetter={activeLetter}
        isLoading={isLoading}
      />
    </div>
  )
}
