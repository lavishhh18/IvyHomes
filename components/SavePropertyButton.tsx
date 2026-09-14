"use client";

import { useEffect, useState } from "react";

export default function SavePropertyButton({
  listingId,
}: {
  listingId: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const favourites: string[] = JSON.parse(
      localStorage.getItem("ivy_favourites") || "[]"
    );

    setSaved(favourites.includes(listingId));
  }, [listingId]);

  function toggleSave() {
    const favourites: string[] = JSON.parse(
      localStorage.getItem("ivy_favourites") || "[]"
    );

    if (favourites.includes(listingId)) {
      const updated = favourites.filter((id) => id !== listingId);
      localStorage.setItem("ivy_favourites", JSON.stringify(updated));
      setSaved(false);
    } else {
      const updated = [...favourites, listingId];
      localStorage.setItem("ivy_favourites", JSON.stringify(updated));
      setSaved(true);
    }
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