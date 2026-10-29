import type { NavigationLink } from '../layout/navigation';

export function Breadcrumbs({
  label,
  items,
}: {
  label: string;
  items: readonly (Pick<NavigationLink, 'label'> & { href?: string })[];
}) {
  return (
    <nav aria-label={label} className="breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {index > 0 && (
              <span aria-hidden="true" className="breadcrumb-separator">
                /
              </span>
            )}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
