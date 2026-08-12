import Reveal from '../components/Reveal.jsx';

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
              <strong>WhatsApp:</strong> <a href="https://wa.me/918850958547">+91 88509 58547</a>
            </p>
            <p>
              <strong>Location:</strong> Sector 11, CBD Belapur, 400614
            </p>
            <p>
              <strong>Working Hours:</strong> Monday &ndash; Saturday, 10:00 AM &ndash; 7:00 PM
            </p>
          </Reveal>

          <Reveal delay={100} className="contact-map" aria-label="Map placeholder">
            <iframe
              title="IOCE location map"
              src="https://www.google.com/maps?q=India&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
