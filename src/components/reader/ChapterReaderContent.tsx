import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChatCircleText,
  PaperPlaneRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReaderPageProps {
  comicSlug?: string;
  chapterSlug?: string;
}

export function ChapterReaderContent({ comicSlug, chapterSlug }: ReaderPageProps) {
  const [commentText, setCommentText] = useState("");

  const comicTitle = comicSlug ? comicSlug.replace(/-/g, " ").toUpperCase() : "Comic Reader";
  const chapterNumber = chapterSlug ? chapterSlug.replace(/chapter-/i, "") : "1";
  const totalPages = 10;
  const pages = Array.from({ length: totalPages }, (_, i) => ({
    pageNumber: i + 1,
    imageUrl: `/favicon.svg`,
  }));

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      setCommentText("");
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-300" onClick={() => window.location.href = `/komik/${comicSlug}`}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Back to comic detail</TooltipContent>
            </Tooltip>
            <div>
              <h2 className="text-sm font-bold line-clamp-1">{comicTitle}</h2>
              <p className="text-xs text-neutral-400">Chapter {chapterNumber}</p>
            </div>
          </div>

          <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs px-2.5 py-1">
            Page 1/{totalPages}
          </Badge>
        </header>

        {/* Reader Pages */}
        <main className="max-w-3xl mx-auto py-4 px-2 space-y-2">
          {pages.map((page) => (
            <div
              key={page.pageNumber}
              className="relative w-full min-h-[300px] bg-neutral-900 overflow-hidden flex flex-col items-center justify-center border border-neutral-800 rounded-md"
            >
              <img
                src={page.imageUrl}
                alt={`Page ${page.pageNumber}`}
                className="w-32 h-32 object-contain py-8"
              />
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 backdrop-blur font-mono">
                {page.pageNumber}/{totalPages}
              </span>
            </div>
          ))}
        </main>

        {/* Navigation */}
        <div className="max-w-3xl mx-auto px-4 my-8 flex items-center justify-between gap-4">
          <Button variant="outline" className="border-neutral-800 text-neutral-200" onClick={() => history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Chapter
          </Button>
          <Button className="bg-primary text-primary-foreground">
            Next Chapter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Comments */}
        <section className="max-w-3xl mx-auto px-4 mt-12">
          <Card className="border-neutral-800 bg-neutral-900 text-neutral-100">
            <CardHeader className="border-b border-neutral-800">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ChatCircleText className="h-5 w-5 text-primary" />
                <span>Comments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <form onSubmit={handlePostComment} className="space-y-3">
                <Textarea
                  placeholder="Write a comment for this chapter..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-500 min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={!commentText.trim()}>
                    <PaperPlaneRight className="mr-1.5 h-4 w-4" />
                    Post Comment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </TooltipProvider>
  );
}
