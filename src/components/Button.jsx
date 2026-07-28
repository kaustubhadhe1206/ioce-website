import { Link } from 'react-router-dom';

/**
 * variant: "primary" (gold fill) | "secondary" (outline) | "ghost" (text + underline)
 * Renders an <a> for in-page anchors, a router <Link> for internal routes,
 * or a <button> when `onClick` is supplied with no href.
 */
export default function Button({
  as,
  href,
  to,
  onClick,
  variant = 'primary',
  className = '',
  children,
  ...rest
}) {
  const classes = `btn btn--${variant} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  const Tag = as || 'button';
  return (
    <Tag type={Tag === 'button' ? 'button' : undefined} className={classes} onClick={onClick} {...rest}>
      {children}
    </Tag>
  );
}
