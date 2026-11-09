import { useNavigation } from "react-router";

export function GlobalLoadingBar() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading" || navigation.state === "submitting";

  if (!isNavigating) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      className="fixed top-0 right-0 left-0 z-[100] h-[3px] bg-primary/20 overflow-hidden pointer-events-none"
    >
      <div className="h-full w-full bg-primary animate-pulse" />
    </div>
  );
}

