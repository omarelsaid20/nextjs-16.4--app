import { expect, it } from 'vitest';
import {
  CONTACT_FIELDS,
  contactSchema,
  type ContactField,
} from '@/lib/contact-schema';

const valid = {
  fullName: 'Omar Ahmed',
  email: 'omar@example.com',
  phone: '0558045586',
  subject: 'Training inquiry',
  message: 'I would like to know more about your programs.',
};

// The error key of the first issue reported for `field`, if any.
const errorOf = (input: object, field: ContactField) =>
  contactSchema.safeParse(input).error?.issues.find((i) => i.path[0] === field)
    ?.message;

it('accepts a valid payload', () => {
  expect(contactSchema.safeParse(valid).success).toBe(true);
});

it.each(CONTACT_FIELDS)('requires %s', (field) => {
  expect(errorOf({ ...valid, [field]: '' }, field)).toBe(`${field}.required`);
});

it.each(CONTACT_FIELDS)('reports only required for an empty %s', (field) => {
  const issues = contactSchema.safeParse({ ...valid, [field]: '' }).error
    ?.issues;
  expect(
    issues?.filter((i) => i.path[0] === field).map((i) => i.message),
  ).toEqual([`${field}.required`]);
});

it.each(CONTACT_FIELDS)('treats a spaces-only %s as empty', (field) => {
  expect(errorOf({ ...valid, [field]: '   ' }, field)).toBe(
    `${field}.required`,
  );
});

it('reports required for missing fields', () => {
  for (const field of CONTACT_FIELDS)
    expect(errorOf({}, field), field).toBe(`${field}.required`);
});

it('reports required for non-text values', () => {
  for (const field of CONTACT_FIELDS)
    expect(errorOf({ ...valid, [field]: 5580 }, field), field).toBe(
      `${field}.required`,
    );
});

it.each([
  ['fullName', 3],
  ['fullName', 80],
  ['subject', 3],
  ['subject', 100],
  ['message', 10],
] as const)('accepts a %s of %i characters', (field, length) => {
  expect(
    contactSchema.safeParse({ ...valid, [field]: 'a'.repeat(length) }).success,
  ).toBe(true);
});

it.each([
  ['055 804 5586', '0558045586'],
  ['055-804-5586', '0558045586'],
  ['+966 55 804 5586', '+966558045586'],
  ['٠٥٥٨٠٤٥٥٨٦', '0558045586'],
  ['۰۵۵۸۰۴۵۵۸۶', '0558045586'], // Persian/Urdu digits
])('normalizes phone %s', (raw, normalized) => {
  expect(contactSchema.parse({ ...valid, phone: raw }).phone).toBe(normalized);
});

it.each([
  '0158045586',
  '+96655804558',
  '05580455861',
  '5580455860',
  '+966158045586',
])('rejects phone %s', (phone) => {
  expect(errorOf({ ...valid, phone }, 'phone')).toBe('phone.invalid');
});

it.each(['محمد عبدالله', 'مُحَمَّد', "Anne-Marie O'Neil"])(
  'accepts name %s',
  (fullName) => {
    expect(contactSchema.safeParse({ ...valid, fullName }).success).toBe(true);
  },
);

it('rejects short, long and non-letter names', () => {
  expect(errorOf({ ...valid, fullName: 'Al' }, 'fullName')).toBe(
    'fullName.tooShort',
  );
  expect(errorOf({ ...valid, fullName: 'a'.repeat(81) }, 'fullName')).toBe(
    'fullName.tooLong',
  );
  expect(errorOf({ ...valid, fullName: 'Omar123' }, 'fullName')).toBe(
    'fullName.invalid',
  );
});

it('validates email', () => {
  expect(errorOf({ ...valid, email: 'not-an-email' }, 'email')).toBe(
    'email.invalid',
  );
  expect(
    contactSchema.parse({ ...valid, email: '  omar@example.com ' }).email,
  ).toBe('omar@example.com');
});

it('caps email at 254 characters', () => {
  const domain = '@example.com';
  const email = (length: number) => 'a'.repeat(length - domain.length) + domain;
  expect(contactSchema.safeParse({ ...valid, email: email(254) }).success).toBe(
    true,
  );
  expect(errorOf({ ...valid, email: email(255) }, 'email')).toBe(
    'email.invalid',
  );
});

it('bounds subject', () => {
  expect(errorOf({ ...valid, subject: 'Hi' }, 'subject')).toBe(
    'subject.tooShort',
  );
  expect(errorOf({ ...valid, subject: 'a'.repeat(101) }, 'subject')).toBe(
    'subject.tooLong',
  );
});

it('bounds message', () => {
  expect(errorOf({ ...valid, message: 'Too short' }, 'message')).toBe(
    'message.tooShort',
  );
  expect(errorOf({ ...valid, message: 'a'.repeat(1001) }, 'message')).toBe(
    'message.tooLong',
  );
  expect(
    contactSchema.safeParse({ ...valid, message: 'a'.repeat(1000) }).success,
  ).toBe(true);
});

it('trims before counting', () => {
  const message = 'a'.repeat(1000);
  expect(
    contactSchema.parse({ ...valid, message: ` ${message} ` }).message,
  ).toBe(message);
});
