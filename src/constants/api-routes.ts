export const API_PREFIX = "/v1";

export const API_ROUTES = {
  AUTH: {
    BASE: `${API_PREFIX}/auth`,
    SIGN_IN_EMAIL: `${API_PREFIX}/auth/sign-in/email`,
    SIGN_UP_EMAIL: `${API_PREFIX}/auth/sign-up/email`,
    SIGN_IN_GOOGLE: `${API_PREFIX}/auth/sign-in/social?provider=google`,
    SIGN_OUT: `${API_PREFIX}/auth/sign-out`,
    SESSION: `${API_PREFIX}/auth/get-session`,
  },
  COMICS: {
    TRENDING: (period: "weekly" | "daily" = "weekly") =>
      `${API_PREFIX}/comics/trending?period=${period}`,
    BROWSE: (query?: string) =>
      query ? `${API_PREFIX}/comics/browse?${query}` : `${API_PREFIX}/comics/browse`,
    DETAIL: (slug: string) => `${API_PREFIX}/comics/${slug}`,
  },
  USER: {
    PROFILE: `${API_PREFIX}/user/profile`,
    AVATAR: `${API_PREFIX}/user/avatar`,
  },
  BOOKMARKS: {
    LIST: `${API_PREFIX}/bookmarks`,
    ADD: `${API_PREFIX}/bookmarks`,
    REMOVE: (comicId: string) => `${API_PREFIX}/bookmarks/${comicId}`,
  },
  HISTORY: {
    LIST: `${API_PREFIX}/history`,
    RECORD: `${API_PREFIX}/history`,
  },
  COMMENTS: {
    LIST: (params: { comicId?: string; chapterId?: string }) => {
      const query = params.comicId
        ? `comicId=${params.comicId}`
        : `chapterId=${params.chapterId}`;
      return `${API_PREFIX}/comments?${query}`;
    },
    ADD: `${API_PREFIX}/comments`,
    LIKE: (commentId: string) => `${API_PREFIX}/comments/${commentId}/like`,
  },
  RATINGS: {
    SUBMIT: `${API_PREFIX}/ratings`,
  },
  VIEW: `${API_PREFIX}/view`,
} as const;
