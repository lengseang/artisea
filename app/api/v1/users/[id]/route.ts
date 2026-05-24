import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'GET Endpoint not implemented yet' }, { status: 501 });
}
