import { api } from '@/lib/api';

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Submit the public contact form. The message lands in the demo inbox
 * (mock API + localStorage) — clearly labeled as demo everywhere.
 * Throws ApiError 422 with field-level details on invalid input.
 * (An admin inbox view arrives in a later phase — deliberately no public
 * GET endpoint, so submissions are never exposed.)
 */
export async function sendContactMessage(input: ContactMessageInput): Promise<{ id: string }> {
  return api().request<{ id: string }>('POST', '/contact', { body: input });
}
