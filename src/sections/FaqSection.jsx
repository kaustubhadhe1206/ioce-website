import Reveal from '../components/Reveal.jsx';

const FAQS = [
  {
    question: 'What is HypnoReiki?',
    answer:
      'HypnoReiki is IOCE’s integrated methodology combining internationally accredited Clinical Hypnotherapy with Authentic Usui Reiki, designed to consciously re-engineer subconscious thought patterns.',
  },
  {
    question: 'Is it safe?',
    answer:
      'Yes. Every session is conducted by an internationally accredited Clinical Hypnotherapist following ethical, professional practice standards.',
  },
  {
    question: 'Will I lose control?',
    answer:
      'No. You remain fully aware and in control throughout every session. Hypnotherapy is a guided state of focused relaxation, not unconsciousness.',
  },
  {
    question: 'Are online sessions effective?',
    answer:
      'Yes. Online sessions are conducted with the same structure, privacy and attention as in-person sessions, and are a popular option for clients worldwide.',
  },
  {
    question: 'How many sessions will I need?',
    answer:
      'This varies by individual and challenge. Your consultation will include a personalised recommendation based on your specific situation.',
  },
  {
    question: 'Who can benefit from IOCE?',
    answer:
      'Professionals, entrepreneurs, students and individuals facing stress, anxiety, confidence challenges, limiting beliefs, relationship difficulties or seeking peak performance.',
  },
  {
    question: 'Is my information confidential?',
    answer:
      'Completely. Your information and everything discussed during your consultation remain 100% confidential.',
  },
  {
    question: 'What are exclusive in-person sessions?',
    answer:
      'For clients who prefer complete privacy, IOCE offers exclusive sessions hosted at a location of your choosing.',
  },
  {
    question: 'What is the booking process?',
    answer:
      'Complete the consultation request form, review your consultation summary, and proceed to secure payment. You will receive email and WhatsApp confirmation immediately afterward.',
  },
  {
    question: 'Still have questions?',
    answer: 'Reach out through the Contact section below — our team is happy to help before you book.',
  },
];

export default function FaqSection() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="section" aria-labelledby="faq-heading">
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <div className="container narrow-content">
        <Reveal as="h2" id="faq-heading" className="section-heading section-heading--center">
          Frequently Asked Questions
        </Reveal>

        <div className="faq-list">
          {FAQS.map((faq, index) => (
            <Reveal key={faq.question} delay={(index % 5) * 60}>
              <details className="faq-item">
                <summary className="faq-item__question">{faq.question}</summary>
                <p className="faq-item__answer">{faq.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
