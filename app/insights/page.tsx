import Navbar from "@/components/Navbar";

const stats = [
  {
    label: "Listing records",
    value: "3,500",
    description: "Retrieved from the listings dataset",
  },
  {
    label: "Unique properties",
    value: "3,360",
    description: "After deduplication",
  },
  {
    label: "Live listings",
    value: "2,792",
    description: "Currently live",
  },
  {
    label: "Last 7 days",
    value: "129",
    description: "Listings posted in the reference window",
  },
  {
    label: "2BHK avg. price / sq.ft.",
    value: "₹27,457.66",
    description: "Excluding corrupt and fake candidates",
  },
  {
    label: "Monthly rent",
    value: "₹54,57,800",
    description: "Dwarka Expressway rentals",
  },
];

const findings = [
  {
    category: "Auth",
    title: "API key must be sent as a header",
    description:
      "The running API expects X-API-Key in the request header rather than the documented query parameter.",
  },
  {
    category: "Auth",
    title: "Login response differs from the documentation",
    description:
      "The running login endpoint returns access_token, refresh_token, token_type, expires_in and refresh_url.",
  },
  {
    category: "Pagination",
    title: "Offset pagination is actually used",
    description:
      "The documented page parameter does not advance results. Offset-based pagination retrieved the complete dataset.",
  },
  {
    category: "Completeness",
    title: "Reported listing total does not match retrieved records",
    description:
      "The API reported 3,236 records while offset retrieval produced 3,500 distinct listing IDs.",
  },
  {
    category: "Units",
    title: "Project price scales are inconsistent",
    description:
      "Project price fields contain values using mixed lakh/crore-style scales and require normalization.",
  },
  {
    category: "Consistency",
    title: "Project listing counts contain inconsistencies",
    description:
      "295 projects have total_listings values that differ from the listings observed in the dataset.",
  },
  {
    category: "Data quality",
    title: "18 impossible listing records were identified",
    description:
      "These records violate objective listing-data constraints and are excluded from the relevant calculations.",
  },
  {
    category: "Fraud",
    title: "230 fake-listing candidates were identified",
    description:
      "A seller-contact heuristic found 230 records associated with suspicious repeated contact patterns. These are candidates, not confirmed fraud.",
  },
  {
    category: "Endpoint",
    title: "Analytics summary endpoint is unavailable",
    description:
      "GET /v1/analytics/summary returned HTTP 404, so the analytics shown here are computed from the retrieved dataset.",
  },
];

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
            Insights
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            Market & dataset insights
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-500">
            A summary of the retrieved Ivy Homes dataset, the analysis performed
            on it, and the inconsistencies found between the API documentation
            and the running API.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <p className="text-sm font-medium text-zinc-500">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-zinc-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">
              Key findings
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
              What the data tells us
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="font-semibold text-zinc-900">
                  Large gap between reported and retrieved listings
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  The API reported 3,236 listing records, while offset-based
                  retrieval produced 3,500 distinct listing IDs.
                </p>
              </div>

              <div>
                <p className="font-semibold text-zinc-900">
                  Listing quality requires filtering
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  18 records were identified as objectively impossible, while
                  230 additional records were flagged as fake-listing
                  candidates using repeated seller-contact patterns.
                </p>
              </div>

              <div>
                <p className="font-semibold text-zinc-900">
                  Project prices require normalization
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Project price fields use inconsistent scales, so price
                  comparisons require an explicit normalization rule.
                </p>
              </div>

              <div>
                <p className="font-semibold text-zinc-900">
                  API documentation is not fully reliable
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Several documented behaviors differ from the running API,
                  including authentication, pagination, analytics, and some
                  data semantics.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">
              Analytics methodology
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
              How these numbers were calculated
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-6 text-zinc-500">
              <p>
                Listing metrics were calculated from the complete locally
                retrieved listings dataset rather than trusting the API's
                reported total.
              </p>

              <p>
                The 2BHK price-per-square-foot calculation excludes the 18
                impossible records and the 230 fake-listing candidates.
              </p>

              <p>
                The unique-property count uses deduplication across listing
                records because the dataset does not provide a canonical
                property identifier.
              </p>

              <p>
                Project prices were normalized using the observed lakh/crore
                scale pattern before identifying the costliest project.
              </p>
            </div>
          </section>
        </div>

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-400">
              API audit
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
              Documentation vs. actual API
            </h2>
          </div>

          <div className="grid gap-4">
            {findings.map((finding) => (
              <article
                key={finding.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                    {finding.category}
                  </span>

                  <h3 className="font-semibold text-zinc-900">
                    {finding.title}
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {finding.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-semibold text-amber-900">
            Analytics endpoint discrepancy
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            The documented{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">
              GET /v1/analytics/summary
            </code>{" "}
            endpoint returned{" "}
            <strong>404 Not Found</strong> on the running API. The summary
            displayed on this page is therefore computed directly from the
            retrieved dataset.
          </p>
        </div>
      </section>
    </main>
  );
}