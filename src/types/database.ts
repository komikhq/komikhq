export type AccessTier = "free" | "premium" | "plus";
export type ComicStatus = "ongoing" | "completed" | "hiatus";
export type BookmarkStatus = "reading" | "plan_to_read" | "completed" | "dropped";
export type CreatorRole = "author" | "artist" | "story_and_art";
export type UserRole = "user" | "creator" | "admin";

export interface ReadingProgressDetails {
  comicId: string;
  chapterId: string;
  lastReadPage: number;
  totalPages: number;
  completionPercentage: number;
  isCompleted: boolean;
  lastReadAt: Date;
}

export interface ThreadedCommentNode {
  id: string;
  chapterId: string;
  comicId: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string | null;
  rootId?: string | null;
  parentId?: string | null;
  replyToUserId?: string | null;
  replyToUserName?: string | null;
  depth: number;
  pageNumber?: number | null;
  content: string;
  likeCount: number;
  replyCount: number;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  replies?: ThreadedCommentNode[];
}

export interface ComicViewEvent {
  id: string;
  comicId: string;
  chapterId: string;
  userId?: string | null;
  ipHash?: string | null;
  viewedAt: Date;
}
