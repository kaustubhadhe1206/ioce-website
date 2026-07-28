import Reveal from '../components/Reveal.jsx';
import Card from '../components/Card.jsx';

const PILLARS = [
  { title: 'Personal Transformation', description: 'One-on-one HypnoReiki consultations for individual growth and healing.' },
  { title: 'Learning', description: 'Structured education in Clinical Hypnotherapy and Usui Reiki principles.' },
  { title: 'Community', description: 'A network of individuals committed to conscious, lasting change.' },
  { title: 'Corporate Transformation', description: 'Leadership and performance programs for teams and organisations.' },
];

export default function TransformationEcosystem() {
  return (
    <section className="section" aria-labelledby="ecosystem-heading">
      <div className="container">
        <Reveal as="h2" id="ecosystem-heading" className="section-heading section-heading--center">
          IOCE Transformation Ecosystem
        </Reveal>
        <Reveal as="p" delay={80} className="section-lede section-lede--center">
          IOCE is more than a consultation &mdash; it is a complete ecosystem for conscious
          transformation.
        </Reveal>

        <div className="card-grid ecosystem-grid">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} as={Card} delay={index * 90} className="ecosystem-card">
              <span className="ecosystem-card__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="card-title">{pillar.title}</h3>
              <p>{pillar.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
