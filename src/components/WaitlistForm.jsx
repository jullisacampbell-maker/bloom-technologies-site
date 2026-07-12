import { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from './SectionTitle';
import SocialLinks from './SocialLinks';
import {
  foundingFamilyBenefits,
  foundingFamilySuccessBenefits,
  familyTypeOptions,
  productInterestOptions,
  betaTesterOptions,
  initialFoundingFamilyForm,
} from '../data/foundingFamily';
import { submitFoundingFamily } from '../services/foundingFamilySubmission';
import './WaitlistForm.css';

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFoundingFamilyForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitFoundingFamily(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="founding-family" className="waitlist section">
        <div className="container container--narrow">
          <div className="waitlist__card waitlist__card--success">
            <h2 className="waitlist__success-title">🎉 Welcome to the Bloom Family!</h2>
            <p className="waitlist__success-lead">
              You&apos;re officially one of our Founding Families.
            </p>
            <p className="waitlist__success-text">
              Your feedback will directly influence what we build, and you&apos;ll receive
              occasional founder updates along the way.
            </p>

            <ul className="waitlist__success-benefits">
              {foundingFamilySuccessBenefits.map((benefit) => (
                <li key={benefit}>
                  <span className="waitlist__benefit-check" aria-hidden="true">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="waitlist__success-actions">
              <Link to="/products" className="btn btn--primary">
                Continue Exploring
              </Link>
              <a href="#follow-bloom" className="btn btn--secondary">
                Follow Bloom
              </a>
            </div>

            <div id="follow-bloom" className="waitlist__success-social">
              <SocialLinks />
            </div>
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
          />

          <div className="waitlist__intro">
            <p className="waitlist__intro-lead">
              Help shape the future of family technology.
            </p>
            <p className="waitlist__intro-text">
              We&apos;re building Bloom alongside real families—not assumptions. Join early
              to influence what we build, receive behind-the-scenes updates, and get first
              access to Bloom HQ, Bloom Academy, and Bloom Buds before public launch.
            </p>
          </div>

          <ul className="waitlist__benefits">
            {foundingFamilyBenefits.map((benefit) => (
              <li key={benefit} className="waitlist__benefit">
                <span className="waitlist__benefit-check" aria-hidden="true">✓</span>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="waitlist__form-intro">
            <p className="waitlist__form-intro-lead">
              Your responses directly influence what we build next.
            </p>
            <p className="waitlist__form-intro-note">This takes about 2 minutes.</p>
          </div>

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

            <div className="waitlist__field">
              <label htmlFor="familyType" className="waitlist__label">
                Which best describes your family?
              </label>
              <select
                id="familyType"
                name="familyType"
                className="waitlist__input"
                value={formData.familyType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {familyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="waitlist__fieldset">
              <legend className="waitlist__label">
                Which Bloom product interests you most?
              </legend>
              <div className="waitlist__radio-cards">
                {productInterestOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`waitlist__radio-card ${formData.productInterest === option.value ? 'waitlist__radio-card--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="productInterest"
                      value={option.value}
                      checked={formData.productInterest === option.value}
                      onChange={handleChange}
                      className="waitlist__radio-input"
                    />
                    <span className="waitlist__radio-card-name">{option.label}</span>
                    <span className="waitlist__radio-card-desc">{option.description}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="waitlist__field">
              <label htmlFor="oneThing" className="waitlist__label">
                If Bloom could solve ONE problem for your family, what would it be?
              </label>
              <textarea
                id="oneThing"
                name="oneThing"
                className="waitlist__textarea"
                rows={3}
                placeholder="Tell us what would make the biggest difference..."
                value={formData.oneThing}
                onChange={handleChange}
              />
            </div>

            <fieldset className="waitlist__fieldset">
              <legend className="waitlist__label">
                Would you like to test new features before public release?
              </legend>
              <div className="waitlist__radio-group">
                {betaTesterOptions.map((option) => (
                  <label key={option.value} className="waitlist__radio-option">
                    <input
                      type="radio"
                      name="betaTester"
                      value={option.value}
                      checked={formData.betaTester === option.value}
                      onChange={handleChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="waitlist__checkbox">
              <input
                type="checkbox"
                name="emailUpdates"
                checked={formData.emailUpdates}
                onChange={handleChange}
              />
              <span>I&apos;d like occasional founder updates.</span>
            </label>

            <button type="submit" className="btn btn--primary waitlist__submit">
              Become a Founding Family
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
