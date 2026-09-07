import type { IsoDateTime } from './common';

/** Public contact-form submission (stored in the demo inbox). */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: IsoDateTime;
}
