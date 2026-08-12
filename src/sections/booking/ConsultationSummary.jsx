import Button from '../../components/Button.jsx';

export default function ConsultationSummary({ lead, plan, isSubmitting, onBack, onConfirm }) {
  const consultationType =
    lead.consultationMode === 'Online' ? 'Online Consultation' : 'Exclusive In-Person Consultation';
  const isPaidPlan = plan.feePaise > 0;

  return (
    <div className="consultation-summary">
      <h3 className="consultation-form__heading">Consultation Summary</h3>

      <dl className="summary-list">
        <Row label="Consultation Type" value={consultationType} />
        <Row label="Plan" value={plan.label} />
        <Row label="Consultation Fee" value={plan.feeDisplay} />
        <Row label="Duration" value={plan.duration} />
        <Row label="Consultation Mode" value={lead.consultationMode} />
        <Row label="Preferred Time" value={lead.preferredTime || 'To be confirmed'} />
      </dl>

      <div className="info-box">
        <p>
          Every consultation is personally conducted by Grand Master Prashant. Each session is
          carefully prepared based upon the information you provide. Your information remains
          completely confidential.
        </p>
      </div>

      <div className="consultation-summary__actions">
        <Button as="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button as="button" variant="primary" onClick={onConfirm} disabled={isSubmitting}>
          {isPaidPlan ? 'Proceed to Secure Payment' : isSubmitting ? 'Confirming…' : 'Confirm Consultation Request'}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="summary-list__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
