import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";

type Rental = {
  listing_id?: string;
  apartment_name?: string;
  locality?: string;
  bedroom?: number;
  bathroom?: number;
  carpet_area?: number;
  super_built_up_area?: number;
  price?: number;
  is_live?: boolean;
};

function formatRent(price: number) {
  return `₹${price.toLocaleString("en-IN")}/month`;
}

export default function RentalsPage() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "rentals.json"
  );

  const rentals: Rental[] = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  const liveRentals = rentals.filter(
    (rental) => rental.is_live !== false
  );

  const visibleRentals = liveRentals.slice(0, 30);

  return (
    <main className="min-h-screen bg-[#faf9f7] text-zinc-900">
      <Navbar />

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Rentals
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Find a home to rent
          </h1>

          <p className="mt-3 text-zinc-500">
            {liveRentals.length.toLocaleString("en-IN")} rental properties
            available
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing {visibleRentals.length} of{" "}
            {liveRentals.length.toLocaleString("en-IN")}
          </p>

          <select className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm">
            <option>Recommended</option>
            <option>Rent: Low to High</option>
            <option>Rent: High to Low</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleRentals.map((rental, index) => (
            <article
              key={rental.listing_id || index}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300">
                <span className="text-sm font-medium text-zinc-400">
                  IVY HOMES
                </span>

                <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
                  For Rent
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">
                      {rental.apartment_name || "Rental Property"}
                    </h2>

                    <p className="mt-1 truncate text-sm text-zinc-500">
                      {rental.locality || "Location unavailable"}
                    </p>
                  </div>

                  <p className="whitespace-nowrap font-semibold">
                    {formatRent(Number(rental.price || 0))}
                  </p>
                </div>

                <div className="mt-5 flex gap-4 border-t border-zinc-100 pt-4 text-sm text-zinc-500">
                  <span>{rental.bedroom ?? "-"} BHK</span>
                  <span>{rental.bathroom ?? "-"} Bath</span>
                  <span>
                    {(
                      rental.carpet_area ||
                      rental.super_built_up_area ||
                      0
                    ).toLocaleString("en-IN")}{" "}
                    sq.ft
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}