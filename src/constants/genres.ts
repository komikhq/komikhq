export interface GenreDefinition {
  readonly name: string;
  readonly slug: string;
}

export const COMMON_GENRES: readonly GenreDefinition[] = [
  { name: "Action", slug: "action" },
  { name: "Adventure", slug: "adventure" },
  { name: "Comedy", slug: "comedy" },
  { name: "Drama", slug: "drama" },
  { name: "Fantasy", slug: "fantasy" },
  { name: "Horror", slug: "horror" },
  { name: "Isekai", slug: "isekai" },
  { name: "Martial Arts", slug: "martial-arts" },
  { name: "Mystery", slug: "mystery" },
  { name: "Romance", slug: "romance" },
  { name: "School Life", slug: "school-life" },
  { name: "Sci-Fi", slug: "sci-fi" },
  { name: "Slice of Life", slug: "slice-of-life" },
  { name: "Sports", slug: "sports" },
  { name: "Supernatural", slug: "supernatural" },
  { name: "Thriller", slug: "thriller" },
] as const;

export const TOP_GENRES_LIMIT = 6;
export const TRENDING_COMICS_LIMIT = 20;
