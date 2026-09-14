"use client";

import { useEffect, useState } from "react";

const FAVOURITES_EVENT = "ivy-favourites-updated";

type FavouriteButtonProps = {
  listingId: string;
};

export default function FavouriteButton({
  listingId,
}: FavouriteButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const updateSavedState = () => {
      const favourites: string[] = JSON.parse(
        localStorage.getItem("ivy_favourites") || "[]"
      );

      setSaved(favourites.includes(listingId));
    };

    updateSavedState();

    window.addEventListener(FAVOURITES_EVENT, updateSavedState);

    return () => {
      window.removeEventListener(FAVOURITES_EVENT, updateSavedState);
    };
  }, [listingId]);

  function toggleFavourite(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const favourites: string[] = JSON.parse(
      localStorage.getItem("ivy_favourites") || "[]"
    );

    const updated = favourites.includes(listingId)
      ? favourites.filter((id) => id !== listingId)
      : [...favourites, listingId];

    localStorage.setItem("ivy_favourites", JSON.stringify(updated));

    setSaved(updated.includes(listingId));

    window.dispatchEvent(new Event(FAVOURITES_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggleFavourite}
      aria-label={
        saved ? "Remove from favourites" : "Add to favourites"
      }
      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur"
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}