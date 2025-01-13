// route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input - accept either array or object format as per docs
    if (!body || (!Array.isArray(body) && typeof body !== "object")) {
      return NextResponse.json(
        {
          error:
            "Invalid request format. Expected JSON array or object of addresses.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEOCODIO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Geocod.io API key not configured." },
        { status: 500 }
      );
    }

    // The API accepts either an array of strings or an object with custom keys
    // No need to transform the input - pass it directly as documented
    const geocodioUrl = `https://api.geocod.io/v1.7/geocode?api_key=${apiKey}&country=CA`;

    const response = await fetch(geocodioUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || "Geocoding service error" },
        { status: response.status }
      );
    }

    const geocodioData = await response.json();
    return NextResponse.json(geocodioData);
  } catch (err) {
    console.error("Geocoding error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
