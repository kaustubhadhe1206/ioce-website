import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from '../../components/Reveal.jsx';
import ConsultationForm from './ConsultationForm.jsx';
import ScheduleStep from './ScheduleStep.jsx';
import ConsultationSummary from './ConsultationSummary.jsx';
import PaymentStep from './PaymentStep.jsx';

const STEPS = { FORM: 'form', SCHEDULE: 'schedule', SUMMARY: 'summary', PAYMENT: 'payment' };

export default function BookingFlow() {
  const [step, setStep] = useState(STEPS.FORM);
  const [lead, setLead] = useState(null);
  // { leadId, rowNumber } for the sheet row created on form submit — every
  // later step (scheduling, payment) updates this same row instead of
  // creating a new one.
  const [leadRecord, setLeadRecord] = useState(null);
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const isFirstRender = useRef(true);

  // Each step's content is a very different height (a long form vs. a
  // short summary card), so the viewport's scroll position doesn't follow
  // it — the visitor can click "Continue" and land looking at the footer.
  // Re-anchor to the booking section on every step change, same as the
  // header's "Book Your Consultation" link already does. Skipped on the
  // very first render so mounting this section doesn't itself cause a jump.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const handleFormSubmit = (values) => {
    setLead(values);
    setLeadRecord(null);
    setStep(STEPS.SCHEDULE);

    // Fire-and-forget: capture the funnel entry immediately rather than
    // waiting for scheduling/payment to complete, so drop-offs still show
    // up in the sheet. Not blocking navigation on this — it's tracking
    // data, not something the visitor should ever wait on.
    fetch('/.netlify/functions/create-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead: values }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.crm?.sent) {
          setLeadRecord({ leadId: data.crm.leadId, rowNumber: data.crm.rowNumber });
        }
      })
      .catch(() => {});
  };

  const handlePaymentSuccess = ({ paid, notifications }) => {
    navigate('/thank-you', { state: { lead, paid, notifications } });
  };

  return (
    <section id="book-consultation" ref={sectionRef} className="section booking-section" aria-labelledby="booking-heading">
      <div className="container narrow-content">
        <p className="eyebrow">Begin Your Transformation Journey</p>
        <Reveal as="h2" id="booking-heading" className="section-heading">
          Your transformation begins with a single conscious decision.
        </Reveal>

        <Reveal className="booking-card">
          {/* key={step} forces a remount on step change, which re-triggers the
              booking-step CSS entrance animation — a simple cross-fade between
              Form -> Schedule -> Summary -> Payment without a transition library. */}
          <div key={step} className="booking-step">
            {step === STEPS.FORM && <ConsultationForm initialValues={lead} onSubmit={handleFormSubmit} />}
            {step === STEPS.SCHEDULE && lead && (
              <ScheduleStep
                lead={lead}
                leadRecord={leadRecord}
                onBack={() => setStep(STEPS.FORM)}
                onContinue={() => setStep(STEPS.SUMMARY)}
              />
            )}
            {step === STEPS.SUMMARY && lead && (
              <ConsultationSummary lead={lead} onBack={() => setStep(STEPS.SCHEDULE)} onConfirm={() => setStep(STEPS.PAYMENT)} />
            )}
            {step === STEPS.PAYMENT && lead && (
              <PaymentStep
                lead={lead}
                leadRecord={leadRecord}
                onBack={() => setStep(STEPS.SUMMARY)}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
