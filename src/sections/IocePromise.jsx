import Reveal from '../components/Reveal.jsx';
import Card from '../components/Card.jsx';

const PROMISES = [
  '100% Confidentiality',
  'Internationally Accredited Clinical Hypnotherapy',
  'Authentic 17th Generation Usui Reiki Lineage',
  'Personalised Transformation Journey',
  'Ethical, Professional & Respectful Practice',
];

export default function IocePromise() {
  return (
    <section className="section" aria-labelledby="promise-heading">
      <div className="container narrow-content">
        <Reveal as="h2" id="promise-heading" className="section-heading section-heading--center">
          The IOCE Promise
        </Reveal>

        <Reveal as={Card} className="promise-card">
          <ul className="check-list promise-card__list">
            {PROMISES.map((promise) => (
              <li key={promise}>{promise}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
