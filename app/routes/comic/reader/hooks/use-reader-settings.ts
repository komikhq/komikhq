import { useState, useEffect, useCallback } from "react"
import type { ReaderSettings } from "../types/reader.types"
import {
  DEFAULT_READER_SETTINGS,
  loadReaderSettings,
  saveReaderSettings,
} from "../lib/reader-helpers"

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_READER_SETTINGS)

  // Hydrate from localStorage once mounted on client
  useEffect(() => {
    setSettings(loadReaderSettings())
  }, [])

  const updateSettings = useCallback((updates: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates }
      saveReaderSettings(next)
      return next
    })
  }, [])

  return {
    settings,
    updateSettings,
  }
}

