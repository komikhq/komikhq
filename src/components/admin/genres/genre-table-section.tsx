import React from "react"
import {
  Plus,
  Tag,
  PencilSimple,
  Trash,
  CaretDown,
  CaretUp,
  Info,
  FloppyDisk,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdminGenres } from "@/hooks/use-admin-genres"

export function GenreTableSection() {
  const {
    genres,
    loading,
    submitting,
    newName,
    setNewName,
    newDesc,
    setNewDesc,
    expandedId,
    setExpandedId,
    editName,
    setEditName,
    editDesc,
    setEditDesc,
    confirmDeleteId,
    setConfirmDeleteId,
    handleAdd,
    toggleExpand,
    handleSaveEdit,
    handleDeleteConfirm,
  } = useAdminGenres()

  return (
    <Card className="w-full border-border/60 shadow-xs">
      <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Tag className="h-5 w-5 text-primary" />
            <span>Genre Management</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Manage comic categories & genres directly and swiftly on KomikHQ.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cloudflare-style Inline Add New Genre Bar */}
        <form
          onSubmit={handleAdd}
          className="flex flex-col items-center gap-2.5 rounded-xl border border-border/60 bg-muted/40 p-3.5 shadow-2xs sm:flex-row"
        >
          <div className="w-full flex-1 space-y-1">
            <Input
              placeholder="New Genre Name (e.g. Action, Sci-Fi)"
              className="h-9 bg-background text-xs"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="w-full flex-[1.5] space-y-1">
            <Input
              placeholder="Brief Genre Description (optional)"
              className="h-9 bg-background text-xs"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={submitting || !newName.trim()}
            className="h-9 w-full shrink-0 gap-1.5 text-xs sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{submitting ? "Adding..." : "Add Genre"}</span>
          </Button>
        </form>

        {/* Cloudflare DNS Style Expandable Accordion Table */}
        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/60 font-semibold text-muted-foreground select-none">
              <tr>
                <th className="w-10 p-3 text-center">#</th>
                <th className="p-3">Genre Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Actions & Quick Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>Loading genres...</span>
                    </div>
                  </td>
                </tr>
              ) : genres.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No genres registered yet. Add your first genre above.
                  </td>
                </tr>
              ) : (
                genres.map((g, index) => {
                  const isExpanded = expandedId === g.id
                  const isConfirmingDelete = confirmDeleteId === g.id

                  return (
                    <React.Fragment key={g.id}>
                      {/* Main Summary Row */}
                      <tr
                        onClick={() => toggleExpand(g)}
                        className={`cursor-pointer transition-colors ${
                          isExpanded
                            ? "border-b-0 bg-muted/50"
                            : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="p-3 text-center font-mono text-[11px] text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="p-3 font-semibold text-foreground">
                          <div className="flex items-center gap-2">
                            <span>{g.name}</span>
                            {isExpanded && (
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-[10px] text-primary"
                              >
                                Editing
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-muted-foreground">
                          {g.slug}
                        </td>
                        <td className="max-w-xs truncate p-3 text-muted-foreground">
                          {g.description || "-"}
                        </td>
                        <td
                          className="p-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant={isExpanded ? "secondary" : "outline"}
                              className="h-7 gap-1 px-2.5 text-[11px]"
                              onClick={() => toggleExpand(g)}
                            >
                              {isExpanded ? (
                                <CaretUp className="h-3.5 w-3.5" />
                              ) : (
                                <CaretDown className="h-3.5 w-3.5" />
                              )}
                              <span>{isExpanded ? "Close" : "Edit"}</span>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                setConfirmDeleteId(
                                  isConfirmingDelete ? null : g.id
                                )
                              }
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Accordion Panel Row (Cloudflare DNS Style Editor) */}
                      {isExpanded && (
                        <tr className="border-b border-border/60 bg-muted/40">
                          <td colSpan={5} className="p-4 pt-2">
                            <div className="space-y-4 rounded-xl border border-border/60 bg-background p-4 shadow-2xs">
                              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                  <PencilSimple className="h-4 w-4 text-primary" />
                                  <span>Quick Edit Genre</span>
                                </h4>
                                <span className="font-mono text-[11px] text-muted-foreground">
                                  ID: {g.id}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-muted-foreground">
                                    Genre Name
                                  </label>
                                  <Input
                                    className="h-8 bg-background text-xs"
                                    value={editName}
                                    onChange={(e) =>
                                      setEditName(e.target.value)
                                    }
                                    placeholder="Genre Name"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-muted-foreground">
                                    Slug (Automatic)
                                  </label>
                                  <Input
                                    disabled
                                    className="h-8 bg-muted font-mono text-xs text-muted-foreground"
                                    value={g.slug}
                                  />
                                </div>

                                <div className="space-y-1 sm:col-span-2">
                                  <label className="text-[11px] font-semibold text-muted-foreground">
                                    Genre Description
                                  </label>
                                  <Input
                                    className="h-8 bg-background text-xs"
                                    value={editDesc}
                                    onChange={(e) =>
                                      setEditDesc(e.target.value)
                                    }
                                    placeholder="Write genre description..."
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between border-t border-border/40 pt-2">
                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <Info className="h-3.5 w-3.5" />
                                  <span>
                                    Changes will immediately update associated
                                    comic relations.
                                  </span>
                                </span>

                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => setExpandedId(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-7 gap-1 text-xs"
                                    disabled={submitting}
                                    onClick={() => handleSaveEdit(g.id)}
                                  >
                                    <FloppyDisk className="h-3.5 w-3.5" />
                                    <span>
                                      {submitting
                                        ? "Saving..."
                                        : "Save Changes"}
                                    </span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Inline Delete Confirmation Drawer */}
                      {isConfirmingDelete && (
                        <tr className="border-b border-destructive/20 bg-destructive/10">
                          <td colSpan={5} className="p-3 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-xs font-semibold text-destructive">
                                Permanently delete genre{" "}
                                <strong>"{g.name}"</strong>?
                              </span>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 text-xs"
                                onClick={() => handleDeleteConfirm(g.id)}
                              >
                                Yes, Delete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
