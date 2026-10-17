import type {
  ContactErrorKey,
  ContactField,
  ContactPayload,
} from '@/lib/contact-schema';

// The one line to change when a real backend replaces the mock route.
export const CONTACT_ENDPOINT = '/api/contact';

type FieldErrors = Partial<Record<ContactField, ContactErrorKey>>;

export type SubmitResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'validation' | 'server' | 'network';
      fieldErrors?: FieldErrors;
    };

// Never throws: every outcome is a SubmitResult the form can switch on.
export async function submitContact(
  payload: ContactPayload,
  fetchImpl: typeof fetch = fetch,
): Promise<SubmitResult> {
  try {
    const response = await fetchImpl(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (response.ok) return { ok: true };
    if (response.status !== 422) return { ok: false, reason: 'server' };
    const { fieldErrors } = (await response.json()) as {
      fieldErrors?: FieldErrors;
    };
    return { ok: false, reason: 'validation', fieldErrors };
  } catch {
    // Offline, the 10 s timeout, or a response body that could not be read.
    return { ok: false, reason: 'network' };
  }
}
