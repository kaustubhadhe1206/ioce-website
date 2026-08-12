import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from '../../components/Reveal.jsx';
import ConsultationForm from './ConsultationForm.jsx';
import PlanStep from './PlanStep.jsx';
import ScheduleStep from './ScheduleStep.jsx';
import ConsultationSummary from './ConsultationSummary.jsx';
import PaymentStep from './PaymentStep.jsx';

const STEPS = { FORM: 'form', PLAN: 'plan', SCHEDULE: 'schedule', SUMMARY: 'summary', PAYMENT: 'payment' };

export default function BookingFlow() {
  const [step, setStep] = useState(STEPS.FORM);
  const [lead, setLead] = useState(null);
  const [plan, setPlan] = useState(null);
  // { leadId, rowNumber } for the sheet row created on form submit — every
  // later step (scheduling, payment) updates this same row instead of
  // creating a new one.
  const [leadRecord, setLeadRecord] = useState(null);
  const [isConfirmingFreePlan, setIsConfirmingFreePlan] = useState(false);
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  // Compares against the last step actually scrolled to, rather than a
  // one-shot "is this the first render" flag — a boolean flag flips to
  // false on React 18 Strict Mode's intentional double-invoke of this
  // effect on mount, so the second (synthetic) invocation wrongly reads
  // as a real step change and scrolls on every page load. Comparing
  // values instead is idempotent: re-running with the same `step` is a
  // no-op no matter how many times it happens.
  const lastScrolledStepRef = useRef(step);

  // Each step's content is a very different height (a long form vs. a
  // short summary card), so the viewport's scroll position doesn't follow
  // it — the visitor can click "Continue" and land looking at the footer.
  // Re-anchor to the booking section on every step change, same as the
  // header's "Book Your Consultation" link already does.
  useEffect(() => {
    if (lastScrolledStepRef.current === step) return;
    lastScrolledStepRef.current = step;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const handleFormSubmit = (values) => {
    setLead(values);
    setLeadRecord(null);
    setStep(STEPS.PLAN);

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

  const handlePlanSelect = (selectedPlan) => {
    setPlan(selectedPlan);
    setStep(STEPS.SCHEDULE);

    if (leadRecord?.leadId) {
      fetch('/.netlify/functions/update-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: leadRecord.leadId,
          rowNumber: leadRecord.rowNumber,
          updates: { plan: selectedPlan.label },
        }),
      }).catch(() => {});
    }
  };

  const handlePaymentSuccess = ({ paid, notifications }) => {
    navigate('/thank-you', { state: { lead, paid, notifications } });
  };

  // The free 15-minute plan never touches Razorpay — confirm it directly
  // through the same no-payment path PaymentStep falls back to when
  // Razorpay isn't configured, just tagged with the real reason so the
  // sheet doesn't record it as "payment setup pending".
  const handleFreePlanConfirm = async () => {
    setIsConfirmingFreePlan(true);
    const result = await fetch('/.netlify/functions/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead: { ...lead, plan: plan?.label },
        leadId: leadRecord?.leadId,
        rowNumber: leadRecord?.rowNumber,
        reason: 'free_plan',
      }),
    })
      .then((res) => res.json())
      .catch(() => ({ saved: false }));
    setIsConfirmingFreePlan(false);
    navigate('/thank-you', { state: { lead, paid: false, notifications: result.notifications } });
  };

  const handleSummaryConfirm = () => {
    if (plan?.feePaise > 0) {
      setStep(STEPS.PAYMENT);
    } else {
      handleFreePlanConfirm();
    }
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
            {step === STEPS.PLAN && (
              <PlanStep onBack={() => setStep(STEPS.FORM)} onContinue={handlePlanSelect} />
            )}
            {step === STEPS.SCHEDULE && lead && plan && (
              <ScheduleStep
                lead={lead}
                plan={plan}
                leadRecord={leadRecord}
                onBack={() => setStep(STEPS.PLAN)}
                onContinue={() => setStep(STEPS.SUMMARY)}
              />
            )}
            {step === STEPS.SUMMARY && lead && plan && (
              <ConsultationSummary
                lead={lead}
                plan={plan}
                isSubmitting={isConfirmingFreePlan}
                onBack={() => setStep(STEPS.SCHEDULE)}
                onConfirm={handleSummaryConfirm}
              />
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
