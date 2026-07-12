import { useState } from 'react';
import SectionTitle from './SectionTitle';
import './WaitlistForm.css';

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    childrenCount: '',
    childrenAges: '',
    biggestChallenge: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate email service (e.g., Mailchimp, ConvertKit, Resend)
    // TODO: Store form submissions in database or CRM
    console.log('Founding Family signup:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="founding-family" className="waitlist section">
        <div className="container container--narrow">
          <div className="waitlist__card waitlist__card--success">
            <div className="waitlist__success-icon">🌿</div>
            <h2 className="waitlist__success-title">Welcome to the Family</h2>
            <p className="waitlist__success-text">
              Thank you for joining us as a Founding Family. We&apos;ll be in touch
              soon with updates on our journey.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="founding-family" className="waitlist section">
      <div className="container container--narrow">
        <div className="waitlist__card">
          <SectionTitle
            label="Join Us"
            title="Become a Founding Family"
            subtitle="Be among the first families to experience Bloom. Share a little about your family and we'll keep you updated on our progress."
          />

          <form className="waitlist__form" onSubmit={handleSubmit}>
            <div className="waitlist__field">
              <label htmlFor="firstName" className="waitlist__label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="waitlist__input"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="waitlist__field">
              <label htmlFor="email" className="waitlist__label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="waitlist__input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="waitlist__row">
              <div className="waitlist__field">
                <label htmlFor="childrenCount" className="waitlist__label">How many children?</label>
                <select
                  id="childrenCount"
                  name="childrenCount"
                  className="waitlist__input"
                  value={formData.childrenCount}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="0">None yet</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>

              <div className="waitlist__field">
                <label htmlFor="childrenAges" className="waitlist__label">Children&apos;s ages</label>
                <input
                  type="text"
                  id="childrenAges"
                  name="childrenAges"
                  className="waitlist__input"
                  placeholder="e.g., 3, 7, 12"
                  value={formData.childrenAges}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="waitlist__field">
              <label htmlFor="biggestChallenge" className="waitlist__label">Biggest challenge at home</label>
              <textarea
                id="biggestChallenge"
                name="biggestChallenge"
                className="waitlist__textarea"
                rows={3}
                placeholder="What's the hardest part of managing family life?"
                value={formData.biggestChallenge}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn--primary waitlist__submit">
              Become a Founding Family
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
