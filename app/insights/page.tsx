import Navbar from "@/components/Navbar";

const stats = [
  {
    label: "Total listings",
    value: "3,500",
    description: "Distinct listing records retrieved",
  },
  {
    label: "Unique properties",
    value: "3,360",
    description: "After deduplication",
  },
  {
    label: "Active listings",
    value: "2,792",
    description: "Listings currently marked live",
  },
  {
    label: "Recent listings",
    value: "129",
    description: "Posted in the required 7-day window",
  },
];

const analysis = [
  {
    title: "Monthly rent · Dwarka Expressway",
    value: "₹54,57,800",
    description: "Total monthly rent across matching rental records",
  },
  {
    title: "Average 2 BHK price / sq.ft.",
    value: "₹27,457.66",
    description: "Live, valid listings after excluding identified bad records",
  },
  {
    title: "Costliest project",
    value: "P60060",
    description: "Mantri Terraces · normalized maximum price ₹5.83 Cr",
  },
  {
    title: "Project count mismatches",
    value: "295",
    description: "Projects where total_listings differs from actual listing records",
  },
];

const findings = [
  {
    number: "01",
    category: "AUTH",
    title: "API key uses X-API-Key",
    text: "The API requires the key in a request header rather than as a query parameter.",
  },
  {
    number: "02",
    category: "AUTH",
    title: "Short-lived access tokens",
    text: "Login returns an access token, refresh token and a 900-second access-token lifetime.",
  },
  {
    number: "03",
    category: "PAGINATION",
    title: "Offset pagination",
    text: "The listings endpoint uses offset and limit. The page parameter does not advance results.",
  },
  {
    number: "04",
    category: "COMPLETENESS",
    title: "Reported total is wrong",
    text: "The endpoint reports 3,236 listings, while full retrieval produced 3,500 distinct records.",
  },
  {
    number: "05",
    category: "UNITS",
    title: "Project prices use mixed scales",
    text: "Project prices require normalization because lakh/crore-style scales are mixed.",
  },
  {
    number: "06",
    category: "DATA QUALITY",
    title: "18 impossible listing records",
    text: "These include negative prices/areas and physically impossible floor or area relationships.",
  },
  {
    number: "07",
    category: "CONSISTENCY",
    title: "Project listing totals are unreliable",
    text: "295 project records disagree with listing counts derived from project_id.",
  },
  {
    number: "08",
    category: "FRAUD",
    title: "Seller identity anomalies",
    text: "230 records were flagged as fake-listing candidates using a high-volume contact / multiple-name heuristic.",
  },
];

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Data insights
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            The numbers behind the property market.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-500">
            A summary of the Ivy Homes dataset analysis, including
            listing activity, pricing and data-quality findings.
          </p>
        </div>
      </section>

      {/* Main stats */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <p className="text-sm text-zinc-500">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {stat.value}
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Analysis */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Assignment analysis
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Key answers
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {analysis.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-200 p-6"
              >
                <p className="text-sm font-medium text-zinc-500">
                  {item.title}
                </p>

                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {item.value}
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Findings */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Data audit
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            What we found
          </h2>

          <p className="mt-4 max-w-2xl text-zinc-500">
            The source data contains several inconsistencies. These
            findings were identified by testing the actual API behaviour
            and validating the retrieved records.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 md:grid-cols-2">
          {findings.map((finding) => (
            <article
              key={finding.number}
              className="bg-white p-7"
            >
              <div className="flex items-start justify-between gap-6">
                <span className="text-xs font-semibold tracking-widest text-zinc-400">
                  {finding.number}
                </span>

                <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-semibold tracking-widest text-zinc-500">
                  {finding.category}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                {finding.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {finding.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-zinc-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">
              Explore the data
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Ready to find your next home?
            </h2>

            <a
              href="/listings"
              className="mt-7 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
            >
              Browse listings
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}