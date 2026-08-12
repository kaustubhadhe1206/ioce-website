import Reveal from '../components/Reveal.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';

const OPTIONS = [
  { title: 'Online', description: 'A private, secure video consultation from wherever you are.' },
  { title: 'Exclusive Sessions at Your Preferred Location', description: 'A fully private session hosted at a location of your choosing.' },
];

export default function ConsultationOptions() {
  return (
    <section className="section" aria-labelledby="consultation-options-heading">
      <div className="container">
        <Reveal as="h2" id="consultation-options-heading" className="section-heading section-heading--center">
          Consultation Options
        </Reveal>

        <div className="card-grid consultation-grid">
          {OPTIONS.map((option, index) => (
            <Reveal key={option.title} as={Card} delay={index * 100} className="consultation-card">
              <h3 className="card-title">{option.title}</h3>
              <p>{option.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="section-cta">
          <Button href="#book-consultation" variant="primary">
            Book Consultation
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
