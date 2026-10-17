import { expect, it, vi } from 'vitest';
import type { ContactPayload } from '@/lib/contact-schema';
import { submitContact } from '@/lib/contact-service';

const valid: ContactPayload = {
  fullName: 'Omar Ahmed',
  email: 'omar@example.com',
  phone: '0558045586',
  subject: 'Training inquiry',
  message: 'I would like to know more about your programs.',
};

const fetchReturning = (response: Response) =>
  vi.fn<typeof fetch>().mockResolvedValue(response);

it('posts the payload as JSON to /api/contact', async () => {
  const fetchImpl = fetchReturning(Response.json({ ok: true }));
  await submitContact(valid, fetchImpl);
  expect(fetchImpl).toHaveBeenCalledTimes(1);
  const [url, init] = fetchImpl.mock.calls[0];
  expect(url).toBe('/api/contact');
  expect(init?.method).toBe('POST');
  expect(new Headers(init?.headers).get('content-type')).toBe(
    'application/json',
  );
  expect(init?.body).toBe(JSON.stringify(valid));
});

it('returns ok for a 200', async () => {
  const fetchImpl = fetchReturning(Response.json({ ok: true }));
  expect(await submitContact(valid, fetchImpl)).toEqual({ ok: true });
});

it('returns the field errors of a 422', async () => {
  const fetchImpl = fetchReturning(
    Response.json(
      { ok: false, fieldErrors: { phone: 'phone.invalid' } },
      { status: 422 },
    ),
  );
  expect(await submitContact(valid, fetchImpl)).toEqual({
    ok: false,
    reason: 'validation',
    fieldErrors: { phone: 'phone.invalid' },
  });
});

it('reports a server error for a 500', async () => {
  const fetchImpl = fetchReturning(new Response(null, { status: 500 }));
  expect(await submitContact(valid, fetchImpl)).toEqual({
    ok: false,
    reason: 'server',
  });
});

it('reports a network error when fetch rejects', async () => {
  const fetchImpl = vi
    .fn<typeof fetch>()
    .mockRejectedValue(new TypeError('Failed to fetch'));
  expect(await submitContact(valid, fetchImpl)).toEqual({
    ok: false,
    reason: 'network',
  });
});
