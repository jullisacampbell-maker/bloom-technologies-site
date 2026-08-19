import { Link } from 'react-router-dom';
import SectionTitle from './SectionTitle';
import './FounderSection.css';

export default function FounderSection({ compact = false }) {
  return (
    <section id="founder" className={`founder-section section ${compact ? '' : 'section--cream'}`}>
      <div className="container">
        <div className="founder-section__inner">
          <div className="founder-section__portrait">
            <div className="founder-section__portrait-frame">
              <img
                src="/assets/founder-cartoon.png"
                alt="Jullisa Campbell, Founder of Bloom Technologies"
                className="founder-section__portrait-img"
                width={2057}
                height={764}
              />
            </div>
          </div>

          <div className="founder-section__content">
            <SectionTitle
              label="Founder"
              title="Jullisa Campbell"
              subtitle="Founder, Bloom Technologies"
              align="left"
            />

            <div className="founder-section__story">
              <p>
                Bloom was created from the experience of managing real family life — homeschooling,
                schedules, wellness, meals, household responsibilities, and the mental load of
                keeping everything connected.
              </p>
              <p>
                Bloom Technologies builds technology from lived family workflow, not generic
                productivity assumptions. The goal is intelligent tools that reduce decisions
                and help households learn, plan, move, eat, and thrive together.
              </p>
            </div>

            {!compact && (
              <Link to="/founder" className="btn btn--secondary">
                Read Founder Story →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
