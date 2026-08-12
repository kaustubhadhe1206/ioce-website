// feePaise for 'paid45' must stay in sync with CONSULTATION_FEE_PAISE in
// netlify/functions/_lib/config.mjs — that's what Razorpay actually charges;
// this copy is display-only.
export const CONSULTATION_PLANS = [
  {
    id: 'free15',
    label: '15-Minute Discovery Call',
    duration: '15 minutes',
    feeDisplay: 'Free',
    feePaise: 0,
    description: 'A focused introductory call to understand your goals and see if IOCE is the right fit.',
  },
  {
    id: 'paid45',
    label: '45-Minute Consultation',
    duration: '45 minutes',
    feeDisplay: '₹99',
    feePaise: 9900,
    description: 'An in-depth consultation personally conducted by Grand Master Prashant.',
  },
];

export const HELP_TOPICS = [
  'Stress',
  'Anxiety',
  'Confidence',
  'Career',
  'Relationships',
  'Emotional Healing',
  'Personal Growth',
  'Peak Performance',
  'Corporate Coaching',
  'Leadership',
];
