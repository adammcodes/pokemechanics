import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");
  const id = searchParams.get("id");
  console.log("Request URL:", request.url);
  console.log("Search params:", Object.fromEntries(searchParams.entries()));

  if (!endpoint) {
    return NextResponse.json(
      {
        error:
          "Endpoint parameter is required. Use ?endpoint=pokemon&id=1 or ?endpoint=pokemon-species&id=1",
      },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "ID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const url = `https://pokeapi.co/api/v2/${endpoint}/${id}`;
    console.log(`Fetching from: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Pokemechanics/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ${endpoint} data:`, error);

    return NextResponse.json(
      {
        error: `Failed to fetch ${endpoint} data`,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
