import React, { useState } from "react";
import { ListBullets, Funnel } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ALPHABET = ["ALL", "#", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

interface ListAllFilterBarProps {
  onLetterSelect?: (letter: string) => void;
}

export function ListAllFilterBar({ onLetterSelect }: ListAllFilterBarProps) {
  const [activeLetter, setActiveLetter] = useState("ALL");

  const handleSelect = (letter: string) => {
    setActiveLetter(letter);
    if (onLetterSelect) onLetterSelect(letter);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (letter === "ALL") {
        params.delete("letter");
      } else {
        params.set("letter", letter);
      }
      const queryString = params.toString();
      const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ListBullets className="h-5 w-5 text-primary" />
          <span>Daftar Lengkap Komik (A-Z)</span>
        </CardTitle>
        <CardDescription>
          Temukan judul komik favorit Anda berdasarkan abjad judul awal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {ALPHABET.map((char) => {
            const isSpecial = char.length > 1;
            return (
              <Button
                key={char}
                variant={activeLetter === char ? "default" : "outline"}
                size="sm"
                className={`h-8 text-xs font-semibold shrink-0 ${
                  isSpecial ? "px-3" : "w-8 p-0 flex items-center justify-center"
                }`}
                onClick={() => handleSelect(char)}
              >
                {char}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
