import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button.jsx';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="IOCE — Institute Of Consciousness Engineering">
          <span className="site-header__logo-mark">IOCE</span>
          <span className="site-header__logo-sub">Institute Of Consciousness Engineering</span>
        </Link>

        {isHome && (
          <nav aria-label="Primary">
            <Button href="#book-consultation" variant="primary" className="site-header__cta">
              Book Your Consultation
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
