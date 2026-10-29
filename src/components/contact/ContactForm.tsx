'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import { LeadConfirmation } from './LeadConfirmation';

type Props = { locale: Locale; sourcePage: string };

const copy = {
  fr: {
    intent: 'Objet de la demande',
    general: 'Information générale',
    quote: 'Demande de devis',
    partnership: 'Proposition de partenariat',
    other: 'Autre demande',
    division: 'Pôle concerné',
    divisionNone: 'Je ne sais pas encore',
    service: 'Service concerné',
    serviceNone: 'À préciser avec JT2J',
    name: 'Nom complet',
    email: 'Adresse e-mail',
    phone: 'Numéro de téléphone (facultatif)',
    company: 'Entreprise / organisation (facultatif)',
    city: 'Ville / lieu du besoin (facultatif)',
    message: 'Décrivez votre besoin',
    placeholder: 'Indiquez le contexte, le service recherché et toute précision utile.',
    consent:
      "J'accepte que JT2J utilise ces informations pour répondre à ma demande.",
    submit: 'Vérifier ma demande',
    sending: 'Envoi en cours…',
    error:
      "Votre demande n'a pas pu être envoyée. Veuillez réessayer plus tard.",
    notificationError:
      'Votre demande a été enregistrée. Notre équipe doit encore être alertée.',
  },
  en: {
    intent: 'Reason for contacting us',
    general: 'General inquiry',
    quote: 'Quote request',
    partnership: 'Partnership proposal',
    other: 'Other request',
    division: 'Relevant division',
    divisionNone: "I'm not sure yet",
    service: 'Service of interest',
    serviceNone: 'To be discussed with JT2J',
    name: 'Full name',
    email: 'Email address',
    phone: 'Phone number (optional)',
    company: 'Company / organization (optional)',
    city: 'City / service location (optional)',
    message: 'Describe your needs',
    placeholder: 'Share the context, the service you need, and any useful details.',
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
        intent: form.get('intent'),
        city: form.get('city'),
        division: form.get('division'),
        service: form.get('service'),
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
          {labels.intent}
          <select name="intent" defaultValue="general" required>
            <option value="general">{labels.general}</option>
            <option value="quote">{labels.quote}</option>
            <option value="partnership">{labels.partnership}</option>
            <option value="other">{labels.other}</option>
          </select>
        </label>
        <label>
          {labels.division}
          <select name="division" defaultValue="">
            <option value="">{labels.divisionNone}</option>
            <option value="security-biometrics">JT2J Security &amp; Biometrics</option>
            <option value="logistics-tracking">JT2J Logistics &amp; Tracking</option>
            <option value="hygiene-maintenance">JT2J Hygiene &amp; Maintenance</option>
            <option value="business-solutions">JT2J Business Solutions</option>
            <option value="travel-tourism">JT2J Travel &amp; Tourism</option>
          </select>
        </label>
        <label>
          {labels.service}
          <select name="service" defaultValue="">
            <option value="">{labels.serviceNone}</option>
            <option value="pest-control-extermination">Pest Control &amp; Extermination</option>
            <option value="cleaning-services">Cleaning Services</option>
            <option value="travel-tourism">Travel &amp; Tourism</option>
            <option value="disinfection-sanitation">Disinfection &amp; Sanitation</option>
            <option value="facility-management">Facility Management</option>
            <option value="transport-logistics">Transport &amp; Logistics</option>
            <option value="general-trading-supply">General Trading &amp; Supply</option>
          </select>
        </label>
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
        <label>
          {labels.city}
          <input name="city" type="text" autoComplete="address-level2" />
        </label>
      </div>
      <label>
        {labels.message}
        <textarea name="message" required rows={6} placeholder={labels.placeholder} />
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
