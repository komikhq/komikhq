import JSZip from "jszip"

/** Supported image extensions from komikhq-clipper output */
const IMAGE_EXTENSIONS = new Set(["webp", "png", "jpg", "jpeg", "gif", "avif"])

/** Junk entries to always skip */
const JUNK_PATTERNS = [
  "__MACOSX",
  ".DS_Store",
  "Thumbs.db",
  "desktop.ini",
  ".gitkeep",
]

/** MIME type lookup by extension */
const EXT_TO_MIME: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  avif: "image/avif",
}

interface ZipImageEntry {
  /** Numeric sort key parsed from filename (e.g. 1 from "001.webp") */
  sortKey: number
  /** Original filename inside the ZIP */
  filename: string
  /** File extension */
  ext: string
  /** JSZip file object */
  zipObject: JSZip.JSZipObject
}

/**
 * Check if a ZIP entry path is a junk file that should be skipped.
 */
function isJunkEntry(path: string): boolean {
  return JUNK_PATTERNS.some(
    (pattern) => path.includes(pattern) || path.startsWith(".")
  )
}

/**
 * Extract a valid image filename pattern: digits followed by a supported extension.
 * Returns null if the filename doesn't match.
 */
function parseImageFilename(
  filename: string
): { sortKey: number; ext: string } | null {
  const match = filename.match(/^(\d+)\.(webp|png|jpe?g|gif|avif)$/i)
  if (!match) return null
  return {
    sortKey: parseInt(match[1], 10),
    ext: match[2].toLowerCase(),
  }
}

/**
 * Extract images from a ZIP file (produced by komikhq-clipper) and return
 * them as a sorted File[] array ready to be fed into the upload pipeline.
 *
 * The ZIP is expected to contain sequentially-named image files like:
 *   001.webp, 002.webp, 003.png, ...
 *
 * If all images are inside a single subfolder, they are auto-flattened.
 * Non-image entries and junk files are silently skipped.
 *
 * @throws Error if the file is not a valid ZIP or contains no valid images.
 */
export async function extractZipToFiles(zipFile: File): Promise<{
  files: File[]
  totalEntries: number
  skippedCount: number
}> {
  let zip: JSZip

  try {
    zip = await JSZip.loadAsync(zipFile)
  } catch {
    throw new Error(
      "Invalid or corrupted ZIP file. Please ensure the file is a valid ZIP archive."
    )
  }

  // Collect all non-directory entries
  const allEntries: { path: string; obj: JSZip.JSZipObject }[] = []
  zip.forEach((relativePath, file) => {
    if (!file.dir) {
      allEntries.push({ path: relativePath, obj: file })
    }
  })

  const totalEntries = allEntries.length

  if (totalEntries === 0) {
    throw new Error("ZIP file is empty. No files found inside the archive.")
  }

  // Filter out junk entries and collect image entries
  const imageEntries: ZipImageEntry[] = []
  let skippedCount = 0

  for (const entry of allEntries) {
    if (isJunkEntry(entry.path)) {
      skippedCount++
      continue
    }

    // Get just the filename (handle possible subfolder)
    const filename = entry.path.split("/").pop() || ""

    const parsed = parseImageFilename(filename)
    if (!parsed) {
      skippedCount++
      continue
    }

    imageEntries.push({
      sortKey: parsed.sortKey,
      filename,
      ext: parsed.ext,
      zipObject: entry.obj,
    })
  }

  if (imageEntries.length === 0) {
    throw new Error(
      "No valid comic page images found in ZIP. Expected files like 001.webp, 002.png, etc."
    )
  }

  // Sort by numeric key
  imageEntries.sort((a, b) => a.sortKey - b.sortKey)

  // Convert each entry to a File object
  const files: File[] = []

  for (const entry of imageEntries) {
    const blob = await entry.zipObject.async("blob")
    const mimeType = EXT_TO_MIME[entry.ext] || "image/webp"

    // Normalize filename to ensure consistent naming
    const normalizedName = entry.filename

    const file = new File([blob], normalizedName, { type: mimeType })
    files.push(file)
  }

  return {
    files,
    totalEntries,
    skippedCount,
  }
}

/**
 * Check if a File object is a ZIP archive.
 */
export function isZipFile(file: File): boolean {
  return (
    file.type === "application/zip" ||
    file.type === "application/x-zip-compressed" ||
    file.name.toLowerCase().endsWith(".zip")
  )
}
