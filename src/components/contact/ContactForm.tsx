'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import { LeadConfirmation } from './LeadConfirmation';

type Props = { locale: Locale; sourcePage: string };

const copy = {
  fr: {
    name: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone',
    company: 'Entreprise',
    message: 'Message',
    consent:
      "J'accepte que JT2J utilise ces informations pour répondre à ma demande.",
    submit: 'Envoyer la demande',
    sending: 'Envoi en cours…',
    error:
      "Votre demande n'a pas pu être envoyée. Veuillez réessayer plus tard.",
    notificationError:
      'Votre demande a été enregistrée. Notre équipe doit encore être alertée.',
  },
  en: {
    name: 'Name',
    email: 'E-mail',
    phone: 'Phone',
    company: 'Company',
    message: 'Message',
    consent: 'I agree that JT2J may use this information to answer my request.',
    submit: 'Send request',
    sending: 'Sending…',
    error: 'Your request could not be sent. Please try again later.',
    notificationError:
      'Your request was saved. Our team still needs to be alerted.',
  },
} as const;

export function ContactForm({ locale, sourcePage }: Props) {
  const labels = copy[locale];
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'error' | 'notification-error'
  >('idle');
  const [confirmationId, setConfirmationId] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    try {
      const form = new FormData(event.currentTarget);
      const csrfResponse = await fetch('/api/csrf', { cache: 'no-store' });
      const csrfBody = csrfResponse.ok
        ? ((await csrfResponse.json()) as { token?: string })
        : {};
      const requestBody = JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        company: form.get('company'),
        message: form.get('message'),
        locale,
        sourcePage,
        consent: form.get('consent') === 'on',
        website: form.get('website'),
      });
      const post = () =>
        fetch('/api/leads', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...(csrfBody.token ? { 'x-csrf-token': csrfBody.token } : {}),
          },
          body: requestBody,
        });
      let response = await post();
      if (response.status === 428) response = await post();
      const body = (await response.json()) as {
        confirmationId?: string;
        error?: { code?: string; confirmationId?: string };
      };
      if (response.ok && body.confirmationId) {
        setConfirmationId(body.confirmationId);
        setStatus('idle');
        return;
      }
      if (body.error?.code === 'NOTIFICATION_FAILED') {
        setConfirmationId(body.error.confirmationId);
        setStatus('notification-error');
        return;
      }
      setStatus('error');
    } catch {
      setStatus('error');
    } finally {
      setStatus((current) => (current === 'sending' ? 'error' : current));
    }
  }

  if (confirmationId && status === 'idle')
    return <LeadConfirmation confirmationId={confirmationId} locale={locale} />;
  return (
    <form className="public-contact-form" onSubmit={submit} noValidate>
      <div className="public-contact-grid">
        <label>
          {labels.name}
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label>
          {labels.email}
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          {labels.phone}
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label>
          {labels.company}
          <input name="company" type="text" autoComplete="organization" />
        </label>
      </div>
      <label>
        {labels.message}
        <textarea name="message" required rows={6} />
      </label>
      <label className="public-contact-consent">
        <input
          name="consent"
          type="checkbox"
          required
          aria-label={locale === 'fr' ? 'Consentement' : 'Consent'}
        />
        {labels.consent}
      </label>
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        hidden
      />
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? labels.sending : labels.submit}
      </button>
      {status === 'error' && <p role="alert">{labels.error}</p>}
      {status === 'notification-error' && (
        <p role="alert">
          {labels.notificationError} {confirmationId}
        </p>
      )}
    </form>
  );
}
