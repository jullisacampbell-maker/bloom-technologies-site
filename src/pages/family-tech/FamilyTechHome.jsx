import { Link } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import SectionTitle from '../../components/SectionTitle';
import { BLOOM_MODULES } from '../../data/modules';
import { hasHouseholdData } from '../../services/householdStorage';
import './FamilyTechHome.css';

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Tell Bloom about your household',
    description: 'A welcoming intake captures your people, rhythms, learning, meals, movement, and goals — not a medical form, just your real life.',
  },
  {
    step: '2',
    title: 'Receive your Bloom Forecast',
    description: 'Bloom uses your responses to recommend modules, priorities, and a starter rhythm tailored to your family\'s capacity.',
  },
  {
    step: '3',
    title: 'Live your rhythm in Bloom Home',
    description: 'Your personalized dashboard connects learning, meals, movement, wellness, and home responsibilities in one adaptive system.',
  },
];

export default function FamilyTechHome() {
  const hasData = hasHouseholdData();

  return (
    <FamilyTechLayout variant="marketing">
      <section className="fth-hero">
        <div className="container fth-hero__inner">
          <div className="fth-hero__content">
            <span className="badge badge--founder">Bloom Family Tech</span>
            <h1 className="fth-hero__headline">
              Your family doesn&apos;t need another complicated planner.
            </h1>
            <p className="fth-hero__sub">
              Bloom turns the life you already have into a rhythm that works — organizing learning, meals, movement, wellness, schedules, and home responsibilities in one adaptive system.
            </p>
            <div className="fth-hero__actions">
              <Link to={hasData ? '/family-tech/home' : '/family-tech/intake'} className="btn btn--primary">
                {hasData ? 'Go to Bloom Home' : 'Get Your Bloom Forecast'}
              </Link>
              <Link to="/family-tech/build-your-bloom-school" className="btn btn--secondary">
                Explore Build Your Bloom School
              </Link>
            </div>
          </div>
          <div className="fth-hero__preview" aria-label="Bloom Home preview">
            <div className="fth-preview-card">
              <div className="fth-preview-card__header">
                <span>🌿 Bloom Home</span>
                <span className="fth-preview-card__date">Today</span>
              </div>
              <div className="fth-preview-card__focus">
                <strong>Today&apos;s focus</strong>
                <p>Learning rhythm & meal planning</p>
              </div>
              <div className="fth-preview-card__rhythm">
                <div className="fth-preview-card__block"><span>8:30</span> Breakfast</div>
                <div className="fth-preview-card__block fth-preview-card__block--active"><span>9:30</span> Teacher-time</div>
                <div className="fth-preview-card__block"><span>12:00</span> Lunch & movement</div>
                <div className="fth-preview-card__block"><span>6:30</span> Family dinner</div>
              </div>
              <div className="fth-preview-card__modules">
                <span>📚 Academy</span>
                <span>🍽️ Meals</span>
                <span>🏃 Athletics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <SectionTitle
            label="How Bloom Works"
            title="Three steps to your family rhythm"
            subtitle="Bloom doesn't replace your life — it organizes what you already have."
          />
          <div className="fth-steps">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="fth-step">
                <span className="fth-step__number">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            label="The Bloom Ecosystem"
            title="Bloom OS and four modules"
            subtitle="One intelligence layer connecting everything your family needs."
          />
          <div className="fth-modules">
            <div className="fth-modules__os">
              <span className="fth-modules__os-icon" aria-hidden="true">{BLOOM_MODULES['bloom-os'].icon}</span>
              <h3>{BLOOM_MODULES['bloom-os'].name}</h3>
              <p>{BLOOM_MODULES['bloom-os'].description}</p>
            </div>
            <div className="fth-modules__grid">
              {['academy', 'athletics', 'family-fit', 'meals'].map((id) => {
                const mod = BLOOM_MODULES[id];
                return (
                  <div key={id} className="fth-module-item">
                    <span aria-hidden="true">{mod.icon}</span>
                    <h4>{mod.name}</h4>
                    <p>{mod.tagline}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream" id="build-your-bloom-school">
        <div className="container">
          <div className="fth-school-teaser">
            <div>
              <span className="badge badge--founder">Founding-family beta</span>
              <h2 className="fth-school-teaser__title">Build Your Bloom School</h2>
              <p className="fth-school-teaser__desc">
                Bloom reviews what your family already has, identifies gaps, recommends free resources where appropriate, and creates a realistic school system around your capacity — not someone else&apos;s ideal.
              </p>
              <Link to="/family-tech/build-your-bloom-school" className="btn btn--primary">
                Learn about the founding offer
              </Link>
            </div>
            <div className="fth-school-teaser__price">
              <span className="fth-school-teaser__price-now">$147</span>
              <span className="fth-school-teaser__price-was">Future value $497</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            label="Founding Family Creator Program"
            title="For selected homeschool creators"
            subtitle="Honest documented participation and affiliate partnership — not required positive reviews."
          />
          <p className="fth-creator-text">
            We&apos;re inviting a small group of homeschool creators to participate in our founding beta with transparent documentation of their experience. If you create content for homeschooling families and want to explore an honest affiliate partnership, we&apos;d love to hear from you.
          </p>
          <Link to="/contact" className="btn btn--secondary">Inquire about the creator program</Link>
        </div>
      </section>

      <section className="section section--green">
        <div className="container fth-trust">
          <SectionTitle
            label="Family Privacy"
            title="Your family's data stays yours"
            subtitle="Bloom is built with privacy by design. Your household information powers your forecast locally in this prototype — never sold, never shared."
            light
          />
          <ul className="fth-trust__list">
            <li>No selling family data</li>
            <li>Transparent about how recommendations are made</li>
            <li>Built for real families, not data harvesting</li>
            <li>You control your information</li>
          </ul>
        </div>
      </section>

      <section className="section fth-final-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="fth-final-cta__title">Ready to see your family&apos;s rhythm?</h2>
          <p className="fth-final-cta__desc">Start with a free Bloom Forecast — no account required for this prototype.</p>
          <Link to="/family-tech/intake" className="btn btn--primary">Get Your Bloom Forecast</Link>
        </div>
      </section>
    </FamilyTechLayout>
  );
}
