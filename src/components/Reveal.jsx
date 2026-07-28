import { useReveal } from '../hooks/useReveal.js';

/**
 * Wraps any block of content with the fade/slide scroll-reveal treatment.
 * `as` lets the wrapper render as a semantic element instead of a div.
 * `delay` (ms) staggers groups of siblings (cards, list items, etc.)
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, isVisible] = useReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
