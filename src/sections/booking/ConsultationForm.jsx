import { useState } from 'react';
import Button from '../../components/Button.jsx';
import { HELP_TOPICS } from '../../lib/constants.js';

const EMPTY_FORM = {
  fullName: '',
  mobile: '',
  email: '',
  city: '',
  country: '',
  consultationMode: 'Online',
  helpWith: '',
  preferredTime: '',
};

export default function ConsultationForm({ initialValues, onSubmit }) {
  const [values, setValues] = useState(initialValues || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const addTopic = (topic) => {
    setValues((v) => ({
      ...v,
      helpWith: v.helpWith ? `${v.helpWith}, ${topic}` : topic,
    }));
  };

  const validate = () => {
    const next = {};
    if (!values.fullName.trim()) next.fullName = 'Please enter your full name.';
    if (!/^[\d+\s-]{7,15}$/.test(values.mobile.trim())) next.mobile = 'Please enter a valid mobile number.';
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = 'Please enter a valid email address.';
    if (!values.city.trim()) next.city = 'Please enter your city.';
    if (!values.helpWith.trim()) next.helpWith = 'Please share what you would like help with.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(values);
  };

  return (
    <form className="consultation-form" onSubmit={handleSubmit} noValidate>
      <h3 className="consultation-form__heading">Begin Your Transformation Journey</h3>
      <p className="consultation-form__lede">
        Every meaningful transformation begins with a single conscious decision. Complete the
        consultation request below and we&rsquo;ll guide you through the next steps.
      </p>

      <div className="form-grid">
        <Field label="Full Name" error={errors.fullName}>
          <input type="text" value={values.fullName} onChange={update('fullName')} autoComplete="name" required />
        </Field>
        <Field label="Mobile Number" error={errors.mobile}>
          <input type="tel" value={values.mobile} onChange={update('mobile')} autoComplete="tel" required />
        </Field>
        <Field label="Email Address" error={errors.email}>
          <input type="email" value={values.email} onChange={update('email')} autoComplete="email" required />
        </Field>
        <Field label="City" error={errors.city}>
          <input type="text" value={values.city} onChange={update('city')} autoComplete="address-level2" required />
        </Field>
        <Field label="Country (optional)">
          <input type="text" value={values.country} onChange={update('country')} autoComplete="country-name" />
        </Field>
        <Field label="Preferred Date / Time (optional)">
          <input type="text" placeholder="e.g. Weekday evenings" value={values.preferredTime} onChange={update('preferredTime')} />
        </Field>
      </div>

      <fieldset className="form-fieldset">
        <legend>Preferred Consultation Mode</legend>
        <label className="radio-option">
          <input
            type="radio"
            name="consultationMode"
            value="Online"
            checked={values.consultationMode === 'Online'}
            onChange={update('consultationMode')}
          />
          Online
        </label>
        <label className="radio-option">
          <input
            type="radio"
            name="consultationMode"
            value="Exclusive In-Person at Your Premises"
            checked={values.consultationMode === 'Exclusive In-Person at Your Premises'}
            onChange={update('consultationMode')}
          />
          Exclusive In-Person at Your Premises
        </label>
      </fieldset>

      <Field label="What would you like help with?" error={errors.helpWith}>
        <textarea rows={3} value={values.helpWith} onChange={update('helpWith')} required />
      </Field>

      <div className="topic-chips" role="group" aria-label="Example topics">
        {HELP_TOPICS.map((topic) => (
          <button type="button" key={topic} className="topic-chip" onClick={() => addTopic(topic)}>
            {topic}
          </button>
        ))}
      </div>

      <Button as="button" type="submit" variant="primary" className="consultation-form__submit">
        Continue
      </Button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      {children}
      {error && (
        <span className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
