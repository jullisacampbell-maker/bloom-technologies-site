import SectionTitle from './SectionTitle';
import { companyPrinciples } from '../data/ecosystem';
import './Principles.css';

export default function Principles() {
  return (
    <section className="principles section">
      <div className="container">
        <SectionTitle
          label="Principles"
          title="How we build family technology"
          subtitle="Premium technology should feel purposeful — not performative."
        />
        <div className="principles__grid">
          {companyPrinciples.map((principle) => (
            <article key={principle.title} className="principles__card">
              <h3 className="principles__title">{principle.title}</h3>
              <p className="principles__text">{principle.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
