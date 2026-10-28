'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Brand } from './Brand';
import { LocaleSwitch } from './LocaleSwitch';
import {
  MobileNavigation,
  type MobileNavigationProps,
} from './MobileNavigation';
import { Button } from '../ui/Button';
import { ArrowIcon } from '../ui/LinkArrow';

export interface HeaderProps extends MobileNavigationProps {
  labels: MobileNavigationProps['labels'] & { skip: string };
  /** The consuming route supplies a focusable <main id="main" tabIndex={-1}>. */
  mainId?: string;
  theme?: 'light' | 'dark';
}

export function Header({
  mainId = 'main',
  theme = 'light',
  ...props
}: HeaderProps) {
  const { home, brandLabel, links, locale, localeLinks, labels, mega, cta } =
    props;
  const [expanded, setExpanded] = useState(false);
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false);
        trigger.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setExpanded(false);
    };
    const media = window.matchMedia?.('(max-width: 900px)');
    const onResize = () => {
      if (media?.matches) setExpanded(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    media?.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      media?.removeEventListener('change', onResize);
    };
  }, [expanded]);

  return (
    <>
      <a
        className="skip-link"
        href={`#${mainId}`}
        onClick={() => document.getElementById(mainId)?.focus()}
      >
        {labels.skip}
      </a>
      <header
        ref={header}
        className={`site-header site-header--${theme}`}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setExpanded(false);
        }}
      >
        <div className="wrap header-inner">
          <Brand home={home} label={brandLabel} />
          <nav className="main-nav" aria-label={labels.navigation}>
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
              <button
                ref={trigger}
                className="mega-toggle"
                type="button"
                aria-expanded={expanded}
                aria-controls={id}
                onClick={() => setExpanded(!expanded)}
              >
                {mega.label}
                <span aria-hidden="true">⌄</span>
              </button>
            )}
            {mega && (
              <div className="mega" id={id} hidden={!expanded}>
                <div
                  className="wrap mega-grid"
                  role="group"
                  aria-label={mega.label}
                >
                  {mega.links.map((link) => (
                    <a
                      className="mega-item"
                      href={link.href}
                      key={link.href}
                      aria-current={link.current ? 'page' : undefined}
                      onClick={() => setExpanded(false)}
                    >
                      <ArrowIcon />
                      <strong>{link.label}</strong>
                      {link.description && <p>{link.description}</p>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </nav>
          <div className="header-actions">
            <div className="header-locale">
              <LocaleSwitch
                label={labels.languages}
                locale={locale}
                links={localeLinks}
              />
            </div>
            {cta && (
              <Button className="header-quote" href={cta.href}>
                {cta.label}
              </Button>
            )}
            <MobileNavigation {...props} />
          </div>
        </div>
      </header>
    </>
  );
}
