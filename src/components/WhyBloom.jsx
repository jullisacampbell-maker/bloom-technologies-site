import SectionTitle from './SectionTitle';
import './WhyBloom.css';

export default function WhyBloom() {
  return (
    <section id="vision" className="why-bloom section section--navy">
      <div className="container container--narrow">
        <SectionTitle
          label="Why Bloom Exists"
          title="Families don't need more disconnected tools."
          light
        />
        <div className="why-bloom__content">
          <p>
            Families already use dozens of tools, calendars, apps, curricula, lists, and routines.
          </p>
          <p>
            The problem is not always access to more tools.
          </p>
          <p className="why-bloom__emphasis">
            The problem is making everything work together.
          </p>
          <p>
            Bloom Technologies is building technology that understands the household as a connected system.
          </p>
        </div>
      </div>
    </section>
  );
}
