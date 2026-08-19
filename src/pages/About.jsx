import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import Principles from '../components/Principles';
import WhyBloom from '../components/WhyBloom';
import './About.css';

export default function About() {
  return (
    <div className="page-enter">
      <Hero
        eyebrow="ABOUT"
        headline="About Bloom Technologies"
        subheadline="We build intelligent family technology that understands the household as a connected system — not a collection of disconnected apps."
        compact
        showIllustration={false}
      />

      <section className="section">
        <div className="container container--narrow">
          <SectionTitle
            label="Company"
            title="A family-technology company"
          />
          <div className="about__text">
            <p>
              Bloom Technologies is the parent company behind Bloom Family Tech — the customer-facing
              platform powered by Bloom OS. We build technology around real family life: learning,
              meals, movement, wellness, schedules, and household responsibilities.
            </p>
            <p>
              Our work starts from lived workflow — homeschooling rhythms, meal planning, daily
              movement, and the mental load of keeping it all connected — not from generic
              productivity assumptions.
            </p>
          </div>
        </div>
      </section>

      <WhyBloom />

      <section className="section section--cream">
        <div className="container container--narrow">
          <SectionTitle
            label="Vision"
            title="Technology that works together for families"
          />
          <div className="about__text">
            <p>
              We envision a future where family technology feels like a thoughtful helper in the
              background — coordinating what matters, reducing decisions, and adapting when life
              changes.
            </p>
            <p>
              Bloom OS connects the ecosystem. Bloom Home gives families a daily command center.
              Bloom Academy, Bloom Meals, Bloom Athletics, and Bloom Family Fit serve the distinct
              rhythms of real household life.
            </p>
          </div>
        </div>
      </section>

      <Principles />
    </div>
  );
}
