import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type Appearance = { variant?: 'gold' | 'outline' | 'dark'; className?: string };
export type ButtonProps = Appearance &
  (
    | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
    | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  );

export function Button({
  variant = 'gold',
  className = '',
  ...props
}: ButtonProps) {
  const classes = `btn btn--${variant} ${className}`.trim();
  if (typeof props.href === 'string') {
    return (
      <a
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={classes}
      />
    );
  }
  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type="button" {...buttonProps} className={classes} />;
}
