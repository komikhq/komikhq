export interface ChapterItem {
  id: string;
  chapterNumber: string;
  title?: string;
  slug: string;
  publishedAt: string;
}

export interface ComicDetail {
  id: string;
  title: string;
  slug: string;
  synopsis?: string;
  coverUrl: string;
  bannerUrl?: string;
  status: string;
  totalChapters: number;
  animeTitle?: string;
  animeUrl?: string;
  genres: string[];
  chapters: ChapterItem[];
}
