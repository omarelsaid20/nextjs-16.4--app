import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MOCK_LATENCY_MS, POST } from '@/app/api/contact/route';

const valid = {
  fullName: 'Omar Ahmed',
  email: 'omar@example.com',
  phone: '0558045586',
  subject: 'Training inquiry',
  message: 'I would like to know more about your programs.',
};

// `body` is sent as-is, so a test can send invalid JSON.
const request = (body: string) =>
  new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
const jsonRequest = (data: unknown) => request(JSON.stringify(data));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('returns 200 for a valid payload', async () => {
  const pending = POST(jsonRequest(valid));
  await vi.advanceTimersByTimeAsync(MOCK_LATENCY_MS);
  const res = await pending;
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
});

it('returns 422 with field error keys', async () => {
  const res = await POST(jsonRequest({ ...valid, phone: '123' }));
  expect(res.status).toBe(422);
  const body = await res.json();
  expect(body.ok).toBe(false);
  expect(body.fieldErrors.phone).toBe('phone.invalid');
});

it('returns 400 for malformed JSON', async () => {
  const res = await POST(request('not json'));
  expect(res.status).toBe(400);
});
