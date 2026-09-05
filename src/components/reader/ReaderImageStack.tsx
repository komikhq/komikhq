import React from "react";

interface ReaderImageStackProps {
  totalPages?: number;
}

export function ReaderImageStack({ totalPages = 10 }: ReaderImageStackProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => ({
    pageNumber: i + 1,
    imageUrl: `/favicon.svg`,
  }));

  return (
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
  );
}
