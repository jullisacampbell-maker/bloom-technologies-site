import { Link } from 'react-router-dom';
import SectionTitle from './SectionTitle';
import './FounderSection.css';

export default function FounderSection({ compact = false }) {
  return (
    <section className={`founder-section section ${compact ? '' : 'section--cream'}`}>
      <div className="container">
        <div className="founder-section__inner">
          <div className="founder-section__portrait">
            <div className="founder-section__portrait-placeholder">
              <span className="founder-section__portrait-icon">👤</span>
              <p>Portrait Placeholder</p>
            </div>
          </div>

          <div className="founder-section__content">
            <SectionTitle
              label="Leadership"
              title="Meet the Founder"
              align="left"
            />

            <div className="founder-section__story">
              <p>
                Jullisa Campbell founded Bloom Technologies after years working in
                healthcare SaaS implementation and customer success.
              </p>
              <p>
                While helping large organizations implement complex technology, she
                realized families deserved software designed with the same level of care.
              </p>
              <p>
                Bloom Technologies was created to build technology around real family life.
              </p>
            </div>

            {!compact && (
              <Link to="/founder" className="btn btn--secondary">
                Read Full Story
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
