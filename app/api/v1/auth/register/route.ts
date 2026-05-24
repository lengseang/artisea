import { NextResponse } from 'next/server';
import { registerSchema } from '@/schemas/auth.schema';
import { AuthService } from '@/services/auth.service';
import { z } from 'zod';

/**
 * 1. ROUTING LAYER (HTTP Endpoints only)
 * 
 * This layer is STRICTLY for:
 * - Receiving HTTP requests
 * - Parsing/Validating the payload using Schemas
 * - Calling the Service Layer
 * - Returning HTTP responses
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validation Layer
    const validatedData = registerSchema.parse(body);

    // 2. Business Logic Layer
    const authResponse = await AuthService.registerUser(validatedData);

    // 3. HTTP Response
    return NextResponse.json(authResponse, { status: 201 });

  } catch (error) {
    // Handle Validation Errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.issues },
        { status: 400 }
      );
    }

    // Handle Business Logic Errors
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: errorMessage },
      { status: 400 }
    );
  }
}
