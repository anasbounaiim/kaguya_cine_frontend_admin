import { NextResponse } from 'next/server';
import apiCatalog from '@/utils/catalogApiFetch';
import { cookies } from 'next/headers';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('token')?.value;
  if (!jwt) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }
  try {
    await apiCatalog.delete(`/genres/${params.id}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    return NextResponse.json({ message: "Genre supprimé" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur!' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('token')?.value;
  if (!jwt) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const response = await apiCatalog.put(`/genres/${params.id}`, body, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur!' },
      { status: 500 }
    );
  }
}