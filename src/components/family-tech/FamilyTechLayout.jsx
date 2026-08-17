import { Link } from 'react-router-dom';
import './FamilyTechLayout.css';

export default function FamilyTechLayout({
  children,
  variant = 'app',
  showNav = true,
}) {
  return (
    <div className={`ft-layout ft-layout--${variant}`}>
      {showNav && (
        <header className="ft-nav">
          <div className="container ft-nav__inner">
            <Link to="/family-tech" className="ft-nav__logo">
              <span className="ft-nav__logo-icon" aria-hidden="true">🌿</span>
              <span className="ft-nav__logo-text">
                Bloom <span className="ft-nav__logo-sub">Family Tech</span>
              </span>
            </Link>
            <nav className="ft-nav__links" aria-label="Family Tech navigation">
              <Link to="/family-tech/build-your-bloom-school">Build Your Bloom School</Link>
              <Link to="/family-tech/intake" className="ft-nav__cta btn btn--primary btn--small">
                Get Your Forecast
              </Link>
            </nav>
          </div>
        </header>
      )}
      <div className="ft-layout__body">{children}</div>
    </div>
  );
}
