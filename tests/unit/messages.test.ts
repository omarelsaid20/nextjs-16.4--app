import { expect, it } from 'vitest';
import ar from '@/messages/ar.json';
import en from '@/messages/en.json';

// Turns nested messages into [dotted.key, value] pairs.
const flatten = (o: object, p = ''): [string, string][] =>
  Object.entries(o).flatMap(([k, v]) =>
    typeof v === 'object' ? flatten(v, `${p}${k}.`) : [[`${p}${k}`, String(v)]],
  );

it('ar and en define exactly the same keys', () => {
  expect(
    flatten(ar)
      .map(([k]) => k)
      .sort(),
  ).toEqual(
    flatten(en)
      .map(([k]) => k)
      .sort(),
  );
});

it('no message is empty', () => {
  for (const [key, value] of [...flatten(ar), ...flatten(en)])
    expect(value.trim(), key).not.toBe('');
});
