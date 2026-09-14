"use client";

import { useEffect, useState } from "react";

type FavouriteButtonProps = {
  listingId: string;
};

export default function FavouriteButton({
  listingId,
}: FavouriteButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("ivy_favourites") || "[]"
    );

    setSaved(stored.includes(listingId));
  }, [listingId]);

  function toggleFavourite(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const stored: string[] = JSON.parse(
      localStorage.getItem("ivy_favourites") || "[]"
    );

    let updated: string[];

    if (stored.includes(listingId)) {
      updated = stored.filter((id) => id !== listingId);
      setSaved(false);
    } else {
      updated = [...stored, listingId];
      setSaved(true);
    }

    localStorage.setItem(
      "ivy_favourites",
      JSON.stringify(updated)
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFavourite}
      aria-label={saved ? "Remove from favourites" : "Add to favourites"}
      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur"
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}