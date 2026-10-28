'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Brand } from './Brand';
import { LocaleSwitch } from './LocaleSwitch';
import { Button } from '../ui/Button';
import type {
  Locale,
  LocaleLink,
  NavigationGroup,
  NavigationLabels,
  NavigationLink,
} from './navigation';

export interface MobileNavigationProps {
  home: NavigationLink;
  brandLabel?: string;
  links: readonly NavigationLink[];
  locale: Locale;
  localeLinks: readonly LocaleLink[];
  labels: NavigationLabels;
  mega?: NavigationGroup;
  cta?: NavigationLink;
}

export function MobileNavigation({
  home,
  brandLabel,
  links,
  locale,
  localeLinks,
  labels,
  mega,
  cta,
}: MobileNavigationProps) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return;
    const desktop = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = () => {
      if (desktop.matches && dialog.current?.open) dialog.current.close();
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="menu-button"
        aria-label={labels.openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          dialog.current?.showModal();
          closeButton.current?.focus();
          setOpen(true);
        }}
      >
        <span />
        <span />
      </button>
      <dialog
        ref={dialog}
        id={id}
        className="mobile-nav"
        aria-label={labels.navigation}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const items = event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not(:disabled)',
          );
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="mobile-panel">
          <div
            className="mobile-top"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('a'))
                dialog.current?.close();
            }}
          >
            <Brand home={home} label={brandLabel} />
            <button
              ref={closeButton}
              type="button"
              className="close-button"
              aria-label={labels.closeMenu}
              onClick={() => dialog.current?.close()}
            >
              ×
            </button>
          </div>
          <nav
            className="mobile-links"
            aria-label={labels.navigation}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('a'))
                dialog.current?.close();
            }}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
            {mega && (
              <div className="mobile-divisions">
                <p className="eyebrow">{mega.label}</p>
                {mega.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-current={link.current ? 'page' : undefined}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </nav>
          <div
            className="mobile-bottom"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('a'))
                dialog.current?.close();
            }}
          >
            <LocaleSwitch
              label={labels.languages}
              locale={locale}
              links={localeLinks}
            />
            {cta && <Button href={cta.href}>{cta.label}</Button>}
          </div>
        </div>
      </dialog>
    </>
  );
}
