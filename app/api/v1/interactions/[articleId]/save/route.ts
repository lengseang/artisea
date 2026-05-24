import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'GET Endpoint not implemented yet' }, { status: 501 });
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'POST Endpoint not implemented yet' }, { status: 501 });
}

export async function PATCH(request: Request) {
  return NextResponse.json({ message: 'PATCH Endpoint not implemented yet' }, { status: 501 });
}

export async function DELETE(request: Request) {
  return NextResponse.json({ message: 'DELETE Endpoint not implemented yet' }, { status: 501 });
}
