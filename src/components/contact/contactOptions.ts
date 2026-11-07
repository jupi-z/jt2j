export const contactDivisionOptions = [
  { slug: 'security-biometrics', label: { fr: 'Sécurité & Biométrie', en: 'Security & Biometrics' } },
  { slug: 'logistics-tracking', label: { fr: 'Logistique & Tracking', en: 'Logistics & Tracking' } },
  { slug: 'hygiene-pest-control', label: { fr: 'Hygiène & Extermination', en: 'Hygiene & Pest Control' } },
  { slug: 'business-marketing', label: { fr: 'Business & Marketing', en: 'Business & Marketing' } },
  { slug: 'travel-escapes', label: { fr: 'Voyages & Évasion', en: 'Travel & Escapes' } },
] as const;

export const contactServiceOptions = [
  { slug: 'pest-control', division: 'hygiene-pest-control', label: { fr: 'Lutte contre les nuisibles', en: 'Pest Control & Extermination' } },
  { slug: 'cleaning', division: 'hygiene-pest-control', label: { fr: 'Nettoyage & entretien', en: 'Cleaning Services' } },
  { slug: 'travel-tourism', division: 'travel-escapes', label: { fr: 'Voyages & tourisme', en: 'Travel & Tourism' } },
  { slug: 'disinfection-sanitation', division: 'hygiene-pest-control', label: { fr: 'Désinfection & assainissement', en: 'Disinfection & Sanitation' } },
  { slug: 'facility-management', division: 'hygiene-pest-control', label: { fr: 'Gestion des installations', en: 'Facility Management' } },
  { slug: 'transport-logistics', division: 'logistics-tracking', label: { fr: 'Transport & logistique', en: 'Transport & Logistics' } },
  { slug: 'trading-supply', division: 'business-marketing', label: { fr: 'Fourniture & équipements', en: 'General Trading & Supply' } },
] as const;

/** Only canonical public identities may prefill the lead form from the URL.
 * A selected service takes precedence over a conflicting division. */
export function getContactPrefill(search: string): { division: string; service: string } {
  const params = new URLSearchParams(search);
  const requestedDivision = params.get('division');
  const requestedService = params.get('service');
  const service = contactServiceOptions.find((entry) => entry.slug === requestedService);
  const division = contactDivisionOptions.find((entry) => entry.slug === requestedDivision);
  return {
    division: service?.division ?? division?.slug ?? '',
    service: service?.slug ?? '',
  };
}
