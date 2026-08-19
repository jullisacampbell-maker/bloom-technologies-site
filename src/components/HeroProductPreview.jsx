import './HeroProductPreview.css';

const MODULES = [
  { id: 'academy', name: 'Bloom Academy', short: 'Academy', icon: '📚' },
  { id: 'meals', name: 'Bloom Meals', short: 'Meals', icon: '🍽' },
  { id: 'athletics', name: 'Bloom Athletics', short: 'Athletics', icon: '⚡' },
  { id: 'family-fit', name: 'Bloom Family Fit', short: 'Family Fit', icon: '💪' },
];

export default function HeroProductPreview() {
  return (
    <div className="hero-preview" aria-hidden="true">
      <div className="hero-preview__frame">
        <div className="hero-preview__grid">
          <div className="hero-preview__module hero-preview__module--academy">
            <span className="hero-preview__module-icon">{MODULES[0].icon}</span>
            <span className="hero-preview__module-name">{MODULES[0].short}</span>
          </div>

          <div className="hero-preview__module hero-preview__module--meals">
            <span className="hero-preview__module-icon">{MODULES[1].icon}</span>
            <span className="hero-preview__module-name">{MODULES[1].short}</span>
          </div>

          <div className="hero-preview__home">
            <div className="hero-preview__home-chrome">
              <div className="hero-preview__home-brand">
                <span className="hero-preview__home-mark">🌿</span>
                <span>Bloom Home</span>
              </div>
              <span className="hero-preview__home-pill">Today</span>
            </div>
            <div className="hero-preview__home-body">
              <p className="hero-preview__home-label">Today&apos;s focus</p>
              <p className="hero-preview__home-focus">Learning · Meals · Movement</p>
              <div className="hero-preview__home-blocks">
                <div className="hero-preview__block">
                  <span>Morning rhythm</span>
                  <span className="hero-preview__block-bar" />
                </div>
                <div className="hero-preview__block">
                  <span>Afternoon plans</span>
                  <span className="hero-preview__block-bar hero-preview__block-bar--mid" />
                </div>
                <div className="hero-preview__block">
                  <span>Evening wrap-up</span>
                  <span className="hero-preview__block-bar hero-preview__block-bar--short" />
                </div>
              </div>
            </div>
          </div>

          <div className="hero-preview__module hero-preview__module--athletics">
            <span className="hero-preview__module-icon">{MODULES[2].icon}</span>
            <span className="hero-preview__module-name">{MODULES[2].short}</span>
          </div>

          <div className="hero-preview__module hero-preview__module--family-fit">
            <span className="hero-preview__module-icon">{MODULES[3].icon}</span>
            <span className="hero-preview__module-name">{MODULES[3].short}</span>
          </div>
        </div>

        <div className="hero-preview__connectors" aria-hidden="true">
          <span className="hero-preview__connector hero-preview__connector--tl" />
          <span className="hero-preview__connector hero-preview__connector--tr" />
          <span className="hero-preview__connector hero-preview__connector--bl" />
          <span className="hero-preview__connector hero-preview__connector--br" />
        </div>

        <p className="hero-preview__os">Powered by Bloom OS</p>
      </div>
    </div>
  );
}
