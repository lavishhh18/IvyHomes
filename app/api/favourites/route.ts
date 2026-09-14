import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json([]);
  }

  const favouriteIds = ids.split(",").filter(Boolean);

  const filePath = path.join(
    process.cwd(),
    "data",
    "listings.json"
  );

  const listings = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  const favourites = listings.filter((listing: { listing_id: string }) =>
    favouriteIds.includes(listing.listing_id)
  );

  return NextResponse.json(favourites);
}