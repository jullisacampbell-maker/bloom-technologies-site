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
                title="My Story"
                align="left"
              />

              <div className="founder-page__story">
                <p>
                  I didn&apos;t start Bloom because I had a brilliant business idea.
                </p>
                <p>
                  I started Bloom because I was overwhelmed.
                </p>
                <p>
                  After years building software in healthcare technology, I came home
                  every day to a completely different kind of challenge—running a family.
                </p>
                <p>
                  I was managing meals, homeschool lessons, doctor&apos;s appointments,
                  household chores, grocery lists, routines, finances, activities,
                  birthdays, and a thousand tiny details that somehow always lived in my head.
                </p>
                <p>
                  There wasn&apos;t one place that helped me manage it all.
                </p>
                <p>
                  I wasn&apos;t looking for another calendar.
                </p>
                <p>
                  I wasn&apos;t looking for another to-do list.
                </p>
                <p>
                  I was looking for something that actually understood how families work.
                </p>
                <p>
                  Nothing existed.
                </p>
                <p>
                  So I decided to build it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container container--narrow">
          <SectionTitle
            title="Bloom Began With My Own Family"
          />
          <div className="founder-page__story">
            <p>
              I&apos;m a wife.
            </p>
            <p>
              I&apos;m a mom.
            </p>
            <p>
              I&apos;m a homeschool teacher.
            </p>
            <p>
              I&apos;m someone who understands what it feels like to carry the invisible
              mental load that so many parents experience every day.
            </p>
            <p>
              Bloom wasn&apos;t designed in a boardroom.
            </p>
            <p>
              It was designed at my kitchen table.
            </p>
            <p>
              Between homeschooling lessons.
            </p>
            <p>
              Between making dinner.
            </p>
            <p>
              Between bedtime routines.
            </p>
            <p>
              Between trying to remember one more thing that couldn&apos;t be forgotten.
            </p>
            <p>
              Every feature begins with a real problem I&apos;ve experienced—or one another
              family has shared with me.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionTitle
            title="Why Bloom Technologies Exists"
          />
          <div className="founder-page__story">
            <p>
              I believe technology should make family life simpler—not more complicated.
            </p>
            <p>
              It should reduce stress.
            </p>
            <p>
              Create clarity.
            </p>
            <p>
              Give parents more confidence.
            </p>
            <p>
              Help children thrive.
            </p>
            <p>
              And give families back something that&apos;s becoming increasingly rare:
            </p>
            <p>
              Time together.
            </p>
            <p>
              That&apos;s why I created Bloom Technologies.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container container--narrow">
          <SectionTitle
            title="We're Building This Together"
          />
          <div className="founder-page__story">
            <p>
              Bloom isn&apos;t just software.
            </p>
            <p>
              It&apos;s a long-term mission to build thoughtful technology for modern families.
            </p>
            <p>
              Bloom HQ helps organize home life.
            </p>
            <p>
              Bloom Academy helps personalize homeschooling.
            </p>
            <p>
              Bloom Buds creates interactive learning experiences for children.
            </p>
            <p>
              And this is only the beginning.
            </p>
            <p>
              If you&apos;re here before launch, you&apos;re helping shape everything that comes next.
            </p>
            <p>
              You&apos;re not just joining a waitlist.
            </p>
            <p>
              You&apos;re becoming part of the story.
            </p>
            <p>
              Welcome to Bloom.
            </p>
          </div>

          <div className="founder-page__signature">
            <p>— Jullisa Campbell</p>
            <p>Founder &amp; CEO</p>
            <p>Bloom Technologies</p>
          </div>
        </div>
      </section>

      <section className="founder-page__quote section">
        <div className="container container--narrow">
          <blockquote className="founder-page__quote-block">
            <p>
              I wasn&apos;t building software for someone else.
              <br />
              I was building the technology I desperately needed.
            </p>
            <footer>— Jullisa Campbell</footer>
          </blockquote>
        </div>
      </section>
    </div>
  );
}
