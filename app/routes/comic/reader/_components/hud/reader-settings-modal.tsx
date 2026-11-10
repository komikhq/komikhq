import {
  GearIcon as Gear,
  SlidersIcon as Sliders,
  ArrowsInLineVerticalIcon as ArrowsInLineVertical,
  BookOpenTextIcon as BookOpenText,
} from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useReader } from "../../context/reader-context"
import type { ReaderMode, ReaderWidth, ReaderSpacing } from "../../types/reader.types"

export function ReaderSettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, settings, updateSettings } = useReader()

  const handleModeChange = (mode: ReaderMode) => {
    updateSettings({ mode })
  }

  const handleWidthChange = (width: ReaderWidth) => {
    updateSettings({ width })
  }

  const handleSpacingChange = (spacing: ReaderSpacing) => {
    updateSettings({ spacing })
  }

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent className="max-w-md border-neutral-800 bg-neutral-900 text-neutral-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-white">
            <Gear className="h-5 w-5 text-primary" />
            Reader Settings
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-400">
            Customize your reading experience and layout preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2 text-xs">
          {/* Reading Mode */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
              <BookOpenText className="h-4 w-4 text-primary" />
              Reading Mode
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                size="sm"
                variant={settings.mode === "webtoon" ? "default" : "outline"}
                className={settings.mode === "webtoon" ? "bg-primary text-black" : "border-neutral-700 bg-neutral-800 text-neutral-300"}
                onClick={() => handleModeChange("webtoon")}
              >
                Webtoon
              </Button>
              <Button
                type="button"
                size="sm"
                variant={settings.mode === "paged-ltr" ? "default" : "outline"}
                className={settings.mode === "paged-ltr" ? "bg-primary text-black" : "border-neutral-700 bg-neutral-800 text-neutral-300"}
                onClick={() => handleModeChange("paged-ltr")}
              >
                Single (LTR)
              </Button>
              <Button
                type="button"
                size="sm"
                variant={settings.mode === "paged-rtl" ? "default" : "outline"}
                className={settings.mode === "paged-rtl" ? "bg-primary text-black" : "border-neutral-700 bg-neutral-800 text-neutral-300"}
                onClick={() => handleModeChange("paged-rtl")}
              >
                Manga (RTL)
              </Button>
            </div>
          </div>

          {/* Reader Width */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
              <Sliders className="h-4 w-4 text-primary" />
              Reading Width
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {(["compact", "standard", "wide", "full"] as ReaderWidth[]).map((w) => (
                <Button
                  key={w}
                  type="button"
                  size="sm"
                  variant={settings.width === w ? "default" : "outline"}
                  className={`capitalize ${
                    settings.width === w
                      ? "bg-primary text-black"
                      : "border-neutral-700 bg-neutral-800 text-neutral-300"
                  }`}
                  onClick={() => handleWidthChange(w)}
                >
                  {w}
                </Button>
              ))}
            </div>
          </div>

          {/* Spacing (Webtoon Mode only) */}
          {settings.mode === "webtoon" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
                <ArrowsInLineVertical className="h-4 w-4 text-primary" />
                Image Spacing
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={settings.spacing === "seamless" ? "default" : "outline"}
                  className={settings.spacing === "seamless" ? "bg-primary text-black" : "border-neutral-700 bg-neutral-800 text-neutral-300"}
                  onClick={() => handleSpacingChange("seamless")}
                >
                  Seamless (0px)
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={settings.spacing === "spaced" ? "default" : "outline"}
                  className={settings.spacing === "spaced" ? "bg-primary text-black" : "border-neutral-700 bg-neutral-800 text-neutral-300"}
                  onClick={() => handleSpacingChange("spaced")}
                >
                  Spaced (16px)
                </Button>
              </div>
            </div>
          )}

          {/* Auto Hide HUD Switch */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
            <div>
              <p className="font-semibold text-neutral-200">Auto-hide Navigation Bars</p>
              <p className="text-[11px] text-neutral-500">
                Hide header and bottom controls automatically when scrolling down
              </p>
            </div>
            <Switch
              checked={settings.autoHideHud}
              onCheckedChange={(checked) => updateSettings({ autoHideHud: checked })}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

