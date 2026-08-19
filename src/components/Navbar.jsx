import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks, primaryProductCta } from '../data/navigation';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) => {
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.slice(1);
    }
    return location.pathname === path;
  };

  const productCta = primaryProductCta.external ? (
    <a
      href={primaryProductCta.href}
      className="navbar__cta btn btn--primary btn--small"
      target="_blank"
      rel="noopener noreferrer"
    >
      {primaryProductCta.label}
    </a>
  ) : (
    <Link to={primaryProductCta.href} className="navbar__cta btn btn--primary btn--small">
      {primaryProductCta.label}
    </Link>
  );

  return (
    <nav className={`navbar ${menuOpen ? 'navbar--open' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-icon">🌿</span>
          <span className="navbar__logo-text">Bloom Technologies</span>
        </Link>

        <div className="navbar__links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${isActive(link.path) ? 'navbar__link--active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {productCta}

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div className="navbar__mobile">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__mobile-link ${isActive(link.path) ? 'navbar__mobile-link--active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          {primaryProductCta.external ? (
            <a
              href={primaryProductCta.href}
              className="btn btn--primary"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              {primaryProductCta.label}
            </a>
          ) : (
            <Link to={primaryProductCta.href} className="btn btn--primary" onClick={closeMenu}>
              {primaryProductCta.label}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
