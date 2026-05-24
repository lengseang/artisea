import { RegisterInput } from '@/schemas/auth.schema';
import type { AuthResponse } from '@/types/api';

/**
 * Auth Service - Handles all business logic for authentication
 */
export class AuthService {
  /**
   * Registers a new user in the system
   * @param payload Validated registration data
   */
  static async registerUser(payload: RegisterInput): Promise<AuthResponse> {
    // 1. Check if user exists in Database (Mocked for now until Prisma/DB is connected)
    // const existingUser = await db.user.findUnique({ where: { email: payload.email } });
    // if (existingUser) throw new Error("Email already used");

    // 2. Hash password
    // const hashedPassword = await hash(payload.password, 10);

    // 3. Save to database
    // const newUser = await db.user.create({ ... });

    // 4. Generate JWT tokens
    // const tokens = await generateTokens(newUser);

    // 5. Return structured data mapped to our types
    return {
      access_token: 'real-jwt-access-token',
      refresh_token: 'real-jwt-refresh-token',
      user: {
        id: 'new-user-id',
        email: payload.email,
        username: payload.username,
        role: 'author',
        profile: {
          display_name: payload.display_name,
          avatar_url: null,
        },
      },
    };
  }
}
