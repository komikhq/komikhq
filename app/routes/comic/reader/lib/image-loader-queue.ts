import { PagePriority } from "../types/reader.types"

type QueueCallback = (url: string, success: boolean) => void

interface QueueTask {
  url: string
  pageIndex: number
  priority: PagePriority
  callback?: QueueCallback
}

export class ChapterImageQueue {
  private maxConcurrent = 2
  private activeCount = 0
  private queue: QueueTask[] = []
  private loadedUrls = new Set<string>()
  private failedUrls = new Set<string>()
  private listeners = new Set<(loadedCount: number) => void>()

  constructor(maxConcurrent = 2) {
    this.maxConcurrent = maxConcurrent
  }

  public isLoaded(url: string): boolean {
    return this.loadedUrls.has(url)
  }

  public hasFailed(url: string): boolean {
    return this.failedUrls.has(url)
  }

  public subscribe(listener: (loadedCount: number) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    const count = this.loadedUrls.size
    for (const listener of this.listeners) {
      listener(count)
    }
  }

  public enqueue(
    url: string,
    pageIndex: number,
    priority: PagePriority = PagePriority.NORMAL,
    callback?: QueueCallback
  ): void {
    if (!url || this.loadedUrls.has(url)) {
      if (callback) callback(url, true)
      return
    }

    // Check if task is already in queue
    const existingIndex = this.queue.findIndex((t) => t.url === url)
    if (existingIndex >= 0) {
      // Elevate priority if newer priority is higher (lower number)
      if (priority < this.queue[existingIndex].priority) {
        this.queue[existingIndex].priority = priority
        this.sortQueue()
      }
      return
    }

    this.queue.push({ url, pageIndex, priority, callback })
    this.sortQueue()
    this.processNext()
  }

  public reprioritize(activePageIndex: number, lookahead = 3): void {
    for (const task of this.queue) {
      const diff = task.pageIndex - activePageIndex
      if (diff === 0) {
        task.priority = PagePriority.IMMEDIATE
      } else if (diff === 1) {
        task.priority = PagePriority.HIGH
      } else if (diff > 1 && diff <= lookahead) {
        task.priority = PagePriority.NORMAL
      } else if (diff === -1) {
        task.priority = PagePriority.LOW
      } else {
        task.priority = PagePriority.IDLE
      }
    }
    this.sortQueue()
    this.processNext()
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => a.priority - b.priority)
  }

  private processNext(): void {
    if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) {
      return
    }

    const task = this.queue.shift()
    if (!task) return

    // If already loaded while in queue
    if (this.loadedUrls.has(task.url)) {
      if (task.callback) task.callback(task.url, true)
      this.processNext()
      return
    }

    this.activeCount++

    if (typeof window === "undefined") {
      this.activeCount--
      return
    }

    const img = new Image()
    img.src = task.url

    const cleanup = (success: boolean) => {
      this.activeCount--
      if (success) {
        this.loadedUrls.add(task.url)
      } else {
        this.failedUrls.add(task.url)
      }
      if (task.callback) task.callback(task.url, success)
      this.notify()
      this.processNext()
    }

    img.onload = () => cleanup(true)
    img.onerror = () => cleanup(false)
  }

  public clear(): void {
    this.queue = []
    this.loadedUrls.clear()
    this.failedUrls.clear()
    this.activeCount = 0
  }
}

