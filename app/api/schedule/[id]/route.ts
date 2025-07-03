import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import apiSchedule from '@/utils/scheduleApiFetch';


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('token')?.value;
  if (!jwt) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const response = await apiSchedule.put(`/schedule/${params.id}`, body, {
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('token')?.value;
  if (!jwt) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }
  try {
    await apiSchedule.delete(`/schedule/${params.id}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    return NextResponse.json({ message: "Schedule deleted" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur!' },
      { status: 500 }
    );
  }
}