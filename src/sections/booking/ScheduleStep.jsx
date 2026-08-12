import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../../components/Button.jsx';

// Duration is locked by which Calendly *event type* the visitor lands on —
// each one is configured in Calendly's own dashboard with a single fixed
// duration, so there's no in-page control that could let them pick a
// different length. Keyed by CONSULTATION_PLANS id in lib/constants.js.
const CALENDLY_URLS = {
  free15: import.meta.env.VITE_CALENDLY_URL_15MIN,
  paid45: import.meta.env.VITE_CALENDLY_URL_45MIN,
};
const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';

let calendlyScriptPromise = null;
function loadCalendlyScript() {
  if (window.Calendly) return Promise.resolve(true);
  if (calendlyScriptPromise) return calendlyScriptPromise;

  calendlyScriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return calendlyScriptPromise;
}

/**
 * Embeds prashant@chembridgeglobal.co's Calendly page — the 15-min or
 * 45-min event type, matching whichever plan the visitor picked on the
 * previous step — between the consultation form and the summary/payment
 * steps. Uses
 * Calendly's documented initInlineWidget() JS API rather than a static
 * `calendly-inline-widget` div, since that div only auto-initializes on
 * the script's own load event — it won't pick up ours mounting later
 * as the visitor steps back and forth through the booking flow.
 *
 * Continue stays disabled until Calendly posts its `calendly.event_scheduled`
 * message (fired the moment a booking actually completes) — so nobody can
 * skip past scheduling without picking a slot. When scheduling isn't
 * configured at all, there's nothing to wait for, so Continue stays enabled.
 *
 * Calendly's own confirmation screen already offers "add to calendar"
 * for Google/Outlook/iCal once a slot is booked; the Google Calendar
 * link below is only a convenience extra. Without a Calendly API/webhook
 * integration we can't read back the exact slot they picked, so it's
 * deliberately generic (title + description, no pre-filled time).
 */
export default function ScheduleStep({ lead, plan, leadRecord, onBack, onContinue }) {
  const containerRef = useRef(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const planCalendlyUrl = CALENDLY_URLS[plan?.id];

  const calendlyUrl = useMemo(() => {
    if (!planCalendlyUrl) return null;
    const params = new URLSearchParams({
      name: lead.fullName || '',
      email: lead.email || '',
    });
    return `${planCalendlyUrl}?${params.toString()}`;
  }, [lead, planCalendlyUrl]);

  useEffect(() => {
    if (!calendlyUrl) return undefined;
    let cancelled = false;

    loadCalendlyScript().then((loaded) => {
      if (cancelled || !loaded || !containerRef.current) return;
      window.Calendly?.initInlineWidget({
        url: calendlyUrl,
        parentElement: containerRef.current,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [calendlyUrl]);

  useEffect(() => {
    if (!calendlyUrl) return undefined;
    const onMessage = (e) => {
      if (e.data?.event !== 'calendly.event_scheduled') return;
      setIsScheduled(true);

      if (leadRecord?.leadId) {
        fetch('/.netlify/functions/update-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: leadRecord.leadId,
            rowNumber: leadRecord.rowNumber,
            updates: { meetingScheduled: 'Yes', calendlyLink: planCalendlyUrl },
          }),
        }).catch(() => {});
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [calendlyUrl, leadRecord, planCalendlyUrl]);

  const googleCalendarUrl = useMemo(() => {
    const text = encodeURIComponent('IOCE Consultation with Grand Master Prashant');
    const details = encodeURIComponent(
      'Your IOCE consultation. Set this reminder to match the exact time from your Calendly confirmation email.'
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`;
  }, []);

  const canContinue = !calendlyUrl || isScheduled;

  return (
    <div className="schedule-step">
      <h3 className="consultation-form__heading">Schedule Your {plan?.duration} Consultation</h3>
      <p className="consultation-form__lede">
        Choose a time that works for you. Every session is personally conducted by Grand Master
        Prashant.
      </p>

      {calendlyUrl ? (
        <div ref={containerRef} className="schedule-step__embed" />
      ) : (
        <div className="info-box">
          <p>Online scheduling isn&rsquo;t set up yet. Our team will contact you directly to arrange a time.</p>
        </div>
      )}

      <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost schedule-step__calendar-link">
        + Add a reminder to your Google Calendar (optional)
      </a>

      {calendlyUrl && (
        <p className={`schedule-step__status ${isScheduled ? 'schedule-step__status--done' : ''}`}>
          {isScheduled ? '✓ Consultation scheduled — you can continue.' : 'Select a date and time above to continue.'}
        </p>
      )}

      <div className="consultation-summary__actions">
        <Button as="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button as="button" variant="primary" onClick={onContinue} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
