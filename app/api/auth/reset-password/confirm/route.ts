// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import api from '@/utils/apiFetch';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await api.post('/auth/reset-password/confirm', body);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur!' },
      { status: 500 }
    );
  }
}
