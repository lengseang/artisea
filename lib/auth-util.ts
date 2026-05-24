/**
 * Utility to extract user identity from request headers (JWT payload).
 * Support fallback for mock local environments.
 */
export function getUserIdFromRequest(request: Request): string {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        // Standard JWT payload properties: sub, id, userId
        const id = payload.id || payload.sub || payload.userId;
        if (id) return String(id);
      }
    } catch (e) {
      console.warn("Failed to decode JWT payload, using mock author:", e);
    }
  }
  return 'mock-author-id';
}
