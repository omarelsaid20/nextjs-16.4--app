'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState, useSyncExternalStore } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CONTACT_FIELDS,
  contactSchema,
  MESSAGE_MAX_LENGTH,
  type ContactErrorKey,
  type ContactField,
  type ContactFormInput,
  type ContactPayload,
} from '@/lib/contact-schema';
import { submitContact } from '@/lib/contact-service';

// Autofill hints, the phone keypad, and left-to-right text for the address and
// number in Arabic.
const inputProps = {
  fullName: { autoComplete: 'name' },
  email: { type: 'email', autoComplete: 'email', dir: 'ltr' },
  phone: { type: 'tel', inputMode: 'tel', autoComplete: 'tel', dir: 'ltr' },
  subject: {},
} as const;

const subscribeToNothing = () => () => {};

export function ContactForm() {
  const t = useTranslations('Contact.form');
  // false in the server HTML and during hydration, true once React runs here:
  // until then a click would submit the form natively, with the values in the URL.
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactPayload>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });
  const messageLength = useWatch({ control, name: 'message' }).length;

  const send = async (values: ContactPayload) => {
    const result = await submitContact(values);
    if (result.ok) {
      reset();
      setStatus('success');
    } else if (result.reason === 'validation') {
      for (const field of CONTACT_FIELDS) {
        const key = result.fieldErrors?.[field];
        if (key) setError(field, { type: 'server', message: key });
      }
    } else {
      setStatus('error');
    }
  };

  // A new submit clears the last success or error message first.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    setStatus('idle');
    return handleSubmit(send)(event);
  };

  // Every schema message is a ContactErrorKey (see contact-schema.ts).
  const errorKey = (field: ContactField) =>
    errors[field]?.message as ContactErrorKey | undefined;

  const fieldLabel = (field: ContactField) => (
    <Label htmlFor={field}>
      {t(`labels.${field}`)}
      {/* Screen readers get "required" from aria-required instead. */}
      <span aria-hidden className="ms-1 text-brand">
        *
      </span>
    </Label>
  );

  const fieldError = (field: ContactField) => {
    const key = errorKey(field);
    return (
      key && (
        <p id={`${field}-error`} className="text-sm text-error">
          {t(`errors.${key}`)}
        </p>
      )
    );
  };

  const a11yProps = (field: ContactField, describedBy?: string) => ({
    'aria-invalid': errorKey(field) !== undefined,
    'aria-required': true,
    'aria-describedby':
      [errorKey(field) && `${field}-error`, describedBy]
        .filter(Boolean)
        .join(' ') || undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      <h2
        id="contact-form-title"
        className="text-xl font-medium text-ink md:text-2xl"
      >
        {t('title')}
      </h2>
      <form
        aria-labelledby="contact-form-title"
        aria-busy={isSubmitting}
        noValidate
        onSubmit={onSubmit}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-1"
      >
        {(['fullName', 'email', 'phone', 'subject'] as const).map((field) => (
          <div key={field} className="flex flex-col gap-4">
            {fieldLabel(field)}
            <div className="flex flex-col gap-1.5">
              <Input
                id={field}
                placeholder={t(`placeholders.${field}`)}
                {...inputProps[field]}
                {...a11yProps(field)}
                {...register(field)}
              />
              {fieldError(field)}
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-4 md:col-span-full">
          {fieldLabel('message')}
          <div className="flex flex-col gap-1.5">
            <Textarea
              id="message"
              placeholder={t('placeholders.message')}
              {...a11yProps('message', 'message-counter')}
              {...register('message')}
            />
            <div className="flex gap-4">
              {fieldError('message')}
              <p id="message-counter" className="ms-auto text-sm text-muted">
                {t('counter', {
                  count: messageLength,
                  max: MESSAGE_MAX_LENGTH,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-2 md:col-span-full">
          {/* Disabled while sending, so a double click sends once. */}
          <Button
            type="submit"
            size="block"
            disabled={!hydrated || isSubmitting}
          >
            {isSubmitting && (
              <LoaderCircle
                aria-hidden
                className="size-5 motion-safe:animate-spin"
              />
            )}
            {isSubmitting ? t('sending') : t('submit')}
          </Button>
          <div role="status">
            {status === 'success' && (
              <div className="rounded-lg bg-tint-50 p-4 text-brand">
                <p className="font-medium">{t('status.success')}</p>
                <p className="text-sm">{t('status.successDescription')}</p>
              </div>
            )}
          </div>
          {status === 'error' && (
            <div role="alert" className="rounded-lg bg-error/5 p-4 text-error">
              <p className="font-medium">{t('status.error')}</p>
              <p className="text-sm">{t('status.errorDescription')}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
