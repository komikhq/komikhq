import {
  MagnifyingGlassIcon as MagnifyingGlass,
  FunnelIcon as Funnel,
} from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useBrowseFilters } from "@/hooks/use-browse-filters"

interface BrowseFilterBarProps {
  onFilterChange?: (filters: {
    search: string
    genre: string
    status: string
    sort: string
  }) => void
}

export function BrowseFilterBar({ onFilterChange }: BrowseFilterBarProps) {
  const {
    search,
    statusFilter,
    sortBy,
    genreItems,
    selectedGenreItem,
    handleSearchChange,
    handleSelectGenreItem,
    handleStatusChange,
    handleSortChange,
  } = useBrowseFilters(onFilterChange)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Funnel className="h-5 w-5 text-primary" />
          <span>Filter & Browse Comics</span>
        </CardTitle>
        <CardDescription>
          Search and filter manga, manhwa, and manhua titles to your preference.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search comic titles..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="w-full sm:w-52">
            <Combobox
              items={genreItems}
              value={selectedGenreItem}
              onValueChange={handleSelectGenreItem}
              itemToStringLabel={(item: any) => item?.name || ""}
            >
              <ComboboxInput placeholder="All Genres" />
              <ComboboxContent>
                <ComboboxEmpty>Genre not found.</ComboboxEmpty>
                <ComboboxList>
                  {genreItems.map((item) => (
                    <ComboboxItem key={item.slug} value={item}>
                      {item.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
