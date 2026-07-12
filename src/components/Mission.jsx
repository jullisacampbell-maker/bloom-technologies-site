import SectionTitle from './SectionTitle';
import './Mission.css';

export default function Mission() {
  return (
    <section className="mission section section--cream">
      <div className="container container--narrow">
        <SectionTitle
          label="Our Mission"
          title="Technology should simplify family life—not complicate it."
        />

        <div className="mission__content">
          <div className="mission__card">
            <div className="mission__card-icon">💭</div>
            <h3 className="mission__card-title">The Invisible Load</h3>
            <p className="mission__card-text">
              Families carry an invisible mental load every single day — remembering
              appointments, planning meals, tracking schedules, managing routines.
              It&apos;s exhausting, and it&apos;s largely unseen.
            </p>
          </div>

          <div className="mission__card">
            <div className="mission__card-icon">⏳</div>
            <h3 className="mission__card-title">More Living, Less Managing</h3>
            <p className="mission__card-text">
              Parents deserve to spend less time managing life and more time living it.
              Bloom Technologies exists to reduce that burden — so families can focus
              on connection, growth, and the moments that matter.
            </p>
          </div>

          <div className="mission__card">
            <div className="mission__card-icon">✨</div>
            <h3 className="mission__card-title">Thoughtful by Design</h3>
            <p className="mission__card-text">
              We believe technology should feel like a gentle helper, not another
              thing to manage. Every product we build is designed with care,
              intention, and deep respect for the families who will use it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
