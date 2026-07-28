import Button from '../../components/Button.jsx';
import { CONSULTATION_FEE_DISPLAY, CONSULTATION_DURATION_DISPLAY } from '../../lib/constants.js';

export default function ConsultationSummary({ lead, onBack, onConfirm }) {
  const consultationType =
    lead.consultationMode === 'Online' ? 'Online Consultation' : 'Exclusive In-Person Consultation';

  return (
    <div className="consultation-summary">
      <h3 className="consultation-form__heading">Consultation Summary</h3>

      <dl className="summary-list">
        <Row label="Consultation Type" value={consultationType} />
        <Row label="Consultation Fee" value={CONSULTATION_FEE_DISPLAY} />
        <Row label="Estimated Duration" value={CONSULTATION_DURATION_DISPLAY} />
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
        <Button as="button" variant="primary" onClick={onConfirm}>
          Proceed to Secure Payment
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
