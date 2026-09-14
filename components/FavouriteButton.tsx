"use client";

import { useEffect, useState } from "react";

const FAVOURITES_EVENT = "ivy-favourites-updated";

type FavouriteButtonProps = {
  listingId: string;
};

function getStorageKey() {
  const email = localStorage.getItem("ivy_user_email");

  if (!email) {
    return null;
  }

  return `ivy_favourites_${email}`;
}

export default function FavouriteButton({
  listingId,
}: FavouriteButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    function updateSavedState() {
      const storageKey = getStorageKey();

      if (!storageKey) {
        setSaved(false);
        return;
      }

      const favourites: string[] = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      setSaved(favourites.includes(listingId));
    }

    updateSavedState();

    window.addEventListener(
      FAVOURITES_EVENT,
      updateSavedState
    );

    window.addEventListener(
      "pageshow",
      updateSavedState
    );

    window.addEventListener(
      "visibilitychange",
      updateSavedState
    );

    return () => {
      window.removeEventListener(
        FAVOURITES_EVENT,
        updateSavedState
      );

      window.removeEventListener(
        "pageshow",
        updateSavedState
      );

      window.removeEventListener(
        "visibilitychange",
        updateSavedState
      );
    };
  }, [listingId]);

  function toggleFavourite(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    const email = localStorage.getItem("ivy_user_email");

    if (!email) {
      window.location.href = "/login";
      return;
    }

    const storageKey = `ivy_favourites_${email}`;

    const favourites: string[] = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    const updated = favourites.includes(listingId)
      ? favourites.filter((id) => id !== listingId)
      : [...favourites, listingId];

    localStorage.setItem(
      storageKey,
      JSON.stringify(updated)
    );

    setSaved(updated.includes(listingId));

    window.dispatchEvent(
      new Event(FAVOURITES_EVENT)
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFavourite}
      aria-label={
        saved
          ? "Remove from favourites"
          : "Add to favourites"
      }
      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur"
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}