import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../data/navigation';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${menuOpen ? 'navbar--open' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-icon">🌿</span>
          <span className="navbar__logo-text">Bloom</span>
        </Link>

        <div className="navbar__links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link to="/#founding-family" className="navbar__cta btn btn--primary btn--small">
          Become a Founding Family
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
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
              className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link--active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/#founding-family"
            className="btn btn--primary"
            onClick={closeMenu}
          >
            Become a Founding Family
          </Link>
        </div>
      )}
    </nav>
  );
}
