import fs from "fs";
import { execFileSync } from "child_process";

const output = execFileSync(
  process.execPath,
  ["scripts/final-answers.mjs"],
  {
    encoding: "utf8",
  }
);

const answers = JSON.parse(output);

const submission = {
  api_key: "YOUR_API_KEY",

  candidate: {
    name: "YOUR_NAME",
    email: "YOUR_EMAIL",
    github_repo: "https://github.com/lavishhh18/IvyHomes",
    demo_url: "YOUR_VERCEL_URL",
  },

  answers,

  findings: [
    {
      endpoint: "*",
      category: "auth",
      title: "API key is expected in the X-API-Key header",
      documented:
        "The API documentation describes the API key as a query parameter.",
      actual:
        "The running API requires X-API-Key in the request header.",
      how_found:
        "Calling the authentication endpoint with the documented query-parameter form returned 401; retrying with X-API-Key header succeeded.",
      impact:
        "Clients following the documentation literally fail authentication.",
      evidence: [],
    },

    {
      endpoint: "/auth/login",
      category: "auth",
      title: "Login response contains undocumented session fields",
      documented:
        "The documented login contract does not describe the complete access and refresh token response observed from the running API.",
      actual:
        "The running API returns access_token, refresh_token, token_type, expires_in, refresh_url and user.",
      how_found:
        "Called POST /auth/login with valid credentials and inspected the response.",
      impact:
        "The frontend must use the actual token response to maintain an authenticated session.",
      evidence: [],
    },

    {
      endpoint: "/v1/listings",
      category: "pagination",
      title: "Offset pagination works while page pagination does not advance results",
      documented:
        "The documentation describes page-based pagination.",
      actual:
        "Changing page did not advance the returned records; offset-based retrieval returned subsequent records.",
      how_found:
        "Compared requests using page=2 and offset-based requests.",
      impact:
        "A client implementing page pagination exactly as documented can repeatedly retrieve the same records.",
      evidence: [],
    },

    {
      endpoint: "/v1/listings",
      category: "completeness",
      title: "Reported listing total is lower than the records retrievable from the endpoint",
      documented:
        "The endpoint reports a total record count for the listings collection.",
      actual:
        "The API reported 3,236 records while complete offset retrieval produced 3,500 distinct listing IDs.",
      how_found:
        "Paginated through the listings endpoint using offset until has_more was false and counted distinct listing IDs.",
      impact:
        "The reported total cannot be used as the authoritative dataset size.",
      evidence: [
        "reported_total=3236",
        "retrieved_distinct_listing_ids=3500",
      ],
    },

    {
      endpoint: "/v1/projects",
      category: "units",
      title: "Project price fields use inconsistent numeric scales",
      documented:
        "Project prices are described as INR values.",
      actual:
        "Observed values require lakh/crore-style normalization to compare projects correctly.",
      how_found:
        "Compared project price magnitudes against project names and surrounding dataset values and normalized the observed scales.",
      impact:
        "Sorting or comparing raw price_max values can produce materially incorrect results.",
      evidence: [
        "P60060",
        "P60001",
        "P60004",
        "P60005",
        "P60009",
      ],
    },

    {
      endpoint: "/v1/projects",
      category: "consistency",
      title: "Project total_listings values do not consistently match observed listing counts",
      documented:
        "Projects expose total_listings metadata.",
      actual:
        "295 projects have total_listings values that differ from the counts derived from the retrieved listings.",
      how_found:
        "Grouped listings by project and compared those counts with each project's total_listings field.",
      impact:
        "Project-level inventory counts should not be blindly trusted as authoritative.",
      evidence: [],
    },

    {
      endpoint: "/v1/listings",
      category: "data_quality",
      title: "18 listing records contain objective data-quality violations",
      documented:
        "Listings are expected to contain valid listing attributes.",
      actual:
        "18 records violate objective constraints used in the analysis.",
      how_found:
        "Applied validation checks to listing fields and identified impossible records.",
      impact:
        "These records were excluded from calculations that depend on valid listing data.",
      evidence: answers.corrupt_listing_ids,
    },

    {
      endpoint: "/v1/listings",
      category: "fraud",
      title: "230 listings are suspicious fake-listing candidates",
      documented:
        "The listing contract does not provide a definitive fraud flag.",
      actual:
        "A seller-contact heuristic identified 230 candidate records associated with suspicious repeated contact patterns.",
      how_found:
        "Grouped listings by seller contact and flagged groups with repeated contact information combined with multiple seller names.",
      impact:
        "These candidates were excluded from the 2BHK price-per-square-foot analysis to reduce contamination from suspicious records.",
      evidence: answers.fake_listing_ids,
    },

    {
      endpoint: "/v1/analytics/summary",
      category: "endpoint",
      title: "Documented analytics summary endpoint is unavailable",
      documented:
        "GET /v1/analytics/summary is documented as the analytics summary endpoint.",
      actual:
        "The running API returned HTTP 404 Not Found.",
      how_found:
        "Called the documented endpoint with a valid API key and authenticated access token.",
      impact:
        "The frontend cannot depend on the documented analytics endpoint and instead computes the analytics summary from the retrieved dataset.",
      evidence: [
        "HTTP 404",
        "detail=Not Found",
      ],
    },
  ],
};

fs.writeFileSync(
  "submission.json",
  JSON.stringify(submission, null, 2) + "\n"
);

console.log("submission.json generated successfully");