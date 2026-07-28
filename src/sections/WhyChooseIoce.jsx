import Reveal from '../components/Reveal.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import LazyVideo from '../components/LazyVideo.jsx';
import { VIDEO_ASSETS } from '../lib/videoAssets.js';

const CREDENTIALS = [
  '29+ Years Professional Experience',
  '20+ Years Clinical Hypnotherapy & Usui Reiki',
  'International Business Experience',
  'Internationally Accredited Clinical Hypnotherapist',
  'Authentic 17th Generation Usui Reiki Lineage',
];

const SESSION_QUALITIES = ['Private', 'Confidential', 'Professional', 'Online Sessions', 'In-Person Sessions', 'Exclusive Sessions at Your Preferred Location'];

export default function WhyChooseIoce() {
  return (
    <section id="why-choose-ioce" className="section video-section" aria-labelledby="why-ioce-heading">
      <LazyVideo asset={VIDEO_ASSETS.whyTrustIoce} mode="background" aria-hidden="true" />
      <div className="section-scrim" aria-hidden="true" />

      <div className="container section-content">
        <Reveal as="h2" id="why-ioce-heading" className="section-heading section-heading--center">
          Why Choose IOCE?
        </Reveal>

        <div className="card-grid why-ioce__grid">
          <Reveal as={Card}>
            <h3 className="card-title">Credentials</h3>
            <ul className="check-list">
              {CREDENTIALS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal as={Card} delay={120}>
            <h3 className="card-title">Every Session Is</h3>
            <ul className="check-list">
              {SESSION_QUALITIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200} className="section-cta">
          <Button href="#book-consultation" variant="primary">
            Book Consultation
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
