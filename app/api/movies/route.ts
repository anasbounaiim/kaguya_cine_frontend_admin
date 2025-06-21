import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiCatalog from "@/utils/catalogApiFetch";

const API_BASE = process.env.CATALOG_API_URL;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;

  if (!jwt) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const pageParam = searchParams.get("page");
    const page = !pageParam || isNaN(+pageParam) ? 0 : parseInt(pageParam, 10) - 1;
    const size = searchParams.get("size") || "5";

    const url = new URL(`${API_BASE}/movies`);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("size", size);
    url.searchParams.set("sortBy", "releaseDate");
    url.searchParams.set("direction", "desc");

    if (search) {
      url.searchParams.set("title", search);
    }

    const response = await apiCatalog.get('/movies', {}, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    });

    // if (!response.ok) {
    //   console.error("❌ Backend error:", await response.text());
    //   return NextResponse.json({ message: "Erreur backend!" }, { status: response.status });
    // }

    // const data = await response.json();
    return NextResponse.json(response);
  } catch {
    
    return NextResponse.json(
      { message: 'Erreur serveur!' },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {

  const cookieStore = await cookies();
  const jwt = cookieStore.get('token')?.value;

  if (!jwt) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const response = await apiCatalog.post('/movies', body, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    });

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur!' },
      { status: 500 }
    );
  }
}
