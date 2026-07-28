import { forwardRef } from 'react';

// forwardRef is required here: Reveal attaches its IntersectionObserver
// ref directly to the `as` component, and a plain function component
// can't accept a ref — it would silently no-op and the card would
// never receive `.is-visible`, leaving it permanently at opacity: 0.
const Card = forwardRef(function Card({ className = '', children, ...rest }, ref) {
  return (
    <div ref={ref} className={`card ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
});

export default Card;
