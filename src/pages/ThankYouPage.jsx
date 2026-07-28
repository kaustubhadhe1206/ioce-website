import { useLocation } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

export default function ThankYouPage() {
  const { state } = useLocation();

  if (!state) {
    return (
      <section className="section">
        <div className="container narrow-content">
          <h1 className="section-heading">Welcome To Your Transformation Journey</h1>
          <p>If you&rsquo;ve just completed a booking, check your email for confirmation details.</p>
          <Button to="/" variant="primary">
            Return Home
          </Button>
        </div>
      </section>
    );
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
