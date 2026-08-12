import Reveal from '../components/Reveal.jsx';
import { WhatsAppIcon, InstagramIcon } from '../components/SocialIcons.jsx';

// TODO: swap for the real IOCE Instagram handle once one exists.
const INSTAGRAM_HANDLE = '@reiki_grandmaster_prashant';
const INSTAGRAM_URL = 'https://instagram.com/reiki_grandmaster_prashant';

const LOCATION = 'Sector 11, CBD Belapur, 400614';
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(LOCATION)}&output=embed`;

export default function ContactSection() {
  return (
    <section className="section" aria-labelledby="contact-heading">
      <div className="container">
        <Reveal as="h2" id="contact-heading" className="section-heading section-heading--center">
          Contact
        </Reveal>

        <div className="contact-grid">
          <Reveal as="address" className="contact-details">
            <p>
              <strong>Phone:</strong> <a href="tel:+918850958547">+91 88509 58547</a>
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:prashant@chembridgeglobal.co">prashant@chembridgeglobal.co</a>
            </p>
            <p>
              <strong>WhatsApp:</strong>{' '}
              <a href="https://wa.me/918850958547" className="contact-details__social-link">
                <WhatsAppIcon className="contact-details__social-icon" />
                +91 88509 58547
              </a>
            </p>
            <p>
              <strong>Instagram:</strong>{' '}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-details__social-link"
              >
                <InstagramIcon className="contact-details__social-icon" />
                {INSTAGRAM_HANDLE}
              </a>
            </p>
            <p>
              <strong>Location:</strong> {LOCATION}
            </p>
            <p>
              <strong>Working Hours:</strong> Monday &ndash; Saturday, 10:00 AM &ndash; 7:00 PM
            </p>
          </Reveal>

          <Reveal delay={100} className="contact-map" aria-label="IOCE location map">
            <iframe
              title="IOCE location map"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
