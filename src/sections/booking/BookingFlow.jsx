import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from '../../components/Reveal.jsx';
import ConsultationForm from './ConsultationForm.jsx';
import ConsultationSummary from './ConsultationSummary.jsx';
import PaymentStep from './PaymentStep.jsx';

const STEPS = { FORM: 'form', SUMMARY: 'summary', PAYMENT: 'payment' };

export default function BookingFlow() {
  const [step, setStep] = useState(STEPS.FORM);
  const [lead, setLead] = useState(null);
  const navigate = useNavigate();

  const handleFormSubmit = (values) => {
    setLead(values);
    setStep(STEPS.SUMMARY);
  };

  const handlePaymentSuccess = ({ paid, notifications }) => {
    navigate('/thank-you', { state: { lead, paid, notifications } });
  };

  return (
    <section id="book-consultation" className="section booking-section" aria-labelledby="booking-heading">
      <div className="container narrow-content">
        <p className="eyebrow">Begin Your Transformation Journey</p>
        <Reveal as="h2" id="booking-heading" className="section-heading">
          Your transformation begins with a single conscious decision.
        </Reveal>

        <Reveal className="booking-card">
          {/* key={step} forces a remount on step change, which re-triggers the
              booking-step CSS entrance animation — a simple cross-fade between
              Form -> Summary -> Payment without a transition library. */}
          <div key={step} className="booking-step">
            {step === STEPS.FORM && <ConsultationForm initialValues={lead} onSubmit={handleFormSubmit} />}
            {step === STEPS.SUMMARY && lead && (
              <ConsultationSummary lead={lead} onBack={() => setStep(STEPS.FORM)} onConfirm={() => setStep(STEPS.PAYMENT)} />
            )}
            {step === STEPS.PAYMENT && lead && (
              <PaymentStep lead={lead} onBack={() => setStep(STEPS.SUMMARY)} onSuccess={handlePaymentSuccess} />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
