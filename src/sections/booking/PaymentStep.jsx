import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import { loadRazorpayScript } from '../../lib/loadRazorpay.js';

const STATUS = {
  CHECKING: 'checking',
  READY: 'ready',
  NOT_CONFIGURED: 'not_configured',
  PROCESSING: 'processing',
  ERROR: 'error',
};

export default function PaymentStep({ lead, leadRecord, onBack, onSuccess }) {
  const [status, setStatus] = useState(STATUS.CHECKING);
  const [errorMessage, setErrorMessage] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/.netlify/functions/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.configured) {
          setFallbackMessage(data.message);
          setStatus(STATUS.NOT_CONFIGURED);
        } else {
          setStatus(STATUS.READY);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage('Could not reach the payment service. Please try again.');
          setStatus(STATUS.ERROR);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePay = async () => {
    setStatus(STATUS.PROCESSING);
    try {
      const orderRes = await fetch('/.netlify/functions/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }).then((res) => res.json());

      if (!orderRes.configured) {
        setFallbackMessage(orderRes.message);
        setStatus(STATUS.NOT_CONFIGURED);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMessage('Could not load the secure payment window. Please check your connection and try again.');
        setStatus(STATUS.ERROR);
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderRes.keyId,
        order_id: orderRes.orderId,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: 'Institute Of Consciousness Engineering',
        description: 'Initial Consultation',
        prefill: { name: lead.fullName, email: lead.email, contact: lead.mobile },
        theme: { color: '#C9A227' },
        handler: async (response) => {
          const verifyRes = await fetch('/.netlify/functions/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              lead,
              leadId: leadRecord?.leadId,
              rowNumber: leadRecord?.rowNumber,
            }),
          }).then((res) => res.json());

          if (verifyRes.verified) {
            onSuccess({ paid: true, notifications: verifyRes.notifications });
          } else {
            setErrorMessage('We could not verify your payment. Please contact us before retrying.');
            setStatus(STATUS.ERROR);
          }
        },
        modal: {
          ondismiss: () => setStatus(STATUS.READY),
        },
      });

      razorpay.open();
    } catch (err) {
      console.error('Payment step failed:', err);
      setErrorMessage('Something went wrong while preparing your payment. Please try again.');
      setStatus(STATUS.ERROR);
    }
  };

  const handleConfirmWithoutPayment = async () => {
    setStatus(STATUS.PROCESSING);
    const result = await fetch('/.netlify/functions/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead, leadId: leadRecord?.leadId, rowNumber: leadRecord?.rowNumber }),
    })
      .then((res) => res.json())
      .catch(() => ({ saved: false }));

    onSuccess({ paid: false, notifications: result.notifications });
  };

  return (
    <div className="payment-step">
      <h3 className="consultation-form__heading">Secure Payment</h3>

      {status === STATUS.CHECKING && <p>Preparing your secure payment&hellip;</p>}

      {status === STATUS.NOT_CONFIGURED && (
        <div className="info-box">
          <p>{fallbackMessage}</p>
          <Button as="button" variant="primary" onClick={handleConfirmWithoutPayment}>
            Confirm Consultation Request
          </Button>
        </div>
      )}

      {(status === STATUS.READY || status === STATUS.PROCESSING) && (
        <>
          <p className="payment-step__trust">🔒 Secure Payment &nbsp; 🔒 SSL Protected &nbsp; 🔒 Razorpay Verified</p>
          <Button as="button" variant="primary" onClick={handlePay} disabled={status === STATUS.PROCESSING}>
            {status === STATUS.PROCESSING ? 'Opening secure checkout…' : 'Proceed to Secure Payment'}
          </Button>
        </>
      )}

      {status === STATUS.ERROR && (
        <div className="info-box info-box--error">
          <p>{errorMessage}</p>
          <Button as="button" variant="secondary" onClick={() => setStatus(STATUS.READY)}>
            Try Again
          </Button>
        </div>
      )}

      <Button as="button" variant="ghost" onClick={onBack} className="payment-step__back">
        Back to summary
      </Button>
    </div>
  );
}
