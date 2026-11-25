import { z } from 'zod';

export const MIN_PASSWORD_LENGTH = 8;

export function isValidEmail(email: string): boolean {
  return z.email().safeParse(email.trim()).success;
}

/** At least 8 characters with a letter and a number. */
export function isStrongPassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH && /[A-Za-z]/.test(password) && /\d/.test(password);
}
