import fs from "fs";
import path from "path";
import FavouriteButton from "@/components/FavouriteButton";
import Navbar from "@/components/Navbar";

type Listing = {
  listing_id: string;
  apartment_name?: string;
  locality?: string;
  property_type?: string;
  bedroom?: number;
  bathroom?: number;
  furnishing?: string;
  floor?: number;
  total_floors?: number;
  carpet_area?: number;
  super_built_up_area?: number;
  price?: number;
  is_live?: boolean;
};

type SearchParams = {
  q?: string;
  bhk?: string;
  type?: string;
  min_price?: string;
  max_price?: string;
  furnishing?: string;
  sort?: string;
  page?: string;
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

function buildQuery(params: SearchParams, page?: number) {
  const query = new URLSearchParams();

  if (params.q) {
    query.set("q", params.q);
  }

  if (params.bhk) {
    query.set("bhk", params.bhk);
  }

  if (params.type) {
    query.set("type", params.type);
  }

  if (params.min_price) {
    query.set("min_price", params.min_price);
  }

  if (params.max_price) {
    query.set("max_price", params.max_price);
  }

  if (params.furnishing) {
    query.set("furnishing", params.furnishing);
  }

  if (params.sort) {
    query.set("sort", params.sort);
  }

  if (page && page > 1) {
    query.set("page", String(page));
  }

  return query.toString();
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filePath = path.join(
    process.cwd(),
    "data",
    "listings.json"
  );

  const listings: Listing[] = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  let filteredListings = listings.filter(
    (listing) => listing.is_live === true
  );

  if (params.q) {
    const query = params.q.toLowerCase();

    filteredListings = filteredListings.filter((listing) => {
      return (
        listing.locality?.toLowerCase().includes(query) ||
        listing.apartment_name?.toLowerCase().includes(query)
      );
    });
  }

  if (params.bhk) {
    const bhk = Number(params.bhk);

    if (Number.isFinite(bhk)) {
      filteredListings = filteredListings.filter(
        (listing) => listing.bedroom === bhk
      );
    }
  }

  if (params.type) {
    filteredListings = filteredListings.filter(
      (listing) =>
        listing.property_type?.toLowerCase() ===
        params.type?.toLowerCase()
    );
  }

  if (params.furnishing) {
    filteredListings = filteredListings.filter(
      (listing) =>
        listing.furnishing?.toLowerCase() ===
        params.furnishing?.toLowerCase()
    );
  }

  if (params.min_price) {
    const minPrice = Number(params.min_price);

    if (Number.isFinite(minPrice)) {
      filteredListings = filteredListings.filter(
        (listing) => Number(listing.price || 0) >= minPrice
      );
    }
  }

  if (params.max_price) {
    const maxPrice = Number(params.max_price);

    if (Number.isFinite(maxPrice)) {
      filteredListings = filteredListings.filter(
        (listing) => Number(listing.price || 0) <= maxPrice
      );
    }
  }

  if (params.sort === "price-asc") {
    filteredListings.sort(
      (a, b) =>
        Number(a.price || 0) - Number(b.price || 0)
    );
  }

  if (params.sort === "price-desc") {
    filteredListings.sort(
      (a, b) =>
        Number(b.price || 0) - Number(a.price || 0)
    );
  }

  if (params.sort === "area-desc") {
    filteredListings.sort(
      (a, b) =>
        Number(
          b.carpet_area || b.super_built_up_area || 0
        ) -
        Number(
          a.carpet_area || a.super_built_up_area || 0
        )
    );
  }

  const pageSize = 12;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredListings.length / pageSize)
  );

  const parsedPage = Number(params.page);

  const requestedPage = Number.isFinite(parsedPage)
    ? parsedPage
    : 1;

  const currentPage = Math.min(
    Math.max(requestedPage, 1),
    totalPages
  );

  const startIndex = (currentPage - 1) * pageSize;

  const visibleListings = filteredListings.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <main className="min-h-screen bg-[#faf9f7] text-zinc-900">
      <Navbar />

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
                {filteredListings.length.toLocaleString("en-IN")} live{" "}
                {filteredListings.length === 1
                  ? "property"
                  : "properties"}{" "}
                available
              </p>
            </div>

            <form
              action="/listings"
              method="GET"
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6"
            >
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Search locality or project..."
                className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-500 lg:col-span-2"
              />

              <select
                name="bhk"
                defaultValue={params.bhk ?? ""}
                className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
              >
                <option value="">All BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
              </select>

              <select
                name="type"
                defaultValue={params.type ?? ""}
                className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
              >
                <option value="">Any property</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="independent house">
                  Independent house
                </option>
                <option value="plot">Plot</option>
                <option value="builder floor">
                  Builder floor
                </option>
              </select>

              <select
                name="furnishing"
                defaultValue={params.furnishing ?? ""}
                className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
              >
                <option value="">Any furnishing</option>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">
                  Semi-furnished
                </option>
                <option value="fully-furnished">
                  Fully-furnished
                </option>
              </select>

              <select
                name="min_price"
                defaultValue={params.min_price ?? ""}
                className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
              >
                <option value="">Min price</option>
                <option value="5000000">₹50 L</option>
                <option value="10000000">₹1 Cr</option>
                <option value="15000000">₹1.5 Cr</option>
                <option value="20000000">₹2 Cr</option>
              </select>

              <select
                name="max_price"
                defaultValue={params.max_price ?? ""}
                className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none"
              >
                <option value="">Max price</option>
                <option value="10000000">₹1 Cr</option>
                <option value="15000000">₹1.5 Cr</option>
                <option value="20000000">₹2 Cr</option>
                <option value="30000000">₹3 Cr</option>
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

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            {filteredListings.length === 0
              ? "Showing 0 properties"
              : `Showing ${startIndex + 1}–${Math.min(
                  startIndex + pageSize,
                  filteredListings.length
                )} of ${filteredListings.length.toLocaleString(
                  "en-IN"
                )}`}
          </p>

          <form
            action="/listings"
            method="GET"
            className="flex items-center gap-2"
          >
            {params.q && (
              <input
                type="hidden"
                name="q"
                value={params.q}
              />
            )}

            {params.bhk && (
              <input
                type="hidden"
                name="bhk"
                value={params.bhk}
              />
            )}

            {params.type && (
              <input
                type="hidden"
                name="type"
                value={params.type}
              />
            )}

            {params.min_price && (
              <input
                type="hidden"
                name="min_price"
                value={params.min_price}
              />
            )}

            {params.max_price && (
              <input
                type="hidden"
                name="max_price"
                value={params.max_price}
              />
            )}

            {params.furnishing && (
              <input
                type="hidden"
                name="furnishing"
                value={params.furnishing}
              />
            )}

            <select
              name="sort"
              defaultValue={params.sort ?? ""}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Recommended</option>
              <option value="price-asc">
                Price: Low to High
              </option>
              <option value="price-desc">
                Price: High to Low
              </option>
              <option value="area-desc">
                Largest Area
              </option>
            </select>

            <button
              type="submit"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium transition hover:bg-zinc-50"
            >
              Sort
            </button>
          </form>
        </div>

        {visibleListings.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-16 text-center">
            <h2 className="text-xl font-semibold">
              No properties found
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Try changing your search or filters.
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
                <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300">
                  <span className="text-sm font-medium tracking-widest text-zinc-400">
                    IVY HOMES
                  </span>

                  <FavouriteButton
                    listingId={listing.listing_id}
                  />

                  <div className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
                    Live
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold">
                        {listing.apartment_name ||
                          "Residential Property"}
                      </h2>

                      <p className="mt-1 truncate text-sm text-zinc-500">
                        {listing.locality || "Gurugram"}
                      </p>
                    </div>

                    <p className="whitespace-nowrap font-semibold">
                      {formatPrice(
                        Number(listing.price || 0)
                      )}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-4 border-t border-zinc-100 pt-4 text-sm text-zinc-500">
                    <span>
                      {listing.bedroom ?? "-"} BHK
                    </span>

                    <span>
                      {listing.bathroom ?? "-"} Bath
                    </span>

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

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            {currentPage > 1 && (
              <a
                href={`/listings?${buildQuery(
                  params,
                  currentPage - 1
                )}`}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
              >
                ← Previous
              </a>
            )}

            <div className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
              Page {currentPage} of {totalPages}
            </div>

            {currentPage < totalPages && (
              <a
                href={`/listings?${buildQuery(
                  params,
                  currentPage + 1
                )}`}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
              >
                Next →
              </a>
            )}
          </div>
        )}
      </section>
    </main>
  );
}