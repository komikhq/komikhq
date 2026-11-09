export interface NamedGenre {
  id?: string
  name: string
  slug: string
}

const genreCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
  ignorePunctuation: false,
})

function compareCodePointOrder(left: string, right: string): number {
  const leftPoints = Array.from(left, (character) => character.codePointAt(0)!)
  const rightPoints = Array.from(
    right,
    (character) => character.codePointAt(0)!
  )
  const sharedLength = Math.min(leftPoints.length, rightPoints.length)

  for (let index = 0; index < sharedLength; index += 1) {
    if (leftPoints[index] !== rightPoints[index]) {
      return leftPoints[index] - rightPoints[index]
    }
  }

  return leftPoints.length - rightPoints.length
}

export function sortGenresByNaturalName<T extends NamedGenre>(
  genres: T[]
): T[] {
  return [...genres].sort(
    (a, b) =>
      genreCollator.compare(a.name, b.name) ||
      compareCodePointOrder(
        a.name.normalize("NFKC"),
        b.name.normalize("NFKC")
      ) ||
      compareCodePointOrder(a.name, b.name) ||
      compareCodePointOrder(a.slug, b.slug) ||
      compareCodePointOrder(a.id || "", b.id || "")
  )
}
