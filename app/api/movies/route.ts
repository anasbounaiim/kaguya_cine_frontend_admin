import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.MOVIE_API_URL || "http://localhost:8082";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const jwt = (await cookieStore).get("token")?.value;

  if (!jwt) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const search = req.nextUrl.searchParams.get("search") || "";
    const pageParam = req.nextUrl.searchParams.get("page");
    const page = !pageParam || isNaN(+pageParam) ? 0 : parseInt(pageParam, 10) - 1;
    const size = req.nextUrl.searchParams.get("size") || "5";

    const url = new URL(`${API_BASE}/movies`);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("size", size);
    url.searchParams.set("sortBy", "releaseDate");
    url.searchParams.set("direction", "desc");

    if (search) {
      url.searchParams.set("title", search);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      console.error("❌ Backend error:", await response.text());
      return NextResponse.json({ message: "Erreur backend!" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ API/movies GET failed:", error);
    return NextResponse.json({ message: "Erreur serveur!" }, { status: 500 });
  }
}
