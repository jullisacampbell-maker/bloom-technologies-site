import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import { companyValues, companyPrinciples } from '../data/products';
import './About.css';

export default function About() {
  return (
    <div className="page-enter">
      <Hero
        headline="About Bloom Technologies"
        subheadline="We build thoughtful AI-powered software designed to help families organize, learn, and flourish together."
        compact
        showIllustration={false}
      />

      <section className="section">
        <div className="container container--narrow">
          <SectionTitle
            label="Mission"
            title="Reducing the invisible load families carry every day"
          />
          <div className="about__text">
            <p>
              Every day, families juggle an invisible mountain of responsibilities —
              scheduling, planning, remembering, coordinating. This mental load is
              exhausting, and it steals time from what matters most: being present
              with the people you love.
            </p>
            <p>
              Bloom Technologies exists to change that. We build software that
              lightens the load, so parents can spend less time managing life and
              more time living it.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container container--narrow">
          <SectionTitle
            label="Vision"
            title="A world where technology nurtures family life"
          />
          <div className="about__text">
            <p>
              We envision a future where every family has access to technology
              designed with the same care and intention that goes into the best
              products in the world — but built specifically for the beautiful
              complexity of family life.
            </p>
            <p>
              Technology should feel like a warm helper in the background, not
              another demanding voice in an already noisy world.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            label="Values"
            title="What we stand for"
          />
          <div className="about__values">
            {companyValues.map((value) => (
              <div key={value.title} className="about__value-card">
                <h3 className="about__value-title">{value.title}</h3>
                <p className="about__value-text">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--green">
        <div className="container">
          <SectionTitle
            label="Principles"
            title="How we build"
            light
          />
          <div className="about__principles">
            {companyPrinciples.map((principle) => (
              <div key={principle.title} className="about__principle-card">
                <h3 className="about__principle-title">{principle.title}</h3>
                <p className="about__principle-text">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
