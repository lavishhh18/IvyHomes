import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";

type Project = {
  project_id: string;
  project_name?: string;
  locality?: string;
  city?: string;
  developer_name?: string;
  price_min?: number;
  price_max?: number;
  total_listings?: number;
};

function formatPrice(value: number) {
  if (value < 10) {
    return `₹${value.toFixed(2)} Cr`;
  }

  return `₹${value.toFixed(2)} L`;
}

export default function ProjectsPage() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "projects.json"
  );

  const projects: Project[] = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  const visibleProjects = projects.slice(0, 30);

  return (
    <main className="min-h-screen bg-[#faf9f7] text-zinc-900">
      <Navbar />

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Residential projects
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Discover new projects
          </h1>

          <p className="mt-3 text-zinc-500">
            Explore {projects.length.toLocaleString("en-IN")} residential
            projects.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing {visibleProjects.length} of {projects.length}
          </p>

          <select className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <article
              key={project.project_id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300">
                <span className="text-sm font-medium tracking-widest text-zinc-400">
                  IVY HOMES
                </span>

                <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
                  Project
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">
                      {project.project_name || "Residential Project"}
                    </h2>

                    <p className="mt-1 truncate text-sm text-zinc-500">
                      {project.locality || "Location unavailable"}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-sm font-semibold">
                    {formatPrice(Number(project.price_max || 0))}
                  </p>
                </div>

                <div className="mt-5 space-y-3 border-t border-zinc-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">
                      Developer
                    </span>

                    <span className="max-w-[180px] truncate font-medium">
                      {project.developer_name || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-500">
                      Price range
                    </span>

                    <span className="font-medium">
                      {formatPrice(Number(project.price_min || 0))} –{" "}
                      {formatPrice(Number(project.price_max || 0))}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-500">
                      Listings
                    </span>

                    <span className="font-medium">
                      {project.total_listings ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}