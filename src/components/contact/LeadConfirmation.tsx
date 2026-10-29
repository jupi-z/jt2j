import type { Locale } from '@/i18n/config';

export function LeadConfirmation({ confirmationId, locale }: { confirmationId: string; locale: Locale }) {
  const isFrench = locale === 'fr';
  return (
    <section aria-live="polite" className="public-contact-confirmation">
      <h2>{isFrench ? 'Demande reçue' : 'Request received'}</h2>
      <p>
        {isFrench
          ? 'Merci. Notre équipe reviendra vers vous prochainement.'
          : 'Thank you. Our team will get back to you soon.'}
      </p>
      <p>{isFrench ? 'Référence' : 'Reference'} : {confirmationId}</p>
    </section>
  );
}
