export type NavIconName =
  | "House"
  | "BookmarkSimple"
  | "ClockCounterClockwise"
  | "UserCircle"
  | "Compass"
  | "ListBullets";

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly iconName: NavIconName;
}

export const BOTTOM_NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/", iconName: "House" },
  { label: "Bookmark", href: "/bookmark", iconName: "BookmarkSimple" },
  { label: "History", href: "/history", iconName: "ClockCounterClockwise" },
  { label: "Account", href: "/account", iconName: "UserCircle" },
] as const;

export const HEADER_NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/", iconName: "House" },
  { label: "Browse", href: "/browse", iconName: "Compass" },
  { label: "List All", href: "/list-all", iconName: "ListBullets" },
] as const;
