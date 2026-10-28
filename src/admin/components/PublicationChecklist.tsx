'use client';

import type { ReactNode } from 'react';
import { getPublicationChecklist } from '../hooks/publicationChecks';

export function PublicationChecklist({ data }: { data?: unknown }): ReactNode {
  return (
    <ul aria-label="Publication checklist">
      {getPublicationChecklist(data).map((item) => (
        <li key={item.key} data-check={item.key} data-complete={item.complete}>
          {item.complete ? '✓' : '○'} {item.label}
        </li>
      ))}
    </ul>
  );
}
