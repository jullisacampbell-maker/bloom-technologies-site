import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import './Founder.css';

export default function Founder() {
  return (
    <div className="page-enter">
      <Hero
        headline="Jullisa Campbell"
        subheadline="Founder & CEO, Bloom Technologies"
        compact
        showIllustration={false}
      />

      <section className="section">
        <div className="container">
          <div className="founder-page__inner">
            <div className="founder-page__portrait">
              <div className="founder-page__portrait-placeholder">
                <span>👤</span>
                <p>Professional Photography Placeholder</p>
              </div>
            </div>

            <div className="founder-page__bio">
              <SectionTitle
                label="Founder Story"
                title="From healthcare technology to family technology"
                align="left"
              />

              <div className="founder-page__story">
                <p>
                  Jullisa Campbell spent years in healthcare SaaS — implementing
                  complex technology systems for large organizations and guiding
                  teams through digital transformation. It was meaningful work,
                  but something was missing.
                </p>
                <p>
                  While helping enterprises navigate technology, she noticed that
                  families — the most important organizations of all — were left
                  behind. The software available to parents was fragmented,
                  overwhelming, or simply not designed with family life in mind.
                </p>
                <p>
                  She saw parents drowning in mental load, juggling apps that
                  didn&apos;t talk to each other, and spending more time managing
                  tools than enjoying time with their children. The same level of
                  care she brought to healthcare implementations, families deserved
                  in their daily lives.
                </p>
                <p>
                  Bloom Technologies was born from that realization — a company
                  dedicated to building thoughtful AI-powered software that helps
                  families organize, learn, and flourish together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container container--narrow">
          <SectionTitle
            label="Philosophy"
            title="Building technology around real family life"
          />
          <div className="founder-page__philosophy">
            <p>
              Bloom isn&apos;t just a company — it&apos;s a belief that families
              deserve better. Better tools, better design, better technology that
              understands the rhythms of home life.
            </p>
            <p>
              Every product we build starts with listening: to parents, to
              educators, to children. We design for the messy, beautiful,
              unpredictable reality of family life — not the sterile version
              software companies usually imagine.
            </p>
            <p>
              Our mission is simple: reduce the invisible load, so families can
              focus on what matters most.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
