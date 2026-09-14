const API_URL = process.env.IVY_API_URL;
const API_KEY = process.env.IVY_API_KEY;

async function request(path, options = {}) {
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

  console.log("\n------------------------");
  console.log("PATH:", path);
  console.log("STATUS:", response.status);
  console.log(JSON.stringify(data, null, 2));

  return data;
}

const login = await request("/auth/login", {
  method: "POST",
  body: JSON.stringify({
    email: "demo1@ivy.homes",
    password: process.env.IVY_PASSWORD
  })
});

const token = login.access_token;

if (!token) {
  console.log("Login failed");
  process.exit(1);
}

console.log("\nLOGIN SUCCESSFUL");

await request("/v1/listings?limit=5&page=1", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

await request("/v1/listings?limit=5&page=2", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});