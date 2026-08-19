import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import { productUrls } from '../data/ecosystem';
import './Founder.css';

export default function Founder() {
  return (
    <div className="page-enter">
      <Hero
        eyebrow="FOUNDER"
        headline="Jullisa Campbell"
        subheadline="Founder, Bloom Technologies"
        compact
        showIllustration={false}
      />

      <section className="section">
        <div className="container">
          <div className="founder-page__inner">
            <div className="founder-page__portrait">
              <img
                src="/assets/founder-cartoon.png"
                alt="Jullisa Campbell, Founder of Bloom Technologies"
                className="founder-page__portrait-img"
                width={400}
                height={533}
              />
            </div>

            <div className="founder-page__bio">
              <SectionTitle
                label="Founder Story"
                title="Built from real family life"
                align="left"
              />

              <div className="founder-page__story">
                <p>
                  Bloom was created from the experience of managing real family life — homeschooling,
                  schedules, wellness, meals, household responsibilities, and the mental load of
                  keeping everything connected.
                </p>
                <p>
                  After years building software in healthcare technology, Jullisa Campbell saw the
                  gap between enterprise-grade systems and the tools available to families managing
                  daily life. Bloom Technologies exists to close that gap with technology built from
                  lived family workflow rather than generic productivity assumptions.
                </p>
                <p>
                  The company is credible, warm, and ambitious — building intelligent tools that
                  help households learn, plan, move, eat, and thrive together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container container--narrow">
          <SectionTitle title="Why Bloom Technologies exists" />
          <div className="founder-page__story">
            <p>
              Families already use dozens of tools, calendars, apps, curricula, lists, and routines.
              The problem is not always access to more tools — it is making everything work together.
            </p>
            <p>
              Bloom Technologies is building technology that understands the household as a connected
              system: Bloom Family Tech as the customer platform, Bloom OS as the intelligence layer,
              and Bloom Home plus specialized modules for the rhythms of everyday family life.
            </p>
          </div>

          <div className="founder-page__signature">
            <p>— Jullisa Campbell</p>
            <p>Founder, Bloom Technologies</p>
          </div>
        </div>
      </section>

      <section className="founder-page__quote section">
        <div className="container container--narrow">
          <blockquote className="founder-page__quote-block">
            <p>
              Technology should be built from how families actually live —
              not from assumptions about how they ought to.
            </p>
            <footer>— Jullisa Campbell</footer>
          </blockquote>
          <div className="founder-page__actions">
            <Link to="/contact" className="btn btn--primary">
              Get in Touch
            </Link>
            <a
              href={productUrls.familyTech}
              className="btn btn--secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Bloom Family Tech →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
