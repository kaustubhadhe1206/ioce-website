import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';

const MILESTONES = [
  { title: 'Book Consultation', description: 'A private conversation to understand your situation and goals.' },
  { title: 'Discover the Root Cause', description: 'We identify the subconscious pattern driving the challenge.' },
  { title: 'Personalised HypnoReiki', description: 'A session designed specifically around what we uncover.' },
  { title: 'Lasting Transformation', description: 'Real, sustained change — not a temporary fix.' },
];

export default function JourneyRoadmap() {
  return (
    <section className="section" aria-labelledby="journey-heading">
      <div className="container">
        <Reveal as="h2" id="journey-heading" className="section-heading section-heading--center">
          Your Journey Towards Lasting Transformation
        </Reveal>

        <ol className="roadmap">
          {MILESTONES.map((milestone, index) => (
            <li key={milestone.title} className="roadmap__item">
              <Reveal delay={index * 120} className="roadmap__item-inner">
                <span className="roadmap__number">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="roadmap__title">{milestone.title}</h3>
                <p>{milestone.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={MILESTONES.length * 120} className="section-cta roadmap__cta">
          <p className="roadmap__cta-lede">Ready to Begin?</p>
          <Button href="#book-consultation" variant="primary">
            Book Your Consultation
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
