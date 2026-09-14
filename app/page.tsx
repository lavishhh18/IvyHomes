import Navbar from "@/components/Navbar";

const featuredHomes = [
  {
    title: "Modern 2 BHK Apartment",
    location: "Dwarka Expressway, Gurugram",
    price: "₹85 L",
    area: "1,240 sq.ft",
    beds: "2 BHK",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Luxury 3 BHK Residence",
    location: "Sector 82, Gurugram",
    price: "₹1.24 Cr",
    area: "1,850 sq.ft",
    beds: "3 BHK",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Premium City Apartment",
    location: "Sohna Road, Gurugram",
    price: "₹72 L",
    area: "1,080 sq.ft",
    beds: "2 BHK",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f7] text-zinc-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Find your next home
          </p>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            A better way to
            <br />
            find your place.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Browse homes, compare properties and discover projects with
            everything you need in one place.
          </p>
        </div>

        {/* Search */}
        <form
          action="/listings"
          method="GET"
          className="mt-12 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm"
        >
          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
            <div className="rounded-xl border border-zinc-200 px-5 py-3">
              <label
                htmlFor="location"
                className="block text-xs font-medium uppercase tracking-wide text-zinc-400"
              >
                Location
              </label>

              <input
                id="location"
                name="q"
                placeholder="Search city or locality"
                className="mt-1 h-7 w-full bg-transparent text-sm outline-none"
              />
            </div>

            <div className="rounded-xl border border-zinc-200 px-5 py-3">
              <label
                htmlFor="propertyType"
                className="block text-xs font-medium uppercase tracking-wide text-zinc-400"
              >
                Property
              </label>

              <select
                id="propertyType"
                name="type"
                defaultValue=""
                className="mt-1 h-7 w-full bg-transparent text-sm outline-none"
              >
                <option value="">Any property</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>

            <div className="rounded-xl border border-zinc-200 px-5 py-3">
              <label
                htmlFor="budget"
                className="block text-xs font-medium uppercase tracking-wide text-zinc-400"
              >
                Budget
              </label>

              <select
                id="budget"
                name="budget"
                defaultValue=""
                className="mt-1 h-7 w-full bg-transparent text-sm outline-none"
              >
                <option value="">Any budget</option>
                <option value="5000000">Under ₹50 L</option>
                <option value="10000000">Under ₹1 Cr</option>
                <option value="20000000">Under ₹2 Cr</option>
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center rounded-xl bg-zinc-900 px-7 py-4 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Featured homes */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                CURATED FOR YOU
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Featured homes
              </h2>
            </div>

            <a
              href="/listings"
              className="hidden text-sm font-medium underline underline-offset-4 sm:block"
            >
              View all listings
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredHomes.map((home) => (
              <article
                key={home.title}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="relative h-64 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${home.image}")`,
                  }}
                >
                  <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg backdrop-blur transition hover:bg-white">
                    ♡
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{home.title}</h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {home.location}
                      </p>
                    </div>

                    <p className="whitespace-nowrap font-semibold">
                      {home.price}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-4 border-t border-zinc-100 pt-4 text-sm text-zinc-500">
                    <span>{home.beds}</span>
                    <span>{home.area}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-zinc-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="text-4xl font-semibold">3,500+</p>
              <p className="mt-2 text-sm text-zinc-400">Property listings</p>
            </div>

            <div>
              <p className="text-4xl font-semibold">400+</p>
              <p className="mt-2 text-sm text-zinc-400">Residential projects</p>
            </div>

            <div>
              <p className="text-4xl font-semibold">2,700+</p>
              <p className="mt-2 text-sm text-zinc-400">Active listings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 Ivy Homes</p>

          <div className="flex gap-6">
            <a href="/listings" className="hover:text-zinc-900">
              Properties
            </a>
            <a href="/projects" className="hover:text-zinc-900">
              Projects
            </a>
            <a href="/insights" className="hover:text-zinc-900">
              Insights
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}