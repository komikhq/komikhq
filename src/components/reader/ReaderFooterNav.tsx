import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ChatCircleText, PaperPlaneRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function ReaderFooterNav() {
  const [commentText, setCommentText] = useState("");

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      setCommentText("");
    }
  };

  return (
    <>
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
    </>
  );
}
