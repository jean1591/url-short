/**
 * Generate a random short code for URL shortening
 * Uses base62 characters (a-z, A-Z, 0-9) for URL-safe codes
 */
export function generateShortCode(length: number = 6): string {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
