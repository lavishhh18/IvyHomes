import fs from "fs";

const listings = JSON.parse(
  fs.readFileSync("data/listings.json")
);

const rentals = JSON.parse(
  fs.readFileSync("data/rentals.json")
);

const projects = JSON.parse(
  fs.readFileSync("data/projects.json")
);

// -----------------------------
// Q4: corrupt listings
// -----------------------------

const corruptIds = new Set(
  listings
    .filter(x =>
      x.price < 0 ||
      x.floor > x.total_floors ||
      x.carpet_area < 0 ||
      x.super_built_up_area < 0 ||
      x.carpet_area > x.super_built_up_area
    )
    .map(x => x.listing_id)
);

// -----------------------------
// Q9: suspicious/fake candidates
// -----------------------------

const contactGroups = new Map();

for (const listing of listings) {
  if (!listing.posted_by_contact) continue;

  if (!contactGroups.has(listing.posted_by_contact)) {
    contactGroups.set(listing.posted_by_contact, []);
  }

  contactGroups.get(listing.posted_by_contact).push(listing);
}

const fakeIds = new Set();

for (const records of contactGroups.values()) {
  const names = new Set(
    records.map(x => x.posted_by_name)
  );

  if (records.length >= 10 && names.size >= 3) {
    for (const record of records) {
      fakeIds.add(record.listing_id);
    }
  }
}

// -----------------------------
// Q6
// -----------------------------

const validTwoBhk = listings.filter(x =>
  x.is_live === true &&
  x.bedroom === 2 &&
  !corruptIds.has(x.listing_id) &&
  !fakeIds.has(x.listing_id) &&
  x.carpet_area > 0 &&
  x.price > 0
);

const avgPricePerSqft =
  validTwoBhk.reduce(
    (sum, x) => sum + x.price / x.carpet_area,
    0
  ) / validTwoBhk.length;

// -----------------------------
// Q5
// -----------------------------

const dwarkaRentals = rentals.filter(
  x =>
    x.locality?.toLowerCase() ===
    "dwarka expressway"
);

const totalMonthlyRent =
  dwarkaRentals.reduce(
    (sum, x) => sum + Number(x.price),
    0
  );

// -----------------------------
// Q7
// -----------------------------
//
// Actual project data contains values on
// mixed lakh/crore scales.
// Normalize to INR.
//
// < 10  => crore
// >= 10 => lakh
// -----------------------------

function projectPriceToInr(value) {
  if (value < 10) {
    return value * 10000000;
  }

  return value * 100000;
}

const projectPrices = projects.map(p => ({
  project_id: p.project_id,
  price_max_inr: Math.round(
    projectPriceToInr(p.price_max)
  )
}));

const costliestProject = projectPrices.reduce(
  (best, current) =>
    current.price_max_inr > best.price_max_inr
      ? current
      : best
);

// -----------------------------
// Q8
// -----------------------------

const start = new Date(
  "2026-09-03T00:00:00+05:30"
);

const end = new Date(
  "2026-09-10T00:00:00+05:30"
);

const lastSevenDays = listings.filter(x => {
  const date = new Date(x.posted_at);
  return date >= start && date < end;
});

// -----------------------------
// Q10
// -----------------------------

const projectCounts = new Map();

for (const listing of listings) {
  if (!listing.project_id) continue;

  projectCounts.set(
    listing.project_id,
    (projectCounts.get(listing.project_id) || 0) + 1
  );
}

const wrongProjectCounts = projects.filter(project => {
  const actual =
    projectCounts.get(project.project_id) || 0;

  return actual !== project.total_listings;
});

// -----------------------------
// FINAL
// -----------------------------

const answers = {
  total_listing_records: listings.length,

  unique_properties: 3360,

  active_listings: listings.filter(
    x => x.is_live === true
  ).length,

  corrupt_listing_ids: [...corruptIds].sort(),

  total_monthly_rent: totalMonthlyRent,

  avg_price_per_sqft_2bhk: Number(
    avgPricePerSqft.toFixed(2)
  ),

  costliest_project: costliestProject,

  listings_last_7_days: lastSevenDays.length,

  fake_listing_ids: [...fakeIds].sort(),

  projects_with_wrong_listing_count:
    wrongProjectCounts.length
};

console.log(
  JSON.stringify(answers, null, 2)
);

fs.writeFileSync(
  "submission-answers.json",
  JSON.stringify(answers, null, 2)
);