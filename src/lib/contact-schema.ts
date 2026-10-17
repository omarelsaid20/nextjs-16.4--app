import * as z from 'zod/mini';

export const CONTACT_FIELDS = [
  'fullName',
  'email',
  'phone',
  'subject',
  'message',
] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

// Keys under Contact.form.errors; every schema issue's message is one of these.
export type ContactErrorKey =
  | 'fullName.required'
  | 'fullName.tooShort'
  | 'fullName.tooLong'
  | 'fullName.invalid'
  | 'email.required'
  | 'email.invalid'
  | 'phone.required'
  | 'phone.invalid'
  | 'subject.required'
  | 'subject.tooShort'
  | 'subject.tooLong'
  | 'message.required'
  | 'message.tooShort'
  | 'message.tooLong';

export const MESSAGE_MAX_LENGTH = 1000;

// Arabic keyboards type ٠–٩ (or ۰–۹ on Persian/Urdu layouts); spaces and
// dashes are only formatting.
export function normalizePhone(raw: string): string {
  return raw
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\s-]/g, '');
}

// Stops at `<field>.required` when the value is missing or blank, so the
// field's other checks never run on it.
const requiredText = (field: ContactField, clean = z.trim()) =>
  z
    .string({ error: `${field}.required` })
    .check(clean, z.minLength(1, { error: `${field}.required`, abort: true }));

export const contactSchema = z.object({
  fullName: requiredText('fullName').check(
    z.minLength(3, 'fullName.tooShort'),
    z.maxLength(80, 'fullName.tooLong'),
    // Letters and combining marks (Arabic vowels) of any script, spaces, ' . -
    z.regex(/^[\p{L}\p{M}\s'.-]+$/u, 'fullName.invalid'),
  ),
  // The format check runs only on a non-empty address of at most 254 chars.
  email: z.pipe(
    requiredText('email').check(z.maxLength(254, 'email.invalid')),
    z.email('email.invalid'),
  ),
  // Saudi mobile: 05XXXXXXXX or +9665XXXXXXXX.
  phone: requiredText('phone', z.overwrite(normalizePhone)).check(
    z.regex(/^(?:05\d{8}|\+9665\d{8})$/, 'phone.invalid'),
  ),
  subject: requiredText('subject').check(
    z.minLength(3, 'subject.tooShort'),
    z.maxLength(100, 'subject.tooLong'),
  ),
  message: requiredText('message').check(
    z.minLength(10, 'message.tooShort'),
    z.maxLength(MESSAGE_MAX_LENGTH, 'message.tooLong'),
  ),
});

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactPayload = z.output<typeof contactSchema>;
