import { NextRequest, NextResponse } from "next/server";
import { POKEAPI_GRAPHQL_ENDPOINT } from "@/constants/apiConfig";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(POKEAPI_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent":
          "Pokemechanics/1.0 (https://github.com/adammcodes/pokemechanics)",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`GraphQL API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from GraphQL API:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from GraphQL API" },
      { status: 500 }
    );
  }
}
