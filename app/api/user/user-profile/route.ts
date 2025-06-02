import { NextResponse } from 'next/server';
import api from '@/utils/apiFetch';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  try {
    const response = await api.get(
      '/user/user-profile',
      {},
      {
        headers: {
          Authorization: authHeader,
        }
      }
    );
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Next.js API Route Error:", error, error?.response?.data);
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erreur serveur!' },
      { status: error?.response?.status || 500 }
    );
  }
}
