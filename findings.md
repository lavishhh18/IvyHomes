# API Findings

## Finding 1 — API key must be sent as a header

- Category: auth
- Documented: API documentation describes the API key requirement differently.
- Actual: Requests require the API key in the `X-API-Key` request header.
- How found: Initial authentication request failed when the key was supplied as a query parameter. The API error explicitly indicated that the key must be sent using `X-API-Key`.
- Impact: Authentication fails unless the client sends the key using the required header.

## Finding 2 — Login response differs from documentation

- Category: auth
- Documented: Authentication documentation describes a token with a longer validity period.
- Actual: Login returns `access_token`, `refresh_token`, `token_type`, and `expires_in`. The access token expires after 900 seconds and the API provides `/auth/refresh`.
- How found: Successful login response inspection.
- Impact: The application must support the actual access-token/refresh-token flow rather than relying on the documented token format.

## Finding 3 — Listings pagination uses offset, not page

- Category: pagination
- Documented: Listings documentation suggests page-based pagination.
- Actual: The endpoint uses `offset` and `limit`. Supplying different `page` values did not change the returned records, while changing `offset` returned different batches.
- How found: Compared `/v1/listings?page=1&limit=5`, `/v1/listings?page=2&limit=5`, and requests using different offsets.
- Impact: Full dataset retrieval requires offset-based pagination.

## Finding 4 — Reported listing total is incorrect

- Category: completeness
- Documented: The listings response exposes a `total` field.
- Actual: The API reported `total: 3236`, but offset pagination retrieved 3500 distinct listing records.
- How found: Downloaded all listing batches until `has_more` became false and counted the resulting records and unique listing IDs.
- Impact: The API `total` field cannot be trusted for determining the complete dataset size.

## Finding 5 — Project prices use inconsistent units/scales

- Category: units
- Documented: Project price fields are presented as numeric price values.
- Actual: Project price values use mixed lakh/crore-style scales rather than a consistent integer-INR representation. For example, project records contain values such as `5.83` alongside much larger values.
- How found: Compared project `price_min` and `price_max` values across the dataset and inspected the resulting scale patterns.
- Impact: Project prices must be normalized before comparing projects by maximum price.

## Finding 6 — Project total_listings is inconsistent with actual listings

- Category: consistency
- Documented: Projects contain a `total_listings` field.
- Actual: For 295 projects, `total_listings` does not match the number of listing records whose `project_id` references that project.
- How found: Grouped all 3500 listing records by `project_id` and compared those counts against the project records.
- Impact: `total_listings` should not be treated as the authoritative count of listing records.

## Finding 7 — Some listing records contain objectively impossible values

- Category: data_quality
- Documented: Listings contain numeric property attributes such as price, floor and area.
- Actual: 18 records contain objectively impossible combinations such as negative prices, floor numbers greater than total floors, negative areas, or carpet area greater than super built-up area.
- How found: Applied validity checks to the retrieved listing dataset.
- Impact: These records must be excluded from calculations requiring valid property data.

## Finding 8 — Strong fake-listing indicators exist in seller data

- Category: fraud
- Documented: Seller contact/name fields are part of listing data.
- Actual: 12 seller contact groups contain at least 10 listings and at least 3 different seller names. These groups contain 230 listing records in total.
- How found: Grouped listings by seller contact number and searched for high-volume contacts associated with multiple seller identities.
- Impact: These 230 records were treated as fake-listing candidates for the required analysis rather than as trustworthy listings.