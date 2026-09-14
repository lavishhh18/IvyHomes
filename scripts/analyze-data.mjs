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

console.log("========== DATASET ==========");
console.log("Listings:", listings.length);
console.log("Rentals:", rentals.length);
console.log("Projects:", projects.length);

console.log("\n========== Q1 ==========");
console.log("Total retrievable listing records:", listings.length);

console.log("\n========== Q3 ==========");
const activeListings = listings.filter(
  x => x.is_live === true
);
console.log("Active listings:", activeListings.length);

console.log("\n========== LISTING IDS ==========");
const ids = listings.map(x => x.listing_id);
const uniqueIds = new Set(ids);

console.log("Total IDs:", ids.length);
console.log("Unique IDs:", uniqueIds.size);
console.log("Duplicate IDs:", ids.length - uniqueIds.size);

console.log("\n========== Q7 ==========");
const costliest = projects.reduce((best, p) => {
  if (!best || p.price_max > best.price_max) {
    return p;
  }
  return best;
}, null);

console.log({
  project_id: costliest.project_id,
  price_max_inr: costliest.price_max
});

console.log("\n========== Q5 ==========");

const localityRentals = rentals.filter(
  x => x.locality === "dwarka expressway"
);

const totalMonthlyRent = localityRentals.reduce(
  (sum, x) => sum + Number(x.price),
  0
);

console.log(
  "Dwarka Expressway rentals:",
  localityRentals.length
);

console.log(
  "Total monthly rent:",
  totalMonthlyRent
);

console.log("\n========== Q6 ==========");

const twoBhk = listings.filter(
  x =>
    x.is_live === true &&
    x.bedroom === 2
);

const pricesPerSqft = twoBhk.map(
  x => x.price / x.carpet_area
);

const averagePricePerSqft =
  pricesPerSqft.reduce((sum, x) => sum + x, 0) /
  pricesPerSqft.length;

console.log(
  "2BHK live listings:",
  twoBhk.length
);

console.log(
  "Average price/sqft:",
  averagePricePerSqft.toFixed(2)
);