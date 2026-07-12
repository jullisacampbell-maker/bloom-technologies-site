import { useState } from 'react';
import Hero from '../components/Hero';
import SocialLinks from '../components/SocialLinks';
import SectionTitle from '../components/SectionTitle';
import './Contact.css';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate email service for contact form
    console.log('Contact form:', formData);
    setSubmitted(true);
  };

  return (
    <div className="page-enter">
      <Hero
        headline="Get in Touch"
        subheadline="We'd love to hear from you. Whether you're a family, educator, creator, or potential partner — reach out."
        compact
        showIllustration={false}
      />

      <section className="section">
        <div className="container container--narrow">
          <div className="contact__grid">
            <div className="contact__info">
              <SectionTitle
                label="Contact"
                title="Let's connect"
                align="left"
              />

              <div className="contact__details">
                <div className="contact__detail">
                  <span className="contact__detail-label">Email</span>
                  {/* TODO: Replace with actual business email */}
                  <a href="mailto:hello@bloomtechnologies.com" className="contact__detail-value">
                    hello@bloomtechnologies.com
                  </a>
                </div>
              </div>

              <div className="contact__social">
                <span className="contact__social-label">Follow us</span>
                <SocialLinks />
              </div>
            </div>

            <div className="contact__form-card">
              {submitted ? (
                <div className="contact__success">
                  <span className="contact__success-icon">✉️</span>
                  <h3>Message Sent</h3>
                  <p>Thank you for reaching out. We&apos;ll get back to you soon.</p>
                </div>
              ) : (
                <form className="contact__form" onSubmit={handleSubmit}>
                  <div className="contact__field">
                    <label htmlFor="name" className="contact__label">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="contact__input"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="contact__field">
                    <label htmlFor="email" className="contact__label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="contact__input"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="contact__field">
                    <label htmlFor="message" className="contact__label">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className="contact__textarea"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn--primary contact__submit">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
