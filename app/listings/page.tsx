import fs from "fs";
import path from "path";
import FavouriteButton from "@/components/FavouriteButton";
import Navbar from "@/components/Navbar";

type Listing = {
  listing_id: string;
  property_type?: string;
  apartment_name?: string;
  locality?: string;
  bedroom?: number;
  bathroom?: number;
  floor?: number;
  total_floors?: number;
  carpet_area?: number;
  super_built_up_area?: number;
  price?: number;
  is_live?: boolean;
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

export default function ListingsPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    bhk?: string;
    type?: string;
    budget?: string;
  };
}) {
  const filePath = path.join(process.cwd(), "data", "listings.json");

  const listings: Listing[] = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  let filteredListings = listings.filter(
    (listing) => listing.is_live === true
  );

  if (searchParams.q) {
    const query = searchParams.q.toLowerCase();

    filteredListings = filteredListings.filter((listing) => {
      return (
        listing.apartment_name?.toLowerCase().includes(query) ||
        listing.locality?.toLowerCase().includes(query)
      );
    });
  }

  if (searchParams.bhk) {
    const bhk = Number(searchParams.bhk);

    filteredListings = filteredListings.filter(
      (listing) => listing.bedroom === bhk
    );
  }

  if (searchParams.type) {
    filteredListings = filteredListings.filter(
      (listing) =>
        listing.property_type?.toLowerCase() ===
        searchParams.type?.toLowerCase()
    );
  }

  if (searchParams.budget) {
    const maxBudget = Number(searchParams.budget);

    filteredListings = filteredListings.filter(
      (listing) => Number(listing.price || 0) <= maxBudget
    );
  }

  const visibleListings = filteredListings.slice(0, 30);

  return (
    <main className="min-h-screen bg-[#faf9f7] text-zinc-900">
      {/* Navbar */}
      <Navbar />

      {/* Page header */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Properties
          </p>

          <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                Find your next home
              </h1>

              <p className="mt-3 text-zinc-500">
                {filteredListings.length.toLocaleString("en-IN")} live
                properties available
              </p>
            </div>

            <form
              action="/listings"
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                name="q"
                defaultValue={searchParams.q}
                placeholder="Search locality or project..."
                className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-500 sm:w-72"
              />

              <select
                name="bhk"
                defaultValue={searchParams.bhk ?? ""}
                className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-500"
              >
                <option value="">All BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
              </select>

              <button
                type="submit"
                className="h-12 rounded-xl bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing {Math.min(visibleListings.length, filteredListings.length)}{" "}
            of {filteredListings.length.toLocaleString("en-IN")}
          </p>

          <select className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {visibleListings.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-16 text-center">
            <h2 className="text-xl font-semibold">
              No properties found
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Try a different locality or BHK type.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleListings.map((listing) => (
              <a
                key={listing.listing_id}
                href={`/listings/${listing.listing_id}`}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-zinc-400">
                      IVY HOMES
                    </span>
                  </div>

                  <FavouriteButton listingId={listing.listing_id} />

                  <div className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
                    {listing.is_live ? "Live" : "Inactive"}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold">
                        {listing.apartment_name || "Residential Property"}
                      </h2>

                      <p className="mt-1 truncate text-sm text-zinc-500">
                        {listing.locality || "Gurugram"}
                      </p>
                    </div>

                    <p className="whitespace-nowrap font-semibold">
                      {formatPrice(Number(listing.price || 0))}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-4 border-t border-zinc-100 pt-4 text-sm text-zinc-500">
                    <span>{listing.bedroom || "-"} BHK</span>
                    <span>{listing.bathroom || "-"} Bath</span>

                    <span>
                      {(
                        listing.carpet_area ||
                        listing.super_built_up_area ||
                        0
                      ).toLocaleString("en-IN")}{" "}
                      sq.ft
                    </span>
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