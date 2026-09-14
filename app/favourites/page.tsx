"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

const FAVOURITES_EVENT = "ivy-favourites-updated";

type Listing = {
  listing_id: string;
  apartment_name?: string;
  locality?: string;
  bedroom?: number;
  bathroom?: number;
  carpet_area?: number;
  price?: number;
};

function formatPrice(price: number) {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }

  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

export default function FavouritesPage() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("ivy_access_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    async function loadFavourites() {
      const favouriteIds: string[] = JSON.parse(
        localStorage.getItem("ivy_favourites") || "[]"
      );

      if (favouriteIds.length === 0) {
        setListings([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/favourites?ids=${favouriteIds.join(",")}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load favourites");
        }

        const data = await response.json();
        setListings(data);
      } catch {
        setListings([]);
      }
    }

    loadFavourites();

    function handleFavouritesUpdated() {
      loadFavourites();
    }

    function handlePageShow() {
      loadFavourites();
    }

    window.addEventListener(
      FAVOURITES_EVENT,
      handleFavouritesUpdated
    );

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener(
        FAVOURITES_EVENT,
        handleFavouritesUpdated
      );

      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#faf9f7] text-zinc-900">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
          Saved properties
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Your favourites
        </h1>

        <p className="mt-3 text-zinc-500">
          Properties you've saved for later.
        </p>

        {listings.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-16 text-center">
            <p className="text-lg font-semibold">
              No saved properties yet
            </p>

            <a
              href="/listings"
              className="mt-5 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white"
            >
              Browse properties
            </a>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <a
                key={listing.listing_id}
                href={`/listings/${listing.listing_id}`}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-52 items-center justify-center bg-zinc-100 text-sm text-zinc-400">
                  IVY HOMES
                </div>

                <div className="p-5">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="font-semibold">
                        {listing.apartment_name || "Property"}
                      </h2>

                      <p className="mt-1 text-sm text-zinc-500">
                        {listing.locality}
                      </p>
                    </div>

                    <p className="font-semibold">
                      {formatPrice(Number(listing.price || 0))}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-zinc-100 pt-4 text-sm text-zinc-500">
                    {listing.bedroom} BHK · {listing.bathroom} Bath ·{" "}
                    {listing.carpet_area?.toLocaleString("en-IN")} sq.ft
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}