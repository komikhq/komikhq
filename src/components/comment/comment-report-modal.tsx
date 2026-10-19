import React, { useState } from "react"
import {
  WarningIcon as Warning,
  XIcon as X,
  PaperPlaneRightIcon as PaperPlaneRight,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CommentReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (
    reason: string,
    details?: string,
    guestInfo?: { guestName?: string; guestEmail?: string }
  ) => Promise<void>
  isLoggedIn?: boolean
}

const REPORT_REASONS = [
  { id: "SPAM", label: "Spam or promotional advertising" },
  { id: "HARASSMENT", label: "Hate speech / Harassment / Discrimination" },
  { id: "SPOILER", label: "Story spoiler without spoiler tag" },
  { id: "NSFW", label: "Adult or inappropriate content" },
  { id: "OTHER", label: "Other (explain below)" },
]

export function CommentReportModal({
  isOpen,
  onClose,
  onSubmit,
  isLoggedIn = false,
}: CommentReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("SPAM")
  const [details, setDetails] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!isLoggedIn && (!guestName.trim() || !guestEmail.trim())) {
      alert("Name and Email are required to submit a report!")
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(selectedReason, details.trim() || undefined, {
        guestName: !isLoggedIn ? guestName.trim() : undefined,
        guestEmail: !isLoggedIn ? guestEmail.trim() : undefined,
      })
      onClose()
    } catch (err: any) {
      alert(err.message || "Failed to submit report")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-neutral-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 text-base font-bold text-amber-400">
            <Warning className="h-5 w-5 shrink-0" />
            <span>Report Comment</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLoggedIn && (
            <div className="space-y-2">
              <p className="font-semibold text-neutral-300">
                Reporter Identity (Guest)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  placeholder="Your Name*"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  className="h-8 border-neutral-800 bg-neutral-950 text-xs"
                />
                <Input
                  type="email"
                  placeholder="Your Email*"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                  className="h-8 border-neutral-800 bg-neutral-950 text-xs"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="font-semibold text-neutral-300">
              Select Reason for Report:
            </p>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.id}
                  className="hover:bg-neutral-850 flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-800 p-2 transition-colors"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.id}
                    checked={selectedReason === r.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-primary"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-neutral-300">
              Additional Details (Optional):
            </label>
            <Textarea
              placeholder="Provide more context if necessary..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[60px] border-neutral-800 bg-neutral-950 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="destructive"
              disabled={isSubmitting}
            >
              <PaperPlaneRight className="mr-1.5 h-3.5 w-3.5" />
              {isSubmitting ? "Sending..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
