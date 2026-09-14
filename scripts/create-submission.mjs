import fs from "fs";

const answers = JSON.parse(
  fs.readFileSync("submission-answers.json", "utf8")
);

const submission = {
  api_key: process.env.IVY_API_KEY,
  candidate: {
    name: "YOUR_NAME",
    email: "YOUR_EMAIL",
    repo_url: "YOUR_GITHUB_REPO_URL",
    demo_url: "YOUR_DEPLOYED_APP_URL"
  },
  answers,
  findings: [
    {
      category: "auth",
      title: "API key must be sent as a header",
      documented: "API key requirement differs from the actual request requirement.",
      actual: "The API requires the key in the X-API-Key request header.",
      how_found: "A request using a query parameter failed, while X-API-Key succeeded.",
      impact: "Authentication fails unless the API key is sent using the required header."
    },
    {
      category: "auth",
      title: "Login response differs from documentation",
      documented: "Documentation describes a different token format and lifetime.",
      actual: "Login returns access_token, refresh_token, token_type and expires_in. The access token expires after 900 seconds.",
      how_found: "Inspected the successful login response.",
      impact: "The application must use the actual access-token and refresh-token flow."
    },
    {
      category: "pagination",
      title: "Listings pagination uses offset, not page",
      documented: "Documentation suggests page-based pagination.",
      actual: "Listings are paginated using offset and limit. Changing page did not change results, while offset did.",
      how_found: "Compared requests using different page and offset values.",
      impact: "Full retrieval requires offset-based pagination."
    },
    {
      category: "completeness",
      title: "Reported listing total is incorrect",
      documented: "The listings response provides a total field.",
      actual: "The API reported total 3236, but 3500 distinct records were retrieved.",
      how_found: "Downloaded all batches using offset pagination and counted unique listing IDs.",
      impact: "The total field cannot be trusted for determining dataset completeness."
    },
    {
      category: "units",
      title: "Project prices use inconsistent units/scales",
      documented: "Project prices are represented as numeric values.",
      actual: "Project prices use mixed lakh/crore-style scales rather than one consistent INR scale.",
      how_found: "Compared price_min and price_max values across project records.",
      impact: "Prices must be normalized before comparing projects."
    },
    {
      category: "consistency",
      title: "Project total_listings is inconsistent",
      documented: "Projects contain a total_listings field.",
      actual: "295 projects have a total_listings value different from the actual listing count by project_id.",
      how_found: "Grouped all listing records by project_id and compared the counts.",
      impact: "total_listings should not be treated as the authoritative listing count."
    },
    {
      category: "data_quality",
      title: "Some listing records contain impossible values",
      documented: "Listings contain numeric property attributes such as price, floor and area.",
      actual: "18 listings contain objectively impossible values.",
      how_found: "Checked for negative prices/areas, floor greater than total floors, and carpet area greater than super built-up area.",
      impact: "These records should be excluded from calculations requiring valid property data."
    },
    {
      category: "fraud",
      title: "Strong fake-listing indicators exist in seller data",
      documented: "Seller contact and seller name fields are provided.",
      actual: "12 seller contacts are associated with at least 10 listings and at least 3 different seller names, covering 230 listings.",
      how_found: "Grouped listings by seller contact and checked for high-volume contacts with multiple seller identities.",
      impact: "These 230 records were treated as fake-listing candidates for the required analysis."
    }
  ]
};

fs.writeFileSync(
  "submission.json",
  JSON.stringify(submission, null, 2)
);

console.log("submission.json created successfully");
