import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import apiSchedule from '@/utils/scheduleApiFetch';


export async function POST(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('token')?.value;
  if (!jwt) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }
  try {
    const response = await apiSchedule.post(`/schedule/${params.id}/publish`, {}, {
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
