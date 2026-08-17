import { Link } from 'react-router-dom';
import FamilyTechLayout from '../../components/family-tech/FamilyTechLayout';
import { BUILD_YOUR_BLOOM_SCHOOL_DELIVERABLES } from '../../data/modules';
import './BuildYourBloomSchool.css';

export default function BuildYourBloomSchool() {
  return (
    <FamilyTechLayout variant="marketing">
      <section className="bys-hero">
        <div className="container container--narrow">
          <span className="badge badge--founder">Guided founding-family beta</span>
          <h1 className="bys-hero__title">Build Your Bloom School</h1>
          <p className="bys-hero__desc">
            A personalized service that reviews what your family already has, identifies gaps, recommends free resources where appropriate, and creates a realistic school system around your capacity — not a generic curriculum package.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <h2 className="bys-section-title">What you receive</h2>
          <ul className="bys-deliverables">
            {BUILD_YOUR_BLOOM_SCHOOL_DELIVERABLES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <div className="bys-pricing">
            <div className="bys-pricing__card">
              <span className="bys-pricing__badge">Limited founding families</span>
              <div className="bys-pricing__amount">
                <span className="bys-pricing__now">$147</span>
                <span className="bys-pricing__future">Future value $497</span>
              </div>
              <p className="bys-pricing__note">
                This is a guided founding-family beta — not a self-serve download. Bloom works with your household directly to build something that fits your real life.
              </p>
              <Link to="/contact" className="btn btn--primary">Request a founding-family spot</Link>
            </div>
            <div className="bys-pricing__details">
              <h3>How it works</h3>
              <ol>
                <li>Complete your household intake (or share what you already know)</li>
                <li>Bloom reviews your curriculum, resources, and family rhythm</li>
                <li>Receive a four-week implementation-ready plan with free-resource recommendations</li>
                <li>Follow up with an adjustment session after your first week</li>
              </ol>
              <p className="bys-pricing__capacity">
                Bloom identifies gaps honestly — including places where free resources fill the need — so you&apos;re not buying what you don&apos;t need.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <h2 className="bys-section-title">Not ready for the full service?</h2>
          <p className="bys-alt-text">
            Start with a free Bloom Forecast to see module recommendations and a starter rhythm for your household — no payment required for the prototype.
          </p>
          <div className="bys-alt-actions">
            <Link to="/family-tech/intake" className="btn btn--primary">Get Your Bloom Forecast</Link>
            <Link to="/family-tech" className="btn btn--secondary">Back to homepage</Link>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container container--narrow">
          <h2 className="bys-section-title">Homeschool creator program</h2>
          <p className="bys-alt-text">
            Selected small homeschool creators are invited to participate in our founding beta with honest documented participation and affiliate partnership. We value transparency — not required positive reviews.
          </p>
          <Link to="/contact" className="btn btn--secondary">Inquire about the creator program</Link>
        </div>
      </section>
    </FamilyTechLayout>
  );
}
