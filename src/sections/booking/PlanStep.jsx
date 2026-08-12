import { useState } from 'react';
import Button from '../../components/Button.jsx';
import { CONSULTATION_PLANS } from '../../lib/constants.js';

export default function PlanStep({ onBack, onContinue }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="plan-step">
      <h3 className="consultation-form__heading">Choose Your Consultation</h3>
      <p className="consultation-form__lede">
        Select the format that best fits where you are right now.
      </p>

      <div className="plan-options" role="radiogroup" aria-label="Consultation plan">
        {CONSULTATION_PLANS.map((plan) => (
          <button
            type="button"
            key={plan.id}
            role="radio"
            aria-checked={selectedId === plan.id}
            className={`plan-card ${selectedId === plan.id ? 'plan-card--selected' : ''}`}
            onClick={() => setSelectedId(plan.id)}
          >
            <span className="plan-card__fee">{plan.feeDisplay}</span>
            <h4 className="plan-card__title">{plan.label}</h4>
            <p className="plan-card__duration">{plan.duration}</p>
            <p className="plan-card__description">{plan.description}</p>
          </button>
        ))}
      </div>

      <div className="consultation-summary__actions">
        <Button as="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          as="button"
          variant="primary"
          disabled={!selectedId}
          onClick={() => onContinue(CONSULTATION_PLANS.find((plan) => plan.id === selectedId))}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
