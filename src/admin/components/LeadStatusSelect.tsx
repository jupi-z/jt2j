'use client';

import type { ReactNode } from 'react';

export const leadStatuses = ['new', 'assigned', 'in-progress', 'closed', 'spam'] as const;

export function LeadStatusSelect({
  value,
  setValue,
  onChange,
}: {
  value?: string;
  setValue?: (value: string) => void;
  onChange?: (value: string) => void;
}): ReactNode {
  return (
    <select
      aria-label="Lead status"
      value={value ?? 'new'}
      onChange={(event) => {
        const next = event.target.value;
        setValue?.(next);
        onChange?.(next);
      }}
    >
      {leadStatuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
