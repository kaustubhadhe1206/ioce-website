import Reveal from '../components/Reveal.jsx';
import Card from '../components/Card.jsx';

const CATEGORIES = [
  'Stress',
  'Anxiety',
  'Confidence',
  'Emotional Healing',
  'Limiting Beliefs',
  'Peak Performance',
  'Relationships',
  'Leadership',
  'Career Growth',
  'Students',
  'Professionals',
  'Entrepreneurs',
];

export default function WhoCanBenefit() {
  return (
    <section className="section" aria-labelledby="who-benefits-heading">
      <div className="container">
        <Reveal as="h2" id="who-benefits-heading" className="section-heading section-heading--center">
          Who Can Benefit?
        </Reveal>

        <div className="card-grid benefit-grid">
          {CATEGORIES.map((category, index) => (
            <Reveal key={category} as={Card} delay={(index % 4) * 80} className="benefit-card">
              <span className="benefit-card__mark" aria-hidden="true" />
              <h3 className="benefit-card__title">{category}</h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
