import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Keep the booking result in component state, then clear it from the
  // history entry. React Router stores navigation state in window.history,
  // which survives a reload, so without clearing it a refresh would show
  // this page again. Once cleared, a refresh (or a direct visit to
  // /thank-you) has no state and is sent back to the home page.
  const [state] = useState(location.state);

  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { paid, notifications } = state;

  return (
    <section className="section">
      <div className="container narrow-content">
        <h1 className="section-heading">Welcome To Your Transformation Journey</h1>
        <p className="section-lede">
          Thank you for placing your trust in IOCE. Your consultation has been successfully reserved.
        </p>

        <Card className="confirmation-card">
          <ConfirmationRow done label={paid ? 'Payment Successful' : 'Request Received'} />
          <ConfirmationRow done label="Consultation Reserved" />
          <ConfirmationRow done={notifications?.email?.sent} label="Confirmation Email Sent" />
          <ConfirmationRow done={notifications?.whatsapp?.sent} label="WhatsApp Confirmation Sent" />
          <ConfirmationRow done label="Consultation Scheduling Link" />
        </Card>

        <Button href="#" variant="primary" className="section-cta">
          Schedule Your Consultation
        </Button>
      </div>
    </section>
  );
}

function ConfirmationRow({ done, label }) {
  return (
    <p className="confirmation-row">
      <span aria-hidden="true">{done ? '✓' : '—'}</span> {label}
    </p>
  );
}
