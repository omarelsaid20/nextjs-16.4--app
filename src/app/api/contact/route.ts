import * as z from 'zod/mini';
import {
  CONTACT_FIELDS,
  contactSchema,
  type ContactErrorKey,
  type ContactField,
} from '@/lib/contact-schema';

// Simulated server time, so the form's sending state is visible.
export const MOCK_LATENCY_MS = 800;

// Mock endpoint: validates with the form's own schema, then accepts the message
// without storing or forwarding it.
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    // Uncaught, the parse error would reach Next and become a 500.
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const issues = z.flattenError(result.error).fieldErrors;
    const fieldErrors: Partial<Record<ContactField, ContactErrorKey>> = {};
    for (const field of CONTACT_FIELDS) {
      const first = issues[field]?.[0];
      // Every schema message is a ContactErrorKey (see contact-schema.ts).
      if (first) fieldErrors[field] = first as ContactErrorKey;
    }
    return Response.json({ ok: false, fieldErrors }, { status: 422 });
  }

  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return Response.json({ ok: true });
}
