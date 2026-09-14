"use client";

import { useEffect, useState } from "react";

const FAVOURITES_EVENT = "ivy-favourites-updated";

type SavePropertyButtonProps = {
  listingId: string;
};

export default function SavePropertyButton({
  listingId,
}: SavePropertyButtonProps) {
  const [saved, setSaved] = useState(false);

  function getStorageKey() {
    const email = localStorage.getItem("ivy_user_email");

    if (!email) {
      return null;
    }

    return `ivy_favourites_${email}`;
  }

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

    return () => {
      window.removeEventListener(
        FAVOURITES_EVENT,
        updateSavedState
      );

      window.removeEventListener(
        "pageshow",
        updateSavedState
      );
    };
  }, [listingId]);

  function toggleSave() {
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
      onClick={toggleSave}
      className="mt-3 w-full rounded-xl border border-zinc-200 py-3 text-sm font-semibold transition hover:bg-zinc-50"
    >
      {saved ? "♥ Saved to favourites" : "♡ Save property"}
    </button>
  );
}