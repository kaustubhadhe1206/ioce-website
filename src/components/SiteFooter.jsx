import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__logo">IOCE</p>
          <p className="site-footer__tagline">Institute Of Consciousness Engineering</p>
        </div>

        <nav aria-label="Footer">
          <ul className="site-footer__links">
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
            <li>
              <Link to="/disclaimer">Disclaimer</Link>
            </li>
          </ul>
        </nav>

        <p className="site-footer__copyright">
          &copy; {new Date().getFullYear()} Institute Of Consciousness Engineering — An Initiative of ChemBridge
          Global. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
