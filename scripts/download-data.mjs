const API_URL = process.env.IVY_API_URL;
const API_KEY = process.env.IVY_API_KEY;

const EMAIL = "demo1@ivy.homes";
const PASSWORD = process.env.IVY_PASSWORD;

async function api(path, options = {}) {
  const url = new URL(`${API_URL}${path}`);

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText}: ${JSON.stringify(data)}`
    );
  }

  return data;
}

async function login() {
  const data = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD
    })
  });

  return data.access_token;
}

async function getAll(endpoint, token) {
  const all = [];
  const limit = 200;
  let offset = 0;

  while (true) {
    console.log(
      `Fetching ${endpoint} | offset=${offset} | limit=${limit}`
    );

    const data = await api(
      `${endpoint}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    all.push(...data.results);

    console.log(
      `Received ${data.count} records | total collected: ${all.length}/${data.total}`
    );

    if (!data.has_more) {
      break;
    }

    offset += data.count;
  }

  return all;
}

const token = await login();

console.log("\nLOGIN SUCCESSFUL\n");

const listings = await getAll("/v1/listings", token);
const rentals = await getAll("/v1/rentals", token);
const projects = await getAll("/v1/projects", token);

await import("fs/promises").then(async (fs) => {
  await fs.writeFile(
    "data/listings.json",
    JSON.stringify(listings, null, 2)
  );

  await fs.writeFile(
    "data/rentals.json",
    JSON.stringify(rentals, null, 2)
  );

  await fs.writeFile(
    "data/projects.json",
    JSON.stringify(projects, null, 2)
  );
});

console.log("\n========================");
console.log("DOWNLOAD COMPLETE");
console.log("========================");
console.log("Listings:", listings.length);
console.log("Rentals:", rentals.length);
console.log("Projects:", projects.length);