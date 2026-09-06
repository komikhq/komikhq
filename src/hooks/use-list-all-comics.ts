import { useState, useEffect } from "react";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export function useListAllComics() {
  const [comics, setComics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = typeof window !== "undefined" ? window.location.search : "";
    const endpoint = API_ROUTES.COMICS.BROWSE(params.replace(/^\?/, ""));

    apiFetch(endpoint)
      .then((res) => {
        if (isMounted) {
          setComics(res.comics || res.data || []);
        }
      })
      .catch(() => {
        if (isMounted) setComics([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    comics,
    isLoading,
  };
}
