# Ivy Homes

A real-estate browsing application built with Next.js and TypeScript for the Ivy Homes frontend assignment.

The application allows users to browse property listings, filter properties, view listing details, browse rentals and projects, save favourite properties, authenticate using the provided demo account, and view insights derived from the supplied dataset.

## Features

- User login using the Ivy Homes authentication API
- Property listing search and filtering
- BHK, property type and budget filters
- Property detail pages
- Favourite properties using browser local storage
- Rental listings
- Residential projects
- Data insights and audit findings
- Responsive navigation
- Server-side handling of the Ivy Homes API key

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Ivy Homes API
- Browser local storage for favourites

## Application Structure

```text
app/
├── api/
│   ├── favourites/
│   └── login/
├── favourites/
├── insights/
├── listings/
│   └── [id]/
├── login/
├── projects/
├── rentals/
└── page.tsx

components/
├── FavouriteButton.tsx
├── Navbar.tsx
└── SavePropertyButton.tsx

scripts/
├── analyze-data.mjs
├── create-submission.mjs
├── download-data.mjs
├── final-answers.mjs
└── test-api.mjs