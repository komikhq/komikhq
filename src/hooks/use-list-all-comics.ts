import { useState, useEffect } from "react"
import { comicsApi } from "@/lib/sdk-client"

export function useListAllComics() {
  const [comics, setComics] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    const searchParams = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    )
    const search =
      searchParams.get("search") || searchParams.get("q") || undefined
    const genre = searchParams.get("genre") || undefined
    const status = searchParams.get("status") || undefined
    const type = searchParams.get("type") || undefined
    const sort = searchParams.get("sort") || undefined
    const page = searchParams.get("page") || undefined
    const limit = searchParams.get("limit") || undefined

    comicsApi
      .browseComics({ search, genre, status, type, sort, page, limit })
      .then((res: any) => {
        if (isMounted) {
          setComics(res.comics || res.data || [])
        }
      })
      .catch(() => {
        if (isMounted) setComics([])
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    comics,
    isLoading,
  }
}
