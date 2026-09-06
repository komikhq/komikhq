import { useState, useEffect } from "react";
import { useAdminGenres } from "./use-admin-genres";
import { useImageUpload } from "./use-image-upload";
import type { ComicAdminItem } from "./use-admin-comics";

export interface UseComicFormProps {
  open: boolean;
  comic?: ComicAdminItem | null;
  onSubmit: (formData: FormData) => Promise<boolean>;
  onOpenChange: (open: boolean) => void;
}

export function useComicForm({ open, comic, onSubmit, onOpenChange }: UseComicFormProps) {
  const { genres } = useAdminGenres();
  const coverUpload = useImageUpload({ multiple: false });
  const bannerUpload = useImageUpload({ multiple: false });

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [status, setStatus] = useState("ongoing");
  const [creator, setCreator] = useState("");
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);

  useEffect(() => {
    if (comic) {
      setTitle(comic.title || "");
      setSynopsis(comic.synopsis || "");
      setStatus(comic.status || "ongoing");
      setCreator(comic.creators ? comic.creators.join(", ") : "");
      setSelectedGenreIds(comic.genres ? comic.genres.map((g) => g.id) : []);
    } else {
      setTitle("");
      setSynopsis("");
      setStatus("ongoing");
      setCreator("");
      setSelectedGenreIds([]);
      coverUpload.clearFiles();
      bannerUpload.clearFiles();
    }
  }, [comic, open]);

  const toggleGenre = (id: string) => {
    setSelectedGenreIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("synopsis", synopsis);
    formData.append("status", status);
    formData.append("creator", creator);
    formData.append("genreIds", JSON.stringify(selectedGenreIds));

    if (coverUpload.files[0]) {
      formData.append("cover", coverUpload.files[0].file);
    }
    if (bannerUpload.files[0]) {
      formData.append("banner", bannerUpload.files[0].file);
    }

    const ok = await onSubmit(formData);
    if (ok) {
      onOpenChange(false);
    }
  };

  return {
    genres,
    title,
    setTitle,
    synopsis,
    setSynopsis,
    status,
    setStatus,
    creator,
    setCreator,
    selectedGenreIds,
    toggleGenre,
    coverUpload,
    bannerUpload,
    handleSubmit,
  };
}
