import fs from "fs";
import path from "path";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SavePropertyButton from "@/components/SavePropertyButton";

type Listing = {
  listing_id: string;
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
  posted_by_name?: string;
  posted_by_contact?: string;
  description?: string;
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

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const filePath = path.join(process.cwd(), "data", "listings.json");

  const listings: Listing[] = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  const listing = listings.find(
    (item) => item.listing_id === id
  );

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#faf9f7]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-3xl font-semibold">
            Property not found
          </h1>

          <p className="mt-3 text-zinc-500">
            This listing could not be found in the available dataset.
          </p>

          <Link
            href="/listings"
            className="mt-8 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white"
          >
            Back to listings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] text-zinc-900">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <Link
          href="/listings"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          ← Back to listings
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="relative h-[420px] bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium tracking-widest text-zinc-400">
                IVY HOMES
              </span>
            </div>

            <div className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              {listing.is_live ? "Live listing" : "Inactive listing"}
            </div>

            <button className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-sm">
              ♡
            </button>
          </div>

          <div className="grid gap-10 p-8 lg:grid-cols-[1fr_320px] lg:p-10">
            <div>
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.15em] text-zinc-400">
                    {listing.listing_id}
                  </p>

                  <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                    {listing.apartment_name || "Residential Property"}
                  </h1>

                  <p className="mt-2 text-zinc-500">
                    {listing.locality || "Location unavailable"}
                  </p>
                </div>

                <p className="text-3xl font-semibold">
                  {formatPrice(Number(listing.price || 0))}
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl bg-zinc-50 p-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Bedrooms
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {listing.bedroom ?? "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Bathrooms
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {listing.bathroom ?? "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Floor
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {listing.floor ?? "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Area
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {(
                      listing.carpet_area ||
                      listing.super_built_up_area ||
                      0
                    ).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-zinc-400">sq.ft</p>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-semibold">
                  Property details
                </h2>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex justify-between border-b border-zinc-100 pb-4">
                    <span className="text-zinc-500">
                      Total floors
                    </span>
                    <span className="font-medium">
                      {listing.total_floors ?? "-"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-zinc-100 pb-4">
                    <span className="text-zinc-500">
                      Carpet area
                    </span>
                    <span className="font-medium">
                      {listing.carpet_area
                        ? `${listing.carpet_area.toLocaleString(
                            "en-IN"
                          )} sq.ft`
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-zinc-100 pb-4">
                    <span className="text-zinc-500">
                      Super built-up area
                    </span>
                    <span className="font-medium">
                      {listing.super_built_up_area
                        ? `${listing.super_built_up_area.toLocaleString(
                            "en-IN"
                          )} sq.ft`
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {listing.description && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold">
                    About this property
                  </h2>

                  <p className="mt-4 leading-7 text-zinc-600">
                    {listing.description}
                  </p>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-zinc-200 p-6">
              <p className="text-sm text-zinc-500">
                Listed by
              </p>

              <p className="mt-2 font-semibold">
                {listing.posted_by_name || "Seller"}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                {listing.posted_by_contact || "Contact unavailable"}
              </p>

              <button className="mt-6 w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700">
                Contact seller
              </button>

              <SavePropertyButton listingId={listing.listing_id} />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}